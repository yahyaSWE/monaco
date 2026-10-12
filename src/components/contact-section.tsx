import { BookingLink, Arrow, Sparkle } from "@/components/ui";
import { site } from "@/lib/site";

export function ContactSection() {
  return (
    <section id="kontakt" className="contact-section">
      <div className="container contact-inner">
        <div className="contact-invitation">
          <p className="eyebrow">DIN HUDRESA BÖRJAR HÄR</p>
          <h2>
            Lite tid för dig.
            <br />
            <em>Mycket omtanke från oss.</em>
          </h2>
          <p>
            Boka en kostnadsfri konsultation och låt våra specialister ta fram
            en behandlingsplan helt efter dig.
          </p>
          <BookingLink className="button-light" />
          <Sparkle className="contact-sparkle" />
        </div>
        <div className="contact-information">
          <h3>Välkommen till Monaco i Eskilstuna</h3>
          <div className="contact-detail">
            <span>Besök oss</span>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
              {site.street}
              <br />
              {site.postalCode} {site.city}
              <Arrow diagonal />
            </a>
          </div>
          <div className="contact-detail">
            <span>Ring oss</span>
            <a href={site.phoneHref}>
              {site.phone}
              <Arrow diagonal />
            </a>
          </div>
          <div className="contact-detail">
            <span>Skriv till oss</span>
            <a href={`mailto:${site.email}`}>
              {site.email}
              <Arrow diagonal />
            </a>
          </div>
          <div className="contact-detail">
            <span>Öppettider</span>
            <p>
              Måndag–lördag 09.00–18.00
              <br />
              Söndag stängt
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
