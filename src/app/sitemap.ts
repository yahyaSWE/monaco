import type { MetadataRoute } from "next";
import { discoveryPages } from "@/lib/discovery";
import { absoluteUrl, isIndexable } from "@/lib/site";
import { getTreatment } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];
  return discoveryPages.map(({ path }) => {
    const treatment = getTreatment(path.slice("/behandlingar/".length));
    const image =
      treatment?.image ??
      (path === "/"
        ? "/images/hero.jpg"
        : path === "/om-oss"
          ? "/images/about.jpg"
          : undefined);
    return {
      url: absoluteUrl(path),
      changeFrequency: "monthly",
      priority:
        path === "/" ? 1 : path.startsWith("/behandlingar/") ? 0.9 : 0.7,
      ...(image ? { images: [absoluteUrl(image)] } : {}),
    };
  });
}
