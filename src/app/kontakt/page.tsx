import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Breadcrumbs, Faq, Arrow } from "@/components/ui";
import { ContactSection } from "@/components/contact-section";

export const metadata = pageMetadata(
  "Boka & kontakta Monaco Clinic i Eskilstuna",
  "Boka hudvård och skönhetsbehandlingar på Monaco Clinic, Hällstugatan 16, Eskilstuna. Ring 073-577 19 91. Öppet måndag–lördag 09–18.",
  "/kontakt",
);

export default function ContactPage() {
  return (
    <>
      <section className="page-intro container">
        <Breadcrumbs items={[{ label: "Kontakt & bokning" }]} />
        <p className="eyebrow">VI FINNS HÄR FÖR DIG</p>
        <h1>
          Välkommen till oss
          <br />
          <em>i Eskilstuna.</em>
        </h1>
        <p className="page-description">
          Börja din hudresa med ett samtal. Boka en konsultation, ring eller
          mejla oss — vi hjälper dig att hitta en behandling som passar dina
          önskemål.
        </p>
      </section>
      <ContactSection />
      <section className="section container faq-grid">
        <div>
          <p className="eyebrow">BRA ATT VETA</p>
          <h2>
            Inför ditt
            <br />
            <em>första besök.</em>
          </h2>
          <a
            className="text-link"
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Hitta hit på Google Maps
            <Arrow diagonal />
          </a>
        </div>
        <Faq
          items={[
            {
              question: "Hur bokar jag en tid?",
              answer:
                "Klicka på Boka tid för att öppna Monaco Clinics bokningssida på Bokadirekt. Där hittar du aktuella behandlingar, priser och tillgängliga tider. Du kan också ringa oss på 073-577 19 91.",
            },
            {
              question: "Var ligger kliniken?",
              answer:
                "Du hittar Monaco Clinic på Hällstugatan 16, 633 53 Eskilstuna. Använd länken till Google Maps för att få vägbeskrivning till oss.",
            },
            {
              question: "Vilka öppettider har ni?",
              answer:
                "Vi har öppet måndag till lördag klockan 09.00–18.00. Söndagar håller vi stängt. Se Bokadirekt för tillgängliga behandlingstider.",
            },
            {
              question: "Hur avbokar jag?",
              answer:
                "Avbokning ska göras senast 24 timmar före den bokade tiden. Sen avbokning eller uteblivet besök debiteras enligt klinikens bokningsvillkor. Se din bokningsbekräftelse eller kontakta oss för hjälp.",
            },
          ]}
        />
      </section>
    </>
  );
}
