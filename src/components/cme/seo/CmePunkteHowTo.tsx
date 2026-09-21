import { Calendar, Calculator, GraduationCap } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "1. Zyklus-Enddatum und Punktestand eingeben",
    text: "Dein persönliches Zyklus-Enddatum findest du im Online-Konto deiner KZV. Zusammen mit den bisher gesammelten Punkten hat der Rechner alles, was er braucht.",
  },
  {
    icon: Calculator,
    title: "2. Monatlichen Punkte-Bedarf ablesen",
    text: "Sofort siehst du, wie viele Punkte pro Monat du im verbleibenden Zeitraum sammeln solltest – realistischer als der Reflex, alle 125 auf einmal gegen Zyklus-Ende zu sammeln.",
  },
  {
    icon: GraduationCap,
    title: "3. Passende Kurse direkt finden",
    text: "Wir zeigen dir Fortbildungen auf KursRadar mit passender Punkte-Bewertung, sortiert nach Datum und Region. Buchung erfolgt bei uns, du behältst den Überblick.",
  },
];

export const CmePunkteHowTo = () => (
  <section id="so-funktionierts" className="mt-16 max-w-4xl mx-auto">
    <h2 className="font-sans text-2xl font-semibold text-foreground mb-8 text-center">
      So funktioniert der Punkte-Check
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
            <h3 className="font-sans text-lg font-semibold text-card-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.text}
            </p>
          </div>
        );
      })}
    </div>
  </section>
);
