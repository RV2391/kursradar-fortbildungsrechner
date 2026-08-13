import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BILDUNGSURLAUB_FAQ, type FAQItem } from "./faqData";

interface Props {
  /** Falls Sub-Landings eigene FAQ-Sets liefern wollen. Default: globale FAQ. */
  items?: FAQItem[];
  /** Optionaler Heading-Override (z.B. „Häufige Fragen zu Bayern"). */
  heading?: string;
}

export const BildungsurlaubFAQ = ({
  items = BILDUNGSURLAUB_FAQ,
  heading = "Häufige Fragen zum Bildungsurlaub für Zahnärzte & ZFA",
}: Props) => (
  <section aria-labelledby="faq-heading" className="mt-16">
    <h2 id="faq-heading" className="font-montserrat text-2xl font-bold text-foreground sm:text-3xl">
      {heading}
    </h2>
    <Accordion type="single" collapsible className="mt-6 w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left font-montserrat text-base font-semibold">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="font-roboto text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);
