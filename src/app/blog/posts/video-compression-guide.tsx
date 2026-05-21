export default function Content() {
  return (
    <div>
      <p>
        Video files are enormous by nature. A single minute of uncompressed 1080p footage at 30 frames per second
        consumes roughly 1.5 GB of storage. Compression is not a nice-to-have — it is the only reason video on
        the internet is feasible at all. But not all compression is equal, and the wrong settings can produce a
        file that is still too large, looks noticeably degraded, or both.
      </p>
      <p>
        You can compress any video file right now using the{" "}
        <a href="/tools/compress-video">BrowseryTools Video Compressor</a> — free, no sign-up, and the entire
        process runs locally in your browser. Your footage never leaves your device.
      </p>

      <h2>Why Are Raw Video Files So Large?</h2>
      <p>
        To appreciate what compression does, you need to understand what you start with. Digital video is a
        sequence of individual frames — still images displayed in rapid succession to create the illusion of
        motion. At 1080p resolution, each frame contains 1,920 × 1,080 = 2,073,600 pixels. If each pixel
        stores color as three 8-bit channels (red, green, blue), that is roughly 6 MB per frame. At 30 fps,
        one second of uncompressed video occupies about 180 MB. One minute is over 10 GB.
      </p>
      <p>
        Raw formats like RAW, BRAW, or Apple ProRes capture video close to this uncompressed state to preserve
        maximum quality for post-production editing. Consumer formats, social media uploads, and streaming
        platforms use compressed formats where most of that data has been discarded or reconstructed — in ways
        that the human eye barely notices, if done correctly.
      </p>

      <h2>How Video Codecs Work</h2>
      <p>
        A codec (coder-decoder) is an algorithm that compresses and decompresses video data. Most modern codecs
        use two complementary techniques: spatial compression within each frame, and temporal compression
        across frames.
      </p>
      <p>
        <strong>Spatial compression</strong> works like JPEG compression for still images. It analyzes each
        frame and discards visual information that is hard for the human eye to detect — subtle color
        gradations, fine texture in uniform areas, high-frequency details in peripheral zones. This
        dramatically reduces the size of each individual frame.
      </p>
      <p>
        <strong>Temporal compression</strong> exploits the fact that consecutive video frames are usually very
        similar. Instead of storing every pixel in every frame, the codec stores a complete reference frame
        (called an I-frame or keyframe) at regular intervals, then stores only the differences — motion vectors
        and changed regions — for the frames in between (P-frames and B-frames). A clip of someone talking
        against a static background barely changes from frame to frame, so the compressed representation of
        those interstitial frames is tiny.
      </p>

      <h2>The Major Codecs Compared</h2>
      <ul>
        <li>
          <strong>H.264 (AVC)</strong> — The workhorse of the internet. Introduced in 2003 and now universally
          supported across browsers, devices, and platforms. It delivers good quality at reasonable file sizes
          and plays back on virtually every device manufactured in the last 15 years. If you need maximum
          compatibility, H.264 is the safe default.
        </li>
        <li>
          <strong>H.265 (HEVC)</strong> — The successor to H.264, delivering roughly equivalent visual quality
          at half the file size. The catch is licensing fees, which has slowed adoption. Supported natively on
          Apple devices and recent Windows hardware, but browser support is patchy. An excellent choice for
          archiving or Apple-centric workflows.
        </li>
        <li>
          <strong>VP9</strong> — Google's answer to H.265 and the codec behind YouTube. Royalty-free and
          supported in Chrome and Firefox. Compression efficiency is comparable to H.265. Commonly used for
          web delivery alongside WebM containers.
        </li>
        <li>
          <strong>AV1</strong> — The newest generation codec, developed by the Alliance for Open Media
          (Google, Netflix, Apple, and others). AV1 achieves 30–50% better compression than H.264 at the same
          quality. Royalty-free, increasingly supported in modern browsers and devices. The trade-off is very
          slow encoding — AV1 can take 10–20x longer to encode than H.264. Good for final delivery of content
          that will be watched many times; overkill for quick sharing.
        </li>
      </ul>

      <h2>Bitrate, Resolution, and Frame Rate: What Actually Controls File Size</h2>
      <p>
        Three variables determine how large a compressed video file will be:
      </p>
      <ul>
        <li>
          <strong>Bitrate</strong> — The number of bits of data stored per second of video. Higher bitrate
          means more data, better quality, larger file. A 4K YouTube upload might use 35–68 Mbps; a compressed
          web clip might use 2–5 Mbps. Bitrate is the most direct lever for controlling file size.
        </li>
        <li>
          <strong>Resolution</strong> — The pixel dimensions of the frame. Dropping from 4K (3840×2160) to
          1080p (1920×1080) reduces the pixel count by 75%, which allows either a much smaller file at the
          same bitrate or similar quality at a dramatically lower bitrate. For most web content, 1080p is
          indistinguishable from 4K at typical viewing distances and screen sizes.
        </li>
        <li>
          <strong>Frame rate</strong> — Standard content runs at 24, 25, or 30 fps. Higher frame rates
          (60 fps, 120 fps) require proportionally more data to maintain quality. Dropping from 60 fps to
          30 fps roughly halves the required bitrate for equivalent quality — a significant saving for
          videos where fluid motion is not the main attraction.
        </li>
      </ul>

      <h2>Lossless vs. Lossy Compression</h2>
      <p>
        Lossless compression reduces file size without discarding any data. The original can be perfectly
        reconstructed from the compressed file. Formats like Apple ProRes 4444, FFV1, or Huffyuv use lossless
        compression. They are dramatically smaller than raw formats but still very large compared to
        distribution formats. Lossless compression is the right choice for archival masters and editing
        workflows — not for sharing or streaming.
      </p>
      <p>
        Lossy compression achieves much higher compression ratios by permanently discarding data the encoder
        deems imperceptible. H.264, H.265, VP9, and AV1 are all lossy. Once you compress to a lossy format,
        the discarded information is gone. This is fine for distribution — the viewer never knows what was
        removed — but it matters enormously for workflows, as discussed next.
      </p>

      <h2>Generation Loss: Why Re-Compressing Degrades Quality</h2>
      <p>
        Every time you transcode (re-compress) an already-compressed lossy video, quality degrades. The first
        compression pass discards some information. The second pass works on the already-degraded version and
        discards more. By the fifth or sixth transcode, visible compression artifacts — blockiness, banding,
        smearing — accumulate noticeably. This is called generation loss, by analogy with the quality
        degradation seen when copying VHS tapes.
      </p>
      <p>
        The practical implication: always compress from the original source. Edit in a lossless or
        high-bitrate format, then compress the final export once for delivery. Never re-download a video from
        social media and re-compress it — you are starting from an already-degraded copy and making it worse.
      </p>

      <h2>Compression Targets for Common Use Cases</h2>
      <ul>
        <li>
          <strong>Email attachment</strong> — Keep under 25 MB (most email clients impose this limit). Use
          H.264 at 720p, 1–2 Mbps. For anything longer than 2–3 minutes, upload to a file sharing service
          instead and send a link.
        </li>
        <li>
          <strong>Web embedding</strong> — Aim for under 5 MB for short clips, 10–20 Mbps for longer ones.
          H.264 at 1080p is a safe universal choice. AV1 or VP9 in WebM will be smaller for browsers that
          support it.
        </li>
        <li>
          <strong>Social media</strong> — Platforms re-compress everything on their end, so upload at the
          highest quality your workflow supports within their size limits. Instagram's limit is 4 GB; TikTok's
          is 287 MB for most formats. Since the platform adds its own compression pass, starting from a
          cleaner, higher-bitrate file produces a noticeably better result after their transcode.
        </li>
        <li>
          <strong>Archival master</strong> — Use lossless (ProRes 4444, FFV1) or near-lossless (ProRes 422
          HQ) at full resolution. Storage is cheap; recreating original footage is impossible.
        </li>
      </ul>

      <h2>Practical Tips for Choosing Compression Settings</h2>
      <p>
        A few rules of thumb that consistently produce good results:
      </p>
      <ul>
        <li>
          <strong>Use CRF mode when file size is flexible.</strong> Constant Rate Factor lets the encoder vary
          the bitrate dynamically, spending more bits on complex scenes and fewer on simple ones. This produces
          better quality per file size than a fixed bitrate. For H.264, CRF 18–23 covers the range from
          near-lossless to good-enough-for-web.
        </li>
        <li>
          <strong>Match the output resolution to the delivery platform.</strong> Scaling a 4K source down to
          1080p before applying compression gives the encoder less work and produces cleaner output than
          compressing at 4K and letting the platform scale it down.
        </li>
        <li>
          <strong>Audio matters too.</strong> AAC at 128–192 kbps covers most stereo content. There is rarely
          a perceptible difference between 192 kbps and 320 kbps for dialogue and music at typical listening
          volumes, but the file size difference is real.
        </li>
        <li>
          <strong>Test before you commit.</strong> Encode a 30-second clip at your target settings and check
          it on the same type of screen and connection your audience will use. A file that looks fine on your
          editing monitor at full resolution may show artifacts on a phone screen or buffer on a slow connection.
        </li>
      </ul>
      <p>
        For quick compression without configuring a full editing environment, the{" "}
        <a href="/tools/compress-video">BrowseryTools Video Compressor</a> handles the settings for you and
        processes everything in your browser — no uploads, no waiting, no third-party access to your footage.
      </p>

      <div
        style={{
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Key takeaway:</strong> The best compression workflow is to edit in a high-quality format,
        compress once to your target format, and never re-compress the output. Pick the right codec for your
        delivery platform, match resolution to the intended screen size, and use CRF mode for quality-driven
        compression rather than chasing an arbitrary bitrate target.
      </div>
    </div>
  );
}
