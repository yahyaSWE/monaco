import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFile } from "node:fs/promises";
import { treatments } from "@/lib/content";
import {
  discoveryPages,
  discoveryResponse,
  getLlmFullText,
  getLlmIndex,
  getMarkdownPage,
  markdownPageResponse,
  markdownPath,
} from "@/lib/discovery";
import { absoluteUrl, isIndexable, site } from "@/lib/site";

describe("Markdown discovery content", () => {
  it("covers each public page once, with a resolvable Markdown version", () => {
    assert.equal(discoveryPages.length, 10);
    assert.equal(new Set(discoveryPages.map((page) => page.path)).size, 10);
    assert.equal(markdownPath("/"), "/index.md");
    assert.equal(markdownPath("/kontakt"), "/kontakt/index.md");
    for (const page of discoveryPages) {
      assert.equal(getMarkdownPage(page.path)?.path, page.path);
      assert.ok(
        getMarkdownPage(page.path)?.body.startsWith(`# ${page.title}\n`),
      );
    }
    for (const path of [
      "/missing",
      "/behandlingar/missing",
      "/kontakt/index.md",
      "/../kontakt",
    ]) {
      assert.equal(getMarkdownPage(path), undefined);
    }
  });

  it("links the index to real Markdown pages on the canonical origin", () => {
    const index = getLlmIndex();
    assert.ok(index.startsWith(`# ${site.name}\n\n> `));
    const pageUrls = new Set(
      discoveryPages.map((page) => absoluteUrl(markdownPath(page.path))),
    );
    const links = [...index.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(
      (match) => match[1],
    );
    for (const url of pageUrls) assert.ok(links.includes(url), url);
    for (const url of links.filter(
      (link) => new URL(link).origin === new URL(absoluteUrl()).origin,
    )) {
      assert.ok(
        pageUrls.has(url) || url === absoluteUrl("/llms-full.txt"),
        url,
      );
    }
  });

  it("preserves treatment prose and every visible FAQ exactly", async () => {
    const htmlSource = await readFile(
      new URL("../src/app/behandlingar/[slug]/page.tsx", import.meta.url),
      "utf8",
    );
    assert.ok(htmlSource.includes("<Faq items={treatment.faqs}"));
    for (const treatment of treatments) {
      const page = getMarkdownPage(`/behandlingar/${treatment.slug}`);
      assert.ok(page);
      assert.ok(page.body.includes(treatment.description));
      for (const text of treatment.intro) assert.ok(page.body.includes(text));
      for (const detail of treatment.details) {
        assert.ok(page.body.includes(`### ${detail.title}\n\n${detail.text}`));
      }
      for (const faq of treatment.faqs) {
        assert.ok(page.body.includes(`### ${faq.question}\n\n${faq.answer}`));
      }
      for (const slug of treatment.related) {
        const path = `/behandlingar/${slug}`;
        assert.ok(getMarkdownPage(path));
        assert.ok(page.body.includes(absoluteUrl(markdownPath(path))));
      }
    }
  });

  it("contains all page content and business facts without unverified claims", () => {
    const full = getLlmFullText();
    for (const page of discoveryPages) {
      assert.ok(full.includes(`## ${page.title}\n`));
      assert.ok(full.includes(`[Webbsida](${absoluteUrl(page.path)})`));
    }
    for (const treatment of treatments) {
      assert.ok(full.includes(treatment.intro[0]));
      for (const faq of treatment.faqs) assert.ok(full.includes(faq.answer));
    }
    for (const fact of [
      site.name,
      site.street,
      site.postalCode,
      site.city,
      site.phone,
      site.email,
      site.bookingUrl,
      "Sama Kadhim",
    ]) {
      assert.ok(full.includes(fact), fact);
    }
    assert.doesNotMatch(
      full,
      /Monaco Klinik|8 000|4,9|certifierade|legitimerad|fillers|botox|garanterat|ignore previous|system prompt/i,
    );
    assert.doesNotMatch(
      full,
      /champagne-gold-glow|lovable\.app|localhost|127\.0\.0\.1/,
    );
    assert.ok(
      full.length < 40_000,
      "Full text remains a curated, compact document",
    );
  });
});

describe("discovery HTTP responses", () => {
  it("serves Swedish UTF-8 Markdown with canonical and index relations", async () => {
    const response = markdownPageResponse("/kontakt");
    assert.equal(response.status, 200);
    assert.equal(
      response.headers.get("content-type"),
      "text/markdown; charset=utf-8",
    );
    assert.equal(response.headers.get("content-language"), "sv");
    assert.equal(
      response.headers.get("link"),
      `<${absoluteUrl("/kontakt")}>; rel="canonical", </llms.txt>; rel="describedby"`,
    );
    assert.match(response.headers.get("cache-control") ?? "", /s-maxage=3600/);
    assert.equal(
      response.headers.get("x-robots-tag"),
      isIndexable ? null : "noindex, nofollow",
    );
    assert.equal(await response.text(), getMarkdownPage("/kontakt")?.body);
  });

  it("returns a noncacheable 404 for an unknown treatment instead of a fallback page", async () => {
    const response = markdownPageResponse("/behandlingar/fillers-eskilstuna");
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    assert.ok(!(await response.text()).includes(site.street));
  });

  it("uses plain text for the llms resources and exposes no private server configuration", async () => {
    const response = discoveryResponse(getLlmIndex(), "text/plain");
    assert.equal(
      response.headers.get("content-type"),
      "text/plain; charset=utf-8",
    );
    assert.doesNotMatch(
      await response.text(),
      /INSTAGRAM_ACCESS_TOKEN|INSTAGRAM_USER_ID|process\.env|Bearer /,
    );
  });
});
