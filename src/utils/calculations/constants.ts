/**
 * Zentrale Konstanten fuer den Fortbildungskosten-Rechner.
 *
 * Alle Werte in dieser Datei sind Single-Source-of-Truth. Jede Zahl,
 * die in der UI oder im Payload auftaucht, muss von hier kommen —
 * doppelte Deklarationen an anderer Stelle sind ein Fehler.
 *
 * Quellen zu den Werten stehen in src/utils/sources.ts (INDUSTRY_SOURCES).
 * Vor jedem Release Quellen-`lastVerified` pruefen.
 */

// Jaehrliche Fortbildungskosten pro Person (ohne Reise/Unterkunft)
// Quelle: INDUSTRY_SOURCES.FORTBILDUNGSKOSTEN_ZA / _ZFA (IDZ, ZFA-Mal-Anders)
export const DENTIST_ANNUAL_COST = 1200;
export const ASSISTANT_ANNUAL_COST = 280;

// Reise-Parameter
// Quelle: INDUSTRY_SOURCES.KM_PAUSCHALE (§ 9 EStG Entfernungspauschale, konservativ ohne 21+km-Erhoehung)
export const COST_PER_KM = 0.30;
export const ASSISTANTS_PER_CAR = 5;

// Zeit-Parameter
export const MONTHS_PER_YEAR = 12;

// Opportunitaetskosten pro Stunde (konservativ, nur direkte Kosten)
// Quelle Zahnarzt: INDUSTRY_SOURCES.ZAHNARZT_STUNDENSATZ (KZBV Jahrbuch, konservative Naehrung ohne Umsatzausfall)
// Quelle ZFA:      INDUSTRY_SOURCES.ZFA_TARIFVERTRAG   (VMF Verguetungstarifvertrag 2025, TVoeD-VKA E5-Aequivalent)
export const DENTIST_HOURLY_RATE = 80;
export const ASSISTANT_HOURLY_RATE = 20;

// Vor- und Nachbereitungszeit pro Fortbildungseinheit (Stunden)
export const PREPARATION_TIME = 1;

// Einsparungspotenzial durch KursRadar (Platzhalter, ab A-P0-3 dynamisch aus platform-stats Edge Function)
// FREE_COURSE_PERCENTAGE: Anteil kostenloser/gesponsorter Kurse an allen kommenden Kursen
// PRICE_OPTIMIZATION_FACTOR: Preisspreizung Top-3 vs. Bottom-3-Anbieter pro Thema
export const FREE_COURSE_PERCENTAGE = 0.30;
export const PRICE_OPTIMIZATION_FACTOR = 0.15;

// Recherchezeit-Ersparnis pro Jahr durch zentrale Fortbildungs-Plattform (Stunden)
export const RESEARCH_TIME_SAVED_HOURS = 10;

// KursRadar-Plattformkosten fuer Praxen: 0 EUR. Monetarisierung ueber Anbieter (5 % Provision).
// Quelle: METHODOLOGY_SOURCES.KURSRADAR_MODELL
export const KURSRADAR_PLATFORM_COST = 0;
