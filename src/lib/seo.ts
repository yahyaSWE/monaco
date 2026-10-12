import type { Metadata } from "next";
import { absoluteUrl, site, siteUrl } from "@/lib/site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: `${title} | ${site.name}` },
    description,
    alternates: siteUrl ? { canonical: absoluteUrl(path) } : undefined,
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
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
