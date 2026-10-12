import Link from "next/link";
import { site } from "@/lib/site";
import { treatments } from "@/lib/content";
import { Arrow } from "@/components/ui";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link href="/" className="wordmark">
            <span>
              monaco<span className="wordmark-dot">.</span>
            </span>
            <span className="wordmark-sub">CLINIC · ESKILSTUNA</span>
          </Link>
          <p>
            Avancerad hudvård. Personlig omtanke.
            <br />
            Strålande hy, naturligt du.
          </p>
          <a
            className="text-link"
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            @monacoklinik
            <Arrow diagonal />
          </a>
        </div>
        <div className="footer-column">
          <h2>Våra behandlingar</h2>
          {treatments.map((t) => (
            <Link key={t.slug} href={`/behandlingar/${t.slug}`}>
              {t.name}
            </Link>
          ))}
        </div>
        <div className="footer-column">
          <h2>Hitta till oss</h2>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
            {site.street}
            <br />
            {site.postalCode} {site.city}
          </a>
          <a href={site.phoneHref}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>Mån–lör 09–18 · Söndag stängt</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} Monaco Clinic. Alla rättigheter
          förbehållna.
        </p>
        <Link href="/integritet">Integritet & cookies</Link>
        <a href="#sidans-topp">Till toppen ↑</a>
      </div>
    </footer>
  );
}
