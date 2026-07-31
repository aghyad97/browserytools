# Scaling on-page tool content to 176 tools

Written alongside the addition of `whyClientSide` and `limitations` to `ToolContentLocale`
and the authoring of eight pilot entries. This is an assessment, not a plan of record.

## Where we actually are

| | count |
|---|---|
| Tool slugs in `tools-config.ts` | 176 |
| Slugs with a hand-authored entry in `tool-content.ts` | 54 |
| Slugs falling back to `buildFallbackContent` | 122 |

The fallback emits one paragraph of the tool's own config description, one paragraph of
site boilerplate, and three questions that are byte-identical across all 122 pages except
for the tool name.

## Where templated content reads as thin — and worse

### 1. The boilerplate makes a privacy claim about tools that process no data

`stopwatch`, `timer`, `pomodoro`, `world-clock`, `keyboard-tester`, `gamepad-tester`,
`webcam-test`, `mic-test`, `typing-test`, `emoji-picker`, `random-picker`,
`wheel-of-names`, `periodic-table`.

The fallback tells the reader that "your data is never uploaded to a server" on a page
whose tool has no data. It isn't false, it's non-responsive — the textual equivalent of
answering a question nobody asked. A human reading `/tools/stopwatch` learns nothing;
an LLM summarising the page has nothing to extract but the site's marketing line.

### 2. Local-storage apps, where the template omits the one thing that matters

`todo`, `habit-tracker`, `expense-tracker`, `notepad`, `spreadsheet`, `invoice`,
`prompt-library`, `mind-map`, `signature-maker`.

"Your data is never uploaded" is true and is also a trap. These tools persist to this
browser's storage. Clear site data, switch browsers, switch devices, or use a private
window and the work is gone — there is no sync, no account recovery, and no backup.
That sentence is the single most important thing on those nine pages and the template
does not contain it. This is the cluster where the absence of a `limitations` field is
closest to being a user-harm issue rather than an SEO issue.

### 3. On-device AI tools, where the template tells none of the actual story

`image-upscaler`, `image-captioner`, `depth-map`, `object-cutout`, `text-summarizer`,
`translator`, `sentiment-analyzer`, `zero-shot-classifier`, `pii-redactor`,
`image-to-text`, `speech-to-text`, `text-to-speech`.

Every one of these downloads model weights from a third-party CDN on first use, runs a
model materially smaller than the hosted equivalent, is slow or fails outright when it
falls back from WebGPU to WASM, and can exhaust memory on a phone. The fallback says
"runs entirely in your browser — your data is never uploaded to a server." That is
defensible but incomplete: the page is silent about a several-hundred-megabyte download
from `huggingface.co`, and a careful reader will notice the gap and trust the rest of the
page less. This is the highest-priority cluster after the pilot.

### 4. ffmpeg.wasm / codec-bound media tools

`video`, `audio`, `compress-video`, `gif-maker`, `video-to-audio`, `file-converter`,
`heic-to-jpg`, `heic-to-png`, `screen-recorder`, `subtitle-studio`.

The honest story is: dramatically slower than native, memory-bound, and what actually
decodes depends on the browser's codec support rather than on us. None of that is
templatable, and all of it is what determines whether the tool works for a given visitor.

### 5. Security-adjacent tools, where confident boilerplate is a liability

`password-generator`, `password-strength`, `text-encryption`, `hash-generator`,
`jwt-decoder`, `totp-generator`, `pii-redactor`, `exif-remover`, `photo-censor`.

Precision matters more here than anywhere else. Does `jwt-decoder` verify signatures or
only decode? Does `photo-censor` destroy the underlying pixels or composite an overlay
that can be lifted back off? What is `pii-redactor`'s recall, and is it safe to use as the
only check before publishing a document? Wrong or vague answers on these pages are not
thin content, they are content that gets someone hurt. They should not be left on the
template.

### 6. Deterministic converters — thin, but harmlessly so

`text-case`, `text-repeater`, `text-sorter`, `roman-numeral`, `number-base-converter`,
`morse-code`, `unix-timestamp`, `uuid-generator`, `text-binary`, `url-encoder`,
`yaml-json`, `json-csv`, `json-to-ts`, `markdown-html`, `markdown-table`,
`html-formatter`, `sql-formatter`, `css-minifier`, `code-format`, `chmod`,
`http-status`, `lorem-ipsum`, `aspect-ratio`, `percentage-calculator`, `tip-calculator`,
`bmi-calculator`, `age-calculator`, `contrast-checker`, `cubic-bezier`, `css-shadow`,
`css-gradient`, `glassmorphism-generator`, `svg-blob-generator`.

Roughly 33 slugs where the output is fully determined by the input: no model, no codec,
no persistence, no upload decision, no gap between what the name promises and what the
tool does. The template is thin on these and that is fine — there is genuinely not much to
say. See "lighter treatment" below for what they should get instead.

### 7. The `compress-*` landing family is a structural duplicate-content problem

`compress-image-to-20kb`, `-to-50kb`, `-to-100kb`, `-to-200kb`, `-to-500kb`, `-to-1mb`,
`compress-jpeg-to-50kb`, `-to-100kb`, `-to-200kb`, `compress-signature-20kb`.

All ten render the same `ImageCompression` component with a different `targetKb` preset,
and all ten already have bespoke entries. Their `whyClientSide` and `limitations` will be
near-identical by construction — the same encoder has the same weaknesses at every target
size. Ten URLs whose differentiating content is a number is exactly the pattern that reads
as doorway pages. Either each one earns its page by answering its own specific question
with real numbers ("what actually survives at 20 KB, and when should you stop trying"), or
they should be consolidated behind one canonical page with a size selector. Copying the
`image-compression` limitations onto all ten is the outcome to avoid.

## Which tools must get hand-written copy

Ranked by how load-bearing the honest limitations are.

**Tier A — safety or correctness depends on the copy being right (~30 slugs).**
The security cluster (§5), the local-storage apps (§2), `sign-pdf`, `watermark-pdf`,
`extract-text-from-pdf`. On these pages a reader can be materially misled by a confident
generality.

**Tier B — the tool is genuinely differentiated and the trade-off is the product (~25 slugs).**
All the on-device AI tools (§3) and all the ffmpeg-backed media tools (§4). These are also
the pages with the most defensible claims: nobody else can honestly say "the model came to
your file." That advantage evaporates if the same page won't admit the model is small.

**Tier C — remaining PDF workbench surface (~7 slugs).**
`split-pdf`, `rotate-pdf`, `reorder-pdf-pages`, `jpg-to-pdf` and neighbours. Several
already have entries; they need the same audit the pilot got. The pilot found two
fabrications in existing hand-written copy (`merge-pdf` described drag-to-reorder that the
UI does not have; `json-formatter` claimed syntax highlighting in a plain textarea) and one
in `qr-generator` (custom colours and logo overlay, neither of which exists). Assume the
other 46 existing entries contain a similar rate of drift and budget a re-read.

That is roughly 62 slugs on top of the 54 already authored — call it 116 hand-written and
60 templated. Not 176 hand-written. There is no honest way to write 176 distinctive pages
and no reason to try.

## Which tools are fine with a lighter templated treatment

The §6 deterministic converters, plus the trivial-state utilities in §1 — about 45 slugs.

What makes them different is specific: their behaviour is fully specified by their name,
they hold nothing, they fetch nothing, and there is no failure mode a user could be
surprised by. A reader arriving at `/tools/roman-numeral` has no unanswered question that
prose can resolve.

But "lighter" should mean *different*, not *the same but shorter*:

1. **Omit `limitations` entirely.** The field must never be templated. A generated
   limitation is an invented constraint stated with the same confidence as a verified one,
   which is strictly worse than silence. The current implementation enforces this — the
   fallback emits no `limitations` and the component renders nothing when the array is
   absent.
2. **Split the fallback in two.** Tools that process user data get the current privacy
   paragraph. Tools that process nothing — a stopwatch, a colour picker, a keyboard tester
   — should get a fallback that says what the tool does and stops, instead of a privacy
   assurance about data that does not exist.
3. **Stop emitting `FAQPage` JSON-LD for fallback content.** 122 URLs currently carry
   near-identical `FAQPage` markup — same three questions, same three answers, one
   substituted noun. Google has been suppressing FAQ rich results for non-authoritative
   sites since 2023, so the upside is close to zero, while near-duplicate structured data
   across 122 URLs is a real pattern-detection risk. Keep `SoftwareApplication` and
   `BreadcrumbList`, which are accurate and non-duplicative. This is the single cheapest
   improvement available and it is a deletion.

## Cost of expanding `ToolContentLocale` from `{en, ar}` to all 9 locales

**Recommendation: no. Not now, and not in this shape.**

The arithmetic. A hand-authored entry currently runs 500–800 words per locale once
`intro`, `whyClientSide`, `limitations`, five FAQ items and steps are counted. At the ~116
hand-written slugs projected above, seven additional locales is roughly **116 × 7 × 650 ≈
530,000 words** of translation, all of it product-technical, much of it about failure modes
where a mistranslation is a false claim rather than an awkward phrase. Machine translation
is not adequate for the `limitations` field specifically: "the output can be larger than
the input" and "the output may be larger than the input" are different promises.

The maintenance cost is worse than the creation cost. Every limitation discovered later —
and the pilot found several by reading code that had been shipped for months — has to be
re-propagated to nine files. In practice the non-English locales drift, and a page that
tells a French reader something the English page has already corrected is a worse outcome
than a page that shows them English.

The file structure would also have to change first. `tool-content.ts` is already ~3,900
lines at two locales. At nine it is 15,000+ lines in one module, which is not reviewable
in a pull request and will attract exactly the escaped-quote and stripped-backslash
corruption this repo has hit before. Splitting the registry into per-slug modules is a
prerequisite, not a follow-up.

**What to do instead, in order:**

1. **Translate the fallback into all 9 locales.** This is one template, nine translations —
   maybe a day of work — and it fixes the SEO content on all 122 fallback pages rather than
   54 bespoke ones. Right now `ToolSeoContent` maps `es`/`pt-BR`/`fr`/`de`/`ru`/`id`/`zh-CN`
   to English, so a German visitor gets a German UI wrapped around English prose on every
   one of 176 tool pages. That mismatch is a bigger and cheaper problem than the one full
   nine-locale expansion would solve.
2. **Measure before expanding the bespoke registry.** Pull Search Console impressions for
   `/tools/*` by country and language. The current en/ar split may reflect where content
   exists rather than where demand is. Expand to whichever two or three locales the data
   actually justifies, on the highest-traffic slugs only — not symmetrically across
   everything.
3. **If a locale is added, add it whole.** A page that is half-translated reads as
   abandoned. Better nine locales on twenty slugs than three locales on all of them.

## Things about this strategy that I do not think will work

- **`limitations` cannot be scaled by anyone who has not read the component.** Every
  limitation in the eight pilot entries came from reading source and, in three cases,
  contradicted the copy already on the page. The field's entire value is that it is true.
  The moment it is generated to fill the remaining 122 slugs it becomes a liability that is
  harder to detect than boilerplate, because it is specific and confident and wrong.
  It should stay gated behind having read the code.
- **Budget this as engineering, not content.** Realistically 45–90 minutes per tool
  including reading the component and verifying claims — roughly 50–90 hours for the ~62
  remaining Tier A/B/C slugs, plus an audit pass over the 46 pre-existing entries that were
  not part of this pilot. Anything materially faster than that is filler with a confident
  tone.
- **The differentiator here is the admission, not the keyword.** "Free, private, no
  signup, runs in your browser" is written on every competing page in this category and
  carries no information. "Compressing a text PDF here can make it bigger, and the tool
  will still call that a success" is not written anywhere else, is useful, and is the kind
  of sentence a model summarising the page will actually quote. If the honesty gets sanded
  off in review to make the pages sound better, the whole exercise was pointless and the
  boilerplate would have been cheaper.
