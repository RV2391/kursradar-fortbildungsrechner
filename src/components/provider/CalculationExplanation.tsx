import { Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import type { CalculationExplanation as ExplanationType } from '@/types/provider';

interface CalculationExplanationProps {
  explanation: ExplanationType;
  explanationType: 'reach' | 'roi' | 'price';
}

export const CalculationExplanation = ({ explanation, explanationType }: CalculationExplanationProps) => {
  const { trackProviderExplanationOpen } = useGTMTracking();

  const handleAccordionChange = (value: string) => {
    if (value === 'explanation') {
      trackProviderExplanationOpen(explanationType);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
      <AccordionItem value="explanation" className="border-none">
        <AccordionTrigger className="py-2 text-sm text-muted-foreground hover:text-primary hover:no-underline">
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Wie berechnet?
          </span>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-0">
          <div className="space-y-3 rounded-lg bg-muted/50 p-3 text-sm">
            {/* Formula */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Formel:</p>
              <p className="text-card-foreground font-mono text-xs bg-background/50 p-2 rounded">
                {explanation.formula}
              </p>
            </div>
            
            {/* Values */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Werte:</p>
              <ul className="space-y-1">
                {explanation.values.map((item, index) => (
                  <li key={index} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="text-card-foreground font-medium">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Assumptions */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Annahmen:</p>
              <ul className="space-y-1">
                {explanation.assumptions.map((assumption, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-primary">•</span>
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};