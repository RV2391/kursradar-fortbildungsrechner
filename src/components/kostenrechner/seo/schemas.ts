import { KOSTENRECHNER_FAQ, type FAQItem } from "./faqData";

const BASE_URL = "https://rechner.kurs-radar.com";

export const kostenrechnerWebApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fortbildungskosten-Rechner für Zahnarztpraxen",
  url: BASE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "de-DE",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Kostenloser Rechner für Zahnarztpraxen: Berechne dein jährliches Einsparpotenzial durch optimierte Fortbildungsplanung. Kurskosten, Zeit, Reisekosten und Praxisausfall in einer Übersicht.",
  publisher: {
    "@type": "Organization",
    name: "KursRadar",
    url: "https://kurs-radar.com",
  },
};

export const kostenrechnerHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Fortbildungskosten einer Zahnarztpraxis kalkulieren und senken",
  description:
    "In drei Schritten berechnest du dein Einsparpotenzial und findest Fortbildungen mit besserem Kosten-Nutzen-Verhältnis.",
  totalTime: "PT4M",
  inLanguage: "de-DE",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Team-Größe und Anzahl der Zahnärzt:innen eintragen",
      text: "Team-Gesamtgröße und Anzahl der Zahnärzt:innen ergeben den Fortbildungsbedarf nach BZÄK-Empfehlungen (125 Punkte pro Zahnarzt in 5 Jahren) und das ZFA-Team-Volumen.",
      url: `${BASE_URL}/#schritt-1`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Praxisadresse für Reisekosten-Berechnung",
      text: "Deine Adresse wird für die Entfernungs-Berechnung zum nächsten Dental-Fortbildungsinstitut genutzt. Regionale Anbieter sparen typischerweise 40 bis 70 Prozent der Reisekosten gegenüber überregionalen Kongressen.",
      url: `${BASE_URL}/#schritt-2`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Einsparpotenzial und Kurs-Vorschläge einsehen",
      text: "Der Rechner zeigt aktuelle Kosten vs. optimierte Kosten, jährliches Einsparpotenzial und eingesparte Zeit. Optional: E-Mail-Analyse mit konkreten Kurs-Empfehlungen aus dem KursRadar-Katalog.",
      url: `${BASE_URL}/#schritt-3`,
    },
  ],
};

export const buildKostenrechnerFAQPageSchema = (items: FAQItem[] = KOSTENRECHNER_FAQ) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

export const kostenrechnerBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Fortbildungskosten-Rechner",
      item: BASE_URL,
    },
  ],
};
