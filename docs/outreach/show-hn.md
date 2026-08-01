# Show HN — DRAFT

> **Status: nothing has been submitted.** This is a draft for the owner to review and post
> manually at <https://news.ycombinator.com/submit>.
>
> **Before posting:**
>
> 1. **Fix the tool count everywhere.** README says "130+", the GitHub repo description says
>    "160+", `bun run validate` says **152**. HN will open the repo. Make them agree first.
> 2. **Read the "Known weak spots" section below and make sure you still agree with every line.**
>    If any of it has been fixed since 2026-07-31, update the post. If any of it is worse than
>    stated, make the post worse — do not round in your own favour.
> 3. **Be at a keyboard for the next 4–6 hours.** A Show HN where the author disappears dies. The
>    comments are the launch, not the post.
> 4. Post on a weekday morning US time. Do not ask anyone to upvote — HN detects voting rings and
>    will bury the post and penalise the domain.
> 5. HN's `title` field is **80 characters max** and Show HNs are conventionally prefixed
>    `Show HN: `. Both titles below are counted.
>
> **On the "what's weak" section:** keep it. HN rewards a founder who names their own limitations
> before a commenter does, and punishes one who gets caught overclaiming. The limitations here are
> not rhetorical modesty — they are real and they are all verifiable in ten minutes by anyone who
> tries the tools.

---

## Title

**Primary (72 chars, inside the 80 limit):**

```
Show HN: BrowseryTools – 152 browser-based tools, no upload, AGPL
```

Character count: 64. (`Show HN: ` is 9 of them.)

**Alternates, if you'd rather lead with the technical hook:**

```
Show HN: 152 client-side web tools, including on-device Whisper and OCR
```
70 chars.

```
Show HN: I built 152 browser-only utilities so files never leave the device
```
74 chars.

I'd use the primary. "no upload" is the actual differentiator and "AGPL" pre-answers the first
comment. Avoid anything with "ultimate", "all-in-one", "swiss army knife", or an em-dash-heavy
value proposition — HN reads those as marketing and discounts the whole post.

**URL field:** `https://browserytools.com`
(Not the GitHub repo. Link the working thing; put the repo in the first line of the text.)

---

## Body (the text field, or your own first comment if you submit as a URL post)

> HN convention: if you submit a URL, the body goes in a *comment you post immediately after*, not
> in the text field. Either way this is the copy.

```
Hi HN. I'm the author.

BrowseryTools is a collection of 152 utilities that run entirely in the
browser — image and PDF editing, format conversion, media transcoding,
text and data tools, developer utilities, and a set of on-device AI tools.
Source: https://github.com/aghyad97/browserytools (AGPL-3.0).

The reason it exists: I kept needing to compress a PDF or strip EXIF off a
photo, and the top search results all wanted me to upload the file to a
server, wait, and then trust that they deleted it. For most of these
operations there is no technical reason a server needs to be involved at
all. Canvas, WebAssembly, and the File API can do it locally.

So the rule for the project is that your file is your file. Image, PDF,
video, audio, and text processing all happen on-device. There are no
accounts, no upload endpoint, and no per-file limits, because there is no
backend doing the work — the whole site is a static Next.js app plus two
route handlers that serve llms.txt.

Some technical notes:

- PDF work is pdf-lib and pdf.js. Merge, split, rotate, reorder, compress,
  watermark, sign, extract text.
- Video and audio go through ffmpeg.wasm, self-hosted rather than pulled
  from a CDN.
- OCR is tesseract.js with the engine self-hosted in /tesseract.
- The AI tools are Transformers.js running ONNX models on WebGPU where it
  is available, falling back to WASM. Transcription is whisper-base,
  translation is m2m100_418M, summarisation is distilbart-cnn-6-6,
  segmentation is SlimSAM, depth is Depth-Anything-v2-small.
- PDF-to-Word reconstructs headings, paragraphs, lists, and tables from
  the PDF's own text and vector geometry, then emits a .docx via the docx
  library. No model involved.
- Nine locales, including full RTL Arabic.

Things I want to be precise about, because "runs in your browser" gets
used loosely:

Your *content* stays on your device. Your files, text, images, and audio
are not uploaded. But several tools do make a network request on first
use to fetch the thing that does the processing: the Transformers.js
tools download model weights from the Hugging Face CDN, the OCR tool
fetches Tesseract language data from the tessdata CDN, text-to-speech
fetches a Piper voice model (20-60MB), and background removal pulls its
model from staticimgly.com. Those are cached by the browser afterwards.

Two tools are genuinely not local and I'd rather say so here than have
someone find out: the currency converter calls api.frankfurter.app for
exchange rates, and Live Dictation uses the Web Speech API, which in
Chrome and Edge means the audio goes to the browser vendor. That one is
the odd tool out in the whole project and I've been debating removing it.

There is also no service worker, so the site does not work offline. A
tool whose model you've already cached will keep working if you have the
page open, but you cannot load the site on a plane.

The site runs Vercel Analytics. It's disclosed on /privacy. If that's a
dealbreaker for you, the repo is AGPL and self-hosting it is a clone, a
bun install, and a bun start.

What's weak, in the order I'd fix it:

- On-device transcription is meaningfully worse than server-side Whisper.
  whisper-base is a small model and it is quantised for the browser. On
  clean English speech it's fine. On accents, noise, crosstalk, or
  technical vocabulary it degrades a lot faster than the API would, and
  it's slow — a long recording takes real minutes on a laptop.
- PDF-to-Word is structural, not visual. It gets you an editable document
  with the right headings and lists; it does not get you a pixel-faithful
  page. Borderless tables get detected heuristically and sometimes
  mis-split, merged cells aren't supported, and embedded images aren't
  carried over yet.
- Neither PDF-to-Word nor the other PDF tools do OCR on scanned PDFs.
  A scanned page has no text layer, so there is nothing to extract. You
  have to route it through the Image-to-Text tool instead, and that
  handoff is not obvious enough in the UI.
- Video is the hardest constraint. ffmpeg.wasm is single-threaded and
  slow relative to a native encoder, and the subtitle burn-in is capped
  at a duration ceiling because past that the browser tab is not a
  reasonable place to be doing this. Short-form clips are the honest use
  case; a 40-minute 4K file is not.
- The tool count is the wrong thing to be proud of and I'm aware of it.
  Some of these are excellent and some are a form wrapped around a
  regex. I'd rather have 40 that are best-in-class. Consolidating is the
  next thing I want to do and I have not done it.

What I'd do differently: I'd have built fewer tools and written tests
first. There are 152 tools and the test suite does not cover most of
them, which means every refactor is a bit of a coin flip. I'd also have
picked the file-processing abstractions earlier — a lot of tools
re-implement "take a file, do a thing, hand back a blob" slightly
differently, and unpicking that now is more work than it would have been
at tool 20.

Happy to answer anything about the browser-side implementation, the
WebGPU/WASM fallback, or where client-side processing stops being
practical.
```

---

## Likely comments, and honest answers to have ready

Do not paste these; internalise them. Getting these wrong in a thread is how a good Show HN turns
into a bad one.

**"This is just a link farm / SEO play."**
Fair challenge given 24 of the 176 routes are SEO landing variants
(`compress-image-to-100kb` and friends) pointing at the same component. Own it: those exist because
"compress image to 100kb" is what people actually search, and each one has hand-written copy
explaining why that specific limit exists. Do not pretend they're separate tools.

**"Why AGPL and not MIT?"**
Because the failure mode for a project like this is somebody redeploying it with ads and an upload
endpoint. AGPL means a hosted derivative has to publish its source. It also means a company can't
quietly fork it into an internal product without reciprocating. That is the intended effect.

**"'No upload' but you load models from a CDN and run Vercel Analytics."**
Already pre-empted in the post. Do not get defensive; the post said it first, so point back at it.

**"Squoosh / CyberChef / IT-Tools / it's-all-in-devtools already does this."**
True, per tool, and say so. Squoosh is better at image compression than we are. CyberChef is far
better at data transforms. The claim is breadth in one place with a consistent no-upload rule and
nine locales, not that each individual tool beats the best specialist.

**"WASM ffmpeg is a toy."**
For long video, agree with them. The post already concedes this.

**"How is this making money?"**
It isn't. GitHub Sponsors and a Stripe donation link, both in the README. There is no paid tier.
Say that plainly — HN respects "it doesn't" far more than a vague monetisation story.

**"Did you write this with AI?"**
Answer honestly, whatever the truth is. HN is currently very sensitive to this and a hedge reads
worse than a yes.

---

## Do not

- Do not submit and then ask anyone — friends, a Discord, a group chat — to upvote or comment.
  HN detects voting rings, and the penalty attaches to the *domain*, permanently. That is a far
  worse outcome than a post that gets 8 points.
- Do not use a second account to reply to yourself.
- Do not repost within a short window if it flops. If it genuinely got no attention (a handful of
  views, no comments), HN's own guidance permits a single repost after a day or two; more than that
  is spam.
- Do not edit the post after it's up to remove the limitations section.
