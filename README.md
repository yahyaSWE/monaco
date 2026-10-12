# Monaco Klinik

Next.js-webbplats för Monaco Klinik i Eskilstuna, ombyggd från [den tidigare Lovable-sidan](https://champagne-gold-glow.lovable.app/). Innehåll och originalbilder har bevarats, med ny responsiv design och egna lokala SEO-sidor för laserhårborttagning, microblading, läppigmentering, Hydrofacial och microneedling.

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

Ange `NEXT_PUBLIC_SITE_URL` som webbplatsens riktiga publika HTTPS-origin, utan sökväg, när produktionsdomänen är bestämd. Den används för canonical-länkar, delningsmetadata och sitemap. Bygg om efter ändringen. På Vercel används `VERCEL_PROJECT_PRODUCTION_URL` som automatisk reserv om den egna variabeln saknas.

Utan en giltig publik produktionsadress får sidan `noindex`, blockerande `robots.txt` och en tom sitemap. Vercels preview- och developmentmiljöer förblir `noindex` även om produktionsadressen är konfigurerad. Ingen slutlig domän eller hosting är vald i repot.

## Instagram

Integrationen kan visa riktiga inlägg från `@monacoklinik` när kontots ägare har auktoriserat Instagram API. Konfigurera serverhemligheterna `INSTAGRAM_ACCESS_TOKEN` och `INSTAGRAM_USER_ID` i driftplattformen. Lägg aldrig en token i GitHub eller i en `NEXT_PUBLIC_`-variabel.

Utan API-behörighet visas en länk till Instagramprofilen. [Installations- och underhållsguiden](docs/instagram.md) beskriver behörigheter och tokenförnyelse. Token behöver förnyas före utgångsdatum; webbplatsen gör inte det automatiskt.

## Ändra innehåll

- Behandlingstexter och FAQ: [`src/lib/content.ts`](src/lib/content.ts).
- Kontaktuppgifter och bokningslänkar: [`src/lib/site.ts`](src/lib/site.ts).
- Startsida, om oss, kontakt och övriga sidor: [`src/app`](src/app).
- Gemensamma komponenter och design: [`src/components`](src/components) och [`src/app/globals.css`](src/app/globals.css).
- Bilder: [`public/images`](public/images).

[Källor och innehållsinventering](docs/content-sources.md) dokumenterar den ursprungliga sidan, bokningsinformationen och bilderna. Ursprungliga kundcitat och statistik kommer från den tillhandahållna webbplatsen och används inte för rating-schema. Kontrollera aktuella priser och tider på [Bokadirekt](https://www.bokadirekt.se/places/monaco-clinic-ab-137365) när innehållet uppdateras.
