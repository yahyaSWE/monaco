import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTreatment, treatments } from "@/lib/content";
import { serializeJsonLd } from "@/lib/seo";
import {
  isPublicProductionUrl,
  isSiteIndexable,
  resolveSiteUrl,
} from "@/lib/site";

describe("production origin resolution", () => {
  it("leaves canonical URLs unconfigured when no production origin is available", () => {
    assert.equal(resolveSiteUrl({}), null);
    assert.equal(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "  ",
        VERCEL_PROJECT_PRODUCTION_URL: "  ",
      }),
      null,
    );
    assert.equal(
      resolveSiteUrl({ VERCEL_URL: "temporary-preview.vercel.app" }),
      null,
    );
  });

  it("prefers the explicit origin and removes page-specific URL components", () => {
    assert.equal(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL:
          " https://Clinic.Example:443/behandlingar/?campaign=test#kontakt ",
        VERCEL_PROJECT_PRODUCTION_URL: "other-project.vercel.app",
      }),
      "https://clinic.example",
    );
  });

  it("uses the Vercel production domain with HTTPS when the explicit origin is empty", () => {
    assert.equal(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: " ",
        VERCEL_PROJECT_PRODUCTION_URL: " monaco-project.vercel.app ",
      }),
      "https://monaco-project.vercel.app",
    );
  });

  it("does not silently replace an invalid explicit origin with another domain", () => {
    assert.equal(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "invalid",
        VERCEL_PROJECT_PRODUCTION_URL: "different-project.vercel.app",
      }),
      null,
    );
  });

  it("rejects malformed, relative, non-web and credential-bearing origins", () => {
    const invalidOrigins = [
      "monaco.example",
      "/behandlingar",
      "https://",
      "https://exa mple.com",
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "file:///C:/dev/monaco",
      "ftp://clinic.example",
      "https://username@clinic.example",
      "https://username:password@clinic.example",
    ];

    for (const origin of invalidOrigins) {
      assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: origin }), null);
    }

    assert.equal(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "user@clinic.example" }),
      null,
    );
  });
});

describe("production indexing eligibility", () => {
  it("accepts normal public HTTPS domains, including subdomains and international domain names", () => {
    for (const origin of [
      "https://monacoklinik.se",
      "https://www.monacoklinik.se",
      "https://monaco-project.vercel.app",
      "https://clinic.example.com",
      "https://www.example.com.",
      "https://räksmörgås.se",
    ]) {
      assert.equal(isPublicProductionUrl(origin), true, origin);
    }
  });

  it("keeps local and reserved domain names out of the index, including trailing-dot variants", () => {
    for (const origin of [
      "https://localhost",
      "https://localhost:3000",
      "https://monaco.localhost",
      "https://LOCALHOST.",
      "https://clinic.localhost.",
      "https://clinic.local",
      "https://clinic.test",
      "https://clinic.invalid",
      "https://clinic.example",
      "https://test",
      "https://local",
      "https://internal-server",
    ]) {
      assert.equal(isPublicProductionUrl(origin), false, origin);
    }
  });

  it("rejects IPv4 and IPv6 literals, including URL-normalized alternative IP representations", () => {
    for (const origin of [
      "https://127.0.0.1",
      "https://192.168.1.10",
      "https://8.8.8.8",
      "https://127.1",
      "https://2130706433",
      "https://0x7f000001",
      "https://[::1]",
      "https://[2001:db8::1]",
      "https://[::ffff:127.0.0.1]",
    ]) {
      assert.equal(isPublicProductionUrl(origin), false, origin);
    }
  });

  it("requires a valid HTTPS domain without embedded credentials", () => {
    for (const origin of [
      undefined,
      null,
      "",
      "monacoklinik.se",
      "http://monacoklinik.se",
      "https://username@monacoklinik.se",
      "https://username:password@monacoklinik.se",
      "https://bad_domain.se",
      "https://-clinic.se",
      "https://clinic..se",
      "https://clinic.example.com..",
    ]) {
      assert.equal(isPublicProductionUrl(origin), false, String(origin));
    }
  });

  it("supports local metadata URLs while keeping development sites unindexable", () => {
    const localEnvironment = { NEXT_PUBLIC_SITE_URL: "http://localhost:3000" };

    assert.equal(resolveSiteUrl(localEnvironment), "http://localhost:3000");
    assert.equal(isSiteIndexable(localEnvironment), false);
    assert.equal(
      isSiteIndexable({ NEXT_PUBLIC_SITE_URL: "https://127.0.0.1" }),
      false,
    );
    assert.equal(
      isSiteIndexable({ NEXT_PUBLIC_SITE_URL: "http://monacoklinik.se" }),
      false,
    );
  });

  it("disables preview and development indexing even when a public production origin is configured", () => {
    const productionOrigin = {
      NEXT_PUBLIC_SITE_URL: "https://clinic.example.com",
    };

    assert.equal(isSiteIndexable(productionOrigin), true);
    assert.equal(
      isSiteIndexable({ ...productionOrigin, VERCEL_ENV: "production" }),
      true,
    );
    assert.equal(
      isSiteIndexable({ ...productionOrigin, VERCEL_ENV: "preview" }),
      false,
    );
    assert.equal(
      isSiteIndexable({ ...productionOrigin, VERCEL_ENV: "development" }),
      false,
    );
    assert.equal(
      isSiteIndexable({
        VERCEL_PROJECT_PRODUCTION_URL: "monaco-project.vercel.app",
        VERCEL_ENV: "production",
      }),
      true,
    );
    assert.equal(isSiteIndexable({}), false);
  });
});

describe("JSON-LD embedded in HTML", () => {
  it("prevents script termination while preserving the structured data", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: '</script><script>alert("unexpected script")</script>',
          acceptedAnswer: {
            "@type": "Answer",
            text: "</ScRiPt><img src=x onerror=alert(1)> & Hällstugatan – vård i Eskilstuna",
          },
        },
      ],
    };

    const serialized = serializeJsonLd(data);

    assert.equal(serialized.includes("<"), false);
    assert.equal(/<\/script\s*>/i.test(serialized), false);
    assert.deepEqual(JSON.parse(serialized), data);
  });

  it("preserves literal backslashes and valid Swedish text without double encoding", () => {
    const data = {
      name: "Läppigmentering & hårborttagning",
      literal: String.raw`\u003c/script>`,
      description: "Färg, form och lyster.\nVälkommen till Monaco Clinic.",
    };

    assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
  });
});

describe("treatment routes and internal links", () => {
  it("provides unique, URL-safe local treatment routes", () => {
    const slugs = treatments.map((treatment) => treatment.slug);

    assert.ok(slugs.length > 0);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const slug of slugs) {
      assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*-eskilstuna$/);
    }
  });

  it("resolves known routes and leaves unknown routes to the page's 404 handling", () => {
    for (const treatment of treatments) {
      assert.equal(getTreatment(treatment.slug), treatment);
    }

    assert.equal(getTreatment("saknad-behandling-eskilstuna"), undefined);
    assert.equal(getTreatment(""), undefined);
  });

  it("links related treatments only to distinct, existing pages", () => {
    const slugs = new Set(treatments.map((treatment) => treatment.slug));

    for (const treatment of treatments) {
      assert.equal(new Set(treatment.related).size, treatment.related.length);
      for (const relatedSlug of treatment.related) {
        assert.notEqual(relatedSlug, treatment.slug);
        assert.ok(
          slugs.has(relatedSlug),
          `${treatment.slug} links to missing route ${relatedSlug}`,
        );
      }
    }
  });
});
