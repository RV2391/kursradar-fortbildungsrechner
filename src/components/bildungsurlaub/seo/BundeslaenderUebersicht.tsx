import { Link } from "react-router-dom";
import { BUNDESLAENDER } from "../data/bundeslaender";
import { slugifyBundesland } from "./bundeslandSlug";

const formatTage = (tage: number | null, zwei: boolean, keinAnspruch: boolean) => {
  if (keinAnspruch) return "Kein Anspruch";
  if (tage === null) return "–";
  return zwei ? `${tage} Tage / 2 Jahre` : `${tage} Tage/Jahr`;
};

export const BundeslaenderUebersicht = () => (
  <section aria-labelledby="bundeslaender-heading" className="mt-16">
    <h2
      id="bundeslaender-heading"
      className="font-montserrat text-2xl font-bold text-foreground sm:text-3xl"
    >
      Bildungsurlaub in allen 16 Bundesländern – Übersicht
    </h2>
    <p className="mt-2 max-w-2xl text-muted-foreground font-roboto">
      Klicke auf ein Bundesland für Details zu Anspruch, Fristen, Kleinbetriebsklausel
      und Anerkennungsstelle.
    </p>
    <div className="mt-6 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left font-montserrat">
          <tr>
            <th className="px-4 py-3">Bundesland</th>
            <th className="px-4 py-3">Gesetz</th>
            <th className="px-4 py-3">Anspruch</th>
            <th className="px-4 py-3">Antragsfrist</th>
          </tr>
        </thead>
        <tbody className="font-roboto">
          {BUNDESLAENDER.map((b) => (
            <tr key={b.code} className="border-t hover:bg-muted/30">
              <td className="px-4 py-3">
                <Link
                  to={`/bildungsurlaub/${slugifyBundesland(b.name)}`}
                  className="font-medium text-primary hover:underline"
                >
                  {b.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{b.gesetz}</td>
              <td className="px-4 py-3">
                {formatTage(b.tageProJahr, b.zweiJahresRegelung, b.keinAnspruch)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{b.antragsfrist}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
