import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://rechner.kurs-radar.com";

const today = new Date().toISOString().split("T")[0];

// Nur URLs auflisten, die WIR selbst indexiert haben wollen. Die 16
// Bundesland-Sub-Landings (/bildungsurlaub/[slug]) kanonisieren cross-domain
// auf die Kern-Website (kurs-radar.com/themen/bildungsurlaub-[slug]) — daher
// dürfen sie NICHT in unserer Sitemap stehen, sonst widerspricht das dem
// canonical-Signal. Bayern-Sub-Landing ist zusätzlich noindex.
const allRoutes = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/bildungsurlaub", priority: "0.9", changefreq: "weekly" },
  { loc: "/bafoeg", priority: "0.9", changefreq: "weekly" },
  { loc: "/anbieter", priority: "0.7", changefreq: "monthly" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const outPath = resolve(__dirname, "..", "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(`[sitemap] ${allRoutes.length} URLs written to public/sitemap.xml`);
