import type { MetadataRoute } from "next";
import { treatments } from "@/lib/content";
import { absoluteUrl, isIndexable } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];
  return [
    "/",
    "/behandlingar",
    "/om-oss",
    "/kontakt",
    ...treatments.map((t) => `/behandlingar/${t.slug}`),
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/behandlingar/") ? 0.9 : 0.7,
  }));
}
