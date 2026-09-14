export interface FAQItem {
  question: string;
  answer: string;
}

export const KOSTENRECHNER_FAQ: FAQItem[] = [
  {
    question: "Wie berechnet der Kostenrechner die Ersparnis?",
    answer:
      "Der Rechner vergleicht typische Fortbildungskosten einer Zahnarztpraxis (Kursgebühren, Reisekosten, Zeitaufwand, Praxisausfall) mit einer über KursRadar optimierten Planung: kuratierte Kurse aus über 60 Anbietern, weniger Recherche-Zeit, regionale Alternativen zur Vermeidung langer Anreisen und bessere Team-Auslastung. Grundlage sind BZÄK-Empfehlungen zu Fortbildungspunkten (125 in 5 Jahren) und branchenübliche Reisekostenpauschalen.",
  },
  {
    question: "Was kostet Fortbildung im Durchschnitt bei einer Zahnarztpraxis?",
    answer:
      "Erfahrungswerte aus der Praxisberatung: Zahnärzt:innen investieren jährlich zwischen 3.000 und 8.000 Euro pro Kopf in Fortbildung, ZFA-Fortbildungen liegen typischerweise bei 500 bis 2.000 Euro pro Kopf. Hinzu kommen Reisekosten, Übernachtungen und der Umsatzausfall durch Praxis-Halbtage. Team-Praxen (4+ Mitarbeitende) landen schnell bei jährlichen Gesamtkosten zwischen 15.000 und 30.000 Euro — davon lässt sich mit strukturierter Planung ein spürbarer Anteil sparen.",
  },
  {
    question: "Welche Fortbildungskosten sind steuerlich absetzbar?",
    answer:
      "Fortbildungen sind für Zahnärzt:innen und Praxen betrieblich veranlasst und damit voll als Betriebsausgabe absetzbar — inklusive Kursgebühren, Reisekosten, Übernachtungen und Verpflegungspauschalen nach den steuerlichen Sätzen. Wichtig: Belege aufheben und die betriebliche Veranlassung dokumentieren (z.B. Praxisbezug im Kursthema). Für Details bitte immer mit deiner Steuerberatung sprechen.",
  },
  {
    question: "Sparen kleine Praxen anders als Team-Praxen?",
    answer:
      "Ja. Solo-Praxen haben oft höhere Reisekostenanteile pro Fortbildung, weil sie seltener regional buchen und die Anreisezeit einzeln tragen. Team-Praxen profitieren stark von gemeinsamer Team-Fortbildung an einem Tag (Praxis-Team-Tag), weil Reise- und Praxisausfall-Kosten geteilt werden. Der Rechner berücksichtigt beide Modelle: bei Solo-Praxen liegt der größte Hebel meist in regionaler Anbieter-Auswahl, bei Team-Praxen in Team-Tag-Bündelung.",
  },
  {
    question: "Was ist der größte Kostentreiber bei Fortbildung?",
    answer:
      "Nicht die Kursgebühr selbst — sondern der Praxis-Umsatzausfall während der Fortbildungszeit. Ein Ganztags-Kurs kostet die Praxis oft mehr an entgangenem Behandlungshonorar als an Kursgebühren. Zweitgrößter Faktor sind Reise- und Übernachtungskosten bei überregionalen Fortbildungen. Optimierungen setzen daher an Terminplanung (Randtermine, Freitag-Samstag), Team-Bündelung und regionaler Anbieter-Auswahl an.",
  },
  {
    question: "Wie plant man Team-Fortbildungen wirtschaftlich?",
    answer:
      "Drei Hebel funktionieren erfahrungsgemäß am stärksten: (1) Praxis-Team-Tag einmal pro Halbjahr statt Einzelkurse verteilt über das Jahr — reduziert Umsatzausfall auf einen geplanten Tag statt viele Halbtage. (2) Team-Tag-Anbieter direkt in die Praxis holen (Inhouse-Kurs) statt alle zum Anbieter zu schicken — spart Reisekosten. (3) Fortbildungen in Randzeiten legen (Freitag ab 15 Uhr, Samstag) — halbiert den Umsatzausfall.",
  },
  {
    question: "Zählen Kongresse zu den Fortbildungskosten?",
    answer:
      "Ja, Fachkongresse gehören zu den klassischen Fortbildungskosten und sind wie andere Fortbildungen betrieblich veranlasst und absetzbar. Wichtig für die Praxis-Bilanz: Kongress-Kosten sind pro Kopf oft am höchsten (400 bis 1.500 Euro Teilnahmegebühr plus Reise + Übernachtung), bringen aber viele Fortbildungspunkte pro Tag. Für die Punkte-Bilanz gegenüber der KZV nach § 95d SGB V (125 Punkte in 5 Jahren) sind Kongresse effizient.",
  },
  {
    question: "Werden meine Praxis-Daten beim Rechner gespeichert?",
    answer:
      "Nein, standardmäßig verbleiben deine Eingaben nur in deinem Browser. Der Rechner läuft komplett clientseitig. Erst wenn du am Ende eine detaillierte Analyse per E-Mail anforderst, wird deine Mail-Adresse (und optional deine Praxisadresse für regionalisierte Kurs-Empfehlungen) an unser CRM übertragen — mit klarem Opt-in. Details dazu findest du in unserer Datenschutzerklärung.",
  },
];
