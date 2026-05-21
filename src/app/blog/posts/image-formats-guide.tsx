export default function Content() {
  return (
    <div>
      <p>
        Choosing the wrong image format is one of the most common and most expensive mistakes in web
        performance. A JPEG where a WebP would do, a PNG where a JPEG is sufficient, or a format your
        browser does not support — each of these adds unnecessary weight to every page load, directly
        harming your Core Web Vitals scores and user experience. This guide explains how JPEG, PNG, WebP,
        and AVIF each work under the hood, when to use each one, and how to make an informed choice for
        your specific context.
      </p>
      <p>
        You can convert between any of these formats using the{" "}
        <a href="/tools/image-converter">BrowseryTools Image Converter</a> — free, no sign-up, and
        everything runs locally in your browser.
      </p>

      <h2>JPEG: The Photography Standard</h2>
      <p>
        JPEG (Joint Photographic Experts Group) was introduced in 1992 and remains the dominant format
        for photographs. Its compression algorithm is based on the Discrete Cosine Transform (DCT): each
        image is divided into 8×8 pixel blocks, and each block is transformed from the spatial domain
        (pixel colors) into the frequency domain (how quickly colors change across the block). The
        encoder then quantizes this frequency data — keeping the low-frequency components that describe
        broad color regions, and discarding or coarsening the high-frequency components that describe
        fine detail and sharp edges.
      </p>
      <p>
        This is why JPEG compression produces characteristic artifacts at aggressive settings: blocky
        8×8 patches (called macroblocking), smearing around sharp edges, and color banding in gradients.
        These artifacts appear in regions of fine detail and high contrast — exactly the areas where the
        high-frequency components the encoder threw away would have mattered most.
      </p>
      <p>
        JPEG is lossy — every save discards information permanently. At quality 85–90 (on a 0–100 scale),
        photographs typically look indistinguishable from the original at web viewing sizes while being
        5–20× smaller than a PNG of the same image. JPEG does not support transparency (alpha channel)
        or animation.
      </p>

      <h2>PNG: Lossless Precision</h2>
      <p>
        PNG (Portable Network Graphics) uses lossless compression based on the DEFLATE algorithm, which
        combines LZ77 dictionary compression (finding and replacing repeated sequences of bytes) with
        Huffman coding (assigning shorter bit codes to more frequent values). No image data is ever
        discarded. Every pixel is stored exactly.
      </p>
      <p>
        This makes PNG excellent for images that must be reproduced pixel-perfectly: screenshots, logos,
        icons, illustrations with sharp edges, text overlaid on images, and anything with transparency.
        PNG supports full 8-bit alpha channels, allowing smooth semi-transparent gradients.
      </p>
      <p>
        The trade-off is file size. For photographic content with continuous color gradients, PNG files
        are enormous compared to JPEG at similar perceived quality. A photograph saved as PNG might be
        10–20× larger than the same image as a well-compressed JPEG. PNG excels when content has large
        uniform regions, hard edges, or relatively few distinct colors — the patterns that LZ77 compresses
        efficiently. Photography, with its millions of subtly different color values, is the worst case
        for PNG.
      </p>

      <h2>WebP: The Modern Web Format</h2>
      <p>
        WebP was introduced by Google in 2010, derived from the VP8 video codec. It supports both lossy
        and lossless compression modes, plus animation and transparency in both modes. The lossy mode
        uses a similar DCT-based block approach to JPEG but with more sophisticated prediction techniques
        and entropy coding, typically achieving 25–35% smaller files than JPEG at equivalent visual
        quality. The lossless mode is 15–25% more efficient than PNG for most content.
      </p>
      <p>
        Browser support is now essentially universal — all major browsers have supported WebP since 2020.
        The main remaining gap is legacy software: some older image editing applications and operating
        system image viewers do not handle WebP natively. For web delivery, WebP is the straightforward
        modern default that replaces both JPEG and PNG in most cases.
      </p>

      <h2>AVIF: The Next Generation</h2>
      <p>
        AVIF (AV1 Image File Format) is based on keyframes from the AV1 video codec, which was developed
        by the Alliance for Open Media and released in 2018. AV1's compression techniques are
        significantly more sophisticated than those underlying JPEG or WebP: larger, variable-size
        prediction blocks, more sophisticated intra-frame prediction, better handling of film grain and
        noise, and superior entropy coding. The result is typically 40–50% smaller files than JPEG at
        equivalent quality — often beating WebP by 20–30% as well.
      </p>
      <p>
        AVIF supports full HDR color, wide color gamuts, transparency, animation, and both 8-bit and
        10-bit color depth. Browser support has caught up quickly: Chrome (85+), Firefox (93+), and
        Safari (16+) all support AVIF. The main drawback is encoding speed — AVIF is significantly slower
        to encode than JPEG or WebP, which matters for real-time image processing pipelines but is
        irrelevant for pre-compressed static assets.
      </p>

      <h2>File Size Comparison for the Same Image</h2>
      <p>
        To make the differences concrete, here is a representative comparison for a 1920×1080 photograph
        at comparable perceived visual quality:
      </p>
      <ul>
        <li>
          <strong>PNG (lossless)</strong> — 4.2 MB. Perfect reproduction, no artifacts. Appropriate for
          a source master or when pixel accuracy is required.
        </li>
        <li>
          <strong>JPEG (quality 85)</strong> — 380 KB. Minimal visible artifacts at screen size. The
          standard for photographic web delivery for three decades.
        </li>
        <li>
          <strong>WebP (lossy, equivalent quality)</strong> — 270 KB. About 30% smaller than JPEG,
          visually comparable. A straightforward upgrade for most web projects.
        </li>
        <li>
          <strong>AVIF (equivalent quality)</strong> — 180 KB. About 50% smaller than JPEG, visually
          comparable or better. The best file size available today for photographic content.
        </li>
      </ul>
      <p>
        These are representative figures; the actual ratios vary by image content. High-detail, high-noise
        photography benefits less from newer codecs than smooth, low-noise images do.
      </p>

      <h2>When to Use Each Format</h2>
      <ul>
        <li>
          <strong>Photographs on the web</strong> — Use WebP with a JPEG fallback via the HTML{" "}
          <code>&lt;picture&gt;</code> element. If your build pipeline supports AVIF encoding,
          serve AVIF with WebP and JPEG fallbacks.
        </li>
        <li>
          <strong>Logos, icons, UI elements with transparency</strong> — WebP (lossless) or PNG.
          JPEG cannot represent transparency at all.
        </li>
        <li>
          <strong>Screenshots and screen recordings</strong> — PNG for anything requiring exact pixel
          reproduction. WebP lossless for a smaller alternative when exact fidelity is not critical.
        </li>
        <li>
          <strong>Illustrations with flat colors and sharp edges</strong> — PNG or WebP lossless. JPEG
          will introduce visible ringing artifacts around hard edges even at high quality settings.
        </li>
        <li>
          <strong>Print and archival</strong> — PNG (lossless) or TIFF. Lossy formats are inappropriate
          for source assets that will be re-edited.
        </li>
        <li>
          <strong>Email</strong> — JPEG or PNG. Email clients have inconsistent support for WebP and
          essentially none for AVIF. Compatibility over optimization here.
        </li>
      </ul>

      <h2>Impact on Core Web Vitals and Page Performance</h2>
      <p>
        Largest Contentful Paint (LCP) — one of Google's Core Web Vitals — measures how long it takes
        for the largest visible content element (often a hero image) to load. Image format choice directly
        affects LCP: an AVIF hero image loads faster than the equivalent JPEG, and a faster LCP improves
        both user experience and search rankings.
      </p>
      <p>
        The compounding effect matters too. A page with 20 product images, each unnecessarily saved as
        PNG instead of WebP, might be 5–10 MB heavier than it needs to be. On mobile connections, that
        is the difference between a page that loads in 2 seconds and one that loads in 8 seconds.
      </p>

      <h2>Serving Different Formats to Different Browsers</h2>
      <p>
        The HTML <code>&lt;picture&gt;</code> element and its <code>&lt;source&gt;</code> children let
        you serve the best format each browser supports without JavaScript:
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero image" />
</picture>`}
      </pre>
      <p>
        The browser picks the first <code>&lt;source&gt;</code> it supports. Browsers with AVIF support
        download the smallest file; browsers without fall through to WebP or JPEG. The <code>&lt;img&gt;</code>{" "}
        tag at the end serves as the universal fallback and is the only element that requires the{" "}
        <code>alt</code> attribute.
      </p>
      <p>
        To convert your existing images to WebP or AVIF for this kind of multi-format setup, the{" "}
        <a href="/tools/image-converter">BrowseryTools Image Converter</a> handles batch conversions
        without uploading anything to a server — your source files stay on your device.
      </p>

      <div
        style={{
          background: "rgba(99,102,241,0.07)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Quick decision guide:</strong> If you need maximum compatibility, use JPEG for photos
        and PNG for graphics. If you are optimizing for web performance, use WebP as your baseline and
        add AVIF as an enhancement. If you are building a new project from scratch with a modern stack,
        serve AVIF with WebP fallback and stop worrying about JPEG entirely.
      </div>
    </div>
  );
}
