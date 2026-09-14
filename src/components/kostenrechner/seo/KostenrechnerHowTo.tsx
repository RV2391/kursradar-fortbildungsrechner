import { Users, MapPin, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "1. Team-Größe eintragen",
    text: "Team-Gesamtgröße und Anzahl der Zahnärzt:innen — daraus ergibt sich der Fortbildungsbedarf nach BZÄK-Empfehlungen und das ZFA-Team-Volumen.",
  },
  {
    icon: MapPin,
    title: "2. Praxisadresse angeben (optional)",
    text: "Wir berechnen die Entfernung zum nächsten Fortbildungsinstitut. Regionale Alternativen sparen typischerweise 40 bis 70 Prozent der Reisekosten.",
  },
  {
    icon: TrendingUp,
    title: "3. Einsparpotenzial sehen",
    text: "Aktuelle Kosten vs. optimiert mit KursRadar. Sofortiges Ergebnis, keine Anmeldung nötig. Optional per E-Mail eine ausführliche Kurs-Analyse.",
  },
];

export const KostenrechnerHowTo = () => (
  <section id="so-funktionierts" className="mt-16 max-w-4xl mx-auto">
    <h2 className="font-montserrat text-2xl font-semibold text-foreground mb-8 text-center">
      So funktioniert der Kostenrechner
    </h2>
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div
            key={idx}
            id={`schritt-${idx + 1}`}
            className="bg-card border rounded-lg p-6 shadow-sm"
          >
            <Icon className="h-8 w-8 text-primary mb-4" aria-hidden />
            <h3 className="font-montserrat text-lg font-semibold text-card-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground font-roboto text-sm leading-relaxed">
              {step.text}
            </p>
          </div>
        );
      })}
    </div>
  </section>
);
