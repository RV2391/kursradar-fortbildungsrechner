import { CostCalculator } from "@/components/CostCalculator";
import { GTMDebugger } from "@/components/GTMDebugger";
import { SEO } from "@/components/SEO";
import { KostenrechnerHowTo } from "@/components/kostenrechner/seo/KostenrechnerHowTo";
import { KostenrechnerFAQ } from "@/components/kostenrechner/seo/KostenrechnerFAQ";
import {
  kostenrechnerWebApplicationSchema,
  kostenrechnerHowToSchema,
  buildKostenrechnerFAQPageSchema,
  kostenrechnerBreadcrumbSchema,
} from "@/components/kostenrechner/seo/schemas";

const jsonLd = [
  kostenrechnerWebApplicationSchema,
  kostenrechnerHowToSchema,
  buildKostenrechnerFAQPageSchema(),
  kostenrechnerBreadcrumbSchema,
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Fortbildungskosten-Rechner Zahnarztpraxis 2026 · Einsparpotenzial berechnen · KursRadar"
        description="Kostenloser Rechner für Zahnarztpraxen: Berechne dein jährliches Einsparpotenzial bei Fortbildungskosten. Kurskosten, Zeit, Reisekosten und Praxisausfall in einer Übersicht. Konservativer Ansatz mit BZÄK- und VMF-Quellen."
        path="/"
        jsonLd={jsonLd}
      />
      <div className="container py-12">
        <div className="mb-10 text-center">
          <h1 className="font-montserrat text-4xl font-bold text-foreground sm:text-5xl">
            <span className="text-primary">Kurs</span>Radar Kostenrechner
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
            Berechne, wie viel deine Zahnarztpraxis jährlich an Fortbildungskosten spart —
            durch strukturierte Planung, regionale Anbieter-Auswahl und Team-Bündelung.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/70 font-roboto">
            Kostenlos · ohne Anmeldung · sofortiges Ergebnis
          </p>
        </div>

        <CostCalculator />

        <KostenrechnerHowTo />

        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="font-montserrat text-2xl font-semibold text-foreground mb-4">
            Warum sich Fortbildungsplanung wirtschaftlich lohnt
          </h2>
          <div className="prose prose-slate max-w-none font-roboto text-muted-foreground space-y-4">
            <p>
              Fortbildung ist für zahnärztliche Praxen kein Kostenblock, den man einfach hinnimmt. Vertragszahnärzt:innen müssen alle fünf Jahre <strong>125 Fortbildungspunkte</strong> nach § 95d SGB V nachweisen, ZFAs brauchen für ihre Aufstiegsfortbildungen strukturierte Kurse. Der jährliche Gesamt-Aufwand einer Praxis mit 4 bis 6 Mitarbeitenden liegt schnell zwischen <strong>15.000 und 30.000 Euro</strong> — Kursgebühren, Reisekosten, Übernachtungen und Umsatzausfall zusammengerechnet.
            </p>
            <p>
              Der größte einzelne Kostentreiber ist dabei nicht die Kursgebühr, sondern der <strong>Praxis-Umsatzausfall</strong> während der Fortbildungszeit. Ein Ganztags-Kurs bindet oft mehr Umsatz als er an direkter Gebühr kostet. Wer regional statt überregional bucht, spart typischerweise 40 bis 70 Prozent Reisekosten. Wer Team-Fortbildungen an einem geplanten Praxis-Team-Tag bündelt statt verteilt über das Jahr, senkt den Umsatzausfall messbar.
            </p>
            <p>
              KursRadar bündelt Fortbildungen von aktuell über 60 Anbietern an einem Ort — Kammer-Fortbildungsakademien, Hochschul-Institute, Hersteller-Akademien und unabhängige Trainer:innen. Die transparente Preisdarstellung, die Peer-Review-Kennzeichnung und die regionale Filterung machen strukturierte Planung möglich, ohne stundenlange Eigenrecherche. Der Rechner oben zeigt, wie sich das für deine Praxis konkret rechnet.
            </p>
            <p>
              Wichtig: die im Rechner gezeigten Werte sind konservativ kalkuliert und basieren auf BZÄK-Empfehlungen zu Fortbildungspunkten, branchenüblichen Reisekostenpauschalen und typischen Behandlungshonorar-Sätzen. Deine tatsächliche Ersparnis kann höher liegen, wenn du bisher wenig Struktur in der Fortbildungsplanung hattest — oder niedriger, wenn deine Praxis bereits bewusst regional und Team-orientiert plant.
            </p>
          </div>
        </section>

        <KostenrechnerFAQ />

        <section className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="font-montserrat text-2xl font-semibold text-foreground mb-4">
            Bereit für strukturierte Fortbildungsplanung?
          </h2>
          <p className="text-muted-foreground font-roboto mb-6">
            Die Credit Wallet auf KursRadar automatisiert dein CME-Punkte-Konto: automatische Uploads bei jeder Buchung, Erinnerung vor Zyklus-Ende, immer aktueller Punktestand. Kostenlos für Praxen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.kurs-radar.com/credit-wallet?utm_source=rechner&utm_medium=kostenrechner&utm_campaign=fortbildungskosten&utm_content=footer_wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-roboto font-medium hover:bg-primary/90 transition"
            >
              Credit Wallet ansehen
            </a>
            <a
              href="https://www.kurs-radar.com/veranstaltungen?utm_source=rechner&utm_medium=kostenrechner&utm_campaign=fortbildungskosten&utm_content=footer_kurse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-primary bg-transparent px-6 py-3 text-primary font-roboto font-medium hover:bg-primary/10 transition"
            >
              Alle Kurse durchsuchen
            </a>
          </div>
        </section>
      </div>
      <GTMDebugger />
    </div>
  );
};

export default Index;
