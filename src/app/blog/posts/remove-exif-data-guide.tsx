import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Before you post that photo, send it to a stranger on a marketplace app, or upload it to a forum,
        there is something you should know: the image file almost certainly contains a hidden record of
        where you were standing when you took it, what device you used, and the exact second you pressed
        the shutter. That hidden record is called EXIF data, and removing it takes about five seconds.
        This guide explains how to <strong>remove EXIF data online</strong> and why you should make a
        habit of it.
      </p>
      <ToolCTA slug="exif-remover" variant="inline" />
      <p>
        You can <strong>strip metadata from a photo</strong> right now with the{" "}
        <a href="/tools/exif-remover">BrowseryTools EXIF Remover</a> — free, no sign-up, and the image
        never leaves your browser.
      </p>

      <h2>What Is EXIF Data and Why It Matters</h2>
      <p>
        EXIF (Exchangeable Image File Format) is a standardized block of metadata embedded inside JPEG,
        TIFF, and HEIC files. Your camera or phone writes it automatically every time you take a picture.
        It is invisible when you look at the image, but any piece of software — and any person who knows
        where to look — can read it instantly.
      </p>
      <p>
        The data is richer than most people expect. A single photo can carry:
      </p>
      <ul>
        <li>
          <strong>GPS location</strong> — latitude and longitude accurate to a few meters, sometimes with
          altitude and compass direction. This is the part that matters most for privacy.
        </li>
        <li><strong>Device make and model</strong> — for example "Apple iPhone 15 Pro" or "Canon EOS R5".</li>
        <li><strong>Date and time</strong> — the precise timestamp the photo was captured, down to the second.</li>
        <li><strong>Camera settings</strong> — aperture, shutter speed, ISO, focal length, flash status.</li>
        <li><strong>Software and serial numbers</strong> — editing app used, and on some cameras the body serial number.</li>
      </ul>

      <h2>The Real Privacy Risk: GPS Location</h2>
      <p>
        The single biggest reason to <strong>strip the GPS location from a photo</strong> is that it can
        pinpoint your home, your child&apos;s school, or your workplace. When you photograph something
        inside your house and post it online, the embedded coordinates can reveal your exact address —
        even if you never mention where you live. There are well-documented cases of people being located
        through nothing more than the GPS tag in a casually shared image.
      </p>
      <p>
        Many large social networks strip EXIF on upload, but not all of them, and not always. Marketplace
        listings, email attachments, cloud links, messaging apps that send &quot;original quality,&quot;
        and direct file shares frequently preserve the full metadata. The only way to be sure is to remove
        it yourself before the file leaves your device.
      </p>

      <h2>How to Remove EXIF Data Online</h2>
      <p>
        The cleanest way to strip metadata in the browser is to <em>re-encode the pixels</em>. When an image
        is drawn onto an HTML canvas and exported again, the browser writes a brand-new file containing only
        the pixel data — none of the original EXIF header survives. That is exactly how the BrowseryTools
        EXIF Remover works:
      </p>
      <ol>
        <li>Drop one or more photos into the tool (JPEG and PNG are supported, and batch cleaning is built in).</li>
        <li>The tool reads and <strong>displays the metadata it finds</strong> — including GPS coordinates, camera, and timestamp — so you can see exactly what would have leaked.</li>
        <li>It re-encodes the image through a canvas, dropping every metadata tag.</li>
        <li>You download a clean copy. A side-by-side &quot;before vs after&quot; view confirms the data is gone.</li>
      </ol>
      <p>
        Because everything runs locally in JavaScript, your photos are never uploaded to a server. That is
        the right model for privacy work: the tool that is supposed to protect your data should never see
        it leave your machine.
      </p>

      <h2>Inspect Before You Strip</h2>
      <p>
        If you just want to <em>see</em> what a photo reveals without modifying it, use the companion{" "}
        <a href="/tools/exif-viewer">EXIF Viewer</a> tool. It lays out camera settings, timestamps, and
        GPS coordinates with a map link, so you understand precisely what is embedded. For a deeper
        explanation of the privacy implications and real-world cases, read our guide on{" "}
        <a href="/blog/exif-data-guide">what your photos reveal about you</a>.
      </p>

      <h2>Does Removing EXIF Hurt Image Quality?</h2>
      <p>
        Stripping metadata does not touch the visible image meaningfully. Re-encoding a JPEG at high quality
        (the EXIF Remover uses 92%) is visually lossless for sharing purposes, and PNG files are re-encoded
        losslessly. The file size often changes slightly — sometimes smaller, because thumbnails and other
        embedded extras are also discarded. What you lose is exactly what you wanted to lose: the hidden
        data, not the picture.
      </p>

      <h2>Build the Habit</h2>
      <p>
        Removing EXIF data is one of those small privacy habits with an outsized payoff. It costs you a few
        seconds and protects you from a class of risk most people never think about. Before you share a
        photo of your home, your kids, an item you&apos;re selling, or anything taken at a location you
        don&apos;t want public, run it through the{" "}
        <a href="/tools/exif-remover">EXIF Remover</a> first. Clean file out, hidden data gone, nothing
        uploaded anywhere.
      </p>
      <ToolCTA slug="exif-remover" variant="card" />
    </div>
  );
}
