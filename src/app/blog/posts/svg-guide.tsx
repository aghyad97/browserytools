export default function Content() {
  return (
    <div>
      <p>
        SVG is one of those technologies that looks simple from the outside — it is just a drawing format,
        right? — but rewards deeper study more than almost any other format in a developer's or designer's
        toolkit. SVG files scale infinitely without any loss of quality, weigh almost nothing for simple
        graphics, can be styled with CSS, animated with JavaScript or CSS transitions, and embedded
        directly into HTML. Understanding SVG properly changes how you think about graphics on the web.
      </p>
      <p>
        You can view, inspect, and optimize any SVG file using the{" "}
        <a href="/tools/svg">BrowseryTools SVG Tool</a> — free, no sign-up, everything runs in your
        browser.
      </p>

      <h2>What Is SVG?</h2>
      <p>
        SVG stands for Scalable Vector Graphics. Unlike JPEG, PNG, or WebP — which store images as grids
        of colored pixels (raster images) — SVG stores images as mathematical descriptions of shapes. A
        circle is described as a center point and a radius. A path is described as a sequence of drawing
        commands: move to this point, draw a line to that point, draw a curve through these control
        points, close the path.
      </p>
      <p>
        SVG is an XML-based format, meaning every SVG file is plain text, human-readable, and
        structured as a tree of nested elements. Open any SVG in a text editor and you see legible markup,
        not a binary blob. This has significant practical consequences: SVG files can be generated
        programmatically, modified with text-processing tools, diffed in version control, and embedded
        directly into HTML without any additional processing.
      </p>
      <p>
        The format is a W3C standard, maintained alongside HTML and CSS. Every modern browser has a
        full SVG rendering engine built in.
      </p>

      <h2>Why SVG Beats Raster for Icons and Illustrations</h2>
      <p>
        The decisive advantage of SVG over raster formats for icons, logos, and illustrations is
        resolution independence. A raster icon created at 32×32 pixels will look blurry on a Retina
        display, which renders at 2× or 3× physical pixels per CSS pixel. To fix this, you either need
        to export multiple resolution variants (@1x, @2x, @3x), increase the source resolution (larger
        files, more memory), or use image-set in CSS to serve the right resolution. With SVG, you create
        the graphic once and it looks perfect at every size, on every display, forever.
      </p>
      <p>
        File size is the other major advantage for simple graphics. A simple icon — a checkmark, an
        arrow, a hamburger menu — might be described in an SVG file using 200–500 bytes. The equivalent
        PNG at 2× Retina resolution might be 2–5 KB. At 3×, larger still. When an interface has 50 icons,
        the difference between 50 optimized SVGs (totaling ~20 KB) and 50 PNG sets (totaling ~300+ KB)
        is meaningful.
      </p>
      <p>
        Raster images win for photographic content and complex, highly detailed illustrations with smooth
        gradients and textures. A vector SVG of a photograph would be enormous and would look stylized
        rather than photographic. The right format depends entirely on the nature of the content.
      </p>

      <h2>SVG Anatomy: The Core Elements</h2>
      <p>
        A minimal SVG file has this structure:
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
{`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#3b82f6" />
  <path d="M8 12 L12 16 L16 8" stroke="white" stroke-width="2" fill="none" />
</svg>`}
      </pre>
      <p>
        The key elements and attributes to understand:
      </p>
      <ul>
        <li>
          <strong>viewBox</strong> — Defines the internal coordinate system. <code>viewBox="0 0 24 24"</code>{" "}
          means the drawing space spans from (0,0) to (24,24). The SVG can then be rendered at any actual
          size — 16×16, 32×32, 200×200 — and the browser scales the coordinate system to fit. This is
          the mechanism behind resolution independence.
        </li>
        <li>
          <strong>path</strong> — The most powerful SVG element. A <code>d</code> attribute contains
          drawing commands: <code>M</code> (move to), <code>L</code> (line to), <code>C</code> (cubic
          bezier curve), <code>A</code> (arc), <code>Z</code> (close path). Almost any shape can be
          expressed as a path.
        </li>
        <li>
          <strong>circle, rect, ellipse, line, polygon</strong> — Convenience elements for common shapes.
          A <code>&lt;circle&gt;</code> takes <code>cx</code>, <code>cy</code>, and <code>r</code>. A{" "}
          <code>&lt;rect&gt;</code> takes <code>x</code>, <code>y</code>, <code>width</code>, and{" "}
          <code>height</code>, plus optional <code>rx</code> for rounded corners.
        </li>
        <li>
          <strong>text</strong> — SVG can render typographic text that scales with the image and remains
          selectable and accessible, unlike text rendered into a raster image.
        </li>
        <li>
          <strong>g (group)</strong> — Groups child elements together so transforms, styles, and opacity
          can be applied to the entire group at once.
        </li>
        <li>
          <strong>defs and use</strong> — Define reusable elements once and reference them multiple times
          with <code>&lt;use&gt;</code>. Essential for icon systems that use a single SVG sprite.
        </li>
      </ul>

      <h2>Styling SVG with CSS and Animating It</h2>
      <p>
        SVG elements are part of the DOM when SVG is inlined in HTML. This means CSS can target them
        directly using all the same selectors used for HTML elements. You can change fill colors, stroke
        widths, and opacity on hover, in dark mode, or in response to any state change:
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
{`/* Target SVG elements with CSS */
.icon-check circle {
  fill: #22c55e;
  transition: fill 0.2s ease;
}

.icon-check:hover circle {
  fill: #16a34a;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .icon-check circle { fill: #4ade80; }
}`}
      </pre>
      <p>
        CSS animations and transitions work on SVG properties. The <code>stroke-dasharray</code> and{" "}
        <code>stroke-dashoffset</code> trick — animating a path from invisible to visible by manipulating
        how much of a dashed stroke is shown — creates the "drawing" effect seen on many loading indicators
        and onboarding illustrations. SVG also has its own <code>&lt;animate&gt;</code> and{" "}
        <code>&lt;animateTransform&gt;</code> elements (SMIL animation), though CSS and JavaScript
        animation are generally preferred for maintainability.
      </p>
      <p>
        Using <code>currentColor</code> as the fill value makes an SVG icon inherit the text color of its
        parent element automatically, allowing a single icon to adapt to any color context without
        modification.
      </p>

      <h2>SVG Optimization with SVGO</h2>
      <p>
        SVG files exported from design tools like Figma or Illustrator contain a lot of unnecessary
        bloat: editor metadata, redundant attributes, group wrappers with no effect, floating-point
        coordinates with eight decimal places, <code>id</code> attributes generated by the design tool's
        internal node system. For a simple icon, this overhead can triple or quadruple the file size
        compared to a hand-optimized version.
      </p>
      <p>
        SVGO (SVG Optimizer) is the standard tool for removing this overhead. It applies a configurable
        set of transformations: collapsing nested groups, removing invisible elements, rounding coordinates
        to reasonable precision, merging redundant paths, removing metadata and comments, and more.
        A typical SVGO pass reduces icon SVG file size by 30–60% with no visual change.
      </p>
      <p>
        The{" "}
        <a href="/tools/svg">BrowseryTools SVG Tool</a> applies SVG optimization in your browser, giving
        you the optimized output without installing any command-line tools.
      </p>

      <h2>Inline SVG vs External File vs CSS Background</h2>
      <p>
        There are three main ways to include an SVG in a web page, each with different trade-offs:
      </p>
      <ul>
        <li>
          <strong>Inline SVG</strong> — The SVG markup is embedded directly in the HTML. Gives full CSS
          and JavaScript access to every element inside the SVG. Best for icons that need hover effects,
          color changes, or animation. Cannot be cached separately by the browser.
        </li>
        <li>
          <strong>External SVG file via <code>&lt;img&gt;</code></strong> — The SVG is a separate file
          referenced with <code>&lt;img src="icon.svg"&gt;</code>. The browser can cache the file. Simple
          to use. But CSS from the parent page cannot reach inside the SVG, and JavaScript cannot manipulate
          its contents.
        </li>
        <li>
          <strong>CSS background-image</strong> — The SVG is referenced as a CSS background. Works for
          purely decorative graphics. The SVG can also be inlined as a data URI in CSS, useful for small
          icons in component stylesheets. CSS cannot restyle elements inside the SVG.
        </li>
      </ul>
      <p>
        SVG sprite sheets — a single SVG file containing all icons defined in <code>&lt;defs&gt;</code>
        blocks, referenced with <code>&lt;use href="sprite.svg#icon-name"&gt;</code> — offer a good
        balance: one cacheable network request for all icons, with per-icon DOM manipulation possible
        in most modern browsers.
      </p>

      <h2>Common SVG Pitfalls: XSS via SVG</h2>
      <p>
        SVG supports embedded scripts, event handlers, and external resource references, which makes it
        a viable attack vector for cross-site scripting (XSS) if user-uploaded SVG files are displayed
        in a browser context. An SVG file containing{" "}
        <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code> will execute that script if
        the browser renders the SVG as part of a page.
      </p>
      <p>
        The rules for safely handling user-uploaded SVGs:
      </p>
      <ul>
        <li>
          Never inline user-uploaded SVG in your HTML. Only inline SVGs you control.
        </li>
        <li>
          If you must display user-uploaded SVGs, serve them from a separate, sandboxed origin and display
          them in an <code>&lt;img&gt;</code> tag or a sandboxed <code>&lt;iframe&gt;</code>. The{" "}
          <code>&lt;img&gt;</code> tag does not execute scripts in the SVG.
        </li>
        <li>
          Sanitize user-uploaded SVGs by running them through a sanitizer (DOMPurify with the SVG
          configuration) before storing or displaying them.
        </li>
        <li>
          Set the Content Security Policy header to restrict script sources on pages that display SVGs.
        </li>
      </ul>

      <h2>Converting SVG to PNG</h2>
      <p>
        Some contexts do not support SVG: older email clients, certain CMS platforms, some image
        processing pipelines, app icon requirements for iOS and Android, and Open Graph preview images.
        In these cases, you need to export the SVG as a rasterized PNG.
      </p>
      <p>
        Because SVG scales losslessly, you can export to PNG at any size. For app icons, this means
        exporting a single SVG source at 1024×1024 and deriving all smaller sizes from it. For Retina
        web use, export at 2× or 3× the CSS display size.
      </p>
      <p>
        The{" "}
        <a href="/tools/svg">BrowseryTools SVG Tool</a> can render SVG to PNG at your chosen resolution,
        handling the conversion in-browser without any server upload. Useful when you have an SVG from
        a design tool and need a PNG for a context that does not accept SVG.
      </p>

      <div
        style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Quick reference:</strong> Use SVG for icons, logos, illustrations, UI elements, and
        anything that needs to scale. Use PNG (converted from SVG) for contexts that require raster images.
        Always run SVG files through SVGO before shipping. Never inline user-uploaded SVGs directly in
        your HTML. Use <code>currentColor</code> for icons that need to adapt to their text color context.
      </div>
    </div>
  );
}
