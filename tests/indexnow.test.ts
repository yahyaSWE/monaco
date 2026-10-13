import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertPageIndexable, assertRobotsAllows, createIndexNowPayload, parseSitemapUrls, runIndexNow, validateOrigin } from "../scripts/submit-indexnow.mjs";

const origin = "https://monacoclinic.se";
const key = "a123456789abcdef0123456789abcdef";
const urls = [`${origin}/`, `${origin}/behandlingar`];
const sitemap = (locations: string[]) => `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locations.map((url) => `<url><loc>${url}</loc><changefreq>monthly</changefreq></url>`).join("")}</urlset>`;
const page = (url: string, robots = "index, follow") => `<html><head><meta name="robots" content="${robots}"><link rel="canonical" href="${url}"></head><body>Monaco Clinic i Eskilstuna</body></html>`;
const readFixture = async (path: string) => {
  if (path.endsWith("indexnow-key.txt")) return `${key}\n`;
  if (path.endsWith("sitemap.xml.body")) return sitemap(urls);
  throw new Error("Unknown fixture");
};

describe("IndexNow payload validation", () => {
  it("parses canonical sitemap URLs and deduplicates entries without inventing routes", () => {
    assert.deepEqual(parseSitemapUrls(sitemap([...urls, urls[0]]), origin), urls);
    assert.deepEqual(parseSitemapUrls(sitemap([`${origin}&#47;`]), origin), [`${origin}/`]);
    assert.deepEqual(createIndexNowPayload(origin, key, urls), {
      host: "monacoclinic.se", key, keyLocation: `${origin}/indexnow-key.txt`, urlList: urls,
    });
    const withImage = `<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"><url><loc>${urls[0]}</loc><image:image><image:loc>${origin}/images/hero.jpg</image:loc></image:image><priority>1</priority></url></urlset>`;
    assert.deepEqual(parseSitemapUrls(withImage, origin), [urls[0]]);
  });

  it("rejects local/IP/reserved hosts, credentials and non-origin configuration", () => {
    for (const value of ["invalid", "http://monacoclinic.se", "https://localhost", "https://a.local", "https://a.test", "https://127.0.0.1", "https://0x7f000001", "https://[::1]", "https://user:password@monacoclinic.se", `${origin}/behandlingar`, `${origin}?tracking=1`, `${origin}:8443`, "https://a..se", "https://-a.se", "https://monacoclinic.se.", "https://mona\tcoclinic.se"]) {
      assert.throws(() => validateOrigin(value));
    }
    assert.equal(validateOrigin(origin), origin);
  });

  it("refuses mixed-origin, noncanonical and malformed sitemap URLs", () => {
    for (const url of ["https://attacker.se/", "https://www.monacoclinic.se/", "http://monacoclinic.se/", `${origin}/?campaign=test`, `${origin}/#contact`, "https://user@monacoclinic.se/", `${origin}/a/../behandlingar`, "https://MONACOCLINIC.se/", `${origin}/a b`]) {
      assert.throws(() => parseSitemapUrls(sitemap([url]), origin));
    }
    for (const xml of ["", "<html>Not a sitemap</html>", "<sitemapindex></sitemapindex>", sitemap([]), "<urlset><url><loc>https://monacoclinic.se/</loc></urlset>", "<urlset><url><loc>https://monacoclinic.se/</loc><incomplete></url></urlset>", "<urlset><url><loc>https://monacoclinic.se/</loc><loc>https://monacoclinic.se/behandlingar</loc></url></urlset>", '<!DOCTYPE urlset [<!ENTITY external SYSTEM "file:///private">]><urlset></urlset>', sitemap([`${origin}/&unknown;`]), "a".repeat(2_000_001)]) {
      assert.throws(() => parseSitemapUrls(xml, origin));
    }
  });

  it("rejects invalid keys and empty or oversized submission lists", () => {
    for (const invalidKey of ["", "short", "a".repeat(129), "key_with_underscore", "key with spaces"]) {
      assert.throws(() => createIndexNowPayload(origin, invalidKey, urls));
    }
    assert.throws(() => createIndexNowPayload(origin, key, []));
    assert.throws(() => createIndexNowPayload(origin, key, Array(10_001).fill(urls[0])));
  });
});

describe("IndexNow crawler and page preflight", () => {
  it("requires crawlable submitted paths including explicit search crawler policies", () => {
    assert.doesNotThrow(() => assertRobotsAllows("User-agent: *\nAllow: /\n", urls));
    assert.doesNotThrow(() => assertRobotsAllows("User-agent: *\nDisallow: /\nAllow: /behandlingar\n", [urls[1]]));
    for (const robots of ["", "User-agent: *\nDisallow: /\n", "User-agent: *\nDisallow: /behand*\n", "User-agent: *\nAllow: /\nUser-agent: Bingbot\nDisallow: /\n"]) {
      assert.throws(() => assertRobotsAllows(robots, urls));
    }
  });

  it("requires exact page canonicals and rejects noindex in headers or metadata", () => {
    assert.doesNotThrow(() => assertPageIndexable(page(urls[0]), urls[0]));
    assert.doesNotThrow(() => assertPageIndexable(`<head><link href='${urls[0]}' rel='canonical'></head>`, urls[0]));
    for (const html of [page(urls[1]), page(urls[0], "noindex, follow"), page(urls[0], "none"), "<html><body>No head</body></html>", "<head></head>", `<head><link rel="canonical" href="${urls[0]}"><link rel="canonical" href="${urls[0]}"></head>`]) {
      assert.throws(() => assertPageIndexable(html, urls[0]));
    }
    assert.throws(() => assertPageIndexable(page(urls[0]), urls[0], "bingbot: noindex"));
  });

  it("accepts Next.js root canonical slash equivalence while rejecting unsafe canonicals", () => {
    assert.doesNotThrow(() => assertPageIndexable(page(origin), `${origin}/`));
    assert.doesNotThrow(() => assertPageIndexable(page(`${origin}/`), origin));
    for (const canonical of ["/", "javascript:alert(1)", "https://attacker.se/", `${origin}/?tracking=1`, `${origin}/#contact`, "https://user:password@monacoclinic.se/", "https://mona\tcoclinic.se/"]) {
      assert.throws(() => assertPageIndexable(page(canonical), `${origin}/`));
    }
  });
});

describe("manual IndexNow command", () => {
  it("makes zero HTTP requests in dry-run and reads the built sitemap", async () => {
    let networkCalls = 0;
    const output: string[] = [];
    const result = await runIndexNow({
      args: ["--dry-run"], env: {}, readFileImpl: readFixture, log: (value: string) => output.push(value),
      fetchImpl: async () => { networkCalls++; throw new Error("Unexpected network"); },
    });
    assert.equal(networkCalls, 0);
    assert.equal(result.mode, "dry-run");
    assert.deepEqual(result.payload.urlList, urls);
    assert.equal(JSON.parse(output[0]).keyLocation, `${origin}/indexnow-key.txt`);
    assert.match(output[1], /not been verified/);
  });

  it("rejects unknown modes, missing builds and preview environments before network access", async () => {
    let calls = 0;
    const fetchImpl: typeof fetch = async () => { calls++; throw new Error("Unexpected request"); };
    for (const args of [["--unknown"], ["--dry-run", "--dry-run"]]) {
      await assert.rejects(runIndexNow({ args, env: {}, fetchImpl, readFileImpl: readFixture }), /Usage/);
    }
    for (const env of [{ SITE_INDEXING_ENABLED: "false" }, { VERCEL_ENV: "preview" }, { VERCEL_ENV: "development" }, { NODE_ENV: "development" }, { NODE_ENV: "test" }]) {
      await assert.rejects(runIndexNow({ env, fetchImpl, readFileImpl: readFixture }), /disabled/);
    }
    await assert.rejects(runIndexNow({ args: ["--dry-run"], env: {}, fetchImpl, readFileImpl: async (path: string) => {
      if (path.endsWith("indexnow-key.txt")) return key;
      throw new Error("No build");
    } }), /Build the production site/);
    assert.equal(calls, 0);
  });

  it("submits once after every live preflight passes and reports receipts accurately", async () => {
    for (const status of [200, 202]) {
      const calls: Array<{ url: string; method: string; body?: BodyInit | null }> = [];
      const output: string[] = [];
      const result = await runIndexNow({ env: {}, readFileImpl: readFixture, log: (value: string) => output.push(value), fetchImpl: async (input, options) => {
        const url = String(input);
        calls.push({ url, method: options?.method ?? "GET", body: options?.body });
        assert.equal(options?.redirect, "error");
        assert.ok(options?.signal instanceof AbortSignal);
        if (url === `${origin}/indexnow-key.txt`) return new Response(`${key}\n`);
        if (url === `${origin}/robots.txt`) return new Response("User-agent: *\nAllow: /\n");
        if (url === `${origin}/sitemap.xml`) return new Response(sitemap(urls));
        if (urls.includes(url)) return new Response(page(url));
        if (url === "https://api.indexnow.org/indexnow") return new Response(null, { status });
        throw new Error("Unknown request");
      } });
      assert.equal(result.mode, "submitted");
      assert.equal(result.status, status);
      assert.equal(calls.length, 6);
      assert.equal(calls.at(-1)?.method, "POST");
      assert.deepEqual(JSON.parse(String(calls.at(-1)?.body)), createIndexNowPayload(origin, key, urls));
      assert.match(output[0], /does not confirm indexing or ranking/);
      if (status === 202) assert.match(output[0], /validation pending/);
    }
  });

  it("never submits when the hosted key, robots, sitemap, page or transport fails", async () => {
    for (const failure of ["key", "robots", "sitemap", "page", "header", "transport", "oversized"]) {
      let submissions = 0;
      await assert.rejects(runIndexNow({ env: {}, readFileImpl: readFixture, log: () => {}, fetchImpl: async (input, options) => {
        const url = String(input);
        if (options?.method === "POST") { submissions++; return new Response(null, { status: 200 }); }
        if (failure === "transport") throw new DOMException("Simulated timeout", "TimeoutError");
        if (url === `${origin}/indexnow-key.txt`) return new Response(failure === "key" ? "different-key" : key);
        if (url === `${origin}/robots.txt`) return new Response(`User-agent: *\n${failure === "robots" ? "Disallow" : "Allow"}: /\n`);
        if (url === `${origin}/sitemap.xml`) return new Response(failure === "sitemap" ? sitemap(["https://attacker.se/"]) : sitemap(urls));
        return new Response(page(url, failure === "page" ? "noindex" : "index"), {
          headers: failure === "header" ? { "X-Robots-Tag": "noindex" } : failure === "oversized" ? { "Content-Length": "2000001" } : {},
        });
      } }));
      assert.equal(submissions, 0, failure);
    }
  });
});
