# Instagramflödet från @monacoklinik

Flödet hämtar upp till sex verkliga inlägg på servern via **Instagram API with Instagram Login**. Bilder, videominiatyrer och bildserier länkar till respektive originalinlägg. Det skrapar inte Instagram och innehåller inga påhittade inlägg. Utan behörighet, eller om API:t tillfälligt inte svarar, visas en länk till klinikens profil.

## Aktivera

1. Kontot `monacoklinik` behöver vara ett professionellt Instagramkonto (Business eller Creator).
2. Skapa eller välj en Meta-app och konfigurera **Instagram API with Instagram Login**. Denna inloggningsväg kräver inte en kopplad Facebooksida. Använd inte den nedlagda Basic Display API:n eller en Facebook Login-token.
3. Kontots ägare auktoriserar appen med behörigheten `instagram_business_basic`. Kontot måste ha åtkomst till appen enligt Metas aktuella åtkomst- och granskningskrav. Kontrollera appens dashboard för vilka steg som krävs för ert konto och produktionsläge.
4. Hämta kontots numeriska Instagram User ID och en giltig långlivad Instagram User Access Token via Metas officiella installations-/inloggningsflöde. Detta repo implementerar inte ett publikt OAuth-gränssnitt; använd appens Meta-dashboard eller en separat, säker administrativ OAuth-integration.
5. Lägg dessa variabler i driftplattformens hemliga miljövariabler (lokalt i den Git-ignorerade `.env.local`):

   ```dotenv
   INSTAGRAM_USER_ID=kontots_numeriska_id
   INSTAGRAM_ACCESS_TOKEN=kontots_langlivade_token
   ```

6. Starta om/bygg om driftsättningen efter ändringen. Kontrollera att den visar kontots riktiga inlägg. Inlägg uppdateras med Next.js återvalidering en gång per timme. Kontrollera också att webbhotellet kan nå `graph.instagram.com` och att webbläsaren kan ladda bilder från Instagrams/Metas CDN.

**Dela inte token i chattar, GitHub, frontendkod eller någon `NEXT_PUBLIC_`-variabel.** ID och token läses endast i `src/lib/instagram.ts`, som använder `server-only`. Token skickas i Authorization-headern, inte i en publik URL. Råa API-svar och hemligheter loggas inte av integrationen.

## Tokenunderhåll

En långlivad token behöver förnyas före sitt utgångsdatum. Metas tokenflöde anger normalt 60 dagar; utgå alltid från svarets faktiska `expires_in` och kontrollera aktuell dokumentation. Om ett kortlivat token erhålls i OAuth-flödet byts det server-side via `GET https://graph.instagram.com/access_token` med `grant_type=ig_exchange_token`, appens hemlighet och token.

Förnyelse görs server-side via `GET https://graph.instagram.com/refresh_access_token` med `grant_type=ig_refresh_token` och en giltig, långlivad token. Token ska vara minst 24 timmar gammal och ännu inte ha gått ut. Spara den token och giltighet som svaret returnerar i driftplattformens hemlighetshantering; driftsätt/starta om så att appen använder aktuellt värde. En redan utgången eller återkallad token kräver ny auktorisering.

För en manuellt skött sajt: förnya exempelvis var 30:e dag och dokumentera giltighetsdatum. För automatisk drift: använd ett skyddat schemalagt serverjobb och beständig hemlighetshantering. Webbplatsen förnyar **inte** token automatiskt och skriver inte till miljövariabler. API-versionen för dataanrop är uttryckligen låst till `v25.0`; uppgradera först efter kontroll av Metas ändringar och test mot kontot.

## Avsiktliga begränsningar

- Videor öppnas på Instagram från sin miniatur; inget autospel eller tredjepartsskript laddas.
- Bildserier visar sin första bild/video-miniatur och öppnar hela serien på Instagram.
- API-anropet har fem sekunders timeout. Ogiltiga länkar och mediefält filtreras bort. Endast HTTPS-länkar till Instagrams inlägg och CDN-bilder från `cdninstagram.com`/`fbcdn.net` visas.
- API:t måste auktoriseras av kontots ägare innan ett liveflöde kan verifieras. Profilens offentliga webbadress räcker inte som API-behörighet.

## Officiella källor

- [Meta: Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Meta: Get started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started)
- [Meta: IG User / media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media)
- [Meta: Access Token](https://developers.facebook.com/docs/instagram-platform/reference/access_token)
- [Meta: Refresh Access Token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token)
- [Metas officiella Instagram-samling i Postman](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api)
