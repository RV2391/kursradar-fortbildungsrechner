import { CmePunkteRechner } from "@/components/cme/CmePunkteRechner";
import { SEO } from "@/components/SEO";
import { CmePunkteHowTo } from "@/components/cme/seo/CmePunkteHowTo";
import { CmePunkteFAQ } from "@/components/cme/seo/CmePunkteFAQ";
import {
  cmeWebApplicationSchema,
  cmeHowToSchema,
  buildCmeFAQPageSchema,
  buildCmeBreadcrumbSchema,
} from "@/components/cme/seo/schemas";

const jsonLd = [
  cmeWebApplicationSchema,
  cmeHowToSchema,
  buildCmeFAQPageSchema(),
  buildCmeBreadcrumbSchema([
    { name: "Start", path: "/" },
    { name: "CME-Punkte-Rechner", path: "/cme-punkte-rechner" },
  ]),
];

const CmePunkte = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="CME-Punkte-Rechner Zahnärzte 2026 · Fortbildungsnachweis § 95d SGB V · KursRadar"
        description="Kostenloser CME-Rechner für Vertragszahnärzte: Prüfe in 30 Sekunden, wie viele Fortbildungspunkte dir im laufenden 5-Jahres-Zyklus noch fehlen. Mit monatlichem Bedarf und Kurs-Empfehlungen aus dem KursRadar-Katalog."
        path="/cme-punkte-rechner"
        jsonLd={jsonLd}
      />
      <div className="container py-12">
        <div className="mb-10 text-center">
          <h1 className="font-sans text-4xl font-bold text-foreground sm:text-5xl">
            <span className="text-primary">CME-Punkte</span>-Rechner
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Prüfe deinen Fortbildungs-Stand im laufenden 5-Jahres-Zyklus nach § 95d SGB V.
            Sehe sofort, wie viele Punkte dir noch fehlen — und wieviel Fortbildung pro Monat realistisch ist.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/70">
            Kostenlos · ohne Anmeldung · 125 Punkte in 5 Jahren
          </p>
        </div>

        <CmePunkteRechner />

        <CmePunkteHowTo />

        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
            Warum die 5-Jahres-Regel für Vertragszahnärzte relevant ist
          </h2>
          <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
            <p>
              § 95d SGB V verpflichtet alle Vertragszahnärztinnen und Vertragszahnärzte, alle fünf Jahre einen Fortbildungsnachweis über <strong>125 Fortbildungspunkte</strong> gegenüber der Kassenzahnärztlichen Vereinigung (KZV) zu erbringen. Der Zyklus beginnt individuell mit der Zulassung als Vertragszahnarzt oder mit dem letzten erfolgreichen Nachweis.
            </p>
            <p>
              In der Praxis heißt das: pro Kalenderjahr sollten <strong>25 Punkte</strong> auf dem Punktekonto ankommen — das entspricht etwa <strong>3 bis 4 Fortbildungstagen im Jahr</strong>. Praxen, die Team-Fortbildungen einplanen, kombinieren einen halbtägigen Praxis-Tag pro Halbjahr mit einem Kongress-Besuch — dann steht die Bilanz ohne Zeitdruck im letzten Jahr des Zyklus.
            </p>
            <p>
              Wer die 125 Punkte nicht rechtzeitig sammelt, dem drohen nach § 95d Absatz 3 SGB V gestaffelte Honorarkürzungen: 10 Prozent für die ersten vier Quartale, ab dem fünften Quartal 25 Prozent. Bei zweijähriger Nicht-Erbringung wird die Zulassungsentziehung geprüft. Der Handlungsdruck steigt also messbar im letzten Zyklus-Jahr — die frühzeitige Planung ist der Hebel.
            </p>
            <p>
              KursRadar bündelt Fortbildungen von aktuell über 60 Anbietern (u.a. Hochschul-Institute, Kammer-Fortbildungsakademien, Hersteller-Akademien und unabhängige Trainer:innen) an einem Ort. Der Rechner oben zeigt dir den monatlichen Punkte-Bedarf und verlinkt direkt in die Kurs-Suche mit passendem Punkte-Filter.
            </p>
          </div>
        </section>

        <CmePunkteFAQ />

        <section className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
            Credit Wallet: dein CME-Konto automatisiert
          </h2>
          <p className="text-muted-foreground mb-6">
            Manuelles Punkte-Tracken ist der Klassiker unter den vergessenen Aufgaben. Die Credit Wallet auf KursRadar übernimmt das für dich: automatische Uploads bei jeder Buchung, Erinnerung vor Zyklus-Ende, immer aktueller Punktestand. Kostenlos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.kurs-radar.com/credit-wallet?utm_source=rechner&utm_medium=cme_check&utm_campaign=cme_punkte_check&utm_content=footer_cta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition"
            >
              Credit Wallet ansehen
            </a>
            <a
              href="https://www.kurs-radar.com/veranstaltungen?utm_source=rechner&utm_medium=cme_check&utm_campaign=cme_punkte_check&utm_content=footer_kurse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-primary bg-transparent px-6 py-3 text-primary font-medium hover:bg-primary/10 transition"
            >
              Alle Kurse durchsuchen
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CmePunkte;
