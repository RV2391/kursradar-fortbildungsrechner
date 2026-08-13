// Bundeslaender-Daten fuer den Bildungsurlaub-Konfigurator.
//
// Single-Source-of-Truth. Alle Anzeigen und Berechnungen im Konfigurator
// stammen aus dieser Datei. Aenderungen hier haben unmittelbare Wirkung
// auf UI + PDF-Lead-Magnet.
//
// Quellen und Rechtstext-Verweise: siehe src/utils/sources.ts
// (`BILDUNGSURLAUB_SOURCES`) und `~/kursradar/docs/knowledge/
// bildungsurlaub_fact_base_2026_07.md`.
//
// Wichtige Fakten-Korrekturen aus Fact-Base 27.07.2026:
//  - Saarland: 5 Tage (nicht 6) seit SBFG-Novelle 09.05.2024
//  - Sachsen: SaeBiFG in Kraft ab 01.01.2027 (3 Tage, Kleinbetriebs-
//    Erstattung 115 EUR/Tag / Cap 345 EUR pro MA/Jahr)
//  - Sachsen-Anhalt: BzG LSA Neufassung ab 01.09.2026 (Halbtages- und
//    Digital-Formate anerkannt)
//  - Berlin: <20 MA Ueberforderungsschutz (Anspruch de facto aufgehoben)
//  - Thueringen: Azubis nur 3 Tage, <5 MA komplett ausgeschlossen

export type BundeslandCode =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE' | 'MV'
  | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';

export interface BundeslandInfo {
  code: BundeslandCode;
  name: string;
  /** Anspruchs-Tage. Bei zweiJahresRegelung=true bezieht sich der Wert auf 2 Jahre. */
  tageProJahr: number | null;
  zweiJahresRegelung: boolean;
  /** Kleinbetriebs-Schwelle: unter diesem MA-Wert KEIN Anspruch. */
  kleinbetriebsSchwelle: number | null;
  /** Ueberforderungsschutz: <= diesem MA-Wert Sonderregel (z.B. Berlin). */
  ueberforderungsSchutzSchwelle: number | null;
  wartezeit: string;
  antragsfrist: string;
  gesetz: string;
  besonderheiten: string;
  keinAnspruch: boolean;
  /** URL der zustaendigen Anerkennungsstelle fuer Kursanbieter. */
  anerkennungsstelleUrl: string | null;
  /** true, wenn das Gesetz erst in Kraft tritt (z.B. Sachsen 2027). */
  zukuenftig: boolean;
  gueltigAb: string | null;
}

export const BUNDESLAENDER: BundeslandInfo[] = [
  {
    code: 'BW',
    name: 'Baden-Württemberg',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: 10,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '12 Monate',
    antragsfrist: '9 Wochen',
    gesetz: 'BzG BW',
    besonderheiten: 'Kleinbetriebsklausel: Unter 10 Beschäftigte = KEIN Anspruch. Für kleine Zahnarztpraxen oft relevant.',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://rp.baden-wuerttemberg.de/themen/bildung/seiten/bildungszeit/',
    zukuenftig: false,
    gueltigAb: '2015-07-01',
  },
  {
    code: 'BY',
    name: 'Bayern',
    tageProJahr: null,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '-',
    antragsfrist: '-',
    gesetz: 'Kein Gesetz',
    besonderheiten: 'Einziges Bundesland ohne Bildungsurlaubsgesetz. Anspruch nur über Tarifvertrag oder Betriebsvereinbarung möglich.',
    keinAnspruch: true,
    anerkennungsstelleUrl: null,
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'BE',
    name: 'Berlin',
    tageProJahr: 10,
    zweiJahresRegelung: true,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: 20,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'BiUrlG BE',
    besonderheiten: 'Unter 25-Jährige: 10 Tage pro Jahr (statt in 2 Jahren). Überforderungsschutz bei ≤20 Beschäftigten — hier de facto kein Anspruch.',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://www.berlin.de/sen/arbeit/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'BB',
    name: 'Brandenburg',
    tageProJahr: 10,
    zweiJahresRegelung: true,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'BbgWBG',
    besonderheiten: '',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://mbjs.brandenburg.de/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'HB',
    name: 'Bremen',
    tageProJahr: 10,
    zweiJahresRegelung: true,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '4 Wochen',
    gesetz: 'BremBUG',
    besonderheiten: 'Unter 25-Jährige: zusätzlich 2 Tage für politische Bildung.',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://www.senatspressestelle.bremen.de/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'HH',
    name: 'Hamburg',
    tageProJahr: 10,
    zweiJahresRegelung: true,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'HmbBUG',
    besonderheiten: '',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://www.hamburg.de/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'HE',
    name: 'Hessen',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'HBUG',
    besonderheiten: '',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://soziales.hessen.de/arbeit/bildungsurlaub',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'MV',
    name: 'Mecklenburg-Vorpommern',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '8 Wochen',
    gesetz: 'BfG M-V',
    besonderheiten: 'Auch für ehrenamtliche Tätigkeit nutzbar.',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://www.regierung-mv.de/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'NI',
    name: 'Niedersachsen',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '4 Wochen',
    gesetz: 'NBildUG',
    besonderheiten: '',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://www.mk.niedersachsen.de/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'NW',
    name: 'Nordrhein-Westfalen',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: 10,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'AWbG NRW',
    besonderheiten: 'Kleinbetriebsklausel: Unter 10 Beschäftigte = KEIN Anspruch. Für viele Zahnarztpraxen relevant.',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://www.mags.nrw/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'RP',
    name: 'Rheinland-Pfalz',
    tageProJahr: 10,
    zweiJahresRegelung: true,
    kleinbetriebsSchwelle: 5,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'BFG RP',
    besonderheiten: 'Zwei-Jahres-Zyklus beginnt jeweils am 01.01. eines ungeraden Kalenderjahres. Kurs muss mindestens 3 Tage mit im Schnitt 6 Unterrichtseinheiten pro Tag umfassen. Kleinbetriebsklausel ab unter 5 Beschäftigten.',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://mastd.rlp.de/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'SL',
    name: 'Saarland',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'SBFG',
    besonderheiten: 'Seit SBFG-Novelle vom 09.05.2024: 5 Tage vollständig bezahlt (zuvor 6 Tage nominell, aber ab Tag 3 Eigenanteil).',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://www.saarland.de/mbk/',
    zukuenftig: false,
    gueltigAb: '2024-05-09',
  },
  {
    code: 'SN',
    name: 'Sachsen',
    tageProJahr: 3,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: 20,
    wartezeit: '6 Monate',
    antragsfrist: '12 Wochen',
    gesetz: 'SäBiFG (ab 2027)',
    besonderheiten: 'Ab 01.01.2027 in Kraft. Kleinbetriebe (≤20 MA) erhalten Erstattung 115 EUR/Tag, Cap 345 EUR pro MA/Jahr. 12-Wochen-Antragsfrist.',
    keinAnspruch: false,
    anerkennungsstelleUrl: null,
    zukuenftig: true,
    gueltigAb: '2027-01-01',
  },
  {
    code: 'ST',
    name: 'Sachsen-Anhalt',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: 5,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'BzG LSA',
    besonderheiten: 'Neufassung ab 01.09.2026: Halbtages-Seminare (ab 4 UE) und digitale/hybride Formate ausdrücklich anerkannt (ausser reines On-Demand). Kleinbetriebsklausel <5 MA.',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://ms.sachsen-anhalt.de/',
    zukuenftig: false,
    gueltigAb: '2026-09-01',
  },
  {
    code: 'SH',
    name: 'Schleswig-Holstein',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: null,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '6 Wochen',
    gesetz: 'WBG SH',
    besonderheiten: '',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://www.schleswig-holstein.de/',
    zukuenftig: false,
    gueltigAb: null,
  },
  {
    code: 'TH',
    name: 'Thüringen',
    tageProJahr: 5,
    zweiJahresRegelung: false,
    kleinbetriebsSchwelle: 5,
    ueberforderungsSchutzSchwelle: null,
    wartezeit: '6 Monate',
    antragsfrist: '8 Wochen',
    gesetz: 'ThürBfG',
    besonderheiten: 'Auszubildende nur 3 Tage (statt 5). Kleinbetriebsklausel ab unter 5 Beschäftigten.',
    keinAnspruch: false,
    anerkennungsstelleUrl: 'https://bildung.thueringen.de/',
    zukuenftig: false,
    gueltigAb: null,
  },
];

export const getBundeslandByCode = (code: string): BundeslandInfo | undefined =>
  BUNDESLAENDER.find((b) => b.code === code);
