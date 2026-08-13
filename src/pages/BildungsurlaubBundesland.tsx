import { Link, useParams, Navigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import {
  BUNDESLAND_BY_SLUG,
  slugifyBundesland,
  KERN_WEBSITE_BILDUNGSURLAUB_URL,
} from "@/components/bildungsurlaub/seo/bundeslandSlug";
import { BUNDESLAENDER } from "@/components/bildungsurlaub/data/bundeslaender";
import { BildungsurlaubFAQ } from "@/components/bildungsurlaub/seo/BildungsurlaubFAQ";
import { buildBundeslandFAQ } from "@/components/bildungsurlaub/seo/bundeslandFAQ";
import { buildFAQPageSchema, buildBreadcrumbSchema } from "@/components/bildungsurlaub/seo/schemas";
import { Button } from "@/components/ui/button";

const BildungsurlaubBundesland = () => {
  const { slug } = useParams<{ slug: string }>();
  const bundesland = slug ? BUNDESLAND_BY_SLUG[slug] : undefined;

  if (!bundesland) {
    return <Navigate to="/bildungsurlaub" replace />;
  }

  const path = `/bildungsurlaub/${slug}`;
  const faq = buildBundeslandFAQ(bundesland);
  const title = bundesland.keinAnspruch
    ? `Bildungsurlaub ${bundesland.name} – Warum es keinen gesetzlichen Anspruch gibt | KursRadar`
    : `Bildungsurlaub ${bundesland.name} für Zahnärzte & ZFA · ${bundesland.tageProJahr}${bundesland.zweiJahresRegelung ? " Tage / 2 Jahre" : " Tage/Jahr"} · KursRadar`;
  const description = bundesland.keinAnspruch
    ? `${bundesland.name} hat kein Bildungsurlaubsgesetz. Was Zahnärzte, ZFAs und Zahntechniker stattdessen tun können – inkl. Steuer-Tipps und Alternativen.`
    : `Bildungsurlaub in ${bundesland.name} für zahnmedizinische Fortbildungen: ${bundesland.tageProJahr}${bundesland.zweiJahresRegelung ? " Tage in 2 Jahren" : " Tage pro Jahr"}, Antragsfrist ${bundesland.antragsfrist}, ${bundesland.gesetz}. Anspruch prüfen und Musterantrag als PDF.`;

  const jsonLd = [
    buildBreadcrumbSchema([
      { name: "Start", path: "/" },
      { name: "Bildungsurlaub-Check", path: "/bildungsurlaub" },
      { name: bundesland.name, path },
    ]),
    buildFAQPageSchema(faq),
  ];

  const kernWebsiteUrl = KERN_WEBSITE_BILDUNGSURLAUB_URL(slug!);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={title}
        description={description}
        path={path}
        jsonLd={jsonLd}
        canonicalUrl={kernWebsiteUrl ?? undefined}
        noindex={!kernWebsiteUrl}
      />
      <div className="container py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground font-roboto">
          <Link to="/" className="hover:text-foreground hover:underline">Start</Link>
          <span className="mx-2">/</span>
          <Link to="/bildungsurlaub" className="hover:text-foreground hover:underline">Bildungsurlaub-Check</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{bundesland.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-montserrat text-3xl font-bold text-foreground sm:text-4xl">
            Bildungsurlaub {bundesland.name} für Zahnärzte, ZFA & Zahntechniker
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground font-roboto">
            {bundesland.keinAnspruch
              ? `${bundesland.name} ist das einzige Bundesland ohne Bildungsurlaubsgesetz. Angestellte in Zahnarztpraxen haben hier keinen gesetzlichen Anspruch auf bezahlten Bildungsurlaub für Fortbildungen – wir zeigen dir die Alternativen.`
              : `Angestellte Zahnärztinnen, Zahnärzte, ZFAs und Zahntechniker in ${bundesland.name} haben nach ${bundesland.gesetz} Anspruch auf bezahlten Bildungsurlaub für anerkannte zahnmedizinische Fortbildungen. Diese Seite fasst die geltenden Regeln zusammen und führt dich in wenigen Schritten zum fertigen Musterantrag.`}
          </p>
        </header>

        <section aria-labelledby="fakten-heading" className="mb-10 rounded-lg border bg-card p-6 shadow-sm">
          <h2 id="fakten-heading" className="font-montserrat text-xl font-semibold text-foreground">
            Die wichtigsten Fakten auf einen Blick
          </h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm font-roboto sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-muted-foreground">Rechtsgrundlage</dt>
              <dd className="text-foreground">{bundesland.gesetz}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted-foreground">Anspruch</dt>
              <dd className="text-foreground">
                {bundesland.keinAnspruch
                  ? "Kein gesetzlicher Anspruch"
                  : bundesland.tageProJahr === null
                    ? "–"
                    : `${bundesland.tageProJahr} Tage ${bundesland.zweiJahresRegelung ? "/ 2 Jahre" : "/ Jahr"}`}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-muted-foreground">Wartezeit</dt>
              <dd className="text-foreground">{bundesland.wartezeit}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted-foreground">Antragsfrist</dt>
              <dd className="text-foreground">{bundesland.antragsfrist}</dd>
            </div>
            {bundesland.kleinbetriebsSchwelle !== null && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-muted-foreground">Kleinbetriebsklausel</dt>
                <dd className="text-foreground">
                  Unter {bundesland.kleinbetriebsSchwelle} Beschäftigten kein Anspruch
                </dd>
              </div>
            )}
            {bundesland.ueberforderungsSchutzSchwelle !== null && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-muted-foreground">Überforderungsschutz</dt>
                <dd className="text-foreground">
                  Bei bis zu {bundesland.ueberforderungsSchutzSchwelle} Beschäftigten Sonderregel
                </dd>
              </div>
            )}
            {bundesland.anerkennungsstelleUrl && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-muted-foreground">Anerkennungsstelle</dt>
                <dd>
                  <a
                    href={bundesland.anerkennungsstelleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {bundesland.anerkennungsstelleUrl}
                  </a>
                </dd>
              </div>
            )}
            {bundesland.gueltigAb && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-muted-foreground">
                  {bundesland.zukuenftig ? "Tritt in Kraft am" : "Gültig seit"}
                </dt>
                <dd className="text-foreground">
                  {new Date(bundesland.gueltigAb).toLocaleDateString("de-DE")}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {bundesland.besonderheiten && (
          <section aria-labelledby="besonderheiten-heading" className="mb-10">
            <h2
              id="besonderheiten-heading"
              className="font-montserrat text-xl font-semibold text-foreground"
            >
              Besonderheiten in {bundesland.name}
            </h2>
            <p className="mt-3 font-roboto text-muted-foreground leading-relaxed">
              {bundesland.besonderheiten}
            </p>
          </section>
        )}

        <section className="mb-10 rounded-lg bg-primary/5 p-6 text-center">
          <h2 className="font-montserrat text-xl font-semibold text-foreground">
            {bundesland.keinAnspruch
              ? "Bildungsurlaub-Rechner starten (16 Bundesländer)"
              : `Anspruch für ${bundesland.name} jetzt prüfen`}
          </h2>
          <p className="mt-2 text-muted-foreground font-roboto">
            Der KursRadar-Rechner klärt in 3 Schritten deinen Anspruch inkl. Kleinbetriebs­klausel
            und erstellt einen personalisierten Musterantrag als PDF.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/bildungsurlaub">Zum Bildungsurlaubs-Check</Link>
          </Button>
        </section>

        <BildungsurlaubFAQ
          items={faq}
          heading={`Häufige Fragen zum Bildungsurlaub in ${bundesland.name}`}
        />

        <section aria-labelledby="andere-bundeslaender" className="mt-16">
          <h2
            id="andere-bundeslaender"
            className="font-montserrat text-2xl font-bold text-foreground"
          >
            Bildungsurlaub in anderen Bundesländern
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2 font-roboto">
            {BUNDESLAENDER.filter((b) => b.code !== bundesland.code).map((b) => (
              <li key={b.code}>
                <Link
                  to={`/bildungsurlaub/${slugifyBundesland(b.name)}`}
                  className="inline-block rounded-full border bg-card px-4 py-2 text-sm hover:border-primary hover:text-primary"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default BildungsurlaubBundesland;
