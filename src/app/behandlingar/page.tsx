import Image from "next/image";
import Link from "next/link";
import { treatments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Arrow, BookingLink, Breadcrumbs, Sparkle } from "@/components/ui";
import { ContactSection } from "@/components/contact-section";
import { PageSchema } from "@/components/page-schema";

export const metadata = pageMetadata(
  "Skönhetsbehandlingar i Eskilstuna",
  "Utforska laserhårborttagning, microblading, läppigmentering, hydrofacial och microneedling i Eskilstuna. Personlig konsultation på Monaco Clinic.",
  "/behandlingar",
);

export default function TreatmentsPage() {
  return (
    <>
      <PageSchema path="/behandlingar" type="CollectionPage" />
      <section className="page-intro container">
        <Breadcrumbs items={[{ label: "Behandlingar" }]} />
        <p className="eyebrow">BEHANDLINGAR MED DIG I CENTRUM</p>
        <h1>
          Skönhetsbehandlingar
          <br />
          <em>i Eskilstuna.</em>
        </h1>
        <p className="page-description">
          Avancerad hudvård och noggrant hantverk. Upptäck våra behandlingar och
          hitta det som passar din hud, din vardag och dina önskemål.
        </p>
      </section>
      <section
        className="container treatment-cards-section"
        aria-label="Våra behandlingar"
      >
        <div className="treatment-cards">
          {treatments.map((t, i) => (
            <Link
              className="treatment-card"
              href={`/behandlingar/${t.slug}`}
              key={t.slug}
            >
              <div className="treatment-card-image">
                <Image
                  src={t.image}
                  alt={t.imageAlt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
                <span>0{i + 1}</span>
                <span className="card-image-arrow">
                  <Arrow diagonal />
                </span>
              </div>
              <div className="treatment-card-copy">
                <p className="eyebrow">{t.eyebrow}</p>
                <h2>{t.name}</h2>
                <p>{t.description}</p>
                <span className="text-link">
                  Läs om {t.name.toLocaleLowerCase("sv-SE")}
                  <Arrow />
                </span>
              </div>
            </Link>
          ))}
          <div className="treatment-consultation-card">
            <Sparkle />
            <p className="eyebrow">VI HJÄLPER DIG ATT VÄLJA</p>
            <h2>
              Din hudresa
              <br />
              börjar med
              <br />
              <em>ett samtal.</em>
            </h2>
            <p>
              Varje behandling inleds med en personlig konsultation. Boka ett
              besök och låt oss guida dig.
            </p>
            <BookingLink />
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
