import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { treatments, getTreatment } from "@/lib/content";
import { absoluteUrl, isPublicProductionUrl, siteUrl } from "@/lib/site";
import { pageMetadata, serializeJsonLd } from "@/lib/seo";
import { Arrow, BookingLink, Breadcrumbs, Faq } from "@/components/ui";
import { ContactSection } from "@/components/contact-section";
import { PageSchema } from "@/components/page-schema";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return treatments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const treatment = getTreatment((await params).slug);
  if (!treatment) notFound();
  return pageMetadata(
    `${treatment.name} i Eskilstuna`,
    treatment.seoDescription,
    `/behandlingar/${treatment.slug}`,
  );
}

export default async function TreatmentPage({ params }: Props) {
  const treatment = getTreatment((await params).slug);
  if (!treatment) notFound();
  const path = `/behandlingar/${treatment.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": absoluteUrl(`${path}#service`),
        name: `${treatment.name} i Eskilstuna`,
        description: treatment.seoDescription,
        serviceType: treatment.name,
        url: absoluteUrl(path),
        provider: { "@id": absoluteUrl("/#clinic") },
        areaServed: { "@type": "City", name: "Eskilstuna" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Hem",
            item: absoluteUrl(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Behandlingar",
            item: absoluteUrl("/behandlingar"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: treatment.name,
            item: absoluteUrl(path),
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": absoluteUrl(`${path}#fragor`),
        mainEntity: treatment.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <PageSchema path={path} />
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Behandlingar", href: "/behandlingar" },
            { label: treatment.name },
          ]}
        />
      </div>
      <section className="container treatment-hero">
        <div>
          <p className="eyebrow">{treatment.eyebrow}</p>
          <h1>
            {treatment.name}
            <br />
            <em>i Eskilstuna.</em>
          </h1>
          <p className="treatment-hero-description">{treatment.description}</p>
          <BookingLink />
          <p className="booking-location">
            Hällstugatan 16 · Personlig konsultation
          </p>
        </div>
        <div className="treatment-hero-image">
          <Image
            src={treatment.image}
            alt={treatment.imageAlt}
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            priority
          />
        </div>
      </section>
      <section className="section container treatment-content">
        <div className="treatment-content-heading">
          <p className="eyebrow">OM BEHANDLINGEN</p>
          <h2>
            {treatment.name},<br />
            <em>utifrån dig.</em>
          </h2>
        </div>
        <div className="treatment-body">
          {treatment.intro.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div className="treatment-details">
            {treatment.details.map((detail, i) => (
              <div key={detail.title}>
                <span className="treatment-number">0{i + 1}</span>
                <div>
                  <h3>{detail.title}</h3>
                  <p>{detail.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="faq-section section" id="fragor">
        <div className="container faq-grid">
          <div>
            <p className="eyebrow">INFÖR DITT BESÖK</p>
            <h2>
              Dina frågor.
              <br />
              <em>Våra svar.</em>
            </h2>
            <p>
              Vill du veta mer om {treatment.name.toLocaleLowerCase("sv-SE")}?
              Vi hjälper dig gärna att hitta nästa steg.
            </p>
          </div>
          <Faq items={treatment.faqs} />
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UTFORSKA VIDARE</p>
            <h2>
              Mer omsorg <em>för dig.</em>
            </h2>
          </div>
          <Link className="text-link" href="/behandlingar">
            Alla behandlingar
            <Arrow />
          </Link>
        </div>
        <div className="related-treatments">
          {treatment.related.map((slug) => {
            const related = getTreatment(slug);
            if (!related) return null;
            return (
              <Link key={slug} href={`/behandlingar/${slug}`}>
                <div>
                  <p className="eyebrow">{related.eyebrow}</p>
                  <h3>{related.name}</h3>
                  <p>{related.description}</p>
                </div>
                <Arrow diagonal />
              </Link>
            );
          })}
        </div>
      </section>
      <ContactSection />
      {isPublicProductionUrl(siteUrl) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      )}
    </>
  );
}
