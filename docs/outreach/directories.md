# Directory & platform submissions — DRAFTS

> **Status: nothing has been submitted.** No account has been created and no form filled on any
> platform. Everything below is a draft for the owner to submit manually.
>
> **Read before submitting anywhere:**
>
> 1. **Fix the tool count.** README says "130+", the GitHub repo description says "160+",
>    `bun run validate` says **152**. Directory reviewers open the repo.
> 2. **Two platforms have one-week waiting periods after account creation** (AlternativeTo,
>    Product Hunt). If you want to launch in a given week, register **now**.
> 3. **Product Hunt's relaunch rule is domain-scoped and six months long.** Launching anything on
>    `browserytools.com` locks the whole domain for six months. Do not spend that on a whim.
> 4. **Slant is a dead end** — see §4. Do not spend time on it.
> 5. The claim discipline is the same as everywhere else: user *content* stays on-device, but
>    ~12 tools fetch a model from a CDN on first use, the currency converter calls an external API,
>    Live Dictation uses the Web Speech API (audio goes to the browser vendor in Chrome/Edge),
>    **there is no service worker so nothing works offline**, and the hosted site runs Vercel
>    Analytics. Do not write "works offline" or "nothing ever leaves your device" in any field.
>
> **Recommended order:** privacytools.io → nouploadtools.com → SaaSHub (free tier) → AlternativeTo
> → Product Hunt (last, and only once).

---

## 1. AlternativeTo — submittable, but read the rejection warning first

**Guidelines:** <https://alternativeto.net/faq/> (the submission form itself is login-gated)

### ⚠️ Lead finding — we are named in their decline list

Their FAQ item *"Why wasn't my software / app approved?"* contains an explicit decline list that
describes this product almost exactly, verbatim:

> *"In general we do not approve apps from … basic AI tools, **simple converters, calculators,
> resizers, croppers, compressors, generators**, downloaders, counters, solvers, formatters,
> cleaners, testers, timers, estimators, online text/photo/video editors, simple file uploaders,
> **online PDF tools**, … **QR code/barcode generators and readers**, … **collections of online
> tools**, AI wrappers for LLMs … The approval of user submissions is at admins' discretion."*

And adjacently: *"we've recently updated our review rules and approval criteria. This means we now
decline more apps than before, even in cases where similar alternatives are already listed."*

**Counter-evidence:** comparable collections *are* live on the site — IT Tools, Omni Tools,
10015.io, CyberChef. Those predate the tightened rules.

**Practical read:** you get one shot, and the framing decides it. Submit as **one privacy-first
document-and-media suite positioned against Smallpdf / iLovePDF / CloudConvert**. Do **not** write
"150+ tools including converters, calculators and generators" — that sentence maps onto their
decline list word for word. Lead with the client-side architecture, which is the thing that makes
it not-just-another-converter.

### Form fields and rules

Steps: name/purpose → optional app-store import → main data → suggest alternatives.
Fields: Platforms, License, Description(s), Tags, Features, Official website URL, Creator website,
social links, icon, screenshots, Origin (country), App Type.

Hard rules from the FAQ:

- **New accounts must wait one week** after registration before submitting an app.
- **No URLs, emails, phone numbers or addresses in the description.**
- **No UTM tags on the official website link** — *"many of our users are against tracking and want
  to see a clean official URL only."* Submit `https://browserytools.com` bare.
- English only. One entry per product (no separate free/pro listings).
- Icon: squared PNG or SVG, **280x280 or bigger**, transparent background.
- Review takes "a couple of days up to a week".
- Submitting your own product is **explicitly encouraged**: *"Can you add my software to
  AlternativeTo?" → "You can add it yourself :)"*. What is banned is using your profile to
  advertise, using Lists to promote unlisted apps, and **incentivising upvotes** — *"incentivizing
  people to upvote (with discounts, gifts and so on) or, worse, creating fake accounts … may
  trigger the algorithm to drop it in the ranks or remove it from the front page entirely."*
- As the owner you can request admin rights over the listing by emailing `support@alternativeto.net`
  **from an address on the browserytools.com domain**. Do this after approval.

**Character limits: TODO(verify).** No limit is published, and the form is login-gated and
Cloudflare-blocked to bots, so the `maxlength` attributes could not be read. Draft to the lengths
below but check the counters in the live form.

### Field drafts

**Name:** `BrowseryTools`

**Tagline** (~40 chars):
```
Browser-side file tools, no upload
```

**Description** (~470 chars, no URLs per their rule):
```
BrowseryTools is a suite of document, image, and media tools that do their processing inside the browser instead of on a server. PDFs, images, audio, and video are read and rewritten on your own device, so files are never uploaded, there are no size caps, no watermarks, and no account. It also includes on-device AI tools — speech transcription, translation, summarisation, and OCR — which run local models in the browser. Open source under AGPL-3.0 and self-hostable. Available in nine languages.
```

**License:** `Open Source` (their taxonomy is: Open Source · Free with limited functionality
(Freemium) · Free for personal use · Free · Commercial). Set the SPDX identifier to **AGPL-3.0**,
which is an existing value on the site.

**Platforms:** `Online`, `Self-Hosted`

**Tags:** `pdf-tools`, `image-editing`, `file-converter`, `privacy`, `open-source`,
`no-registration`, `transcription`, `ocr` — **TODO(verify)** against their existing tag vocabulary;
use tags that already exist rather than inventing new ones.

**Icon:** `public/icon.svg` — **TODO(verify)** it renders correctly at 280x280 on a transparent
background; if not, export a PNG at 512x512.

### Alternatives — how the relationship works, and what is defensible

**The submitter proposes; the community votes; admins arbitrate.** You suggest via the app page →
"Contribute to this page" → "Suggest Alternatives". Each alternative then carries a
**"Good Alternative? Yes / No"** vote, and *"When an app receives many votes No, this is
automatically reported to administrators that will consider to remove the app from the list."*

Their justification standard, verbatim: *"An application is an alternative to another application if
its main 'task' and 'focus' is the same… The main rule is to try to imagine what a person searching
for 'alternatives to X' really is looking for."*

**That vote is the reason not to overclaim.** A listing that gets downvoted off a competitor's page
is worse than never being on it. Here is my honest read on each of the six you asked about:

| List under | Defensible? | The honest note to leave with the suggestion |
| --- | --- | --- |
| **iLovePDF** | ✅ **Yes — strongest one.** | Overlaps on merge, split, compress, rotate, reorder, watermark, sign, extract text, JPG→PDF, PDF→Word, Word→PDF. **Where we're worse:** no OCR on scanned PDFs, no PDF→Excel/PowerPoint, no batch job queue, no cloud storage integrations, no mobile app, no API. Say this. |
| **Smallpdf** | ✅ **Yes.** | Same overlap. **Where we're worse:** Smallpdf has OCR, e-sign with audit trails, Dropbox/Drive integration, and mobile apps. Our differentiator is genuinely no upload and no page limit, not feature parity. |
| **TinyPNG** | ✅ **Yes.** | Image Compression plus the ten `compress-image-to-*` target-size tools cover the same job. **Where we're worse:** TinyPNG's quantisation is better than ours on PNGs, and they have a well-supported API and Photoshop plugin. We win on no-upload and on hitting an exact KB target. |
| **remove.bg** | ⚠️ **Yes, with an explicit quality caveat.** | Background Removal runs the ISNet model locally via `@imgly/background-removal`. **Where we're worse:** remove.bg's model is better, particularly on hair, fur, and semi-transparency, and it's much faster because it's server-side. Ours downloads a model on first use and then runs on your CPU/GPU. Only suggest this if you're prepared to state that in the comment — remove.bg's page will have people who know the difference. |
| **Otter.ai** | ❌ **Do not suggest.** | Otter is a meeting-notes product: live join-the-call recording, speaker diarisation, searchable archive, summaries, team sharing, integrations. We have a file-in-transcript-out tool built on quantised whisper-base with **no diarisation, no live capture, no storage, and materially worse accuracy**. Anyone searching "alternatives to Otter.ai" is not looking for this. It would get voted down and it would be right. **If you want a transcription listing, suggest it under a file-transcription tool instead** — TODO(verify) whether AlternativeTo has pages for e.g. Happy Scribe or Whisper-based desktop apps, which is the honest peer group. |
| **Photoshop** | ❌ **Do not suggest.** | Not close, not arguably close. We have crop, resize, compress, convert, watermark, censor, colour correction, and a background remover. Photoshop is a professional raster editor with layers, masks, non-destructive editing, and a plugin ecosystem. This suggestion would be voted down immediately and would damage the credibility of the *other* five. If you want a listing in this space at all, the honest target is a **Squoosh** or **Photopea** page — TODO(verify) both exist on the site. |

**Bottom line: suggest four (iLovePDF, Smallpdf, TinyPNG, remove.bg), skip two.** Leave the
"where we're worse" note in the optional opinion comment on each. That comment is what stops the
No votes.

---

## 2. Product Hunt — one shot, domain-locked for six months. Go last.

**Guidelines:** <https://www.producthunt.com/launch/preparing-for-launch> and
<https://help.producthunt.com/en/articles/479557-how-to-post-a-product>

### The two things that decide whether to do this at all

1. **Relaunch rule is six months and root-domain scoped**
   (<https://help.producthunt.com/en/articles/484934-can-i-relaunch-my-product>): six months
   minimum between posts for the same product *or company*, **and** a "significant update"
   (*"New UIs, pricing plan changes, etc. are not considered significant updates"*). Launching one
   tool from browserytools.com burns the whole domain for six months.
2. **Their featuring guidelines list "directories or lists" as an explicitly non-featured
   category** (<https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines>).
   A 152-tool hub reads as a directory. **This is a real risk of launching, not being featured, and
   burning the six months for nothing.**

**My recommendation: don't launch the hub. If you launch at all, launch one product with one job**
— the strongest candidate is **Subtitle Studio** (`/tools/subtitle-studio`), because it's a
complete workflow (transcribe → edit → style → burn in), it's visually demoable, and "auto-captions
for reels, entirely in your browser, no watermark" is a coherent product sentence. Or wait until
you have a genuinely new flagship. Do not spend the six months on a generic collection launch.

### Field limits (verified from official pages)

| Field | Limit |
| --- | --- |
| Product name | **TODO(verify)** — no published limit. Rule is content-only: *"Only the product's name, no description or emojis."* |
| Tagline | **60 characters** |
| Description | **Conflict.** The Launch Guide says 500; the Help Center still says 260. **Write to 260.** |
| Launch tags/topics | up to **3** |
| Categories (separate taxonomy) | up to **3** |
| First comment | **TODO(verify)** — no published limit |
| Thumbnail | square, **240x240** recommended |
| Gallery | **2 images minimum**, **1270x760** recommended |
| All images | **under 3MB** |
| Video | **YouTube links only**, public |
| Shoutouts | 3 per launch |

**Do not trust third-party blog numbers** for gallery max count, aspect ratios, video length, or
the "5MB/2MB" figures — those contradict the official 3MB.

**Who can post:** no invite needed, but **wait one week after account creation**. Personal accounts
only — company/branded accounts cannot post, vote, or comment; the profile must have a real
first+last name, photo, and bio. **Self-posting is normal**: PH's own stats say 79% of featured
posts were self-hunted. **Paying a hunter is banned** and can get you permanently banned. Limit 2
hunts/day. "Launch Now" no longer exists — you **Schedule** (up to 30 days out) or save a Draft;
posts go live at 12:01 AM PST. Free and open source is fine — pick "free" in the Pricing field.

### Field drafts (Subtitle Studio framing)

**Name:** `Subtitle Studio by BrowseryTools`

**Tagline** (58 chars, inside 60):
```
Auto-caption and burn subtitles into video, in your browser
```

**Description** (256 chars, inside the conservative 260):
```
Drop in a video and get word-timed captions from a Whisper model running on your own device — no upload, no account, no watermark. Edit the cues, pick a style including TikTok-style word highlight, then export SRT/VTT or a burned-in MP4. Open source, AGPL-3.0.
```

**Topics/Categories (3):** `Video`, `Design Tools`, `Open Source` — **TODO(verify)** exact topic
names against their live taxonomy.

**Pricing:** Free

**First comment (the maker comment — this is where the honesty goes):**
```
Maker here.

I built this because every auto-caption tool I tried either wanted a
subscription, put a watermark on the export, or asked me to upload footage
I didn't want on someone else's server. Transcription now runs well enough
in a browser tab that none of that is necessary.

How it works: a Whisper model runs on-device via Transformers.js, using
WebGPU where the browser supports it and falling back to WASM. You get
word-level timings, so the TikTok-style word-highlight and karaoke caption
styles are real, not faked with per-line timing. The burn-in goes through
ffmpeg.wasm, which is vendored into the build rather than pulled from a CDN.
Any language Whisper supports, not just English.

What I want to be upfront about:

- Your video never leaves your device. But the Whisper model itself is
  downloaded once from the Hugging Face CDN on first use, then cached. The
  first run is a wait.
- On-device Whisper is less accurate than the server-side API. Clean speech
  is fine; accents, background noise, crosstalk, and technical vocabulary
  degrade faster than you'd like. Editing the cues is part of the workflow,
  not an afterthought.
- Burn-in is capped at a duration ceiling and gets slow before that, because
  ffmpeg.wasm is single-threaded. Short-form clips are the honest use case.
  SRT/VTT export has no limit and always works as a fallback.
- The burned MP4 is re-encoded to H.264, so it is not a byte-for-byte copy
  of your source quality.

It's one tool from BrowseryTools, an open-source collection of 152
browser-side utilities I maintain: github.com/aghyad97/browserytools
(AGPL-3.0). Happy to answer anything.
```

**Gallery: TODO** — you need at least 2 images at 1270x760 and a 240x240 square thumbnail. Not
drafted here; these have to be made from the real UI.

---

## 3. SaaSHub — easiest win on this page. Free, no login, no SaaS requirement.

**Guidelines:** <https://www.saashub.com/services/submit> and
<https://www.saashub.com/product-promotion>

**Does a free client-side web app qualify? Yes.** Their accepted list includes *"Websites and
services that are leaders in a specific niche"* and *"Most software products and apps"*. Live
comparable listings confirm it: **Squoosh** (*"compress and compare images… right in your
browser"*, tagged `Open Source`), **BulkPicTools** (*"no upload, 100% private"*),
**MakeMyStickers.app** (*"No signup, no watermark, no email, no trial"*). There is a dedicated
Open Source filter and `Web App` / `Tool` categories. **browserytools.com is not currently listed.**

Rejected: dev agencies, waitlist landing pages, unreleased products, **products on free subdomains**
(vercel.app etc. — we're on a custom apex domain, fine), non-English.

**Flow:** two steps, **no login required**. Step 1 is a single URL field. Step 2 auto-scrapes your
site and prefills the name and tagline from your meta description.

### Field drafts

**Product Name:** `BrowseryTools`
(Their rule: *"use the direct product name… Use 'Stripe' instead of 'Stripe Online Payment
Processor'."*)

**Tagline** — hard **250-char** limit with a live counter. Draft is 187:
```
152 browser-based tools for PDFs, images, video, text, and code that process your files on your own device instead of uploading them to a server. No account, no size caps, open source under AGPL-3.0.
```

**Categories:** pick two or three — `Web App`, `Tool`, and a PDF/file-conversion category.
**TODO(verify)** exact category names in the live form.

**Competitors:** ⚠️ **fill this in — it's the queue-jumper.** Their form says
*"Products with identified competitors will be approved first."* Suggested: `Smallpdf`,
`iLovePDF`, `TinyPNG`, `Squoosh`, `CloudConvert`, `IT Tools`, `10015.io`.

**Description** (edit form, 2000-char markdown counter, at
`https://www.saashub.com/product-changes/<slug>/new` — also no account needed):
```
BrowseryTools is a collection of 152 utilities that run entirely in the browser. PDF, image, audio, video, text, and data processing all happen on your own device — files are read with the File API and rewritten locally, so nothing is uploaded, there are no size limits, no watermarks, and no account.

**What's in it**

- **PDF** — merge, split, compress, rotate, reorder, watermark, sign, extract text, PDF to Word, Word to PDF, images to PDF
- **Image** — compress (including exact KB targets), convert, resize, crop, watermark, censor, colour correction, EXIF view and strip, background removal, favicon and OG image generation
- **Media** — video compression, video to audio, GIF maker, screen recorder, subtitle generation and burn-in
- **Text & data** — case conversion, diff, Markdown, CSV/Excel viewing, JSON/YAML/XML conversion, OCR
- **Developer** — JSON formatter, JSON to TypeScript, regex tester, cron parser, JWT decoder, SQL and HTML formatters, cURL converter, hash and UUID generators
- **On-device AI** — Whisper transcription, translation, summarisation, image captioning, upscaling, PII redaction, all via Transformers.js on WebGPU with a WASM fallback

**Honest limitations**

Your content stays on your device, but around a dozen tools download a model from a CDN on first use (Hugging Face for the AI tools, tessdata for OCR language data, a voice CDN for text-to-speech). These are cached afterwards. The currency converter calls an external exchange-rate API, and Live Dictation uses the browser's Web Speech API, which sends audio to the browser vendor. There is no service worker, so the site does not work offline. On-device transcription is slower and less accurate than server-side Whisper, and in-browser video encoding is single-threaded and practical only for short clips.

**Open source**

AGPL-3.0. Source at github.com/aghyad97/browserytools. Self-hostable as a standard Next.js app with no database and no backend service. Available in nine languages including full RTL Arabic.
```

**Also set in the edit form:** `Open Source: Yes`, the GitHub URL, and the Release Date.

**Cost and turnaround:** Free tier is up to **32 days**, end of queue, no corrections offered.
Priority+ is **$75 one-off** for ≤24h. Featured Products is **$99/month** (skip it).
**Verification is free** — confirm via an email on the browserytools.com domain or an HTML snippet
— and gets you edit control, a green badge, and a "Recently verified" homepage slot. **Do the free
verification; it's the best value on this page.**

**Bonus free channel:** guest posts (<https://www.saashub.com/site/guest-posts>) — free, no
affiliate links, must mention 2+ competitor products or be about a product you've verified.

---

## 4. Slant — **skip. Do not spend time here.**

**Guidelines:** <https://www.slant.co/help>

**Two independent reasons:**

**It's frozen.** Static assets return `last-modified: Wed, 31 Jan 2024` — no redeploy in ~2.5
years. The most recent content found anywhere is Feb 2024. `/login` returns 404 and at least one
topic page returns a 500. Every page banners *"The Slant team built an AI & it's awesome"*
pointing at Vetted.ai / lustre.ai, and the @SlantCo X bio now reads "We are now @lustre_ai". The
"as of 2026" in page titles is template-generated, not freshness.

**Their self-promotion policy is a hard blocker anyway**, verbatim:

> *"Users who have a professional relationship with a product or its competitors may not add their
> product to any question on the site, add recommendations to said product, add any Pros or Cons,
> make edits to existing content, flag content for review on those product pages, or interact in
> any way with their options or those of direct competitors outside the comment section."*

Soliciting others to do it for you is also banned. As the owner you may only edit the spec table,
add media, and comment. **There is no legitimate way for you to list this yourself.** No draft
provided.

---

## 5. No-signup / no-upload / privacy tool directories

Checked for existence and 2026 activity. Three are dead — **do not waste time on them:**
`nosignup.tools` (301s to greatstartups.com), `degoogle.org` / `tycrek/degoogle` (parked domain /
repo archived 2025-11-08), and "toolsyoucantrust" (**does not exist**).

### 5a. privacytools.io — **best fit on this page. Free, active, proven.**

**Submit at:**
<https://github.com/privacytoolsIO/privacy-tools/discussions/categories/submit-privacy-tools>
**Criteria:** <https://privacytools.io/criteria>
Email fallback: `privacytools@fire.fundersclub.com`

The queue is live with July 2026 submissions of *exactly this shape* — e.g. *"[Tool Submission]
PDFRedax - browser-based PDF redaction, no upload"*, *"HelixNotes - local, open-source Markdown
notes with no account or telemetry"*, *"CPAP Clarity - client-side, no upload, no account"*.

**Note they are all single-purpose.** Submit **1–3 flagship tools**, not the site. Best candidates:
**EXIF Remover**, **PDF tools**, **Photo Censor** (redaction).

**Draft discussion post:**

```
Title: [Tool Submission] BrowseryTools EXIF Remover — strip photo metadata
in-browser, no upload

I'm the developer, submitting my own tool.

https://browserytools.com/tools/exif-remover
Source: https://github.com/aghyad97/browserytools (AGPL-3.0)

What it does: strips EXIF metadata — GPS coordinates, camera make and
model, serial numbers, timestamps, software fingerprints — from a photo
before you share it. The file is read with the File API and rewritten in
the browser; it is never uploaded. No account, no size limit, no
watermark.

There's a companion EXIF Viewer at /tools/exif-viewer if you want to see
what's in a file before deciding, and a Photo Censor at /tools/photo-censor
for blurring, pixelating, or black-boxing regions of an image, also
client-side.

Threat model, stated plainly:

- These specific tools make no network request beyond loading the page.
  No model download, no API call.
- The site as a whole is a different story and I'd rather say it here: about
  a dozen tools elsewhere on the site (the Transformers.js AI tools, OCR,
  text-to-speech, background removal) download model files from a CDN on
  first use. The currency converter calls an exchange-rate API. Live
  Dictation uses the browser's Web Speech API, which sends audio to the
  browser vendor — that one is the odd tool out and I'm planning to remove
  or replace it.
- There is no service worker, so the site does not work offline.
- The hosted site runs Vercel Analytics. It's disclosed at
  /browserytools.com/privacy. Self-hosting removes it — it's a standard
  Next.js app with no database and no backend.

Nine locales including full RTL Arabic.
```

### 5b. nouploadtools.com — **exact niche, free, fast**

**Submit at:** <https://nouploadtools.com/submit>
Fields: name, URL, **≤120-char description**, privacy-feature checkboxes, email. Review is faster
with a public repo and genuinely client-side processing — both true here. Small directory (~31
listings) but purpose-built for exactly this.

**Description draft (118 chars, inside their 120 limit):**
```
152 browser-side tools for PDFs, images, video and text. Files are processed on your device, never uploaded. AGPL-3.0.
```

### 5c. moimikey/awesome-devtools — covered in `awesome-lists.md` §4a

Free PRs, but **individual `/tools/<slug>` links only** — their CONTRIBUTING explicitly disqualifies
"a multi-tool landing page". Good fit for the developer tools.

### 5d. pluja/awesome-privacy — **blocked by our analytics.** See `awesome-lists.md` §2a.

Their listing requirement is *"No user-tracking on project website. Only tracking listed under
Analytics allowed"*, and Vercel Analytics is not on that list. Fix the analytics first.

### 5e. Lissy93/awesome-privacy — **blocked by the 4-month release rule + no fitting category.**
See `awesome-lists.md` §2b. Also contains a hidden AI-agent fingerprinting trap in its
CONTRIBUTING — write that PR by hand.

### 5f. opensourcealternative.to — borderline, and effectively $29

**Submit at:** <https://opensourcealternative.to/submit>
Requires your email, the alternative's website + name, a **repository link**, and **the proprietary
product's name + website**. Stated criteria: open source ✅, actively maintained ✅, and *"The
project is self-hosted"* ⚠️ — reviewer's discretion for a hosted static site.
**$29 expedited (48h), or a free waitlist with a 6+ month wait.** Worth $29 only if the AlternativeTo
listing gets declined and you still want a comparison-search presence.

### 5g. openalternative.co — **paid only, as far as I can verify**

<https://openalternative.co/submit> (sign-in required). Package page shows **Standard $97 /
Premium $137 / Ultimate $197 per month**. **TODO(verify):** whether a free queued tier still
exists — no free option was visible on the live package page. At $97/month, skip.

### 5h. privacyguides.org — borderline-no for the collection

**Criteria:** <https://www.privacyguides.org/en/about/criteria/>
Two paths: tool suggestions at <https://discuss.privacyguides.net/c/site-development/suggestions>,
and developer self-submission at
<https://discuss.privacyguides.net/t/about-the-project-showcase-category/114> (must disclose
affiliation and provide a project-domain email).

They recommend one best-in-class tool per *privacy threat category*, and there is no "online
utilities" category. Their own disclaimer: *"we do not endorse anything here not listed on our
recommendations page"* — a showcase post is not a listing. **Realistic angle: a single genuinely
privacy-specific tool (EXIF removal or PDF redaction), posted to Project Showcase with affiliation
disclosed.** Do not submit the collection.

### 5i. Free Software Directory (directory.fsf.org) — **UNVERIFIED, low priority**

`directory.fsf.org` was **unreachable from the research environment** (403, then connection
refused, across repeated attempts). It is still indexed, so probably a network block rather than a
dead site, but current requirements could not be confirmed. From FSF's published pages: free FSF
web account → "Submit a new entry" → held for admin approval; MediaWiki-based; discussion on the
`directory-discuss` list (<https://directory.fsf.org/wiki/Free_Software_Directory:Participate>).

AGPLv3 is FSF-approved so licensing is not a blocker, **but** the FSD catalogues *source packages*,
not hosted websites, and the FSF's JavaScript Trap position means minified Next.js bundles would
want LibreJS web labels at `/jslicense.html`. **High effort, low return. Skip unless you
specifically want FSF standing.**

### Also checked and ruled out

`privacy.sexy` (a tool, not a directory), PrivacySpy (rates privacy *policies*; upstream repo last
pushed 2025-03-08), awesome-sysadmin (server infrastructure scope).

---

## 6. Summary — where the owner's time actually goes

| Platform | Cost | Effort | Verdict |
| --- | --- | --- | --- |
| privacytools.io | Free | 30 min | **Do this first.** Active queue, proven fit, exactly our audience. |
| nouploadtools.com | Free | 10 min | **Do this second.** Trivial effort, exact niche. |
| SaaSHub (free + verification) | Free | 45 min | **Do this third.** Fill the Competitors field to jump the queue; verify via domain email. |
| AlternativeTo | Free | 2 hrs | **Do this fourth**, framed as a suite. Register the account a week ahead. Suggest four alternatives, not six. |
| moimikey/awesome-devtools | Free | 1 hr | Worth it. Per-tool PRs. |
| privacyguides.org showcase | Free | 30 min | Single tool only. Low expected return. |
| Product Hunt | Free | 1 day + assets | **Last, and only once.** Six-month domain lock; "directories or lists" is a non-featured category. Launch one tool, not the hub — or don't. |
| opensourcealternative.to | $29 | 15 min | Only if AlternativeTo declines. |
| openalternative.co | $97/mo | — | Skip. |
| Free Software Directory | Free | High | Skip unless FSF standing matters to you. |
| Slant | — | — | **Skip.** Frozen since 2024 and owners are barred from listing themselves. |
