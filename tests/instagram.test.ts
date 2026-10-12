import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getInstagramPosts, parseInstagramPosts } from "@/lib/instagram";

const imagePost = {
  id: "1",
  media_type: "IMAGE",
  media_url: "https://scontent.cdninstagram.com/clinic.jpg?signature=preserve",
  permalink: "https://www.instagram.com/p/Clinic_123/?tracking=remove#caption",
  caption: "Nyheter från Monaco Klinik i Eskilstuna",
  timestamp: "2026-10-10T12:00:00+0000",
};

describe("Instagram display data", () => {
  it("uses images, video thumbnails and the first child of a carousel", () => {
    const videoThumbnail = "https://scontent.fbcdn.net/video-thumbnail.jpg";
    const carouselThumbnail =
      "https://scontent.cdninstagram.com/carousel-thumbnail.jpg";
    const posts = parseInstagramPosts({
      data: [
        imagePost,
        {
          id: "2",
          media_type: "VIDEO",
          media_url: "https://scontent.fbcdn.net/movie.mp4",
          thumbnail_url: videoThumbnail,
          permalink: "https://www.instagram.com/reel/Video_123/",
        },
        {
          id: "3",
          media_type: "CAROUSEL_ALBUM",
          permalink: "https://instagram.com/p/Album_123/",
          children: {
            data: [
              { media_type: "VIDEO", thumbnail_url: carouselThumbnail },
              {
                media_type: "IMAGE",
                media_url: "https://scontent.cdninstagram.com/second.jpg",
              },
            ],
          },
        },
      ],
    });

    assert.equal(posts.length, 3);
    assert.equal(posts[0].imageUrl, imagePost.media_url);
    assert.equal(posts[0].publishedAt, "2026-10-10T12:00:00.000Z");
    assert.equal(posts[1].imageUrl, videoThumbnail);
    assert.equal(posts[1].mediaType, "VIDEO");
    assert.equal(posts[2].imageUrl, carouselThumbnail);
    assert.equal(posts[2].carouselCount, 2);
  });

  it("keeps signed CDN queries but removes tracking from post links", () => {
    const [post] = parseInstagramPosts({ data: [imagePost] });
    assert.equal(post.imageUrl, imagePost.media_url);
    assert.equal(post.permalink, "https://www.instagram.com/p/Clinic_123/");
  });

  it("rejects unsafe post destinations and keeps image URLs on trusted HTTPS CDN hosts", () => {
    const unsafePosts = [
      "javascript:alert(1)",
      "http://www.instagram.com/p/Clinic_123/",
      "https://instagram.com.attacker.test/p/Clinic_123/",
      "https://username:password@instagram.com/p/Clinic_123/",
      "https://www.instagram.com/redirect/?to=https://attacker.test",
      "https://www.instagram.com:8080/p/Clinic_123/",
    ];
    for (const permalink of unsafePosts) {
      assert.deepEqual(
        parseInstagramPosts({ data: [{ ...imagePost, permalink }] }),
        [],
      );
    }

    const unsafeImages = [
      "http://scontent.cdninstagram.com/a.jpg",
      "https://cdninstagram.com.attacker.test/a.jpg",
      "https://notcdninstagram.com/a.jpg",
      "https://user:password@cdninstagram.com/a.jpg",
      "https://cdninstagram.com:8080/a.jpg",
      "https://cdninstagram.com/a.jpg?access_token=secret",
      "https://fbcdn.net/a.jpg?CLIENT_SECRET=secret",
    ];
    for (const media_url of unsafeImages) {
      const [post] = parseInstagramPosts({
        data: [{ ...imagePost, media_url }],
      });
      assert.equal(post.imageUrl, undefined);
      assert.equal(post.permalink, "https://www.instagram.com/p/Clinic_123/");
    }
  });

  it("bounds and normalizes captions without treating their text as HTML", () => {
    const [post] = parseInstagramPosts({
      data: [
        {
          ...imagePost,
          caption:
            "  <script>alert(1)</script>\u0000\n  Nyheter från kliniken\t ",
          access_token: "must-never-be-returned",
        },
      ],
    });
    assert.equal(
      post.caption,
      "<script>alert(1)</script> Nyheter från kliniken",
    );
    assert.equal("access_token" in post, false);
    assert.equal(
      JSON.stringify(post).includes("must-never-be-returned"),
      false,
    );
    assert.equal(
      parseInstagramPosts({
        data: [{ ...imagePost, caption: "a".repeat(3000) }],
      })[0].caption.length,
      2000,
    );
  });

  it("handles malformed responses, duplicate IDs and unsupported media types", () => {
    for (const payload of [
      null,
      [],
      {},
      { data: "not-an-array" },
      {
        data: [
          null,
          {},
          { ...imagePost, id: "../malformed" },
          { ...imagePost, media_type: "UNKNOWN" },
        ],
      },
    ]) {
      assert.deepEqual(parseInstagramPosts(payload), []);
    }
    const posts = parseInstagramPosts({
      data: [
        imagePost,
        imagePost,
        {
          ...imagePost,
          id: "2",
          timestamp: "invalid-date",
          caption: undefined,
        },
      ],
    });
    assert.equal(posts.length, 2);
    assert.equal(posts[1].publishedAt, undefined);
    assert.equal(posts[1].caption, "");
  });

  it("limits the feed to six posts and allows a post without a usable thumbnail", () => {
    const posts = parseInstagramPosts({
      data: Array.from({ length: 9 }, (_, i) => ({
        ...imagePost,
        id: String(i + 1),
      })),
    });
    assert.equal(posts.length, 6);
    const [video] = parseInstagramPosts({
      data: [
        {
          id: "10",
          media_type: "VIDEO",
          permalink: "https://www.instagram.com/reel/No_Thumbnail/",
        },
      ],
    });
    assert.equal(video.imageUrl, undefined);
    assert.equal(video.mediaType, "VIDEO");
  });
});

async function withInstagramRequest(
  mockedFetch: typeof fetch,
  run: () => Promise<void>,
  config: { userId?: string; accessToken?: string } = {
    userId: "123456789",
    accessToken: "test-server-secret",
  },
) {
  const originalFetch = globalThis.fetch;
  const originalUserId = process.env.INSTAGRAM_USER_ID;
  const originalAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  try {
    globalThis.fetch = mockedFetch;
    if (config.userId === undefined) delete process.env.INSTAGRAM_USER_ID;
    else process.env.INSTAGRAM_USER_ID = config.userId;
    if (config.accessToken === undefined)
      delete process.env.INSTAGRAM_ACCESS_TOKEN;
    else process.env.INSTAGRAM_ACCESS_TOKEN = config.accessToken;
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUserId === undefined) delete process.env.INSTAGRAM_USER_ID;
    else process.env.INSTAGRAM_USER_ID = originalUserId;
    if (originalAccessToken === undefined)
      delete process.env.INSTAGRAM_ACCESS_TOKEN;
    else process.env.INSTAGRAM_ACCESS_TOKEN = originalAccessToken;
  }
}

describe("server-side Instagram requests", { concurrency: false }, () => {
  it("skips requests without valid server credentials", async () => {
    let calls = 0;
    for (const config of [
      {},
      { userId: "123456789" },
      { accessToken: "test-server-secret" },
      { userId: "../malformed", accessToken: "test-server-secret" },
      { userId: "123456789", accessToken: "token\nwith-newline" },
    ]) {
      await withInstagramRequest(
        async () => {
          calls++;
          throw new Error("Unexpected request");
        },
        async () => {
          assert.deepEqual(await getInstagramPosts(), []);
        },
        config,
      );
    }
    assert.equal(calls, 0);
  });

  it("authenticates only in a bearer header and asks for bounded media data", async () => {
    let calls = 0;
    await withInstagramRequest(
      async (input, options) => {
        calls++;
        const url = new URL(String(input));
        assert.equal(url.origin, "https://graph.instagram.com");
        assert.equal(url.pathname, "/v25.0/123456789/media");
        assert.equal(url.searchParams.get("limit"), "6");
        assert.match(
          url.searchParams.get("fields") ?? "",
          /children\{media_type,media_url,thumbnail_url\}/,
        );
        assert.equal(url.searchParams.has("access_token"), false);
        assert.equal(url.toString().includes("test-server-secret"), false);
        const headers = new Headers(options?.headers);
        assert.equal(headers.get("Authorization"), "Bearer test-server-secret");
        assert.equal(options?.redirect, "error");
        assert.ok(options?.signal instanceof AbortSignal);
        assert.equal(
          (options as RequestInit & { next: { revalidate: number } }).next
            .revalidate,
          3600,
        );
        return Response.json({ data: [imagePost] });
      },
      async () => {
        assert.equal((await getInstagramPosts()).length, 1);
      },
    );
    assert.equal(calls, 1);
  });

  it("falls back on API errors, malformed JSON and network failures", async () => {
    const failures: Array<typeof fetch> = [
      async () => new Response("upstream error", { status: 401 }),
      async () => new Response("not JSON", { status: 200 }),
      async () => {
        throw new Error("network failure");
      },
    ];
    for (const mockedFetch of failures) {
      await withInstagramRequest(mockedFetch, async () => {
        assert.deepEqual(await getInstagramPosts(), []);
      });
    }
  });

  it("applies a five-second abort deadline and falls back when it expires", async () => {
    const originalTimeout = AbortSignal.timeout;
    let deadline: number | undefined;
    try {
      // Use an already expired signal to exercise cancellation without waiting five seconds.
      AbortSignal.timeout = (milliseconds) => {
        deadline = milliseconds;
        return AbortSignal.abort(
          new DOMException("Simulated timeout", "TimeoutError"),
        );
      };
      await withInstagramRequest(
        async (_input, options) => {
          assert.equal(options?.signal?.aborted, true);
          throw options?.signal?.reason;
        },
        async () => {
          assert.deepEqual(await getInstagramPosts(), []);
        },
      );
      assert.equal(deadline, 5000);
    } finally {
      AbortSignal.timeout = originalTimeout;
    }
  });
});
