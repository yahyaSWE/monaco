# Monaco Clinic

Next.js-webbplats för Monaco Clinic i Eskilstuna, ombyggd från [den tidigare Lovable-sidan](https://champagne-gold-glow.lovable.app/). Innehåll och originalbilder har bevarats, med ny responsiv design och egna lokala SEO-sidor för laserhårborttagning, microblading, läppigmentering, Hydrofacial och microneedling.

Projektet använder Next.js 16.4, React 19.3 och TypeScript. [Next.js kräver Node.js 20.9 eller senare](https://nextjs.org/docs/app/getting-started/installation); utvecklingsmiljön och CI använder Node.js 24.

## Kör lokalt

```sh
npm ci
npm run dev
```

Öppna [http://127.0.0.1:3000](http://127.0.0.1:3000). Kopiera `.env.example` till `.env.local` om du behöver miljövariabler. `.env.local` ska inte checkas in.

## Bygg och kontrollera

```sh
npm run build
npm run typecheck
npm test
npm run start
```

Bygg först: Next.js genererar typer som typkontrollen använder. `npm run start` startar den byggda produktionsversionen. GitHub Actions kör installation, bygge, typkontroll och tester med Node.js 24; arbetsflödet publicerar inte webbplatsen.

## Driftsättning och indexering

Importera [GitHub-repot](https://github.com/yahyaSWE/monaco) i Vercel och använd Next.js-inställningarna. Alternativt kör du `npm run build` följt av `npm run start` på en server som stöder Next.js. Läs [Vercels Next.js-dokumentation](https://vercel.com/docs/frameworks/full-stack/nextjs) för plattformsinställningar.

Produktionsadressen är **https://monacoclinic.se** och används som standard för canonical-länkar, delningsmetadata, strukturerade data och sitemap. En annan adress kan anges med `NEXT_PUBLIC_SITE_URL`; bygg om efter ändringen. Vercels tillfälliga projektadress används inte som standard för den här klinikens canonical-länkar.

Indexering aktiveras endast i en produktionsbuild med en giltig publik HTTPS-adress. Lokal utveckling och Vercels preview/development får `noindex`, blockerande `robots.txt` och tom sitemap. Sätt servervariabeln `SITE_INDEXING_ENABLED=false` för andra förhandsmiljöer. Vid ändrade miljövariabler krävs en ny build; skydda interna förhandsmiljöer även på webbhotellet.

## Sökmotorer och AI-sök

- `/robots.txt` tillåter sökcrawlers i produktion; `/sitemap.xml` listar de tio publika HTML-sidorna och relevanta bilder.
- `/llms.txt` är en kort översikt med länkar till läsbara versioner; `/llms-full.txt` samlar innehållet.
- Varje sida har en Markdown-version: `/index.md` för startsidan, annars exempelvis `/kontakt/index.md` eller `/behandlingar/microblading-eskilstuna/index.md`. HTML-metadata och HTTP `Link`-headers visar var de finns. Textversionernas canonical pekar på HTML-sidan.
- JSON-LD beskriver verksamheten, webbplatsen, behandlingarna, kontakt- och presentationssidorna samt synliga frågor och svar. Inga obekräftade betyg eller behandlarmeriter läggs till.
- `GOOGLE_SITE_VERIFICATION` och `BING_SITE_VERIFICATION` kan användas för de verkliga meta-värden som ägarverktygen utfärdar. Lämna dem tomma tills du har fått värdena; inga verifieringsfiler är påhittade.

Efter driftsättning kan ändringar anmälas till deltagande sökmotorer via IndexNow:

```sh
npm run indexnow -- --dry-run
npm run indexnow
```

Dry-run kräver ett produktionsbygge och gör inga nätverksanrop. Live-kommandot kontrollerar domän, nyckelfil, sitemap, robots och sidornas canonical/indexering före anmälan. Det körs aldrig automatiskt vid bygge. [Guiden för sökbarhet](docs/search-discovery.md) beskriver publicering, Search Console, Bing och underhåll. `llms.txt` är ett frivilligt läsformat, inte en garanti för AI-citeringar eller sökplaceringar.

## Instagram

Integrationen kan visa riktiga inlägg från `@monacoklinik` när kontots ägare har auktoriserat Instagram API. Konfigurera serverhemligheterna `INSTAGRAM_ACCESS_TOKEN` och `INSTAGRAM_USER_ID` i driftplattformen. Lägg aldrig en token i GitHub eller i en `NEXT_PUBLIC_`-variabel.

Utan API-behörighet visas en länk till Instagramprofilen. [Installations- och underhållsguiden](docs/instagram.md) beskriver behörigheter och tokenförnyelse. Token behöver förnyas före utgångsdatum; webbplatsen gör inte det automatiskt.

## Ändra innehåll

- Behandlingstexter och FAQ: [`src/lib/content.ts`](src/lib/content.ts).
- Kontaktuppgifter och bokningslänkar: [`src/lib/site.ts`](src/lib/site.ts).
- Översikt och Markdown-versioner: [`src/lib/discovery.ts`](src/lib/discovery.ts), som hämtar behandlingsinnehåll från samma datakälla som HTML-sidorna.
- Startsida, om oss, kontakt och övriga sidor: [`src/app`](src/app).
- Gemensamma komponenter och design: [`src/components`](src/components) och [`src/app/globals.css`](src/app/globals.css).
- Bilder: [`public/images`](public/images).

[Källor och innehållsinventering](docs/content-sources.md) dokumenterar den ursprungliga sidan, bokningsinformationen och bilderna. Ursprungliga kundcitat och statistik kommer från den tillhandahållna webbplatsen och används inte för rating-schema. Kontrollera aktuella priser och tider på [Bokadirekt](https://www.bokadirekt.se/places/monaco-clinic-ab-137365) när innehållet uppdateras.
