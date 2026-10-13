import { discoveryPages } from "@/lib/discovery";
import { isPublicProductionUrl, siteUrl } from "@/lib/site";
import { serializeJsonLd, webPageSchema } from "@/lib/seo";

export function PageSchema({
  path,
  type = "WebPage",
}: {
  path: string;
  type?: string;
}) {
  const page = discoveryPages.find((entry) => entry.path === path);
  if (!page || !isPublicProductionUrl(siteUrl)) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(
          webPageSchema(path, page.title, page.description, type),
        ),
      }}
    />
  );
}
