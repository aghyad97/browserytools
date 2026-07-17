import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        For years, translating a sentence meant pasting it into a website that quietly shipped your words off to a
        company's servers. It worked, but it came with a cost: your text — sometimes a private message, a contract
        clause, or a medical note — left your device. The{" "}
        <a href="/tools/translator">BrowseryTools Translator</a> takes a different approach. It is a free offline
        translator that runs an AI translation model directly inside your browser, so you can translate text in the
        browser without anything ever being uploaded.
      </p>
      <ToolCTA slug="translator" variant="inline" />

      <h2>What "On-Device Translation" Actually Means</h2>
      <p>
        Most translation services are cloud-based. You type, the text travels across the internet to a data center,
        a model there produces a translation, and the result comes back. That round trip is why those tools need a
        connection, why they can log what you send, and why some workplaces block them outright for confidentiality
        reasons.
      </p>
      <p>
        On-device translation flips the model around. Instead of sending your words to the model, the model comes to
        you. The first time you use the tool, your browser downloads a compact neural translation model from a
        content-delivery network and caches it. From then on, every translation is computed locally on your own
        machine. This is what makes private translation possible: there is no server in the loop, so there is nothing
        to intercept, store, or sell.
      </p>

      <h2>The Model Behind It</h2>
      <p>
        The Translator is built on a multilingual model from the M2M-100 family, run through Transformers.js — the
        same technology that powers other on-device AI tools on this site. M2M-100 is a "many-to-many" model, which
        means it can translate directly between language pairs without bouncing through English as an intermediate
        step. Translating French to Arabic, for example, happens in one shot rather than French → English → Arabic,
        which preserves more meaning.
      </p>
      <p>
        Because it is a real neural model and not a phrasebook, it downloads once — a few hundred megabytes — and
        then runs entirely from your device's cache. On computers with a modern GPU, the tool automatically uses
        WebGPU for faster results, falling back to CPU (WASM) elsewhere. The download only happens the first time;
        after that, you can translate even with a flaky connection.
      </p>

      <h2>How to Use the Translator</h2>
      <p>
        <strong>Step 1 — Choose your languages.</strong> Pick a source language in the "From" dropdown and a target
        language in the "To" dropdown. Fifteen common languages are available, including English, Arabic, French,
        Spanish, German, Chinese, Russian, Hindi, Japanese, Korean, and more.
      </p>
      <p>
        <strong>Step 2 — Paste your text.</strong> Type or paste anything into the input box. The field accepts long
        passages, and it auto-detects direction, so right-to-left scripts like Arabic display correctly.
      </p>
      <p>
        <strong>Step 3 — Translate.</strong> Press the Translate button. On first use you will see a progress bar
        while the model downloads; subsequent translations start instantly. The result appears on the right, where a
        copy button lets you grab it in one click.
      </p>
      <p>
        <strong>Step 4 — Swap when needed.</strong> The swap button between the two dropdowns flips the language pair
        and moves your text across, so you can translate a reply back without retyping anything.
      </p>

      <h2>When On-Device Translation Wins</h2>
      <p>
        A browser-based, offline-capable translator is not just a privacy novelty — it solves real problems. If you
        work with sensitive material, you can translate text in the browser knowing it never leaves your laptop. If
        you travel, you can pre-load the model on Wi-Fi and keep translating on a plane or in a dead zone. If you are
        on a metered or filtered network, you avoid sending traffic out at all. And because there is no account, no
        API key, and no quota, you can use it as much as you like, for free.
      </p>

      <h2>Honest Limitations</h2>
      <p>
        On-device models trade a little quality and speed for privacy and independence. A few-hundred-megabyte model
        running in a browser will not always match a giant cloud system on long, idiomatic passages, and the first
        download takes a moment. For everyday sentences, messages, and documents, though, the output is genuinely
        useful — and the trade is worth it when the alternative is shipping your words to a stranger's server.
      </p>

      <h2>Try It Now</h2>
      <p>
        Open the <a href="/tools/translator">free offline Translator</a>, pick your languages, and translate your
        first sentence. It is a free, private translation tool that lives entirely in your browser — no Google, no
        DeepL, no upload.
      </p>
      <ToolCTA slug="translator" variant="card" />
    </div>
  );
}
