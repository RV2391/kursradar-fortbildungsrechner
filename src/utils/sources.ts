/**
 * Zentrale Quellensammlung fuer den KursRadar Fortbildungsrechner.
 *
 * Jede Zahl, die im Rechner angezeigt wird, muss hier eine Quelle haben.
 * Format: Kurztext (fuer UI-Fussnoten) + vollstaendige Referenz + URL + Pruef-Datum.
 *
 * WICHTIG: Vor jedem Release pruefen, ob die Quellen noch aktuell sind.
 * lastVerified gibt an, wann die Quelle zuletzt manuell geprueft wurde.
 */

export interface Source {
  /** Kurztext fuer Fussnoten in der UI */
  short: string;
  /** Vollstaendige Quellenangabe */
  full: string;
  /** Link zum Originaltext (Gesetz, Studie, etc.) */
  url: string;
  /** Kernaussage / relevante Zahl */
  detail: string;
  /** Datum der letzten manuellen Pruefung (YYYY-MM-DD) */
  lastVerified: string;
}

// ============================================================
// GESETZLICHE GRUNDLAGEN
// ============================================================

export const LEGAL_SOURCES: Record<string, Source> = {
  FORTBILDUNGSPFLICHT_ZA: {
    short: "§ 95d SGB V",
    full: "Sozialgesetzbuch V, § 95d — Pflicht zur fachlichen Fortbildung",
    url: "https://www.gesetze-im-internet.de/sgb_5/__95d.html",
    detail: "Vertragszahnaerzte: 125 Fortbildungspunkte in 5 Jahren (Ø 25/Jahr). Sanktion bei Nichterfuellung: 10 % Honorarkuerzung (Quartale 1-4), 25 % ab Quartal 5, Zulassungsentzug nach 2 Jahren.",
    lastVerified: "2026-03-16"
  },

  STRAHLENSCHUTZ: {
    short: "§ 48 StrlSchV",
    full: "Strahlenschutzverordnung (StrlSchV), § 48 Abs. 1 — Aktualisierung der Fachkunde im Strahlenschutz",
    url: "https://www.gesetze-im-internet.de/strlschv_2018/__48.html",
    detail: "Fachkunde muss alle 5 Jahre aktualisiert werden. Bei Fristueberschreitung erlischt die Berechtigung zum Roentgen tagesgenau. Gilt fuer Zahnaerzte UND ZFA.",
    lastVerified: "2026-03-16"
  },

  CME_PUNKTE_SYSTEM: {
    short: "BZAEK/DGZMK Punktebewertung",
    full: "Bundeszahnaerztekammer & DGZMK — Gemeinsame Bewertung von Fortbildung",
    url: "https://www.bzaek.de/fortbildung.html",
    detail: "1 Punkt pro 45 Min. Vortrag (max. 8/Tag), 2 Punkte fuer interaktive Online-CME mit Test, max. 10 Punkte/Jahr durch Selbststudium (max. 50 in 5 Jahren).",
    lastVerified: "2026-03-16"
  },

  HONORARKUERZUNG: {
    short: "§ 95d Abs. 3 SGB V",
    full: "Sozialgesetzbuch V, § 95d Abs. 3 — Sanktionen bei Nichterfuellung",
    url: "https://www.gesetze-im-internet.de/sgb_5/__95d.html",
    detail: "10 % Honorarkuerzung in Quartalen 1-4, 25 % ab Quartal 5 nach Fristablauf.",
    lastVerified: "2026-03-16"
  },
};

// ============================================================
// BILDUNGSURLAUB — PRO BUNDESLAND
// ============================================================

export const BILDUNGSURLAUB_SOURCES: Record<string, Source> = {
  BW: {
    short: "BzG BW",
    full: "Bildungszeitgesetz Baden-Wuerttemberg (BzG BW) vom 17.03.2015",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/baden-wuerttemberg",
    detail: "5 Tage/Jahr. Kleinbetriebsklausel: <10 Beschaeftigte kein Anspruch. Wartezeit: 12 Monate. Antragsfrist: 8 Wochen.",
    lastVerified: "2026-03-16"
  },
  BY: {
    short: "Kein Gesetz",
    full: "Bayern — Kein Bildungsurlaubsgesetz",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/bayern",
    detail: "Einziges Bundesland ohne Bildungsurlaubsgesetz. Volksbegehren-Initiativen von ver.di/DGB laufen.",
    lastVerified: "2026-03-16"
  },
  BE: {
    short: "BiUrlG BE",
    full: "Berliner Bildungsurlaubsgesetz (BiUrlG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/berlin",
    detail: "10 Tage in 2 Jahren. Unter 25-Jaehrige: 10 Tage/Jahr. Wartezeit: 6 Monate.",
    lastVerified: "2026-03-16"
  },
  BB: {
    short: "BbgWBG",
    full: "Brandenburgisches Weiterbildungsgesetz (BbgWBG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/brandenburg",
    detail: "10 Tage in 2 Jahren. Wartezeit: 6 Monate.",
    lastVerified: "2026-03-16"
  },
  HB: {
    short: "BremBUG",
    full: "Bremisches Bildungsurlaubsgesetz (BremBUG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/bremen",
    detail: "10 Tage in 2 Jahren. Unter 25-Jaehrige: zusaetzlich 2 Tage fuer politische Bildung. Antragsfrist: 4 Wochen.",
    lastVerified: "2026-03-16"
  },
  HH: {
    short: "HmbBUG",
    full: "Hamburgisches Bildungsurlaubsgesetz (HmbBUG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/hamburg",
    detail: "10 Tage in 2 Jahren. Wartezeit: 6 Monate.",
    lastVerified: "2026-03-16"
  },
  HE: {
    short: "HBUG",
    full: "Hessisches Bildungsurlaubsgesetz (HBUG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/hessen",
    detail: "5 Tage/Jahr. Wartezeit: 6 Monate.",
    lastVerified: "2026-03-16"
  },
  MV: {
    short: "BfG M-V",
    full: "Bildungsfreistellungsgesetz Mecklenburg-Vorpommern (BfG M-V)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/mecklenburg-vorpommern",
    detail: "5 Tage/Jahr. Auch fuer ehrenamtliche Taetigkeit. Antragsfrist: 8 Wochen.",
    lastVerified: "2026-03-16"
  },
  NI: {
    short: "NBildUG",
    full: "Niedersaechsisches Bildungsurlaubsgesetz (NBildUG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/niedersachsen",
    detail: "5 Tage/Jahr. Antragsfrist: 4 Wochen.",
    lastVerified: "2026-03-16"
  },
  NW: {
    short: "AWbG NRW",
    full: "Arbeitnehmerweiterbildungsgesetz NRW (AWbG)",
    url: "https://recht.nrw.de/lmi/owa/br_text_anzeigen?v_id=10000000000000000550",
    detail: "5 Tage/Jahr. Kleinbetriebsklausel: <10 Beschaeftigte kein Anspruch. Wartezeit: 6 Monate.",
    lastVerified: "2026-03-16"
  },
  RP: {
    short: "BFG RP",
    full: "Bildungsfreistellungsgesetz Rheinland-Pfalz (BFG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/rheinland-pfalz",
    detail: "10 Tage in 2 Jahren. Kleinbetriebsklausel: <5 Beschaeftigte. Wartezeit: 2 Jahre (!).",
    lastVerified: "2026-03-16"
  },
  SL: {
    short: "SBFG",
    full: "Saarlaendisches Bildungsfreistellungsgesetz (SBFG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/saarland",
    detail: "6 Tage/Jahr (mehr als alle anderen!). Wartezeit: 12 Monate.",
    lastVerified: "2026-03-16"
  },
  SN: {
    short: "SaechsBFG (ab 2027)",
    full: "Saechsisches Bildungsfreistellungsgesetz — verabschiedet Februar 2026, in Kraft ab 2027",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/sachsen",
    detail: "NEU: 3 Tage/Jahr (ab 01.01.2027). Kleinbetriebsklausel: ≤20 Beschaeftigte mit Erstattungsanspruch. Wartezeit: 6 Monate.",
    lastVerified: "2026-03-16"
  },
  ST: {
    short: "BfG LSA",
    full: "Bildungsfreistellungsgesetz Sachsen-Anhalt (BfG LSA) — Neufassung ab September 2026",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/sachsen-anhalt",
    detail: "5 Tage/Jahr. Kleinbetriebsklausel: <5 Beschaeftigte. Neufassung ab 09/2026.",
    lastVerified: "2026-03-16"
  },
  SH: {
    short: "WBG SH",
    full: "Weiterbildungsgesetz Schleswig-Holstein (WBG SH)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/schleswig-holstein",
    detail: "5 Tage/Jahr. Wartezeit: 6 Monate.",
    lastVerified: "2026-03-16"
  },
  TH: {
    short: "ThuerBfG",
    full: "Thueringer Bildungsfreistellungsgesetz (ThuerBfG)",
    url: "https://www.bildungsurlaub.de/infos/bundeslaender/thueringen",
    detail: "5 Tage/Jahr. Kleinbetriebsklausel: <5 Beschaeftigte. Antragsfrist: 8 Wochen.",
    lastVerified: "2026-03-16"
  },
};

// ============================================================
// BRANCHENDATEN & STATISTIKEN
// ============================================================

export const INDUSTRY_SOURCES: Record<string, Source> = {
  PRAXIS_UMSATZ: {
    short: "ZWP-Online 2023",
    full: "ZWP-Online Praxismanagement-Studie 2023 — Stundensaetze in der Zahnarztpraxis",
    url: "https://www.zwp-online.info/zwpnews/wirtschaft-und-recht/praxismanagement/stundensatze-in-der-zahnarztpraxis",
    detail: "Durchschnittlicher Praxisumsatz: ca. 250-300 EUR/Stunde. Konservativ: 250 EUR/h im Rechner.",
    lastVerified: "2026-03-16"
  },

  ZFA_TARIFVERTRAG: {
    short: "VMF Tarif 2025",
    full: "Verband medizinischer Fachberufe e.V. (VMF) — Verguetungstarifvertrag ZFA 2025",
    url: "https://www.vmf-online.de/zfa/zfa-tarife",
    detail: "ZFA-Einstiegsgehalt: ca. 2.280 EUR brutto/Monat. Opportunitaetskosten: 20 EUR/h (konservativ).",
    lastVerified: "2026-03-16"
  },

  ZAHNARZT_STUNDENSATZ: {
    short: "KZBV Jahrbuch",
    full: "KZBV Jahrbuch — Statistische Basisdaten zur vertragszahnaerztlichen Versorgung",
    url: "https://www.kzbv.de/jahrbuch.768.de.html",
    detail: "Opportunitaetskosten Zahnarzt: 80 EUR/h (konservativ, nur direkte Kosten ohne Umsatzausfall).",
    lastVerified: "2026-03-16"
  },

  BZAEK_STATISTIK: {
    short: "BZAEK Statistik",
    full: "Bundeszahnaerztekammer — Daten und Zahlen 2024/2025",
    url: "https://www.bzaek.de/ueber-uns/daten-und-zahlen.html",
    detail: "Ca. 73.000 berufstaetige Zahnaerzte in Deutschland. Durchschnittliche Praxis: 5-10 Mitarbeiter.",
    lastVerified: "2026-03-16"
  },

  KOSTENSTRUKTUR: {
    short: "Destatis 2019",
    full: "Statistisches Bundesamt — Kostenstruktur bei Arzt- und Zahnarztpraxen 2019",
    url: "https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Dienstleistungen/Gesundheitsdienstleistungen/_inhalt.html",
    detail: "Personalkosten: ca. 28 % des Umsatzes. Sachkosten: ca. 12 %.",
    lastVerified: "2026-03-16"
  },

  KM_PAUSCHALE: {
    short: "§ 9 EStG",
    full: "Einkommensteuergesetz § 9 Abs. 1 Satz 3 Nr. 4 — Entfernungspauschale",
    url: "https://www.gesetze-im-internet.de/estg/__9.html",
    detail: "0,30 EUR/km fuer die ersten 20 km, 0,38 EUR/km ab dem 21. km. Im Rechner: 0,30 EUR/km (konservativ).",
    lastVerified: "2026-03-16"
  },

  FORTBILDUNGSKOSTEN_ZA: {
    short: "IDZ/ZQMS",
    full: "Institut der Deutschen Zahnaerzte (IDZ) — Fortbildungskostenerhebung",
    url: "https://www.grosse-stoltenberg.de/wp-content/uploads/zfa-mal-anders-fortbildungskosten.pdf",
    detail: "Durchschnittliche jaehrliche Fortbildungskosten Zahnarzt: ca. 1.200 EUR (ohne Reise/Unterkunft).",
    lastVerified: "2026-03-16"
  },

  FORTBILDUNGSKOSTEN_ZFA: {
    short: "ZFA-Mal-Anders",
    full: "ZFA-Mal-Anders — Fortbildungskosten-Uebersicht 2024",
    url: "https://www.zfa-mal-anders.de/karriere/zfa/gehalt",
    detail: "Jaehrliche Fortbildungskosten ZFA: ca. 280 EUR (Pflichtunterweisungen + freiwillige Fortbildung).",
    lastVerified: "2026-03-16"
  },

  AUFSTIEGS_BAFOEG: {
    short: "BMBF AFBG",
    full: "Bundesministerium fuer Bildung und Forschung — Aufstiegsfortbildungsfoerderungsgesetz (AFBG)",
    url: "https://www.aufstiegs-bafoeg.de",
    detail: "Bis zu 75 % Zuschuss (nicht rueckzahlbar) auf Lehrgangskosten bis 15.000 EUR. Eigenanteil bei DH-Fortbildung (15.000 EUR): ca. 3.750 EUR.",
    lastVerified: "2026-03-16"
  },
};

// ============================================================
// BERECHNUNGSMETHODIK
// ============================================================

export const METHODOLOGY_SOURCES: Record<string, Source> = {
  KONSERVATIVE_SCHAETZUNG: {
    short: "Methodik",
    full: "KursRadar Berechnungsmethodik — Konservative Parameterwahl",
    url: "",
    detail: "Alle Schaetzungen bewusst konservativ: Nur direkte Opportunitaetskosten, keine Umsatzverluste, degressive Praxisausfall-Faktoren, ZFA-Teilnahmerate 30 %. Tatsaechliche Einsparungen koennen hoeher sein.",
    lastVerified: "2026-03-16"
  },

  PRAXISAUSFALL_DEGRESSION: {
    short: "Praxisausfall-Faktor",
    full: "Degressive Skalierung nach Praxisgroesse",
    url: "",
    detail: "Klein (1-4 MA): 80 % Ausfallwahrscheinlichkeit. Mittel (5-10): 50 %. Gross (11+): 30 %. Beruecksichtigt: 50 % Weekend-/Abendfortbildungen haben keinen Praxisausfall.",
    lastVerified: "2026-03-16"
  },

  KURSRADAR_MODELL: {
    short: "KursRadar Modell",
    full: "KursRadar GmbH — Geschaeftsmodell",
    url: "https://www.kurs-radar.com",
    detail: "Plattform ist fuer Praxen/Nutzer KOSTENLOS. Monetarisierung ueber 5 % Provision von Fortbildungsanbietern. Keine versteckten Kosten.",
    lastVerified: "2026-03-16"
  },
};

// ============================================================
// HELPER: Fussnote rendern
// ============================================================

/** Gibt eine klickbare Fussnote zurueck, z.B. "[§ 95d SGB V]" */
export const getSourceFootnote = (source: Source): string => {
  return `[${source.short}, geprueft ${source.lastVerified}]`;
};

/** Alle Quellen als flaches Array (fuer Quellen-Tab in der UI) */
export const getAllSources = (): Source[] => {
  return [
    ...Object.values(LEGAL_SOURCES),
    ...Object.values(BILDUNGSURLAUB_SOURCES),
    ...Object.values(INDUSTRY_SOURCES),
    ...Object.values(METHODOLOGY_SOURCES),
  ];
};
