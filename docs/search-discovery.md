# Sökbarhet och AI-sök för Monaco Clinic

Webbplatsens produktionsadress är **https://monacoclinic.se**, angiven av klinikens ägare. Domänen svarade med klinikens webbplats via Vercel den 13 oktober 2026. Den dåvarande versionen pekade fortfarande canonical och sitemap på Vercels projektadress; denna implementation använder klinikens egen domän som standard. Kontrollera att den senaste versionen faktiskt har publicerats. GitHub Actions bygger och testar projektet; en eventuell Vercel-koppling till GitHub sköter driftsättningen separat.

## Inför publicering

1. Driftsätt Next.js och koppla domänen med HTTPS. Använd `NEXT_PUBLIC_SITE_URL=https://monacoclinic.se`. Alla canonical-länkar, sitemap-adresser och strukturerade data ska hänvisa till samma värd. Kontrollera även www-varianten och HTTP så att besökare hamnar på den valda HTTPS-adressen.
2. Behåll `SITE_INDEXING_ENABLED=false` i egna staging- och förhandsmiljöer. Vercels preview/development och lokal utveckling hålls också utanför indexeringen. Åtkomstskydd på webbhotellet är lämpligt för interna förhandsversioner. `robots.txt` är en crawlerregel och ersätter inte åtkomstskydd; en blockerad crawler kan inte läsa sidans `noindex`.
3. Kontrollera den publicerade sidans HTML: rätt canonical, indexering tillåten i produktion, synliga behandlingstexter och kontaktuppgifter. Kontrollera `/robots.txt` och `/sitemap.xml`. Webbhotellets brandvägg och botskydd behöver tillåta avsedda sökcrawlers.
4. Verifiera ägarskap i Google Search Console och Bing Webmaster Tools och skicka in `/sitemap.xml`. Använd de verkliga verifieringsvärden tjänsterna utfärdar, exempelvis DNS-poster. Projektet innehåller inga påhittade Google-/Bing-verifieringsfiler. Verifiering och kontoåtkomst görs av den behöriga ägaren.
5. Uppdatera klinikens Google Business Profile med webbplatsadressen och samma namn, besöksadress, telefon, öppettider och behandlingar som på sidan. Kontrollera också klinikens Bokadirektprofil. Detta ändrar externa konton och görs av ägaren eller efter uttrycklig auktorisering.

## Innehåll som kan hittas och förstås

De separata behandlingssidorna innehåller vanlig serverrenderad HTML, tydliga lokala rubriker, frågor och svar, kontaktuppgifter och interna länkar. Strukturerade data beskriver verksamheten och behandlingarna och ska överensstämma med den synliga texten. Lägg inte till priser, betyg eller behandlarmeriter i schema som saknar aktuellt belägg och motsvarande synligt innehåll.

`llms.txt` och en Markdownöversikt kan erbjuda ett bekvämt läsformat för system som väljer att använda dem. Formatet är frivilligt; det ger ingen garanterad upptäckt eller citering. Google anger uttryckligen att sådana filer inte används för att förbättra synlighet eller ranking i Google Search eller dess AI-svar. Crawlbar, indexerad HTML och användbart, korrekt innehåll är grunden. FAQ-innehåll är användbart för besökare; Google slutade visa FAQ rich results i maj 2026.

Produktionsmiljöns wildcardregel i `robots.txt` tillåter crawlers generellt. Denna ändring är inte ett separat beslut om AI-träning; olika leverantörer skiljer mellan sökcrawlers, användarinitierade besök och träningscrawlers. Ingen särskild ny träningspolicy läggs till av IndexNow-kommandot.

## Manuell IndexNow-anmälan

IndexNow informerar deltagande sökmotorer om ändrade URL:er. Det ersätter inte sitemap, webbplatsverifiering eller tillgänglig HTML, och en mottagningskvittens garanterar varken indexering eller ranking. Projektets publika verifieringsfil är `/indexnow-key.txt`; varje anmälan anger dess fullständiga `keyLocation`.

Kommandot körs **inte** automatiskt vid bygge, test eller publicering. När sidan är byggd kan du granska anmälan utan nätverksanrop:

```sh
npm run build
npm run indexnow -- --dry-run
```

Dry-run läser den byggda sitemapen från `.next/server/app/sitemap.xml.body`. Den visar exakt payload och gör inga HTTP-anrop. Om bygget har tom sitemap eller använder annan origin avbryts kommandot; bygg först rätt produktionsversion. CLI:t använder miljövariabeln `NEXT_PUBLIC_SITE_URL` om den är satt, annars `https://monacoclinic.se`; det läser inte automatiskt Next.js `.env.local`.

Efter publicering, när domänen visar denna implementation och den publika nyckelfilen, kan du manuellt skicka anmälan:

```sh
npm run indexnow
```

Kommandot verifierar nyckelfilen, den publika sitemapen, crawlerreglerna och varje sidas canonical-/noindex-inställning innan ett POST-anrop skickas till `https://api.indexnow.org/indexnow`. Det avvisar fel värd, lokala/IP-adresser, omdirigeringar, ogiltiga nycklar, tomma/överstora sitemaps och blockerade sidor. Anrop har tio sekunders timeout och antalet samtidiga sidkontroller begränsas. `SITE_INDEXING_ENABLED=false` och kända förhandsmiljöer stoppar körningen.

HTTP 200 betyder mottagen anmälan; HTTP 202 betyder mottagen anmälan med väntande nyckelkontroll. Övriga svar räknas som misslyckade. Vid en timeout kan servern ändå ha hunnit ta emot anmälan; kommandot påstår bara framgång när en kvittens faktiskt har verifierats. Kör vid relevanta innehållsändringar, inte upprepade gånger utan anledning.

## Officiella källor

- [IndexNow: protokoll, nyckelfil och svarskoder](https://www.indexnow.org/documentation)
- [Google: generativa AI-sökfunktioner och llms.txt](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: noindex och robots.txt](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: dokumentationsändringar, inklusive avvecklade FAQ rich results](https://developers.google.com/search/updates)
- [Google Search Console: verifiera ägarskap](https://support.google.com/webmasters/answer/9008080)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/)
