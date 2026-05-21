export default function Content() {
  return (
    <div>
      <p>
        Before you post a screenshot, share a document photo, or upload an image to a public forum,
        there is almost always something in the frame that should not be public: a face, a license
        plate, a home address, an account number, an email, a name on a badge. Cropping helps, but
        the sensitive thing is often in the middle of the picture. What you actually need is to{" "}
        <strong>redact or censor the image</strong> — blur it, pixelate it, or black it out — without
        handing the original to a website.
      </p>
      <p>
        The <a href="/tools/photo-censor">BrowseryTools Photo Censor</a> tool does exactly that,
        entirely in your browser. You paint over the regions you want to hide, choose blur, pixelate,
        or solid block, and export a clean copy. Nothing uploads. This guide explains how to redact
        an image properly — and the one mistake that quietly leaks the data you thought you hid.
      </p>

      <h2>How to Redact or Blur an Image (Step by Step)</h2>
      <p>
        <strong>1. Open the tool.</strong> Go to the{" "}
        <a href="/tools/photo-censor">Photo Censor</a> page and add your image by dragging it in or
        clicking to browse. The file is read locally.
        <br />
        <strong>2. Pick a censor style.</strong> Blur softens an area, pixelate turns it into chunky
        squares, and solid block paints it out completely.
        <br />
        <strong>3. Paint over the sensitive areas.</strong> Brush over each face, plate, name, or
        number you want to hide. You can cover several regions in one pass.
        <br />
        <strong>4. Adjust the strength.</strong> For true redaction, go heavy — a light blur can be
        reversed. A strong pixelation or a solid block is safest.
        <br />
        <strong>5. Export.</strong> Download the censored image. The original on your disk is never
        modified.
      </p>

      <h2>Blur vs. Pixelate vs. Solid Block — Which to Use</h2>
      <p>
        <strong>Solid block</strong> is the only truly irreversible option. The pixels underneath are
        replaced with a flat color, so there is nothing left to recover. Use it for anything that
        genuinely must never be readable: government IDs, financial details, passwords, medical
        information.
      </p>
      <p>
        <strong>Heavy pixelation</strong> is the right balance for most situations — it hides the
        content while still showing that something was there (a face, a screen, a sign). Keep the
        block size large; a fine pixelation of text can sometimes be partially reconstructed.
      </p>
      <p>
        <strong>Blur</strong> looks the cleanest and is fine for de-emphasizing a background face or
        a logo, but a <em>light</em> blur is the weakest form of censorship. Faces and short text
        under a mild Gaussian blur have, in documented cases, been recovered. If the data matters,
        do not rely on a gentle blur — go strong, or use a solid block.
      </p>

      <h2>The Mistake That Leaks Redacted Data</h2>
      <p>
        The most common redaction failure has nothing to do with how strong your blur is. It is
        <strong> metadata</strong>. A photo can carry EXIF data — GPS coordinates, the device that
        took it, the original timestamp — embedded in the file itself. You can black out the address
        in the picture and still ship the exact GPS location in the metadata. After redacting,
        consider stripping that data; our <a href="/tools/image-converter">image converter</a> and
        the <a href="/blog/exif-data-guide">EXIF metadata guide</a> explain what is hidden in your
        photos and how to remove it.
      </p>
      <p>
        The second classic mistake is redacting in a way that can be undone: drawing a black box as a
        separate layer in a PDF or a vector editor, where the text underneath still exists and can be
        selected or moved. Because the Photo Censor tool exports a flattened raster image, the
        censored pixels are genuinely gone — there is no hidden layer to peel back.
      </p>

      <h2>Why Redact in the Browser, Not on a Website</h2>
      <p>
        It is a striking irony: people redact an image precisely because it contains something
        sensitive, then upload that unredacted original to an online editor&rsquo;s servers to do the
        redaction. The whole point is privacy, and the workflow defeats it.
      </p>
      <p>
        Browser-based redaction keeps the original on your device the entire time. The image is read
        into the page, edited with your own browser, and exported locally. The unredacted version
        never travels across the internet, never lands in a log, and never sits in someone
        else&rsquo;s storage bucket. For a fuller explanation of why this model matters, see{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          why browser-based tools keep your data private
        </a>
        .
      </p>

      <h2>Frequently Asked Questions</h2>
      <p>
        <strong>Is blurring a face actually safe?</strong> Only if the blur is strong. A light blur
        can sometimes be reversed. For real anonymity, use heavy pixelation or a solid block.
      </p>
      <p>
        <strong>Can a redacted image be un-redacted?</strong> Not if you used a solid block or strong
        pixelation and exported a flattened image — the underlying pixels are replaced. The risk only
        exists with weak blurs or with editors that keep the original on a hidden layer.
      </p>
      <p>
        <strong>Does the tool upload my photo?</strong> No. Everything happens in your browser. The
        image is never sent to a server.
      </p>
      <p>
        <strong>What about location data in the photo?</strong> Redacting the visible image does not
        remove EXIF GPS data. Strip metadata separately before sharing.
      </p>
      <p>
        <strong>Is it free?</strong> Yes — no account, no watermark, no limits.
      </p>

      <h2>Try It Now</h2>
      <p>
        Open the <a href="/tools/photo-censor">Photo Censor tool</a>, paint over anything sensitive,
        and export a clean copy that never left your device. To finish the job, strip location
        metadata with the <a href="/tools/image-converter">image converter</a>, and if you also need
        to trim or watermark the result, read our guide on{" "}
        <a href="/blog/crop-and-watermark-images-online">cropping and watermarking images online</a>.
      </p>
    </div>
  );
}
