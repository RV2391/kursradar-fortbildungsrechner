import { CME_FAQ, type FAQItem } from "./faqData";

const BASE_URL = "https://rechner.kurs-radar.com";
const PATH = "/cme-punkte-rechner";

export const cmeWebApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CME-Punkte-Rechner für Vertragszahnärzte (§ 95d SGB V)",
  url: `${BASE_URL}${PATH}`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "de-DE",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Kostenloser Rechner: Prüfe, wie viele Fortbildungspunkte dir im laufenden 5-Jahres-Zyklus nach § 95d SGB V noch fehlen. Mit Zyklus-Enddatum, monatlichem Punkte-Bedarf und Kurs-Empfehlungen aus dem KursRadar-Katalog.",
  publisher: {
    "@type": "Organization",
    name: "KursRadar",
    url: "https://kurs-radar.com",
  },
};

export const cmeHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Fortbildungspunkte-Nachweis nach § 95d SGB V rechtzeitig sichern",
  description:
    "In drei Schritten prüfst du deinen aktuellen Punktestand, planst den restlichen Zyklus und findest passende Kurse.",
  totalTime: "PT3M",
  inLanguage: "de-DE",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Zyklus-Enddatum und aktuellen Punktestand eingeben",
      text: "Trage dein persönliches Zyklus-Enddatum aus dem KZV-Konto und die bisher gesammelten Fortbildungspunkte ein. Der Rechner ermittelt daraus die verbleibende Zeit und den Punkte-Bedarf.",
      url: `${BASE_URL}${PATH}#schritt-1`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Monatlichen Punkte-Bedarf ablesen",
      text: "Der Rechner zeigt dir, wie viele Punkte pro Monat du im verbleibenden Zeitraum sammeln musst, um den Nachweis rechtzeitig zu erbringen — ohne Zeitdruck im letzten Zyklus-Jahr.",
      url: `${BASE_URL}${PATH}#schritt-2`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Passende Kurse auf KursRadar buchen",
      text: "Aus dem Ergebnis wird direkt zu Kursen mit passender Punkte-Bewertung im KursRadar-Katalog verlinkt. So planst du den restlichen Zyklus in konkreten Fortbildungsbuchungen statt in Vorsatz.",
      url: `${BASE_URL}${PATH}#schritt-3`,
    },
  ],
};

export const buildCmeFAQPageSchema = (items: FAQItem[] = CME_FAQ) => ({
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

export const buildCmeBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.path === "/" ? "" : item.path}`,
  })),
});
