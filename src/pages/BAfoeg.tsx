import { BAfoegRechner } from "@/components/bafoeg/BAfoegRechner";

const BAfoeg = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="font-montserrat text-4xl font-bold text-foreground sm:text-5xl">
            <span className="text-primary">Aufstiegs-BAfoeg</span> Rechner
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
            Berechne deinen tatsächlichen Eigenanteil für zahnmedizinische
            Aufstiegsfortbildungen — von ZMP bis Dentalhygienikerin.
          </p>
          <p className="mt-2 text-sm text-muted-foreground/70 font-roboto">
            Bis zu 75 % Förderung durch das Aufstiegsfortbildungsfoerderungsgesetz (AFBG)
          </p>
        </div>
        <BAfoegRechner />
      </div>
    </div>
  );
};

export default BAfoeg;
