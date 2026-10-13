import type { Metadata } from "next";
import { absoluteUrl, site, siteUrl } from "@/lib/site";
import { treatments } from "@/lib/content";
import { markdownPath } from "@/lib/discovery";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: `${title} | ${site.name}` },
    description,
    alternates: siteUrl
      ? {
          canonical: absoluteUrl(path),
          types: { "text/markdown": absoluteUrl(markdownPath(path)) },
        }
      : undefined,
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: siteUrl ? absoluteUrl(path) : undefined,
      siteName: site.name,
      locale: "sv_SE",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Monaco Clinic – hudvård och skönhet i Eskilstuna",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": absoluteUrl("/#clinic"),
    name: site.name,
    legalName: site.legalName,
    description:
      "Hudvård och skönhetsbehandlingar i Eskilstuna: laserhårborttagning, microblading, läppigmentering, hydrofacial och microneedling.",
    url: absoluteUrl(),
    image: absoluteUrl("/images/hero.jpg"),
    telephone: "+46735771991",
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressCountry: "SE",
    },
    geo: { "@type": "GeoCoordinates", latitude: 59.3928, longitude: 16.5468 },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [site.instagramUrl, site.bookingUrl],
    hasMap: site.mapsUrl,
    areaServed: { "@type": "City", name: site.city },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Behandlingar på Monaco Clinic i Eskilstuna",
      itemListElement: treatments.map((treatment) => ({
        "@type": "Offer",
        url: site.bookingUrl,
        itemOffered: {
          "@type": "Service",
          "@id": absoluteUrl(`/behandlingar/${treatment.slug}#service`),
          name: treatment.name,
          url: absoluteUrl(`/behandlingar/${treatment.slug}`),
          provider: { "@id": absoluteUrl("/#clinic") },
        },
      })),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl(),
    name: site.name,
    inLanguage: "sv-SE",
    publisher: { "@id": absoluteUrl("/#clinic") },
  };
}

export function webPageSchema(
  path: string,
  name: string,
  description: string,
  type = "WebPage",
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "sv-SE",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#clinic") },
    ...(path.startsWith("/behandlingar/")
      ? { mainEntity: { "@id": absoluteUrl(`${path}#service`) } }
      : {}),
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
