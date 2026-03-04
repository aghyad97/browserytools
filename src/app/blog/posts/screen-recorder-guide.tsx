import Link from 'next/link';

export default function Content() {
  return (
    <div>
      <p>
        Screen recording software has historically been one of those tools where you pay a premium for
        something that feels like it should be a basic utility. Camtasia costs around $300 as a one-time
        purchase, or $170/year on subscription. ScreenFlow for Mac runs $150. Loom — which positions
        itself as the lightweight option — limits free users to 5-minute recordings and pushes everyone
        toward a paid plan. And every single one of these tools requires installation, account creation,
        and trusting a third-party application with access to your entire screen.
      </p>
      <p>
        Here is what most people do not realize: your browser already knows how to record your screen.
        The <strong>Screen Capture API</strong> (<code>getDisplayMedia</code>) is a W3C standard that
        has been shipping in every major browser for years. The{" "}
        <Link href="/tools/screen-recorder">BrowseryTools Screen Recorder</Link> puts a clean, practical
        interface on top of it — so you can record your screen, a specific window, or a single browser
        tab without installing anything, creating an account, or paying a cent.
      </p>

      <h2>Browser Compatibility: This Works for 98%+ of Your Users</h2>
      <p>
        The Screen Capture API has broad support across all modern browsers. You do not need to worry
        about compatibility for any realistic audience:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Browser</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Minimum Version</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Release Year</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Chrome", "72+", "2019", "Full support including tab capture"],
              ["Edge", "79+", "2020", "Chromium-based; same support as Chrome"],
              ["Firefox", "66+", "2019", "Full support; great audio capture"],
              ["Safari", "13+", "2019", "Supported; tab capture added in Safari 15.4"],
            ].map(([browser, version, year, notes], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{browser}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace"}}>{version}</td>
                <td style={{padding: "11px 16px"}}>{year}</td>
                <td style={{padding: "11px 16px", opacity: 0.8}}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Combined browser market share for these versions covers well over 98% of desktop users worldwide.
        For practical purposes, if your audience uses a modern browser — which they almost certainly do
        — the Screen Capture API just works.
      </p>

      <h2>What You Can Capture</h2>
      <p>
        When you click "Start Recording," the browser displays its native screen picker. You are given
        three capture modes, and the choice matters depending on your use case:
      </p>
      <ul>
        <li>
          <strong>Entire screen:</strong> Captures everything visible on one of your monitors. Best for
          demos where you move between multiple applications, or when you want to show system-level
          behavior. Note that this shows everything — including notifications, taskbar, and any other
          windows — so close sensitive content before recording.
        </li>
        <li>
          <strong>A specific application window:</strong> Captures only one window, even if other
          windows overlap it. The recording stays focused on that application. Good for software demos
          where you want to stay in a single app without revealing your other open windows.
        </li>
        <li>
          <strong>A single browser tab:</strong> This is the most privacy-conscious option. Only the
          content of one browser tab is captured — other tabs, your address bar, other applications, and
          your desktop are completely excluded from the recording. Ideal for recording web app walkthroughs
          or browser-based demos without showing anything else.
        </li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Tab capture for maximum privacy:</strong> If you are recording a demo of a web application
        and do not want to show other browser tabs, other applications, or any system UI, use the
        "Browser Tab" option in the screen picker. Only the pixel content of that one tab is captured.
        Nothing else on your machine is visible in the recording.
      </div>

      <h2>Step-by-Step: How to Use the BrowseryTools Screen Recorder</h2>
      <p>
        The entire process takes less than a minute to get your first recording. Here is exactly how it
        works:
      </p>
      <ol>
        <li>
          <strong>Open the tool:</strong> Go to <Link href="/tools/screen-recorder">/tools/screen-recorder</Link>.
          No login, no setup, nothing to install. The tool is ready the moment the page loads.
        </li>
        <li>
          <strong>Click "Start Recording":</strong> The browser immediately shows its native screen
          picker dialog. This is a browser-level UI — the website cannot see or influence what is shown
          in this dialog, and it cannot start capturing until you explicitly confirm your selection.
        </li>
        <li>
          <strong>Choose what to capture:</strong> Select "Entire Screen," "Window," or "Browser Tab"
          from the picker tabs. Click the thumbnail of the screen/window/tab you want to record, then
          click the "Share" button to begin.
        </li>
        <li>
          <strong>Record:</strong> The tool displays a live elapsed-time counter so you always know how
          long you have been recording. Switch to whatever application or content you are demoing — the
          browser tab running the recorder stays active in the background. You can check the timer by
          glancing at the tab.
        </li>
        <li>
          <strong>Click "Stop Recording":</strong> When you are done, click Stop. The recording is
          instantly available as a video preview inside the tool. No processing, no waiting — it appears
          immediately because everything was captured locally in memory.
        </li>
        <li>
          <strong>Preview and download:</strong> Watch the preview to confirm the recording captured
          what you intended. Click "Download" to save the file as a <code>.webm</code> video to your
          local machine. The recording is never uploaded anywhere.
        </li>
      </ol>

      <h2>The Output Format: WebM</h2>
      <p>
        The Screen Capture API outputs video in the <strong>WebM</strong> format using the VP8 or VP9
        codec (depending on which your browser selects). WebM is an open, royalty-free format
        developed by Google and standardized for web use. For screencasts specifically, it has several
        advantages over MP4:
      </p>
      <ul>
        <li>
          <strong>Smaller file size:</strong> VP9 compression is highly efficient for screen content
          with large flat areas of color, text, and UI elements — exactly what screencasts contain.
          A 5-minute screencast in WebM is typically 30–50% smaller than the same recording in H.264 MP4.
        </li>
        <li>
          <strong>Open standard:</strong> No licensing fees, no royalty payments, no patent encumbrances.
          WebM is the native video format for the web.
        </li>
        <li>
          <strong>Direct browser playback:</strong> WebM plays natively in Chrome, Firefox, and Edge
          without any plugin. You can share a WebM file and anyone on those browsers can watch it directly.
        </li>
      </ul>
      <p>
        <strong>Converting WebM to MP4:</strong> If you need to share the recording with someone using
        QuickTime on macOS or Windows Media Player — or upload it to a platform that does not accept WebM
        — you can convert it for free using a local tool like{" "}
        <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer">HandBrake</a> (open
        source, local processing) or using the FFmpeg command line. The conversion takes a few seconds
        and the resulting MP4 is universally compatible.
      </p>

      <div style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6", margin: "16px 0"}}>
        <pre style={{margin: 0}}><code>{`# FFmpeg one-liner to convert WebM to MP4 (free, local, no upload needed):
ffmpeg -i recording.webm -c:v libx264 -c:a aac output.mp4`}</code></pre>
      </div>

      <h2>Use Cases: When a Browser Recorder Is Exactly What You Need</h2>

      <h3>Bug Reports</h3>
      <p>
        Describing a bug in text is one of the most frustrating experiences in software development.
        "It doesn't work when I click the button" is almost useless. A 30-second screen recording of
        the exact steps to reproduce — showing what you clicked, what happened, what should have happened
        — gives an engineer everything they need to diagnose the problem immediately. Record the bug as
        it happens, download the WebM, and attach it to the ticket. No upload to a third-party service,
        no size limits on Jira or Linear, and no privacy concerns about what was visible on your screen
        during the recording.
      </p>

      <h3>Tutorial Creation Without Heavyweight Software</h3>
      <p>
        Not every tutorial needs professional production. If you are documenting a process for your team
        — how to configure a tool, how to navigate a complex workflow, how to set up an environment —
        a screen recording with narration captures it in minutes. The BrowseryTools recorder lets you
        include microphone audio (grant the browser permission when prompted), so you can narrate while
        you work. The result is a complete, self-contained tutorial that lives in a single downloadable file.
      </p>

      <h3>Code Reviews</h3>
      <p>
        Text comments on a pull request are often insufficient for nuanced feedback. A screen recording
        where you walk through a diff verbally — "here on line 42, I am concerned about this because..." —
        is dramatically more efficient than writing a five-paragraph comment. Record a 3-minute walkthrough
        of the PR, download it, and post it as an attachment or share the file. Your reviewer gets the
        full context of your thinking without a meeting.
      </p>

      <h3>Remote Demos and Async Communication</h3>
      <p>
        Rather than scheduling a meeting to demo a feature, record it. A 2-minute recording showing the
        feature working is often more persuasive and efficient than a live demo, because it can be
        watched at any time, replayed as needed, and shared with anyone in the organization. Record your
        demo in advance, review it, and send it when it is ready. No scheduling, no time zone conflicts,
        no "can you share your screen" friction.
      </p>

      <h3>Support Tickets</h3>
      <p>
        For support teams or internal help desks, a screen recording submitted with a support ticket
        reduces back-and-forth dramatically. Instead of asking the user ten clarifying questions about
        what they were doing when the problem occurred, they record exactly what happened. The support
        agent sees the issue firsthand, often resolves it immediately, and the user gets a faster answer.
      </p>

      <h2>Audio: Including Microphone in Your Recording</h2>
      <p>
        When you start recording, the browser will ask whether to include audio. If you want to narrate
        your recording, allow microphone access when prompted. Your voice will be recorded alongside the
        screen capture in the same WebM file — no separate audio track to synchronize, no additional
        software needed.
      </p>
      <p>
        If you want to record system audio (the sounds coming from your computer — music, notification
        sounds, application audio), this is handled differently across browsers. Chrome on Windows
        allows system audio capture when recording a browser tab. On macOS, system audio capture
        requires a virtual audio device like BlackHole or Loopback, as the OS does not expose a
        system audio capture API. For most screencast use cases — where narration is the primary audio —
        microphone recording is sufficient and works consistently across all platforms.
      </p>

      <h2>Privacy: The Recording Never Leaves Your Browser</h2>
      <p>
        This is not a minor detail. The recording is stored in memory as a <code>Blob</code> object
        inside your browser tab. When you click "Download," the browser writes that blob to your local
        file system. Nothing is uploaded to any server — not BrowseryTools servers, not any cloud
        service. The recording does not transit the network at any point.
      </p>
      <p>
        This matters most when you are recording sensitive content: internal company workflows, customer
        data, unreleased product features, or anything that should not leave your machine. With
        cloud-based screen recorders, you have to trust that the provider's upload, storage, and
        access-control infrastructure is secure. With a browser-based local recorder, there is no
        upload to worry about.
      </p>

      <h2>Limitations: What the Browser Recorder Cannot Do</h2>
      <p>
        The browser-based approach is ideal for the use cases described above, but it has genuine
        limitations you should know before reaching for it in contexts where it will fall short:
      </p>
      <ul>
        <li>
          <strong>No built-in video editor:</strong> The recorder captures and downloads the raw video.
          If you need to trim the start and end, cut sections, add callouts, zoom in, or overlay text,
          you will need a separate video editor. For quick edits,{" "}
          <a href="https://www.veed.io" target="_blank" rel="noopener noreferrer">VEED.io</a> or
          the free version of DaVinci Resolve both handle basic trimming well.
        </li>
        <li>
          <strong>No webcam overlay:</strong> There is no picture-in-picture webcam feed. If you need
          a "talking head" overlay in the corner of the recording, you need desktop software like OBS
          or Camtasia.
        </li>
        <li>
          <strong>Memory constraints for very long recordings:</strong> Because the recording is
          held in browser memory until downloaded, very long recordings (45+ minutes) can consume
          significant RAM. For long-form recordings, desktop software that writes directly to disk
          as it records is more appropriate.
        </li>
        <li>
          <strong>No automatic cloud sharing:</strong> The download is a local file. If your workflow
          requires immediate cloud hosting and a shareable link, you will need to upload the file
          manually afterward, or use a service like Loom that handles hosting automatically.
        </li>
      </ul>

      <h2>When You Should Use Desktop Software Instead</h2>
      <p>
        The browser recorder is the right tool for short-to-medium recordings where simplicity and
        privacy matter. But desktop software is genuinely better when:
      </p>
      <ul>
        <li>You need to record for more than 30 minutes continuously</li>
        <li>You need a webcam overlay or multi-source composition</li>
        <li>You need to edit, add captions, zoom effects, or annotations</li>
        <li>You need to record game footage or high-frame-rate content</li>
        <li>You need automatic cloud upload and shareable links immediately after recording</li>
      </ul>
      <p>
        For those cases, OBS Studio (free, open source) is the most capable option. For editing,
        DaVinci Resolve has a generous free tier. Both require installation but offer capabilities
        that go far beyond what any browser-based tool can match.
      </p>

      <h2>Comparison: BrowseryTools vs. Common Screen Recording Options</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Feature</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Loom (Free)</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>OBS Studio</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Camtasia</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Cost", "Free", "Free / $12.50/mo", "Free", "~$300 one-time"],
              ["Installation required", "No", "Extension required", "Yes", "Yes"],
              ["Account required", "No", "Yes", "No", "Yes"],
              ["Video uploaded to cloud", "Never", "Always", "No", "No"],
              ["Recording length limit", "None*", "5 min (free)", "None", "None"],
              ["Built-in video editor", "No", "Basic trim", "No", "Yes (advanced)"],
              ["Webcam overlay", "No", "Yes", "Yes", "Yes"],
              ["Tab-only capture", "Yes", "Yes", "No", "No"],
              ["Output format", "WebM", "MP4 (cloud)", "MP4/MKV", "MP4"],
            ].map(([feature, bt, loom, obs, cam], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{loom}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{obs}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{cam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize: "13px", opacity: 0.7}}>
        * Very long recordings (&gt;45 min) may be limited by available browser memory.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Privacy note:</strong> When you use Loom, every recording is uploaded to Loom's servers
        and stored there by default. Your screen content — which may include internal tools, sensitive
        customer data, or unreleased features — lives on a third-party server. BrowseryTools recordings
        are never uploaded. The file goes from your browser directly to your hard drive.
      </div>

      <h2>Start Recording Now</h2>
      <p>
        For the vast majority of screen recording tasks — a quick bug report, a team tutorial, a
        feature demo, a code review walkthrough — the browser is all you need. No installation, no
        subscription, no privacy tradeoffs.
      </p>
      <p>
        Open the <Link href="/tools/screen-recorder">BrowseryTools Screen Recorder</Link>, click Start,
        capture what you need, and download it. The whole process from opening the tool to having a
        WebM file on your desktop takes under two minutes.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,63,94,0.1))", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🎬</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Record Your Screen Now — Free, No Install</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Capture your screen, window, or browser tab. Download as WebM. Nothing is uploaded anywhere.
          No account, no extension, no cost.
        </p>
        <Link
          href="/tools/screen-recorder"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(239,68,68)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Open Screen Recorder →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Related tools:{" "}
        <Link href="/tools/image-compression">Image Compression</Link> ·{" "}
        <Link href="/tools/bg-removal">Background Removal</Link> ·{" "}
        <Link href="/tools/image-converter">Image Converter</Link> ·{" "}
        <Link href="/">All BrowseryTools</Link>
      </p>
    </div>
  );
}
