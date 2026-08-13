import { BILDUNGSURLAUB_FAQ, type FAQItem } from "./faqData";

const BASE_URL = "https://rechner.kurs-radar.com";

export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bildungsurlaub-Check für Zahnärzte, ZFA und Zahntechniker",
  url: `${BASE_URL}/bildungsurlaub`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "de-DE",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Kostenloser Rechner: Prüfe deinen Anspruch auf bezahlten Bildungsurlaub für zahnmedizinische Fortbildungen in allen 16 Bundesländern. Inkl. Kleinbetriebsklausel, Antragsfristen und Anerkennungsstellen.",
  publisher: {
    "@type": "Organization",
    name: "KursRadar",
    url: "https://kurs-radar.com",
  },
};

export const bildungsurlaubHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Bildungsurlaub für zahnmedizinische Fortbildungen beantragen",
  description:
    "In drei Schritten prüfst du deinen Anspruch und erhältst einen fertigen Antrag für deinen Arbeitgeber.",
  totalTime: "PT5M",
  inLanguage: "de-DE",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Anspruch prüfen",
      text: "Bundesland, Berufsgruppe (ZFA, angestellte Zahnärztin, Zahntechniker) und Praxisgröße angeben. Der Rechner prüft Bildungsurlaubsgesetz, Kleinbetriebsklausel und Wartezeit.",
      url: `${BASE_URL}/bildungsurlaub#schritt-1`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Wunschkurs eintragen",
      text: "Kurs-URL von kurs-radar.com einfügen. Titel, Datum, Anbieter und Ort werden automatisch übernommen. Alternativ Kursdaten manuell eintragen.",
      url: `${BASE_URL}/bildungsurlaub#schritt-2`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Antragsmuster erhalten",
      text: "E-Mail-Adresse eintragen und personalisierten Musterantrag als PDF erhalten. Direkt beim Arbeitgeber einreichen — unter Einhaltung der Antragsfrist deines Bundeslandes.",
      url: `${BASE_URL}/bildungsurlaub#schritt-3`,
    },
  ],
};

export const buildFAQPageSchema = (items: FAQItem[] = BILDUNGSURLAUB_FAQ) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

interface BreadcrumbItem {
  name: string;
  path: string;
}

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.path === "/" ? "" : item.path}`,
  })),
});
