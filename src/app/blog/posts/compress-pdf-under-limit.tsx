export default function Content() {
  return (
    <div>
      <p>
        You have the PDF ready — a scanned contract, a filled-in application form, a portfolio — and the
        upload button rejects it: <strong>&quot;File exceeds the maximum size.&quot;</strong> The document
        opens fine, nothing is wrong with it, it is just too big for the gate you are trying to pass
        through. So now you are hunting for a way to shrink a PDF without turning it into a mess, ideally
        without installing desktop software or handing a sensitive document to some random website.
      </p>
      <p>
        You can do it in your browser in a few seconds. The{" "}
        <a href="/tools/compress-pdf">Compress PDF</a> tool shrinks the file locally, shows you the exact
        before and after sizes, and lets you download the result — nothing is ever uploaded to a server.
      </p>

      <h2>Where Size Limits Bite</h2>
      <p>
        The most common wall is email. Many email services cap attachments somewhere around 20–25 MB, and
        that is the size of the whole message including its overhead, so a large PDF that looks fine on
        disk can bounce the moment you hit send. A multi-page scanned document — especially one scanned in
        color at a high DPI — can easily blow past that on its own.
      </p>
      <p>
        Upload portals are stricter and less forgiving. Government and court e-filing systems, university
        admissions platforms, visa and immigration portals, and job-application sites frequently cap each
        document at just a few megabytes, and they rarely tell you how to get under the limit — they just
        reject the file and leave you to figure it out. These caps exist for a practical reason: these
        systems process huge volumes of submissions, and a tight per-file limit keeps storage and
        bandwidth predictable across everyone using them. That logic does not help you when your scan is
        four times the allowed size.
      </p>
      <p>
        Scanned documents are the usual culprit. When you scan pages on a printer or a phone app, each page
        becomes a full-resolution photograph embedded in the PDF. A crisp color scan of a ten-page
        document is essentially ten high-megapixel images stapled together, and that adds up fast — a file
        that started as a few sheets of paper can end up tens of megabytes.
      </p>

      <h2>How This Compressor Works — And the Honest Tradeoff</h2>
      <p>
        Here is the part most tools do not tell you plainly. This compressor works by{" "}
        <strong>rendering each page to an image and re-encoding it as a JPEG</strong>, then rebuilding the
        PDF from those images. Squeezing the JPEG quality and resolution is what produces the large size
        reductions — it is a genuinely effective way to make a heavy PDF small.
      </p>
      <p>
        The tradeoff is the direct consequence of that approach: the output pages are{" "}
        <strong>rasterized</strong>. Once a page has been turned into an image, the text on it is no longer
        real text — it is a picture of text. That means in the compressed file you can no longer{" "}
        <strong>select, copy, or search the text</strong>, and a screen reader can no longer read it. The
        layout looks identical to your eye; it is only the underlying &quot;is this selectable text or a
        flat image&quot; property that changes.
      </p>
      <p>
        We are upfront about this because it genuinely matters in some cases and does not matter at all in
        others, and the difference is worth thinking about for a moment before you compress.
      </p>

      <h2>When Rasterizing Is Fine — and When to Keep the Original</h2>
      <p>
        For a huge number of everyday uploads, rasterizing is completely fine. If you are submitting a{" "}
        <strong>visual scan</strong> — a signed contract, an ID or passport copy, a receipt, a scanned form,
        a diploma, anything that a human on the other end just needs to look at — the text was already a
        picture inside the scan to begin with, so you lose nothing meaningful. The reviewer opens it, reads
        it with their eyes, and never needs to select a word.
      </p>
      <p>
        Keep an original, uncompressed copy when the destination actually needs the text to be{" "}
        <strong>machine-readable</strong>: a résumé that will be parsed by an applicant-tracking system, a
        contract someone needs to copy clauses out of, a report that has to remain searchable, or any
        document where accessibility for screen-reader users is a requirement. The good news is you never
        have to choose destructively — compress a copy for the upload and hold on to the original file for
        everything else. Your source PDF is untouched; the tool only produces a new, smaller file for you
        to download.
      </p>

      <h2>Picking a Quality Preset</h2>
      <p>
        The tool gives you three presets, and the right one depends on how tight your limit is versus how
        much visual crispness you want to keep:
      </p>
      <p>
        <strong>High</strong> renders pages at a higher resolution and quality — the pages stay sharp and
        the reduction is more modest. Reach for this first when your file is only somewhat over the limit
        and readability matters, like a document with fine print or detailed diagrams.{" "}
        <strong>Balanced</strong> is the sensible default: a noticeably smaller file that still looks clean
        on screen, and the right pick for most scanned paperwork. <strong>Small</strong> pushes resolution
        and quality down the furthest for the biggest reduction — use it when you are fighting a very tight
        cap and the pages are mostly plain text that still needs to be legible, not pristine.
      </p>
      <p>
        Because the tool shows you the <strong>before and after sizes</strong> (and the percentage
        reduction) right after it runs, there is no guesswork. Try Balanced, check whether the result
        clears your limit, and only drop to Small if you still need more room. If Balanced already lands
        well under the cap, there is no reason to sacrifice more quality than you have to.
      </p>

      <h2>Everything Stays on Your Device</h2>
      <p>
        A lot of the free &quot;PDF compressor&quot; sites you will find in a search work by uploading your
        document to their server, compressing it there, and sending it back. For the kind of files people
        usually need to shrink — a signed contract, a tax document, an ID scan, a medical form — that is a
        real privacy cost for a simple size fix.
      </p>
      <p>
        The <a href="/tools/compress-pdf">Compress PDF</a> tool does all of its work — rendering, encoding,
        and rebuilding the PDF — inside your browser tab. The document never leaves your device, so there
        is no server to trust and nothing to delete afterward.
      </p>

      <h2>Try It Now</h2>
      <p>
        Open <a href="/tools/compress-pdf">Compress PDF</a>, drop in the file that would not upload, pick a
        preset (start with Balanced), and download the smaller version once you see it clear your limit.
        Keep the original if you will ever need selectable text — and either way, the document never leaves
        your device.
      </p>
    </div>
  );
}
