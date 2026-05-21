export default function Content() {
  return (
    <div>
      <p>
        For years, the cleanest way to make a website feel modern was the perfect rectangle: cards, hero
        banners, neat grids. Then the design pendulum swung. Organic, hand-drawn, slightly irregular shapes —
        the kind you cannot draw twice the same way — became the signature of friendly, human-feeling
        interfaces. These are blobs: smooth, closed, asymmetric shapes that sit behind headlines, frame
        avatars, and break up otherwise rigid layouts. The trouble is that drawing a good blob by hand in a
        vector editor is fiddly, and exporting clean SVG from those tools often leaves you with bloated markup.
      </p>
      <p>
        The <a href="/tools/svg-blob-generator">BrowseryTools SVG Blob Generator</a> solves this in your
        browser. It is an organic shape maker that produces a smooth, closed bézier path from a set of
        randomized points around a center, and it hands you clean, copy-paste-ready SVG. No account, no
        upload, no watermark — every shape is computed locally with a little geometry and a seeded random
        number generator.
      </p>

      <h2>What a blob actually is, under the hood</h2>
      <p>
        A blob looks freeform, but it is built from a tidy bit of math. The generator places a number of
        points at evenly spaced angles around a circle. Each point&apos;s distance from the center is then
        nudged in or out by a random amount. If you connected those points with straight lines you would get a
        jagged polygon. Instead, the tool runs them through a Catmull-Rom-to-bézier conversion, which threads
        a smooth cubic curve through every point and closes the loop. The result is the soft, pebble-like
        outline you see in the preview.
      </p>
      <p>
        Two controls shape the personality of the blob. <strong>Complexity</strong> sets how many points sit
        around the circle — fewer points give you a calm, rounded shape, more points give you a wavier,
        busier outline. <strong>Randomness</strong> controls how far each point is allowed to drift from the
        base radius — at zero you get a near-perfect circle, and as you push it up the shape becomes more
        irregular and characterful. Between those two sliders you can dial in anything from a gentle pill
        shape to a dramatic splat.
      </p>

      <h2>Solid or gradient fill</h2>
      <p>
        Color is where blobs earn their keep. A flat solid fill is great for subtle background accents — drop
        a pale blob behind a section and it adds depth without shouting. Switch to a{" "}
        <strong>gradient fill</strong> and the generator writes a real SVG <code>linearGradient</code> into
        the markup, blending your start and end colors across the shape. Gradients are what make blobs feel
        premium: pair two analogous hues for a soft glow, or two contrasting hues for a bold, energetic
        accent. Because the gradient lives inside the SVG, it scales perfectly and never pixelates.
      </p>

      <h2>Wave dividers: the second mode</h2>
      <p>
        Blobs are not the only organic shape designers reach for. Section dividers — the gentle wave that
        separates a colored hero from the white content below — are everywhere on modern marketing pages. The
        generator includes a <strong>wave divider</strong> mode that builds a smooth curve across the full
        width of the SVG and fills down to the bottom edge, giving you a ready-to-drop divider. The same
        randomness and complexity sliders apply, so you can make a barely-there ripple or a tall, rolling
        wave. Set the fill to your section&apos;s background color and the divider blends seamlessly.
      </p>

      <h2>How to use it</h2>
      <ol>
        <li>Open the <a href="/tools/svg-blob-generator">SVG Blob Generator</a> and pick a mode — blob or wave divider.</li>
        <li>Adjust complexity and randomness until the shape feels right in the live preview.</li>
        <li>Set the size, then choose a solid color or a gradient with start and end colors.</li>
        <li>Hit <strong>Regenerate</strong> as many times as you like — each press reseeds the shape, so you keep rolling until you love one.</li>
        <li>Copy the SVG markup straight into your HTML or React component, or download a <code>.svg</code> file for your design tool.</li>
      </ol>

      <h2>Why generate SVG instead of exporting PNG</h2>
      <p>
        It is tempting to screenshot a shape and ship a PNG, but SVG wins on every axis that matters. SVG is
        resolution-independent, so your blob is razor sharp on a 4K monitor and a retina phone alike. The file
        is tiny — usually a few hundred bytes of text — which keeps your pages fast. And because it is just
        markup, you can recolor it with CSS, animate it, or tweak the path by hand without re-exporting
        anything. If you ever do need a raster version, you can pass the output straight through our{" "}
        <a href="/tools/svg-png">SVG to PNG converter</a>.
      </p>

      <h2>Everything stays on your device</h2>
      <p>
        Like all <a href="/">BrowseryTools</a> utilities, the SVG Blob Generator runs entirely in your
        browser. The points, the curves, the gradient — all computed in JavaScript on your machine. Nothing
        is uploaded, nothing is logged, and there is no sign-up wall between you and a finished shape. Open
        it, generate a blob or a wave, copy the markup, and get back to designing.
      </p>
    </div>
  );
}
