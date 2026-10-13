export const site = {
  name: "Monaco Clinic",
  legalName: "Monaco Clinic AB",
  productionUrl: "https://monacoclinic.se",
  phone: "073-577 19 91",
  phoneHref: "tel:+46735771991",
  email: "samahameed99@hotmail.com",
  street: "Hällstugatan 16",
  postalCode: "633 53",
  city: "Eskilstuna",
  bookingUrl: "https://www.bokadirekt.se/places/monaco-clinic-ab-137365",
  instagramUrl: "https://www.instagram.com/monacoklinik/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=H%C3%A4llstugatan+16%2C+633+53+Eskilstuna",
};

export function resolveSiteUrl(
  env: Record<string, string | undefined>,
): string | null {
  const configured = env.NEXT_PUBLIC_SITE_URL?.trim();
  const value = configured || site.productionUrl;
  try {
    const url = new URL(value);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function isPublicProductionUrl(
  value: string | null | undefined,
): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return false;

    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
    if (
      /(?:^|\.)(?:localhost|local|test|invalid|example)$/.test(hostname) ||
      hostname.startsWith("[") ||
      /^(?:\d+\.){3}\d+$/.test(hostname)
    ) {
      return false;
    }

    // Validate a public domain shape; the deployment owns DNS and certificate setup.
    const labels = hostname.split(".");
    return (
      hostname.length <= 253 &&
      labels.length >= 2 &&
      labels.every((label) =>
        /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label),
      ) &&
      /[a-z]/.test(labels[labels.length - 1])
    );
  } catch {
    return false;
  }
}

export function isSiteIndexable(
  env: Record<string, string | undefined>,
): boolean {
  return (
    env.NODE_ENV === "production" &&
    isPublicProductionUrl(resolveSiteUrl(env)) &&
    env.VERCEL_ENV !== "preview" &&
    env.VERCEL_ENV !== "development" &&
    env.SITE_INDEXING_ENABLED !== "false"
  );
}

export const siteUrl = resolveSiteUrl(process.env);
export const isIndexable = isSiteIndexable(process.env);

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl ?? "http://localhost:3000").toString();
}
