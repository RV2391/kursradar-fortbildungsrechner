// Rollen-Modell fuer den Bildungsurlaub-Konfigurator.
//
// Deckt drei Berufsgruppen ab:
//   1. Zahnarztpraxis  (ZFA/ZMP/ZMV/angest. Zahnarzt/Praxisinhaber, Azubis)
//   2. Zahntechnik     (Geselle/Meister/Labor-Inhaber, Azubis)
//   3. Psychotherapie  (angest. PP/KJP, PtW, Praxis-Angestellte, Praxis-Inhaber)
//
// selbststaendig=true bedeutet: KEIN Anspruch nach Landes-Bildungsurlaubs-
// Gesetz. Fuer Content-Zwecke zeigen wir Alternativen (Fortbildungskonto,
// Betriebsausgabe, Weiterbildungsfoerderung).
//
// enum-Values in snake_case ASCII, damit sie 1:1 in Brevo-Attribute und
// n8n-Payloads fliessen (CLAUDE.md-Regel).

export type BranchenCode = 'zahnarztpraxis' | 'zahntechnik' | 'psychotherapie';

export type RollenCode =
  | 'zfa'                    // ZFA/ZMP/ZMV/ZMF/PZR
  | 'angest_zahnarzt'
  | 'praxis_inhaber_zahn'
  | 'azubi_zfa'
  | 'zt_geselle'
  | 'zt_meister'
  | 'labor_inhaber'
  | 'azubi_zt'
  | 'angest_pp'              // Approbierter angestellter PP/KJP in Klinik/Ambulanz/MVZ
  | 'ptw'                    // Psychotherapeut in Weiterbildung (frueher PiA)
  | 'praxis_angestellter_ppp'
  | 'praxis_inhaber_pp';

export interface Rolle {
  code: RollenCode;
  branche: BranchenCode;
  label: string;
  kurzbeschreibung: string;
  selbststaendig: boolean;
  /** Azubi-Sonderregeln in bestimmten Bundeslaendern (Thueringen: 3 Tage statt 5). */
  istAzubi: boolean;
  /** Fuer die Kurs-Empfehlung im PDF-Lead-Magnet: welche Kammer-Punkte-Systeme sind relevant. */
  cmeSystem: 'BZAeK' | 'PTK' | 'HWK' | null;
}

export const ROLLEN: Rolle[] = [
  // === Zahnarztpraxis ===
  {
    code: 'zfa',
    branche: 'zahnarztpraxis',
    label: 'ZFA / ZMP / ZMV / ZMF / DH',
    kurzbeschreibung: 'Angestellte Praxis-Mitarbeiterin (Voll- oder Teilzeit).',
    selbststaendig: false,
    istAzubi: false,
    cmeSystem: 'BZAeK',
  },
  {
    code: 'angest_zahnarzt',
    branche: 'zahnarztpraxis',
    label: 'Angestellte Zahnärztin / Angestellter Zahnarzt',
    kurzbeschreibung: 'Angestellt in fremder Praxis oder in einem MVZ.',
    selbststaendig: false,
    istAzubi: false,
    cmeSystem: 'BZAeK',
  },
  {
    code: 'praxis_inhaber_zahn',
    branche: 'zahnarztpraxis',
    label: 'Praxis-Inhaberin / Praxis-Inhaber (selbstständig)',
    kurzbeschreibung: 'Eigene Praxis (Einzel- oder Berufsausübungsgemeinschaft).',
    selbststaendig: true,
    istAzubi: false,
    cmeSystem: 'BZAeK',
  },
  {
    code: 'azubi_zfa',
    branche: 'zahnarztpraxis',
    label: 'Auszubildende(r) ZFA',
    kurzbeschreibung: 'In dualer Ausbildung zur ZFA.',
    selbststaendig: false,
    istAzubi: true,
    cmeSystem: null,
  },

  // === Zahntechnik ===
  {
    code: 'zt_geselle',
    branche: 'zahntechnik',
    label: 'Zahntechniker-Gesellin / Geselle',
    kurzbeschreibung: 'Angestellte im Zahntechnik-Labor.',
    selbststaendig: false,
    istAzubi: false,
    cmeSystem: 'HWK',
  },
  {
    code: 'zt_meister',
    branche: 'zahntechnik',
    label: 'Zahntechniker-Meisterin / Meister (angestellt)',
    kurzbeschreibung: 'Meister oder Laborleitung, angestellt.',
    selbststaendig: false,
    istAzubi: false,
    cmeSystem: 'HWK',
  },
  {
    code: 'labor_inhaber',
    branche: 'zahntechnik',
    label: 'Labor-Inhaberin / Labor-Inhaber (selbstständig)',
    kurzbeschreibung: 'Eigenes Zahntechnik-Labor.',
    selbststaendig: true,
    istAzubi: false,
    cmeSystem: 'HWK',
  },
  {
    code: 'azubi_zt',
    branche: 'zahntechnik',
    label: 'Auszubildende(r) Zahntechnik',
    kurzbeschreibung: 'In dualer Ausbildung zur Zahntechnikerin.',
    selbststaendig: false,
    istAzubi: true,
    cmeSystem: null,
  },

  // === Psychotherapie ===
  {
    code: 'angest_pp',
    branche: 'psychotherapie',
    label: 'Angestellte Psychotherapeutin (PP / KJP)',
    kurzbeschreibung: 'Approbiert und angestellt in Klinik, Ambulanz oder MVZ.',
    selbststaendig: false,
    istAzubi: false,
    cmeSystem: 'PTK',
  },
  {
    code: 'ptw',
    branche: 'psychotherapie',
    label: 'Psychotherapeut(in) in Weiterbildung (PtW)',
    kurzbeschreibung: 'Weiterbildung nach PsychThG 2020 (früher PiA).',
    selbststaendig: false,
    istAzubi: false,
    cmeSystem: 'PTK',
  },
  {
    code: 'praxis_angestellter_ppp',
    branche: 'psychotherapie',
    label: 'Praxis-Angestellte(r) (Sekretariat / Praxis-Management)',
    kurzbeschreibung: 'Nicht-therapeutisch angestellt in einer PP-Praxis.',
    selbststaendig: false,
    istAzubi: false,
    cmeSystem: null,
  },
  {
    code: 'praxis_inhaber_pp',
    branche: 'psychotherapie',
    label: 'Niedergelassene Psychotherapeutin (selbstständig)',
    kurzbeschreibung: 'Eigene Praxis (kassenzugelassen oder Privatpraxis).',
    selbststaendig: true,
    istAzubi: false,
    cmeSystem: 'PTK',
  },
];

export const getRolleByCode = (code: string): Rolle | undefined =>
  ROLLEN.find((r) => r.code === code);

export const getRollenByBranche = (branche: BranchenCode): Rolle[] =>
  ROLLEN.filter((r) => r.branche === branche);
