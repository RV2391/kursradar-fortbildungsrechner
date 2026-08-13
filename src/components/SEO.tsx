import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  /**
   * Absolute canonical-URL, überschreibt den path-basierten Default.
   * Nutzen wenn eine andere Domain die kanonische Version ist (z.B.
   * cross-domain canonical auf die Kern-Website `kurs-radar.com`).
   */
  canonicalUrl?: string;
  jsonLd?: object | object[];
}

const BASE_URL = "https://rechner.kurs-radar.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

export const SEO = ({ title, description, path, image, noindex, canonicalUrl, jsonLd }: SEOProps) => {
  const canonical = canonicalUrl ?? `${BASE_URL}${path === "/" ? "" : path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="KursRadar" />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, i) => (
        <script key={`ld-${i}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
