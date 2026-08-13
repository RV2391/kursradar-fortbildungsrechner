import { BUNDESLAENDER, type BundeslandInfo } from "../data/bundeslaender";

export const slugifyBundesland = (name: string): string =>
  name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const BUNDESLAND_BY_SLUG: Record<string, BundeslandInfo> = BUNDESLAENDER.reduce(
  (acc, b) => {
    acc[slugifyBundesland(b.name)] = b;
    return acc;
  },
  {} as Record<string, BundeslandInfo>,
);

export const ALL_BUNDESLAND_SLUGS = Object.keys(BUNDESLAND_BY_SLUG);

/**
 * Kern-Website (kurs-radar.com) hat für 15 von 16 Bundesländern eigene
 * SEO-Landings unter /themen/bildungsurlaub-[slug] (Bayern fehlt, weil
 * kein Bildungsurlaubsgesetz). Diese Landings sind bereits indexiert
 * und ranken (Verified via GSC 13.08.2026, Position ~11).
 *
 * Unsere Sub-Landings auf der Rechner-Subdomain kanonisieren cross-domain
 * dorthin — so bleibt die SEO-Autorität konzentriert auf der Hauptdomain,
 * während Nutzer im Rechner-Flow weiterhin unseren Rechner-Kontext sehen.
 */
export const KERN_WEBSITE_BILDUNGSURLAUB_URL = (slug: string): string | null => {
  if (slug === "bayern") return null;
  return `https://www.kurs-radar.com/themen/bildungsurlaub-${slug}`;
};
