export interface Treatment {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  seoDescription: string;
  image: string;
  imageAlt: string;
  intro: string[];
  details: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  related: string[];
}

export const treatments: Treatment[] = [
  {
    slug: "laserharborttagning-eskilstuna",
    name: "Laserhårborttagning",
    eyebrow: "En enklare vardag",
    description:
      "Laserbehandling med målet att minska hårväxten steg för steg, med en plan som utgår från dig.",
    seoDescription:
      "Laserhårborttagning i Eskilstuna hos Monaco Clinic. Få en personlig konsultation och en behandlingsplan på Hällstugatan 16. Boka via Bokadirekt.",
    image: "/images/laser.jpg",
    imageAlt: "Ljust behandlingsrum med utrustning för laser",
    intro: [
      "Vill du lägga mindre tid på att ta bort oönskat hår? Hos Monaco Clinic erbjuder vi laserhårborttagning i Eskilstuna med fokus på ett personligt upplägg och ett lugnt bemötande. Behandlingen syftar till att minska hårväxten över tid. Dina förutsättningar och det område du vill behandla är utgångspunkten för samtalet.",
      "Varje behandling börjar med en konsultation. Där går vi igenom dina önskemål, pratar om vad du kan förvänta dig och tar fram ett förslag på hur din behandling kan läggas upp. Du får möjlighet att ställa frågor innan du bestämmer dig. På vår klinik på Hällstugatan 16 finns tid för både vägledning och omsorg om dig som kund.",
    ],
    details: [
      {
        title: "Ditt mål först",
        text: "Vi börjar med vad du vill förändra i din vardag och vilka områden du vill diskutera. Konsultationen hjälper oss att rekommendera ett upplägg utifrån dina egna förutsättningar.",
      },
      {
        title: "Ett steg i taget",
        text: "Målet är mindre hårväxt genom ett individuellt upplägg. Hur behandlingsplanen ser ut och vilka förväntningar som är rimliga går vi igenom tillsammans vid konsultationen.",
      },
      {
        title: "Lugn miljö, tydlig vägledning",
        text: "Du är välkommen att fråga om metoden, planeringen och nästa steg. Vi vill att du ska förstå behandlingen och känna dig bekväm med ditt val innan vi går vidare.",
      },
    ],
    faqs: [
      {
        question: "Var kan jag boka laserhårborttagning i Eskilstuna?",
        answer:
          "Monaco Clinic finns på Hällstugatan 16, 633 53 Eskilstuna. Du kan se tillgängliga tider och boka via vår sida på Bokadirekt, eller kontakta oss på 073-577 19 91.",
      },
      {
        question: "Hur börjar jag med laserhårborttagning?",
        answer:
          "Börja med en personlig konsultation. Vi pratar om dina önskemål, går igenom behandlingen och hjälper dig att förstå vilket upplägg som kan passa dig.",
      },
      {
        question: "Hur många laserbehandlingar behöver jag?",
        answer:
          "Behandlingsplanen är individuell. Vi går igenom dina förutsättningar och önskemål vid konsultationen och diskuterar hur ett upplägg kan se ut. Då får du en rekommendation och möjlighet att prata om dina förväntningar.",
      },
      {
        question: "Kan jag få råd innan jag bestämmer mig?",
        answer:
          "Ja. Konsultationen ger dig möjlighet att ställa frågor om laserhårborttagning och prata om dina förväntningar. Kontakta oss eller boka en konsultation via Bokadirekt.",
      },
    ],
    related: ["hydrofacial-eskilstuna", "microneedling-eskilstuna"],
  },
  {
    slug: "microblading-eskilstuna",
    name: "Microblading",
    eyebrow: "Bryn med din karaktär",
    description:
      "Hårstråliknande bryn med fokus på mjuk form, balans och ett uttryck som passar ditt ansikte.",
    seoDescription:
      "Microblading i Eskilstuna hos Monaco Clinic. Utforska hårstråliknande bryn och en form anpassad efter dig. Boka konsultation på Hällstugatan 16.",
    image: "/images/about.jpg",
    imageAlt: "Monaco Clinics lugna behandlingsrum",
    intro: [
      "Ögonbrynen ramar in ansiktet, och små skillnader i form kan göra mycket för helhetsintrycket. Vår microblading i Eskilstuna utgår från ett mjukt, naturligt uttryck med hårstråliknande bryn. Vi lyssnar på vad du tycker om hos dina bryn och vilken form du vill närma dig, så att ditt eget uttryck får vara i centrum.",
      "Hos Monaco Clinic börjar vi med en personlig konsultation där vi pratar om form, balans och dina förväntningar. Du får beskriva din stil och ställa frågor om behandlingen innan vi rekommenderar nästa steg. Målet är ett genomtänkt val för dig, med samma omsorg om detaljerna som om upplevelsen i behandlingsrummet.",
    ],
    details: [
      {
        title: "Form utifrån ditt ansikte",
        text: "Vi diskuterar dina bryns form och det uttryck du önskar. Dina personliga önskemål vägleder rekommendationen, med fokus på mjukhet och balans.",
      },
      {
        title: "Hårstråliknande detaljer",
        text: "Microblading arbetar med detaljer som liknar brynens egna hårstrån. Inriktningen är ett naturligt helhetsintryck som vi går igenom med dig under konsultationen.",
      },
      {
        title: "Utrymme för dina frågor",
        text: "Du får prata om metoden, förväntningar och fortsatt planering innan du bestämmer dig. Vi hjälper dig att ta ställning till behandlingen utifrån vad du vill uppnå.",
      },
    ],
    faqs: [
      {
        question: "Vad är microblading?",
        answer:
          "Microblading är en brynbehandling som skapar hårstråliknande detaljer. Hos Monaco Clinic är inriktningen en mjuk och balanserad form med ett naturligt uttryck.",
      },
      {
        question: "Hur väljer vi formen på mina bryn?",
        answer:
          "Vid konsultationen pratar vi om dina nuvarande bryn, din stil och den form du önskar. Vi utgår från ditt ansikte och dina önskemål när vi ger en rekommendation.",
      },
      {
        question: "Var finns Monaco Clinic för microblading i Eskilstuna?",
        answer:
          "Du hittar oss på Hällstugatan 16, 633 53 Eskilstuna. Boka din konsultation via Bokadirekt eller ring 073-577 19 91 om du vill prata med oss först.",
      },
      {
        question: "Kan jag boka konsultation om jag är osäker?",
        answer:
          "Ja. Du behöver inte ha bestämt en brynform för att boka. Konsultationen är till för att gå igenom dina önskemål, svara på frågor och diskutera om behandlingen passar det uttryck du söker.",
      },
    ],
    related: ["lappigmentering-eskilstuna", "hydrofacial-eskilstuna"],
  },
  {
    slug: "lappigmentering-eskilstuna",
    name: "Läppigmentering",
    eyebrow: "En mjuk ton av dig",
    description:
      "Diskret färg och kontur med fokus på läpparnas egen form och en jämnare, mjuk ton.",
    seoDescription:
      "Läppigmentering i Eskilstuna på Monaco Clinic. Personlig konsultation om färg, kontur och ett diskret uttryck. Boka på Hällstugatan 16.",
    image: "/images/products.jpg",
    imageAlt: "Hudvårdsprodukter i en varm och rofylld miljö",
    intro: [
      "En diskret nyans kan framhäva läpparnas uttryck utan att ta över. Läppigmentering hos Monaco Clinic i Eskilstuna fokuserar på färg, kontur och en jämnare ton, med läpparnas egen form som utgångspunkt. Vi vill förstå om du söker en försiktig färgförändring eller ett mer definierat uttryck innan vi ger en rekommendation.",
      "Din behandling inleds med en konsultation där vi tillsammans pratar om dina önskemål och förväntningar. Här finns utrymme för frågor om både färgval och metoden. Vår utgångspunkt är ett personligt förslag som framhäver dig, i en lugn miljö där du kan ta ställning till nästa steg i din egen takt.",
    ],
    details: [
      {
        title: "Färg med personlig känsla",
        text: "Vi pratar om vilken ton du vill ha och hur diskret uttrycket ska vara. Dina önskemål hjälper oss att föreslå en riktning som känns rätt för dig.",
      },
      {
        title: "Läpparnas form i centrum",
        text: "Behandlingen är inriktad på färg och kontur. Vi utgår från läpparnas egen form när vi diskuterar det uttryck du vill uppnå.",
      },
      {
        title: "Ett genomtänkt beslut",
        text: "Konsultationen ger plats för frågor och en genomgång av behandlingen. Vi pratar om dina förväntningar och hjälper dig att förstå rekommendationen innan du bestämmer dig.",
      },
    ],
    faqs: [
      {
        question: "Vad är målet med läppigmentering?",
        answer:
          "Målet är att framhäva läpparna med färg och kontur och skapa en jämnare ton. På Monaco Clinic är inriktningen ett diskret uttryck som utgår från läpparnas egen form.",
      },
      {
        question: "Hur väljer jag färg för min läppigmentering?",
        answer:
          "Färgvalet diskuteras vid din personliga konsultation. Berätta vilken ton och vilket uttryck du önskar, så går vi igenom alternativen och ger ett förslag utifrån dig.",
      },
      {
        question: "Var kan jag boka läppigmentering i Eskilstuna?",
        answer:
          "Du bokar via Monaco Clinics sida på Bokadirekt. Kliniken ligger på Hällstugatan 16, 633 53 Eskilstuna. Du kan också nå oss på 073-577 19 91.",
      },
      {
        question: "Börjar behandlingen med en konsultation?",
        answer:
          "Ja. Vi börjar med att prata om dina önskemål, färg, kontur och förväntningar. Du får möjlighet att ställa frågor och förstå upplägget innan behandlingen planeras.",
      },
    ],
    related: ["microblading-eskilstuna", "hydrofacial-eskilstuna"],
  },
  {
    slug: "hydrofacial-eskilstuna",
    name: "Hydrofacial",
    eyebrow: "Tid för din hud",
    description:
      "Rengöring, mild peeling och återfuktning i en ansiktsbehandling med fokus på hudens lyster.",
    seoDescription:
      "Hydrofacial i Eskilstuna hos Monaco Clinic. Ansiktsbehandling med rengöring, mild peeling och återfuktning. Boka konsultation på Hällstugatan 16.",
    image: "/images/facial.jpg",
    imageAlt: "Avslappnande ansiktsbehandling i en lugn miljö",
    intro: [
      "Ge huden en stund av omsorg. Hydrofacial på Monaco Clinic i Eskilstuna kombinerar rengöring, mild peeling och återfuktning i en ansiktsbehandling med lyster som mål. Det är också en möjlighet att stanna upp och låta hudvården få plats i en lugn och välkomnande miljö.",
      "Vi börjar med att lyssna på hur du upplever din hud och vad du önskar av behandlingen. Den personliga konsultationen hjälper oss att rekommendera ett upplägg för dig. Oavsett om du vill lägga mer fokus på din hudvårdsrutin eller bara utforska våra ansiktsbehandlingar får du vägledning och tid att ställa frågor.",
    ],
    details: [
      {
        title: "Rengöring och mild peeling",
        text: "Hydrofacial kombinerar rengöring med en mild peeling. Vi går igenom behandlingen och dina önskemål i konsultationen, så att du vet vad den innebär.",
      },
      {
        title: "Återfuktning och lyster",
        text: "Återfuktning är en central del av behandlingen. Fokus ligger på att vårda huden och framhäva dess lyster, med ett upplägg som utgår från ditt samtal med oss.",
      },
      {
        title: "En paus med omsorg",
        text: "På Monaco Clinic möter hudvård ett rofyllt behandlingsrum. Vi lägger omsorg både på behandlingen och på att du ska känna dig välkommen under ditt besök.",
      },
    ],
    faqs: [
      {
        question: "Vad ingår i en hydrofacial?",
        answer:
          "Vår hydrofacial kombinerar rengöring, mild peeling och återfuktning. Vid konsultationen går vi igenom behandlingen och pratar om vad du vill ge din hud.",
      },
      {
        question: "Kan jag få hjälp att välja ansiktsbehandling?",
        answer:
          "Ja. Berätta hur du upplever din hud och vad du önskar, så hjälper vi dig att jämföra våra behandlingar. Vi rekommenderar ett upplägg efter en personlig konsultation.",
      },
      {
        question: "Var erbjuds hydrofacial i Eskilstuna?",
        answer:
          "Monaco Clinic erbjuder hydrofacial på Hällstugatan 16, 633 53 Eskilstuna. Boka via Bokadirekt eller kontakta oss på 073-577 19 91 för frågor inför besöket.",
      },
      {
        question: "Hur bokar jag en konsultation för hydrofacial?",
        answer:
          "Använd bokningslänken till Monaco Clinic på Bokadirekt för att se lediga tider. Du kan också ringa eller mejla oss om du vill ha hjälp med att välja nästa steg.",
      },
    ],
    related: ["microneedling-eskilstuna", "laserharborttagning-eskilstuna"],
  },
  {
    slug: "microneedling-eskilstuna",
    name: "Microneedling",
    eyebrow: "Hudvård med riktning",
    description:
      "En behandling som stimulerar hudens egen förnyelse, med målet att arbeta mot en jämnare hud över tid.",
    seoDescription:
      "Microneedling i Eskilstuna hos Monaco Clinic. Utforska en behandling för hudens förnyelse med en personlig konsultation på Hällstugatan 16.",
    image: "/images/facial.jpg",
    imageAlt: "Ansiktsbehandling i Monaco Clinics rofyllda miljö",
    intro: [
      "När du vill arbeta med hudens struktur börjar vi med att förstå ditt mål. Microneedling hos Monaco Clinic i Eskilstuna är en behandling där små kanaler skapas i huden för att stimulera dess egen förnyelse. Inriktningen är en jämnare och fastare hud över tid, med individuella förutsättningar som grund för planeringen.",
      "Vi ser konsultationen som en viktig del av din hudresa. Där pratar vi om hur du upplever huden, vilket resultat du hoppas på och vad behandlingen innebär. Tillsammans går vi igenom ett personligt förslag. Du får tydlig vägledning och möjlighet att ställa frågor innan du väljer hur du vill gå vidare.",
    ],
    details: [
      {
        title: "Hudens egen förnyelse",
        text: "Microneedling skapar små kanaler i huden med syftet att stimulera dess förnyelse. Vi förklarar metoden under konsultationen och pratar om dina förväntningar.",
      },
      {
        title: "Ett personligt upplägg",
        text: "Dina önskemål och förutsättningar styr rekommendationen. Vi går igenom planeringen tillsammans och diskuterar vad som kan vara ett rimligt mål för just dig.",
      },
      {
        title: "Vägledning inför nästa steg",
        text: "Du får möjlighet att ställa frågor om behandlingen och dess upplägg. Vi hjälper dig att förstå vårt förslag och de instruktioner som gäller för din behandling.",
      },
    ],
    faqs: [
      {
        question: "Vad är microneedling?",
        answer:
          "Microneedling är en behandling som skapar små kanaler i huden för att stimulera hudens egen förnyelse. Hos Monaco Clinic är målet att arbeta mot en jämnare och fastare hud över tid.",
      },
      {
        question: "Hur vet jag om microneedling passar mina önskemål?",
        answer:
          "Boka en personlig konsultation där vi pratar om din hud och dina mål. Vi går igenom metoden, svarar på dina frågor och rekommenderar ett upplägg utifrån dina förutsättningar.",
      },
      {
        question: "Hur många behandlingar ska jag planera för?",
        answer:
          "Det diskuterar vi i konsultationen. Planen anpassas efter dina förutsättningar och önskemål. Antal behandlingar och förväntningar behöver därför bedömas individuellt.",
      },
      {
        question: "Hur bokar jag microneedling i Eskilstuna?",
        answer:
          "Boka en tid hos Monaco Clinic via Bokadirekt. Vi finns på Hällstugatan 16, 633 53 Eskilstuna. Ring 073-577 19 91 om du har frågor innan du bokar.",
      },
    ],
    related: ["hydrofacial-eskilstuna", "laserharborttagning-eskilstuna"],
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((treatment) => treatment.slug === slug);
}
