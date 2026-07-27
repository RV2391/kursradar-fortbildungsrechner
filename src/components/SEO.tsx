import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

const BASE_URL = "https://rechner.kurs-radar.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

/**
 * Zentraler SEO-Head fuer alle Rechner-Routen.
 * Pro Route ein Aufruf: <SEO title="..." description="..." path="/bafoeg" />
 */
export const SEO = ({ title, description, path, image, noindex }: SEOProps) => {
  const canonical = `${BASE_URL}${path === "/" ? "" : path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

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
    </Helmet>
  );
};
