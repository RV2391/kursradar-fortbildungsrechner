import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { KOSTENRECHNER_FAQ } from "./faqData";

export const KostenrechnerFAQ = () => (
  <section id="faq" className="mt-16 max-w-3xl mx-auto">
    <h2 className="font-sans text-2xl font-semibold text-foreground mb-6">
      Häufige Fragen zu Fortbildungskosten in der Zahnarztpraxis
    </h2>
    <Accordion type="single" collapsible className="w-full">
      {KOSTENRECHNER_FAQ.map((item, idx) => (
        <AccordionItem key={idx} value={`item-${idx}`}>
          <AccordionTrigger className="text-left text-base">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);
