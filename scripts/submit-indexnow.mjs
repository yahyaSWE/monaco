import { readFile } from "node:fs/promises";
import { isIP } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const defaultOrigin = "https://monacoclinic.se";
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const maximumUrls = 10_000;
const maximumBytes = 2_000_000;

export function validateOrigin(value) {
  if (typeof value !== "string" || /[\s\u0000-\u001f\u007f]/.test(value)) throw new Error("A valid public HTTPS production origin is required.");
  let url;
  try { url = new URL(value); } catch { throw new Error("A valid public HTTPS production origin is required."); }
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  const labels = host.split(".");
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.pathname !== "/" || url.search || url.hash ||
      isIP(host.replace(/^\[|\]$/g, "")) || /(?:^|\.)(?:localhost|local|test|invalid|example)$/.test(host) ||
      url.hostname.endsWith(".") || host.length > 253 || labels.length < 2 || !/[a-z]/.test(labels.at(-1)) ||
      !labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
    throw new Error("A public HTTPS origin without credentials, port, path or query is required.");
  }
  return url.origin;
}

function canonicalUrl(value, origin, normalize = false) {
  if (typeof value !== "string" || value.length > 2048 || /[\s\u0000-\u001f\u007f?#]/.test(value)) {
    throw new Error("Sitemap URLs must be canonical absolute URLs without queries or fragments.");
  }
  let url;
  try { url = new URL(value); } catch { throw new Error("The sitemap contains an invalid URL."); }
  if (url.origin !== origin || url.username || url.password || (!normalize && url.href !== value)) {
    throw new Error("Every sitemap URL must use the exact canonical production origin and URL spelling.");
  }
  return url.href;
}

function xmlText(value) {
  if (/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/i.test(value)) throw new Error("Invalid XML entity in sitemap.");
  return value.replace(/&(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi, (_, entity) => {
    const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
    if (named[entity]) return named[entity];
    const code = Number.parseInt(entity.slice(entity.startsWith("#x") ? 2 : 1), entity.startsWith("#x") ? 16 : 10);
    if (!Number.isInteger(code) || code < 32 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff) || code === 0xfffe || code === 0xffff) {
      throw new Error("Invalid XML character in sitemap.");
    }
    return String.fromCodePoint(code);
  });
}

/** Parse a URL-set sitemap conservatively; nested indexes/DTDs are not submission sources. */
export function parseSitemapUrls(xml, origin) {
  origin = validateOrigin(origin);
  if (typeof xml !== "string" || Buffer.byteLength(xml) > maximumBytes || /<!DOCTYPE|<!ENTITY|<!\[CDATA\[/i.test(xml)) {
    throw new Error("Sitemap is oversized or uses unsupported XML constructs.");
  }
  const clean = xml.replace(/^\uFEFF/, "").replace(/<\?xml\s[\s\S]*?\?>/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  const root = /^<urlset\b[^>]*>([\s\S]*)<\/urlset>\s*$/.exec(clean);
  if (!root) throw new Error("Expected a URL-set sitemap, not a sitemap index or HTML response.");
  const entries = [...root[1].matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/g)];
  if (!entries.length || entries.length > maximumUrls || root[1].replace(/<url\b[^>]*>[\s\S]*?<\/url>/g, "").trim()) {
    throw new Error("Sitemap must contain between 1 and 10,000 well-formed URL entries.");
  }
  const urls = entries.map((entry) => {
    // Image sitemap extensions describe assets, not primary pages to submit.
    const primary = entry[1].replace(/<image:image\b[^>]*>([\s\S]*?)<\/image:image>/g, (_, image) => {
      const imageFields = [...image.matchAll(/<image:(loc|caption|title|geo_location|license)\b[^>]*>([^<>]*)<\/image:\1>/g)];
      if (imageFields.filter((field) => field[1] === "loc").length !== 1 ||
          image.replace(/<image:(loc|caption|title|geo_location|license)\b[^>]*>[^<>]*<\/image:\1>/g, "").trim()) {
        throw new Error("Malformed image sitemap extension.");
      }
      return "";
    });
    // Accept the standard scalar URL fields and reject incomplete/nested markup.
    const fields = [...primary.matchAll(/<(loc|lastmod|changefreq|priority)\b[^>]*>([^<>]*)<\/\1>/g)];
    if (primary.replace(/<(loc|lastmod|changefreq|priority)\b[^>]*>[^<>]*<\/\1>/g, "").trim() ||
        new Set(fields.map((field) => field[1])).size !== fields.length) {
      throw new Error("Sitemap URL entries must contain well-formed standard scalar fields.");
    }
    const locations = [...primary.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/g)];
    if (locations.length !== 1 || /[<>]/.test(locations[0][1])) throw new Error("Each sitemap entry requires exactly one plain-text loc.");
    return canonicalUrl(xmlText(locations[0][1].trim()), origin);
  });
  return [...new Set(urls)];
}

export function createIndexNowPayload(origin, key, urls) {
  origin = validateOrigin(origin);
  if (typeof key !== "string" || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("Invalid IndexNow verification key.");
  if (!Array.isArray(urls) || !urls.length || urls.length > maximumUrls) throw new Error("Submit between 1 and 10,000 sitemap URLs.");
  return {
    host: new URL(origin).hostname,
    key,
    keyLocation: `${origin}/indexnow-key.txt`,
    urlList: [...new Set(urls.map((url) => canonicalUrl(url, origin)))],
  };
}

export function assertRobotsAllows(robots, urls) {
  const groups = [];
  let group = { agents: [], rules: [] };
  for (const line of robots.split(/\r?\n/)) {
    const match = /^\s*([\w-]+)\s*:\s*(.*?)\s*$/.exec(line.replace(/#.*$/, ""));
    if (!match) continue;
    const field = match[1].toLowerCase();
    const value = match[2];
    if (field === "user-agent") {
      if (group.rules.length) { groups.push(group); group = { agents: [], rules: [] }; }
      group.agents.push(value.toLowerCase());
    } else if (["allow", "disallow"].includes(field) && group.agents.length) {
      group.rules.push({ allow: field === "allow", path: value });
    }
  }
  if (group.agents.length) groups.push(group);
  if (!groups.some((item) => item.agents.includes("*"))) throw new Error("robots.txt needs an explicit wildcard crawler policy.");
  const relevant = groups.filter((item) => item.agents.some((agent) => ["*", "bingbot", "googlebot", "oai-searchbot", "chatgpt-user"].includes(agent)));
  for (const url of urls) {
    const path = new URL(url).pathname;
    for (const item of relevant) {
      const matches = item.rules.filter((rule) => {
        if (!rule.path) return false;
        const end = rule.path.endsWith("$");
        const pattern = (end ? rule.path.slice(0, -1) : rule.path).split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
        return new RegExp(`^${pattern}${end ? "$" : ""}`).test(path);
      }).sort((a, b) => b.path.length - a.path.length || Number(b.allow) - Number(a.allow));
      if (matches[0] && !matches[0].allow) throw new Error("robots.txt blocks a submitted page for a search crawler.");
    }
  }
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)) {
    result[match[1].toLowerCase()] = xmlText(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

export function assertPageIndexable(html, url, xRobotsTag = "") {
  if (/\b(?:noindex|none)\b/i.test(xRobotsTag)) throw new Error("A submitted page sends a noindex HTTP header.");
  const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(html)?.[1];
  if (!head) throw new Error("A submitted page does not return an HTML head.");
  for (const tag of head.matchAll(/<meta\b[^>]*>/gi)) {
    const data = attributes(tag[0]);
    if (["robots", "googlebot", "bingbot", "oai-searchbot"].includes(data.name?.toLowerCase()) && /\b(?:noindex|none)\b/i.test(data.content ?? "")) {
      throw new Error("A submitted page sends a noindex robots meta tag.");
    }
  }
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map((tag) => attributes(tag[0])).filter((data) => data.rel?.toLowerCase().split(/\s+/).includes("canonical"));
  if (canonicals.length !== 1) throw new Error("A submitted page lacks its exact canonical URL.");
  const expected = new URL(url);
  // Next.js may serialize the root canonical without '/'; compare absolute normalized URLs.
  if (canonicalUrl(canonicals[0].href, expected.origin, true) !== expected.href) throw new Error("A submitted page lacks its exact canonical URL.");
}

async function fetchText(url, fetchImpl) {
  let response;
  try { response = await fetchImpl(url, { redirect: "error", signal: AbortSignal.timeout(10_000), headers: { Accept: "text/plain, application/xml, text/html" } }); }
  catch { throw new Error(`Preflight failed or timed out for ${new URL(url).pathname}.`); }
  if (!response.ok) throw new Error(`Preflight returned HTTP ${response.status} for ${new URL(url).pathname}.`);
  if (Number(response.headers.get("content-length") || 0) > maximumBytes) throw new Error("Preflight response is oversized.");
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Preflight returned an empty response body.");
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximumBytes) { await reader.cancel(); throw new Error("Preflight response is oversized."); }
      chunks.push(Buffer.from(value));
    }
  } catch { throw new Error("Preflight response was oversized, interrupted or timed out."); }
  return { text: Buffer.concat(chunks).toString("utf8"), xRobotsTag: response.headers.get("x-robots-tag") ?? "" };
}

/**
 * Manual command only. --dry-run reads the built sitemap and never sends HTTP requests.
 * @param {{ args?: string[], env?: Record<string, string | undefined>, rootDir?: string, fetchImpl?: typeof fetch, readFileImpl?: (path: string) => Promise<string>, log?: (value: string) => void }} [options]
 */
export async function runIndexNow(options = {}) {
  const { args = [], env = process.env, rootDir = repositoryRoot, fetchImpl = globalThis.fetch, readFileImpl = (path) => readFile(path, "utf8"), log = console.log } = options;
  if (args.some((arg) => arg !== "--dry-run") || args.length > 1) throw new Error("Usage: npm run indexnow [-- --dry-run]");
  if (env.SITE_INDEXING_ENABLED === "false" || ["preview", "development"].includes(env.VERCEL_ENV) || ["development", "test"].includes(env.NODE_ENV)) {
    throw new Error("IndexNow is disabled for non-indexable or preview environments.");
  }
  const origin = validateOrigin(env.NEXT_PUBLIC_SITE_URL?.trim() || defaultOrigin);
  let key;
  try { key = (await readFileImpl(resolve(rootDir, "public/indexnow-key.txt"))).trim(); }
  catch { throw new Error("The public IndexNow verification key file is missing."); }
  // Validate the key before any network requests.
  createIndexNowPayload(origin, key, [`${origin}/`]);
  if (args.includes("--dry-run")) {
    let xml;
    try { xml = await readFileImpl(resolve(rootDir, ".next/server/app/sitemap.xml.body")); }
    catch { throw new Error("Build the production site before dry-run: npm run build."); }
    const payload = createIndexNowPayload(origin, key, parseSitemapUrls(xml, origin));
    log(JSON.stringify(payload, null, 2));
    log("Dry run: no network requests made. Live deployment has not been verified.");
    return { mode: "dry-run", payload };
  }

  const hostedKey = await fetchText(`${origin}/indexnow-key.txt`, fetchImpl);
  if (hostedKey.text.trim() !== key) throw new Error("The production key file does not exactly match the local verification key.");
  const robots = await fetchText(`${origin}/robots.txt`, fetchImpl);
  const sitemap = await fetchText(`${origin}/sitemap.xml`, fetchImpl);
  const payload = createIndexNowPayload(origin, key, parseSitemapUrls(sitemap.text, origin));
  assertRobotsAllows(robots.text, payload.urlList);
  // Bound parallelism even when a sitemap becomes substantially larger.
  for (let offset = 0; offset < payload.urlList.length; offset += 3) {
    await Promise.all(payload.urlList.slice(offset, offset + 3).map(async (url) => {
      const page = await fetchText(url, fetchImpl);
      assertPageIndexable(page.text, url, page.xRobotsTag);
    }));
  }
  let response;
  try {
    response = await fetchImpl("https://api.indexnow.org/indexnow", {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(10_000),
      headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(payload),
    });
  } catch { throw new Error("IndexNow submission failed or timed out; no successful receipt was verified."); }
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned HTTP ${response.status}; submission was not confirmed.`);
  log(`IndexNow HTTP ${response.status}: ${payload.urlList.length} URLs received${response.status === 202 ? "; key validation pending" : ""}. This does not confirm indexing or ranking.`);
  return { mode: "submitted", status: response.status, payload };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runIndexNow({ args: process.argv.slice(2) }).catch((error) => {
    console.error(`IndexNow: ${error.message}`);
    process.exitCode = 1;
  });
}
