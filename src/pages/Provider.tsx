import { ProviderCalculator } from "@/components/provider/ProviderCalculator";

const Provider = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="font-montserrat text-4xl font-bold text-foreground sm:text-5xl">
            <span className="text-primary">Kurs</span>Radar für Anbieter
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-roboto">
            Berechne dein Potenzial und steigere deine Reichweite
          </p>
          <div className="mt-6 mx-auto max-w-2xl text-left bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="font-montserrat text-xl font-semibold text-card-foreground mb-3">
              Als Fortbildungsanbieter auf KursRadar:
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground font-roboto">
              <li>Erreiche tausende Zahnärzte und ZFAs in deiner Region</li>
              <li>Steigere deine Kursauslastung durch gezielte Sichtbarkeit</li>
              <li>Profitiere von datenbasierten Preisempfehlungen</li>
              <li>Zahle nur bei Erfolg: 5% Provision auf vermittelte Buchungen</li>
            </ul>
          </div>
        </div>
        <ProviderCalculator />
      </div>
    </div>
  );
};

export default Provider;
