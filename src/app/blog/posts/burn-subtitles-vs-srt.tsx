import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Once you&rsquo;ve transcribed and styled a video&rsquo;s captions, you get a choice: burn
        them permanently into the video pixels, or ship them as a separate SRT or VTT file the
        player displays on top. They look similar on screen but behave completely differently once
        you export — and picking the wrong one costs you either quality, flexibility, or compatibility.
      </p>
      <ToolCTA slug="subtitle-studio" variant="inline" />
      <p>
        <a href="/tools/subtitle-studio">Subtitle Studio</a> supports both from the same edited cue
        list, so you don&rsquo;t have to commit upfront. Here&rsquo;s how to decide, and the honest
        trade-offs of each.
      </p>

      <h2>What &ldquo;Burning In&rdquo; Actually Does</h2>
      <p>
        Burned-in (a.k.a. &ldquo;hardcoded&rdquo; or &ldquo;open&rdquo;) captions are rendered
        directly onto the video frames and re-encoded into the output file. Once that&rsquo;s done,
        the captions are pixels — permanent, always visible, and impossible to turn off or translate
        without redoing the whole export. That permanence is exactly what makes them useful for
        platforms with no native caption support, like most social feeds where a clip autoplays
        muted and the viewer needs the text to already be there.
      </p>
      <p>
        The cost is that burning requires a re-encode. Subtitle Studio composites the caption layer
        onto every frame and re-encodes the result to H.264 in your browser — the source audio track
        is copied through untouched, but the video stream is recompressed, not a byte-for-byte copy
        of the original. For typical clips the visual difference is not noticeable, but it is a
        re-encode, and re-encodes take real time and browser memory.
      </p>

      <h2>What an SRT/VTT Sidecar Actually Does</h2>
      <p>
        SRT and VTT files are plain text: a list of timestamps and lines of text, nothing else. The
        original video file is never touched — no re-encode, no quality loss, no wait. A player,
        video editor, or platform that supports subtitle tracks reads the file and draws the text on
        top at playback time, which means the captions can be toggled on or off, swapped for a
        translated file, or restyled by whatever is doing the rendering. This is also why SRT/VTT
        export in Subtitle Studio is instant and has no length or resolution limit — there is no
        video processing involved at all, just formatting the cue list as text.
      </p>

      <h2>Burn It In When&hellip;</h2>
      <p>
        <strong>The platform won&rsquo;t render your subtitle track.</strong> Most short-form social
        feeds — the destinations burned-in captions were built for — don&rsquo;t reliably support
        attached SRT/VTT files, and viewers scroll past silent, uncaptioned video in under a second.
        <br />
        <strong>You want a specific visual style.</strong> A karaoke sweep, a bold TikTok-style
        highlight, a custom font and color — burned-in captions look exactly the way you designed
        them, everywhere they play, because they&rsquo;re part of the image.
        <br />
        <strong>The clip is short.</strong> Burning is a genuine re-encode with a real duration and
        resolution envelope (more below) — it&rsquo;s squarely built for the short clips that
        dominate social and marketing video, not feature-length footage.
      </p>

      <h2>Ship an SRT/VTT Sidecar When&hellip;</h2>
      <p>
        <strong>The player already supports subtitle tracks.</strong> YouTube, most video editors,
        and native &lt;video&gt; players all read SRT/VTT natively — burning in would be redundant
        re-encoding for no benefit.
        <br />
        <strong>You need the captions optional or translatable.</strong> A sidecar file can be
        toggled off, swapped for a different language, or edited later without touching the video at
        all.
        <br />
        <strong>The clip is long or high-resolution.</strong> This is the honest reason SRT/VTT
        matters beyond convenience: the in-browser burn has a real ceiling. Subtitle Studio&rsquo;s
        burn-in comfortably handles up to roughly 10 minutes at 720p; past 5 minutes, or at 1080p and
        above, it warns you it may be slow or memory-heavy; past 10 minutes, it refuses to run at all
        rather than risk crashing your browser tab mid-export. There is no such ceiling on SRT/VTT —
        export is instant and unlimited regardless of length or resolution. For a 45-minute lecture
        recording or a full-length interview, the sidecar file is not a fallback, it&rsquo;s simply
        the right tool.
        <br />
        <strong>You want zero quality loss.</strong> The source video file is never re-encoded, so
        there is nothing to lose.
      </p>

      <h2>Can You Do Both?</h2>
      <p>
        Yes, and it&rsquo;s a reasonable default: download the SRT/VTT file for the platforms and
        editors that can use it directly, and only spend the time on a burned-in MP4 for the specific
        short clip that&rsquo;s going somewhere without subtitle support. Since both exports pull
        from the same edited cue list in <a href="/tools/subtitle-studio">Subtitle Studio</a>, there&rsquo;s
        no extra transcription or editing work to duplicate them.
      </p>

      <h2>Frequently Asked Questions</h2>
      <p>
        <strong>Will burning in captions hurt my video quality?</strong> There is a re-encode, so it
        is not a pixel-identical copy, but for a normal export bitrate the difference is not visible
        to the eye. If you need guaranteed lossless output, keep the SRT/VTT route.
      </p>
      <p>
        <strong>Why does the tool warn me or block the burn sometimes?</strong> In-browser video
        encoding runs inside your browser tab&rsquo;s memory, not a server with dedicated resources.
        Long or high-resolution clips risk running out of that memory mid-export, so the tool warns
        past 5 minutes or 1080p, and blocks outright past 10 minutes to avoid a crashed export. SRT/VTT
        have no such limit.
      </p>
      <p>
        <strong>Is anything uploaded during either export?</strong> No. Both the burn-in and the
        SRT/VTT export happen entirely on your device.
      </p>
      <p>
        <strong>Can I edit an SRT file after downloading it?</strong> Yes — it&rsquo;s plain text.
        Open it in any text editor, or re-import the source video into Subtitle Studio and edit the
        cues there before re-exporting.
      </p>

      <h2>Try It Now</h2>
      <p>
        Open <a href="/tools/subtitle-studio">Subtitle Studio</a>, transcribe and edit your captions
        once, then export whichever format fits — an instant SRT/VTT sidecar or a styled, burned-in
        MP4. For the full walkthrough of transcribing, styling, and animated captions, see{" "}
        <a href="/blog/add-subtitles-to-video-free">how to add subtitles to a video for free</a>.
      </p>
      <ToolCTA slug="subtitle-studio" variant="card" />
    </div>
  );
}
