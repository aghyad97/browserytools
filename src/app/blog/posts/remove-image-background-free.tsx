export default function Content() {
  return (
    <div>
      <p>
        Removing a background from an image used to be a chore reserved for professional designers. Today, it takes
        about 5 seconds — and you can do it entirely in your browser, with no uploads, no account, no watermarks,
        and no cost. This guide explains how the technology works, why the popular alternatives have meaningful
        drawbacks, and how to get perfect results every time using BrowseryTools.
      </p>

      <h2>The Old Way: Photoshop and GIMP</h2>
      <p>
        For decades, removing image backgrounds meant one of two things: paying for Adobe Photoshop (currently
        $21.99/month as part of Creative Cloud) and spending time learning its selection tools, or using the free
        but notoriously complex GIMP with its steep learning curve.
      </p>
      <p>
        Even experienced Photoshop users know that a clean background removal on a detailed subject — hair, fur,
        transparent objects — can take 10 to 30 minutes of careful masking. The "Select Subject" tool improved
        things, but the manual cleanup work remained. For anyone who was not already a designer, this was simply
        not a viable option for quick tasks.
      </p>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>The real cost of Photoshop:</strong> $21.99/month means you pay $264/year just to occasionally
        remove a background from a product photo or profile picture. For most people, that is not a reasonable
        tradeoff.
      </div>

      <h2>The "Easy" Online Tools — And Their Hidden Costs</h2>
      <p>
        A wave of online background removal tools emerged to fill the gap. Remove.bg launched in 2018 and became
        wildly popular. Canva added background removal as a feature. Dozens of similar services followed.
        They solve the complexity problem — but introduce a different set of problems.
      </p>

      <h3>Remove.bg</h3>
      <p>
        Remove.bg is genuinely impressive at what it does. But the free tier gives you low-resolution previews
        only — full resolution downloads require credits that cost between $0.20 and $1.99 per image depending on
        volume. More importantly, every image you process is uploaded to their servers. Their privacy policy allows
        them to retain and process your images. For personal photos, product images containing proprietary
        information, or anything sensitive, this is a meaningful concern.
      </p>

      <h3>Canva</h3>
      <p>
        Canva's background removal is locked behind Canva Pro, which costs $12.99/month or $119.99/year. The free
        tier does not include it. Like Remove.bg, Canva processes your images on their servers, meaning your files
        are uploaded, processed remotely, and stored in their cloud infrastructure.
      </p>

      <h3>The Pattern</h3>
      <p>
        Nearly every popular online background removal tool shares the same model: upload your image, process it
        remotely, pay for quality results. Even the "free" versions come with resolution limits, watermarks,
        processing limits, or all three. And your images travel to someone else's servers every single time.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Key insight:</strong> Every time you upload an image to an online service for processing, you are
        trusting that service with your data. For personal photos, client work, or proprietary product images, that
        is a significant and often unnecessary risk.
      </div>

      <h2>The BrowseryTools Approach: AI That Runs on Your Device</h2>
      <p>
        BrowseryTools Background Removal works fundamentally differently from every service described above. The
        AI model runs entirely inside your browser using your own computer's processing power. Your images never
        leave your device.
      </p>
      <p>
        This is made possible by two technologies working together:
      </p>
      <ul>
        <li>
          <strong>@imgly/background-removal:</strong> An open-source JavaScript library that implements a
          neural network model specifically trained for background segmentation. The model is based on the RMBG
          architecture, which produces high-quality edge detection particularly around hair, fur, and complex
          shapes.
        </li>
        <li>
          <strong>ONNX Runtime Web:</strong> The Open Neural Network Exchange runtime allows machine learning
          models to run efficiently in the browser using WebAssembly and optionally WebGPU for hardware
          acceleration. This is what makes real AI inference in the browser practical — it is the same technology
          used by tools like Whisper Web and Stable Diffusion web implementations.
        </li>
      </ul>
      <p>
        The model weights are downloaded once to your browser's cache on first use, then used locally for every
        subsequent image. After that initial download, the tool works even offline.
      </p>

      <h2>Before and After: What Background Removal Looks Like</h2>

      <div style={{display: "flex", gap: "16px", margin: "28px 0", flexWrap: "wrap" as const}}>
        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: "8px", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem"}}>
              🧑
            </div>
            <div style={{width: "100%", height: "60px", background: "linear-gradient(180deg, #94a3b8 0%, #64748b 100%)", borderRadius: "0 0 12px 12px", position: "relative" as const, marginBottom: "-1px"}} />
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500}}>
            BEFORE — Original photo with busy background
          </p>
        </div>

        <div style={{display: "flex", alignItems: "center", fontSize: "2rem", fontWeight: 700, color: "#6366f1", padding: "0 8px"}}>
          →
        </div>

        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "repeating-conic-gradient(#e2e8f0 0% 25%, white 0% 50%) 0 0 / 20px 20px", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 4px 20px rgba(99,102,241,0.3)"}}>
              🧑
            </div>
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#16a34a", fontWeight: 500}}>
            AFTER — Clean transparent background
          </p>
        </div>
      </div>

      <h2>How to Remove a Background Using BrowseryTools</h2>
      <p>
        The <a href="/tools/bg-removal">BrowseryTools Background Removal tool</a> is designed to be as
        straightforward as possible. Here is the complete step-by-step process:
      </p>
      <ol>
        <li>
          <strong>Open the tool.</strong> Navigate to <a href="/tools/bg-removal">/tools/bg-removal</a>. On your
          first visit, the AI model weights will download to your browser cache. This takes 10–20 seconds depending
          on your connection and only happens once.
        </li>
        <li>
          <strong>Upload your image.</strong> Click the upload area or drag and drop your image file. Supported
          formats include JPEG, PNG, WebP, and most common image types. The file stays on your device.
        </li>
        <li>
          <strong>Wait for processing.</strong> The AI analyzes your image locally. Processing typically takes
          2–8 seconds depending on image resolution and your device's processing power. A progress indicator shows
          you where things stand.
        </li>
        <li>
          <strong>Review and download.</strong> The result appears alongside your original. If you are satisfied,
          download the PNG with a transparent background. If you want to try another image, simply upload again.
        </li>
      </ol>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Zero uploads, zero accounts:</strong> BrowseryTools processes your images entirely on your own
        device. No image data is sent to any server at any point. You do not need to create an account, verify
        an email address, or provide any personal information. Just open the tool and use it.
      </div>

      <h2>What Types of Images Work Best</h2>
      <p>
        The AI model is trained on a broad dataset, but like any model, it performs best on certain types of images.
        Understanding this helps you get consistently excellent results.
      </p>

      <h3>Excellent Results</h3>
      <ul>
        <li><strong>People and portraits:</strong> The model is particularly well-trained on human subjects. Portraits, headshots, and full-body photos with clear subject separation produce near-perfect results.</li>
        <li><strong>Product photography:</strong> Items on simple backgrounds — white, grey, or studio-lit — process very cleanly. E-commerce product images are an ideal use case.</li>
        <li><strong>Animals:</strong> Pets and animals generally work well, though heavily textured fur with a similarly-toned background can sometimes cause edge issues.</li>
        <li><strong>Vehicles and objects:</strong> Cars, furniture, and other solid objects with clear silhouettes process reliably.</li>
      </ul>

      <h3>Challenging Scenarios</h3>
      <ul>
        <li><strong>Glass and transparent objects:</strong> Wine glasses, water bottles, and other transparent items are difficult for any background removal model because the background shows through the subject itself.</li>
        <li><strong>Very fine detail:</strong> Extremely fine mesh fabric, lace, or sparse hair against a complex background may have some fringing. For critical work, a quick manual cleanup in any image editor will handle the edges.</li>
        <li><strong>Low contrast subjects:</strong> A white shirt against a white wall is genuinely hard to segment — even for humans. Provide some contrast between subject and background when possible.</li>
        <li><strong>Very low resolution images:</strong> Images smaller than 200x200 pixels may not provide enough detail for accurate segmentation.</li>
      </ul>

      <h2>Tips for Getting the Best Results</h2>
      <ul>
        <li><strong>Start with the highest resolution version you have.</strong> More pixels give the AI more information to work with, especially at edges. You can always scale down the result afterward.</li>
        <li><strong>Ensure good lighting on the subject.</strong> Even lighting with minimal shadows makes the model's job easier. Harsh shadows can sometimes be interpreted as part of the background.</li>
        <li><strong>Use a clean background when shooting.</strong> If you control the photo environment, a single-color backdrop will always produce cleaner results than a complex scene, even with AI processing.</li>
        <li><strong>Use PNG output for transparency.</strong> The downloaded result is always a PNG with a transparent background, which can be placed over any new background in any design tool.</li>
      </ul>

      <h2>Use Cases: Where Background-Free Images Actually Matter</h2>

      <h3>E-Commerce Product Photos</h3>
      <p>
        Amazon, Shopify, and most marketplaces require or strongly recommend white background product images. Instead
        of hiring a photographer with a studio setup or paying a retouching service, you can shoot products on any
        neutral surface and remove the background in seconds with BrowseryTools. Process an entire product catalog
        without uploading a single image to a third-party service.
      </p>

      <h3>Profile Pictures and Avatars</h3>
      <p>
        LinkedIn headshots, GitHub avatars, Slack profiles, and professional bios all benefit from a clean
        background. Rather than booking a studio session just for a headshot, take a good photo in decent light
        and remove the background in your browser. Add a solid color or gradient background in any editor afterward.
      </p>

      <h3>Presentations and Marketing Materials</h3>
      <p>
        Cutout images integrate cleanly with slide backgrounds, infographic layouts, and banner designs. Instead of
        searching for PNG files that already have transparent backgrounds, create your own from any photo you have.
        This is especially useful for team member photos in company presentations.
      </p>

      <h3>Social Media Content</h3>
      <p>
        Instagram posts, YouTube thumbnails, Twitter headers, and similar content often benefit from isolated
        subjects placed on branded or thematic backgrounds. A background-free version of a subject gives you total
        flexibility for creative compositions.
      </p>

      <h3>Client Work and Confidentiality</h3>
      <p>
        If you work with client images — product photos, portraits, proprietary materials — the last thing you
        want is to upload those files to a third-party server. With BrowseryTools, client images stay on your
        machine. Full stop.
      </p>

      <h2>Direct Comparison: BrowseryTools vs. the Alternatives</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Feature</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Remove.bg</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Canva Pro</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Photoshop</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Cost</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Free</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>From $0.20/image</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>$12.99/month</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>$21.99/month</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Image uploads</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>None — local only</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Yes, to their servers</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Yes, to their servers</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Local (desktop app)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Account required</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>No</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>For credits, yes</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Yes</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Yes (Adobe ID)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Full resolution output</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Yes</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Paid only</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Yes</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Yes</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Watermarks</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>None</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Free tier only</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>None</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>None</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Works offline</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Yes (after first load)</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>No</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>No</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Yes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Bulk Background Removal</h2>
      <p>
        If you have a batch of product images to process, BrowseryTools also supports bulk background removal. You
        can upload multiple images at once and process them sequentially without leaving the tool or setting up any
        batch scripts. For e-commerce sellers or content creators with large libraries, this makes the tool
        genuinely practical for real workflows — not just one-off tasks.
      </p>

      <h2>What Happens to Your Images?</h2>
      <p>
        Nothing leaves your device. When you upload an image to the BrowseryTools Background Removal tool, the
        JavaScript on the page reads the file using the browser's File API and passes it directly to the ONNX
        runtime running in a Web Worker. The segmentation model runs locally, the output PNG is generated in
        memory, and you download it. At no point does any image data travel over a network connection.
      </p>
      <p>
        You can verify this yourself by opening your browser's Network tab in Developer Tools while using the tool.
        After the initial model download, you will see zero network requests when processing an image.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Transparency by design:</strong> BrowseryTools is built on the principle that your data belongs to
        you. Browser-based AI processing is not a workaround — it is the right architectural choice for tools that
        handle personal or sensitive content.
      </div>

      <h2>Try It Right Now</h2>
      <p>
        No account. No credit card. No watermarks. No size limits on the free tier — because there is no paid tier.
        Just open the tool, drop in an image, and download a clean transparent PNG in seconds.
      </p>
      <div style={{background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Remove Image Backgrounds — Free, Private, Instant
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.9rem", color: "#64748b"}}>
          AI-powered. Runs locally. No uploads. No watermarks.
        </p>
        <a
          href="/tools/bg-removal"
          style={{background: "linear-gradient(135deg, #ec4899, #be185d)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Open Background Removal Tool →
        </a>
      </div>
    </div>
  );
}
