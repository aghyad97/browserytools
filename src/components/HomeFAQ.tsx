import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function HomeFAQ() {
  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="mt-10 border rounded-lg p-4 md:p-6 bg-background">
        <h2 className="text-2xl font-semibold mb-4 text-left">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is BrowseryTools?</AccordionTrigger>
            <AccordionContent>
              BrowseryTools is a collection of free, open-source, browser-based
              utilities for images, files, text, audio/video and more—no sign
              up, no servers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Do my files leave my device?</AccordionTrigger>
            <AccordionContent>
              No. All processing happens locally in your browser using Web APIs
              like WebAssembly and Web Workers. Your files are not uploaded to a
              server.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it really free?</AccordionTrigger>
            <AccordionContent>
              Yes. All tools are free to use with no limits. If you find them
              useful, consider sharing the site and buying me a coffee.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I request a new tool?</AccordionTrigger>
            <AccordionContent>
              Absolutely. You can request or upvote ideas on our{" "}
              <Link href="/gh" className="underline" target="_blank">
                GitHub page
              </Link>
              .
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Does it work offline?</AccordionTrigger>
            <AccordionContent>
              Many tools continue to work after the initial load, but full
              offline support depends on your browser caching. We&apos;re
              improving this over time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>Is BrowseryTools open source?</AccordionTrigger>
            <AccordionContent>
              Yes. BrowseryTools is fully open source. You can view the code,
              report issues, and contribute on our{" "}
              <Link href="/gh" className="underline" target="_blank">
                GitHub repo
              </Link>
              .
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
