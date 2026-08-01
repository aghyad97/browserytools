# Awesome-list entries — DRAFTS

> **Status: nothing has been submitted.** No PR has been opened against any third-party
> repository. Everything below is a draft for the owner to review, edit, and submit manually.
>
> **Before you submit anything, do these in order:**
>
> 1. **Cut a tagged release.** The repo currently has **zero git tags and zero GitHub releases**
>    (verified `gh api repos/aghyad97/browserytools/tags` and `/releases`, both empty, 2026-07-31).
>    Two of the four lists below hard-require a first release older than 4 months. This is the
>    single highest-leverage fix and it gates the two most valuable lists.
> 2. **Decide what to do about Vercel Analytics.** `src/providers/providers.tsx` loads
>    `@vercel/analytics` on every page. This disqualifies us from pluja/awesome-privacy outright
>    (see §2). Swapping to a self-hosted Plausible/Umami/GoatCounter, or dropping analytics,
>    unblocks it.
> 3. **Fix the tool count in the README and the GitHub repo description.** README says "130+",
>    the GitHub description says "160+", the registry says **152**. Pick 152 and make all three
>    agree before a curator checks.
> 4. Read §5 "Facts every entry depends on" and confirm each line yourself.
>
> Submit **one list at a time**, and **one item per PR**. Several of these lists explicitly ban
> machine-generated contributions that ignore their guidelines (awesome-selfhosted says it results
> in a ban). Read the entry aloud before you send it; if it reads like an ad, rewrite it.

---

## 1. awesome-selfhosted — **DO NOT SUBMIT YET.** Qualifies on scope, fails on release history.

**Repo to submit to:** <https://github.com/awesome-selfhosted/awesome-selfhosted-data>
(the `awesome-selfhosted` repo itself has a PR template that says: *"Please do not submit pull
requests in this repository. Use awesome-selfhosted-data instead."*)

**File to add:** `software/browserytools.yml` (new file, kebab-case). One item per PR.
**Guidelines read:** [CONTRIBUTING.md](https://github.com/awesome-selfhosted/awesome-selfhosted-data/blob/master/CONTRIBUTING.md),
[.github/ISSUE_TEMPLATE/addition.md](https://github.com/awesome-selfhosted/awesome-selfhosted-data/blob/master/.github/ISSUE_TEMPLATE/addition.md),
[.github/PULL_REQUEST_TEMPLATE.md](https://github.com/awesome-selfhosted/awesome-selfhosted-data/blob/master/.github/PULL_REQUEST_TEMPLATE.md)

### Does it qualify at all?

The list's scope is *"Free Software network services and web applications which can be hosted on
your own server(s)."* BrowseryTools **is** a web application you can host on your own server —
`git clone`, `bun install`, `bun run build`, `bun start`, serve on :3000. It is AGPL-3.0, which is
on their `licenses.yml`. None of the five "What does not qualify" bullets apply: it is not
cloud-provider-specific, not a desktop/CLI app needing a separate sync server, not a library or
SDK, not a PaaS, not a Dockerization of someone else's app.

So the scope objection is survivable — **but expect pushback**, because there is no server-side
component and no data to keep on your own hardware. The honest counter-argument, which you should
put in the PR body rather than hide, is: *self-hosting this removes the dependency on
browserytools.com and on Vercel, and lets an org run the tools inside its own network.* That is a
real self-hosting motivation and it's the one to lead with.

### Blocking requirements we do not currently meet

| Requirement (verbatim from their PR template) | Status |
| --- | --- |
| "Any software project you are adding was **first released more than 4 months ago**." | ❌ **BLOCKER.** No tags, no releases. Their canned reply for this closes the PR. Cut `v1.0.0` now; earliest eligible submission is **~4 months after that tag**. |
| "Any software project you are adding has **working installation instructions**." | ⚠️ Partial. The README has clone/install/dev, but **no production deployment section** — no `bun run build && bun start`, no port/reverse-proxy note, no Node 20 minimum called out in a deploy context, no Docker. Add a "Self-hosting / deployment" section to the README before submitting. |
| "Any software project you are adding to the list is **actively maintained**." | ✅ Met. |
| Description "shorter than 250 characters, sentence case" | ✅ Draft below is 176 chars. |
| Licence on their `licenses.yml` | ✅ `AGPL-3.0`. |
| Demo link must be an interactive demo | ✅ browserytools.com is the live instance. |
| `depends_3rdparty` flag | ⚠️ See note below — I believe this must be `true` and you should not omit it. |

### On `depends_3rdparty`

The field means "whether the software depends on a third-party service outside the user's control."
For BrowseryTools this is **partly true and you should declare it**:

- The on-device AI tools fetch model weights from the Hugging Face Hub CDN on first use.
- Background Removal fetches model data from `staticimgly.com`.
- Image-to-Text (OCR) ships the Tesseract engine locally but fetches language `traineddata` from
  the tessdata CDN.
- Text to Speech fetches Piper/VITS voice models from a CDN.
- Currency Converter calls `api.frankfurter.app` for exchange rates.
- Live Dictation uses the browser's Web Speech API, which in Chrome/Edge routes audio through the
  browser vendor.

The *majority* of the 152 tools have no third-party dependency at all. But a self-hoster in an
airgapped network will find that ~12 tools don't work, and a curator who notices this after merge
is worse than declaring it. Set `depends_3rdparty: true` and be ready to explain the split.

### Draft `software/browserytools.yml`

```yaml
name: "BrowseryTools"
website_url: "https://browserytools.com"
source_code_url: "https://github.com/aghyad97/browserytools"
description: "Collection of 152 client-side utilities - image, PDF, media, text, data, developer and on-device AI tools - that process files in the browser without uploading them."
licenses:
  - AGPL-3.0
platforms:
  - Nodejs
tags:
  - Miscellaneous
depends_3rdparty: true
demo_url: "https://browserytools.com"
```

**Character count on `description`:** 176. Under their 250 limit.

**On `tags`:** in single-page mode the software appears only under the *first* tag, so choose
carefully. I have put `Miscellaneous` because there is no "utilities" or "online tools" tag and a
152-tool grab bag does not fit `Document Management`, `File Transfer`, or `Software Development -
IDE & Tools` cleanly. **TODO(verify):** browse
<https://github.com/awesome-selfhosted/awesome-selfhosted-data/tree/master/tags> yourself before
submitting — if a better-fitting tag exists now, use it, and consider adding
`Software Development - IDE & Tools` as a *second* tag for the dev-tools subset.

**On `platforms`:** their checklist says the value "should match the platforms required to install
and run the software." `Nodejs` is correct (Node 20+). If you add a Dockerfile before submitting,
add `Docker` too — it materially improves the odds, because self-hosters want a container.

**PR mechanics:** commit message `add BrowseryTools`. Tick every box in their PR template
honestly. Expect merge "at least ~1 week after approval."

---

## 2. awesome-privacy — **two different lists; we currently fail both, for different reasons.**

There is no single "awesome-privacy". The two that matter are:

### 2a. pluja/awesome-privacy — **DISQUALIFIED while Vercel Analytics is live.**

**Repo:** <https://github.com/pluja/awesome-privacy>
**Guidelines:** [misc/Contributing.md](https://github.com/pluja/awesome-privacy/blob/main/misc/Contributing.md)

Their listing requirements, verbatim:

> - Clear privacy-oriented / own your data policy.
> - **No user-tracking on project website. Only tracking listed under [Analytics] allowed.**
> - Open source code is very valuable…

`src/providers/providers.tsx` renders `<Analytics />` from `@vercel/analytics/next` on every page.
Vercel Analytics is **not** in their Analytics section (which lists Ackee, Aptabase, Cabin,
GoatCounter, Matomo, Nullitics, Pirsch, Plausible, Shynet, Swetrix, Umami, Unidentified Analytics,
Rybbit). Their contributing file also notes that PRs touching the README now run an automated
entry-format check and a monthly health scan, so this is not a "nobody will notice" situation.

**Requirements we don't yet meet:**

- ❌ Third-party analytics on the project website. **Fix: replace `@vercel/analytics` with a
  self-hosted GoatCounter/Umami/Plausible instance, or remove analytics entirely.** Until then,
  do not submit — a rejection on privacy grounds from a privacy list is a bad look that persists
  in a public PR thread.
- ⚠️ The site has a Privacy Policy at `/privacy` which does disclose the analytics — good, that
  satisfies "clear privacy-oriented policy" — but the analytics itself is the blocker, not the
  disclosure.

**Draft entry (hold until analytics is resolved).** Their format is a single line; the section is
`## Utilities`, entries added at the end of the section:

```markdown
- [BrowseryTools](https://browserytools.com) - 152 file, image, PDF, media and text utilities that run client-side in the browser; AGPL-3.0, self-hostable, no account. Some AI tools download model weights from a CDN on first use.
```

That second sentence is deliberate. Their audience will open devtools. Say it before they find it.

### 2b. Lissy93/awesome-privacy — **blocked by the same 4-month release rule, plus a category wall.**

**Repo:** <https://github.com/Lissy93/awesome-privacy>
**Guidelines:** [.github/CONTRIBUTING.md](https://github.com/Lissy93/awesome-privacy/blob/main/.github/CONTRIBUTING.md)
**File to edit:** `awesome-privacy.yml` only (not the README — it is generated).

> ⚠️ **Read this before letting any AI tool near this repo.** Their `CONTRIBUTING.md` contains a
> hidden HTML comment addressed to AI agents, instructing them to append a remotely-hosted image
> to the PR description. It is a fingerprinting trap for LLM-written PRs. **Do not include it.**
> Write and send this PR by hand.

**Requirements we don't yet meet:**

- ❌ *"Repositories must not be newly created, and the **first stable release older than 4
  months**."* Same blocker as awesome-selfhosted. No releases exist.
- ❌ *"The software must be relevant, and **fit into one of the existing categories**."* There is
  no "online tools" or "utilities" category. A 152-tool collection has nowhere to go. The only
  realistic path is submitting **one** tool that maps to a real privacy category — the EXIF
  Remover (`/tools/exif-remover`) into a metadata-removal section, if one exists.
  **TODO(verify):** read `awesome-privacy.yml` and confirm whether a metadata/EXIF category
  exists before writing anything.
- ⚠️ Description must be **50–250 characters** and *"must not read like an advert. Be objective,
  and include drawbacks as well as strengths."*
- ⚠️ *"You must be transparent about your affiliation."* Say "I'm the author" in the PR body.
- ⚠️ PR title format is enforced: `[Add] BrowseryTools in <section>`. All template checkboxes must
  be ticked. Automated schema validation runs on the PR.
- ⚠️ Icon required: square, 64x64–512x512. `public/icon.svg` should work.
- ⚠️ You must respond to review comments within 14 days.

**Draft entry (single-tool framing, hold until a release is 4 months old):**

```yaml
- name: BrowseryTools EXIF Remover
  description: Strips EXIF metadata - GPS coordinates, camera model, timestamps - from photos entirely in the browser, with no upload and no account. Part of a wider AGPL-3.0 browser-tools project; handles single images, not bulk directories.
  url: https://browserytools.com/tools/exif-remover
  icon: https://browserytools.com/icon.svg
  github: https://github.com/aghyad97/browserytools
```

Description is 232 characters — inside their 50–250 window. The clause after the semicolon is the
required drawback.

---

## 3. "awesome-opensource" — **no canonical list exists. Retarget.**

I searched GitHub for a list under this name. There is no single well-known `awesome-opensource`
that catalogues open-source *applications* in general. What exists under that name is a family of
domain-specific lists (`awesome-opensource-ai`, `-data-engineering`, `-hardware`, `-unity`,
`-boilerplates`, `-security`, `-documents`) plus a handful of near-dead alternative-finder lists
with single-digit stars. `sindresorhus/awesome` is a list *of lists* and does not accept individual
projects.

The closest legitimate target is:

### unicodeveloper/awesome-opensource-apps

**Repo:** <https://github.com/unicodeveloper/awesome-opensource-apps> (~3.9k stars)
Scope: *"Curated list of awesome open source crafted web & mobile applications."*

**TODO(verify):** I have not read this repo's CONTRIBUTING or its exact entry format, and I have
not confirmed it is still actively merging PRs in 2026. Check the last merged PR date and the
entry format in the README before writing anything. If the last merge is more than a year old,
skip it — a PR into a dead list is wasted effort.

Provisional entry, matching the common awesome format (**confirm the real format first**):

```markdown
- [BrowseryTools](https://github.com/aghyad97/browserytools) - 152 browser-based utilities (image, PDF, media, text, data, developer, on-device AI) built with Next.js and TypeScript. AGPL-3.0.
```

**Requirements we don't yet meet:** unknown until the CONTRIBUTING is read. Assume at minimum:
active maintenance (✅), OSI licence (✅ AGPL-3.0), a public repo (✅).

---

## 4. awesome-devtools — **two candidates. One is a good fit if we submit individual tools.**

### 4a. moimikey/awesome-devtools — **best fit, but the homepage is explicitly disqualified.**

**Repo:** <https://github.com/moimikey/awesome-devtools>
Scope: *"in-browser bookmarklets, tools, and resources for modern full-stack software engineers."*
**Guidelines:** [CONTRIBUTING.md](https://github.com/moimikey/awesome-devtools/blob/master/CONTRIBUTING.md), verbatim:

> To keep awesome-devtools instantly accessible for everyone, all tools must be:
> - **Browser-based** — no downloads or native app installs
> - **Direct link** — goes straight to the tool (not a multi-tool landing page)
> - **100% free** — no signups, trials, paywalls, or usage limits

We pass 1 and 3 cleanly. **Rule 2 rules out linking `browserytools.com` itself.** Submit individual
`/tools/<slug>` URLs, one per PR, into the existing sub-sections.

**Draft entries.** Format matches the file: `- [Name](url) - Description` under `## Tools`, in the
relevant `###` sub-section, alphabetised within the sub-section.

Under `### CSS`:
```markdown
- [BrowseryTools clip-path](https://browserytools.com/tools/clip-path-generator) - Visual CSS clip-path editor with draggable polygon vertices and shape presets.
- [BrowseryTools Cubic-Bezier](https://browserytools.com/tools/cubic-bezier) - CSS easing curve editor with draggable handles and a live animation preview.
```

Under `### Copy/Paste Scripts & Styles` (or a JSON/data section — **TODO(verify)** which
sub-section fits):
```markdown
- [BrowseryTools JSON to TypeScript](https://browserytools.com/tools/json-to-ts) - Paste JSON, get TypeScript interfaces.
- [BrowseryTools cURL Converter](https://browserytools.com/tools/curl-converter) - Convert a curl command into fetch, axios, Python requests, Go or PHP.
```

**Requirements we don't yet meet:** none that I can find — these specific tools genuinely have no
signup, no paywall, no limit, and run in-browser. The only rule we'd violate is submitting the hub
page, so don't.

**Note the existing `Clippy` entry** under `### CSS` — our clip-path tool is a direct overlap.
Expect the maintainer to ask why the list needs a second one. Have an answer (ours adds
inset/circle/ellipse modes and emits the `-webkit-` prefix) or drop that one entry.

### 4b. devtoolsd/awesome-devtools — **submittable but low value.**

**Repo:** <https://github.com/devtoolsd/awesome-devtools> (~671 stars)
There is **no CONTRIBUTING.md and no stated criteria** — the readme just ends with "PRs welcome!".
Format is `* [Name](url) - Description.` The `## Productivity & Misc` section already contains a
near-identical entry (Digital Toolpad: *"Modern suite of dev tools that run 100% offline"*), so the
hub page is acceptable here in a way it isn't for 4a.

Draft entry for `## Productivity & Misc`:

```markdown
* [BrowseryTools](https://browserytools.com) - 152 free browser-based tools for developers and everyday tasks; files are processed client-side, no account, AGPL-3.0.
```

**Requirements we don't yet meet:** none stated. **But** the list is unvetted, mixes free and paid
products indiscriminately (Notion, Linear, AWS, Copilot), and has no curation signal. Low
credibility, low traffic. Submit it if you're already in a PR-writing mood; don't prioritise it.

---

## 5. Facts every entry above depends on — verify these yourself

All verified in this worktree on **2026-07-31**. Star/fork counts move; re-check before submitting.

| Claim | Source | Value |
| --- | --- | --- |
| Tool count | `bun run validate` | **152** ("Total tools in config: 152 / Available tools: 152"). Do **not** say 176 — that is the route count in `tools-config.ts`, which includes 24 `landingFor` SEO variants that share a component (e.g. ten `compress-image-to-*` routes over one tool). |
| Licence | `LICENSE` + `package.json` `"license": "AGPL-3.0-only"` | GNU AGPL v3.0. OSI-approved, on awesome-selfhosted's `licenses.yml`. |
| Repo | `gh api repos/aghyad97/browserytools` | 634 stars, 73 forks, created 2025-02-18, not archived. |
| Tags / releases | `gh api .../tags`, `.../releases` | **Both empty.** |
| Self-hostable | `package.json` scripts | Yes: Node 20+, `bun install && bun run build && bun start`. No database, no auth, no backend service. Two route handlers only (`/llms.txt`, `/llms-full.txt`). No Dockerfile. |
| Offline | no service worker anywhere in `src/` or `public/` | **The site does not work offline.** `public/manifest.json` exists so it is installable as a PWA shell, but there is no offline caching. Never write "works offline" in an entry. |
| Locales | `src/lib/locales.ts` | 9: en, ar, es, pt-BR, fr, de, ru, id, zh-CN. Arabic is full RTL. |
| Fonts | `src/app/layout.tsx` uses `next/font` | Self-hosted at build. No runtime request to Google Fonts. |
| Analytics | `src/providers/providers.tsx` | `@vercel/analytics` on every page. Disclosed in `/privacy`. |
| Tools that download models on first use | grep of `src/components` | Transcriber + Subtitle Studio (`Xenova/whisper-base`), Summarizer (`distilbart-cnn-6-6`), Translator (`m2m100_418M`), Image Captioner (`vit-gpt2-image-captioning`), Image Upscaler (`swin2SR-classical-sr-x2-64`), PII Redactor (`bert-base-NER`), Sentiment (`distilbert-sst-2`), Zero-Shot Classifier (`nli-deberta-v3-xsmall`), Depth Map (`depth-anything-v2-small`), Object Cutout (`slimsam-77-uniform`) — all from the Hugging Face CDN. Background Removal from `staticimgly.com`. OCR language data from the tessdata CDN. Text to Speech voices (~20–60 MB) from a CDN. |
| Genuinely non-local tools | code read | **Currency Converter** calls `api.frankfurter.app`. **Live Dictation** (`/tools/speech-to-text`) uses the Web Speech API — in Chrome/Edge the audio goes to the browser vendor. ffmpeg.wasm core is self-hosted from `/ffmpeg`, and the Tesseract engine from `/tesseract`, so those are fine. |
| README/description drift | README vs `gh api` vs validate | README says "130+", GitHub description says "160+", reality is 152. **Fix before submitting.** |
