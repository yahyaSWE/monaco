import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui";
import { PageSchema } from "@/components/page-schema";

export const metadata = pageMetadata(
  "Integritet & cookies",
  "Information om kontaktuppgifter, bokning, Instagram och cookies på Monaco Clinics hemsida.",
  "/integritet",
);

export default function PrivacyPage() {
  return (
    <article className="container legal-page">
      <PageSchema path="/integritet" />
      <Breadcrumbs items={[{ label: "Integritet & cookies" }]} />
      <p className="eyebrow">DIN INTEGRITET</p>
      <h1>
        Integritet <em>& cookies.</em>
      </h1>
      <p>
        Här beskriver vi hur den här webbplatsen fungerar. Har du frågor om dina
        personuppgifter hos Monaco Clinic AB kan du kontakta oss på{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> eller{" "}
        <a href={site.phoneHref}>{site.phone}</a>.
      </p>
      <h2>Kontakt och bokning</h2>
      <p>
        Webbplatsen har inget kontaktformulär och sparar inga bokningar. När du
        kontaktar oss via mejl eller telefon använder vi de uppgifter du lämnar
        för att kunna besvara din förfrågan. Lämna gärna känsliga uppgifter vid
        ditt personliga besök i stället för i ett mejl.
      </p>
      <p>
        Tidsbokning sker hos Bokadirekt. När du följer en bokningslänk öppnas
        deras webbplats, där deras integritetsinformation och bokningsvillkor
        gäller.
      </p>
      <h2>Instagram</h2>
      <p>
        Om Instagramflödet är anslutet hämtar vår server offentliga inlägg från
        vårt konto. Bilderna i flödet laddas från Metas bildservrar; vid
        bildvisning får dessa servrar tekniska uppgifter som din IP-adress.
        Webbplatsen använder ingen inbäddad Instagram-widget. När du klickar på
        ett inlägg eller vår profillänk öppnas Instagram, där Metas egna villkor
        gäller.
      </p>
      <h2>Cookies och tekniska uppgifter</h2>
      <p>
        Den här versionen av webbplatsen använder ingen besöksanalys,
        annonsering eller marknadsföringscookies. Hosting- och nätverkstjänster
        kan behandla tekniska uppgifter, exempelvis IP-adress, för att leverera
        webbplatsen och hantera drift och säkerhet.
      </p>
      <h2>Frågor om dina uppgifter</h2>
      <p>
        Kontakta Monaco Clinic AB på {site.street}, {site.postalCode}{" "}
        {site.city}, eller via mejl för frågor om uppgifter som du lämnat till
        kliniken.
      </p>
      <p className="legal-note">Senast uppdaterad: 12 oktober 2026.</p>
    </article>
  );
}
