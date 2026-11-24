/* =========================================================================
   SchoLink Global — Pages (English source strings wrapped in t())
   ========================================================================= */
(function (global) {
  "use strict";

  const D = global.SCHO;
  const E = global.SchoEngine;
  const U = global.UI;
  const I = global.I18n;
  const t = (s, v) => I.t(s, v);
  const { icon, esc, ring, bars, badge, progress, deadlineChip, initials } = U;

  const flag = (id) => E.origin(id).code;
  const dest = (id) => E.destination(id);
  const fundingLabel = (f) => f === "full" ? t("Fully funded") : f === "tuition" ? t("Tuition covered") : t("Partial funding");
  const fundingTone = (f) => f === "full" ? "green" : f === "tuition" ? "teal" : "amber";
  const yearsLabel = (n) => (Number(n) === 1 ? t("1 year") : t("{n} years", { n }));
  const gapsLabel = (n) => (Number(n) === 1 ? t("1 gap") : t("{n} gaps", { n }));

  function levelFor(state) {
    if (state.profile) return state.profile.level;
    return state.filters.level !== "Any" ? state.filters.level : "Master";
  }

  /* ------------------------------------------------------------------ header */
  function langOptions() {
    return I.LANGS.map((l) => '<option value="' + l.code + '"' + (I.state.lang === l.code ? " selected" : "") + ">" + l.native + "</option>").join("");
  }
  function curOptions() {
    return I.CURRENCIES.map((c) => '<option value="' + c.code + '"' + (I.state.currency === c.code ? " selected" : "") + ">" + c.code + "</option>").join("");
  }

  function header(state, active) {
    const links = [
      ["destinations", t("Destinations")],
      ["scholarships", t("Scholarships")],
      ["costs", t("Costs")],
      ["impact", t("Why SchoLink")],
    ];
    const profile = state.profile;
    return `<header class="site-head" id="siteHead">
      <div class="site-head-inner">
        <a class="site-brand" href="#/">
          <span class="brand-mark">S</span>
          <span class="brand-text"><b>SchoLink</b><small>${t("Scholarships without borders")}</small></span>
        </a>
        <nav class="site-nav" aria-label="${t("Main menu")}">
          ${links.map((l) => `<a href="#/${l[0]}" class="${active === l[0] ? "active" : ""}">${l[1]}</a>`).join("")}
          ${profile ? `<a href="#/dashboard" class="${active === "dashboard" ? "active" : ""}">${t("Dashboard")}</a>` : ""}
        </nav>
        <div class="site-tools">
          <label class="tool-select" title="${t("Language")}">${icon("language", "i-sm")}<select data-action="lang" aria-label="${t("Language")}">${langOptions()}</select></label>
          <label class="tool-select tool-select--cur" title="${t("Currency")}">${icon("walletCard", "i-sm")}<select data-action="currency" aria-label="${t("Currency")}">${curOptions()}</select></label>
          <a class="btn btn--ghost btn--sm hide-sm" href="${profile ? "#/settings" : "#/start"}">${profile ? t("My profile") : t("Sign in")}</a>
          <a class="btn btn--primary btn--sm" href="${profile ? "#/matches" : "#/start"}">${profile ? t("My matches") : t("Start free")}</a>
          <button class="icon-btn site-menu-btn" data-action="menu" aria-label="${t("Menu")}">${icon("menu", "i-sm")}</button>
        </div>
      </div>
      <div class="mobile-nav-panel" id="mobilePanel">
        ${links.map((l) => `<a href="#/${l[0]}">${l[1]}</a>`).join("")}
        ${profile ? `<a href="#/dashboard">${t("Dashboard")}</a><a href="#/settings">${t("Settings")}</a>` : `<a href="#/start">${t("Start free")}</a>`}
      </div>
    </header>`;
  }

  function footer() {
    return `<footer class="site-foot">
      <div class="foot-grid">
        <div class="foot-brand">
          <a class="site-brand" href="#/"><span class="brand-mark">S</span><span class="brand-text"><b>SchoLink</b><small>${t("Scholarships without borders")}</small></span></a>
          <p>${t("A free, independent tool that helps students find scholarships, understand the real cost, and build a plan — wherever they live.")}</p>
        </div>
        <div><h4>${t("Explore")}</h4><a href="#/destinations">${t("Destinations")}</a><a href="#/scholarships">${t("Scholarships")}</a><a href="#/costs">${t("Cost calculator")}</a></div>
        <div><h4>${t("Learn")}</h4><a href="#/impact">${t("Why SchoLink")}</a><a href="#/start">${t("How it works")}</a><a href="#/impact">${t("Data & method")}</a></div>
        <div><h4>${t("Languages")}</h4><p class="tiny">${t("Available in 27 languages, from Arabic to Vietnamese.")}</p>
          <label class="tool-select tool-select--foot">${icon("language", "i-sm")}<select data-action="lang">${langOptions()}</select></label>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} SchoLink. ${t("Free for every student.")}</span>
        <span class="tiny">${t("Costs and deadlines are indicative. Always confirm with the official provider.")}</span>
      </div>
    </footer>`;
  }

  /* ---------------------------------------------------------------- components */
  function pageHero(kicker, title, sub, actions) {
    return `<section class="page-hero"><div class="page-hero-inner">
      <div><div class="eyebrow">${esc(kicker)}</div><h1>${title}</h1>${sub ? `<p class="lede">${sub}</p>` : ""}</div>
      ${actions ? `<div class="page-hero-actions">${actions}</div>` : ""}
    </div></section>`;
  }

  function destCard(d, compact) {
    const c = E.costEstimate(d.id, "Master", { lifestyle: "standard" });
    const count = D.SCHOLARSHIPS.filter((s) => s.dest === d.id).length;
    return `<article class="dest-card${compact ? " dest-card--compact" : ""}" data-action="open-destination" data-id="${d.id}" tabindex="0" role="button" aria-label="${esc(d.name)}">
      <div class="dest-top"><span class="dest-flag">${d.code}</span><span class="dest-arrow">${icon("arrowUp", "i-sm")}</span></div>
      <h3>${esc(d.name)}</h3>
      <div class="dest-cost"><span>${t("Total from")}</span><b>${U.money(c.total)}</b><em>${t("per year")}</em></div>
      <div class="dest-meta"><span>${icon("calendar", "i-sm")}${d.intakes[0]}</span><span>${icon("graduation", "i-sm")}${count} ${t("scholarships")}</span></div>
    </article>`;
  }

  function costRows(cost) {
    return [
      [t("Tuition (annual)"), cost.tuition],
      [t("Living costs (12 months)"), cost.living],
      [t("Health insurance"), cost.insurance],
      [t("Books & supplies"), cost.booksSupplies || 0],
      [t("Visa & residence permit"), (cost.visa || 0) + (cost.residencePermit || 0)],
      [t("Flights (return)"), cost.flights],
      [t("Application fees"), cost.application],
      [t("One-time setup (deposit, SIM, etc.)"), cost.oneTimeSetup || 0],
    ];
  }

  function costBreakdown(cost) {
    const rows = costRows(cost).map((r) => r[1] > 0 ? `<div class="cost-line"><span>${r[0]}</span><b>${U.money(r[1])}</b></div>` : "").join("");
    const oneTimeTotal = (cost.visa || 0) + (cost.residencePermit || 0) + (cost.flights || 0) + (cost.application || 0) + (cost.oneTimeSetup || 0);
    return `<div class="cost-lines">
      <div class="cost-line cost-line--section"><span>${t("Recurring (annual)")}</span></div>
      ${rows.split('<div class="cost-line"><span>' + t("Visa"))[0]}
      <div class="cost-line"><span>${t("Books & supplies")}</span><b>${U.money(cost.booksSupplies || 0)}</b></div>
      <div class="cost-line cost-line--subtotal"><span>${t("Annual subtotal")}</span><b>${U.money(cost.recurringAnnual || (cost.tuition + cost.living + cost.insurance + (cost.booksSupplies || 0)))}</b></div>
      <div class="cost-line cost-line--section"><span>${t("One-time costs")}</span></div>
      <div class="cost-line"><span>${t("Visa fee")}</span><b>${U.money(cost.visa || 0)}</b></div>
      <div class="cost-line"><span>${t("Residence permit")}</span><b>${U.money(cost.residencePermit || 0)}</b></div>
      <div class="cost-line"><span>${t("Flights (return)")}</span><b>${U.money(cost.flights || 0)}</b></div>
      <div class="cost-line"><span>${t("Application fees")}</span><b>${U.money(cost.application || 0)}</b></div>
      <div class="cost-line"><span>${t("Setup (deposit, SIM, etc.)")}</span><b>${U.money(cost.oneTimeSetup || 0)}</b></div>
      <div class="cost-line cost-line--subtotal"><span>${t("One-time subtotal")}</span><b>${U.money(oneTimeTotal)}</b></div>
      <div class="cost-line cost-line--total"><span>${t("Estimated first-year cost")}</span><b>${U.money(cost.total)}</b></div>
      ${cost.totalProgram ? `<div class="cost-line cost-line--program"><span>${t("Total programme (" + cost.duration + " years)")}</span><b>${U.money(cost.totalProgram)}</b></div>` : ""}
    </div>`;
  }

  function schCard(row, opts) {
    opts = opts || {};
    const s = row.scholarship || row;
    const c = row.cost || E.scholarshipCost(s, null, { level: s.level[0] });
    const sc = row.score;
    const cov = E.scholarshipCoverage(s);
    return `<article class="sch-card${opts.compact ? " sch-card--compact" : ""}" data-action="open-scholarship" data-id="${s.id}" tabindex="0" role="button">
      <div class="sch-main">
        <div class="sch-badges">
          ${badge(fundingLabel(s.funding), fundingTone(s.funding), cov.t >= 1 ? "checkCircle" : "wallet")}
          ${badge(s.level.join(" · "), "outline")}
          ${badge(dest(s.dest).code + " " + dest(s.dest).name, "grey")}
          ${row.category ? `<span class="match-category-badge ${row.category}">${row.categoryName || row.category}</span>` : ""}
        </div>
        <h3 class="sch-name">${esc(s.name)}</h3>
        <div class="sch-provider">${esc(s.provider)}</div>
        <div class="sch-meta">
          <span>${icon("calendar", "i-sm")}${t("Deadline")} ${I.date(s.deadline)}</span>
          <span>${icon("graduation", "i-sm")}${t("Min GPA")} ${s.minGpa.toFixed(1)}</span>
          ${s.ielts ? `<span>${icon("language", "i-sm")}${t("IELTS")} ${s.ielts}</span>` : ""}
        </div>
        ${row.reasons && row.reasons.length ? `<div class="sch-reason">${icon("sparkle", "i-sm")}<span>${esc(reasonText(row.reasons[0]))}</span></div>` : ""}
      </div>
      <div class="sch-side">
        ${sc ? ring(sc) : `<div class="sch-flag">${dest(s.dest).code}</div>`}
        <div class="sch-net"><span>${t("Net cost")}</span><b>${U.money(c.net)}</b><em>${t("per year")}</em></div>
        ${deadlineChip(E.daysUntil(s.deadline))}
      </div>
    </article>`;
  }

  function reasonText(r) {
    const v = r.vars || {};
    switch (r.code) {
      case "fullTuition": return t("Tuition is fully covered.");
      case "stipend": return t("Includes a monthly stipend of about {amount}.", { amount: U.money(v.amount) });
      case "incomeEligible": return t("Your family income is within the {cap} limit.", { cap: U.money(v.cap) });
      case "regionPriority": return t("Prioritised for students from {region}.", { region: v.region });
      case "firstGen": return t("First-generation students are prioritised.");
      case "equity": return t("Built for students from {origin} and similar regions.", { origin: v.origin });
      case "englishMet": return t("Your English score meets the requirement ({score}).", { score: v.score });
      case "englishRegistered": return t("You have registered for an English test — target IELTS {need}.", { need: v.need });
      case "englishPlanning": return t("You are planning to take an English test — target IELTS {need}.", { need: v.need });
      case "noEnglish": return t("No English test is required.");
      case "gpaMet": return t("Your grades are above the minimum by {margin}.", { margin: v.margin });
      case "lowBandwidth": return t("The application can be completed with low bandwidth.");
      case "peers": return t("{pct}% of similar students saved this.", { pct: v.pct });
      case "fieldMatch": return t("Matches your field: {field}.", { field: v.field });
      default: return t("A strong fit for your profile.");
    }
  }

  function gapText(g) {
    const v = g.vars || {};
    switch (g.code) {
      case "gpa": return { title: t("Grades"), body: t("You have {have}; the minimum is {need}. Raise it by {gap} points or target a program with a lower threshold.", v) };
      case "english": return { title: t("English test"), body: t("You have {have}; the requirement is {need}. Book a test and follow an 8-week sprint.", v) };
      case "englishPending": return { title: t("English test pending"), body: t("Your English test status is '{status}'. Target IELTS {need} and book your exam.", v) };
      case "englishNotTaken": return { title: t("English test not taken"), body: t("This scholarship requires IELTS {need}. You have not taken an English test yet.", v) };
      case "standardTest": return { title: t("Standardized test"), body: t("{test} — {need}. Check whether this test is required for your target universities.", v) };
      case "work": return { title: t("Work experience"), body: t("You have {have} years; the program asks for {need}.", v) };
      case "income": return { title: t("Income eligibility"), body: t("Your family income ({have}) is above this need-based cap ({cap}).", v) };
      case "documents": return { title: t("Physical documents"), body: t("This application needs legalised paper documents and in-person submission.") };
      case "funding": return { title: t("Funding gap"), body: t("About {amount} per year is not covered. Build a savings and sponsorship plan.", v) };
      case "interviewTravel": return { title: t("In-person interview"), body: t("Budget for travel to an embassy or interview centre.") };
      default: return { title: t("Preparation"), body: t("Check the official requirements before applying.") };
    }
  }

  function emptyState(iconName, title, body, action) {
    return `<div class="empty-state">${icon(iconName, "i-lg")}<h3>${esc(title)}</h3><p>${esc(body)}</p>${action || ""}</div>`;
  }

  /* -------------------------------------------------------------------- home */
  function home(state) {
    const featured = ["chevening", "fulbright", "mext"].map((id) => E.byId(D.SCHOLARSHIPS, id)).filter(Boolean);
    const topDests = ["uk", "us", "ca", "de", "jp", "kr"].map(dest);
    const mini = state.costMini;
    const mc = E.costEstimate(mini.dest, mini.level, { lifestyle: mini.lifestyle });
    const chev = E.byId(D.SCHOLARSHIPS, "chevening");
    const chevDays = E.daysUntil(chev.deadline);

    return `<main>
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-copy">
            <div class="hero-kicker">${icon("globe", "i-sm")}${t("For students from every postcode")}</div>
            <h1>${t("Your future should not depend on where you were born.")}</h1>
            <p class="lede">${t("Find scholarships you can actually win, see the real cost before you apply, and follow a plan that fits your life — in your language.")}</p>
            <form class="search-card" data-form="search">
              <div class="search-field"><label>${t("Where to")}</label><select data-search="dest">
                <option value="Any">${t("Any destination")}</option>
                ${D.DESTINATIONS.map((d) => `<option value="${d.id}"${state.filters.dest === d.id ? " selected" : ""}>${d.code} ${esc(d.name)}</option>`).join("")}
              </select></div>
              <div class="search-field"><label>${t("Level")}</label><select data-search="level">
                ${["Any"].concat(D.LEVELS).map((l) => `<option value="${l}"${state.filters.level === l ? " selected" : ""}>${l === "Any" ? t("Any level") : l}</option>`).join("")}
              </select></div>
              <div class="search-field"><label>${t("Field")}</label><select data-search="field">
                <option value="Any">${t("Any field")}</option>
                ${D.FIELDS.map((f) => `<option value="${f.id}"${state.filters.field === f.id ? " selected" : ""}>${esc(f.name)}</option>`).join("")}
              </select></div>
              <button class="btn btn--primary search-btn" data-action="search">${t("Find scholarships")}${icon("arrow", "i-sm")}</button>
            </form>
            <div class="hero-meta">
              <span>${icon("shield", "i-sm")}${t("Free, no account needed")}</span>
              <span>${icon("download", "i-sm")}${t("Works offline")}</span>
              <span>${icon("language", "i-sm")}${t("27 languages")}</span>
            </div>
          </div>
          <div class="hero-art" aria-hidden="true">
            <div class="globe-wrap">
              <svg class="globe" viewBox="0 0 420 420">
                <defs>
                  <radialGradient id="gsphere" cx="38%" cy="32%" r="75%">
                    <stop offset="0%" stop-color="#1d5b47"/><stop offset="55%" stop-color="#0e3a2c"/><stop offset="100%" stop-color="#08251c"/>
                  </radialGradient>
                  <linearGradient id="gline" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fe0bd"/><stop offset="1" stop-color="#d7a24a"/></linearGradient>
                </defs>
                <circle cx="210" cy="210" r="168" fill="url(#gsphere)"/>
                <g fill="none" stroke="url(#gline)" stroke-opacity=".55" stroke-width="1.1">
                  <circle cx="210" cy="210" r="168"/>
                  <ellipse cx="210" cy="210" rx="168" ry="58"/>
                  <ellipse cx="210" cy="210" rx="168" ry="112"/>
                  <ellipse cx="210" cy="210" rx="58" ry="168"/>
                  <ellipse cx="210" cy="210" rx="112" ry="168"/>
                  <path d="M42 210h336M210 42v336"/>
                </g>
                <g fill="#e8d7ae">
                  <circle cx="150" cy="150" r="3"/><circle cx="255" cy="128" r="2.4"/><circle cx="300" cy="215" r="3.4"/>
                  <circle cx="130" cy="255" r="2.6"/><circle cx="205" cy="300" r="3"/><circle cx="245" cy="255" r="2.2"/>
                  <circle cx="330" cy="160" r="2.2"/><circle cx="95" cy="190" r="2.2"/>
                </g>
                <g stroke="#7fe0bd" stroke-opacity=".5" stroke-width="1" fill="none">
                  <path d="M150 150 Q200 120 255 128"/><path d="M255 128 Q290 170 300 215"/><path d="M130 255 Q170 300 205 300"/>
                </g>
              </svg>
              <div class="float-card float-card--a"><span class="fc-label">${t("Fully funded")}</span><b>${t("Tuition + stipend")}</b><span class="fc-sub">${t("Chevening · UK")}</span></div>
              <div class="float-card float-card--b"><span class="fc-label">${t("Estimated net cost")}</span><b>$0<small>${t("/year")}</small></b><span class="fc-sub">${t("After funding")}</span></div>
              <div class="float-card float-card--c"><span class="fc-label">${t("Deadline")}</span><b>${I.date(chev.deadline)}</b><span class="fc-sub">${t("{n} days left", { n: chevDays })}</span></div>
            </div>
          </div>
        </div>
        <div class="hero-stats">
          <div><b>${D.SCHOLARSHIPS.length}+</b><span>${t("curated scholarships")}</span></div>
          <div><b>${D.DESTINATIONS.length}</b><span>${t("study destinations")}</span></div>
          <div><b>${D.UNIVERSITIES.length}</b><span>${t("universities")}</span></div>
          <div><b>${I.LANGS.length}</b><span>${t("languages")}</span></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><div class="eyebrow">${t("Where will you go?")}</div><h2>${t("Study somewhere that changes the maths.")}</h2></div>
          <a class="btn btn--ghost" href="#/destinations">${t("All destinations")}${icon("arrow", "i-sm")}</a></div>
        <div class="dest-grid">${topDests.map((d) => destCard(d, true)).join("")}</div>
      </section>

      <section class="section section--sand">
        <div class="section-head"><div><div class="eyebrow">${t("Scholarships worth your time")}</div><h2>${t("Fully funded, open to international students.")}</h2>
          <p>${t("Every listing includes the estimated cost after funding, so you can compare the real price.")}</p></div>
          <a class="btn btn--ghost" href="#/scholarships">${t("Browse all scholarships")}${icon("arrow", "i-sm")}</a></div>
        <div class="sch-grid">${featured.map((s) => schCard(s)).join("")}</div>
      </section>

      <section class="section">
        <div class="calc-teaser">
          <div class="calc-copy"><div class="eyebrow">${t("Cost estimator")}</div>
            <h2>${t("Know the real cost before you fall in love with a university.")}</h2>
            <p>${t("Tuition, rent, insurance, visa and flights — in one number. Adjust the lifestyle and see how much you would need to save each month.")}</p>
            <a class="btn btn--primary" href="#/costs">${t("Open the calculator")}${icon("arrow", "i-sm")}</a>
          </div>
          <div class="calc-mini">
            <div class="calc-mini-form">
              <label>${t("Destination")}<select data-mini="dest">${D.DESTINATIONS.map((d) => `<option value="${d.id}"${mini.dest === d.id ? " selected" : ""}>${d.code} ${esc(d.name)}</option>`).join("")}</select></label>
              <label>${t("Level")}<select data-mini="level">${D.LEVELS.map((l) => `<option value="${l}"${mini.level === l ? " selected" : ""}>${l}</option>`).join("")}</select></label>
              <label>${t("Lifestyle")}<select data-mini="lifestyle">
                <option value="budget"${mini.lifestyle === "budget" ? " selected" : ""}>${t("Budget")}</option>
                <option value="standard"${mini.lifestyle === "standard" ? " selected" : ""}>${t("Standard")}</option>
                <option value="comfort"${mini.lifestyle === "comfort" ? " selected" : ""}>${t("Comfort")}</option>
              </select></label>
            </div>
            <div class="calc-mini-result">
              <span>${t("Estimated first-year total")}</span>
              <b>${U.money(mc.total)}</b>
              <div class="calc-mini-lines">
                <span>${t("Tuition")}<b>${U.money(mc.tuition)}</b></span>
                <span>${t("Living")}<b>${U.money(mc.living)}</b></span>
                <span>${t("Other costs")}<b>${U.money(mc.insurance + mc.oneTime)}</b></span>
              </div>
              <div class="tiny">${t("Estimates in {currency}. Actual costs vary by city and university.", { currency: I.state.currency })}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--dark">
        <div class="impact-split">
          <div><div class="eyebrow eyebrow--light">${t("Why we built this")}</div>
            <h2>${t("Talent is everywhere. Information is not.")}</h2>
            <p>${t("Most scholarship advice assumes a counsellor, a fast connection and a family that has done this before. SchoLink assumes none of that.")}</p>
            <a class="btn btn--light" href="#/impact">${t("Read our approach")}${icon("arrow", "i-sm")}</a></div>
          <div class="impact-points">
            <div><b>${t("One profile")}</b><span>${t("Grades, finances, language and location in one place.")}</span></div>
            <div><b>${t("Real cost")}</b><span>${t("Net price after funding, not the sticker price.")}</span></div>
            <div><b>${t("A plan")}</b><span>${t("Weekly steps from today to the deadline.")}</span></div>
            <div><b>${t("Your language")}</b><span>${t("27 languages and an offline mode.")}</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><div class="eyebrow">${t("New tools")}</div><h2>${t("Not just scholarships — everything you need to get in.")}</h2></div></div>
        <div class="grid grid-3">
          <div class="card card--pad"><div class="h3">${icon("graduation")}${t("University Discovery")}</div><p class="small muted mt-1">${t("Check your admission readiness for 80+ universities worldwide. IELTS per-category validation, pathway detection, and action plans.")}</p><a class="btn btn--sm btn--ghost mt-2" href="#/universities">${t("Explore universities")}</a></div>
          <div class="card card--pad"><div class="h3">${icon("book")}${t("Preparation Center")}</div><p class="small muted mt-1">${t("IELTS prep modules, SAT/GRE/UTBK guides, personal statement masterclass, study plans, and interview practice.")}</p><a class="btn btn--sm btn--ghost mt-2" href="#/prep">${t("Start preparing")}</a></div>
          <div class="card card--pad"><div class="h3">${icon("briefcase")}${t("Application Tracker")}</div><p class="small muted mt-1">${t("Track every application from research to acceptance. Set deadlines, update stages, and see your progress.")}</p><a class="btn btn--sm btn--ghost mt-2" href="#/tracker">${t("Track applications")}</a></div>
          <div class="card card--pad"><div class="h3">${icon("sparkle")}${t("AI Consultation")}</div><p class="small muted mt-1">${t("Get instant guidance on applications, funding, tests, visas, and Indonesian admissions.")}</p><a class="btn btn--sm btn--ghost mt-2" href="#/consult">${t("Ask a question")}</a></div>
          <div class="card card--pad"><div class="h3">${icon("wallet")}${t("Enhanced Cost Calculator")}</div><p class="small muted mt-1">${t("See every cost component: tuition, living, books, visa, residence permit, setup, and 36-month savings plans.")}</p><a class="btn btn--sm btn--ghost mt-2" href="#/costs">${t("Calculate costs")}</a></div>
          <div class="card card--pad"><div class="h3">${icon("globe")}${t("Indonesian Admissions")}</div><p class="small muted mt-1">${t("SNBP, SNBT, UTBK preparation, domestic scholarships, and PTN/PTS admission routes.")}</p><a class="btn btn--sm btn--ghost mt-2" href="#/indonesia">${t("Indonesia routes")}</a></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><div class="eyebrow">${t("How it works")}</div><h2>${t("From profile to funded application.")}</h2></div></div>
        <div class="steps-grid">
          <div class="step-card"><span class="step-num">01</span><h3>${t("Build your profile")}</h3><p>${t("Four short steps. No account, no fee, and nothing leaves your device.")}</p></div>
          <div class="step-card"><span class="step-num">02</span><h3>${t("See your matches")}</h3><p>${t("Ranked by eligibility, funding and the cost you would actually pay.")}</p></div>
          <div class="step-card"><span class="step-num">03</span><h3>${t("Follow the plan")}</h3><p>${t("Close your gaps, save the gap, and apply before the deadline.")}</p></div>
        </div>
      </section>

      <section class="section section--sand">
        <div class="faq-wrap"><div><div class="eyebrow">${t("Questions")}</div><h2>${t("Good to know")}</h2></div>
          <div class="faq">
            <details open><summary>${t("Is SchoLink really free?")}</summary><p>${t("Yes. There is no account, no paywall and no commission. The prototype runs entirely in your browser.")}</p></details>
            <details><summary>${t("How accurate are the costs?")}</summary><p>${t("They are planning estimates built from public tuition and living-cost ranges. Universities and cities vary, so verify before you commit.")}</p></details>
            <details><summary>${t("Can I use it on a slow connection?")}</summary><p>${t("Yes. There are no images or web fonts, and you can switch on data-saver mode or save your plan for offline use.")}</p></details>
            <details><summary>${t("Does SchoLink apply for me?")}</summary><p>${t("No. It prepares you and links to the official application. You always apply directly to the provider.")}</p></details>
          </div>
        </div>
      </section>

      <section class="cta-band">
        <div><h2>${t("Your first match takes four minutes.")}</h2><p>${t("No account. No cost. Just a clearer next step.")}</p></div>
        <a class="btn btn--primary btn--lg" href="#/start">${t("Start free")}${icon("arrow", "i-sm")}</a>
      </section>
    </main>`;
  }

  function stateLevel() {
    return "Master";
  }

  /* --------------------------------------------------------------- destinations */
  function destinations(state) {
    const regions = ["All"].concat(Array.from(new Set(D.DESTINATIONS.map((d) => d.region))));
    const list = state.destRegion === "All" ? D.DESTINATIONS : D.DESTINATIONS.filter((d) => d.region === state.destRegion);
    return `<main>
      ${pageHero(t("Destinations"), t("Where could you study?"),
        t("Compare tuition, living costs and work rights across {n} destinations — then see which scholarships make them affordable.", { n: D.DESTINATIONS.length }))}
      <section class="section section--tight">
        <div class="chips-row">${regions.map((r) => `<button class="chip${state.destRegion === r ? " active" : ""}" data-action="dest-region" data-value="${esc(r)}">${esc(r)}</button>`).join("")}</div>
        <div class="dest-grid dest-grid--all">${list.map((d) => destCard(d)).join("")}</div>
        <p class="tiny mt-3">${t("Costs are annual estimates for a standard lifestyle at a public university, in {currency}. They exclude scholarships.", { currency: I.state.currency })}</p>
      </section>
    </main>`;
  }

  /* --------------------------------------------------------------- scholarships */
  function scholarships(state) {
    const f = state.filters;
    let rows = D.SCHOLARSHIPS.map((s) => {
      const level = f.level === "Any" ? (s.level[0] || "Master") : f.level;
      const cost = E.scholarshipCost(s, state.profile, { level });
      return { scholarship: s, cost };
    });
    if (f.level !== "Any") rows = rows.filter((r) => r.scholarship.level.indexOf(f.level) >= 0);
    if (f.dest !== "Any") rows = rows.filter((r) => r.scholarship.dest === f.dest);
    if (f.field !== "Any") rows = rows.filter((r) => r.scholarship.fields.indexOf("*") >= 0 || r.scholarship.fields.indexOf(f.field) >= 0);
    if (f.funding !== "Any") rows = rows.filter((r) => r.scholarship.funding === f.funding);
    if (f.q) {
      const q = f.q.toLowerCase();
      rows = rows.filter((r) => (r.scholarship.name + " " + r.scholarship.provider).toLowerCase().indexOf(q) >= 0);
    }
    if (state.profile) {
      rows = rows.map((r) => {
        const m = E.matchScore(state.profile, r.scholarship);
        return Object.assign({}, r, { score: m.score, reasons: m.reasons, status: m.status });
      }).sort((a, b) => b.score - a.score);
    } else {
      rows.sort((a, b) => a.cost.net - b.cost.net);
    }

    return `<main>
      ${pageHero(t("Scholarships"), t("{n} scholarships, ranked for real life", { n: rows.length }),
        t("Filter by level, destination and funding. Every card shows the estimated cost after the award."))}
      <section class="section section--tight">
        <div class="filter-bar">
          <div class="filter-search">${icon("search", "i-sm")}<input value="${esc(f.q)}" placeholder="${t("Search scholarships or providers")}" data-action="filter-q"></div>
          <div class="filter-group"><span>${t("Level")}</span><div class="chips-row">${["Any"].concat(D.LEVELS).map((l) => `<button class="chip${f.level === l ? " active" : ""}" data-action="filter" data-field="level" data-value="${l}">${l === "Any" ? t("All") : l}</button>`).join("")}</div></div>
          <div class="filter-group"><span>${t("Funding")}</span><div class="chips-row">
            ${[["Any", t("All")], ["full", t("Fully funded")], ["partial", t("Partial")]].map((x) => `<button class="chip${f.funding === x[0] ? " active" : ""}" data-action="filter" data-field="funding" data-value="${x[0]}">${x[1]}</button>`).join("")}
          </div></div>
          <div class="filter-group"><span>${t("Destination")}</span><select data-filter="dest" class="select select--sm">
            <option value="Any">${t("Any destination")}</option>
            ${D.DESTINATIONS.map((d) => `<option value="${d.id}"${f.dest === d.id ? " selected" : ""}>${d.code} ${esc(d.name)}</option>`).join("")}
          </select></div>
        </div>
        <div class="results-line"><span>${t("{n} results", { n: rows.length })}</span><span class="tiny">${t("Costs shown for {level}", { level: f.level === "Any" ? t("each program's level") : f.level })}</span></div>
        <div class="sch-grid sch-grid--list">${rows.length ? rows.map((r) => schCard(r)).join("") : emptyState("search", t("No scholarships match those filters"), t("Try a different level or destination."), `<button class="btn btn--ghost" data-action="reset-filters">${t("Reset filters")}</button>`)}</div>
      </section>
    </main>`;
  }

  /* --------------------------------------------------------------------- costs */
  function costs(state) {
    const c = state.calc;
    const cost = E.costEstimate(c.dest, c.level, { lifestyle: c.lifestyle });
    const s = c.scholarship ? E.byId(D.SCHOLARSHIPS, c.scholarship) : null;
    const funding = s ? E.scholarshipCost(s, state.profile, { level: c.level, lifestyle: c.lifestyle }) : null;
    const net = funding ? funding.net : cost.total;
    const compare = D.DESTINATIONS.map((d) => ({ d, c: E.costEstimate(d.id, c.level, { lifestyle: c.lifestyle }) })).sort((a, b) => a.c.total - b.c.total);
    const max = compare[compare.length - 1].c.total;
    return `<main>
      ${pageHero(t("Cost calculator"), t("What will it actually cost?"),
        t("Choose a destination and level. Add a scholarship to see the funding gap and the monthly savings you would need."))}
      <section class="section section--tight">
        <div class="calc-layout">
          <div class="card card--pad calc-form">
            <div class="field"><label>${t("Destination")}</label><select data-calc="dest" class="select">${D.DESTINATIONS.map((d) => `<option value="${d.id}"${c.dest === d.id ? " selected" : ""}>${d.code} ${esc(d.name)}</option>`).join("")}</select></div>
            <div class="field"><label>${t("Level")}</label><div class="chips-row">${D.LEVELS.map((l) => `<button class="chip${c.level === l ? " active" : ""}" data-action="calc-level" data-value="${l}">${l}</button>`).join("")}</div></div>
            <div class="field"><label>${t("Lifestyle")}</label><div class="chips-row">
              ${[["budget", t("Budget")], ["standard", t("Standard")], ["comfort", t("Comfort")]].map((x) => `<button class="chip${c.lifestyle === x[0] ? " active" : ""}" data-action="calc-lifestyle" data-value="${x[0]}">${x[1]}</button>`).join("")}
            </div><div class="hint">${t("Budget trims rent and daily spending by about 22%. Comfort adds 32%.")}</div></div>
            <div class="field"><label>${t("Add a scholarship (optional)")}</label><select data-calc="scholarship" class="select">
              <option value="">${t("No scholarship — full price")}</option>
              ${D.SCHOLARSHIPS.map((x) => `<option value="${x.id}"${c.scholarship === x.id ? " selected" : ""}>${esc(x.name)} (${esc(dest(x.dest).name)})</option>`).join("")}
            </select></div>
            <div class="cost-note">${icon("info", "i-sm")}<span>${t("Estimates use the mid-point of public tuition ranges and a 12-month living budget.")}</span></div>
          </div>
          <div class="calc-output">
            <div class="calc-total"><span>${t("Estimated net cost")}</span><b>${U.money(net)}</b><em>${t("per year")} · ${yearsLabel(cost.duration)}</em></div>
            <div class="calc-sub"><span>${t("Total programme (" + cost.duration + " years)")}</span><b>${U.money(net * cost.duration)}</b></div>
            ${funding ? `<div class="funding-box">${icon("sparkle", "i-sm")}<div><b>${esc(s.name)}</b><span>${t("Covers")} ${U.money(funding.funding)} ${t("of the first year")}</span></div></div>` : ""}
            <div class="card card--pad">${costBreakdown(cost, funding)}
              ${funding ? `<div class="cost-summary"><span>${t("Funding")}</span><b>− ${U.money(funding.funding)}</b></div><div class="cost-summary cost-summary--net"><span>${t("Net cost")}</span><b>${U.money(funding.net)}</b></div>` : ""}
            </div>
            ${net > 0 ? `<div class="savings-card">
              <div>${t("To cover {amount} in 12 months", { amount: U.money(net) })}<b>${U.money(Math.ceil(net / 12))} / ${t("month")}</b></div>
              <div>${t("In 24 months")}<b>${U.money(Math.ceil(net / 24))} / ${t("month")}</b></div>
              <div>${t("In 36 months")}<b>${U.money(Math.ceil(net / 36))} / ${t("month")}</b></div>
            </div>` : `<div class="insight">${icon("checkCircle", "i-sm")}<span>${t("This award covers the core costs. You still need spending money and a buffer for arrival.")}</span></div>`}
            <div class="tiny">${t("Prices in {currency}, converted at indicative rates. Confirm tuition with each university.", { currency: I.state.currency })}</div>
          </div>
        </div>

        <div class="compare-card card card--pad">
          <div class="spread"><h3>${t("Same budget, different countries")}</h3><span class="tiny">${t("{level} · {lifestyle} lifestyle · per year", { level: c.level, lifestyle: c.lifestyle })}</span></div>
          <div class="compare-list">${compare.map((x) => `<button class="compare-row${x.d.id === c.dest ? " active" : ""}" data-action="calc-dest" data-value="${x.d.id}">
            <span class="cmp-flag">${x.d.code}</span><span class="cmp-name">${esc(x.d.name)}</span>
            <span class="cmp-bar"><i style="width:${Math.max(4, Math.round((x.c.total / max) * 100))}%"></i></span>
            <b>${U.money(x.c.total)}</b>${icon("chevronRight", "i-sm")}
          </button>`).join("")}</div>
        </div>
        <div class="cta-inline"><div><b>${t("Want the cost after a scholarship?")}</b><span>${t("Match your profile to fully funded programmes.")}</span></div><a class="btn btn--primary" href="#/start">${t("Find funding")}</a></div>
      </section>
    </main>`;
  }

  /* -------------------------------------------------------------------- impact */
  function impact(state) {
    const weights = [["Academic fit", 25], ["Financial need", 18], ["Equity & location", 18], ["Test readiness", 15], ["Field fit", 6], ["Peer signal", 15], ["Selectivity", 3]];
    return `<main>
      <section class="impact-hero">
        <div class="impact-hero-inner">
          <div class="eyebrow eyebrow--light">${t("Our approach")}</div>
          <h1>${t("A scholarship should not be a secret.")}</h1>
          <p>${t("SchoLink is an independent, free tool for students who are navigating international education without a counsellor, a network, or a safety net.")}</p>
          <div class="impact-stats">
            <div><b>${D.SCHOLARSHIPS.length}</b><span>${t("programmes checked by hand")}</span></div>
            <div><b>${D.DESTINATIONS.length}</b><span>${t("destinations compared")}</span></div>
            <div><b>${I.LANGS.length}</b><span>${t("languages supported")}</span></div>
            <div><b>0</b><span>${t("fees, ever")}</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="split-even">
          <div><div class="eyebrow">${t("The gap")}</div><h2>${t("Information is the first tuition fee.")}</h2>
            <p>${t("A student with the same grades can face wildly different futures depending on whether an adult in their life knows how funding works. That is not a talent gap. It is an information gap.")}</p>
            <p>${t("We built SchoLink to make the invisible parts visible: which awards you are eligible for, what they actually cover, what is left to pay, and what to do this week.")}</p></div>
          <div class="principle-grid">
            <div class="principle"><span>${icon("shield")}</span><h3>${t("Honest numbers")}</h3><p>${t("Sticker price means nothing. We show the net cost and the gap.")}</p></div>
            <div class="principle"><span>${icon("wifiOff")}</span><h3>${t("Low bandwidth first")}</h3><p>${t("No images, no web fonts, offline mode and a data-saver switch.")}</p></div>
            <div class="principle"><span>${icon("globe")}</span><h3>${t("Locally readable")}</h3><p>${t("27 languages, right-to-left support and plain-English requirements.")}</p></div>
            <div class="principle"><span>${icon("lock")}</span><h3>${t("Private by default")}</h3><p>${t("Your profile stays in your browser. No tracking, no upload.")}</p></div>
          </div>
        </div>
      </section>

      <section class="section section--sand">
        <div class="section-head"><div><div class="eyebrow">${t("Method")}</div><h2>${t("How a match is scored")}</h2><p>${t("Transparent weights, hard eligibility filters, and a peer signal — so a high score means fewer gaps, not a guarantee.")}</p></div></div>
        <div class="method-grid">
          <div class="card card--pad"><div class="bars">${bars(weights.map((w) => ({ label: w[0], value: w[1] })))}</div>
            <div class="tiny mt-2">${t("Scores are deterministic and auditable. Eligibility is checked first: level, minimum GPA, English score, income caps, nationality and work experience.")}</div></div>
          <div class="stack">
            <div class="method-note"><b>${t("1. Hard filters")}</b><span>${t("If you cannot apply, the programme is not shown as a match.")}</span></div>
            <div class="method-note"><b>${t("2. Cost model")}</b><span>${t("Tuition mid-point + living + insurance + visa + flights, minus the award's coverage.")}</span></div>
            <div class="method-note"><b>${t("3. Equity signal")}</b><span>${t("Region, connectivity and first-generation status are treated as strengths, not penalties.")}</span></div>
            <div class="method-note"><b>${t("4. Peer signal")}</b><span>${t("Your profile is compared with eight student archetypes and the programmes they save.")}</span></div>
          </div>
        </div>
        <div class="insight mt-3">${icon("alert", "i-sm")}<span>${t("This is a prototype. Costs, deadlines and eligibility are indicative and may change. Always verify with the official provider.")}</span></div>
      </section>

      <section class="section">
        <div class="faq-wrap"><div><div class="eyebrow">${t("Data & trust")}</div><h2>${t("What we do with your data")}</h2>
          <p>${t("Nothing. Your profile is stored in your browser and never sent to a server. You can export or delete it at any time.")}</p></div>
          <div class="faq">
            <details open><summary>${t("Where do the costs come from?")}</summary><p>${t("Public tuition ranges, national living-cost guidance and visa fees, converted to USD. We use mid-points, not the cheapest or most expensive case.")}</p></details>
            <details><summary>${t("How often are deadlines updated?")}</summary><p>${t("This prototype uses a curated 2027 cycle. In production, deadlines would sync with official provider feeds.")}</p></details>
            <details><summary>${t("Can universities pay to be listed?")}</summary><p>${t("No. Listings are selected for funding and eligibility, not for commission.")}</p></details>
          </div>
        </div>
      </section>
      <section class="cta-band"><div><h2>${t("Start with your real profile.")}</h2><p>${t("Four minutes. No account. See your matches and your funding gap.")}</p></div>
        <a class="btn btn--primary btn--lg" href="#/start">${t("Start free")}${icon("arrow", "i-sm")}</a></section>
    </main>`;
  }

  /* ------------------------------------------------------------------- start */
  function start(state) {
    const step = state.step;
    const d = state.draft;
    const info = [
      ["About you", "Where you are and how you connect."],
      ["Study plans", "Level, field and academic record."],
      ["Finances", "What your family can contribute."],
      ["Targets", "Where you want to go."],
    ];
    const steps = info.map((x, i) => `<div class="ostep${i + 1 === step ? " active" : ""}${i + 1 < step ? " done" : ""}">
      <div class="onum">${i + 1 < step ? "✓" : i + 1}</div><div><div class="ot">${t(x[0])}</div><div class="od">${t(x[1])}</div></div></div>`).join("");

    let body = "";
    if (step === 1) body = stepOne(state);
    else if (step === 2) body = stepTwo(state);
    else if (step === 3) body = stepThree(state);
    else body = stepFour(state);

    return `<div class="onboard">
      <aside class="onboard-aside">
        <a class="site-brand site-brand--light" href="#/"><span class="brand-mark">S</span><span class="brand-text"><b>SchoLink</b><small>${t("Scholarships without borders")}</small></span></a>
        <div class="onboard-hero"><h2>${t("Let's find your funding.")}</h2><p>${t("Four dimensions: academics, finances, language and location. The more honest you are, the sharper the matches.")}</p></div>
        <div class="onboard-steps">${steps}</div>
        <div class="onboard-quote">${t("“Talent is everywhere. Information is not.”")}</div>
        <div class="onboard-tools"><label class="tool-select tool-select--dark">${icon("language", "i-sm")}<select data-action="lang">${langOptions()}</select></label>
          <label class="tool-select tool-select--dark">${icon("walletCard", "i-sm")}<select data-action="currency">${curOptions()}</select></label></div>
      </aside>
      <div class="onboard-main">
        <div class="onboard-top"><div class="crumb">${t("Step {n} of 4", { n: step })}</div><div class="progress-line"><span style="width:${step * 25}%"></span></div>
          <a class="btn btn--sm btn--ghost" href="${state.profile ? "#/dashboard" : "#/"}">${t("Exit")}</a></div>
        <form data-form="onboard" onsubmit="return false">${body}</form>
      </div>
    </div>`;
  }

  function stepOne(state) {
    const d = state.draft;
    return `<div class="card card--pad reveal">
      <div class="eyebrow">${t("Step 1 · About you")}</div><h2>${t("Where are you starting from?")}</h2>
      <p class="sub">${t("This changes which scholarships you are eligible for and how we estimate the cost.")}</p>
      <div class="grid grid-2 mt-3">
        <div class="field"><label>${t("First name")}</label><input class="input" data-bind="name" value="${esc(d.name)}" placeholder="${t("e.g. Maria")}" autocomplete="off"></div>
        <div class="field"><label>${t("Country of origin")}</label><select class="select" data-bind="origin">${D.ORIGINS.map((o) => `<option value="${o.id}"${d.origin === o.id ? " selected" : ""}>${o.code} ${esc(o.name)}</option>`).join("")}</select></div>
      </div>
      <div class="grid grid-2 mt-2" style="align-items:start">
        <div class="field"><span class="label">${t("Where do you live?")}</span><div class="choice-grid">
          ${D.REGION_TYPES.map((r) => `<button type="button" class="choice${d.regionType === r.id ? " active" : ""}" data-action="pick" data-field="regionType" data-value="${r.id}"><span class="choice-dot"></span><span><span class="t">${t(r.name)}</span><span class="d">${t(r.id === "rural" ? "Travel and internet are part of the plan" : r.id === "small" ? "A smaller city or town" : "Reliable services nearby")}</span></span></button>`).join("")}
        </div></div>
        <div class="field"><span class="label">${t("Internet at home")}</span><div class="choice-grid">
          ${D.CONNECTIVITY.map((c) => `<button type="button" class="choice${d.connectivity === c.id ? " active" : ""}" data-action="pick" data-field="connectivity" data-value="${c.id}"><span class="choice-dot"></span><span><span class="t">${t(c.name)}</span><span class="d">${t(c.id === "low" ? "We will favour low-bandwidth options" : c.id === "mixed" ? "Enough for most applications" : "Video calls and uploads are easy")}</span></span></button>`).join("")}
        </div></div>
      </div>
      <div class="wizard-foot"><a class="btn btn--ghost" href="#/">${icon("arrow", "i-sm")}${t("Back")}</a>
        <button class="btn btn--primary" data-action="next">${t("Continue")}${icon("arrow", "i-sm")}</button></div>
    </div>`;
  }

  function stepTwo(state) {
    const d = state.draft;
    const scoreLabel = d.englishType === "TOEFL" ? t("TOEFL iBT score") : d.englishType === "Duolingo" ? t("Duolingo score") : d.englishType === "IELTS" ? t("IELTS band") : t("No test yet");
    var gpaHint = d.curriculum === "ib" ? t("IB total points (0–45)") : d.curriculum === "ap" ? t("AP exam average (1–5)") : d.curriculum === "wace" ? t("ATAR score (0–99.95)") : d.curriculum === "cambridge" ? t("A-Level average or numeric grade") : t("Use the scale your school reports. We convert 0–4, not percentages.");
    var gpaMax = d.curriculum === "ib" ? 45 : d.curriculum === "ap" ? 5 : d.curriculum === "wace" ? 100 : 4;
    var tests = d.tests || {};
    return `<div class="card card--pad reveal">
      <div class="eyebrow">${t("Step 2 · Study plans")}</div><h2>${t("What do you want to study?")}</h2>
      <p class="sub">${t("We check your grades and English level against every programme before we recommend it.")}</p>
      <div class="field mt-3"><span class="label">${t("Level")}</span><div class="choice-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">
        ${D.LEVELS.map((l) => `<button type="button" class="choice${d.level === l ? " active" : ""}" data-action="pick" data-field="level" data-value="${l}"><span class="choice-dot"></span><span><span class="t">${l}</span><span class="d">${t(l === "Bachelor" ? "Undergraduate" : l === "Master" ? "Postgraduate" : "Doctoral research")}</span></span></button>`).join("")}
      </div></div>
      <div class="grid grid-2 mt-3">
        <div class="field"><label>${t("Field of study")}</label><select class="select" data-bind="field">${D.FIELDS.map((f) => `<option value="${f.id}"${d.field === f.id ? " selected" : ""}>${t(f.name)}</option>`).join("")}</select></div>
        <div class="field"><label>${t("Curriculum / school system")}</label><select class="select" data-bind="curriculum">
          ${(D.CURRICULA || []).map((c) => `<option value="${c.id}"${d.curriculum === c.id ? " selected" : ""}>${t(c.name)}</option>`).join("")}
        </select><div class="hint">${t("We interpret your grades in-context — no universal 4.0 conversion.")}</div></div>
      </div>
      <div class="grid grid-2 mt-2">
        <div class="field"><label>${t("Grade point average")}</label><input class="input" type="number" min="0" max="${gpaMax}" step="0.05" data-bind="gpa" value="${d.gpa}"><div class="hint">${gpaHint}</div></div>
        <div class="field"><label>${t("Class rank (optional)")}</label><input class="input" type="text" data-bind="classRank" value="${esc(d.classRank || "")}" placeholder="${t("e.g. 5th of 120")}"><div class="hint">${t("If your school ranks, enter your position.")}</div></div>
      </div>
      <div class="grid grid-3 mt-2">
        <div class="field"><label>${t("English test")}</label><select class="select" data-bind="englishType">
          ${["IELTS", "TOEFL", "Duolingo", "None"].map((x) => `<option value="${x}"${d.englishType === x ? " selected" : ""}>${x === "None" ? t("Not taken yet") : x}</option>`).join("")}
        </select></div>
        <div class="field"><label>${esc(scoreLabel)}</label><input class="input" type="number" step="0.5" min="0" max="120" data-bind="englishScore" value="${d.englishScore}"${d.englishType === "None" ? " disabled" : ""}></div>
        <div class="field"><label>${t("Years of work experience")}</label><input class="input" type="number" min="0" max="30" step="1" data-bind="workYears" value="${d.workYears}"></div>
      </div>
      <div class="field mt-2"><span class="label">${t("Standardized test status")}</span><div class="hint mb-1">${t("Tell us which tests you have taken, registered for, or are planning. Missing tests will not disqualify you — they help us plan.")}</div>
        <div class="test-status-grid">
          ${(D.STANDARD_TESTS || []).filter(function (st) { return st.type === "english" || st.type === "aptitude" || st.type === "graduate"; }).map(function (st) {
            var entry = tests[st.id] || { status: "na" };
            return `<div class="test-row"><div class="test-name">${st.name}</div>
              <select class="select select--sm" data-action="test-status" data-test="${st.id}">
                ${(D.TEST_STATUSES || []).map(function (ts) { return `<option value="${ts.id}"${entry.status === ts.id ? " selected" : ""}>${t(ts.name)}</option>`; }).join("")}
              </select>
              <input class="input input--sm" type="number" placeholder="${t("Score")}" data-action="test-score" data-test="${st.id}" value="${entry.score || ""}"${entry.status !== "taken" ? " disabled" : ""}>
            </div>`;
          }).join("")}
        </div>
      </div>
      <div class="wizard-foot"><button class="btn btn--ghost" data-action="back">${icon("arrow", "i-sm")}${t("Back")}</button>
        <button class="btn btn--primary" data-action="next">${t("Continue")}${icon("arrow", "i-sm")}</button></div>
    </div>`;
  }

  function stepThree(state) {
    const d = state.draft;
    return `<div class="card card--pad reveal">
      <div class="eyebrow">${t("Step 3 · Finances")}</div><h2>${t("What can your family realistically contribute?")}</h2>
      <p class="sub">${t("This is the most important question for need-based scholarships. It stays on your device.")}</p>
      <div class="grid grid-2 mt-3">
        <div class="field"><label>${t("Annual family income")}</label><select class="select" data-bind="incomeBand">${D.INCOME_BANDS.map((b) => `<option value="${b.id}"${d.incomeBand === b.id ? " selected" : ""}>${t(b.name)}</option>`).join("")}</select></div>
        <div class="field"><label>${t("Gender")}</label><select class="select" data-bind="gender">
          ${[["woman", t("Woman")], ["man", t("Man")], ["nonbinary", t("Non-binary")], ["na", t("Prefer not to say")]].map((g) => `<option value="${g[0]}"${d.gender === g[0] ? " selected" : ""}>${g[1]}</option>`).join("")}
        </select><div class="hint">${t("Some awards are reserved for women in STEM.")}</div></div>
      </div>
      <div class="field mt-2"><label>${t("Maximum tuition you could afford per year (USD)")}</label><input class="input" type="number" min="0" step="500" data-bind="maxAffordableTuition" value="${d.maxAffordableTuition || 5000}"><div class="hint">${t("We use this to flag programmes that exceed your budget before funding.")}</div></div>
      <div class="toggle-row mt-2"><div><div class="strong small">${t("First in my family to attend university")}</div><div class="tiny">${t("Many scholarships prioritise first-generation students")}</div></div>
        <label class="toggle"><input type="checkbox" data-bind="firstGen"${d.firstGen ? " checked" : ""}><span class="track"></span></label></div>
      <div class="toggle-row"><div><div class="strong small">${t("I need a full scholarship to study abroad")}</div><div class="tiny">${t("We will prioritise fully funded programmes")}</div></div>
        <label class="toggle"><input type="checkbox" data-bind="needAid"${d.needAid ? " checked" : ""}><span class="track"></span></label></div>
      <div class="wizard-foot"><button class="btn btn--ghost" data-action="back">${icon("arrow", "i-sm")}${t("Back")}</button>
        <button class="btn btn--primary" data-action="next">${t("Continue")}${icon("arrow", "i-sm")}</button></div>
    </div>`;
  }

  function stepFour(state) {
    const d = state.draft;
    const p = E.recommend ? null : null;
    const choices = D.DESTINATIONS;
    return `<div class="card card--pad reveal">
      <div class="eyebrow">${t("Step 4 · Targets")}</div><h2>${t("Where would you go if funding were solved?")}</h2>
      <p class="sub">${t("Pick up to four destinations. We will still show you everything else.")}</p>
      <div class="chips-row mt-3">${choices.map((x) => `<button type="button" class="chip${d.targets.indexOf(x.id) >= 0 ? " active" : ""}" data-action="pick-target" data-value="${x.id}">${x.code} ${esc(x.name)}</button>`).join("")}</div>
      <div class="grid grid-2 mt-3">
        <div class="field"><label>${t("What matters most?")}</label><select class="select" data-bind="priority">${D.PRIORITIES.map((x) => `<option value="${x.id}"${d.priority === x.id ? " selected" : ""}>${t(x.name)}</option>`).join("")}</select></div>
        <div class="field"><label>${t("Intake year")}</label><select class="select" data-bind="intake">${["2027", "2028", "2029"].map((y) => `<option value="${y}"${d.intake === y ? " selected" : ""}>${y}</option>`).join("")}</select></div>
      </div>
      <div class="field mt-2"><label>${t("Alternative fields of interest (optional)")}</label><input class="input" type="text" data-bind="altMajors" value="${esc((d.altMajors || []).join(", "))}" placeholder="${t("e.g. Data Science, Public Health, International Relations")}"><div class="hint">${t("Separate with commas. We will broaden matches where possible.")}</div></div>
      <div class="field mt-2"><label>${t("Extracurricular activities (optional)")}</label><input class="input" type="text" data-bind="extracurriculars" value="${esc((d.extracurriculars || []).join(", "))}" placeholder="${t("e.g. Student council, volunteer teaching, coding club")}"><div class="hint">${t("List clubs, leadership roles, competitions, volunteering.")}</div></div>
      <div class="profile-preview mt-3">
        <div class="pp-row"><span>${t("Name")}</span><b>${esc(d.name || t("Not set"))}</b></div>
        <div class="pp-row"><span>${t("Origin")}</span><b>${flag(d.origin)} ${esc(E.origin(d.origin).name)}</b></div>
        <div class="pp-row"><span>${t("Level")}</span><b>${d.level} · ${t(E.fieldName(d.field))}</b></div>
        <div class="pp-row"><span>${t("Curriculum")}</span><b>${(D.CURRICULA || []).find(function (c) { return c.id === d.curriculum; }) ? t(D.CURRICULA.find(function (c) { return c.id === d.curriculum; }).name) : d.curriculum}</b></div>
        <div class="pp-row"><span>${t("GPA")}</span><b>${d.gpa}</b></div>
        <div class="pp-row"><span>${t("English")}</span><b>${d.englishType === "None" ? t("Not taken") : d.englishType + " " + d.englishScore}</b></div>
        <div class="pp-row"><span>${t("Targets")}</span><b>${d.targets.length ? d.targets.map((x) => dest(x).code).join(" ") : t("Open to anywhere")}</b></div>
      </div>
      <div class="cost-note">${icon("lock", "i-sm")}<span>${t("Your answers stay in this browser. You can delete them in Settings.")}</span></div>
      <div class="wizard-foot"><button class="btn btn--ghost" data-action="back">${icon("arrow", "i-sm")}${t("Back")}</button>
        <button class="btn btn--primary" data-action="finish">${t("See my matches")}${icon("sparkle", "i-sm")}</button></div>
    </div>`;
  }

  global.Pages = {
    header, footer, home, destinations, scholarships, costs, impact, start,
    schCard, destCard, costBreakdown, reasonText, gapText, pageHero, emptyState, langOptions, curOptions,
  };
})(window);
