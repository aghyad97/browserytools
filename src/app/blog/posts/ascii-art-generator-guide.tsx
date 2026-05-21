export default function Content() {
  return (
    <div>
      <p>
        ASCII art is one of the oldest forms of digital expression — pictures
        built entirely from the characters on your keyboard. Long before screens
        could render millions of colors, people drew portraits, logos, and entire
        scenes using nothing but letters, numbers, and punctuation. Today it is
        having a quiet revival in terminal banners, README headers, retro UI, chat
        signatures, and code comments. The good news: you no longer need a desktop
        app or a command-line script to make it. You can turn any photo into ASCII
        art directly in your browser with the{" "}
        <a href="/tools/ascii-art">BrowseryTools ASCII Art Generator</a>.
      </p>

      <h2>What an ASCII Art Generator Actually Does</h2>
      <p>
        Converting an <strong>image to ASCII art</strong> is a process of
        controlled simplification. An image is millions of colored pixels; ASCII
        art is a much smaller grid of characters. The job of an ASCII art generator
        is to decide, for each region of the image, which single character best
        represents how light or dark that region is. A space represents the
        brightest area, while a dense character like <code>@</code> or{" "}
        <code>#</code> represents the darkest. Lined up in a grid and viewed in a
        monospace font, those characters re-form the original picture.
      </p>

      <h2>How the Conversion Works, Step by Step</h2>
      <p>
        The tool runs entirely in your browser using the HTML canvas API. Here is
        what happens when you upload an image:
      </p>
      <ol>
        <li>
          <strong>Downscale.</strong> Your image is drawn onto a small canvas whose
          width equals the number of columns you choose. Fewer columns means a more
          abstract result; more columns preserves detail but produces a larger block
          of text.
        </li>
        <li>
          <strong>Aspect correction.</strong> Monospace characters are roughly twice
          as tall as they are wide, so the tool halves the vertical resolution. This
          keeps your subject from looking stretched.
        </li>
        <li>
          <strong>Sample luminance.</strong> For every cell, the generator reads the
          pixel color with <code>getImageData</code> and computes its perceived
          brightness using the Rec. 601 formula:{" "}
          <code>0.299·R + 0.587·G + 0.114·B</code>.
        </li>
        <li>
          <strong>Map to a character.</strong> That brightness value is mapped onto a
          character ramp — an ordered string from dense to sparse — and the matching
          character is written into the grid.
        </li>
      </ol>

      <h2>Choosing a Character Ramp</h2>
      <p>
        The character set, or ramp, is the single biggest lever on how your art
        looks. The generator ships with several presets. The{" "}
        <strong>standard</strong> ramp (<code>@%#*+=-:. </code>) is a reliable
        all-rounder. The <strong>detailed</strong> ramp uses around seventy distinct
        characters for smooth tonal gradients — best for portraits and photos with
        soft lighting. The <strong>block</strong> ramp (<code>█▓▒░</code>) produces
        bold, poster-like results that read well even at small sizes. And the{" "}
        <strong>binary</strong> ramp renders everything in ones and zeros for that
        unmistakable hacker-terminal aesthetic.
      </p>

      <h2>Invert and Color</h2>
      <p>
        Two toggles change the mood of the output dramatically. <strong>Invert</strong>{" "}
        swaps light and dark, which is essential when your art will sit on a dark
        background such as a terminal — without it, the dense characters would land
        in the wrong places and the image would look like a photographic negative.
      </p>
      <p>
        <strong>Colored output</strong> keeps each character's original pixel color
        and renders the result as HTML, so you get the structure of ASCII art with
        the palette of the source photo. It is gorgeous for sunsets, neon signs, and
        logos. For pure text use — code comments, READMEs, plain-text emails — leave
        color off so you can copy clean, portable characters.
      </p>

      <h2>Three Ways to Export</h2>
      <p>
        Once you are happy with the preview, the generator gives you three exports.{" "}
        <strong>Copy</strong> drops the raw characters onto your clipboard, ready to
        paste into a terminal, a chat, or a source file. <strong>Download .txt</strong>{" "}
        saves a plain-text file you can commit to a repo or print. And{" "}
        <strong>Download PNG</strong> rasterizes the rendered art — including colors,
        if enabled — into an image you can share on social media or drop into a slide
        deck.
      </p>

      <h2>Tips for Better Results</h2>
      <ul>
        <li>
          <strong>Start with high contrast.</strong> Photos with a clear subject and
          a clean background convert far better than busy, low-contrast scenes.
        </li>
        <li>
          <strong>Tune the width.</strong> For avatars and logos, 60–100 columns is
          usually plenty. For wall-art-sized pieces, push toward 200+.
        </li>
        <li>
          <strong>Match the ramp to the medium.</strong> Use detailed ramps for
          screens that render small text crisply; use block ramps when the art will be
          viewed at a distance or in a fixed-width chat window.
        </li>
        <li>
          <strong>Crop first.</strong> Tightening the frame around your subject before
          uploading gives the generator more characters to spend on what matters.
        </li>
      </ul>

      <h2>Private by Design</h2>
      <p>
        Like every BrowseryTools utility, the ASCII art generator never uploads your
        image anywhere. The canvas, the luminance sampling, and the export all happen
        on your own device. Your photos stay yours — no accounts, no servers, no
        watermarks, and no limits. Try it now with the{" "}
        <a href="/tools/ascii-art">ASCII Art Generator</a> and turn your next image
        into text you can paste anywhere.
      </p>
    </div>
  );
}
