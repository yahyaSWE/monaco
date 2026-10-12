import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { BookingLink, Breadcrumbs, Sparkle } from "@/components/ui";
import { ContactSection } from "@/components/contact-section";

export const metadata = pageMetadata(
  "Om vår skönhetsklinik i Eskilstuna",
  "Lär känna Monaco Clinic, grundad av Sama Kadhim. Personlig hudvård och skönhetsbehandlingar i en lugn miljö på Hällstugatan 16 i Eskilstuna.",
  "/om-oss",
);

export default function AboutPage() {
  return (
    <>
      <section className="page-intro container">
        <Breadcrumbs items={[{ label: "Om kliniken" }]} />
        <p className="eyebrow">VÄLKOMMEN TILL MONACO</p>
        <h1>
          Din skönhetsklinik
          <br />
          <em>i Eskilstuna.</em>
        </h1>
        <p className="page-description">
          Där vetenskap möter ro. Ett personligt möte, noggrant hantverk och tid
          att lyssna.
        </p>
      </section>
      <section className="container about-page-grid">
        <div className="about-page-image">
          <Image
            src="/images/about.jpg"
            alt="Ljus och rofylld klinikmiljö"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="about-page-copy">
          <Sparkle />
          <h2>
            Vacker hy börjar
            <br />
            med att <em>förstå den.</em>
          </h2>
          <p>
            Monaco grundades av Sama Kadhim och förenar noggrant hantverk med
            lyxspats lugn. Vi tror att vacker hy föds ur att förstå den — aldrig
            från lösningar som passar alla.
          </p>
          <p>
            En fristad där avancerad hudvård möter ro. Våra certifierade
            specialister tar fram personliga behandlingar som framhäver hudens
            naturliga lyster.
          </p>
          <p>
            Varje behandling inleds med en personlig konsultation, så att vi kan
            rekommendera exakt vad just du behöver — varken mer eller mindre.
          </p>
          <BookingLink />
        </div>
      </section>
      <section className="section container">
        <div className="values-grid">
          <div>
            <span className="eyebrow">01 · PERSONLIG OMTANKE</span>
            <h3>Vi börjar med dig.</h3>
            <p>
              Dina önskemål vägleder oss. Konsultationen är till för att lyssna,
              svara på frågor och ge ett ärligt förslag.
            </p>
          </div>
          <div>
            <span className="eyebrow">02 · NOGGRANT HANTVERK</span>
            <h3>Omsorg om detaljerna.</h3>
            <p>
              Från hudvård till bryn och läppar — vi arbetar för ett naturligt
              uttryck och en behandling som utgår från dig.
            </p>
          </div>
          <div>
            <span className="eyebrow">03 · EN STUND AV RO</span>
            <h3>Tid att landa.</h3>
            <p>
              Hos oss på Hällstugatan 16 i Eskilstuna möts du av ett varmt
              välkomnande i en lugn miljö.
            </p>
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
