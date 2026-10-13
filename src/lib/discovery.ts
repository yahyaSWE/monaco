import { getTreatment, treatments, type Treatment } from "./content";
import { absoluteUrl, isIndexable, site } from "./site";

export interface DiscoveryPage {
  path: string;
  title: string;
  description: string;
}

export interface MarkdownPage {
  path: string;
  title: string;
  body: string;
}

export const discoveryPages: DiscoveryPage[] = [
  {
    path: "/",
    title: "Hudvård och skönhetsbehandlingar i Eskilstuna",
    description:
      "Översikt över Monaco Clinic, behandlingar och personlig konsultation.",
  },
  {
    path: "/behandlingar",
    title: "Behandlingar i Eskilstuna",
    description:
      "Klinikens fem behandlingar för hud, bryn, läppar och hårborttagning.",
  },
  {
    path: "/om-oss",
    title: "Om Monaco Clinic i Eskilstuna",
    description: "Klinikens grundare, personliga bemötande och arbetssätt.",
  },
  {
    path: "/kontakt",
    title: "Kontakt och bokning hos Monaco Clinic",
    description:
      "Adress, telefon, mejl, öppettider och bokning via Bokadirekt.",
  },
  {
    path: "/integritet",
    title: "Integritet och cookies",
    description:
      "Hur kontakt, extern bokning, Instagram och tekniska uppgifter hanteras.",
  },
  ...treatments.map((treatment) => ({
    path: `/behandlingar/${treatment.slug}`,
    title: `${treatment.name} i Eskilstuna`,
    description: treatment.description,
  })),
];

export function markdownPath(path: string): string {
  return path === "/" ? "/index.md" : `${path.replace(/\/+$/, "")}/index.md`;
}

const address = `${site.street}, ${site.postalCode} ${site.city}`;
const summary = `${site.name} är en skönhetsklinik i ${site.city} med laserhårborttagning, microblading, läppigmentering, hydrofacial och microneedling. Behandlingarna utgår från en personlig konsultation.`;

function markdownLink(title: string, path: string): string {
  return `[${title}](${absoluteUrl(markdownPath(path))})`;
}

function treatmentLinks(): string {
  return treatments
    .map(
      (treatment) =>
        `- ${markdownLink(`${treatment.name} i ${site.city}`, `/behandlingar/${treatment.slug}`)}: ${treatment.description}`,
    )
    .join("\n");
}

function contactDetails(): string {
  return [
    `- Adress: ${address}.`,
    `- Telefon: [${site.phone}](${site.phoneHref}).`,
    `- Mejla: [${site.email}](mailto:${site.email}).`,
    "- Öppettider: måndag–lördag 09.00–18.00. Söndag stängt.",
    `- [Boka tid på Bokadirekt](${site.bookingUrl}) för aktuella behandlingar, priser och lediga tider.`,
  ].join("\n");
}

function renderTreatment(treatment: Treatment): string {
  const related = treatment.related.flatMap((slug) => {
    const item = getTreatment(slug);
    return item
      ? [
          `- ${markdownLink(`${item.name} i ${site.city}`, `/behandlingar/${item.slug}`)}: ${item.description}`,
        ]
      : [];
  });

  return [
    treatment.description,
    "## Om behandlingen",
    ...treatment.intro,
    ...treatment.details.flatMap((detail) => [
      `### ${detail.title}`,
      detail.text,
    ]),
    "## Vanliga frågor",
    ...treatment.faqs.flatMap((faq) => [`### ${faq.question}`, faq.answer]),
    "## Relaterade behandlingar",
    related.join("\n"),
    `- ${markdownLink("Alla behandlingar", "/behandlingar")}`,
    "## Kontakt och bokning",
    contactDetails(),
  ].join("\n\n");
}

function renderGeneralPage(path: string): string | undefined {
  switch (path) {
    case "/":
      return [
        summary,
        "## Våra behandlingar",
        treatmentLinks(),
        "## Personlig konsultation",
        "Varje behandling inleds med en personlig konsultation där vi lyssnar på dina önskemål, svarar på frågor och rekommenderar ett upplägg utifrån dig.",
        `Monaco grundades av Sama Kadhim. ${markdownLink("Läs om kliniken", "/om-oss")}.`,
        "## Besök oss",
        contactDetails(),
        `Följ [Monaco Clinic på Instagram](${site.instagramUrl}).`,
      ].join("\n\n");
    case "/behandlingar":
      return [
        "Vi erbjuder hudvård och skönhetsbehandlingar i Eskilstuna. Vid en personlig konsultation går vi igenom dina önskemål och hjälper dig att välja behandling.",
        "## Behandlingar",
        treatmentLinks(),
        "## Hitta rätt behandling",
        "Du får möjlighet att prata om dina förväntningar och ställa frågor innan du bestämmer dig. Behandlingsplanen anpassas efter dina egna förutsättningar.",
        "## Kontakt och bokning",
        contactDetails(),
      ].join("\n\n");
    case "/om-oss":
      return [
        "Monaco grundades av Sama Kadhim och förenar noggrant hantverk med lyxspats lugn. Vi tror att vacker hy föds ur att förstå den — aldrig från lösningar som passar alla.",
        "## Personlig omtanke",
        "Dina önskemål vägleder oss. Konsultationen är till för att lyssna, svara på frågor och ge ett ärligt förslag.",
        "## Omsorg om detaljerna",
        "Från hudvård till bryn och läppar arbetar vi för ett naturligt uttryck och en behandling som utgår från dig.",
        "## En stund av ro",
        `Hos oss på ${site.street} i ${site.city} möts du av ett varmt välkomnande i en lugn miljö.`,
        markdownLink("Utforska våra behandlingar", "/behandlingar"),
        "## Kontakt och bokning",
        contactDetails(),
      ].join("\n\n");
    case "/kontakt":
      return [
        "Boka en konsultation, ring eller mejla oss. Vi hjälper dig att hitta en behandling som passar dina önskemål.",
        "## Kontaktuppgifter",
        contactDetails(),
        `[Hitta hit på Google Maps](${site.mapsUrl}).`,
        "## Bokning",
        `Tidsbokning sker via [Monaco Clinics sida på Bokadirekt](${site.bookingUrl}). Där visas aktuella behandlingar, priser och tillgängliga tider.`,
        "## Avbokning",
        "Avbokning ska göras senast 24 timmar före den bokade tiden. Sen avbokning eller uteblivet besök debiteras enligt klinikens bokningsvillkor. Se din bokningsbekräftelse eller kontakta oss för hjälp.",
      ].join("\n\n");
    case "/integritet":
      return [
        `Här beskriver vi hur webbplatsen fungerar. Frågor om personuppgifter hos ${site.legalName} kan skickas till [${site.email}](mailto:${site.email}) eller tas upp på [${site.phone}](${site.phoneHref}).`,
        "## Kontakt och bokning",
        "Webbplatsen har inget kontaktformulär och sparar inga bokningar. Uppgifter du lämnar via mejl eller telefon används för att besvara din förfrågan. Lämna gärna känsliga uppgifter vid ditt personliga besök i stället för i ett mejl.",
        `Tidsbokning sker hos [Bokadirekt](${site.bookingUrl}), där deras integritetsinformation och bokningsvillkor gäller.`,
        "## Instagram",
        "Om Instagramflödet är anslutet hämtar servern offentliga inlägg från klinikens konto. Bilder laddas från Metas servrar, som vid bildvisning får tekniska uppgifter som IP-adress. Webbplatsen använder ingen inbäddad Instagram-widget. När du följer ett inlägg eller en profillänk öppnas Instagram, där Metas villkor gäller.",
        "## Cookies och tekniska uppgifter",
        "Den här versionen av webbplatsen använder ingen besöksanalys, annonsering eller marknadsföringscookies. Hosting- och nätverkstjänster kan behandla tekniska uppgifter, exempelvis IP-adress, för att leverera webbplatsen och hantera drift och säkerhet.",
        "## Frågor om dina uppgifter",
        `Kontakta ${site.legalName} på ${address} eller via mejl för frågor om uppgifter som du lämnat till kliniken.`,
      ].join("\n\n");
    default:
      return undefined;
  }
}

export function getMarkdownPage(path: string): MarkdownPage | undefined {
  const page = discoveryPages.find((item) => item.path === path);
  if (!page) return undefined;

  const treatment = path.startsWith("/behandlingar/")
    ? getTreatment(path.slice("/behandlingar/".length))
    : undefined;
  const content = treatment
    ? renderTreatment(treatment)
    : renderGeneralPage(path);
  if (!content) return undefined;

  return {
    path: page.path,
    title: page.title,
    body: `# ${page.title}\n\n[Webbsida](${absoluteUrl(page.path)})\n\n${content}\n`,
  };
}

function indexLinks(paths: string[]): string {
  return paths
    .map((path) => {
      const page = discoveryPages.find((item) => item.path === path);
      if (!page) throw new Error(`Missing discovery page: ${path}`);
      return `- ${markdownLink(page.title, page.path)}: ${page.description}`;
    })
    .join("\n");
}

export function getLlmIndex(): string {
  return (
    [
      `# ${site.name}`,
      `> ${summary}`,
      `Kliniken ligger på ${address}. Telefonnummer: ${site.phone}. Mejladress: ${site.email}. Bokning sker via Bokadirekt.`,
      "Webbplatsens sidor länkas som läsbara Markdown-versioner.",
      "## Kliniken",
      indexLinks(["/", "/om-oss"]),
      "## Behandlingar",
      indexLinks([
        "/behandlingar",
        ...treatments.map((treatment) => `/behandlingar/${treatment.slug}`),
      ]),
      "## Kontakt och bokning",
      indexLinks(["/kontakt"]),
      `- [Bokadirekt](${site.bookingUrl}): Aktuella behandlingar, priser och lediga tider.`,
      "## Optional",
      indexLinks(["/integritet"]),
      `- [Samlad information](${absoluteUrl("/llms-full.txt")}): Sidornas Markdown-innehåll i ett dokument.`,
      `- [Instagram](${site.instagramUrl}): Klinikens profil @monacoklinik.`,
    ].join("\n\n") + "\n"
  );
}

export function getLlmFullText(): string {
  const pages = discoveryPages.map((page) => {
    const markdown = getMarkdownPage(page.path);
    if (!markdown) throw new Error(`Missing Markdown content: ${page.path}`);
    return markdown.body.replace(/^(#{1,5}) /gm, "$1# ").trim();
  });
  return (
    [`# ${site.name} – samlad information`, `> ${summary}`, ...pages].join(
      "\n\n---\n\n",
    ) + "\n"
  );
}

export function discoveryResponse(
  body: string,
  mediaType: "text/markdown" | "text/plain",
  canonicalPath?: string,
): Response {
  const headers: Record<string, string> = {
    "Content-Type": `${mediaType}; charset=utf-8`,
    "Content-Language": "sv",
    "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
  };
  if (canonicalPath) {
    headers.Link = `<${absoluteUrl(canonicalPath)}>; rel="canonical", </llms.txt>; rel="describedby"`;
  }
  if (!isIndexable) headers["X-Robots-Tag"] = "noindex, nofollow";
  return new Response(body, { headers });
}

export function markdownPageResponse(path: string): Response {
  const page = getMarkdownPage(path);
  if (page) return discoveryResponse(page.body, "text/markdown", page.path);
  return new Response("Sidan kunde inte hittas.\n", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Language": "sv",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
