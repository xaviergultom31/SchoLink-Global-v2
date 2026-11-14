# SchoLink — Scholarships without borders

A free, private, offline-ready platform that helps students find international scholarships, understand the **real cost after funding**, and follow a weekly plan to the deadline. English is the primary language; the interface is available in 27 languages.

Built as a static site: no build step, no server, no dependencies.

---

## Run it

**Quickest:** open `index.html` in a browser.

**For the PWA / service worker** (recommended):

```powershell
cd "C:\Users\usb.risk\Documents\deepseek-harness\default-workspace"
python -m http.server 8099
# http://127.0.0.1:8099/index.html
```

A local preview server is already running at `http://127.0.0.1:8099/index.html` during this session.

---

## What is inside

| Area | What it does |
|---|---|
| **Home** | Editorial landing page with destination search, featured scholarships, cost estimator and impact story |
| **Destinations** | 12 study destinations with tuition, living costs, work rights, intakes and universities |
| **Scholarships** | 37 programmes, filterable by level, destination, funding and free-text search; every card shows the estimated **net cost** |
| **Cost calculator** | Choose destination, level, lifestyle and an optional scholarship; see the first-year cost, total programme, funding gap and monthly savings plan |
| **Profile wizard** | 4 steps: origin & connectivity, study level & grades, family finances, targets |
| **Dashboard** | Top matches, nearest deadline, funding gap, profile strength, plan progress |
| **Matches** | Ranked list with eligibility, score, net cost and one-gap warnings |
| **Plan** | Gap analysis and a week-by-week roadmap with checkboxes, funding breakdown and a savings target |
| **Settings** | Edit profile, language, currency, data saver, export/delete local data |
| **Languages** | English + 26 translations, lazy-loaded, right-to-left support for Arabic, Persian, Hebrew and Urdu |

There is no account and no server. Profile, saved scholarships and progress live in `localStorage` under `scholink.global.v1`.

---

## Cost model (how the numbers are made)

**First-year cost**

```
tuition (mid-point of public range)
+ living costs (monthly × 12 × lifestyle)
+ health insurance
+ visa fee
+ flights
+ application fees
= estimated first-year cost
```

**Scholarship funding**

```
tuition × coverage + monthly stipend × 12
+ flights & visa (if covered) + insurance (if covered)
= funding
```

**Net cost = max(0, first-year cost − funding)**. The programme total multiplies the net by the destination's programme length. Lifestyle changes living costs: budget ×0.78, standard ×1.0, comfort ×1.32.

All amounts are stored in **USD** and converted for display with indicative rates (`assets/js/i18n.js`). Users can pick USD, EUR, GBP, CAD, AUD, IDR, INR, NGN, BRL, JPY, CNY, ZAR, KES, PHP or VND.

> Costs are planning estimates, not quotes. Tuition varies by university and programme. Always confirm with the institution and the scholarship provider.

---

## Matching method

1. **Hard eligibility** — level, minimum GPA, English score, income caps, eligible regions, work experience, women-only awards.
2. **Weighted score** — academic fit 25%, financial need 18%, equity/location 18%, test readiness 15%, field fit 6%, peer signal 15%, selectivity 3%.
3. **Peer signal** — the profile vector is compared with eight student archetypes using cosine similarity; programmes saved by similar archetypes score higher.
4. **Explainability** — every match returns reasons and gaps; a high score means fewer gaps, never a guarantee.

The score, weights and cost formula are visible in the UI (`Why SchoLink → Method`).

---

## Project structure

```
index.html                    entry point
manifest.webmanifest          PWA metadata
sw.js                         service worker (network-first, offline fallback)
assets/
  favicon.svg
  css/
    app.css                   base component layer
    theme.css                 global theme: palette, landing, app, responsive
  js/
    i18n.js                   t(), language loader, currencies, money()
    data.js                   destinations, scholarships, universities, origins, modules
    engine.js                 eligibility, matching, cost engine, plans
    ui.js                     icons, rings, bars, badges, toasts
    pages.js                  public pages + onboarding
    app-pages.js              dashboard, matches, plan, settings, drawers
    app.js                    state, hash router, events, persistence
  i18n/
    es.js … sw.js             26 machine-assisted UI translations (lazy-loaded)
```

### Where to edit

- **Scholarships / destinations / universities:** `assets/js/data.js`.
- **Cost or scoring logic:** `assets/js/engine.js`.
- **Text and layout:** `assets/js/pages.js` (public), `assets/js/app-pages.js` (app).
- **English strings:** write `t("Your text")` in the render code; English is the source.
- **Colours and typography:** the `:root` block at the top of `assets/css/theme.css`.
- **Languages list / currencies:** `assets/js/i18n.js`.
- **Translations:** `assets/i18n/<code>.js`. Missing keys fall back to English.

### Add a language

1. Add an entry to `LANGS` in `assets/js/i18n.js` (`{ code, name, native, dir }`).
2. Run a translation pass over the `t("...")` strings, or copy an existing translation file and replace the values.
3. Save it as `assets/i18n/<code>.js`:

```js
window.SCHOLINK_I18N = window.SCHOLINK_I18N || {};
window.SCHOLINK_I18N["xx"] = { "Find scholarships": "…" };
```

No other change is needed: the selector and loader pick it up automatically.

> Translations are generated with a machine-translation pass and should be reviewed by a native speaker before production. Programme names, summaries and checklists remain in English by design.

---

## Privacy and offline

- No analytics, cookies, tracking pixels or third-party requests.
- The service worker caches the app shell and assets; your data stays in `localStorage`.
- **Data saver** removes gradients, shadows and animations.
- **Export** downloads a JSON file with profile, matches, saved awards and plan.
- **Delete** removes the local key and returns to the landing page.

---

## Data notes

- 37 scholarships, 12 destinations and 18 universities, curated for a 2027 entry cycle as a demonstration.
- Deadlines, eligibility and coverage are indicative and may change; verify with the official provider (each listing links to it).
- Origin equity indices and connectivity profiles are approximations used only to personalise recommendations.
- This is an independent prototype. It does not process applications, charge fees or speak for any university or government.

---

## Browser support

Chrome, Edge, Firefox and Safari (current versions). The app uses ES2017+, CSS custom properties and `localStorage`. Service worker and PWA install require `http://` or `https://`; opening `index.html` directly still works, with the language files loaded from disk.
