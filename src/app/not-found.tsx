import Link from "next/link";
import { BookingLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="eyebrow">404 · SIDAN FINNS INTE</p>
      <h1>
        Vi hjälper dig
        <br />
        <em>att hitta rätt.</em>
      </h1>
      <p>
        Sidan du söker kunde inte hittas. Utforska våra behandlingar eller boka
        en konsultation.
      </p>
      <div className="hero-actions">
        <Link href="/behandlingar" className="button button-outline">
          Se behandlingar
        </Link>
        <BookingLink />
      </div>
    </section>
  );
}
