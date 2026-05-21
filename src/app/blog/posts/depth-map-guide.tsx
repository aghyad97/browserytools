export default function Content() {
  return (
    <div>
      <p>
        A depth map is a grayscale image where the brightness of every pixel encodes how far that part of
        the scene is from the camera. Bright pixels are near, dark pixels are far — or the other way around,
        depending on the convention. Photographers, 3D artists, game developers, and AI tinkerers all reach
        for depth maps because they unlock a second dimension hidden inside a flat photo: parallax effects,
        fake bokeh, relighting, 3D photo conversion, and ControlNet conditioning all start with one.
      </p>
      <p>
        Historically you needed a depth sensor (a LiDAR scanner, a Kinect, a stereo camera rig) or a slow
        cloud service to get a usable depth map. That is no longer true. Modern monocular depth-estimation
        models can infer surprisingly accurate depth from a single ordinary photo, and they are now small
        enough and fast enough to run directly in a web browser. That is exactly what the{" "}
        <a href="/tools/depth-map">BrowseryTools Depth Map Generator</a> does — an AI depth estimation tool
        that turns any image into a depth map without uploading a single byte.
      </p>

      <h2>What Is a Depth Map Generator?</h2>
      <p>
        A depth map generator takes a normal RGB image and produces a new image where pixel value represents
        relative distance. The result looks like a foggy, sculpted version of the original: a person standing
        in front of a wall becomes a clear silhouette in front of a darker background, and the curves of their
        face become a smooth gradient. Because the output is just an image, you can feed it into almost any
        downstream tool — Photoshop displacement filters, Blender, Unreal Engine, Stable Diffusion ControlNet,
        or a parallax animation library.
      </p>
      <p>
        The hard part is the estimation. Inferring depth from a single 2D image is mathematically
        under-determined — there are infinitely many 3D scenes that could project to the same photo. AI models
        solve this by learning strong priors from millions of images: they know that faces are roughly convex,
        that the ground recedes toward the horizon, and that a small, sharp object in front of a blurry
        background is probably close. The result is not metrically perfect, but it is more than good enough for
        creative and design work.
      </p>

      <h2>How Image to Depth Map Conversion Works in the Browser</h2>
      <p>
        Our tool runs <strong>Depth Anything V2 (small)</strong>, a state-of-the-art monocular depth model,
        compiled to ONNX and executed with Transformers.js. When you generate a depth map, the model file
        downloads once from a CDN, gets cached on your device, and then runs entirely locally. On browsers
        that support <strong>WebGPU</strong> (recent Chrome, Edge, and Safari) it uses your GPU for a major
        speed boost; everywhere else it falls back to WebAssembly on the CPU. Either way, your photo never
        leaves the machine.
      </p>
      <p>
        The model emits a single-channel grayscale depth image at the same resolution as your input. We paint
        that onto a canvas, and you can keep it grayscale or apply a perceptual colormap such as{" "}
        <strong>inferno</strong> or <strong>viridis</strong> — the same color ramps scientists use to make
        depth and heat data easier to read. When you are happy with it, one click exports a clean PNG.
      </p>

      <h2>Why Use a Browser-Based AI Depth Estimation Tool?</h2>
      <p>
        <strong>Privacy.</strong> Depth maps are often generated from personal photos — faces, homes, products
        you have not launched yet. Uploading those to a server means trusting that server. A browser tool that
        does inference on-device removes that risk entirely. There is no upload, no account, and nothing to
        delete afterward.
      </p>
      <p>
        <strong>Cost and speed.</strong> Cloud depth APIs charge per image and add network round trips. Once
        the model is cached locally, every subsequent depth map is free and fast, even offline.
      </p>
      <p>
        <strong>No installation.</strong> You do not need Python, CUDA, a 4 GB model download, or a Hugging
        Face token. You open a web page, drop in an image, and click generate.
      </p>

      <h2>Practical Uses for Your Depth Map</h2>
      <p>
        <strong>Fake depth-of-field.</strong> Use the depth map as a mask to blur the background of a photo
        progressively, simulating an expensive lens. <strong>3D photo and parallax.</strong> Displace a flat
        image along its depth axis to create the subtle 3D wiggle popular on social media.{" "}
        <strong>ControlNet conditioning.</strong> Feed the depth map into Stable Diffusion to generate new
        images that preserve the original scene&apos;s geometry. <strong>Relighting and compositing.</strong>{" "}
        Artists use depth to add atmospheric fog, place objects at the correct distance, or drive
        displacement maps in 3D software.
      </p>

      <h2>Tips for Better Depth Maps</h2>
      <p>
        Feed the model a clear, well-lit image with an obvious foreground and background — it has the most to
        work with there. Very flat scenes (a document, a screenshot) produce flat, low-contrast depth maps
        because there genuinely is no depth. If the result looks inverted for your use case, most downstream
        tools let you invert the grayscale with one slider. And remember the output is relative depth: it is
        excellent for ordering and gradients, not for measuring real-world distances in meters.
      </p>

      <h2>Try It Now</h2>
      <p>
        Open the <a href="/tools/depth-map">Depth Map Generator</a>, drop in a photo, pick grayscale or a
        colormap, and download your depth map as a PNG. It is free, it runs entirely in your browser, and your
        images never leave your device. Pair it with our other on-device AI tools and the rest of the{" "}
        <a href="/tools">BrowseryTools toolkit</a> to build a complete, private creative workflow.
      </p>
    </div>
  );
}
