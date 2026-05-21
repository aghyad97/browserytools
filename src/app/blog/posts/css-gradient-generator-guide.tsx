export default function Content() {
  return (
    <div>
      <p>
        CSS gradients are one of the most powerful and underused tools in the frontend developer's toolkit. They
        let you create smooth color transitions, dramatic backgrounds, subtle UI polish, and even complex visual
        patterns — all without a single image file. Before CSS gradients became universally supported, designers
        had to export gradient backgrounds as PNGs from Photoshop, resulting in extra HTTP requests, inflexible
        static assets, and layouts that broke the moment someone changed the brand colors. Today, a single line
        of CSS replaces all of that.
      </p>
      <p>
        This guide covers everything you need to know about CSS gradients — the three types, the angle system,
        real-world use cases with copy-ready code, common mistakes, and how to use the{" "}
        <a href="/tools/css-gradient">BrowseryTools CSS Gradient Generator</a> to build exactly what you need
        without writing a single line from scratch.
      </p>

      <h2>Why CSS Gradients Replaced Image-Based Backgrounds</h2>
      <p>
        The old approach — exporting a 1×1000px gradient PNG and tiling it horizontally — had real costs.
        Every gradient was a round-trip to the server, a bytes-on-the-wire cost, and a maintenance burden when
        colors changed. More importantly, PNG gradients could not respond dynamically to screen sizes, theme
        switches, or hover states.
      </p>
      <p>
        CSS gradients solve all of this. They are rendered by the GPU in real time, respond instantly to
        JavaScript state changes, scale perfectly at any resolution, work with CSS transitions and animations,
        and add zero bytes to your asset bundle. Browser support is now 100% across all modern browsers and
        has been since 2014. There is no reason to use image-based gradients for solid color transitions
        in new projects.
      </p>

      <h2>The Three Types of CSS Gradients</h2>

      <h3>1. Linear Gradient</h3>
      <p>
        A linear gradient transitions colors along a straight line. The direction can be any angle, or
        expressed as a keyword like <code>to right</code> or <code>to bottom right</code>. This is the most
        commonly used gradient type and covers the vast majority of design needs.
      </p>
      <pre><code>{`/* Classic diagonal purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Top to bottom (default direction) */
background: linear-gradient(#f8fafc, #e2e8f0);

/* Left to right with three color stops */
background: linear-gradient(to right, #f97316, #ec4899, #8b5cf6);`}</code></pre>

      <h3>2. Radial Gradient</h3>
      <p>
        A radial gradient radiates outward from a center point. By default it forms an ellipse that fits
        the element's bounding box, but you can control the shape, size, and position. Radial gradients
        are ideal for spotlight effects, glowing buttons, and ambient light simulations.
      </p>
      <pre><code>{`/* Circular glow from center */
background: radial-gradient(circle, #6366f1 0%, #1e1b4b 100%);

/* Ellipse glow at top-left corner */
background: radial-gradient(ellipse at top left, #fbbf24 0%, transparent 60%);

/* Positioned spotlight */
background: radial-gradient(circle at 30% 40%, #e0f2fe, #0284c7);`}</code></pre>

      <h3>3. Conic Gradient</h3>
      <p>
        A conic gradient sweeps colors around a center point, like the hands of a clock. This makes it
        uniquely suited for pie charts, color wheels, and loading spinner animations. It was the last of
        the three gradient types to gain universal support, landing in all major browsers by 2021.
      </p>
      <pre><code>{`/* Pie chart with three segments */
background: conic-gradient(
  #6366f1 0deg 120deg,
  #ec4899 120deg 240deg,
  #f97316 240deg 360deg
);

/* Color wheel */
background: conic-gradient(
  hsl(0, 100%, 50%),
  hsl(60, 100%, 50%),
  hsl(120, 100%, 50%),
  hsl(180, 100%, 50%),
  hsl(240, 100%, 50%),
  hsl(300, 100%, 50%),
  hsl(360, 100%, 50%)
);`}</code></pre>

      <h2>Understanding the Angle System for Linear Gradients</h2>
      <p>
        The angle parameter in <code>linear-gradient</code> follows a convention that surprises many developers
        because it differs from standard mathematical angles. Here is the mapping:
      </p>
      <ul>
        <li><strong>0deg</strong> — bottom to top (the gradient flows upward)</li>
        <li><strong>90deg</strong> — left to right (the most common horizontal gradient)</li>
        <li><strong>135deg</strong> — diagonal, top-left to bottom-right</li>
        <li><strong>180deg</strong> — top to bottom (same as the default with no angle specified)</li>
        <li><strong>225deg</strong> — diagonal, bottom-right to top-left</li>
        <li><strong>270deg</strong> — right to left</li>
      </ul>
      <p>
        The keyword equivalents — <code>to top</code>, <code>to right</code>, <code>to bottom left</code> — are
        often more readable than numeric angles for common directions. For precise diagonal effects, numeric
        degrees give you exact control. The popular purple-to-indigo diagonal gradient uses{" "}
        <code>135deg</code>:
      </p>
      <pre><code>{`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`}</code></pre>

      <h2>Radial Gradient Shapes: Circle vs Ellipse</h2>
      <p>
        By default, <code>radial-gradient</code> produces an ellipse sized to fit the element. You can override
        this with two shape keywords:
      </p>
      <ul>
        <li>
          <strong>circle</strong> — forces a perfect circle regardless of the element's aspect ratio. Use this
          for glow effects and spotlight backgrounds where you want even radial falloff in all directions.
        </li>
        <li>
          <strong>ellipse</strong> — the default, stretches to fit the container. Use this for subtle
          background fills that need to adapt naturally to any element shape.
        </li>
      </ul>
      <p>
        The <code>at</code> keyword lets you reposition the gradient center anywhere in the element using any
        CSS length or percentage. <code>at center</code>, <code>at top left</code>, <code>at 20% 80%</code> — all
        are valid. Positioning is especially powerful for creating off-center ambient light effects:
      </p>
      <pre><code>{`/* Glow coming from upper-right corner */
background: radial-gradient(ellipse at top right, rgba(251,191,36,0.4), transparent 60%);

/* Multiple radial gradients layered */
background:
  radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3), transparent 40%),
  radial-gradient(circle at 80% 70%, rgba(236,72,153,0.3), transparent 40%),
  #0f172a;`}</code></pre>

      <h2>Conic Gradients for Pie Charts and Loading Spinners</h2>
      <p>
        The conic gradient's ability to sweep in a circle makes it the native CSS solution for two classic UI
        components that previously required SVG or JavaScript:
      </p>
      <p>
        For a <strong>progress ring</strong>, combine a conic gradient with a circular mask. For a pie chart,
        the conic gradient segments correspond directly to data percentages. A segment spanning from
        <code>0deg</code> to <code>72deg</code> represents exactly 20% of a full circle. This makes translating
        data to CSS straightforward — multiply the percentage by 3.6 to get the degree value.
      </p>

      <h2>Multi-Stop Gradients and Hard Stops for Stripe Patterns</h2>
      <p>
        Color stops do not have to blend smoothly. When two adjacent stops share the same position, the
        transition between them becomes instantaneous — a hard stop. This technique is how you create striped
        patterns, checkerboards, and ruled line backgrounds entirely in CSS:
      </p>
      <pre><code>{`/* Candy stripe pattern using hard stops */
background: linear-gradient(
  45deg,
  #6366f1 25%,
  transparent 25%,
  transparent 50%,
  #6366f1 50%,
  #6366f1 75%,
  transparent 75%
);
background-size: 40px 40px;

/* Warning stripe — alternating color hard stops */
background: repeating-linear-gradient(
  -45deg,
  #fbbf24,
  #fbbf24 10px,
  #1e293b 10px,
  #1e293b 20px
);`}</code></pre>

      <h2>Real-World Use Cases with Example Code</h2>

      <h3>Hero Section Backgrounds</h3>
      <p>
        A multi-stop linear gradient with a mesh of two radial highlights gives hero sections the depth of a
        custom illustration without any image files:
      </p>
      <pre><code>{`.hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.15), transparent 50%),
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  min-height: 100vh;
}`}</code></pre>

      <h3>Button Hover Effects</h3>
      <p>
        Gradients can be animated on hover using the <code>background-position</code> trick — size the gradient
        to 200% and shift its position on hover:
      </p>
      <pre><code>{`.btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  background-position: 0% 50%;
  transition: background-position 0.4s ease;
}
.btn:hover {
  background-position: 100% 50%;
}`}</code></pre>

      <h3>Card Borders with border-image</h3>
      <p>
        The <code>border-image</code> property accepts a gradient, allowing gradient borders without wrapper
        elements or pseudo-element hacks (for solid backgrounds):
      </p>
      <pre><code>{`.card-gradient-border {
  border: 2px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #6366f1, #ec4899) border-box;
}`}</code></pre>

      <h3>Progress Bars</h3>
      <p>
        A gradient progress bar communicates both value and visual energy at once. Pair it with a
        <code>width</code> transition for smooth animation:
      </p>
      <pre><code>{`.progress-bar {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  width: 73%; /* Controlled by JS or CSS custom property */
  transition: width 0.6s ease;
}`}</code></pre>

      <h2>Gradient Type Comparison</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Gradient Type</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>CSS Function</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Best Use Case</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Linear</strong></td>
              <td style={{padding: "12px 16px"}}><code>linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Hero backgrounds, buttons, banners</td>
              <td style={{padding: "12px 16px"}}><code>135deg, #667eea, #764ba2</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Radial</strong></td>
              <td style={{padding: "12px 16px"}}><code>radial-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Glows, spotlights, ambient light</td>
              <td style={{padding: "12px 16px"}}><code>circle at center, #6366f1, #1e1b4b</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Conic</strong></td>
              <td style={{padding: "12px 16px"}}><code>conic-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Pie charts, color wheels, spinners</td>
              <td style={{padding: "12px 16px"}}><code>#6366f1 0deg 120deg, #ec4899 120deg 240deg</code></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Repeating Linear</strong></td>
              <td style={{padding: "12px 16px"}}><code>repeating-linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Stripe patterns, ruled lines</td>
              <td style={{padding: "12px 16px"}}><code>-45deg, #fbbf24 0 10px, #1e293b 10px 20px</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Tips for Choosing Good Gradient Colors</h2>
      <p>
        The most common mistake when picking gradient colors is jumping straight across the color wheel — for
        example, blending directly from red to green. Because the midpoint of that transition passes through
        a muddy brownish-gray, the result looks unattractive even if the endpoint colors are appealing
        individually.
      </p>
      <p>
        The fix is to route through a more saturated intermediate hue. Instead of red-to-green directly,
        try red → orange → yellow-green for a vibrant transition. Alternatively, stay within an adjacent
        range of hues — the purple-to-pink family, the indigo-to-cyan family — which always produce clean
        results because the midpoint stays saturated.
      </p>
      <p>
        A few practical guidelines:
      </p>
      <ul>
        <li>Keep saturation high at both ends if you want a vivid gradient. Blending a saturated color into an unsaturated one creates an awkward dead zone in the middle.</li>
        <li>Blending different lightness values (light to dark) within the same hue family almost always looks professional and works well in UI backgrounds.</li>
        <li>Add an intermediate color stop at 50% to steer the midpoint hue — this is the single most powerful correction for muddy gradients.</li>
        <li>Limit gradients to two or three stops for most UI work. More than three stops usually looks chaotic unless you are intentionally creating a rainbow or data visualization.</li>
      </ul>

      <h2>Accessibility: Text on Gradients</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Accessibility warning:</strong> Never place text on a gradient background without checking
        contrast at every point along the gradient. A gradient that provides 7:1 contrast at the dark end
        may drop to 1.5:1 at the light end, making text illegible for users with low vision. WCAG AA
        requires a minimum 4.5:1 contrast ratio for normal text. Either use a dark overlay, restrict
        text to the high-contrast portion of the gradient, or choose a gradient range that maintains
        sufficient contrast across its entire span.
      </div>

      <h2>Using the BrowseryTools CSS Gradient Generator</h2>
      <p>
        The <a href="/tools/css-gradient">CSS Gradient Generator</a> gives you a live visual preview as you
        configure every parameter. Here is how to use it effectively:
      </p>
      <ul>
        <li><strong>Choose gradient type:</strong> Toggle between Linear, Radial, and Conic at the top of the tool.</li>
        <li><strong>Add color stops:</strong> Click the gradient bar to add new stops. Drag stops left and right to adjust their positions. Click a stop to open the color picker and change its color and opacity.</li>
        <li><strong>Adjust direction or angle:</strong> For linear gradients, drag the angle wheel or type a precise degree value. For radial gradients, set the shape and position.</li>
        <li><strong>Preview in context:</strong> The live preview updates instantly. You can see exactly how your gradient will look before copying a single line.</li>
        <li><strong>Copy the CSS:</strong> Hit the Copy CSS button to get production-ready CSS for the <code>background</code> property, ready to paste into any stylesheet or framework.</li>
      </ul>
      <p>
        Everything runs in your browser. No gradient definitions are sent anywhere — it is a pure client-side
        tool. You can use it offline once the page has loaded.
      </p>

      <h2>Browser Support</h2>
      <p>
        CSS gradients have been supported in all major browsers since 2014, making them safe to use without
        any polyfills or fallbacks in virtually every production environment. Conic gradients arrived later
        but are now fully supported in Chrome 69+, Firefox 83+, Safari 12.1+, and Edge 79+ — covering well
        over 97% of global browser usage as of 2026. The only scenario where you might need a fallback is
        supporting very old Android WebView versions in enterprise mobile applications.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Build any gradient visually — no code required
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Live preview, copy-ready CSS, and full control over stops, angles, and positions.
          Runs entirely in your browser with no data sent to any server.
        </p>
        <a
          href="/tools/css-gradient"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Open CSS Gradient Generator →
        </a>
      </div>
    </div>
  );
}
