export default function Content() {
  return (
    <div>
      <p>
        Every day we paste text that quietly carries personal information: a support ticket with a
        customer&apos;s email and phone number, a chat log full of names, a bug report containing a
        real IP address, a spreadsheet row with a credit-card-shaped string. Before that text goes
        into a prompt, a shared doc, a screenshot, or a public issue tracker, it should be cleaned.
        This guide explains how to <strong>redact PII</strong> — how to{" "}
        <strong>remove personal info from text</strong> and{" "}
        <strong>anonymize text online</strong> — in seconds, without uploading anything.
      </p>
      <p>
        You can do it right now with the{" "}
        <a href="/tools/pii-redactor">BrowseryTools PII Detector &amp; Redactor</a>. Paste your text,
        let the tool detect names, organizations, locations, emails, phone numbers, credit-card-like
        numbers, and IP addresses, then copy a clean, redacted version. Everything runs in your
        browser — your text is never sent to a server.
      </p>

      <h2>What Counts as PII?</h2>
      <p>
        PII (personally identifiable information) is any data that can identify a specific person,
        directly or in combination with other data. In free-form text the most common kinds are:
      </p>
      <ul>
        <li><strong>Names</strong> — of people, which the AI model detects as PER entities.</li>
        <li><strong>Organizations</strong> — companies and institutions (ORG).</li>
        <li><strong>Locations</strong> — cities, countries, addresses (LOC).</li>
        <li><strong>Email addresses</strong> — caught precisely with pattern matching.</li>
        <li><strong>Phone numbers</strong> — including international formats with separators.</li>
        <li><strong>Credit-card-like numbers</strong> — 13–16 digit sequences.</li>
        <li><strong>IP addresses</strong> — IPv4 addresses that can reveal a network or location.</li>
      </ul>

      <h2>How the Tool Detects and Redacts</h2>
      <p>
        The redactor combines two techniques. First, a small{" "}
        <strong>named-entity-recognition (NER) AI model</strong> reads the text and tags people,
        organizations, and locations — the parts that no simple pattern can catch reliably. Second,
        deterministic <strong>regular-expression detectors</strong> handle structured identifiers
        like emails, phone numbers, credit cards, and IPs, which patterns match far more accurately
        than a model would.
      </p>
      <p>
        Each detected span is replaced with a clear tag such as{" "}
        <code>[PER_REDACTED]</code>, <code>[EMAIL_REDACTED]</code>, or{" "}
        <code>[PHONE_REDACTED]</code>. Because the tag names the category, the redacted text stays
        readable — a reviewer can still tell that &quot;a name went here&quot; without seeing the
        name itself.
      </p>

      <h2>Choose What to Redact</h2>
      <p>
        Not every category is sensitive in every context. Sometimes you want to keep company names
        but strip personal ones; sometimes you only care about contact details. The tool shows a
        checkbox for each category with a live count of how many items it found. Untick a category
        and those items reappear in the output instantly — the redaction recomputes without
        re-running the model.
      </p>

      <h2>Why Redact Before Pasting Into AI Tools?</h2>
      <p>
        When you paste raw text into a hosted chatbot or API, you may be sending real customer data
        to a third party — and possibly into future training sets. Stripping PII first keeps you on
        the right side of privacy commitments and regulations like GDPR. A quick{" "}
        <strong>anonymize text online</strong> pass turns &quot;John Smith at john@acme.com called
        about order 4471&quot; into &quot;[PER_REDACTED] at [EMAIL_REDACTED] called about order
        4471&quot; — same meaning for debugging, none of the identity.
      </p>

      <h2>Everything Stays in Your Browser</h2>
      <p>
        The single most important property of this tool is that it never uploads your text. The AI
        model downloads once from a CDN and is cached on your device; from then on, detection and
        redaction happen entirely client-side. There is no server round-trip, no logging, and no
        account. That privacy-first approach is exactly why a redaction tool that phones home would
        defeat its own purpose.
      </p>

      <h2>Redact More Than Text</h2>
      <p>
        Text is only one channel for leaking personal data. Photos carry hidden metadata, and faces
        or license plates in images can identify people just as readily as a name in a sentence. To
        cover those, pair this tool with two others:
      </p>
      <ul>
        <li>
          Use the <a href="/tools/exif-remover">EXIF Remover</a> to{" "}
          <strong>strip hidden metadata from photos</strong> — GPS coordinates, device model, and
          timestamps — before you share an image.
        </li>
        <li>
          Use the <a href="/tools/photo-censor">Photo Censor</a> to blur or black out faces,
          documents, and other sensitive regions inside a picture.
        </li>
      </ul>
      <p>
        Together, the PII Detector &amp; Redactor, EXIF Remover, and Photo Censor let you{" "}
        <strong>remove personal info</strong> from both the words and the images you share — all
        without uploading a single byte.
      </p>

      <h2>Quick Workflow</h2>
      <ol>
        <li>Open the <a href="/tools/pii-redactor">PII Detector &amp; Redactor</a>.</li>
        <li>Paste the text you want to clean.</li>
        <li>Click <em>Detect &amp; redact PII</em> and wait for the one-time model download.</li>
        <li>Review the categories and untick anything you want to keep.</li>
        <li>Copy the redacted text and paste it wherever it needs to go.</li>
      </ol>
      <p>
        That is the whole process: paste, detect, redact, copy. Free, private, and entirely in your
        browser.
      </p>
    </div>
  );
}
