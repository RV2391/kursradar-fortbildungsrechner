import type { BundeslandInfo } from "../data/bundeslaender";
import type { FAQItem } from "./faqData";

const formatTageText = (b: BundeslandInfo): string => {
  if (b.keinAnspruch) return "keinen gesetzlichen Anspruch auf Bildungsurlaub";
  if (b.tageProJahr === null) return "keine reguläre Tage-Regelung";
  return b.zweiJahresRegelung
    ? `${b.tageProJahr} bezahlte Bildungsurlaubs-Tage innerhalb von 2 Jahren`
    : `${b.tageProJahr} bezahlte Bildungsurlaubs-Tage pro Kalenderjahr`;
};

const kleinbetriebsAntwort = (b: BundeslandInfo): string | null => {
  if (b.kleinbetriebsSchwelle !== null) {
    return `Ja. Nach ${b.gesetz} besteht bei weniger als ${b.kleinbetriebsSchwelle} Beschäftigten in ${b.name} kein Anspruch auf Bildungsurlaub. Für viele Zahnarztpraxen mit kleinem Team ist das der entscheidende Punkt.`;
  }
  if (b.ueberforderungsSchutzSchwelle !== null) {
    return `Formal gilt der Anspruch, aber ${b.name} kennt einen Überforderungsschutz: Bei bis zu ${b.ueberforderungsSchutzSchwelle} Beschäftigten kann der Arbeitgeber unter erleichterten Voraussetzungen ablehnen — in kleinen Zahnarztpraxen bedeutet das faktisch häufig keinen durchsetzbaren Anspruch.`;
  }
  return `Nein, ${b.name} kennt keine Kleinbetriebsklausel. Der Anspruch gilt unabhängig von der Praxisgröße.`;
};

export const buildBundeslandFAQ = (b: BundeslandInfo): FAQItem[] => {
  const items: FAQItem[] = [];

  items.push({
    question: `Habe ich in ${b.name} Anspruch auf Bildungsurlaub als Zahnarzt oder ZFA?`,
    answer: b.keinAnspruch
      ? `Nein. ${b.name} ist das einzige Bundesland ohne Bildungsurlaubsgesetz. Ein Anspruch entsteht nur über einen Tarifvertrag, eine Betriebsvereinbarung oder eine individuelle Zusage im Arbeitsvertrag. Selbst zahlen und steuerlich als Werbungskosten absetzen bleibt die reguläre Option für Zahnärzte, ZFA und Zahntechniker.`
      : `Ja, angestellte Zahnärztinnen, Zahnärzte, ZFAs und Zahntechniker haben in ${b.name} nach ${b.gesetz} Anspruch auf ${formatTageText(b)}. Der Kurs muss von der zuständigen Landesbehörde als Bildungsurlaubs-Maßnahme anerkannt sein.`,
  });

  if (!b.keinAnspruch) {
    items.push({
      question: `Wie viele Tage Bildungsurlaub bekomme ich in ${b.name}?`,
      answer: `In ${b.name} sind es ${formatTageText(b)}. Die Antragsfrist beim Arbeitgeber beträgt ${b.antragsfrist}, die Wartezeit im neuen Beschäftigungsverhältnis liegt bei ${b.wartezeit}.`,
    });
  }

  const kb = kleinbetriebsAntwort(b);
  if (kb) {
    items.push({
      question: `Gilt in ${b.name} eine Kleinbetriebsklausel?`,
      answer: kb,
    });
  }

  if (b.besonderheiten) {
    items.push({
      question: `Welche Besonderheiten hat ${b.name} beim Bildungsurlaub?`,
      answer: b.besonderheiten,
    });
  }

  if (b.zukuenftig && b.gueltigAb) {
    items.push({
      question: `Ab wann gilt das neue Bildungsurlaubsgesetz in ${b.name}?`,
      answer: `Das ${b.gesetz} tritt am ${new Date(b.gueltigAb).toLocaleDateString(
        "de-DE",
      )} in Kraft. Bis dahin besteht in ${b.name} kein gesetzlicher Bildungsurlaubs-Anspruch.`,
    });
  }

  if (!b.keinAnspruch && b.anerkennungsstelleUrl) {
    items.push({
      question: `Welche Behörde erkennt Bildungsurlaubs-Kurse in ${b.name} an?`,
      answer: `Für die Anerkennung ist in ${b.name} die zuständige Landesbehörde verantwortlich (siehe offizielle Anerkennungsstelle). Fortbildungsanbieter beantragen dort die Anerkennung als Bildungsurlaub — bei den meisten Kursen findest du den Anerkennungsstatus direkt in der Kursbeschreibung.`,
    });
  }

  return items;
};
