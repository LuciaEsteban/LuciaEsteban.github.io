# Lucía Esteban — Portfolio

Personal portfolio site for **Lucía Esteban Peña**, Microsoft Dynamics 365
Business Central / AL Developer. Built to work as a technical portfolio,
interactive résumé and a small demonstration of front-end development in
its own right.

Live site: https://luciaesteban.github.io/

## Project purpose

The site leads with Business Central / AL capability — what Lucía can build
today — and only afterwards moves into chronology (professional experience,
education) and personal context. Copy is written to stay true over time (durations are computed from dates in `config.js`, no "this year"-style wording). Content is bilingual (English / Spanish),
anonymized technical case studies illustrate real project work without
naming clients, and every interactive element (language switch, scroll
reveal, automatic experience counter) is there to support that goal rather
than for decoration.

## Technology stack

Deliberately dependency-free, to match GitHub Pages' static hosting and to
keep the codebase easy to read and maintain:

- **HTML5** — semantic markup, one page (`index.html`)
- **CSS3** — hand-written, no framework (`assets/css/styles.css`)
- **Vanilla JavaScript** — no build step, no bundler (`assets/js/`)
- **Google Fonts** (Inter, JetBrains Mono) loaded via `<link>`

No React/Vite/Next or similar tooling is used — the site doesn't need a
build pipeline, and introducing one would add maintenance overhead without
a functional benefit.

## File structure

```
.
├── index.html                  Single-page site, all sections
├── assets/
│   ├── css/
│   │   ├── styles.css          All styling, incl. responsive & motion rules
│   │   └── experience.css      Intro screen, sparkles canvas, music player
│   ├── js/
│   │   ├── config.js           Central configuration (see below)
│   │   ├── i18n.js             English + Spanish content dictionary
│   │   ├── main.js             Language switch, nav, reveal animations,
│   │   │                       experience calculator, contact link wiring
│   │   └── experience.js       Intro bubble, sparkles, sound effects and
│   │                           generative background music (Web Audio API)
│   └── img/
│       ├── favicon.svg / .png  Site icon
│       ├── og-image.svg / .png Social share preview image
│       ├── profile-placeholder.svg   Placeholder for the hero photo
│       └── guitar-placeholder.svg    (unused) old placeholder; the "Beyond the code" photo is by Isa Bauptista on Unsplash (Unsplash License)
└── README.md
```

## Configuration — `assets/js/config.js`

Content that changes independently of the design lives in one file instead
of being duplicated across the codebase:

| Key | Purpose |
|---|---|
| `businessCentralStartDate` | Drives the automatic "years / months of experience" calculation site-wide. |
| `professionalEmail`, `linkedInUrl`, `cvPdfUrl` | Contact links. Left as `null` until provided — the related button is hidden/disabled rather than shipping a broken or fake link. |
| `contactFormEndpoint` | Where the contact form sends messages. Set to FormSubmit for `luciaes.dev@gmail.com` (one-time activation email on the first message). `null` = open the visitor's email app pre-filled instead. |
| `githubUrl` | Already set. |
| `currentCompanyDisplayName` | Optional — only set this if Lucía has explicitly decided to publish her current employer's name. |
| `education.*` | Optional exact education dates. |

### Before you publish — checklist

The following are intentionally left as placeholders (no data was invented
for them). Fill these in `assets/js/config.js` before treating the site as
final:

- [x] `businessCentralStartDate` — set to March 2025 (confirmed). Adjust the exact day if it becomes known.
- [x] `professionalEmail` — set to luciaes.dev@gmail.com
- [x] `linkedInUrl` — set to https://www.linkedin.com/in/luciaes-dev/
- [ ] `cvPdfUrl` (and add the actual PDF under `assets/files/`)
- [ ] Replace `assets/img/profile-placeholder.svg` with a real photo (update the `<img src>` in `index.html`'s hero section)
- [ ] Optionally replace `assets/img/guitar-placeholder.svg` with a real photo
- [ ] `currentCompanyDisplayName`, only if publishing it is desired
- [ ] `education.damCompletedYear`, `education.computerEngineeringStartYear`, if exact dates should be shown

## Internationalization

- Default language: **English**. A visible `EN | ES` switch in the header
  toggles the language for the whole page.
- All meaningful content — not just navigation — is translated. Text lives
  in `assets/js/i18n.js` as a single dictionary (`TRANSLATIONS.en` /
  `TRANSLATIONS.es`), keyed by dot-paths such as `hero.tagline`.
- Elements are tagged with `data-i18n="path.to.key"` (for text content) or
  `data-i18n-attr="attr:path.to.key"` (for an attribute, e.g. `alt` text).
  `assets/js/main.js` resolves these on load and on language change — no
  duplicated pages, no copy/pasted HTML per language.
- The chosen language is remembered for returning visitors via
  `localStorage` (key `lucia-portfolio-lang`), scoped to this site only. No
  other data is stored locally.
- Code, identifiers, comments and this README are in English, per standard
  practice, regardless of the page's displayed language.

## Intro, sound & music — `assets/js/experience.js`

A separate, optional "experience layer" (own CSS + JS files, the base
design is untouched):

- **Intro screen** — a glass bubble emerges from a blurred background
  with the photo, name and role. Behind it, barely visible, AL code
  (event subscribers, an API page, an HTTP webhook, an XMLport) falls
  slowly in an endless loop. Popping the bubble (click, Enter or Space)
  plays a soft pop and a piano chord and dissolves into the site.
  "Enter without sound" / Escape skips all audio.
- **Background music** — synthesised live with the Web Audio API: calm
  piano arpeggios over a string pad and bass, in D major, generative
  so it never repeats exactly. No audio files, so no licensing and no
  extra download. Floating player bottom-right ("Music on/off") with
  play/pause, volume and a live equalizer; pauses automatically when
  the tab is hidden.
- **Seasonal background** — a few slow, low-opacity particles that
  follow the time of year (northern hemisphere): snow Dec–Feb, petals
  Mar–May, warm drifting motes Jun–Aug, falling leaves Sep–Nov. Adapts
  to light/dark mode, pauses in hidden tabs, off with reduced motion.
  Preview any season with `?season=winter|spring|summer|autumn`.
- **Page interactions** — 3D tilt on the expertise cards, hero colour
  orbs that follow the mouse, and clicking the photo or the guitar
  strums a chord.
- **Contact form** (right-hand side of the Contact section) — name,
  email, optional company and message, with validation and a spam
  honeypot. Messages are emailed directly via FormSubmit
  (`contactFormEndpoint` in `config.js`), with the sender's address as
  Reply-To; set it to `null` to open the visitor's email app instead. When the visitor reaches the
  end of the page the form gives one short nudge and then floats
  gently with a soft glow until they start typing.
- Respects `prefers-reduced-motion` (no trail/tilt, calm intro) and
  works without JavaScript (intro is hidden via `<noscript>`).

## Accessibility

- Semantic HTML landmarks (`header`, `nav`, `main`, `footer`) and a
  "skip to main content" link.
- Full keyboard operability, with visible focus states on every
  interactive element.
- `prefers-reduced-motion` is respected: scroll-reveal animations and
  decorative motion are disabled for users who request it.
- Meaningful `alt` text on all images (including a note that hero/hobby
  photos are placeholders until real images are added).
- Sufficient color contrast and a mobile-first responsive layout.

## Running locally

No build step is required. From the project root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any other static file server works equally well (e.g. `npx serve`).

## Deployment

**Cache busting:** `index.html` loads every CSS/JS file with a `?v=…`
suffix. Bump that number whenever a CSS or JS file changes, so visitors'
browsers fetch the new version instead of a cached old one.


The site is deployed with **GitHub Pages**, serving static files directly
from this repository (`main` branch, root). Pushing to `main` is enough —
no CI/build step is involved. GitHub Pages can take a few minutes to
publish changes after a push.

## Content policy

Everything visible on the site is meant to be defensible in an interview.
No client names, internal system/server names, unverified metrics,
unobtained certifications or invented dates are included anywhere in this
repository. Where a piece of information (a date, an email address, a
document) hasn't been provided, it is represented as an explicit,
named placeholder — see the checklist above — rather than guessed.
