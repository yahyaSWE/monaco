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
  it("uses the confirmed custom domain when no origin override is configured", () => {
    assert.equal(resolveSiteUrl({}), "https://monacoclinic.se");
    assert.equal(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "  ",
        VERCEL_PROJECT_PRODUCTION_URL: "  ",
      }),
      "https://monacoclinic.se",
    );
    assert.equal(
      resolveSiteUrl({ VERCEL_URL: "temporary-preview.vercel.app" }),
      "https://monacoclinic.se",
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

  it("keeps the confirmed custom domain ahead of Vercel's project domain", () => {
    assert.equal(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: " ",
        VERCEL_PROJECT_PRODUCTION_URL: " monaco-project.vercel.app ",
      }),
      "https://monacoclinic.se",
    );
  });

  it("does not silently replace an invalid explicit origin with the default domain", () => {
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
      "https://monacoclinic.se",
    );
  });
});

describe("production indexing eligibility", () => {
  it("accepts normal public HTTPS domains, including subdomains and international domain names", () => {
    for (const origin of [
      "https://monacoclinic.se",
      "https://www.monacoclinic.se",
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
      "monacoclinic.se",
      "http://monacoclinic.se",
      "https://username@monacoclinic.se",
      "https://username:password@monacoclinic.se",
      "https://bad_domain.se",
      "https://-clinic.se",
      "https://clinic..se",
      "https://clinic.example.com..",
    ]) {
      assert.equal(isPublicProductionUrl(origin), false, String(origin));
    }
  });

  it("supports local metadata URLs while keeping development sites unindexable", () => {
    const localEnvironment = {
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NODE_ENV: "production",
    };

    assert.equal(resolveSiteUrl(localEnvironment), "http://localhost:3000");
    assert.equal(isSiteIndexable(localEnvironment), false);
    assert.equal(
      isSiteIndexable({
        NEXT_PUBLIC_SITE_URL: "https://127.0.0.1",
        NODE_ENV: "production",
      }),
      false,
    );
    assert.equal(
      isSiteIndexable({
        NEXT_PUBLIC_SITE_URL: "http://monacoclinic.se",
        NODE_ENV: "production",
      }),
      false,
    );
  });

  it("disables preview and development indexing even when a public production origin is configured", () => {
    const productionOrigin = {
      NEXT_PUBLIC_SITE_URL: "https://clinic.example.com",
      NODE_ENV: "production",
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
        NODE_ENV: "production",
      }),
      true,
    );
    assert.equal(isSiteIndexable({}), false);
  });

  it("indexes production on the confirmed domain while local development keeps the same canonical unindexed", () => {
    assert.equal(
      resolveSiteUrl({ NODE_ENV: "development" }),
      "https://monacoclinic.se",
    );
    assert.equal(isSiteIndexable({ NODE_ENV: "development" }), false);
    assert.equal(isSiteIndexable({ NODE_ENV: "test" }), false);
    assert.equal(isSiteIndexable({ NODE_ENV: "production" }), true);
    assert.equal(
      isSiteIndexable({ NODE_ENV: "production", VERCEL_ENV: "production" }),
      true,
    );
  });

  it("allows a server-side indexing opt-out without permitting an opt-in to bypass safeguards", () => {
    assert.equal(
      isSiteIndexable({
        NODE_ENV: "production",
        SITE_INDEXING_ENABLED: "false",
      }),
      false,
    );
    assert.equal(
      isSiteIndexable({
        NODE_ENV: "production",
        SITE_INDEXING_ENABLED: "true",
      }),
      true,
    );
    for (const environment of [
      { NODE_ENV: "development" },
      { NODE_ENV: "production", VERCEL_ENV: "preview" },
      { NODE_ENV: "production", VERCEL_ENV: "development" },
      { NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "http://localhost:3000" },
      { NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://clinic.test" },
      { NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "invalid" },
    ]) {
      assert.equal(
        isSiteIndexable({ ...environment, SITE_INDEXING_ENABLED: "true" }),
        false,
      );
    }
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
