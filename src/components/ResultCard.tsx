import React from "react";
import { Card } from "@/components/ui/card";
import { AddressComponents, CalculatorData, Results } from "@/types";
import { ExtendedTimeSavings } from "@/utils/calculations/extendedTimeSavingsCalculations";
import { ResultSummary } from "./result/ResultSummary";
import { ResultDetails } from "./result/ResultDetails";
import { TimeSavingsBreakdown } from "./result/TimeSavingsBreakdown";
import { CustomForm } from "./CustomForm";
import { useGTMTracking } from "@/hooks/useGTMTracking";
import { usePlatformStats } from "@/hooks/usePlatformStats";
import { ArrowRight } from "lucide-react";

// Extended results interface
interface ExtendedResults extends Results {
  extendedTimeSavings?: ExtendedTimeSavings;
}

interface ResultCardProps {
  results: ExtendedResults;
  calculatorData: CalculatorData;
  addressComponents: AddressComponents;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  results,
  calculatorData,
  addressComponents
}) => {
  const { trackEvent } = useGTMTracking();
  const { stats: platformStats } = usePlatformStats();

  const freePct = Math.round(platformStats.free_or_sponsored_pct * 100);
  const pricePct = Math.round(platformStats.price_optimization_factor * 100);

  const handleSignupClick = () => {
    trackEvent({
      event: 'signup_cta_click',
      source: 'rechner_result',
      savings_amount: Math.round(Number(results.savings)) || 0,
      team_size: calculatorData.teamSize || 0,
    });
  };

  const handleAnalyseScroll = () => {
    trackEvent({
      event: 'analyse_cta_click',
      source: 'rechner_result',
    });
    const formElement = document.getElementById('detailed-analysis-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const emailInput = document.querySelector('#email');
        if (emailInput) {
          (emailInput as HTMLInputElement).focus();
        }
      }, 500);
    }
  };

  const signupUrl =
    'https://www.kurs-radar.com/signup?utm_source=rechner&utm_medium=result_page&utm_campaign=fortbildungskosten_p0';

  return (
    <div className="space-y-6">
      <Card className="w-full bg-card border shadow-lg">
        <div className="p-6">
          <div className="space-y-4">
            <h3 className="font-montserrat text-2xl font-semibold text-card-foreground">Deine Ersparnis</h3>

            <ResultSummary
              savings={results.savings}
              savingsPercentage={results.savingsPercentage}
              totalTraditionalCosts={results.totalTraditionalCosts}
              optimizedCosts={results.optimizedCosts}
            />

            {/* CTAs direkt nach der Hauptersparnis: Primary Signup + Secondary Analyse */}
            <div className="flex flex-col items-center gap-3 py-4">
              <a
                href={signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSignupClick}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-4 px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-lg font-montserrat w-full sm:w-auto"
              >
                Jetzt kostenlos bei KursRadar anmelden und Kurse buchen
                <ArrowRight className="h-5 w-5" />
              </a>
              <p className="text-sm text-muted-foreground font-roboto">
                Kostenlos für Praxen · Keine Kreditkarte nötig
              </p>

              <button
                type="button"
                onClick={handleAnalyseScroll}
                className="mt-2 text-primary hover:text-primary/80 underline underline-offset-4 text-sm font-medium font-roboto transition-colors"
              >
                Lieber zuerst detaillierte E-Mail-Analyse anfordern →
              </button>
            </div>

            <ResultDetails 
              traditionalCostsDentists={results.traditionalCostsDentists}
              traditionalCostsAssistants={results.traditionalCostsAssistants}
              nearestInstitute={results.nearestInstitute}
              timeSavings={results.timeSavings}
            />

            <div className="mt-6 space-y-4 border-t border-border pt-4">
              <div className="text-sm text-muted-foreground font-roboto">
                <h4 className="mb-2 font-montserrat font-medium text-card-foreground">So setzt sich dein Einsparpotenzial zusammen:</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li>
                    <strong>Kostenlose & gesponserte Kurse ({freePct}%):</strong>{" "}
                    Aktuell sind <strong>{platformStats.free_or_sponsored_count} von{" "}
                    {platformStats.total_upcoming_count}</strong> kommenden Kursen auf
                    KursRadar kostenlos oder gesponsert &mdash; Webinare und Präsenz-Formate,
                    die du bei der Suche auf einzelnen Anbieter-Websites oft übersiehst.
                    {platformStats.is_fallback && (
                      <span className="text-xs text-muted-foreground/60 ml-1">(Stand cached)</span>
                    )}
                  </li>
                  <li>
                    <strong>Preisoptimierung ({pricePct}%):</strong> Durch den transparenten
                    Preisvergleich findest du günstigere Alternativen für die gleichen Inhalte.
                  </li>
                  {results.nearestInstitute && (
                    <li>
                      <strong>Reisekosten:</strong> Durch mehr Online-Optionen reduzierst du Fahrten zum nächstgelegenen Institut ({Math.round(results.nearestInstitute.oneWayDistance)} km).
                    </li>
                  )}
                  <li>
                    <strong>Zeitersparnis:</strong> Keine stundenlange Recherche auf dutzenden Websites - alle Kurse auf einer Plattform.
                  </li>
                  <li>
                    <strong>Plattformkosten: 0 €</strong> - KursRadar ist für Praxen kostenlos, da die Anbieter zahlen.
                  </li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground/70 font-roboto">
                * Die Berechnung basiert auf durchschnittlichen Fortbildungskosten in Deutschland. Die tatsächlichen Kosten können je nach Region und gewählten Fortbildungsanbietern variieren.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Extended Time Savings Analysis */}
      {results.extendedTimeSavings && (
        <TimeSavingsBreakdown extendedTimeSavings={results.extendedTimeSavings} />
      )}

      {/* Contact Form */}
      <CustomForm 
        calculatorData={calculatorData}
        results={results}
        addressComponents={addressComponents}
      />
    </div>
  );
};
