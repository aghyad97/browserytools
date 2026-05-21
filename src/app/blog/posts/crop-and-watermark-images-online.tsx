export default function Content() {
  return (
    <div>
      <p>
        Two of the most common things people need to do to an image have nothing to do with fancy
        editing: <strong>crop</strong> it to the right shape and size, and add a{" "}
        <strong>watermark</strong> so it cannot be reused without credit. Cropping fits a photo to a
        thumbnail, a banner, a square avatar, or a specific aspect ratio. A watermark protects your
        work and brands your screenshots. You should not need Photoshop or a subscription for either
        — and you definitely should not upload the image to a stranger&rsquo;s server.
      </p>
      <p>
        The <a href="/tools/image-resizer">BrowseryTools image resizer</a> handles cropping, resizing,
        and watermarking entirely in your browser. No upload, no account, no watermark forced onto
        your image by the tool itself. This guide covers how to crop to a precise aspect ratio,
        resize without distortion, and add a watermark that actually deters reuse.
      </p>

      <h2>How to Crop and Resize an Image (Step by Step)</h2>
      <p>
        <strong>1. Open the tool.</strong> Go to the <a href="/tools/image-resizer">image resizer</a>{" "}
        and add your image. It is read locally — never uploaded.
        <br />
        <strong>2. Pick an aspect ratio or free crop.</strong> Choose a preset like 1:1 (square),
        16:9 (banner), or 4:5 (portrait), or drag freely. Presets keep the proportions correct for
        the destination.
        <br />
        <strong>3. Resize to the exact pixels you need.</strong> Set width and height. Keep the
        aspect ratio locked unless you want the image stretched.
        <br />
        <strong>4. Add a watermark (optional).</strong> Overlay your name, logo, or a URL, and set
        its position and opacity.
        <br />
        <strong>5. Export.</strong> Download the result. The original on your disk is unchanged.
      </p>

      <h2>Crop to the Right Aspect Ratio</h2>
      <p>
        The mistake that ruins more images than any other is changing the aspect ratio carelessly,
        which stretches or squashes the picture. Faces go wide, circles become ovals. To avoid it,
        decide the <em>shape</em> first and crop to it, rather than forcing the existing image into a
        new width and height. Common targets:
      </p>
      <p>
        <strong>1:1 square</strong> — profile photos, product thumbnails, Instagram grid posts.
        <br />
        <strong>16:9 widescreen</strong> — video thumbnails, presentation slides, hero banners.
        <br />
        <strong>4:5 portrait</strong> — the tallest ratio Instagram allows in-feed, great for
        maximizing screen space on mobile.
        <br />
        <strong>3:2 / 4:3</strong> — classic photo ratios for prints and galleries.
      </p>
      <p>
        Crop to the ratio, <em>then</em> resize down to the pixel dimensions the platform wants. That
        order keeps everything in proportion.
      </p>

      <h2>Resize Without Losing Sharpness</h2>
      <p>
        Scaling an image <em>down</em> is safe and even sharpens the result. Scaling <em>up</em> is
        not — you cannot invent detail that was never captured, so an enlarged image looks soft or
        blocky. Always start from the highest-resolution original you have and reduce from there. If
        you only need a smaller file (not smaller dimensions), that is compression, not resizing —
        see our <a href="/blog/free-image-tools-guide">guide to free image tools</a> for the
        difference.
      </p>

      <h2>Add a Watermark That Actually Works</h2>
      <p>
        A good watermark balances visibility against not ruining the image. A few principles:
      </p>
      <p>
        <strong>Place it where it cannot be cropped out.</strong> A tiny logo in one corner is easy
        to crop away. A semi-transparent mark across the center, or repeated across the image, is far
        harder to remove.
        <br />
        <strong>Use moderate opacity.</strong> Around 30&ndash;50% lets the image show through while
        the mark stays legible. Fully opaque looks heavy; barely visible offers no protection.
        <br />
        <strong>Keep it simple.</strong> Your name, handle, or domain is enough. The goal is
        attribution and deterrence, not decoration.
      </p>
      <p>
        Remember that no visible watermark is unbreakable — a determined person can clone it out. The
        purpose is to make casual reuse inconvenient and to ensure that when your image does spread,
        your name travels with it.
      </p>

      <h2>Why Edit in the Browser?</h2>
      <p>
        Cropping and watermarking are about control over your own images — yet most online editors
        upload the original to their servers first. Browser-based editing keeps the file on your
        device the whole time: it is read into the page, edited by your own browser, and exported
        locally. Nothing is uploaded, the tool adds no watermark of its own, and there is no size cap
        behind a paywall. It is the same local-first model behind every BrowseryTools utility, as
        explained in{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          why browser-based tools keep your data private
        </a>
        .
      </p>

      <h2>Frequently Asked Questions</h2>
      <p>
        <strong>Why does my image look stretched after resizing?</strong> The aspect ratio changed.
        Lock the ratio, or crop to the target shape before resizing.
      </p>
      <p>
        <strong>Can I make a small image bigger without losing quality?</strong> Not really.
        Upscaling cannot add detail that was never there. Start from the largest original.
      </p>
      <p>
        <strong>Will the tool add its own watermark?</strong> No. Only the watermark you add appears.
      </p>
      <p>
        <strong>Is my image uploaded?</strong> No. Everything is processed locally in your browser.
      </p>
      <p>
        <strong>Is it free?</strong> Yes — no account, no limits, no forced watermark.
      </p>

      <h2>Try It Now</h2>
      <p>
        Open the <a href="/tools/image-resizer">image resizer</a> to crop, resize, and watermark in
        one place — all without uploading. If you also need to hide sensitive details in the photo,
        see our guide on <a href="/blog/redact-image-online">redacting images online</a>, and to
        shrink the final file size read our{" "}
        <a href="/blog/free-image-tools-guide">guide to free image tools</a>.
      </p>
    </div>
  );
}
