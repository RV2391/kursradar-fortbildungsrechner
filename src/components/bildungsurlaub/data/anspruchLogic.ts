// Anspruchs-Pruefung fuer den Bildungsurlaub-Konfigurator.
//
// Extrahiert aus dem urspruenglichen BildungsurlaubRechner.tsx und um die
// neuen Rollen (Zahntechnik, Psychotherapie) sowie die neuen Fakten-Base-
// Erkenntnisse erweitert (Berlin Ueberforderungsschutz, Sachsen 2027,
// Thueringen-Azubi-Sonderregel, Sachsen-Anhalt Halbtages).

import type { BundeslandInfo } from './bundeslaender';
import { BILDUNGSURLAUB_SOURCES } from '@/utils/sources';
import type { Rolle } from './rollen';

export interface AnspruchErgebnis {
  hatAnspruch: boolean;
  grund: string;
  tage: number | null;
  hinweise: string[];
  gesetz: string;
  quelle: string;
  /** true, wenn das Gesetz erst in Zukunft in Kraft tritt (z.B. Sachsen 2027). */
  zukuenftig: boolean;
}

export function pruefeAnspruch(
  bundesland: BundeslandInfo,
  betriebsgroesse: number,
  rolle: Rolle,
): AnspruchErgebnis {
  const hinweise: string[] = [];
  const quelle = BILDUNGSURLAUB_SOURCES[bundesland.code]?.url || '';

  // 1) Selbststaendige: nie Anspruch, aber freundlicher Content
  if (rolle.selbststaendig) {
    return {
      hatAnspruch: false,
      grund: `Als ${rolle.label.toLowerCase()} hast du keinen gesetzlichen Anspruch auf Bildungsurlaub – das Gesetz richtet sich ausschließlich an Arbeitnehmer.`,
      tage: null,
      hinweise: [
        'Fortbildungskosten sind steuerlich absetzbar (Betriebsausgabe).',
        'Aufstiegs-BAföG steht auch Selbstständigen offen (bis 75 % Zuschuss).',
        'Für dein Team hingegen greift das Bildungsurlaubs-Gesetz — prüfe den Anspruch pro Mitarbeiter separat.',
      ],
      gesetz: bundesland.gesetz,
      quelle,
      zukuenftig: false,
    };
  }

  // 2) Bayern (kein Landesgesetz)
  if (bundesland.keinAnspruch) {
    return {
      hatAnspruch: false,
      grund: `${bundesland.name} hat kein Bildungsurlaubsgesetz. ${bundesland.besonderheiten}`,
      tage: null,
      hinweise: [
        'Prüfe deinen Tarifvertrag oder eine Betriebsvereinbarung — dort kann Bildungsurlaub freiwillig vereinbart sein.',
        'Der Arbeitgeber kann Bildungsurlaub freiwillig gewähren.',
        'Alternative: Fortbildungspauschale in vielen Praxen (steuerfrei bis 500 EUR / Jahr).',
      ],
      gesetz: bundesland.gesetz,
      quelle,
      zukuenftig: false,
    };
  }

  // 3) Sachsen: Gesetz tritt erst 2027 in Kraft
  if (bundesland.zukuenftig && bundesland.gueltigAb) {
    hinweise.push(
      `Das ${bundesland.gesetz} tritt erst am ${new Date(bundesland.gueltigAb).toLocaleDateString(
        'de-DE',
      )} in Kraft. Bis dahin kein gesetzlicher Anspruch, aber Vorplanung schon jetzt möglich.`,
    );
  }

  // 4) Kleinbetriebsklausel (BW/NW <10, RP/ST/TH <5)
  if (bundesland.kleinbetriebsSchwelle && betriebsgroesse < bundesland.kleinbetriebsSchwelle) {
    return {
      hatAnspruch: false,
      grund: `In ${bundesland.name} besteht bei unter ${bundesland.kleinbetriebsSchwelle} Beschäftigten kein Anspruch (${bundesland.gesetz}, Kleinbetriebsklausel).`,
      tage: null,
      hinweise: [
        'Viele Zahnarztpraxen und Zahntechnik-Labore fallen unter diese Grenze.',
        'Alternative: freiwillige Freistellung durch den Arbeitgeber, oft mit Kostenübernahme.',
        'Fortbildungskosten sind auch ohne Bildungsurlaub steuerlich absetzbar.',
        'Aufstiegs-BAföG ist unabhängig vom Bildungsurlaub verfügbar.',
      ],
      gesetz: bundesland.gesetz,
      quelle,
      zukuenftig: bundesland.zukuenftig,
    };
  }

  // 5) Berlin Ueberforderungsschutz (<=20 MA: Anspruch stark eingeschraenkt)
  if (
    bundesland.code === 'BE' &&
    bundesland.ueberforderungsSchutzSchwelle &&
    betriebsgroesse <= bundesland.ueberforderungsSchutzSchwelle
  ) {
    hinweise.push(
      `Berlin-Überforderungsschutz: Bei ≤${bundesland.ueberforderungsSchutzSchwelle} Beschäftigten kann der Arbeitgeber Bildungsurlaub in vielen Fällen ablehnen. Antrag trotzdem möglich, Ablehnung braucht schriftliche Begründung.`,
    );
  }

  // 6) Sachsen: Erstattung fuer Kleinbetriebe
  if (
    bundesland.code === 'SN' &&
    bundesland.ueberforderungsSchutzSchwelle &&
    betriebsgroesse <= bundesland.ueberforderungsSchutzSchwelle
  ) {
    hinweise.push(
      `Sachsen (ab 2027): Betriebe mit ≤${bundesland.ueberforderungsSchutzSchwelle} Beschäftigten erhalten eine Lohnfortzahlungs-Erstattung von 115 EUR/Tag, gedeckelt auf 345 EUR pro Mitarbeiter und Jahr.`,
    );
  }

  // 7) Azubi-Sonderregelungen
  if (rolle.istAzubi) {
    if (bundesland.code === 'TH') {
      // Thueringen: Azubis nur 3 Tage
      return {
        hatAnspruch: true,
        grund: `Als Auszubildende(r) hast du in Thüringen Anspruch auf 3 Tage Bildungsurlaub pro Jahr (statt der regulären 5 Tage). Rechtsgrundlage: ${bundesland.gesetz}.`,
        tage: 3,
        hinweise: [
          `Antragsfrist: ${bundesland.antragsfrist} vor Beginn der Fortbildung.`,
          `Wartezeit: ${bundesland.wartezeit} nach Beginn des Ausbildungsverhältnisses.`,
          'Der Kursanbieter muss die Bildungsurlaub-Anerkennung für dein Bundesland haben.',
        ],
        gesetz: bundesland.gesetz,
        quelle,
        zukuenftig: bundesland.zukuenftig,
      };
    }
    hinweise.push(
      'Als Auszubildende(r) hast du in den meisten Bundesländern denselben Anspruch wie reguläre Arbeitnehmer (Ausnahme: Thüringen 3 Tage).',
    );
  }

  // 8) Anspruch besteht — Standard-Fall
  if (bundesland.besonderheiten) {
    hinweise.push(bundesland.besonderheiten);
  }
  hinweise.push(`Antragsfrist: ${bundesland.antragsfrist} vor Beginn der Fortbildung.`);
  hinweise.push(`Wartezeit: ${bundesland.wartezeit} nach Beginn des Arbeitsverhältnisses.`);

  // 9) Kammer-spezifische Hinweise je nach Rolle
  if (rolle.cmeSystem === 'BZAeK') {
    hinweise.push(
      'Wichtig: Der Kursanbieter muss die Bildungsurlaub-Anerkennung für dein Bundesland separat haben — die reine BZÄK/DGZMK-CME-Punkte-Anerkennung reicht nicht aus.',
    );
  } else if (rolle.cmeSystem === 'PTK') {
    hinweise.push(
      'Wichtig: Fortbildungspunkte der Landespsychotherapeutenkammer ersetzen keine Bildungsurlaub-Anerkennung — beides sind getrennte Systeme.',
    );
  } else if (rolle.cmeSystem === 'HWK') {
    hinweise.push(
      'Wichtig: HWK/Innungs-Anerkennung ist getrennt vom Bildungsurlaub — der Kursanbieter muss beides einzeln beantragen.',
    );
  }

  return {
    hatAnspruch: true,
    grund: `Du hast Anspruch auf ${
      bundesland.zweiJahresRegelung ? `${bundesland.tageProJahr} Tage in 2 Jahren` : `${bundesland.tageProJahr} Tage pro Jahr`
    } Bildungsurlaub nach dem ${bundesland.gesetz}.`,
    tage: bundesland.tageProJahr,
    hinweise,
    gesetz: bundesland.gesetz,
    quelle,
    zukuenftig: bundesland.zukuenftig,
  };
}
