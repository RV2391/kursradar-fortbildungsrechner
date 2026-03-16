/**
 * Aufstiegs-BAfoeg-Rechner (AFBG)
 *
 * Berechnet den Eigenanteil für zahnmedizinische Aufstiegsfortbildungen
 * basierend auf dem Aufstiegsfortbildungsfoerderungsgesetz (AFBG).
 *
 * Quellen:
 * - BMBF: https://www.aufstiegs-bafoeg.de
 * - AFBG Gesetzestext: https://www.gesetze-im-internet.de/afbg/
 * - Stand: März 2026 (letzte AFBG-Novelle 2024)
 */

// ============================================================
// FOERDERUNGSKONSTANTEN (AFBG, Stand 2024/2025)
// ============================================================

/** Max. foerderfaehige Lehrgangskosten */
export const MAX_LEHRGANGSKOSTEN = 15000;

/** Max. foerderfaehige Pruefungskosten */
export const MAX_PRUEFUNGSKOSTEN = 2000;

/** Zuschussanteil auf Lehrgangs-/Pruefungskosten (nicht rueckzahlbar) */
export const ZUSCHUSS_ANTEIL = 0.50;

/** Darlehensanteil (zinsguenstig, KfW) */
export const DARLEHEN_ANTEIL = 0.50;

/** Erlass bei Bestehen der Prüfung (auf Darlehensanteil) */
export const ERLASS_BEI_BESTEHEN = 0.50;

/** Effektiver Foerdersatz: 50% Zuschuss + 50% Darlehen, davon 50% Erlass = 75% effektiv */
export const EFFEKTIVER_FOERDERSATZ = 0.75;

/** Materialkosten-Zuschuss (nur für Meisterpruefung, Zahntechnik relevant) */
export const MAX_MATERIALKOSTEN = 2000;
export const MATERIALKOSTEN_ZUSCHUSS = 0.50;

// ============================================================
// FORTBILDUNGSTYPEN
// ============================================================

export interface Fortbildungstyp {
  id: string;
  name: string;
  /** Kurzbeschreibung */
  description: string;
  /** Typische Gesamtkosten (EUR) */
  typischeKosten: number;
  /** Typische Dauer in Monaten */
  dauerMonate: number;
  /** Unterrichtsstunden gesamt */
  unterrichtsstunden: number;
  /** Zielgruppe */
  zielgruppe: 'ZFA' | 'ZA' | 'ZT' | 'DH';
  /** DQR-Niveau */
  dqrNiveau: number;
  /** Voraussetzungen */
  voraussetzungen: string;
  /** AFBG-foerderfaehig? */
  afbgFoerderfaehig: boolean;
  /** Quelle für Kosten */
  kostenQuelle: string;
  /** Meisterpruefung? (relevant für Materialkosten) */
  istMeisterpruefung: boolean;
}

export const FORTBILDUNGSTYPEN: Fortbildungstyp[] = [
  {
    id: 'zmp',
    name: 'ZMP — Zahnmedizinische Prophylaxeassistentin',
    description: 'Schwerpunkt Prophylaxe, Parodontologie, Ernaehrungsberatung',
    typischeKosten: 2500,
    dauerMonate: 6,
    unterrichtsstunden: 400,
    zielgruppe: 'ZFA',
    dqrNiveau: 5,
    voraussetzungen: 'Abgeschlossene ZFA-Ausbildung, mind. 1 Jahr Berufserfahrung',
    afbgFoerderfaehig: true,
    kostenQuelle: 'Landeszahnärztekammern — Fortbildungsordnung, Durchschnitt über 17 LZKs',
    istMeisterpruefung: false,
  },
  {
    id: 'zmv',
    name: 'ZMV — Zahnmedizinische Verwaltungsassistentin',
    description: 'Schwerpunkt Praxismanagement, Abrechnung, Personal',
    typischeKosten: 2800,
    dauerMonate: 6,
    unterrichtsstunden: 400,
    zielgruppe: 'ZFA',
    dqrNiveau: 5,
    voraussetzungen: 'Abgeschlossene ZFA-Ausbildung, mind. 1 Jahr Berufserfahrung',
    afbgFoerderfaehig: true,
    kostenQuelle: 'Landeszahnärztekammern — Fortbildungsordnung',
    istMeisterpruefung: false,
  },
  {
    id: 'zmf',
    name: 'ZMF — Zahnmedizinische Fachassistentin',
    description: 'Breite Qualifikation: Prophylaxe + Verwaltung + Assistenz',
    typischeKosten: 3500,
    dauerMonate: 10,
    unterrichtsstunden: 500,
    zielgruppe: 'ZFA',
    dqrNiveau: 5,
    voraussetzungen: 'Abgeschlossene ZFA-Ausbildung, mind. 1 Jahr Berufserfahrung',
    afbgFoerderfaehig: true,
    kostenQuelle: 'Landeszahnärztekammern — Fortbildungsordnung',
    istMeisterpruefung: false,
  },
  {
    id: 'dh',
    name: 'DH — Dentalhygienikerin (Bachelor Professional)',
    description: 'Höchste Aufstiegsqualifikation, DQR-Niveau 6, eigenstaendige Prophylaxe',
    typischeKosten: 15000,
    dauerMonate: 18,
    unterrichtsstunden: 950,
    zielgruppe: 'ZFA',
    dqrNiveau: 6,
    voraussetzungen: 'ZMP- oder ZMF-Abschluss, mind. 2 Jahre Berufserfahrung in Prophylaxe',
    afbgFoerderfaehig: true,
    kostenQuelle: 'DH-Akademien (proDente, Carlsburg, Heddesheim), Durchschnitt 2025',
    istMeisterpruefung: false,
  },
  {
    id: 'fzp',
    name: 'FZP — Fachzahnarzthelfer/in für Zahnärztliches Praxismanagement',
    description: 'Alternative zum ZMV mit erweitertem Praxismanagement-Fokus',
    typischeKosten: 4000,
    dauerMonate: 12,
    unterrichtsstunden: 600,
    zielgruppe: 'ZFA',
    dqrNiveau: 6,
    voraussetzungen: 'Abgeschlossene ZFA-Ausbildung, mind. 3 Jahre Berufserfahrung',
    afbgFoerderfaehig: true,
    kostenQuelle: 'Zahnärztekammern mit FZP-Angebot',
    istMeisterpruefung: false,
  },
  {
    id: 'zt_meister',
    name: 'Zahntechnikermeister/in',
    description: 'Meisterpruefung im Zahntechnikerhandwerk (HwO Anlage A Nr. 37)',
    typischeKosten: 12000,
    dauerMonate: 24,
    unterrichtsstunden: 1200,
    zielgruppe: 'ZT',
    dqrNiveau: 6,
    voraussetzungen: 'Gesellenpruefung Zahntechnik',
    afbgFoerderfaehig: true,
    kostenQuelle: 'Handwerkskammern — Meistervorbereitungskurse, Durchschnitt 2025',
    istMeisterpruefung: true,
  },
  {
    id: 'cad_cam',
    name: 'CAD/CAM-Spezialist/in (Zahntechnik)',
    description: 'Digitale Zahntechnik: CAD/CAM, 3D-Druck, Intraoralscanner-Workflow',
    typischeKosten: 5000,
    dauerMonate: 6,
    unterrichtsstunden: 300,
    zielgruppe: 'ZT',
    dqrNiveau: 5,
    voraussetzungen: 'Gesellenpruefung Zahntechnik oder vergleichbar',
    afbgFoerderfaehig: true,
    kostenQuelle: 'Herstellerakademien (Dentsply Sirona, Ivoclar), Fortbildungsinstitute',
    istMeisterpruefung: false,
  },
];

// ============================================================
// BERECHNUNG
// ============================================================

export interface BAfoegErgebnis {
  /** Gesamtkosten der Fortbildung */
  gesamtkosten: number;
  /** Davon foerderfaehig (gedeckelt auf MAX_LEHRGANGSKOSTEN) */
  foerderfaehigeKosten: number;
  /** Zuschuss (nicht rueckzahlbar) */
  zuschuss: number;
  /** Darlehen (KfW, zinsguenstig) */
  darlehen: number;
  /** Erlass bei Bestehen (50% des Darlehens) */
  erlassBeibestehen: number;
  /** Effektiver Eigenanteil (nach Bestehen und Erlass) */
  eigenanteilEffektiv: number;
  /** Eigenanteil ohne Erlass (worst case: nicht bestanden) */
  eigenanteilOhneErlass: number;
  /** Prozentualer Foerdersatz effektiv */
  foerdersatzProzent: number;
  /** Materialkosten-Zuschuss (nur bei Meisterpruefung) */
  materialkostenZuschuss: number;
}

export function berechneAufstiegsBAfoeg(
  gesamtkosten: number,
  istMeisterpruefung: boolean = false
): BAfoegErgebnis {
  // Foerderfaehige Kosten deckeln
  const foerderfaehigeKosten = Math.min(gesamtkosten, MAX_LEHRGANGSKOSTEN + MAX_PRUEFUNGSKOSTEN);

  // Zuschuss: 50% (nicht rueckzahlbar)
  const zuschuss = Math.round(foerderfaehigeKosten * ZUSCHUSS_ANTEIL);

  // Darlehen: 50% (KfW, zinsguenstig)
  const darlehen = foerderfaehigeKosten - zuschuss;

  // Erlass bei Bestehen: 50% des Darlehens
  const erlassBeibestehen = Math.round(darlehen * ERLASS_BEI_BESTEHEN);

  // Materialkosten (nur Meisterpruefung)
  const materialkostenZuschuss = istMeisterpruefung
    ? Math.round(MAX_MATERIALKOSTEN * MATERIALKOSTEN_ZUSCHUSS)
    : 0;

  // Eigenanteil effektiv (nach Bestehen):
  // = Gesamtkosten - Zuschuss - Erlass - Materialkosten-Zuschuss
  // Der verbleibende Darlehensanteil wird zurueckgezahlt
  const eigenanteilEffektiv = Math.max(
    0,
    gesamtkosten - zuschuss - erlassBeibestehen - materialkostenZuschuss
  );

  // Eigenanteil ohne Erlass (nicht bestanden)
  const eigenanteilOhneErlass = Math.max(
    0,
    gesamtkosten - zuschuss - materialkostenZuschuss
  );

  // Foerdersatz
  const foerdersatzProzent =
    gesamtkosten > 0
      ? Math.round(((gesamtkosten - eigenanteilEffektiv) / gesamtkosten) * 100)
      : 0;

  return {
    gesamtkosten,
    foerderfaehigeKosten,
    zuschuss,
    darlehen,
    erlassBeibestehen,
    eigenanteilEffektiv,
    eigenanteilOhneErlass,
    foerdersatzProzent,
    materialkostenZuschuss,
  };
}
