# Reddit — DRAFTS

> **Status: nothing has been posted.** No Reddit account has been used. Everything below is a
> draft for the owner to post manually.
>
> **Read this block before you post anywhere.**
>
> 1. **r/privacy is a DO NOT POST.** Their Rule 13 explicitly puts app-promotion posts on hold
>    *"This Includes Open-Source"*, and Rule 3 carries immediate-ban language. There is no draft
>    for it below, on purpose. See §5.
> 2. **Every draft below discloses that you are the author in the first line or two.** Do not
>    remove that. Do not reframe any of these in the third person. No "I found this cool site",
>    no alt accounts, no asking anyone to post on your behalf, no upvote requests. Reddit's
>    anti-brigading detection attaches penalties to the *domain*, which would permanently damage
>    every future post about browserytools.com — a worse version of the exact problem you're
>    trying to solve.
> 3. **Check your own account's history against the ratios.** r/webdev enforces the 9:1 rule,
>    r/InternetIsBeautiful enforces 90/10, r/opensource says "<10% of your posts". If your recent
>    Reddit activity is mostly about this project, you are already in violation and the post will
>    be removed. Go participate elsewhere first, genuinely.
> 4. **Space these out.** Do not post to five subs in one day. That pattern is itself what the
>    ratio rules are aimed at. One sub per week is fine.
> 5. **Fix the tool count first.** README says "130+", the GitHub description says "160+",
>    `bun run validate` says **152**. Reddit will check.
> 6. **Get the network story right in every draft.** User *content* stays local. But several
>    tools fetch a model on first use (Hugging Face CDN, tessdata CDN, staticimgly.com, a Piper
>    voice CDN), the currency converter calls `api.frankfurter.app`, Live Dictation uses the Web
>    Speech API (audio goes to the browser vendor in Chrome/Edge), there is **no service worker so
>    the site does not work offline**, and the site runs Vercel Analytics. Every draft below says
>    so. Do not trim those sentences to make a post punchier — r/privacy-adjacent audiences will
>    open devtools and check.
>
> **Rules verified 2026-07-31** via Wayback snapshots of `old.reddit.com/r/<sub>/about/rules`
> (reddit.com is network-blocked from the research environment). Snapshot dates given per sub.
> **Re-read the live rules page yourself before posting** — mod rules change.
>
> Reddit's global title limit is **300 characters**. No sub below documents a stricter one.

---

## Priority order

| Sub | Verdict | When |
| --- | --- | --- |
| r/SideProject | Post freely | Any time |
| r/opensource | Post, flair `Promotional` | Any time |
| r/webdev | **Saturday only**, flair `Showoff Saturday` | Saturday |
| r/degoogle | **Comment in the weekly Showcase megathread**, prefix `[DEV]` | Any day once the Saturday thread is live |
| r/selfhosted | Weak fit. Megathread comment, or Wednesday tools exception | See §6 |
| r/InternetIsBeautiful | Submit **one** tool, never the hub. Real chance of removal | See §7 |
| r/privacy | **DO NOT POST** | Never |

---

## 1. r/SideProject — ALLOWED, effectively unrestricted

**Rules:** <https://old.reddit.com/r/SideProject/about/rules> — the rules page is **empty**
(confirmed across six snapshots, 2026-06-06 through 2026-07-25). The only documented guidance is
the sidebar title format: `[Project name] - [Short description]`. No flair, no megathread, no
ratio, no open-source requirement. AutoModerator filters are not publicly inspectable, so this is
low-risk rather than zero-risk.

**Title (follows the sidebar format, 71 chars):**

```
BrowseryTools - 152 browser-based tools that never upload your files
```

**Body:**

```
I'm the developer. This is my side project — I've been building it since
February 2025 and it's now at 152 tools.

The idea: every time I needed to compress a PDF, strip EXIF off a photo,
or convert an image format, the top search result wanted me to upload the
file to someone's server and trust them. For most of these operations
there's no reason a server needs to touch the file at all. So the rule for
the project is that processing happens on your device — canvas, the File
API, WebAssembly.

What's in it: PDF tools (merge, split, compress, sign, watermark, extract
text, PDF-to-Word), image tools (compress, convert, resize, crop,
background removal, EXIF strip), media (video compression, video-to-audio,
GIF maker, subtitle burn-in), text and data tools, developer utilities
(JSON/YAML/SQL/regex/cron/JWT), and on-device AI (Whisper transcription,
translation, summarisation, OCR).

No accounts, no upload endpoint, no file size caps, no watermarks. AGPL-3.0,
source at github.com/aghyad97/browserytools. Nine languages including full
RTL Arabic.

Being straight about the caveats, because "runs in your browser" gets used
loosely:

- Your files stay local. But the AI tools download model weights from a CDN
  on first use (Hugging Face, and a few others for OCR language data and
  TTS voices). Cached after that.
- Two tools genuinely aren't local: the currency converter fetches exchange
  rates from an API, and Live Dictation uses the browser's Web Speech API,
  which in Chrome sends audio to the vendor.
- There's no service worker, so it does not work offline.
- The site runs Vercel Analytics. Disclosed on /privacy.
- On-device Whisper is slower and less accurate than the server version.
  Fine on clean English, degrades on accents and noise.
- Video encoding in the browser is single-threaded and slow. Short clips
  work; long 4K files aren't realistic.

Honest self-assessment: 152 is too many. Some of these are genuinely good
and some are a form around a regex. Consolidating is what I want to do next.

https://browserytools.com

Happy to answer anything, and I'd take feedback on which tools are worth
keeping and which are noise.
```

---

## 2. r/opensource — ALLOWED, flair **mandatory**

**Rules:** <https://old.reddit.com/r/opensource/about/rules/> (snapshot 2026-07-26)

- **Rule 4 (hard):** *"Code or repositories linked to MUST have a LICENSE file that MUST be an OSI
  listed Open Source license."* AGPL-3.0 is OSI-approved and `LICENSE` is in the repo root. ✅
- **Rule 8 (flair, mandatory):** use **`Promotional`** — *"when you are sharing a project, yours or
  otherwise."*
- **Rule 2:** *"Reddit recommends that <10% of your posts promote your content. We're a little more
  forgiving, but don't take advantage of it."*
- **Rule 3:** *"All AI-generated content is low-effort and ban worthy."* Write your own replies.
- **Rule 6:** no drive-by posting — stay in the thread and answer.

This is the **best-fit sub of the seven.** Lead with the licence choice, because that's what this
audience actually wants to discuss.

**Title (94 chars):**

```
BrowseryTools: 152 client-side browser utilities, AGPL-3.0, no upload and no backend
```

**Flair:** `Promotional`

**Body:**

```
I'm the author.

BrowseryTools is a collection of 152 utilities that run entirely
client-side: PDF, image, media, text, data, developer tools, and a set of
on-device AI tools. No accounts, no upload endpoint, no size caps.

Repo: https://github.com/aghyad97/browserytools (AGPL-3.0, LICENSE in root)
Live: https://browserytools.com

On the licence, since this is the sub where it matters: I went AGPL-3.0
rather than MIT deliberately. The failure mode for a project like this is
someone redeploying it with ads and an actual upload endpoint, which would
invert the entire point. AGPL means a hosted derivative has to publish its
source. It's cost me some adoption — I've had people say they'd have used
it in a product under MIT — and I've made peace with that.

Stack: Next.js 16, TypeScript, Tailwind, Zustand, Radix. pdf-lib and
pdf.js for PDFs, ffmpeg.wasm (self-hosted, not CDN) for media,
tesseract.js with the engine self-hosted for OCR, Transformers.js on
WebGPU with a WASM fallback for the AI tools. Nine locales including full
RTL Arabic; the locale wiring derives from a single registry so adding a
tenth is three edits.

Self-hosting is a clone, `bun install`, `bun run build`, `bun start`. No
database, no auth, no backend service — there are exactly two route
handlers and they serve llms.txt.

Where it's honest to be less flattering:

- Your content stays on-device, but several tools fetch a model on first
  use: Transformers.js pulls weights from the Hugging Face CDN, OCR pulls
  language traineddata from the tessdata CDN, TTS pulls a Piper voice
  model, background removal pulls from staticimgly.com. All cached
  afterwards, but the first run is a network request and I don't want to
  claim otherwise.
- Two tools are genuinely not local: the currency converter hits
  api.frankfurter.app, and Live Dictation uses the Web Speech API, which
  in Chrome routes audio to Google. That one is the odd tool out and I'm
  considering dropping it.
- No service worker, so no offline support.
- The hosted site runs Vercel Analytics (disclosed on /privacy). Self-host
  and that goes away.
- The test suite covers a fraction of 152 tools. That's the main thing I'd
  fix if I started over.
- Contributions: the README documents adding a tool (registry entry, page,
  component) and there's a validate script that keeps the registry and
  README in sync. There is no CONTRIBUTING.md yet, which I should fix.

Happy to talk about the client-side implementation, the WebGPU fallback,
or the AGPL decision.
```

**Before posting:** consider adding a `CONTRIBUTING.md`, since this sub will ask. The body admits
its absence, which is better than being caught, but having one is better still.

---

## 3. r/webdev — SATURDAY ONLY, flair **mandatory**

**Rules:** <https://old.reddit.com/r/webdev/about/rules> (snapshot 2026-07-16)

- **Rule 5, verbatim:** *"Sharing your project, portfolio, or any other content that you want to
  either show off or request feedback on is **limited to Showoff Saturday. If you post such content
  on any other day, it will be removed.** Posts must be tagged with the correct flair. Commercial
  promotion still falls under rule #4 and is not allowed. **Think project, not product. Focus on
  the technical details** of your project and how it's relevant to the audience of the subreddit."*
- **Flair:** `Showoff Saturday` (exact string confirmed from a Saturday snapshot). A
  `[Showoff Saturday]` title prefix is common in practice but **not required** — only the flair is.
- **Rule 3:** the **9:1 rule** is cited by name.
- **Rule 4:** *"We do not allow **any** commercial promotion or solicitation. Violations can result
  in a ban."*
- **Rule 8:** no low-effort posts, explicitly including LLM-generated content.

"Think project, not product" is the binding instruction. **Lead with the hard engineering problem,
not the tool count.** A post that opens "I built 152 tools, check it out" gets removed. This draft
opens with the PDF-to-Word table reconstruction because it is the most technically interesting
thing in the codebase and it is genuinely hard.

**Title (86 chars):**

```
Reconstructing Word tables from PDF vector geometry, entirely client-side
```

**Flair:** `Showoff Saturday`

**Body:**

```
I'm the developer of browserytools.com, an AGPL browser-tools project.
Sharing the hardest part of it because it's the bit I learned most from.

The problem: convert a PDF to an editable .docx in the browser, with no
server. Not a screenshot of the page pasted into a document — actual
headings, paragraphs, lists, and tables you can edit.

The naive approach is to take pdf.js's text layer and dump it into a docx.
That gives you a wall of text. pdf.js hands you text items with a
transform matrix each; it has no concept of a paragraph, a heading, or a
table. All of that structure has to be inferred.

What ended up working:

Headings and paragraphs come from font metrics. Cluster the text items by
font size across the whole document, take the modal size as body text, and
anything meaningfully above it is a heading candidate — then rank the
distinct larger sizes into H1/H2/H3. Bold weight breaks ties. This is
fragile on documents that use size for emphasis rather than structure, and
it's why the output is a "genuinely editable document" rather than a
faithful one.

Lists come from a prefix scan on the first glyph run of each line —
bullets, numerals with a delimiter, letters — plus an indentation check so
that a sentence starting with "1990 was" doesn't become an ordered list.

Tables are the hard part, and they come from the vector layer, not the
text layer. pdf.js exposes the page's operator list, so you can walk it
and collect the line and rectangle drawing ops. Snap those to a grid with
a tolerance, find the horizontal and vertical rulings that intersect, and
you have cell boundaries. Then assign each text item to a cell by its
transform origin.

The honest failure modes, all of which are real:

- Borderless tables have no vector rulings, so they're detected
  heuristically from column alignment and get missed or mis-split.
- Merged and spanning cells aren't supported.
- Two separate ruled tables close together on the same page sometimes get
  merged into one.
- RTL content in tables comes out with wrong column order. Paragraph-level
  RTL is fine; the table path isn't.
- Embedded images aren't carried into the docx at all yet.
- Scanned PDFs produce nothing, because there is no text layer to read.
  That has to route through OCR instead and the handoff isn't obvious
  enough in the UI.

Output goes through the `docx` library. Whole thing runs in a worker so
the main thread stays responsive on a 200-page file.

Stack context: Next.js 16, TypeScript. The rest of the project is the same
constraint applied elsewhere — ffmpeg.wasm for media, tesseract.js for OCR,
Transformers.js on WebGPU with a WASM fallback for the on-device AI tools.
Nine locales, full RTL.

Source: https://github.com/aghyad97/browserytools (AGPL-3.0)
Tool: https://browserytools.com/tools/pdf-to-word

Note on the "client-side" claim, since it gets used loosely: user content
stays on-device, but some tools fetch a model on first use (Hugging Face
CDN for the Transformers.js tools, tessdata CDN for OCR language data).
There's no service worker, so nothing works offline. The hosted site runs
Vercel Analytics.

Happy to go deeper on the operator-list walk or the heading clustering.
```

**TODO(verify):** I described the PDF-to-Word implementation from the tool's own published FAQ
copy in `src/lib/tool-content.ts` (which states the converter *"analyses the PDF's own text and
vector geometry to recover headings, paragraphs, lists, and tables"*, that ruled tables convert
reliably and borderless ones are heuristic, that merged cells aren't supported, that adjacent ruled
tables can merge, that RTL table order breaks, and that images aren't carried over). **The specific
algorithmic details I wrote — modal-font-size clustering for headings, prefix scanning for lists,
snapping vector rulings to a grid, running in a worker — are my reconstruction of how it must work,
not something I read line-by-line in `src/lib/pdf/`.** Before posting, open the actual converter
source and correct anything I got wrong. r/webdev will ask follow-up questions and a wrong technical
claim in a Showoff Saturday post is much worse than a vaguer one.

---

## 4. r/degoogle — RESTRICTED to the weekly Showcase megathread

**Rules:** <https://old.reddit.com/r/degoogle/about/rules/> — ⚠️ **the numbered rules page has no
2026 Wayback capture; best available is 2025-08-01.** The Showcase policy below is newer and
independently verified from the mod post
<https://old.reddit.com/r/degoogle/comments/1shkauy/> (April 2026, read via a 2026-05-16 snapshot).
**Re-read the live rules before posting.**

Verbatim from the mod post:

> *"Starting this Saturday (April 11th), all project promotions must go in the Degoogle Showcase
> megathread. Standalone promotion posts will be removed and redirected to the current week's
> thread."* … *"A new Showcase thread goes live every Saturday at 10:00 AM ET and stays pinned at
> the top of the sub. Devs can post their projects any day of the week once the weekly megathread
> goes live."*
>
> Requirements: *"Projects must be open source with a public repository."* ✅
> *"Projects must not depend on Google services in any way (e.g., no Google sign-in, no
> Gmail-only signup, etc.)"* ⚠️ **see the checks below**
> *"If you are affiliated with the project … please prefix your comment with `[DEV]`. Your comment
> will be held for mod review before going live."*

### Google-dependency audit — run this before posting

| Check | Status |
| --- | --- |
| Google sign-in / any auth | ✅ None. There are no accounts at all. |
| Google Fonts at runtime | ✅ Clear. `src/app/layout.tsx` uses `next/font/google`, which **self-hosts the font files at build time**. There is a comment in the file saying exactly that. No runtime request to `fonts.googleapis.com`. |
| Google Analytics / Tag Manager | ✅ Not present. The site uses **Vercel** Analytics. Disclose it anyway — this audience will find it and will respect you naming it first. |
| reCAPTCHA / AdSense / YouTube embeds | ⚠️ **TODO(verify)** — I did not exhaustively grep for embedded YouTube iframes in the blog posts. Check before posting. |
| Google Cloud / Firebase | ✅ Not in dependencies. Hosted on Vercel. |
| **Live Dictation (`/tools/speech-to-text`)** | ❌ **This is the one that will get you called out.** It uses the Web Speech API. In Chrome and Edge, that means the microphone audio is sent to the browser vendor — for Chrome, that is Google. Do **not** post to r/degoogle without addressing this. Either remove/gate the tool first, or name it explicitly in your comment. The draft below names it. |

**This is a top-level comment in the pinned "Degoogle Showcase - Week of DD Mon YYYY" thread, not
a post.**

```
[DEV] BrowseryTools — 152 browser tools that replace the Google-hosted
versions, all client-side

I'm the developer.

https://browserytools.com — https://github.com/aghyad97/browserytools (AGPL-3.0)

Mapping it to what it actually replaces, since that's the useful framing
here:

- Google Docs / Drive PDF handling → merge, split, compress, rotate,
  reorder, sign, watermark, extract text, PDF-to-Word, Word-to-PDF
- Google Translate → on-device translation via a local m2m100 model
- Google Docs voice typing / Recorder transcription → on-device Whisper
  transcription with SRT/VTT export
- Google Lens / Drive OCR → tesseract.js OCR, engine self-hosted
- Google Photos editing → crop, resize, compress, convert, watermark,
  censor, collage, EXIF strip
- Google Sheets CSV wrangling → CSV/Excel viewer, JSON↔CSV, YAML↔JSON
- Google Charts → chart builder
- Google Authenticator → TOTP code generator
- Google Keep → notepad and todo, stored in browser storage only
- YouTube-adjacent workflows → subtitle generation and burn-in,
  video-to-audio extraction, video compression

Google-dependency audit, since your rules require it:

- No Google sign-in. No accounts of any kind.
- Fonts are self-hosted at build time via next/font. No runtime request to
  fonts.googleapis.com.
- No Google Analytics, no Tag Manager, no AdSense, no reCAPTCHA.
- The hosted site does run Vercel Analytics. Not Google, but it is still
  third-party telemetry and I'd rather say it than have you find it. It's
  disclosed on /privacy, and self-hosting removes it.

One tool I have to flag rather than let you discover: Live Dictation
(/tools/speech-to-text) uses the browser's Web Speech API. In Chrome and
Edge that means the audio is processed by the browser vendor — for Chrome,
Google. It is the only tool in the project that does that and it's exactly
the wrong thing for this sub. I'm planning to either replace it with the
on-device Whisper path or drop it. Use the Audio Transcriber instead —
that one runs locally.

Two other things that are honest to say:

- Your files never get uploaded, but several tools fetch a model on first
  use: the AI tools pull weights from the Hugging Face CDN, OCR pulls
  language data from the tessdata CDN, TTS pulls a Piper voice. Cached
  after the first run. None of those are Google, but they are network
  requests.
- There's no service worker, so it doesn't work offline.

Self-hosting: clone, bun install, bun run build, bun start. No database,
no backend service.

Nine languages including full RTL Arabic.
```

---

## 5. r/privacy — **DO NOT POST. No draft provided.**

**Rules:** <https://old.reddit.com/r/privacy/about/rules/> (snapshot 2026-07-25)

> **Rule 13, verbatim:** *"R13: Requests To Post About Apps Are On Hold, This Includes Open-Source
> — Due to the constant flood of new app promotion, we're putting a hold on approving these types
> of posts for now. This is not a sub meant for advertising, nor is it an app sub, but it's being
> overrun with developers from everywhere wanting to spam their apps here."*
>
> **Rule 3, verbatim:** *"Do not attempt to use this forum to advertise or market products,
> services, websites, social media accounts, or any other venture… Violating this rule can result
> in an immediate ban without warning."*

There is no flair, no megathread, no ratio, and no open-source carve-out that makes this legal.
Rule 13 names open source explicitly to close exactly the loophole you'd want to use. This is the
highest ban risk of the seven subs and the ban is on the account, not the post.

**I have deliberately not written a draft for r/privacy.** Writing one would only make it easier
to post something that gets the account banned. If the hold is ever lifted, the substance to use
is the threat-model detail already written into the r/degoogle and r/opensource drafts above:
what stays on-device, what leaves it, which two tools are genuinely not local, and the analytics.

**The legitimate alternative for this audience** is not Reddit at all — it's
privacytools.io's submission queue and nouploadtools.com, both covered in `directories.md`. Those
are venues that *want* submissions of this exact shape.

---

## 6. r/selfhosted — weak topical fit; megathread comment or Wednesday exception only

**Rules:** <https://old.reddit.com/r/selfhosted/about/rules> (snapshot 2026-06-12)

- **Rule 1:** *"All posts must be about self-hosting."* This is the binding constraint and it is
  the problem — browserytools.com is a hosted website, and although the repo *is* self-hostable,
  the sub is about running services on your own hardware.
- **Rule 6:** *"Only in the current 'New Project Megathread', you may post projects that are
  younger than 3 months."* The project is older than 3 months (created 2025-02-18), so this
  specific gate doesn't bind — but see Rule 2.
- **Rule 2:** *"Do not spam or promote your own projects too much… **Promoted apps must be
  production ready and have docs.**"* ⚠️ **We fail the docs half.** There is no deployment
  documentation — no `bun run build && bun start` section, no reverse-proxy note, no Dockerfile,
  no env/port documentation. **Do not post here until the README has a real self-hosting section.**
- **Rule 5:** *"On Wednesdays, you may post dashboards or tools that help self-hosters provided it
  is flaired as such, even if they are not self-hosted."* This is the cleanest legal path.
- **AI gate:** an automod bot removes posts and requires a reply stating how AI was involved,
  *"even if AI is not actively involved"*, before re-approving. Expect it; answer honestly.
- Flairs observed: Official, New Project Megathread, Guide, Meta Post, Need Help, Self Help,
  Release (No AI), Docker Management, Media Serving, Business Tools, Product Announcement,
  Monitoring Tools. **TODO(verify)** the exact flair to use for the Wednesday tools exception —
  the rule says "flaired as such" without naming one.

**My recommendation: do the prerequisite work, then post a standalone Wednesday post.** Not the
megathread — a megathread comment gets ~zero visibility, and this sub is a poor enough fit that a
low-visibility post isn't worth burning the effort on. If you'd rather test the water first, drop
the same text as a top-level comment in the New Project Megathread.

**Prerequisites before posting here (all currently unmet):**

1. A `Dockerfile` + `docker-compose.yml`. This sub runs on containers; without one you are asking
   people to install Bun and run a Next.js build, which most of them won't.
2. A README "Self-hosting" section: build, run, port, reverse proxy, Node 20 minimum.
3. A tagged release, so people can pin a version.

**Title (Wednesday, 88 chars):**

```
BrowseryTools: a self-hostable set of 152 browser-side file and media tools, AGPL
```

**Body:**

```
I'm the developer.

BrowseryTools is 152 utilities that do their processing in the browser
rather than on a server — PDF merge/split/compress/sign, image convert and
compress, video compression and subtitle burn-in via ffmpeg.wasm, OCR,
format converters, developer tools, and on-device AI (Whisper
transcription, translation, summarisation) via Transformers.js.

Repo: https://github.com/aghyad97/browserytools (AGPL-3.0)
Public instance: https://browserytools.com

Why it's relevant here: the reason to self-host it isn't to keep data on
your own box — the processing already happens in the client, so your files
never hit any server, mine included. The reason is to stop depending on
my domain and on Vercel. Run it on your own box and your team gets the
whole toolset inside your network, with no third-party JS, no analytics,
and no risk of the public instance changing under you. It's a useful thing
to put behind the same reverse proxy as the rest of your stack.

Deployment: it's a Next.js app with no database, no auth, and no backend
service. Clone, `bun install`, `bun run build`, `bun start`, serve :3000.
Node 20+.

Caveats worth knowing before you deploy it:

- No service worker, so it doesn't work offline. This is a browser app,
  not a PWA.
- Around a dozen tools fetch a model on first use — the Transformers.js
  tools from the Hugging Face CDN, OCR language data from the tessdata
  CDN, TTS voices from a CDN, background removal from staticimgly.com. In
  an airgapped network those tools won't work. Everything else will.
  ffmpeg.wasm and the Tesseract engine itself are vendored into the build,
  so those are fine.
- The currency converter calls an external rates API.
- Self-hosting drops the Vercel Analytics that the public instance runs.

Nine locales including full RTL Arabic.

Happy to answer deployment questions.
```

> ⚠️ This draft claims deployment instructions that the README does not currently contain, and it
> describes a self-hosting story the repo isn't quite set up to deliver (no Dockerfile, no release
> to pin). **Do the prerequisite work first, or this post is an overclaim.**

---

## 7. r/InternetIsBeautiful — submit **one** tool, expect removal anyway

**Rules:** <https://old.reddit.com/r/InternetIsBeautiful/about/rules> (snapshot 2026-07-24)

Three rules make the *hub* unsubmittable and make even a single tool risky:

- **Rule 1:** *"Websites that are aggregates for other content are not allowed."* A 152-tool
  collection reads as an aggregate. **Do not submit browserytools.com itself.**
- **Rule 2:** sites that are "very basic (**e.g., a website with a timer or a website to take
  notes**)" are disallowed — and the project literally contains a timer and a notepad. Pick a tool
  that is visibly not trivial.
- **Rule 10:** *"submissions are not allowed if their primary content is produced by AI, or **if AI
  is used to drive functionality**."* This rules out every on-device AI tool — transcriber,
  subtitle studio, translator, summariser, upscaler, captioner, object cutout, depth map, PII
  redactor, zero-shot classifier — and arguably OCR and background removal too.
- **Rule 11:** the **90/10 rule**. *"90% of your recent participation on Reddit should have nothing
  to do with a site you own or operate."*
- **Rule 12:** nothing "aimed at businesses".
- **Rule 5:** no paid/freemium. ✅ we're free.
- **Rule 6:** nothing requiring an account/email. ✅
- **July 2026 mod post:** blanket ban on `vercel.app` subdomains (on top of Reddit's own Netlify
  ban). `browserytools.com` is a custom apex domain, so **unaffected** — but do not submit any
  preview URL.
- **TODO(verify):** the sidebar links a detailed rules wiki at `/r/InternetIsBeautiful/w/rules`
  which is not archived and which I could not read. Read it before submitting.

**What survives all of that:** a single, visual, non-AI, non-trivial tool. The best candidates are
the **Periodic Table** (`/tools/periodic-table`), the **Color Blindness Simulator**
(`/tools/color-blindness`), or the **CSS clip-path Generator** (`/tools/clip-path-generator`).
The colour-blindness simulator is the strongest: it's visual, it teaches you something, it isn't
AI, and it isn't "basic".

**Title (link post, 78 chars):**

```
A colour blindness simulator that shows any image as four types of CVD see it
```

**First comment (mandatory disclosure — post this immediately after submitting):**

```
Author here — I made this. It's one tool from browserytools.com, a free
open-source collection I maintain (AGPL-3.0,
github.com/aghyad97/browserytools).

It simulates deuteranopia, protanopia, tritanopia and achromatopsia by
applying the standard LMS colour-space transforms to your image. Runs
entirely on canvas in your browser — the image isn't uploaded anywhere,
there's no account, and there's no watermark.

It's genuinely useful if you're designing anything and want to check
whether your palette survives. Roughly 8% of men have some form of red-green
colour vision deficiency, so the answer is often no.
```

**Expect removal anyway.** Between Rule 1 and Rule 2 the mods have plenty of grounds even for a
single tool, and the sub's tolerance for developer submissions is low. Treat this as a low-cost
lottery ticket, not a channel. Do not resubmit if it's removed.

---

## What I would actually spend time on

If you only do three of these: **r/opensource**, **r/SideProject**, and the **r/degoogle Showcase
comment**. Those three are legal, well-matched, and cost you one evening each.

r/webdev is worth it *only* if you verify the PDF-to-Word technical claims first and post a real
engineering write-up. A generic "here's my tool site" post there gets removed under Rule 5's
"think project, not product" clause.

r/selfhosted and r/InternetIsBeautiful are both marginal, and r/privacy is off the table. Reddit
in general is a worse channel for this project than privacytools.io, nouploadtools.com, and the
awesome-list PRs — see `directories.md`.
