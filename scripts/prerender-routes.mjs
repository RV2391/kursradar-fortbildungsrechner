import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "..", "dist");

if (!existsSync(distDir)) {
  console.error("[prerender] dist/ fehlt — vite build muss vorher gelaufen sein");
  process.exit(1);
}

const BASE_URL = "https://rechner.kurs-radar.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const BUNDESLAENDER = [
  { name: "Baden-Württemberg", tage: "5 Tage/Jahr" },
  { name: "Bayern", tage: null },
  { name: "Berlin", tage: "10 Tage / 2 Jahre" },
  { name: "Brandenburg", tage: "10 Tage / 2 Jahre" },
  { name: "Bremen", tage: "10 Tage / 2 Jahre" },
  { name: "Hamburg", tage: "10 Tage / 2 Jahre" },
  { name: "Hessen", tage: "5 Tage/Jahr" },
  { name: "Mecklenburg-Vorpommern", tage: "5 Tage/Jahr" },
  { name: "Niedersachsen", tage: "5 Tage/Jahr" },
  { name: "Nordrhein-Westfalen", tage: "5 Tage/Jahr" },
  { name: "Rheinland-Pfalz", tage: "10 Tage / 2 Jahre" },
  { name: "Saarland", tage: "5 Tage/Jahr" },
  { name: "Sachsen", tage: "3 Tage/Jahr (ab 2027)" },
  { name: "Sachsen-Anhalt", tage: "5 Tage/Jahr" },
  { name: "Schleswig-Holstein", tage: "5 Tage/Jahr" },
  { name: "Thüringen", tage: "5 Tage/Jahr" },
];

const routes = [
  {
    path: "/",
    title: "KursRadar Rechner · Bildungsurlaub, BAföG & Fortbildungskosten",
    description:
      "Kostenlose Rechner für zahnmedizinische Fortbildungen: Bildungsurlaub-Anspruch prüfen, BAföG-Chancen einschätzen, Kursbudget planen.",
  },
  {
    path: "/bildungsurlaub",
    title:
      "Bildungsurlaub Zahnarzt & ZFA prüfen · Alle Bundesländer · KursRadar",
    description:
      "Prüfe in 3 Schritten, ob du Anspruch auf bezahlten Bildungsurlaub für deine zahnmedizinische Fortbildung hast. Für ZFA, angestellte Zahnärzte und Zahntechniker — mit Kleinbetriebsklausel und Anerkennungsstellen pro Bundesland.",
  },
  {
    path: "/bafoeg",
    title: "Aufstiegs-BAföG für Zahnmedizin & ZFA-Weiterbildung · KursRadar",
    description:
      "Aufstiegs-BAföG-Check für zahnmedizinische Weiterbildungen: Anspruch, Zuschuss-Höhe und Antragsweg in wenigen Schritten prüfen.",
  },
  {
    path: "/anbieter",
    title: "Fortbildungsanbieter auf KursRadar listen",
    description:
      "Bringe deine zahnmedizinischen Fortbildungen auf die führende Kurs-Plattform Deutschlands. Kurs-Uploads, Reichweite und Kalender-Integration.",
  },
];

// Kern-Website (kurs-radar.com) hat für 15 von 16 Bundesländern eigene
// /themen/bildungsurlaub-[slug]-Landings. Unsere Sub-Landings kanonisieren
// cross-domain dorthin, um SEO-Autorität auf der Hauptdomain zu bündeln.
// Bayern hat keine Kern-Landing → noindex (kein BUrlG in BY).
for (const b of BUNDESLAENDER) {
  const slug = slugify(b.name);
  const tageSuffix = b.tage ? ` · ${b.tage}` : "";
  const anspruchText = b.tage
    ? `${b.tage}, Antragsfrist, Kleinbetriebsklausel, Anerkennungsstelle`
    : "warum es keinen gesetzlichen Anspruch gibt und welche Alternativen bleiben";
  const isBayern = slug === "bayern";
  routes.push({
    path: `/bildungsurlaub/${slug}`,
    title: b.tage
      ? `Bildungsurlaub ${b.name} für Zahnärzte & ZFA${tageSuffix} · KursRadar`
      : `Bildungsurlaub ${b.name} – Warum es keinen gesetzlichen Anspruch gibt | KursRadar`,
    description: `Bildungsurlaub in ${b.name} für zahnmedizinische Fortbildungen: ${anspruchText}. Anspruch prüfen und Musterantrag als PDF erhalten.`,
    canonicalOverride: isBayern
      ? undefined
      : `https://www.kurs-radar.com/themen/bildungsurlaub-${slug}`,
    noindex: isBayern,
  });
}

const indexHtml = readFileSync(resolve(distDir, "index.html"), "utf-8");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const injectMeta = (html, { title, description, canonical, ogImage, noindex }) => {
  const titleTag = `<title>${esc(title)}</title>`;
  const robotsTag = noindex
    ? `\n    <meta name="robots" content="noindex, nofollow" />`
    : "";
  const metaBlock = `${robotsTag}
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="KursRadar" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />`;

  let out = html.replace(/<title>[\s\S]*?<\/title>/, titleTag);
  out = out.replace(/<meta\s+name="description"[^>]*>\s*/g, "");
  out = out.replace(/<meta\s+name="robots"[^>]*>\s*/g, "");
  out = out.replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/g, "");
  out = out.replace(/<meta\s+name="twitter:[^"]+"[^>]*>\s*/g, "");
  out = out.replace(/<link\s+rel="canonical"[^>]*>\s*/g, "");
  out = out.replace("</head>", `${metaBlock}\n  </head>`);
  return out;
};

let count = 0;
for (const route of routes) {
  const canonical =
    route.canonicalOverride ?? `${BASE_URL}${route.path === "/" ? "" : route.path}`;
  const html = injectMeta(indexHtml, {
    title: route.title,
    description: route.description,
    canonical,
    ogImage: DEFAULT_OG_IMAGE,
    noindex: !!route.noindex,
  });

  const target =
    route.path === "/"
      ? resolve(distDir, "index.html")
      : resolve(distDir, route.path.replace(/^\//, ""), "index.html");

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html, "utf-8");
  count++;
}

console.log(`[prerender] ${count} Routen mit statischen Meta-Tags erzeugt`);
