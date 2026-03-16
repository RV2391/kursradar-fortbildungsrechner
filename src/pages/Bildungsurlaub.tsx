import { BildungsurlaubRechner } from "@/components/bildungsurlaub/BildungsurlaubRechner";

const Bildungsurlaub = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="font-montserrat text-4xl font-bold text-foreground sm:text-5xl">
            <span className="text-primary">Bildungsurlaub</span>-Check
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
            Hast du Anspruch auf bezahlten Bildungsurlaub für deine zahnmedizinische Fortbildung?
            Prüfe es in 3 Schritten — mit Kleinbetriebsklausel und Dental-Hinweisen.
          </p>
          <p className="mt-2 text-sm text-muted-foreground/70 font-roboto">
            15 von 16 Bundesländern haben ein Bildungsurlaubsgesetz — nur Bayern nicht
          </p>
        </div>
        <BildungsurlaubRechner />
      </div>
    </div>
  );
};

export default Bildungsurlaub;
