import Image from "next/image";
import Link from "next/link";
import { treatments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Arrow, BookingLink, Sparkle } from "@/components/ui";
import { ContactSection } from "@/components/contact-section";
import { InstagramFeed } from "@/components/instagram-feed";

export const metadata = pageMetadata(
  "Hudvård & skönhetsbehandlingar i Eskilstuna",
  "Monaco Clinic i Eskilstuna: laserhårborttagning, microblading, läppigmentering, hydrofacial och microneedling. Boka konsultation på Hällstugatan 16.",
  "/",
);
export const revalidate = 3600;

const reviews = [
  {
    name: "Sofia Lindqvist",
    text: "Den mest avkopplande upplevelsen jag haft på en klinik. Min hy har aldrig sett bättre ut.",
  },
  {
    name: "Amira Hassan",
    text: "Professionell, varm och otroligt kunnig. Jag litar helt på Monaco när det gäller min hy.",
  },
  {
    name: "Elin Bergström",
    text: "Redan när man kliver in känns allt genomtänkt. Resultaten talar för sig själva.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-line" />
            DIN SKÖNHETSKLINIK I ESKILSTUNA
          </p>
          <h1>
            Hudvård & skönhet.
            <br />
            <em>I Eskilstuna.</em>
          </h1>
          <p className="hero-location">Strålande hy, naturligt du.</p>
          <p className="hero-description">
            En fristad där avancerad hudvård möter ro. Våra certifierade
            specialister tar fram personliga behandlingar som framhäver hudens
            naturliga lyster.
          </p>
          <div className="hero-actions">
            <BookingLink />
            <Link className="text-link" href="/behandlingar">
              Utforska behandlingar
              <Arrow />
            </Link>
          </div>
          <div className="hero-bottom">
            <Sparkle />
            <span>
              Strålande hy.
              <br />
              Med omtanke, kunskap och lugn.
            </span>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/hero.jpg"
            alt="Ljus och rofylld behandlingsmiljö"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            priority
          />
          <div className="hero-image-caption">
            <span>MONACO CLINIC</span>
            <span>En stund som är bara din.</span>
          </div>
        </div>
      </section>
      <div className="promise-strip">
        <div className="container">
          <span>
            <Sparkle />
            Personlig konsultation
          </span>
          <span>
            <Sparkle />
            Behandlingar efter dina behov
          </span>
          <span>
            <Sparkle />
            Hällstugatan 16, Eskilstuna
          </span>
        </div>
      </div>
      <section className="section treatments-section" id="behandlingar">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">VÅR EXPERTIS</p>
              <h2>
                Din hud. Dina önskemål.
                <br />
                <em>Din behandling.</em>
              </h2>
            </div>
            <p>
              Varje behandling inleds med en personlig konsultation, så att vi
              kan rekommendera exakt vad just du behöver — varken mer eller
              mindre.
            </p>
          </div>
          <div className="treatment-discovery">
            <div className="discovery-image">
              <Image
                src="/images/facial.jpg"
                alt="Ansiktsbehandling och personlig hudvård"
                fill
                sizes="(max-width: 760px) 100vw, 40vw"
              />
              <div>
                <span>SKÖNHET MED OMTANKE</span>
                <Sparkle />
              </div>
            </div>
            <div className="treatment-list">
              {treatments.map((t, index) => (
                <Link
                  className="treatment-row"
                  href={`/behandlingar/${t.slug}`}
                  key={t.slug}
                >
                  <span className="treatment-number">0{index + 1}</span>
                  <div>
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                  </div>
                  <span className="row-arrow">
                    <Arrow diagonal />
                  </span>
                </Link>
              ))}
              <Link className="text-link all-treatments" href="/behandlingar">
                Alla behandlingar i Eskilstuna
                <Arrow />
              </Link>
            </div>
          </div>
          <div className="consultation-note">
            <Sparkle />
            <div>
              <h3>Osäker på vad du behöver?</h3>
              <p>
                Boka en kostnadsfri konsultation så tittar vi på just dig och
                ger ett ärligt förslag.
              </p>
            </div>
            <BookingLink className="button-outline" />
          </div>
        </div>
      </section>
      <section className="about-section section" id="om-kliniken">
        <div className="container about-grid">
          <div className="about-copy">
            <p className="eyebrow">OM MONACO CLINIC</p>
            <h2>
              Där kunskap
              <br />
              möter <em>lugn.</em>
            </h2>
            <p className="lead">Hudvård i Eskilstuna med dig i centrum.</p>
            <p>
              Monaco grundades av Sama Kadhim och förenar noggrant hantverk med
              lyxspats lugn. Vi tror att vacker hy föds ur att förstå den —
              aldrig från lösningar som passar alla.
            </p>
            <Link className="text-link" href="/om-oss">
              Lär känna kliniken
              <Arrow />
            </Link>
            <div className="stats">
              <div>
                <strong>
                  3<span>+</span>
                </strong>
                <span>År i branschen</span>
              </div>
              <div>
                <strong>
                  8 000<span>+</span>
                </strong>
                <span>Nöjda kunder</span>
              </div>
              <div>
                <strong>4,9</strong>
                <span>Snittbetyg</span>
              </div>
            </div>
          </div>
          <div className="about-images">
            <Image
              className="about-main-image"
              src="/images/about.jpg"
              alt="Rofylld klinikmiljö"
              width={1024}
              height={1024}
              sizes="(max-width: 760px) 85vw, 40vw"
            />
            <Image
              className="about-detail-image"
              src="/images/products.jpg"
              alt="Hudvårdsprodukter i varma, naturliga toner"
              width={1024}
              height={1024}
              sizes="(max-width: 760px) 35vw, 18vw"
            />
            <span className="about-image-label">OMTANKE I VARJE DETALJ</span>
          </div>
        </div>
      </section>
      <section className="section reviews-section" id="omdomen">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">VARMT MOTTAGANDE</p>
              <h2>
                Det finaste vi får?
                <br />
                <em>Ditt förtroende.</em>
              </h2>
            </div>
            <span className="review-heading-note">Ord från våra kunder.</span>
          </div>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <figure className="review" key={review.name}>
                <span className="quote-mark" aria-hidden="true">
                  “
                </span>
                <blockquote>{review.text}</blockquote>
                <figcaption>
                  <span className="review-line" />
                  {review.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <InstagramFeed />
      <ContactSection />
    </>
  );
}
