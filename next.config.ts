import type { NextConfig } from "next";
import { discoveryPages, markdownPath } from "./src/lib/discovery";
import { isIndexable } from "./src/lib/site";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(!isIndexable
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
        ],
      },
      ...discoveryPages.map(({ path }) => ({
        source: path,
        headers: [
          {
            key: "Link",
            value: `<${markdownPath(path)}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/plain"`,
          },
        ],
      })),
    ];
  },
};

export default nextConfig;
