import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Every &ldquo;auto-caption&rdquo; tool online works the same way: you upload your video to
        someone else&rsquo;s server, wait in a queue, and get back a captioned clip with a watermark
        stamped across it unless you pay. If you just want to <strong>add subtitles to a video for
        free</strong> — transcribe it, fix a few words, style the captions, and export — that
        watermark tax is annoying for a five-second social clip and a dealbreaker for anything you
        actually care about.
      </p>
      <ToolCTA slug="subtitle-studio" variant="inline" />
      <p>
        <a href="/tools/subtitle-studio">Subtitle Studio</a> does the whole job — transcribe, edit,
        style, export — entirely on your device. Nothing is uploaded, there is no watermark, and
        there is no length or export cap. This guide walks through the full workflow, including how
        to get TikTok-style animated captions, and is upfront about where the in-browser burn-in has
        real limits.
      </p>

      <h2>How to Auto-Caption a Video in Your Browser (Step by Step)</h2>
      <p>
        <strong>1. Upload your video.</strong> Drag in an MP4, WebM, MOV, or MKV file. It is read
        locally — the bytes never leave your machine.
        <br />
        <strong>2. Transcribe.</strong> Click transcribe and the tool runs a Whisper speech
        recognition model directly in your browser, producing word-level timestamps. The model is a
        one-time download (cached by your browser afterward); transcription itself runs on your
        device, not a server.
        <br />
        <strong>3. Edit the cues.</strong> Whisper is good, not perfect. Fix any misheard words
        directly in the cue list, nudge a cue&rsquo;s start or end time if the timing drifts, split a
        cue at the playhead if two thoughts got merged into one line, or merge two short cues back
        together.
        <br />
        <strong>4. Style the captions.</strong> Pick a font, size, and color; add an outline and an
        optional background box; choose where on the frame the captions sit; and — this is the part
        most free tools gate behind a paywall — pick an animation.
        <br />
        <strong>5. Export.</strong> Download an SRT or VTT file instantly (no re-encoding, always
        available), or burn the captions directly into the video and download a finished MP4.
      </p>

      <h2>TikTok-Style Animated Captions, Without the App</h2>
      <p>
        The bold, word-by-word captions that pop and highlight as they&rsquo;re spoken are the
        single biggest style upgrade for short-form video, and they are usually locked behind a
        subscription tier on the apps that popularized them. Subtitle Studio ships them as a built-in
        preset: <strong>TikTok Bold</strong> starts you with the heavy font, thick outline, and
        high-contrast colors that read at a glance on a phone screen, and you can layer an animation
        on top:
      </p>
      <p>
        <strong>Pop-on</strong> — each cue appears with a quick scale-in as it starts, instead of
        just cutting in.
        <br />
        <strong>Karaoke</strong> — the current word fills with your highlight color as it&rsquo;s
        spoken, sweeping across the line the way lyric videos do.
        <br />
        <strong>Word highlight</strong> — a similar effect, with each spoken word popping to the
        highlight color individually rather than sweeping.
        <br />
        There are two other presets if you want something calmer: <strong>Clean Caption</strong>{" "}
        (a simple centered line, no box) and <strong>Subtitle Bar</strong> (a classic bottom bar with
        a background), both with animation available too if you want it.
      </p>
      <p>
        Every field is adjustable on top of a preset — font, size, primary and highlight colors,
        outline width, background box, and position on a 9-point grid — so &ldquo;TikTok style&rdquo;
        is a starting point, not a locked template.
      </p>

      <h2>Why This Beats the Watermarked Free Tier</h2>
      <p>
        The free plans on the big captioning sites share three limits: your footage is uploaded to
        their servers before you see a single caption, exports are capped in length or resolution,
        and the output carries a watermark unless you upgrade. Subtitle Studio has none of those,
        because none of the work happens on a server. Transcription, editing, styling, and the MP4
        burn all run on your own hardware — the same local-first approach behind every tool on{" "}
        <a href="/">BrowseryTools</a>, explained in{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          why browser-based tools keep your data private
        </a>
        . There is no account, no watermark, and no artificial cap on how many videos you caption.
      </p>

      <h2>The Honest Limits</h2>
      <p>
        In-browser video processing runs inside real constraints, and it&rsquo;s worth knowing them
        before you rely on this for something long.
      </p>
      <p>
        <strong>The MP4 export is a re-encode, not a lossless copy.</strong> Burning captions in
        means compositing a caption layer onto every frame and re-encoding the result to H.264 —
        the source audio is copied through untouched, but the video stream is recompressed. For most
        clips this is invisible; if you need pixel-perfect fidelity, keep the source and use an SRT
        sidecar instead (more on that below).
        <br />
        <strong>The burn-in has a duration and resolution envelope.</strong> Clips comfortably burn
        up to around 10 minutes at 720p. Past 5 minutes, or at 1080p and above, you&rsquo;ll see a
        warning that it may be slow or memory-heavy — it still runs, just give it time. Past the
        10-minute mark, the tool blocks the burn outright rather than risk crashing your tab
        mid-export, and points you to the SRT/VTT download instead.
        <br />
        <strong>The first transcription downloads a model.</strong> A few hundred megabytes, once,
        cached by your browser afterward. Every transcription after that starts instantly.
        <br />
        <strong>SRT and VTT have none of these limits.</strong> Sidecar subtitle files are instant,
        exact, and available at any length or resolution — no re-encode, no envelope, no cap. If your
        footage is long-form or you just want the flexibility of a subtitle file you can hand to a
        video editor or a media player, that&rsquo;s the unlimited path. Read more on when to choose
        which in our guide to <a href="/blog/burn-subtitles-vs-srt">burned-in captions vs. SRT
        sidecars</a>.
      </p>

      <h2>Frequently Asked Questions</h2>
      <p>
        <strong>Is my video uploaded anywhere?</strong> No. Transcription, editing, styling, and
        export all happen locally in your browser.
      </p>
      <p>
        <strong>Is there a watermark?</strong> No, on any export — SRT, VTT, or the burned-in MP4.
      </p>
      <p>
        <strong>How accurate is the transcription?</strong> It&rsquo;s a Whisper model running
        on-device, which is good but not flawless — always skim the cue list, especially for names,
        jargon, or heavy background noise, and fix anything it misheard before exporting.
      </p>
      <p>
        <strong>Can I get karaoke-style word-by-word captions?</strong> Yes — pick the TikTok Bold
        preset (or any preset) and set the animation to karaoke or word highlight.
      </p>
      <p>
        <strong>Is it really free?</strong> Yes — no account, no watermark, no export limit. The
        only real constraint is the burn-in&rsquo;s duration/resolution envelope described above,
        and SRT/VTT sidestep that entirely.
      </p>

      <h2>Try It Now</h2>
      <p>
        Open <a href="/tools/subtitle-studio">Subtitle Studio</a>, drop in a clip, and go from raw
        video to styled, burned-in captions without a single upload. If you want the SRT/VTT-vs-MP4
        decision spelled out in more detail first, read{" "}
        <a href="/blog/burn-subtitles-vs-srt">burned-in captions vs. SRT sidecars</a>.
      </p>
      <ToolCTA slug="subtitle-studio" variant="card" />
    </div>
  );
}
