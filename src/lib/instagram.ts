import "server-only";

export const instagramProfileUrl = "https://www.instagram.com/monacoklinik/";

export type InstagramPost = {
  id: string;
  caption: string;
  permalink: string;
  imageUrl?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  publishedAt?: string;
  carouselCount?: number;
};

const maximumPosts = 6;
const apiVersion = "v25.0";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeUrl(value: unknown, kind: "post" | "image"): string | undefined {
  if (typeof value !== "string" || value.length > 4096) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) {
      return undefined;
    }

    const host = url.hostname.toLowerCase();
    if (kind === "post") {
      if (!["instagram.com", "www.instagram.com"].includes(host))
        return undefined;
      if (!/^\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname))
        return undefined;
      url.search = "";
      url.hash = "";
    } else {
      const allowed = ["cdninstagram.com", "fbcdn.net"].some(
        (domain) => host === domain || host.endsWith(`.${domain}`),
      );
      if (!allowed) return undefined;
      // CDN query parameters sign the image URL and must remain intact.
      if (
        [...url.searchParams.keys()].some((key) =>
          /^(?:access_token|client_secret)$/i.test(key),
        )
      ) {
        return undefined;
      }
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

function mediaPreview(media: Record<string, unknown>): string | undefined {
  if (media.media_type === "VIDEO")
    return safeUrl(media.thumbnail_url, "image");
  if (media.media_type === "IMAGE") return safeUrl(media.media_url, "image");
  return undefined;
}

/** Keep only display fields and trusted Instagram links; never pass raw API data to JSX. */
export function parseInstagramPosts(payload: unknown): InstagramPost[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return [];

  const posts: InstagramPost[] = [];
  const ids = new Set<string>();

  for (const item of payload.data.slice(0, 50)) {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      !/^\d{1,32}$/.test(item.id)
    )
      continue;
    if (ids.has(item.id)) continue;
    if (!["IMAGE", "VIDEO", "CAROUSEL_ALBUM"].includes(String(item.media_type)))
      continue;

    const permalink = safeUrl(item.permalink, "post");
    if (!permalink) continue;

    const children =
      isRecord(item.children) && Array.isArray(item.children.data)
        ? item.children.data.slice(0, 20).filter(isRecord)
        : [];
    const imageUrl =
      item.media_type === "CAROUSEL_ALBUM"
        ? ((children.length ? mediaPreview(children[0]) : undefined) ??
          safeUrl(item.media_url, "image"))
        : mediaPreview(item);

    // Captions stay plain text: React escapes them. Remove control characters and bound length.
    const caption =
      typeof item.caption === "string"
        ? item.caption
            .replace(/[\u0000-\u001F\u007F]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 2000)
        : "";
    const timestamp =
      typeof item.timestamp === "string" ? Date.parse(item.timestamp) : NaN;

    posts.push({
      id: item.id,
      caption,
      permalink,
      imageUrl,
      mediaType: item.media_type as InstagramPost["mediaType"],
      publishedAt: Number.isFinite(timestamp)
        ? new Date(timestamp).toISOString()
        : undefined,
      carouselCount:
        item.media_type === "CAROUSEL_ALBUM" && children.length
          ? children.length
          : undefined,
    });
    ids.add(item.id);
    if (posts.length === maximumPosts) break;
  }

  return posts;
}

/** Official Instagram API with Instagram Login; credentials are available only on the server. */
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const userId = process.env.INSTAGRAM_USER_ID?.trim();
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (
    !userId ||
    !/^\d{1,32}$/.test(userId) ||
    !accessToken ||
    !/^[\x21-\x7E]{1,4096}$/.test(accessToken)
  ) {
    return [];
  }

  const url = new URL(
    `https://graph.instagram.com/${apiVersion}/${userId}/media`,
  );
  url.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}",
  );
  url.searchParams.set("limit", String(maximumPosts));

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
      redirect: "error",
    });
    if (!response.ok) return [];
    return parseInstagramPosts(await response.json());
  } catch {
    // Never log upstream responses, request headers or tokens. The profile link remains usable.
    return [];
  }
}
