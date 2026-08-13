export interface FAQItem {
  question: string;
  answer: string;
}

export const BILDUNGSURLAUB_FAQ: FAQItem[] = [
  {
    question: "Habe ich als Zahnarzt oder Zahnärztin Anspruch auf Bildungsurlaub?",
    answer:
      "Angestellte Zahnärztinnen und Zahnärzte haben in 15 von 16 Bundesländern Anspruch auf bezahlten Bildungsurlaub. Einzige Ausnahme ist Bayern, das kein Bildungsurlaubsgesetz kennt. Selbstständige Praxisinhaber haben keinen gesetzlichen Anspruch, können den Kurs aber steuerlich als Fortbildungskosten geltend machen.",
  },
  {
    question: "Können Zahnmedizinische Fachangestellte (ZFA) Bildungsurlaub nehmen?",
    answer:
      "Ja. ZFAs, Zahntechniker und alle weiteren angestellten Praxismitarbeitenden haben denselben Anspruch wie alle anderen Arbeitnehmenden im jeweiligen Bundesland. In Thüringen bekommen Auszubildende allerdings nur 3 statt 5 Tage, in Berlin gilt für unter 25-Jährige eine Sonderregel mit 10 Tagen pro Jahr statt in zwei Jahren.",
  },
  {
    question: "Wie viele Tage Bildungsurlaub stehen mir pro Jahr zu?",
    answer:
      "Meist 5 Arbeitstage pro Jahr (Baden-Württemberg, Hessen, Mecklenburg-Vorpommern, Niedersachsen, NRW, Saarland, Sachsen-Anhalt, Schleswig-Holstein, Thüringen). In Berlin, Brandenburg, Bremen, Hamburg und Rheinland-Pfalz sind es 10 Tage innerhalb von 2 Jahren. Sachsen führt ab 01.01.2027 mit dem SäBiFG 3 Tage pro Jahr ein.",
  },
  {
    question: "Wieso hat Bayern kein Bildungsurlaubsgesetz?",
    answer:
      "Bayern ist das einzige deutsche Bundesland ohne Bildungszeitgesetz. Ein Anspruch entsteht dort nur über einen Tarifvertrag, eine Betriebsvereinbarung oder eine individuelle Zusage im Arbeitsvertrag. Für die meisten Zahnarztpraxen in Bayern bedeutet das: kein gesetzlicher Bildungsurlaub für den Fortbildungskurs.",
  },
  {
    question: "Was ist die Kleinbetriebsklausel und wann greift sie?",
    answer:
      "Mehrere Bundesländer schließen kleine Betriebe komplett vom Bildungsurlaub aus. Baden-Württemberg und NRW: unter 10 Beschäftigten kein Anspruch. Rheinland-Pfalz, Sachsen-Anhalt und Thüringen: unter 5 Beschäftigten kein Anspruch. Berlin und Sachsen kennen zusätzlich einen Überforderungsschutz bei bis zu 20 Beschäftigten. Für viele Zahnarztpraxen ist das der entscheidende Punkt — unser Rechner prüft diese Klausel automatisch.",
  },
  {
    question: "Wie lange vor dem Kurs muss ich den Antrag stellen?",
    answer:
      "Die Antragsfrist variiert stark je Bundesland: Bremen und Niedersachsen 4 Wochen, die meisten Länder 6 Wochen, Mecklenburg-Vorpommern und Thüringen 8 Wochen, Baden-Württemberg 9 Wochen und Sachsen (ab 2027) 12 Wochen. Verpasste Fristen sind der häufigste Ablehnungsgrund — der KursRadar-Rechner nennt die exakte Frist für dein Bundesland.",
  },
  {
    question: "Kann mein Arbeitgeber den Bildungsurlaub ablehnen?",
    answer:
      'Nur mit einem gesetzlich definierten Grund, in der Regel dringende betriebliche Belange (z.B. mehrere zeitgleiche Bildungsurlaubs-Anträge, Krankheitswelle, unaufschiebbare Termine). Eine pauschale Ablehnung „passt uns gerade nicht" ist unzulässig. Der Arbeitgeber muss die Ablehnung schriftlich begründen; einige Landesgesetze fordern konkrete Nachweise.',
  },
  {
    question: "Bekomme ich während des Bildungsurlaubs meinen Lohn weiter?",
    answer:
      "Ja. Bildungsurlaub ist bezahlter Freistellungsurlaub — Gehalt, Zuschläge und Sozialversicherungsbeiträge laufen weiter. Die Kurskosten selbst zahlst du in der Regel selbst, kannst sie aber steuerlich als Werbungskosten absetzen. Manche Fortbildungsakademien und Zahnärztekammern übernehmen einen Teil der Kursgebühr.",
  },
  {
    question: "Muss der Fortbildungskurs speziell anerkannt sein?",
    answer:
      "Ja. Der Kurs muss von der zuständigen Landesbehörde als Bildungsurlaubs-Maßnahme anerkannt sein — nicht jede zahnmedizinische Fortbildung erfüllt automatisch die Kriterien. Anerkennungsstellen sind meist die Sozial- oder Bildungsministerien der Länder (siehe Bundesland-Übersicht). Anbieter wie die Zahnärztekammern, FAZH, Adolph-Witzel-Akademie und viele private Fortbildungsanbieter listen die Anerkennung meist direkt beim Kurs.",
  },
  {
    question: "Was ist der Unterschied zwischen Bildungsurlaub und Fortbildungspflicht?",
    answer:
      "Die zahnärztliche Fortbildungspflicht (§ 95d SGB V, 250 CME-Punkte in 5 Jahren) ist eine Berufspflicht und muss unabhängig vom Arbeitsverhältnis erfüllt werden. Bildungsurlaub ist dagegen ein arbeitsrechtlicher Freistellungsanspruch — beides lässt sich aber kombinieren: der Bildungsurlaub finanziert die Zeit, in der du CME-Punkte für die Fortbildungspflicht sammelst.",
  },
  {
    question: "Kann ich Bildungsurlaub für Präsenz- und Online-Kurse nutzen?",
    answer:
      "Präsenzkurse werden überall anerkannt. Bei digitalen Formaten variiert es: Sachsen-Anhalt hat mit der Neufassung ab 01.09.2026 digitale und hybride Formate ausdrücklich anerkannt (außer reines On-Demand). Andere Bundesländer folgen zunehmend, verlangen aber meist einen Live-Anteil oder Halbtages-Struktur (mind. 4 UE). Reine Selbstlern-Kurse sind selten anerkannt.",
  },
  {
    question: "Wie beantrage ich Bildungsurlaub konkret bei meinem Arbeitgeber?",
    answer:
      "Drei Schritte: (1) Anspruch prüfen (unser Rechner), (2) einen anerkannten Kurs auswählen und die Anerkennungsbescheinigung anfordern, (3) formlosen Antrag beim Arbeitgeber stellen mit Kurstitel, Datum, Anbieter, Ort und Kopie der Anerkennung — unter Einhaltung der Antragsfrist. Der Rechner erstellt dir am Ende ein PDF-Muster mit allen relevanten Angaben.",
  },
];
