export default function Content() {
  return (
    <div>
      <p>
        For years, cutting an object out of a photo meant either a steady hand with the lasso tool or a paid
        subscription to a desktop editor. You would zoom in, trace the edges pixel by pixel, and still end up
        with a jagged outline and a stray bit of background clinging to the hair. The whole point of cutting
        out an object — to drop it onto a new background, build a product mockup, or make a clean sticker — got
        buried under tedious manual work. That has changed. With{" "}
        <a href="/tools/object-cutout">Object Cutout</a>, you click once on the thing you want, and an AI model
        running inside your browser figures out the exact boundary for you and hands back a transparent PNG.
      </p>

      <h2>What &ldquo;Cut Out an Object from an Image&rdquo; Really Means</h2>
      <p>
        Cutting out an object is a form of <strong>image segmentation</strong>: the computer decides which
        pixels belong to the object and which belong to everything else. Once it knows that boundary, it can
        keep the object pixels and erase the rest, leaving transparency where the background used to be. Save
        that as a PNG and you have a cutout you can paste anywhere — a clean subject with no box, no halo, and
        no leftover sky behind it. The same technique is what lets you <strong>remove an object from a
        photo</strong>: keep the background and drop the object instead.
      </p>

      <h2>How AI Image Segmentation Works Here</h2>
      <p>
        Object Cutout uses <strong>Segment Anything (SAM)</strong>, a model designed to turn a single prompt —
        in this case, a click — into a precise mask. You do not describe the object or draw around it. You just
        point at it. SAM looks at the whole image, understands where the object&rsquo;s edges are, and produces
        a pixel-accurate mask in a second or two. If it grabs too much or too little, you refine it by adding
        more points: extra clicks on the object tell it &ldquo;include this too,&rdquo; and Alt-clicks (or
        Option-clicks) mark areas to push out of the selection.
      </p>

      <h2>Step by Step</h2>
      <p>
        <strong>1. Upload your image.</strong> Drag a PNG, JPG, or WebP onto the drop zone, or click to browse.
        It renders straight onto a canvas — nothing is sent anywhere.
        <br />
        <strong>2. Click the object.</strong> A single click on the subject is usually enough. A green dot marks
        the spot.
        <br />
        <strong>3. Refine if needed.</strong> Add more green points to extend the selection, or Alt-click to drop
        a red point on anything the model wrongly included.
        <br />
        <strong>4. Cut it out.</strong> Press &ldquo;Cut out object.&rdquo; The model runs and the transparent
        result appears beside the original on a checkerboard background so you can see the transparency.
        <br />
        <strong>5. Download the PNG.</strong> One click saves a transparent PNG ready to drop into any design.
      </p>

      <h2>Everything Stays on Your Device</h2>
      <p>
        This is the part that sets a browser tool apart from the typical &ldquo;upload your photo to our
        server&rdquo; site. The SAM model downloads once from a public CDN the first time you use the tool, and
        from then on it runs entirely on your machine. Your image is read into a canvas in your browser and
        never leaves it — there is no upload, no account, and no copy sitting on someone else&rsquo;s server.
        For product photos, personal pictures, or anything confidential, that local-first approach means your
        files stay private by default.
      </p>

      <h2>Get the Best Results</h2>
      <p>
        A few habits make cutouts cleaner. Click near the center of the object rather than on an edge, so the
        model has a confident starting point. For objects that overlap busy backgrounds, add a second include
        point on a different part of the object. If a shadow or a neighboring item sneaks into the mask,
        Alt-click it to exclude it. Higher-resolution images give crisper edges, and well-lit subjects with
        clear contrast against the background segment most reliably.
      </p>
      <p>
        For the smoothest experience, use a browser with <strong>WebGPU</strong> support — Chrome or Edge —
        which lets the model run on your GPU. Other browsers still work; they fall back to a CPU (WASM) mode
        that is slower but produces the same result. Either way, the first run includes a one-time model
        download, and every run after that is fast.
      </p>

      <h2>When to Reach for It</h2>
      <p>
        Object Cutout is handy whenever you need a subject without its background: building e-commerce product
        shots, making stickers and emojis, compositing someone into a new scene, cleaning up screenshots, or
        prepping assets for a slide or a thumbnail. Because it is free, private, and runs in the browser, it
        slots into a quick workflow without the friction of installing software or signing up.
      </p>
      <p>
        Ready to try it? Open <a href="/tools/object-cutout">Object Cutout</a>, drop in an image, and click the
        object you want. The cut-out PNG is yours in seconds — no upload, no watermark, no account.
      </p>
    </div>
  );
}
