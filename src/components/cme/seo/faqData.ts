export interface FAQItem {
  question: string;
  answer: string;
}

export const CME_FAQ: FAQItem[] = [
  {
    question: "Was ist die Fortbildungspflicht nach § 95d SGB V?",
    answer:
      "Vertragszahnärztinnen und Vertragszahnärzte müssen alle fünf Jahre einen Fortbildungsnachweis über 125 Fortbildungspunkte gegenüber ihrer Kassenzahnärztlichen Vereinigung (KZV) erbringen. Grundlage ist § 95d SGB V. Der Zyklus beginnt individuell mit der ersten Zulassung als Vertragszahnarzt oder mit dem letzten erfolgreich geführten Nachweis.",
  },
  {
    question: "Ab wann läuft mein persönlicher 5-Jahres-Zyklus?",
    answer:
      "Der Zyklus beginnt individuell: entweder mit der Erstzulassung als Vertragszahnärztin oder Vertragszahnarzt bei der KZV, oder mit dem letzten erfolgreich erbrachten Fortbildungsnachweis. Dein persönliches Enddatum steht in deinem KZV-Punktekonto — die meisten KZVen bieten dazu einen Online-Zugang.",
  },
  {
    question: "Was passiert, wenn ich die 125 Punkte nicht rechtzeitig sammle?",
    answer:
      "Bei nicht erbrachtem Nachweis droht nach § 95d Absatz 3 SGB V eine gestaffelte Honorarkürzung: 10 Prozent für die ersten vier Quartale, ab dem fünften Quartal 25 Prozent. Wird der Nachweis über zwei Jahre hinweg nicht erbracht, kann die Zulassungsentziehung geprüft werden. Der Handlungsdruck steigt also im letzten Zyklus-Jahr deutlich.",
  },
  {
    question: "Welche Fortbildungen zählen zur Punkte-Bilanz?",
    answer:
      "Anerkannt sind Fortbildungen, die nach den Leitsätzen der Bundeszahnärztekammer (BZÄK) und der Kassenzahnärztlichen Bundesvereinigung (KZBV) mit Fortbildungspunkten bewertet sind. Dazu gehören klassische Präsenzkurse, Kongresse, e-Learning-Formate mit Lernerfolgskontrolle, sowie strukturierte Selbstlern-Angebote. Die Punktzahl ist im jeweiligen Kurs-Programm ausgewiesen.",
  },
  {
    question: "Wie viele Punkte pro Jahr sollte ich realistisch einplanen?",
    answer:
      "125 Punkte in 5 Jahren entsprechen im Durchschnitt 25 Punkten pro Jahr. Da Präsenz-Ganztags-Fortbildungen typischerweise 6–8 Punkte bringen, reichen 3–4 Fortbildungstage pro Jahr rechnerisch aus. Praxen mit Team-Fortbildung planen oft einen Praxis-Team-Tag pro Halbjahr plus einen größeren Kongress-Besuch pro Jahr.",
  },
  {
    question: "Wo sehe ich meinen aktuellen Punktestand?",
    answer:
      "Über das Online-Konto deiner KZV. Die meisten KZVen bieten einen Login-Bereich, in dem der aktuelle Punktestand, gemeldete Fortbildungen und das Zyklus-Enddatum einsehbar sind. Alternativ enthält jeder Fortbildungsbescheid des Anbieters die Punktzahl, die zur eigenen Aktenführung genutzt werden kann.",
  },
  {
    question: "Gilt die Fortbildungspflicht auch für ZFAs oder Zahntechniker?",
    answer:
      "Nein, § 95d SGB V betrifft nur Vertragszahnärztinnen und Vertragszahnärzte. ZFAs, ZMP, DH, ZMV und Zahntechniker unterliegen dieser Pflicht nicht. Für diese Berufsgruppen gibt es eigene Aufstiegsfortbildungen (BZÄK-Zertifikate, DH-Ausbildung, ZMV-Weiterbildung), die für die Praxis-Positionierung und die Karriere wichtig sind, aber nicht Bestandteil des CME-Punktekontos.",
  },
  {
    question: "Können unbenutzte Punkte in den nächsten Zyklus mitgenommen werden?",
    answer:
      "Nein. Punkte, die im laufenden 5-Jahres-Zyklus gesammelt werden, gelten ausschließlich für diesen Zyklus. Nach Zyklus-Ende beginnt die Zählung bei Null. Wer im letzten Jahr des Zyklus feststellt, dass viele Punkte fehlen, muss diese noch bis zum Zyklus-Ende erbringen — Nachreichen im Folgezyklus ist nicht möglich.",
  },
];
