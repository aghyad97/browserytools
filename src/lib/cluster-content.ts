// ──────────────────────────────────────────────────────────────────────────────
// Long-form editorial copy for the /collections/* hub pages.
//
// Locale scoping follows the precedent set by `tool-content.ts`: prose is
// hand-authored in English and Arabic, and every other locale falls back to
// English. Short UI chrome (headings, labels, cluster names) lives in
// `messages/*.json` under the `Clusters` namespace and IS translated for all
// nine locales — see `src/lib/cluster-chrome.ts`.
//
// Everything here is claim-checked against the actual tool components. Where a
// tool approximates, the copy says so; nothing describes a capability the code
// does not have.
//
// Inline links use a deliberately tiny markup: [label](/tools/slug). It is
// parsed by `renderRichText` in `src/components/clusters/rich-text.tsx`.
// No HTML is accepted — this is static, hand-authored content, not user input.
// ──────────────────────────────────────────────────────────────────────────────

import type { ClusterId } from "./tool-clusters";
import { clusterContentAr } from "./cluster-content-ar";

export interface ClusterSection {
  heading: string;
  /** Paragraphs. Rendered as separate <p> elements. */
  body: string[];
}

export interface ClusterProse {
  /**
   * Opening paragraphs, before the first sub-heading.
   *
   * Note what is NOT here: the page title, tagline and meta title/description.
   * Those are short strings, so they live in `messages/*.json` under the
   * `Clusters` namespace and are translated for all nine locales. This module
   * only carries the long-form copy, which is English and Arabic.
   */
  lead: string[];
  sections: ClusterSection[];
  /** Heading above the tool list. */
  picksHeading: string;
  /** Intro paragraph above the tool list. */
  picksLead: string;
  /**
   * Per-member "reach for this when…" line, keyed by tool slug. Every slug in
   * the cluster should have one; a missing entry falls back to the tool's own
   * registry description.
   */
  picks: Record<string, string>;
  /** The honesty section. Every hub has one; it is not optional. */
  limits: ClusterSection;
}

export type ClusterLocale = "en" | "ar";

const en: Record<ClusterId, ClusterProse> = {
  // ── 1. AI / LLM developer tooling ──────────────────────────────────────────
  "ai-developer-tools": {
    lead: [
      "Building a product on top of a language model involves a surprising amount of clerical work that has nothing to do with the model itself. You need to know roughly how many tokens a document will cost before you send it. You need to know whether a prompt plus its retrieved context plus its expected output will actually fit in the window. You need to turn a rough idea of a function into a JSON Schema that a provider's tool-calling API will accept. You need to write a `CLAUDE.md`, a `.cursorrules`, and an MCP server config, all of which are just structured text files with conventions you half-remember.",
      "None of that needs a server, and most of it does not even need an API key. This collection gathers the utilities on this site that handle those chores in a browser tab. They break into four groups: things that measure (tokens, windows, cost), things that shape a prompt, things that produce a config artefact, and one thing that compares two versions of an instruction file so you can see what a teammate changed.",
      "The common thread is that you can use all of them while your actual work is still a scratchpad — before there is a repo, before there is a key in an environment variable, before you have decided which provider you are using.",
    ],
    sections: [
      {
        heading: "Measuring before you spend",
        body: [
          "Three of these tools share a single question: what is this text going to cost me, in tokens and in money? [Token Counter](/tools/token-counter) is the blunt instrument — paste text, pick a model, get a token count alongside character and word counts. [Context Window Calculator](/tools/context-window) takes the same count and puts it against a model's advertised window, so you can see that your 40-page contract is at 82% of a 128k window before you discover it by way of a truncation error. [AI Cost Calculator](/tools/ai-cost-calculator) is pure arithmetic on top of published per-million prices: input tokens, output tokens, number of requests, total.",
          "It is worth being precise about how the counting works, because token counts are the kind of number people quietly trust. The counter uses `gpt-tokenizer`, an implementation of OpenAI's byte-pair encoding. For OpenAI models that is the real tokenizer. For Claude and Llama it applies a small fixed multiplier to the GPT count — a calibration, not a second tokenizer. That is accurate enough to plan a budget or catch a context overflow, and it is not accurate enough to reconcile an invoice. Use it as a forecast; use your provider's usage dashboard as the ledger.",
          "[Model Comparison](/tools/model-comparison) is the reference table the other three read from: a sortable, filterable view of context window, input price, output price, tier and multimodal support across the models this site tracks. It is a hand-maintained table, not a live feed. Providers change prices and ship new models faster than any static table can follow, so treat it as a shortlist-builder and confirm the number on the provider's own pricing page before it goes into a spreadsheet someone will act on.",
        ],
      },
      {
        heading: "Shaping the prompt",
        body: [
          "Prompt work splits neatly into composition and serialisation, and there is a separate tool for each. [System Prompt Builder](/tools/system-prompt-builder) is about composition: it gives you labelled fields for role, tone, constraints, output format and examples, and assembles them into a system prompt as plain text, as an XML-tagged block, or as a JSON message object. The value is not the string concatenation — it is that the fields remind you which parts of a system prompt you routinely forget to write down.",
          "[Prompt Formatter](/tools/prompt-formatter) is about serialisation: you have a system, user and assistant turn, and you need them in ChatML, in Llama 3's header-token format, in Claude's XML convention, in an OpenAI-style message array, or as plain labelled text. This matters mostly when you are working against a raw completions endpoint or a local runtime, where getting a special token wrong produces a model that ignores your instructions rather than an error message.",
          "[Prompt Library](/tools/prompt-library) is the place the good ones end up. It stores prompts with titles and tags in your browser's local storage, with search across title and body, and JSON export and import so a library can move between machines or into version control. Because it is local storage, it is per-browser and per-profile: clearing site data clears the library. Export is the backup.",
        ],
      },
      {
        heading: "Producing config that a machine has to parse",
        body: [
          "The second half of this collection generates files whose only reader is another program, where a small syntax error costs you twenty minutes. [JSON Schema Builder](/tools/json-schema-builder) turns a list of named, typed, described properties into a tool definition, and wraps it in OpenAI's function-calling envelope, Anthropic's `input_schema` envelope, or leaves it as bare JSON Schema. It handles one level: a flat object with typed properties and a `required` list. Nested objects and array item schemas are not modelled, so a genuinely recursive tool definition needs hand-finishing after export.",
          "[MCP Config Generator](/tools/mcp-config) writes the `mcpServers` block that Model Context Protocol clients read, for both stdio servers (command, arguments, environment) and SSE servers (URL, environment). One caveat worth knowing before you paste: arguments are split on whitespace, so a single argument that contains a space needs editing by hand afterwards.",
          "[CLAUDE.md Generator](/tools/claude-md-generator) and [AI Rules Generator](/tools/ai-rules-generator) solve the same problem for two different ecosystems — a project instruction file that a coding agent reads on every session. The first produces a `CLAUDE.md` with sections for overview, stack, key commands, conventions, and explicit do/don't lists. The second targets Cursor, Windsurf and GitHub Copilot, emitting `.cursorrules`, `.windsurfrules` or `copilot-instructions.md` with the right heading conventions for each. Neither reads your repository; they are structured prompts for you, turning a blank file into a filled-in form.",
          "[Skill / Agent Builder](/tools/skill-builder) covers the newer shape of the same idea: a named capability with trigger phrases, a description and an instruction body, emitted as Markdown with YAML frontmatter, as YAML, or as JSON. And [AI Instruction Diff](/tools/ai-instruction-diff) closes the loop — paste two versions of a system prompt or rules file and get a line-level diff, which is how you find the one sentence someone added that changed the model's behaviour.",
        ],
      },
      {
        heading: "How this fits with the rest of the site",
        body: [
          "This collection is about tooling for people who build with hosted models. It is deliberately separate from the [on-device AI tools](/collections/on-device-ai), which are the opposite arrangement: models that download into your browser and run there, no API key and no provider involved. The two overlap in exactly one place worth knowing about — [PII Detector & Redactor](/tools/pii-redactor) runs a named-entity model locally, which makes it a reasonable pre-processing step before text goes to a hosted API.",
          "If your interest in browser-based tooling is mainly that nothing gets uploaded, the [privacy-first collection](/collections/privacy-first-tools) sets out what that claim does and does not mean on this site.",
        ],
      },
    ],
    picksHeading: "The thirteen tools",
    picksLead:
      "Grouped roughly in the order you would hit them: measure, then shape, then generate, then compare.",
    picks: {
      "token-counter":
        "You have a document and you want to know whether it is a 2,000-token problem or a 200,000-token problem.",
      "context-window":
        "You know the token count and need to see it as a percentage of a specific model's window, with a warning before you hit the ceiling.",
      "ai-cost-calculator":
        "You are sizing a batch job and need input tokens × output tokens × requests turned into a number you can put in a proposal.",
      "model-comparison":
        "You are choosing between providers and want context window and per-million pricing side by side, sortable.",
      "system-prompt-builder":
        "You are writing a system prompt from scratch and want a form that prompts you for role, tone, constraints, format and examples.",
      "prompt-formatter":
        "You have the turns and need them serialised into ChatML, Llama 3 header tokens, Claude XML, or an OpenAI message array.",
      "prompt-library":
        "You keep rewriting the same prompt from memory and want it saved, tagged, searchable and exportable.",
      "json-schema-builder":
        "You are defining a tool call and need a flat JSON Schema wrapped in OpenAI or Anthropic's expected envelope.",
      "mcp-config":
        "You are wiring up an MCP server and want valid `mcpServers` JSON for a stdio or SSE transport without hunting the docs.",
      "claude-md-generator":
        "You are starting a project and want a CLAUDE.md with the sections filled in rather than a blank file.",
      "ai-rules-generator":
        "Same idea, but the agent is Cursor, Windsurf or Copilot and each wants a differently named file.",
      "skill-builder":
        "You are packaging a reusable capability and need frontmatter, triggers and instructions in Markdown, YAML or JSON.",
      "ai-instruction-diff":
        "Two versions of a prompt behave differently and you need to see exactly which lines changed.",
    },
    limits: {
      heading: "What these tools do not do",
      body: [
        "None of them call a model. There is no inference here, no API key field, and no completion preview — these are calculators and text generators that produce input for a model you run elsewhere. If you want a model that actually runs, that is the [on-device AI collection](/collections/on-device-ai).",
        "Token counts for non-OpenAI models are calibrated approximations, as described above. Pricing and context-window figures come from a static table that a human updates; they can lag a provider announcement. Neither number should be the last check before a commitment.",
        "The generators produce well-formed starting points, not validated artefacts. JSON Schema Builder is single-level. MCP Config splits arguments on whitespace. Skill Builder assembles YAML frontmatter by string concatenation, so a description containing a colon or a line break needs quoting by hand. In every case the output is meant to be read and edited before it is committed, which is also true of anything else that writes config for you.",
      ],
    },
  },

  // ── 2. Privacy-first / local-processing tools ──────────────────────────────
  "privacy-first-tools": {
    lead: [
      "There is a category of small task that is genuinely awkward to do online. Stripping the GPS coordinates out of a photo before you post it. Blurring a face or an account number in a screenshot. Checking what a JSON Web Token actually contains. Reading the text out of a signed contract. Each of these takes about ten seconds with the right utility, and the ordinary way to get that utility is to paste your file into a search result and hope.",
      "The problem is not that those sites are malicious. It is that the transaction is invisible. You cannot tell whether the file is deleted after processing, whether it is retained for a training set, whether it sits in an object store with a guessable URL, or whether the operator has any idea either. For a holiday snap, nobody cares. For a passport scan, an employment contract, a medical letter or a screenshot with a customer's details in it, the calculus is different — and it is different in a way that is hard to explain to a compliance team after the fact.",
      "Every tool in this collection avoids the question by never sending the file anywhere. The processing runs as JavaScript and WebAssembly inside your tab, on your CPU. Closing the tab is the deletion step.",
    ],
    sections: [
      {
        heading: "What 'runs in the browser' actually means here",
        body: [
          "It is worth spelling out, because the phrase is used loosely across the web. When you pick a file with one of these tools, the browser hands the page a reference to it. The page reads the bytes into memory, does the work — canvas operations, WebAssembly, the Web Crypto API — and writes a new file back out as a download. At no point does the file travel over the network, because there is no upload code to travel through. You can verify this yourself: open your browser's network panel, use any tool on this page, and watch for a request carrying your data. There is not one.",
          "Two honest footnotes. First, loading the page is a network request — the site is served from a CDN like any other, and there is no service worker, so a tool has to be fetched before it can run offline of anything. Once the page is open, the processing is local, but the page itself is not something you can load without connectivity. Second, this site runs privacy-preserving page-view analytics (Vercel Analytics). It records that a page was viewed. It does not, and structurally cannot, see the contents of a file you never uploaded.",
          "One tool in the site's wider catalogue does need the network by design — the currency converter, which fetches exchange rates — and it is marked as such on its own page. Nothing in this collection is in that category.",
        ],
      },
      {
        heading: "Metadata: the part of a photo you did not mean to share",
        body: [
          "A photo from a phone carries an EXIF block: camera model, lens, exposure, the exact timestamp, and very often latitude and longitude to several decimal places. Social platforms usually strip it. Email attachments, cloud drive links, forum uploads and file-sharing services frequently do not.",
          "[EXIF Viewer](/tools/exif-viewer) is the diagnostic — it parses the metadata block and shows you what is in there, grouped into file, camera, settings, date and GPS. Look at a few of your own photos with it once; it is the sort of thing that changes how you handle images afterwards. [EXIF Remover](/tools/exif-remover) is the fix. It works by redrawing the image pixels onto a fresh canvas and re-encoding, which drops every metadata segment as a side effect of how canvas export works. Worth knowing: that means a JPEG comes out re-encoded rather than byte-identical minus the metadata, so there is a small generational quality cost, and a source in an unusual format comes out as JPEG or PNG.",
          "[Photo Censor](/tools/photo-censor) handles the pixels rather than the metadata. Draw a rectangle over a face, an address bar, a card number, and apply a blur, a pixelation or a solid block. Because the result is flattened onto a canvas and re-exported, the covered pixels are genuinely destroyed rather than hidden behind an overlay — which is the failure mode that has embarrassed people who used a drawing app's opaque shape and shipped the layered file.",
        ],
      },
      {
        heading: "Text, credentials and documents",
        body: [
          "[PII Detector & Redactor](/tools/pii-redactor) is the text equivalent. It combines a named-entity model running locally in your browser, which catches people, organisations and places, with pattern matching for the things a model is bad at and a regular expression is good at: email addresses, card numbers, IP addresses and phone numbers. It is a strong first pass over a support transcript or a log file before you share it, and — as with any automated redaction — it is a first pass, not a guarantee. Read the output.",
          "The credential tools are the ones where uploading would be self-defeating in the most literal sense. [Password Generator](/tools/password-generator) and [Password Strength](/tools/password-strength) produce and assess secrets; a password that has been transmitted to a website to be evaluated is no longer a password. [Hash Generator](/tools/hash-generator) computes digests locally via the browser's own crypto primitives. [Text Encryption](/tools/text-encryption) encrypts a note with a passphrase you hold. [TOTP Generator](/tools/totp-generator) derives two-factor codes from a shared secret — a secret whose entire security model is that it stays on devices you control. [JWT Decoder](/tools/jwt-decoder) splits a token into its header and claims so you can see what a bearer token is asserting, without pasting a live session credential into an unknown host.",
          "For documents: [Extract Text from PDF](/tools/extract-text-from-pdf) pulls the text layer out of a contract locally, and [Image to Text](/tools/image-to-text) runs OCR in WebAssembly when the document is a scan with no text layer. [Sign PDF](/tools/sign-pdf) and [Signature Maker](/tools/signature-maker) let you draw a signature and place it on a page. [QR Code Scanner](/tools/qr-scanner) decodes from your camera or an image file without a round trip. And [Notepad](/tools/notepad) is the small one people end up using most: a scratchpad that saves to your own browser, for the paragraph you did not want to leave in a chat window.",
        ],
      },
    ],
    picksHeading: "Sixteen tools, and when the privacy part matters",
    picksLead:
      "Each of these exists elsewhere as an upload-and-wait web service. The reason to use this version is in the second half of each line.",
    picks: {
      "exif-remover":
        "Before posting or emailing a photo — strips the GPS coordinates and camera metadata without the photo leaving your machine.",
      "exif-viewer":
        "To see what an image is actually carrying before you decide whether to strip it. Read-only, nothing transmitted.",
      "photo-censor":
        "Blur or block out a face, an address or a card number in a screenshot; the covered pixels are destroyed in the export.",
      "pii-redactor":
        "Sanitise a support transcript or log before sharing it. The entity model runs in your tab, so the unredacted text stays there.",
      "text-encryption":
        "Encrypt a note with a passphrase. A tool that encrypts your text on a server has not encrypted it from the server.",
      "password-generator":
        "Generate a password. Anything generated server-side has been over the wire before you ever saw it.",
      "password-strength":
        "Test a password you are considering, without submitting a real password to a stranger's form.",
      "hash-generator":
        "Compute a checksum or digest locally, including for content you would not want to paste into a hashing site.",
      "totp-generator":
        "Derive a 2FA code from a shared secret that should never be sent anywhere by design.",
      "jwt-decoder":
        "Inspect a token's header and claims — usually a live session credential, which is exactly what you should not paste online.",
      "sign-pdf":
        "Place a drawn signature on a contract without uploading the contract to sign it.",
      "signature-maker":
        "Draw a signature once and export it as a transparent image you keep.",
      "extract-text-from-pdf":
        "Pull the text out of an agreement or statement locally, when the document is the confidential part.",
      "image-to-text":
        "OCR a scanned page or a photo of a document; the WebAssembly engine is self-hosted here rather than a vision API.",
      "qr-scanner":
        "Decode a QR code from your camera or a screenshot without sending the image to a decoding service.",
      "notepad":
        "Somewhere to put text that autosaves to your own browser instead of a synced document you forget about.",
    },
    limits: {
      heading: "The honest boundaries of this claim",
      body: [
        "Local processing is not the same as offline. There is no service worker on this site, so a tool has to be loaded over the network before it can run. Once it is loaded, the work is local — but if you are on a plane with a cached tab, that is the browser's doing, not a feature we built.",
        "Local processing is not the same as zero telemetry. The site records page views through Vercel Analytics. That tells us a page was opened. It does not carry file contents, because file contents are never sent anywhere for it to carry.",
        "Local processing is not a substitute for a threat model. If your device is compromised, a tool running on your device is compromised with it. If you download a redacted file and then email the original by mistake, the redaction did its job and you did not. And automated redaction — including the PII tool here — has recall below 100%, which is a polite way of saying it will miss things. Check the output before you share it.",
        "Finally: this is a website, and you are being asked to take the claim on trust. The strongest thing we can say is that it is checkable. The source is open, and the network panel in your browser will settle the question in ten seconds for any tool on this page.",
      ],
    },
  },

  // ── 3. PDF ────────────────────────────────────────────────────────────────
  "pdf-tools": {
    lead: [
      "PDF is a page-description format, not a document format, and almost every frustration people have with PDF tools comes from that one fact. A PDF says where marks go on a page. It does not necessarily know that a run of marks is a paragraph, that a grid of lines is a table, or that any of it is text at all. Some PDFs carry a text layer alongside the marks; scans carry only an image. Editing a PDF is therefore nothing like editing a document — it is closer to editing a printout.",
      "That shapes what a browser can and cannot do well. Operations on the page structure — reordering, extracting, rotating, merging, stamping something on top — are cheap and lossless, because they manipulate objects the format already models explicitly. Operations that require understanding the content — reflowing text, converting to Word, shrinking a file without visibly degrading it — are hard everywhere, and the browser is not where they are easiest.",
      "The tools here are honest about which side of that line each operation falls on. The structural ones use pdf-lib to write files and pdf.js to read them, both running in your tab with a self-hosted worker; the interpretive ones tell you up front what they will lose.",
    ],
    sections: [
      {
        heading: "The lossless half: page surgery",
        body: [
          "[Merge PDF](/tools/merge-pdf) copies page objects from several documents into one. [Split PDF](/tools/split-pdf) does the reverse, by explicit ranges or into single pages, zipping the result when there is more than one output file. [Reorder PDF Pages](/tools/reorder-pdf-pages) rebuilds the document in an order you specify — and because it rebuilds from the order you give, a page you leave out of the order is a page you have deleted, which is a useful shortcut once you know it and a surprise if you do not.",
          "[Rotate PDF](/tools/rotate-pdf) sets each page's rotation entry rather than re-rendering anything. It is absolute rather than additive: setting 90° on a page already at 90° leaves it at 90°, not 180°. That is a deliberate choice — it makes the operation idempotent and means you can fix a mixed-orientation scan by setting the same value repeatedly without counting.",
          "[JPG to PDF](/tools/jpg-to-pdf) goes the other direction, building a document from JPEG and PNG images with a chosen page size or a page fitted to each image, plus orientation and margin. Images are scaled to fit and never upscaled, which is why a small image lands centred at its natural size rather than blown up and soft. And [PDF Tools](/tools/pdf) is the workbench that contains all of these as tabs, for when you have three things to do to the same file and do not want to download and re-upload between each one.",
        ],
      },
      {
        heading: "Compression, and what it really costs",
        body: [
          "[Compress PDF](/tools/compress-pdf) deserves a paragraph of its own, because the word 'compress' hides very different mechanisms across different tools and the difference matters.",
          "This one rasterises. Every page is rendered to a canvas at a preset scale, encoded as a JPEG, and embedded into a new document at the original page dimensions. Three presets trade quality against size. The geometry is preserved exactly, and the result is usually much smaller for a scan-heavy or image-heavy file.",
          "What you lose is everything that was not a picture. Text stops being text: it is no longer selectable, searchable, or readable by a screen reader. Links stop working. Bookmarks, form fields, annotations and metadata are gone. And for a document that was mostly text to begin with, a page of rendered pixels can easily be *larger* than the vector page it replaced, so the file can grow.",
          "This is the right tool for a 40MB folder of phone photos saved as a PDF, and the wrong tool for a text-heavy report you will need to search later. If you want to keep the text layer, the usual answer is to reduce the source images before the PDF is built — the [image compression tool](/tools/image-compression) does that with a target file size — rather than to compress the PDF afterwards.",
        ],
      },
      {
        heading: "Getting the text back out",
        body: [
          "[Extract Text from PDF](/tools/extract-text-from-pdf) reads the text layer through pdf.js and returns it page by page. When a PDF was produced by software — exported from a word processor, generated by a reporting system — the text layer is there and extraction is quick and accurate. Reading order is whatever pdf.js emits, so a heavily multi-column layout can interleave oddly; it is a dump, not a reconstruction.",
          "When there is no text layer at all — a scan, a photographed page, a fax — extraction returns nothing, and the tool says so and points you at OCR. That is [Image to Text](/tools/image-to-text), which runs Tesseract compiled to WebAssembly, accepts PDF input directly, renders each page and recognises it in five languages including Arabic. There is optional deskew and binarisation preprocessing, which matters more than people expect on photographs of paper.",
          "Set expectations correctly here: this is a good open-source OCR engine running on your laptop's CPU. It is not a cloud document-understanding service with a large vision model behind it. On a clean 300-DPI scan of printed text it does well. On a crumpled receipt, a low-contrast photo, handwriting, or a dense table, a server-side service with a modern vision model will beat it, and it is not close. The trade you are making is accuracy for the document never leaving your machine — which for some documents is exactly the right trade and for others is not.",
        ],
      },
      {
        heading: "PDF, Word, and the honest account of conversion",
        body: [
          "[PDF to Word](/tools/pdf-to-word) does something more ambitious than it sounds and less than the name promises. It is a geometry-driven reconstruction: it reads text positions through pdf.js, works out reading order and columns, detects drawn rules to find tables, then classifies blocks into headings, paragraphs, ordered and unordered lists and tables based on font size, indentation, list-marker patterns and vertical gaps. It de-hyphenates words broken across line endings. The output is a real `.docx` built with the `docx` library.",
          "So you get a re-flowed semantic document — not a pixel-faithful copy of the original layout. Images are not carried across at all. Character styling such as bold, italic, colour and font is not extracted. Merged and multi-line table cells are not supported, and two separate tables on one page may be read as one. Pages that are essentially scans are detected, listed, and skipped, with a pointer to the OCR tool. If what you need is 'the text and structure, editable', this does that. If you need the document to look the same, no browser tool will give you that and most server tools will not either.",
          "[Word to PDF](/tools/word-to-pdf) takes the opposite route and is unusual enough to explain. It reads a `.docx` with mammoth, converts it to clean semantic HTML, sanitises it, renders it in the page, and then hands off to your browser's own print-to-PDF. There is no PDF writer involved — you choose 'Save as PDF' in the print dialog. The upside is that the text stays selectable and searchable and the typography is the browser's, which is good. The cost is that the result is a normalised rendering rather than a replica: complex layouts, floats, multi-column sections, and headers and footers do not survive. Input is `.docx` only; the older `.doc` format is not supported.",
        ],
      },
      {
        heading: "Related collections",
        body: [
          "Building PDFs from photographs, or shrinking the images before they go in, is covered by the [image tools collection](/collections/image-tools). The reasons you might specifically want document work to stay on your own machine are set out in the [privacy-first collection](/collections/privacy-first-tools).",
        ],
      },
    ],
    picksHeading: "Thirteen operations",
    picksLead: "Structural operations first, then the interpretive ones where fidelity is a real question.",
    picks: {
      pdf: "The combined workbench — use it when you have several operations to run on one file without downloading between each.",
      "merge-pdf": "Combine several PDFs into one, in the order you arrange them. Lossless page copying.",
      "split-pdf": "Pull out a range, or explode a document into single pages (delivered as a zip when there is more than one).",
      "reorder-pdf-pages": "Rearrange pages by index — and drop pages by leaving them out of the order.",
      "rotate-pdf": "Fix sideways scans. Sets rotation absolutely, so applying it twice does not double the angle.",
      "compress-pdf": "Shrink an image-heavy PDF by rasterising pages to JPEG. Read the compression section above first.",
      "watermark-pdf": "Stamp text across every page with opacity and a choice of anchor, including a 45° diagonal.",
      "sign-pdf": "Draw or upload a signature and place it on a page. A visual stamp, not a cryptographic signature.",
      "extract-text-from-pdf": "Get the text layer out of a born-digital PDF, page by page.",
      "jpg-to-pdf": "Turn a set of JPEG or PNG images into a paginated PDF with a chosen page size and margin.",
      "pdf-to-word": "Reconstruct headings, paragraphs, lists and tables as an editable .docx. Text and structure, not layout.",
      "word-to-pdf": "Render a .docx and produce a PDF through your browser's print dialog, with the text still selectable.",
      "image-to-text": "The OCR fallback for scanned PDFs with no text layer. Accepts PDFs directly.",
    },
    limits: {
      heading: "Where a browser is the wrong place to do this",
      body: [
        "Cryptographic signing. [Sign PDF](/tools/sign-pdf) places a picture of a signature on a page. There is no certificate, no PKCS#7 or CAdES signature object, no hashing of the document and no tamper detection. It is the digital equivalent of signing a printout — appropriate for a great many everyday agreements, and not appropriate where a legally recognised digital signature is specifically required. If someone has asked for a qualified electronic signature, use a service that issues one.",
        "Serious OCR. As above: Tesseract in WebAssembly on your CPU is capable, and a modern cloud vision model on difficult inputs is better. Handwriting, complex tables and poor-quality photographs are where the gap is widest.",
        "Layout-faithful conversion. Neither PDF to Word nor Word to PDF preserves layout, and both say so on their own pages. This is not a browser limitation you can engineer around; it is the format gap described at the top.",
        "Very large files. Everything runs in your tab's memory. A several-hundred-megabyte PDF, or rasterising a two-hundred-page document, will be slow and can exhaust the tab. That is the real ceiling on client-side document work, and it is worth knowing before you start rather than at 80%.",
      ],
    },
  },

  // ── 4. Image ──────────────────────────────────────────────────────────────
  "image-tools": {
    lead: [
      "Almost every image job is one of four things. Make this smaller, because a form has a 200KB limit or a page is loading too slowly. Change this format, because something upstream will not accept HEIC or something downstream wants AVIF. Change the framing — crop, resize, rotate to fit a slot. Or make it presentable: add a watermark, cover up something sensitive, put a screenshot in a device frame.",
      "All four are pure pixel work, which is why the browser handles them so well. The canvas element decodes, transforms and re-encodes images natively, using the same code paths the browser uses to render every image you see. There is no meaningful quality advantage to doing this on a server; a JPEG encoded by Chrome at quality 0.8 is a JPEG encoded at quality 0.8. What a server offers is a queue for very large batches, and what it costs is that your images went somewhere.",
      "These tools go from the mundane to the specific, and the mundane ones are the ones people return to.",
    ],
    sections: [
      {
        heading: "Hitting a number, not guessing at a slider",
        body: [
          "[Image Compression](/tools/image-compression) has the feature most compression tools are missing: a target file size. Instead of nudging a quality slider and re-exporting until the number is under the limit, you say '200KB' and it runs a binary search — probing quality levels between 0.30 and 0.95, then stepping the dimensions down if quality alone cannot get there, and accepting as soon as it is within a sensible margin of the budget. It is a small thing that removes an entire category of tedium, and it exists because government portals, job applications and university systems still impose byte limits with no guidance on how to meet them.",
          "Two consequences worth knowing. Target mode is inherently lossy, so a PNG in target mode is converted to JPEG — a lossless format cannot be tuned to an arbitrary byte budget. And there are also auto, aggressive and manual-quality modes for when you do not have a specific number to hit and just want the file smaller.",
          "[Image Resizer](/tools/image-resizer) covers the dimension side: exact pixels, a percentage, a longest-side constraint, or named presets, with crop and watermark tabs on the same loaded image so you are not passing a file between three tools. [Crop Image](/tools/crop-image) is the focused version, with a draggable crop rectangle and aspect-ratio locks for the ratios you actually need.",
        ],
      },
      {
        heading: "Formats, including the awkward ones",
        body: [
          "[Format Converter](/tools/image-converter) outputs PNG, JPEG, WebP and AVIF. Three of those the canvas can encode directly; AVIF it cannot, at all, in any current browser. So AVIF encoding is done by a WebAssembly encoder that loads on demand — which is why an AVIF export takes noticeably longer than a WebP one, and why AVIF is worth it anyway when the file-size difference matters more than the seconds.",
          "On the input side, the awkward format is HEIC — the default on iPhones, and rejected by a great many upload forms. HEIC files are decoded through a WebAssembly decoder before the conversion runs, so 'photo from my phone that this website will not accept' has a two-step answer that does not involve emailing yourself the photo to force a conversion. The tool also verifies that the encoder actually produced the format you asked for, rather than silently handing back a PNG with a WebP file extension, which is a real failure mode elsewhere.",
          "[SVG to PNG](/tools/svg-png) rasterises vector artwork at a chosen multiplier, which is how you get a 2x or 3x asset out of an icon. It needs the SVG to declare intrinsic dimensions, and external references inside the SVG will not resolve — both are consequences of rendering through the browser's image pipeline rather than a full SVG renderer. [SVG Tools](/tools/svg) is a different thing entirely: a visual editor for tweaking shapes and colours in an SVG directly.",
        ],
      },
      {
        heading: "Cleaning up and covering up",
        body: [
          "[EXIF Remover](/tools/exif-remover) and [EXIF Viewer](/tools/exif-viewer) handle the invisible payload — camera model, timestamps, and frequently GPS coordinates precise enough to identify a home address. The viewer shows you what is there; the remover strips it by redrawing the pixels, which means a JPEG is re-encoded rather than surgically edited.",
          "[Photo Censor](/tools/photo-censor) covers the visible payload: draw regions and apply blur, pixelation or a solid fill. Because the canvas is flattened on export, the censored pixels are actually gone rather than obscured by a layer that a determined recipient could remove. [Watermark Image](/tools/watermark-image) does the opposite — adds text or an image mark with opacity, rotation, positioning and a tiling mode.",
          "[Color Correction](/tools/color-correction) adjusts brightness, contrast, saturation, temperature, vibrance and exposure through per-pixel arithmetic rather than CSS filters, specifically so the export matches the preview. That distinction sounds pedantic until you have used a tool where it did not, and exported something that looked nothing like what was on screen.",
        ],
      },
      {
        heading: "Producing something for other people to look at",
        body: [
          "[Favicon Generator](/tools/favicon-generator) renders your source at 16, 32, 48, 180, 192 and 512 pixels, hand-writes a genuine multi-image `.ico` file, and bundles the whole set with the HTML link tags and a web manifest into a zip — because the annoying part of favicons was never the resizing, it was remembering the six sizes and the markup.",
          "[Screenshot Beautifier](/tools/screenshot-beautifier) pads a screenshot onto a gradient or solid background with rounded corners and a drop shadow, for changelogs and release posts. [Phone Mockups](/tools/phone-mockups) composites a screenshot into a device frame, and does it by scanning the frame image's own pixels to find the screen area and its corner radius rather than trusting a hardcoded rectangle — which is why the screen lands correctly aligned rather than a few pixels off.",
          "[Photo Collage](/tools/photo-collage) arranges several images in a grid with configurable gaps and rounded corners. [Meme Generator](/tools/meme-generator) does the Impact-with-a-black-outline thing with draggable text boxes and word wrap. [Image Color Picker](/tools/image-color-picker) samples a pixel to HEX, RGB and HSL, keeps a history of recent picks, and extracts a dominant-colour palette from the whole image. And [ASCII Art Generator](/tools/ascii-art) maps luminance to characters across four ramps, exporting both text and a rendered image — which has no practical use whatsoever and is one of the most-used tools on the site.",
        ],
      },
      {
        heading: "Related collections",
        body: [
          "The image tools that use machine learning — background removal, object cutout, upscaling, captioning, depth estimation — are gathered separately in [on-device AI](/collections/on-device-ai), because they behave differently: they download a model on first use and are much slower than the canvas operations here. For turning images into documents, see the [PDF collection](/collections/pdf-tools).",
        ],
      },
    ],
    picksHeading: "Eighteen tools",
    picksLead: "Roughly ordered from the everyday to the occasional.",
    picks: {
      "image-compression": "Get under a byte limit. Target-size mode binary-searches quality and dimensions to hit the number.",
      "image-converter": "Convert between PNG, JPEG, WebP and AVIF, and decode HEIC from an iPhone on the way in.",
      "image-resizer": "Resize by exact pixels, percentage, longest side or preset — with crop and watermark on the same image.",
      "crop-image": "Crop with a draggable rectangle and aspect-ratio locks.",
      "watermark-image": "Add a text or image watermark with opacity, rotation, position and tiling.",
      "photo-censor": "Blur, pixelate or block out regions, with the covered pixels destroyed in the export.",
      "exif-remover": "Strip camera metadata and GPS coordinates before sharing a photo.",
      "exif-viewer": "See what metadata an image is carrying, including GPS, before deciding what to do about it.",
      "color-correction": "Brightness, contrast, saturation, temperature, vibrance and exposure, with the export matching the preview.",
      "favicon-generator": "Produce every favicon size, a real .ico, the link tags and a manifest as one zip.",
      svg: "Edit shapes and colours in an SVG visually.",
      "svg-png": "Rasterise an SVG to PNG at 1x, 2x or higher.",
      "image-color-picker": "Sample exact colours from an image and pull a dominant-colour palette out of it.",
      "screenshot-beautifier": "Put a screenshot on a padded gradient background with rounded corners and a shadow.",
      "phone-mockups": "Drop a screenshot into a device frame, with the screen area detected from the frame's own pixels.",
      "photo-collage": "Lay several images out in a grid with configurable gaps and corner radius.",
      "meme-generator": "Impact, outlined, draggable, word-wrapped.",
      "ascii-art": "Convert an image to text art across four character ramps, exported as text or as an image.",
    },
    limits: {
      heading: "What canvas cannot do",
      body: [
        "Encoding formats the browser does not support. AVIF is handled by a WebAssembly encoder precisely because canvas cannot encode it; JPEG XL and other emerging formats are not available at all. Anything the browser cannot decode cannot be opened, with HEIC as the deliberate exception because it is common enough to be worth a dedicated decoder.",
        "Re-encoding without generational loss. Every canvas operation decodes to pixels and re-encodes on export. For JPEG that is a lossy round trip, so stripping metadata from a JPEG costs a little quality. Where a byte-exact metadata strip matters, a dedicated command-line tool is the right instrument.",
        "Very large images and very large batches. Canvas has per-browser dimension limits, and everything is held in your tab's memory. A 100-megapixel panorama or a folder of several hundred RAW files is a job for a desktop application. Camera RAW formats are not supported at all — the browser cannot decode them.",
        "Colour management. These tools work in sRGB. Wide-gamut and ICC-profiled workflows, print colour and 16-bit-per-channel editing are outside what canvas exposes.",
      ],
    },
  },

  // ── 5. On-device AI ───────────────────────────────────────────────────────
  "on-device-ai": {
    lead: [
      "A few years ago the idea that you could run a speech recognition model in a browser tab was faintly ridiculous. Two things changed. Models got dramatically smaller for a given level of quality, through distillation and quantisation. And browsers grew the runtimes to execute them — WebAssembly with SIMD for CPU inference, and WebGPU for the GPU that has been sitting in your laptop the whole time.",
      "The result is a real category, and it works differently from everything else on this site. Every other tool loads in a second and runs immediately. These download a model first — tens to hundreds of megabytes, once, cached by your browser afterwards — and then run inference locally. The first use is slow. Subsequent uses are not.",
      "What you get in exchange is worth being explicit about, because it is not just privacy. There is no API key, so there is no signup and no billing. There is no rate limit, because there is no service to rate-limit you. There is no per-request cost, so transcribing a hundred files costs the same as transcribing one: your electricity. And the data never leaves, which for medical audio, legal recordings, customer transcripts, HR documents and internal screenshots is not a nice-to-have but the deciding factor.",
    ],
    sections: [
      {
        heading: "How the models get here and where they run",
        body: [
          "Most of these tools use Transformers.js, the JavaScript port of the Hugging Face pipeline API, with ONNX Runtime underneath. On first use the model weights are fetched from the Hugging Face CDN and stored in your browser's cache. From then on the tool works from that cache — the model is on your machine, and re-running it is a local operation.",
          "Execution goes to WebGPU where it is available and the model is suited to it, and falls back to WebAssembly on the CPU otherwise. The difference is large: WebGPU can be several times faster on the image models in particular. Some of the text models here are pinned to WebAssembly deliberately, because they are small enough that the GPU setup cost is not worth paying and because CPU execution is the more predictable path across browsers.",
          "Two tools sit slightly outside that pattern. [Image to Text](/tools/image-to-text) is OCR via Tesseract compiled to WebAssembly, with the worker and core WASM served from this site directly; only the language data file is fetched from the Tesseract project's CDN on first use. [Text to Speech](/tools/text-to-speech) uses Piper/VITS voice models — a real neural vocoder producing a downloadable WAV file, not the robotic built-in speech synthesiser — with each voice weighing roughly 20 to 60MB.",
          "One consequence of quantisation deserves a mention because it is visible in the tools. The [Translator](/tools/translator) runs a multilingual model of a few hundred million parameters at 8-bit quantisation, and it is quantised specifically because the full-precision version exhausts browser memory. Quantisation is what makes browser inference possible at all; it also costs a little quality. That trade is present, to different degrees, in every model here.",
        ],
      },
      {
        heading: "Speech, text and language",
        body: [
          "[Audio/Video Transcriber](/tools/audio-transcriber) runs Whisper locally. You give it an audio or video file, it decodes the audio in the browser, chunks it with overlapping strides so words are not lost at boundaries, and produces a transcript with timestamps — exportable as plain text, SRT or WebVTT. This is the tool on the site that most clearly justifies the whole category: recorded interviews, therapy sessions, legal depositions and internal meetings are exactly the material people are most reluctant to upload to a transcription service, and it is a base-sized Whisper model, not a toy.",
          "[Translator](/tools/translator) does multilingual translation across sixteen languages with no round trip to a translation API. [Text Summarizer](/tools/text-summarizer) runs a distilled summarisation model with short, medium and long presets. [Sentiment Analyzer](/tools/sentiment-analyzer) gives a positive or negative classification with a confidence score. [Zero-Shot Text Classifier](/tools/zero-shot-classifier) is the more interesting one: you supply your own category labels at runtime, with no training and no fine-tuning, and it scores the text against them — which makes it genuinely useful for triaging a pile of feedback into buckets you invented five seconds ago.",
          "[PII Detector & Redactor](/tools/pii-redactor) pairs a named-entity model with pattern matching for emails, card numbers, IP addresses and phone numbers. It is the natural bridge to the [AI developer tools](/collections/ai-developer-tools): running it locally over text before that text goes to a hosted API is a sensible habit.",
          "One clarification, since it is in the same part of the site: [Text Similarity](/tools/text-similarity) is not a model at all. It is TF-IDF and cosine similarity implemented in plain TypeScript. It is fast, it needs no download, and it is honest about being classical information retrieval rather than an embedding model.",
        ],
      },
      {
        heading: "Vision",
        body: [
          "[Background Removal](/tools/bg-removal) is the most immediately useful of the image models — a segmentation model that separates subject from background and exports a transparent PNG, in batches, with the model and its runtime fetched from a version-pinned CDN on first use. [Object Cutout](/tools/object-cutout) is the interactive counterpart, based on a compact Segment Anything variant: click a point on the thing you want, click again to add or exclude regions, and get a cut-out with a transparent background. Click-to-select is a much better interface than a lasso tool for anything with a complicated edge.",
          "[Image Upscaler](/tools/image-upscaler) runs a super-resolution transformer at a fixed 2x. It is real reconstruction rather than interpolation — it does better than bicubic on text and edges — and it is not the marketing version of upscaling: there is no invention of detail that was not implied by the input, and the input is capped in size because the memory cost scales with it.",
          "[Image Captioner](/tools/image-captioner) produces a one-line description of a photograph, which is useful for draft alt text over a batch of images, with the emphasis on draft. [Depth Map Generator](/tools/depth-map) estimates per-pixel depth from a single photo and renders it as a greyscale or false-colour image — input to compositing, parallax effects, or 3D work, from a plain photograph and no depth sensor.",
        ],
      },
      {
        heading: "When to use this and when not to",
        body: [
          "Use on-device inference when the data is sensitive, when you have volume and no budget, when you need it to work without an account, or when the task is genuinely small — a sentiment classification does not need a frontier model.",
          "Use a hosted API when you need the best available quality, when the input is long and the latency matters, when you are running this in production for other people, or when the task requires reasoning that a 100-million-parameter model simply cannot do. The [AI developer tools collection](/collections/ai-developer-tools) is the set of utilities for that path.",
          "The two are complementary more often than people assume. Redact locally, then send. Transcribe locally, then summarise with a hosted model. Classify locally to route, then escalate the hard cases.",
        ],
      },
    ],
    picksHeading: "Thirteen models, thirteen tools",
    picksLead:
      "Each downloads its model on first use and caches it afterwards. Speech and text first, then vision.",
    picks: {
      "audio-transcriber":
        "Transcribe an interview, meeting or lecture with timestamps and SRT/VTT export, without uploading the recording.",
      "image-to-text":
        "OCR a scan, a photo of a page, or a PDF, in five languages including Arabic. Tesseract in WebAssembly.",
      translator: "Translate across sixteen languages with no translation API involved.",
      "text-summarizer": "Condense a long piece of text at short, medium or long settings.",
      "sentiment-analyzer": "Classify text as positive or negative with a confidence score.",
      "zero-shot-classifier":
        "Sort text into categories you define at runtime — no training data, no fine-tuning.",
      "pii-redactor":
        "Find and mask names, organisations, emails, card numbers, IPs and phone numbers before sharing text.",
      "text-to-speech":
        "Generate speech with a neural voice and download it as a WAV file. Ten voices across five languages.",
      "image-captioner": "Get a one-line description of a photo — a starting point for alt text at volume.",
      "bg-removal": "Cut the background out of photos in a batch and export transparent PNGs.",
      "object-cutout": "Click on the object you want and get it isolated with a transparent background.",
      "image-upscaler": "Double an image's resolution with a super-resolution model rather than interpolation.",
      "depth-map": "Estimate depth from a single photograph and export it as a greyscale or false-colour map.",
    },
    limits: {
      heading: "The honest trade-offs",
      body: [
        "These models are smaller and slower than what an API gives you. That is the deal, and it is not a small deal. A data-centre GPU running a large model will beat a browser running a distilled, quantised one on almost every quality metric, and it will do it faster. Transcribing an hour of audio in a tab takes real time — minutes, not seconds — and on a machine without WebGPU it takes considerably longer. If you need the best possible transcript of a difficult recording, a hosted service will produce it.",
        "The first run downloads a model. Depending on the tool that is tens of megabytes to a few hundred. On a metered or slow connection that is a genuine cost, and it happens before you see any output. The browser caches it afterwards, but clearing site data means downloading again.",
        "Quantisation costs accuracy. Several of these models are quantised to fit in browser memory — that is why they can run at all. Expect a small quality gap against the same architecture at full precision.",
        "Browser and hardware variance is real. WebGPU availability differs by browser, operating system and GPU; without it, everything falls back to CPU and gets slower. Memory limits are per tab, which is why several tools cap their input size rather than letting you crash the page. Long documents and long recordings hit those ceilings first.",
        "And an important scope note: this collection is on-device *models*. [Live Dictation](/tools/speech-to-text) is not in it, despite being a speech tool, because it uses the browser's built-in Web Speech API — which in several major browsers performs recognition on the vendor's servers. If you need speech recognition that is genuinely local, the tool for that is [Audio/Video Transcriber](/tools/audio-transcriber).",
      ],
    },
  },
};

export const clusterContent: Record<ClusterId, Record<ClusterLocale, ClusterProse>> = {
  "ai-developer-tools": { en: en["ai-developer-tools"], ar: clusterContentAr["ai-developer-tools"] },
  "privacy-first-tools": { en: en["privacy-first-tools"], ar: clusterContentAr["privacy-first-tools"] },
  "pdf-tools": { en: en["pdf-tools"], ar: clusterContentAr["pdf-tools"] },
  "image-tools": { en: en["image-tools"], ar: clusterContentAr["image-tools"] },
  "on-device-ai": { en: en["on-device-ai"], ar: clusterContentAr["on-device-ai"] },
};

/**
 * Long-form prose exists in English and Arabic (the `tool-content.ts`
 * precedent). Every other locale reads the English text; the surrounding UI
 * chrome is still translated for all nine locales.
 */
export function getClusterProse(id: ClusterId, locale: string): ClusterProse {
  return locale === "ar" ? clusterContent[id].ar : clusterContent[id].en;
}

/** True when the given locale has hand-authored prose rather than the English fallback. */
export function hasNativeProse(locale: string): boolean {
  return locale === "en" || locale === "ar";
}
