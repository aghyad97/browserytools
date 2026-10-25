"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface SeoFaqItem {
  q: string;
  a: string;
}

/**
 * The only interactive part of the tool SEO block. It takes the already
 * resolved questions as props so the prose map in `tool-content.ts` stays on
 * the server — never import it here.
 */
export function SeoFaq({ faq }: { faq: SeoFaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faq.map((item, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="last:border-b-0"
        >
          <AccordionTrigger className="text-start">{item.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
