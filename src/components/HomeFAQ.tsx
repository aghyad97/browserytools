"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HomeFAQ() {
  const t = useTranslations("Home");

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="mt-10 border rounded-lg p-4 md:p-6 bg-background">
        <h2 className="text-2xl font-semibold mb-4 text-start">{t("faq.title")}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("faq.q1")}</AccordionTrigger>
            <AccordionContent>{t("faq.a1")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t("faq.q2")}</AccordionTrigger>
            <AccordionContent>{t("faq.a2")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t("faq.q3")}</AccordionTrigger>
            <AccordionContent>{t("faq.a3")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>{t("faq.q4")}</AccordionTrigger>
            <AccordionContent>
              {t("faq.a4_pre")}{" "}
              <Link href="/gh" className="underline" target="_blank">
                {t("faq.a4_link")}
              </Link>
              .
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>{t("faq.q5")}</AccordionTrigger>
            <AccordionContent>{t("faq.a5")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>{t("faq.q6")}</AccordionTrigger>
            <AccordionContent>
              {t("faq.a6_pre")}{" "}
              <Link href="/gh" className="underline" target="_blank">
                {t("faq.a6_link")}
              </Link>
              .
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
