export default function Content() {
  return (
    <div>
      <p>
        The CSS <code>clip-path</code> property is one of the most expressive yet underused tools in modern
        frontend development. It lets you crop an element into any shape you want — triangles, hexagons,
        stars, speech bubbles, circles, diagonal section dividers — without a single image, SVG mask, or
        wrapper element. The browser does all the work on the GPU, the result scales perfectly at any
        resolution, and the shape can be animated and transitioned like any other CSS value. The catch is
        that writing <code>clip-path</code> by hand is painful: counting percentages for a ten-point star
        is nobody&apos;s idea of fun. That is exactly the problem a{" "}
        <a href="/tools/clip-path-generator">CSS clip-path generator</a> solves.
      </p>
      <p>
        This guide explains what <code>clip-path</code> does, walks through each shape function, shows
        real-world use cases with copy-ready code, and demonstrates how to build any shape visually with
        the <a href="/tools/clip-path-generator">BrowseryTools CSS clip-path Generator</a> by dragging
        points instead of typing coordinates.
      </p>

      <h2>What Is CSS clip-path?</h2>
      <p>
        The <code>clip-path</code> property defines a clipping region — only the part of the element inside
        the region is painted, and everything outside is hidden. Unlike <code>overflow: hidden</code>,
        which can only clip to a rectangle, <code>clip-path</code> accepts geometric shape functions that
        can describe almost any outline. The clipped element still occupies its normal box in the layout;
        only its visible pixels change.
      </p>
      <p>
        Because clipping happens at paint time, the underlying content — text, images, backgrounds, even
        videos — is fully preserved and accessible. You are not deleting content, just masking how it is
        drawn. This makes <code>clip-path</code> ideal for decorative cropping where the content beneath
        still matters for SEO and screen readers.
      </p>

      <h2>The Four Shape Functions</h2>

      <h3>1. polygon()</h3>
      <p>
        The most powerful function. You supply a list of <code>x y</code> coordinate pairs, and the browser
        connects them in order to form a closed shape. Coordinates are usually percentages relative to the
        element&apos;s box, where <code>0% 0%</code> is the top-left corner and <code>100% 100%</code> is the
        bottom-right.
      </p>
      <pre><code>{`/* Triangle pointing up */
clip-path: polygon(50% 0%, 100% 100%, 0% 100%);

/* Hexagon */
clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);

/* Diagonal section divider */
clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);`}</code></pre>

      <h3>2. circle()</h3>
      <p>
        Crops the element to a circle. You give a radius and a center position with the <code>at</code>
        keyword. A radius of <code>50%</code> centered produces a perfect inscribed circle.
      </p>
      <pre><code>{`/* Perfect circle */
clip-path: circle(50% at 50% 50%);

/* Off-center spotlight */
clip-path: circle(40% at 30% 30%);`}</code></pre>

      <h3>3. ellipse()</h3>
      <p>
        Like <code>circle()</code> but with independent horizontal and vertical radii, letting you make
        ovals that stretch to fit non-square elements.
      </p>
      <pre><code>{`clip-path: ellipse(50% 35% at 50% 50%);`}</code></pre>

      <h3>4. inset()</h3>
      <p>
        Crops a rectangular inset from each edge, with optional rounded corners via the <code>round</code>
        keyword. This is the easiest way to add rounded corners to only part of an element or to create a
        bordered window effect.
      </p>
      <pre><code>{`/* Inset 10% from each side with rounded corners */
clip-path: inset(10% 10% 10% 10% round 12%);`}</code></pre>

      <h2>Real-World Use Cases</h2>

      <h3>Angled Section Dividers</h3>
      <p>
        The diagonal &quot;swoosh&quot; between landing-page sections that designers love is a single
        polygon. No SVG, no background image:
      </p>
      <pre><code>{`.section-angled {
  clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
}`}</code></pre>

      <h3>Hexagon Avatar Grids</h3>
      <p>
        Team pages and gaming UIs frequently use hexagonal avatars. A hexagon clip on a square image
        container gives you the shape instantly, and because the image stays intact it remains crisp on
        retina screens.
      </p>

      <h3>Reveal Animations</h3>
      <p>
        Because <code>clip-path</code> is animatable, you can build dramatic reveal effects by transitioning
        between two polygons with the same number of points:
      </p>
      <pre><code>{`.reveal {
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  transition: clip-path 0.6s ease;
}
.reveal.is-visible {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}`}</code></pre>

      <h2>clip-path Shape Comparison</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Function</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Best For</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>polygon()</strong></td>
              <td style={{padding: "12px 16px"}}>Triangles, stars, dividers, custom shapes</td>
              <td style={{padding: "12px 16px"}}><code>polygon(50% 0, 100% 100%, 0 100%)</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>circle()</strong></td>
              <td style={{padding: "12px 16px"}}>Round avatars, spotlights</td>
              <td style={{padding: "12px 16px"}}><code>circle(50% at 50% 50%)</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>ellipse()</strong></td>
              <td style={{padding: "12px 16px"}}>Oval crops on wide elements</td>
              <td style={{padding: "12px 16px"}}><code>ellipse(50% 35% at 50% 50%)</code></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>inset()</strong></td>
              <td style={{padding: "12px 16px"}}>Rounded windows, edge crops</td>
              <td style={{padding: "12px 16px"}}><code>inset(10% round 12%)</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Common Mistakes</h2>
      <ul>
        <li><strong>Mismatched point counts in animations.</strong> To animate between two polygons smoothly, both must have the same number of vertices. If they differ, the transition snaps instead of morphing.</li>
        <li><strong>Forgetting the <code>-webkit-</code> prefix.</strong> Older Safari versions still require <code>-webkit-clip-path</code> alongside the standard property. Always output both.</li>
        <li><strong>Clipping interactive elements.</strong> The clipped-away area is invisible but the element&apos;s box still receives pointer events outside the visible shape unless you account for it. Test hit areas on buttons.</li>
        <li><strong>Hardcoding pixel coordinates.</strong> Use percentages so the shape scales with the element instead of breaking at different sizes.</li>
      </ul>

      <h2>Using the BrowseryTools CSS clip-path Generator</h2>
      <p>
        The <a href="/tools/clip-path-generator">CSS clip-path Generator</a> turns coordinate math into
        direct manipulation. Here is how to use it:
      </p>
      <ul>
        <li><strong>Pick a shape type:</strong> Toggle between Polygon, Circle, Ellipse, and Inset at the top.</li>
        <li><strong>Drag the vertices:</strong> In polygon mode, drag the handles on the live preview to reshape the outline, or fine-tune each point with X/Y sliders.</li>
        <li><strong>Add or remove points:</strong> Build anything from a triangle to a complex star with the add and delete controls.</li>
        <li><strong>Start from a preset:</strong> Load triangle, rhombus, pentagon, hexagon, star, message bubble, arrow, or chevron, then customise.</li>
        <li><strong>Copy the CSS:</strong> The output includes both the standard and <code>-webkit-</code> prefixed declarations, ready to paste.</li>
      </ul>
      <p>
        Everything runs entirely in your browser — no shape data is ever uploaded. The tool works offline
        once the page has loaded.
      </p>

      <h2>Browser Support</h2>
      <p>
        The <code>clip-path</code> property with basic shapes is supported in all modern browsers — Chrome,
        Firefox, Safari, and Edge — covering well over 97% of global usage. Including the
        <code>-webkit-clip-path</code> prefix covers the remaining older WebKit versions. It is safe to use
        in production today for decorative clipping.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Build any clip-path shape visually — no coordinate math
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Drag points on a live preview, choose from presets, and copy production-ready CSS.
          Runs entirely in your browser with nothing sent to a server.
        </p>
        <a
          href="/tools/clip-path-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Open CSS clip-path Generator →
        </a>
      </div>
    </div>
  );
}
