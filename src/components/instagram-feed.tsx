import Image from "next/image";
import { getInstagramPosts, instagramProfileUrl } from "@/lib/instagram";
import styles from "./instagram-feed.module.css";

function InstagramIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export async function InstagramFeed() {
  const posts = await getInstagramPosts();

  return (
    <section
      id="instagram"
      className={`instagram-section ${styles.section}`}
      aria-labelledby="instagram-heading"
    >
      <div className={`instagram-header ${styles.header}`}>
        <div>
          <p className={`eyebrow ${styles.eyebrow}`}>Följ livet på kliniken</p>
          <h2 id="instagram-heading">Monaco Klinik på Instagram</h2>
          <p className={styles.introduction}>
            Inspiration, nyheter och en närmare titt på vår klinik i Eskilstuna.
          </p>
        </div>
        <a
          className={`instagram-profile-link ${styles.profileLink}`}
          href={instagramProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon />
          <span>@monacoklinik</span>
          <span aria-hidden="true">↗</span>
          <span className={styles.srOnly}> (öppnas i en ny flik)</span>
        </a>
      </div>

      {posts.length > 0 ? (
        <div className={`instagram-grid ${styles.grid}`}>
          {posts.map((post) => (
            <a
              className={`instagram-card ${styles.card}`}
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${post.caption ? post.caption.slice(0, 160) : "Inlägg från Monaco Klinik"}. Öppna på Instagram i en ny flik.`}
            >
              <div className={styles.media}>
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={
                      post.caption
                        ? post.caption.slice(0, 180)
                        : "Monaco Klinik på Instagram"
                    }
                    fill
                    sizes="(max-width: 540px) 90vw, (max-width: 850px) 45vw, 30vw"
                    unoptimized
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <InstagramIcon />
                    <span>Se inlägget på Instagram</span>
                  </div>
                )}
                {post.mediaType !== "IMAGE" && (
                  <span className={styles.badge}>
                    {post.mediaType === "VIDEO" ? "▷ Video" : "▧ Bildserie"}
                  </span>
                )}
                <span className={styles.openIcon} aria-hidden="true">
                  ↗
                </span>
              </div>
              {(post.caption || post.publishedAt) && (
                <div className={styles.caption}>
                  {post.caption && (
                    <p>
                      {post.caption.slice(0, 180)}
                      {post.caption.length > 180 ? "…" : ""}
                    </p>
                  )}
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Intl.DateTimeFormat("sv-SE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "Europe/Stockholm",
                      }).format(new Date(post.publishedAt))}
                    </time>
                  )}
                </div>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className={`instagram-fallback ${styles.fallback}`}>
          <div className={styles.fallbackIcon}>
            <InstagramIcon />
          </div>
          <div>
            <h3>Kom närmare Monaco Klinik</h3>
            <p>
              Besök vår Instagram för de senaste inläggen,
              behandlingsinspiration och glimtar från vardagen på kliniken.
            </p>
          </div>
          <a
            className={styles.fallbackLink}
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Se våra inlägg <span aria-hidden="true">↗</span>
            <span className={styles.srOnly}>
              {" "}
              på Instagram (öppnas i en ny flik)
            </span>
          </a>
        </div>
      )}
    </section>
  );
}

export default InstagramFeed;
