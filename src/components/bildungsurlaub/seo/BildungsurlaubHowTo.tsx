const STEPS = [
  {
    n: 1,
    title: "Anspruch prüfen",
    text: "Wähle Bundesland, Berufsgruppe (ZFA, angestellte Zahnärztin, Zahntechniker) und Praxisgröße. Der Rechner prüft in Sekunden Bildungsurlaubsgesetz, Kleinbetriebsklausel und Wartezeit.",
    id: "schritt-1",
  },
  {
    n: 2,
    title: "Wunschkurs eintragen",
    text: "Kopiere die URL deines KursRadar-Kurses in den Rechner. Titel, Datum, Anbieter und Ort werden automatisch übernommen. Alternativ trägst du die Daten manuell ein.",
    id: "schritt-2",
  },
  {
    n: 3,
    title: "Musterantrag erhalten",
    text: "Trage deine E-Mail ein und erhalte einen personalisierten Musterantrag als PDF. Direkt beim Arbeitgeber einreichen – unter Einhaltung der Antragsfrist deines Bundeslandes.",
    id: "schritt-3",
  },
];

export const BildungsurlaubHowTo = () => (
  <section aria-labelledby="howto-heading" className="mt-16">
    <h2 id="howto-heading" className="font-montserrat text-2xl font-bold text-foreground sm:text-3xl">
      So funktioniert der Bildungsurlaubs-Antrag – in 3 Schritten
    </h2>
    <p className="mt-2 max-w-2xl text-muted-foreground font-roboto">
      Vom Anspruchs-Check bis zum fertigen PDF-Antrag für deinen Arbeitgeber – in unter 5 Minuten.
    </p>
    <ol className="mt-6 grid gap-4 md:grid-cols-3">
      {STEPS.map((step) => (
        <li
          key={step.n}
          id={step.id}
          className="rounded-lg border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              {step.n}
            </span>
            <h3 className="font-montserrat text-lg font-semibold text-foreground">{step.title}</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground font-roboto leading-relaxed">
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  </section>
);
