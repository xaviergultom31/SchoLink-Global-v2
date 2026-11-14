/* =========================================================================
   SchoLink Global — App screens (dashboard, matches, plan, settings) + drawers
   ========================================================================= */
(function (global) {
  "use strict";

  const D = global.SCHO;
  const E = global.SchoEngine;
  const U = global.UI;
  const I = global.I18n;
  const P = global.Pages;
  const t = (s, v) => I.t(s, v);
  const { icon, esc, ring, bars, badge, progress, deadlineChip, initials } = U;

  const NAV = [
    ["dashboard", "home", "Dashboard"],
    ["matches", "target", "My matches"],
    ["report", "file", "My report"],
    ["plan", "route", "My plan"],
    ["indonesia", "globe", "Indonesia"],
    ["destinations", "globe", "Destinations"],
    ["costs", "wallet", "Cost calculator"],
    ["settings", "settings", "Settings"],
  ];

  function appShell(state, active, content) {
    const p = state.profile;
    const rows = state.matches || [];
    const ready = rows.filter((r) => r.eligibility.eligible).length;
    const stat = E.profileStats(p);
    const nav = NAV.map((n) => `<a class="nav-link${active === n[0] ? " active" : ""}" href="#/${n[0]}">${icon(n[1])}<span>${t(n[2])}</span>${n[0] === "matches" ? `<span class="nav-badge">${ready}</span>` : ""}</a>`).join("");
    return `<div class="shell app-shell">
      <aside class="sidebar app-sidebar">
        <a class="site-brand site-brand--light" href="#/"><span class="brand-mark">S</span><span class="brand-text"><b>SchoLink</b><small>${t("Scholarships without borders")}</small></span></a>
        <div class="nav-group"><div class="nav-group-label">${t("Workspace")}</div><nav class="nav">${nav}</nav></div>
        <div class="sidebar-note">${t("Your profile and plan are stored in this browser only.")}</div>
        <div class="sidebar-profile"><div class="row" style="gap:9px"><div class="avatar">${esc(initials(p.name))}</div><div><div class="name">${esc(p.name)}</div><div class="meta">${E.origin(p.origin).code} ${esc(E.origin(p.origin).name)} · ${p.level}</div></div></div>
          <div class="sp-bar"><span style="width:${stat.strength}%"></span></div>
          <div class="sp-foot"><span>${t("Profile strength")}</span><b>${stat.strength}%</b></div>
        </div>
      </aside>
      <div class="main">
        <header class="topbar app-topbar">
          <div class="crumb"><a href="#/">SchoLink</a>${icon("chevronRight", "i-sm")}<b>${t(NAV.find((n) => n[0] === active)?.[2] || "Dashboard")}</b></div>
          <div class="topbar-right">
            <label class="tool-select tool-select--sm">${icon("language", "i-sm")}<select data-action="lang">${P.langOptions()}</select></label>
            <label class="tool-select tool-select--sm">${icon("walletCard", "i-sm")}<select data-action="currency">${P.curOptions()}</select></label>
            <button class="icon-btn" data-action="saver" title="${t("Data saver")}">${icon("wifiOff", "i-sm")}</button>
            <a class="avatar" href="#/settings" title="${esc(p.name)}">${esc(initials(p.name))}</a>
          </div>
        </header>
        ${content}
      </div>
    </div>
    ${mobileNav(active)}`;
  }

  function mobileNav(active) {
    return `<nav class="mobile-nav">${[["dashboard", "home"], ["matches", "target"], ["report", "file"], ["plan", "route"], ["indonesia", "globe"]].map((n) => `<a class="mnav-item${active === n[0] ? " active" : ""}" href="#/${n[0]}">${icon(n[1])}<span>${t(NAV.find((x) => x[0] === n[0])[2])}</span></a>`).join("")}</nav>`;
  }

  /* ---------------------------------------------------------------- dashboard */
  function dashboard(state) {
    const p = state.profile;
    const rows = state.matches;
    const stat = E.profileStats(p);
    const top = rows[0];
    const nearest = rows.slice().sort((a, b) => a.deadlineDays - b.deadlineDays)[0];
    const plan = state.planTarget ? E.planFor(p, state.planTarget) : null;
    const prog = state.progress[state.planTarget] || {};
    const done = plan ? plan.plan.filter((m) => prog[m.moduleId]).length : 0;
    const next = plan ? plan.plan.filter((m) => !prog[m.moduleId]).slice(0, 3) : [];
    const needsRtl = I.languageMeta(I.state.lang).dir === "rtl";

    return `<div class="page app-page">
      <div class="page-head">
        <div><div class="eyebrow">${t("Dashboard")}</div><h1 class="h1">${t("Hello, {name}.", { name: p.name.split(" ")[0] })}</h1>
          <p class="sub">${t("Here is what matters this week — your best matches, the nearest deadline, and the next three steps.")}</p></div>
        <div class="page-head-actions"><a class="btn btn--ghost" href="#/settings">${icon("settings", "i-sm")}${t("Edit profile")}</a><a class="btn btn--primary" href="#/matches">${t("See all matches")}</a></div>
      </div>

      <div class="grid grid-4">
        ${U.statCard(t("Matches you can apply to"), String(rows.filter((r) => r.eligibility.eligible).length), t("of {n} checked", { n: rows.length }), "target")}
        ${U.statCard(t("Nearest deadline"), nearest ? t("{n} days", { n: nearest.deadlineDays }) : "—", nearest ? esc(nearest.scholarship.name) : t("None yet"), "clock", "amber")}
        ${U.statCard(t("Funding gap"), top ? U.money(top.cost.net) : "—", top ? t("per year for your top match") : t("Build a profile"), "wallet", "blue")}
        ${U.statCard(t("Plan progress"), plan ? done + "/" + plan.plan.length : "—", plan ? t("modules completed") : t("Choose a target"), "route")}
      </div>

      <div class="split mt-3">
        <div class="stack">
          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("sparkle")}${t("Top matches")}</div><a class="btn btn--sm btn--ghost" href="#/matches">${t("View all")}${icon("arrow", "i-sm")}</a></div>
            <div class="sch-grid sch-grid--single">${rows.slice(0, 2).map((r) => P.schCard(r, { compact: true })).join("")}</div>
          </div>

          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("route")}${t("Your plan")}</div>${plan ? badge(plan.scholarship.name, "outline") : ""}</div>
            ${plan ? `<div class="spread"><div><div class="tiny">${t("Readiness")}</div><div class="stat-num small-num">${plan.readiness}%</div></div><div class="tiny">${done} / ${plan.plan.length} ${t("modules")}</div></div>
              ${progress((done / plan.plan.length) * 100, "mt-2")}
              <div class="list mt-2">${next.length ? next.map((m) => `<div class="list-item"><div class="li-icon">${icon("book", "i-sm")}</div><div><div class="li-title">${esc(m.title)}</div><div class="li-sub">${t("Week")} ${m.week} · ${m.hours} ${t("hours")}</div></div><div class="li-right"><a class="btn btn--sm btn--soft" href="#/plan">${t("Open")}</a></div></div>`).join("") : `<div class="insight">${icon("checkCircle", "i-sm")}<span>${t("Every module is complete. Now polish your documents and submit early.")}</span></div>`}</div>`
              : `<p class="small muted">${t("Pick one scholarship as your target and we will build a week-by-week plan.")}</p><a class="btn btn--primary btn--block mt-2" href="#/plan">${t("Choose a target")}</a>`}
          </div>
        </div>

        <div class="stack">
          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("user")}${t("Your profile")}</div><a class="btn btn--sm btn--ghost" href="#/settings">${t("Edit")}</a></div>
            <div class="row" style="gap:10px"><span class="profile-flag">${E.origin(p.origin).code}</span><div><div class="strong">${esc(E.origin(p.origin).name)}</div><div class="tiny">${t(p.regionType === "rural" ? "Rural or remote" : p.regionType === "small" ? "Small city" : "Major city")} · ${p.level}</div></div></div>
            <div class="mt-3">${bars([
              { label: t("Academics"), value: stat.vector[0] },
              { label: t("English"), value: stat.vector[1] },
              { label: t("Financial need"), value: stat.vector[2] },
              { label: t("Equity"), value: stat.vector[3] },
              { label: t("Ambition"), value: stat.vector[4] },
            ])}</div>
            <div class="mini-grid">
              <div class="mini-stat"><b>${Number(p.gpa).toFixed(2)}</b><span>${t("GPA")}</span></div>
              <div class="mini-stat"><b>${stat.english || "—"}</b><span>${t("IELTS equiv.")}</span></div>
              <div class="mini-stat"><b>${U.money(stat.income)}</b><span>${t("Family income")}</span></div>
              <div class="mini-stat"><b>${p.workYears || 0}</b><span>${t("Work years")}</span></div>
            </div>
          </div>

          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("calendar")}${t("Deadlines")}</div></div>
            <div class="list">${rows.slice().sort((a, b) => a.deadlineDays - b.deadlineDays).slice(0, 4).map((r) => `<div class="list-item" data-action="open-scholarship" data-id="${r.scholarship.id}" style="cursor:pointer"><div class="li-icon">${icon("file", "i-sm")}</div><div><div class="li-title">${esc(r.scholarship.name)}</div><div class="li-sub">${esc(r.scholarship.provider)}</div></div><div class="li-right">${deadlineChip(r.deadlineDays)}</div></div>`).join("")}</div>
          </div>

          <div class="card card--pad card--dark">
            <div class="row" style="gap:8px">${icon("wifiOff", "i-sm")}<span class="tiny light">${t("LOW BANDWIDTH MODE")}</span></div>
            <div class="strong light mt-1">${t("Save this plan for offline use")}</div>
            <p class="tiny light-muted mt-1">${t("Download your matches and roadmap as a small file, or switch on data saver.")}</p>
            <button class="btn btn--sm btn--light mt-2" data-action="export">${icon("download", "i-sm")}${t("Download my plan")}</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ------------------------------------------------------------------ matches */
  function matches(state) {
    const p = state.profile;
    let rows = state.matches.slice();
    if (state.matchFilter === "full") rows = rows.filter((r) => r.scholarship.funding === "full");
    if (state.matchFilter === "saved") rows = rows.filter((r) => state.saved.indexOf(r.scholarship.id) >= 0);
    if (state.matchSort === "net") rows.sort((a, b) => a.cost.net - b.cost.net);
    else if (state.matchSort === "deadline") rows.sort((a, b) => a.deadlineDays - b.deadlineDays);
    else rows.sort((a, b) => b.score - a.score);

    return `<div class="page app-page">
      <div class="page-head"><div><div class="eyebrow">${t("My matches")}</div><h1 class="h1">${t("Where you can actually win.")}</h1>
        <p class="sub">${t("Ranked by eligibility, funding and the cost you would really pay. A high score means fewer gaps — not a guarantee.")}</p></div>
        <div class="page-head-actions"><a class="btn btn--ghost" href="#/costs">${icon("wallet", "i-sm")}${t("Compare costs")}</a></div></div>

      <div class="match-toolbar">
        <div class="chips-row">
          ${[["all", t("All matches")], ["full", t("Fully funded")], ["saved", t("Saved")]].map((x) => `<button class="chip${state.matchFilter === x[0] ? " active" : ""}" data-action="match-filter" data-value="${x[0]}">${x[1]}</button>`).join("")}
        </div>
        <label class="tool-select">${icon("sliders", "i-sm")}<select data-action="match-sort">
          <option value="score"${state.matchSort === "score" ? " selected" : ""}>${t("Best match")}</option>
          <option value="net"${state.matchSort === "net" ? " selected" : ""}>${t("Lowest net cost")}</option>
          <option value="deadline"${state.matchSort === "deadline" ? " selected" : ""}>${t("Closest deadline")}</option>
        </select></label>
      </div>

      ${rows.length ? `<div class="sch-grid sch-grid--list mt-2">${rows.map((r) => `<div class="match-wrap">${P.schCard(r)}
        <div class="match-actions"><label class="rm-check"><input type="checkbox" data-action="save" data-id="${r.scholarship.id}"${state.saved.indexOf(r.scholarship.id) >= 0 ? " checked" : ""}> ${t("Save")}</label>
        <span class="tiny">${r.eligibility.eligible ? t("Eligible") : t("One gap to close")} · ${t("Net cost")} ${U.money(r.cost.net)}/${t("year")}</span>
        <button class="btn btn--sm btn--soft" data-action="plan-target" data-id="${r.scholarship.id}">${t("Build my plan")}</button></div></div>`).join("")}</div>`
        : P.emptyState("search", t("No matches in this filter"), t("Try another filter or update your profile."), `<button class="btn btn--ghost" data-action="match-filter" data-value="all">${t("Show all")}</button>`)}
    </div>`;
  }

  /* --------------------------------------------------------------------- plan */
  function plan(state) {
    const p = state.profile;
    if (!state.planTarget) {
      const options = state.matches.slice(0, 6);
      return `<div class="page app-page">
        <div class="page-head"><div><div class="eyebrow">${t("My plan")}</div><h1 class="h1">${t("Choose a target to build your plan.")}</h1>
          <p class="sub">${t("Your plan turns the funding gap into weekly actions, from English practice to document legalisation.")}</p></div></div>
        <div class="sch-grid">${options.map((r) => `<button class="plan-choice" data-action="plan-target" data-id="${r.scholarship.id}">
          <div class="row" style="justify-content:space-between">${ring(r.score)}${badge(P.reasonText(r.reasons[0] || { code: "default" }), "teal")}</div>
          <b>${esc(r.scholarship.name)}</b><span>${esc(r.scholarship.provider)}</span>
          <div class="tiny">${t("Net cost")} ${U.money(r.cost.net)} · ${t("{n} days left", { n: r.deadlineDays })}</div>
        </button>`).join("")}</div>
      </div>`;
    }
    const data = E.planFor(p, state.planTarget);
    if (!data) return `<div class="page app-page">${P.emptyState("alert", t("Plan not available"), t("Choose another scholarship."))}</div>`;
    const s = data.scholarship;
    const prog = state.progress[s.id] || {};
    const done = data.plan.filter((m) => prog[m.moduleId]).length;
    const pct = Math.round((done / data.plan.length) * 100);

    return `<div class="page app-page">
      <div class="page-head"><div><div class="eyebrow">${t("My plan")}</div><h1 class="h1">${t("Roadmap to {name}", { name: s.name })}</h1>
        <p class="sub">${t("{n} weeks available. Application deadline {date}.", { n: data.weeks, date: I.date(s.deadline) })}</p></div>
        <div class="page-head-actions"><button class="btn btn--ghost" data-action="change-target">${t("Change target")}</button><button class="btn btn--primary" data-action="export">${icon("download", "i-sm")}${t("Download plan")}</button></div></div>

      <div class="grid grid-3">
        ${U.statCard(t("Readiness"), data.readiness + "%", progress(data.readiness), "chart")}
        ${U.statCard(t("Modules complete"), done + " / " + data.plan.length, progress(pct), "checkCircle", "blue")}
        ${U.statCard(t("Net cost"), U.money(data.cost.net), t("per year · {n} years", { n: data.cost.duration }), "wallet", "amber")}
      </div>

      <div class="split mt-3">
        <div class="stack">
          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("alert")}${t("What stands between you and this scholarship")}</div>${badge(data.gaps.length === 1 ? t("1 gap") : t("{n} gaps", { n: data.gaps.length }), data.gaps.length ? "amber" : "green")}</div>
            ${data.gaps.length ? `<div class="check-list">${data.gaps.map((g) => { const x = P.gapText(g); return `<div class="check-item warn"><div class="ci-icon">${icon("alert", "i-sm")}</div><div><div class="ci-title">${esc(x.title)}</div><div class="ci-desc">${esc(x.body)}</div></div></div>`; }).join("")}</div>`
              : `<div class="check-item"><div class="ci-icon">${icon("check", "i-sm")}</div><div><div class="ci-title">${t("You meet the main requirements")}</div><div class="ci-desc">${t("Focus on the quality of your essays, documents and interview.")}</div></div></div>`}
          </div>

          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("route")}${t("Week-by-week plan")}</div><span class="tiny">${done} / ${data.plan.length} ${t("done")}</span></div>
            <div class="roadmap">${data.plan.map((m, i) => {
              const complete = !!prog[m.moduleId];
              return `<div class="rm-item${complete ? " done" : ""}${!complete && data.plan.findIndex((x) => !prog[x.moduleId]) === i ? " current" : ""}">
                <div class="rm-week">${t("Week")} ${m.week} · ${I.date(m.start)} · ${m.hours} ${t("hours")}</div>
                <div class="rm-card${complete ? " done" : ""}"><div class="spread"><div class="rm-title">${complete ? icon("checkCircle", "i-sm") : icon("book", "i-sm")}${esc(m.title)}</div>${badge(m.domain, "grey")}</div>
                  <ul class="rm-acts">${m.activities.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
                  <div class="spread mt-2"><span class="tiny">${t("Keep evidence of this step for your application.")}</span>
                    <label class="rm-check"><input type="checkbox" data-action="module" data-module="${m.moduleId}"${complete ? " checked" : ""}> ${t("Done")}</label></div>
                </div></div>`;
            }).join("")}</div>
          </div>
        </div>

        <aside class="stack">
          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("wallet")}${t("Funding & cost")}</div></div>
            <div class="funding-big"><span>${t("Net cost per year")}</span><b>${U.money(data.cost.net)}</b></div>
            ${P.costBreakdown(data.cost.cost)}
            <div class="cost-summary"><span>${t("Award covers")}</span><b>− ${U.money(data.cost.funding)}</b></div>
            ${data.savings ? `<div class="savings-card"><div>${t("Save for 12 months")}<b>${U.money(data.savings.monthly12)} / ${t("month")}</b></div><div>${t("Save for 24 months")}<b>${U.money(data.savings.monthly24)} / ${t("month")}</b></div></div>` : `<div class="insight">${icon("checkCircle", "i-sm")}<span>${t("Core costs are covered. Keep a small arrival buffer.")}</span></div>`}
          </div>

          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("shield")}${t("Programme facts")}</div></div>
            <dl class="kv"><dt>${t("Level")}</dt><dd>${s.level.join(" · ")}</dd><dt>${t("Destination")}</dt><dd>${E.destination(s.dest).code} ${esc(E.destination(s.dest).name)}</dd>
              <dt>${t("Deadline")}</dt><dd>${I.date(s.deadline)}</dd><dt>${t("Application")}</dt><dd>${t(s.apply === "online" ? "Online" : s.apply === "offline" ? "In person" : "Hybrid")}</dd>
              <dt>${t("Documents")}</dt><dd>${t(s.docs === "physical" ? "Physical copies" : "Digital upload")}</dd><dt>${t("Interview")}</dt><dd>${t(s.interview === "none" ? "None" : s.interview === "online" ? "Online" : "In person")}</dd></dl>
            <a class="btn btn--ghost btn--block mt-2" href="${esc(s.url)}" target="_blank" rel="noopener">${t("Official website")}${icon("external", "i-sm")}</a>
          </div>

          <div class="card card--pad card--sand">
            <div class="h3">${icon("clock")}${t("Application timeline")}</div>
            <ul class="rm-acts mt-2"><li>${t("Now: close your biggest gap.")}</li><li>${t("8 weeks before: request documents and references.")}</li><li>${t("4 weeks before: final essay and interview practice.")}</li><li>${t("1 week before: submit early and keep proof.")}</li></ul>
          </div>
        </aside>
      </div>
    </div>`;
  }

  /* --------------------------------------------------------- personalized report */
  // Spec §13: 16-section personalized student report.
  function report(state) {
    var p = state.profile;
    if (!p) return '<div class="page app-page">' + P.emptyState("user", t("No profile yet"), t("Complete the onboarding to generate your report."), '<a class="btn btn--primary" href="#/start">' + t("Build my profile") + "</a>") + "</div>";
    var stat = E.profileStats(p);
    var rows = state.matches || [];
    var gpaInfo = stat.gpaInfo || E.interpretGPA(p);
    var engStatus = stat.englishStatus || "taken";
    var highMatches = rows.filter(function (r) { return r.category === "high"; });
    var competitiveMatches = rows.filter(function (r) { return r.category === "competitive"; });
    var reachMatches = rows.filter(function (r) { return r.category === "reach"; });
    var notEligible = rows.filter(function (r) { return r.category === "not-eligible"; });
    var topMatch = rows[0];
    var plan = state.planTarget ? E.planFor(p, state.planTarget) : null;
    var o = E.origin(p.origin);
    var allGaps = [];
    rows.slice(0, 5).forEach(function (r) { r.gaps.forEach(function (g) { if (allGaps.indexOf(g.code) < 0) allGaps.push(g.code); }); });
    var D_ID = global.SCHO_ID || { UNIVERSITIES_ID: [], SCHOLARSHIPS_ID: [], ROUTES: [], CALENDAR_ID: [] };

    return `<div class="page app-page">
      <div class="page-head"><div><div class="eyebrow">${t("Personalized Student Report")}</div><h1 class="h1">${t("Your SchoLink Report")}</h1>
        <p class="sub">${t("A holistic assessment of your academic profile, test readiness, university and scholarship matches, and recommended next steps.")}</p></div>
        <div class="page-head-actions"><button class="btn btn--ghost" data-action="export">${icon("download", "i-sm")}${t("Export")}</button>
        <a class="btn btn--primary" href="#/matches">${t("See matches")}</a></div></div>

      <div class="report-sections">

      <div class="card card--pad report-section">
        <div class="report-sec-num">1</div>
        <div class="h3">${t("Student Identity & Background")}</div>
        <dl class="kv"><dt>${t("Name")}</dt><dd>${esc(p.name)}</dd>
        <dt>${t("Country of origin")}</dt><dd>${o.code} ${esc(o.name)}</dd>
        <dt>${t("Region type")}</dt><dd>${t(p.regionType === "rural" ? "Rural or remote" : p.regionType === "small" ? "Small city" : "Major city")}</dd>
        <dt>${t("Connectivity")}</dt><dd>${t(p.connectivity === "low" ? "Low bandwidth" : p.connectivity === "mixed" ? "Mixed" : "Good")}</dd>
        <dt>${t("First generation")}</dt><dd>${p.firstGen ? t("Yes") : t("No")}</dd>
        <dt>${t("Gender")}</dt><dd>${p.gender === "woman" ? t("Woman") : p.gender === "man" ? t("Man") : t("Not specified")}</dd></dl>
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">2</div>
        <div class="h3">${t("Academic Record (Curriculum-Aware)")}</div>
        <dl class="kv"><dt>${t("Curriculum")}</dt><dd>${esc(gpaInfo.scale)}</dd>
        <dt>${t("Grade")}</dt><dd>${p.gpa} (${esc(gpaInfo.interpretation)})</dd>
        <dt>${t("Normalised")}</dt><dd>${Math.round(gpaInfo.normalized * 100)}%</dd>
        ${p.classRank ? `<dt>${t("Class rank")}</dt><dd>${esc(p.classRank)}</dd>` : ""}
        <dt>${t("Field")}</dt><dd>${t(E.fieldName(p.field))}</dd>
        <dt>${t("Level sought")}</dt><dd>${p.level}</dd></dl>
        ${p.altMajors && p.altMajors.length ? `<div class="tiny mt-1">${t("Alternative interests")}: ${p.altMajors.map(esc).join(", ")}</div>` : ""}
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">3</div>
        <div class="h3">${t("Standardized Test Status")}</div>
        ${p.tests && Object.keys(p.tests).length ? `<dl class="kv">${Object.keys(p.tests).map(function (tid) {
          var entry = p.tests[tid];
          var test = (D.STANDARD_TESTS || []).find(function (s) { return s.id === tid; });
          var name = test ? test.name : tid;
          return `<dt>${esc(name)}</dt><dd>${t(entry.status === "taken" ? "Taken — score: " + (entry.score || "—") : entry.status === "registered" ? "Registered" : entry.status === "planning" ? "Planning to take" : entry.status === "not-taken" ? "Not taken" : "N/A")}</dd>`;
        }).join("")}</dl>` : `<p class="small muted">${t("No test status recorded. Add tests in the profile editor.")}</p>`}
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">4</div>
        <div class="h3">${t("English Proficiency")}</div>
        <dl class="kv"><dt>${t("Test type")}</dt><dd>${p.englishType === "None" ? t("None recorded") : p.englishType}</dd>
        <dt>${t("Score")}</dt><dd>${p.englishScore || "—"}</dd>
        <dt>${t("IELTS equivalent")}</dt><dd>${stat.english || "—"}</dd>
        <dt>${t("Status")}</dt><dd>${t(engStatus === "taken" ? "Score available" : engStatus === "registered" ? "Exam booked" : engStatus === "planning" ? "Planning" : "Not taken")}</dd></dl>
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">5</div>
        <div class="h3">${t("Financial Profile")}</div>
        <dl class="kv"><dt>${t("Family income")}</dt><dd>${U.money(stat.income)} / ${t("year")}</dd>
        <dt>${t("Income band")}</dt><dd>${(D.INCOME_BANDS.find(function (b) { return b.id === p.incomeBand; }) || {}).name || p.incomeBand}</dd>
        <dt>${t("Max affordable tuition")}</dt><dd>${U.money(p.maxAffordableTuition || 5000)} / ${t("year")}</dd>
        <dt>${t("Needs aid")}</dt><dd>${p.needAid ? t("Yes — full scholarship needed") : t("Partial funding acceptable")}</dd>
        <dt>${t("Work experience")}</dt><dd>${p.workYears || 0} ${t("years")}</dd></dl>
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">6</div>
        <div class="h3">${t("Study Destination Preferences")}</div>
        ${p.targets && p.targets.length ? `<div class="chips-row">${p.targets.map(function (tid) { var dest = E.destination(tid); return `<span class="chip">${dest.code} ${esc(dest.name)}</span>`; }).join("")}</div>` : `<p class="small muted">${t("Open to all destinations")}</p>`}
        <dl class="kv mt-1"><dt>${t("Priority")}</dt><dd>${(D.PRIORITIES.find(function (x) { return x.id === p.priority; }) || {}).name || p.priority}</dd>
        <dt>${t("Intake year")}</dt><dd>${p.intake}</dd></dl>
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">7</div>
        <div class="h3">${t("University Matches by Category")}</div>
        ${(D.MATCH_CATEGORIES || []).map(function (cat) {
          var count = cat.id === "high" ? highMatches.length : cat.id === "competitive" ? competitiveMatches.length : cat.id === "reach" ? reachMatches.length : notEligible.length;
          return `<div class="report-cat-row" style="border-left:3px solid ${cat.color}"><div class="report-cat-name">${cat.name}</div><div class="report-cat-count">${count}</div><div class="tiny">${esc(cat.description)}</div></div>`;
        }).join("")}
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">8</div>
        <div class="h3">${t("Top Recommended Scholarships")}</div>
        <div class="list">${rows.slice(0, 5).map(function (r) {
          return `<div class="list-item" data-action="open-scholarship" data-id="${r.scholarship.id}" style="cursor:pointer">
            <div class="li-icon">${ring(r.score)}</div>
            <div><div class="li-title">${esc(r.scholarship.name)}</div><div class="li-sub">${esc(r.scholarship.provider)} · ${r.categoryName}</div></div>
            <div class="li-right">${badge(U.money(r.cost.net) + "/" + t("yr"), r.cost.net === 0 ? "green" : "amber")}</div></div>`;
        }).join("")}</div>
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">9</div>
        <div class="h3">${t("Indonesia Domestic Options")}</div>
        ${o.id === "id" || p.origin === "id" ? `<p class="small muted">${t("As an Indonesian student, you also have domestic admission routes:")}</p>
        <div class="list mt-1">${D_ID.ROUTES.map(function (r) { return `<div class="list-item"><div class="li-icon">${icon("route", "i-sm")}</div><div><div class="li-title">${esc(r.name)}</div><div class="li-sub">${esc(r.period)}</div></div></div>`; }).join("")}</div>`
        : `<p class="small muted">${t("Domestic admission routes are shown for Indonesian students. If you are from another country, focus on the international matches above.")}</p>`}
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">10</div>
        <div class="h3">${t("Cost Analysis Summary")}</div>
        ${topMatch ? `<dl class="kv"><dt>${t("Top match")}</dt><dd>${esc(topMatch.scholarship.name)}</dd>
        <dt>${t("Total annual cost")}</dt><dd>${U.money(topMatch.cost.cost.total)}</dd>
        <dt>${t("Funding from award")}</dt><dd>− ${U.money(topMatch.cost.funding)}</dd>
        <dt>${t("Net cost per year")}</dt><dd>${U.money(topMatch.cost.net)}</dd>
        <dt>${t("Programme duration")}</dt><dd>${topMatch.cost.duration} ${t("years")}</dd>
        <dt>${t("Total programme net cost")}</dt><dd>${U.money(topMatch.cost.totalProgram)}</dd></dl>` : `<p class="small muted">${t("Complete your profile to see cost analysis.")}</p>`}
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">11</div>
        <div class="h3">${t("Gaps & Barriers")}</div>
        ${allGaps.length ? `<div class="check-list">${allGaps.map(function (code) {
          var label = code === "gpa" ? t("GPA below minimum") : code === "english" ? t("English score below requirement") : code === "englishPending" ? t("English test not yet taken") : code === "englishNotTaken" ? t("No English test recorded") : code === "standardTest" ? t("Standardized test (SAT/GRE) not taken") : code === "work" ? t("Insufficient work experience") : code === "income" ? t("Income above cap") : code === "documents" ? t("Physical documents required") : code === "funding" ? t("Funding gap after award") : code === "interviewTravel" ? t("In-person interview required") : code;
          return `<div class="check-item warn"><div class="ci-icon">${icon("alert", "i-sm")}</div><div class="ci-title">${esc(label)}</div></div>`;
        }).join("")}</div>` : `<div class="insight">${icon("checkCircle", "i-sm")}<span>${t("No major gaps identified for your top matches.")}</span></div>`}
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">12</div>
        <div class="h3">${t("Preparation Roadmap")}</div>
        ${plan ? `<div class="tiny">${t("Target")}: ${esc(plan.scholarship.name)} · ${t("Readiness")} ${plan.readiness}%</div>
        <div class="roadmap mt-1">${plan.plan.slice(0, 4).map(function (m) { return `<div class="rm-item"><div class="rm-week">${t("Week")} ${m.week} · ${m.hours} ${t("hours")}</div><div class="rm-card"><div class="rm-title">${icon("book", "i-sm")}${esc(m.title)}</div><ul class="rm-acts">${m.activities.slice(0, 2).map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("")}</ul></div></div>`; }).join("")}</div>`
        : `<p class="small muted">${t("Choose a target scholarship to build a preparation roadmap.")}</p><a class="btn btn--ghost mt-1" href="#/plan">${t("Choose target")}</a>`}
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">13</div>
        <div class="h3">${t("Profile Strength Assessment")}</div>
        ${bars([
          { label: t("Academics"), value: stat.vector[0] },
          { label: t("English"), value: stat.vector[1] },
          { label: t("Financial need"), value: stat.vector[2] },
          { label: t("Equity"), value: stat.vector[3] },
          { label: t("Global ambition"), value: stat.vector[4] },
        ])}
        <div class="mini-grid mt-2">
          <div class="mini-stat"><b>${stat.strength}%</b><span>${t("Profile strength")}</span></div>
          <div class="mini-stat"><b>${stat.completeness}%</b><span>${t("Completeness")}</span></div>
          <div class="mini-stat"><b>${rows.filter(function (r) { return r.eligibility.eligible; }).length}</b><span>${t("Eligible matches")}</span></div>
        </div>
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">14</div>
        <div class="h3">${t("Extracurricular & Leadership Profile")}</div>
        ${p.extracurriculars && p.extracurriculars.length ? `<div class="chips-row">${p.extracurriculars.map(function (e) { return '<span class="chip">' + esc(e) + "</span>"; }).join("")}</div>` : `<p class="small muted">${t("No extracurricular activities recorded. Add them in the profile editor to strengthen your assessment.")}</p>`}
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">15</div>
        <div class="h3">${t("Source Reliability & Verification")}</div>
        <p class="small muted">${t("All scholarship data in this report is tagged with a source reliability tier. Tier 1 = official provider; Tier 2 = verified secondary; Tier 3 = indicative.")}</p>
        <div class="check-list mt-1">${rows.slice(0, 3).map(function (r) {
          var tier = r.verification.sourceTier;
          var tierName = (D.SOURCE_TIERS || []).find(function (s) { return s.id === tier; });
          return `<div class="check-item"><div class="ci-icon">${icon("shield", "i-sm")}</div><div><div class="ci-title">${esc(r.scholarship.name)}</div><div class="ci-desc">Tier ${tier} — ${tierName ? esc(tierName.name) : "Unknown"} · ${t("Verified")} ${r.verification.verified} · ${t("Status")}: ${esc(r.verification.status)}</div></div></div>`;
        }).join("")}</div>
      </div>

      <div class="card card--pad report-section">
        <div class="report-sec-num">16</div>
        <div class="h3">${t("Recommended Next Steps")}</div>
        <ul class="rm-acts">
          <li>${t("Verify all scholarship details on the official provider website before applying.")}</li>
          <li>${highMatches.length ? t("Apply to your {n} HIGH MATCH scholarships first.", { n: highMatches.length }) : t("Address your gaps to unlock HIGH MATCH recommendations.")}</li>
          <li>${competitiveMatches.length ? t("Prepare strong essays for your {n} COMPETITIVE MATCH scholarships.", { n: competitiveMatches.length }) : ""}</li>
          <li>${allGaps.indexOf("english") >= 0 || allGaps.indexOf("englishPending") >= 0 || allGaps.indexOf("englishNotTaken") >= 0 ? t("Book or complete your English proficiency test.") : ""}</li>
          <li>${plan ? t("Follow your weekly preparation plan for {name}.", { name: plan.scholarship.name }) : t("Choose a target scholarship and build your weekly plan.")}</li>
          <li>${t("Keep digital and physical copies of all documents ready.")}</li>
        </ul>
      </div>

      <div class="card card--pad card--sand report-disclaimer">
        <div class="row" style="gap:8px">${icon("info", "i-sm")}<span class="strong small">${t("Important")}</span></div>
        <p class="tiny muted mt-1">${t("This report is generated from indicative data for 2027 entry planning. It is not a guarantee of admission or scholarship. Always verify eligibility, deadlines and amounts with the official provider. No acceptance percentages are stated — no programme can promise a probability of success.")}</p>
      </div>

      </div>
    </div>`;
  }

  /* ----------------------------------------------------- Indonesia domestic page */
  // Spec §8: Indonesia domestic admissions (SNBP/SNBT/UTBK/TKA/Mandiri) + §9: scholarships.
  function indonesia(state) {
    var p = state.profile;
    var D_ID = global.SCHO_ID || { UNIVERSITIES_ID: [], SCHOLARSHIPS_ID: [], ROUTES: [], PREP_MODULES: [], LIVING_ID: {}, CALENDAR_ID: [] };
    var idMatches = p ? E.recommendID(p) : [];
    var idScholarships = D_ID.SCHOLARSHIPS_ID || [];

    return `<div class="page app-page">
      <div class="page-head"><div><div class="eyebrow">${t("Indonesia Domestic Admissions")}</div><h1 class="h1">${t("Study in Indonesia")}</h1>
        <p class="sub">${t("SNBP, SNBT/UTBK, TKA and Mandiri routes to PTN and PTS universities, with domestic scholarships and preparation modules.")}</p></div></div>

      <div class="grid grid-4">
        ${U.statCard(t("Universities"), String((D_ID.UNIVERSITIES_ID || []).length), t("PTN and PTS"), "graduation")}
        ${U.statCard(t("Admission routes"), String((D_ID.ROUTES || []).length), t("SNBP, SNBT, TKA, Mandiri"), "route")}
        ${U.statCard(t("Domestic scholarships"), String((D_ID.SCHOLARSHIPS_ID || []).length), t("KIP, LPDP and more"), "target")}
        ${U.statCard(t("Prep modules"), String((D_ID.PREP_MODULES || []).length), t("UTBK and interview"), "book")}
      </div>

      <div class="split mt-3">
        <div class="stack">
          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("globe")}${t("Admission Routes")}</div></div>
            <div class="list">${(D_ID.ROUTES || []).map(function (r) {
              return `<div class="list-item"><div class="li-icon">${icon("route", "i-sm")}</div>
                <div><div class="li-title">${esc(r.name)}</div><div class="li-sub">${esc(r.period)}</div>
                <div class="tiny mt-1">${esc(r.exam)}</div></div></div>`;
            }).join("")}</div>
          </div>

          ${p && idMatches.length ? `<div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("target")}${t("Your University Matches")}</div></div>
            <div class="list">${idMatches.slice(0, 8).map(function (m) {
              var cat = (D.MATCH_CATEGORIES || []).find(function (c) { return c.id === m.category; }) || {};
              return `<div class="list-item"><div class="li-icon">${icon("graduation", "i-sm")}</div>
                <div><div class="li-title">${esc(m.university.name)}</div>
                <div class="li-sub">${m.university.type} · ${esc(m.university.city)}</div></div>
                <div class="li-right">${badge(m.categoryName, m.category === "high" ? "green" : m.category === "competitive" ? "amber" : "grey")}</div></div>`;
            }).join("")}</div>
          </div>` : ""}

          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("target")}${t("Domestic Scholarships")}</div></div>
            <div class="list">${idScholarships.map(function (s) {
              return `<div class="list-item" data-action="open-scholarship" data-id="${s.id}" style="cursor:pointer">
                <div class="li-icon">${icon("target", "i-sm")}</div>
                <div><div class="li-title">${esc(s.name)}</div><div class="li-sub">${esc(s.provider)} · ${s.funding === "full" ? t("Fully funded") : t("Partial")}</div></div>
                <div class="li-right">${badge("Tier " + (s.sourceTier || 2), "grey")}</div></div>`;
            }).join("")}</div>
          </div>
        </div>

        <div class="stack">
          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("calendar")}${t("Admission Calendar")}</div></div>
            <div class="list">${(D_ID.CALENDAR_ID || []).map(function (c) {
              return `<div class="list-item"><div class="li-icon">${icon("clock", "i-sm")}</div>
                <div><div class="li-title">${esc(c.title)}</div>
                <div class="li-sub">${esc(c.period)}</div>
                <div class="tiny mt-1">${esc(c.detail)}</div></div></div>`;
            }).join("")}</div>
          </div>

          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("book")}${t("Preparation Modules")}</div></div>
            <div class="list">${(D_ID.PREP_MODULES || []).map(function (m) {
              return `<div class="list-item"><div class="li-icon">${icon("route", "i-sm")}</div>
                <div><div class="li-title">${esc(m.name)}</div>
                <div class="li-sub">${esc(m.domain)} · ${m.hours} ${t("hours")}</div></div></div>`;
            }).join("")}</div>
          </div>

          <div class="card card--pad card--sand">
            <div class="h3">${icon("info")}${t("Important")}</div>
            <p class="small muted mt-1">${t("Admission rules, quotas and test formats change every year. Always verify against the official portal (snbp.kemdikbud.go.id / snbt.kemdikbud.go.id) for your admission year.")}</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ----------------------------------------------------------------- settings */
  function settings(state) {
    const p = state.profile;
    const stat = E.profileStats(p);
    return `<div class="page app-page">
      <div class="page-head"><div><div class="eyebrow">${t("Settings")}</div><h1 class="h1">${t("Your profile and preferences")}</h1>
        <p class="sub">${t("Everything is stored locally. Export it, move it, or delete it whenever you want.")}</p></div>
        <div class="page-head-actions"><button class="btn btn--ghost" data-action="edit-profile">${icon("user", "i-sm")}${t("Edit profile")}</button><a class="btn btn--primary" href="#/matches">${t("My matches")}</a></div></div>

      <div class="split">
        <div class="stack">
          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("user")}${t("Profile")}</div>${badge(stat.strength + "% " + t("complete"), stat.strength > 75 ? "green" : "amber")}</div>
            <dl class="kv"><dt>${t("Name")}</dt><dd>${esc(p.name)}</dd>
              <dt>${t("Origin")}</dt><dd>${E.origin(p.origin).code} ${esc(E.origin(p.origin).name)}</dd>
              <dt>${t("Location")}</dt><dd>${t(p.regionType === "rural" ? "Rural or remote" : p.regionType === "small" ? "Small city" : "Major city")} · ${t(p.connectivity === "low" ? "Low connectivity" : p.connectivity === "mixed" ? "Mixed connectivity" : "Good connectivity")}</dd>
              <dt>${t("Study level")}</dt><dd>${p.level} · ${t(E.fieldName(p.field))}</dd>
              <dt>${t("GPA")}</dt><dd>${p.gpa} / 4.0</dd>
              <dt>${t("English")}</dt><dd>${p.englishType === "None" ? t("No test yet") : p.englishType + " " + p.englishScore} (${t("IELTS equiv.")} ${stat.english})</dd>
              <dt>${t("Family income")}</dt><dd>${U.money(stat.income)} / ${t("year")}</dd>
              <dt>${t("Targets")}</dt><dd>${p.targets.length ? p.targets.map((x) => E.destination(x).name).join(", ") : t("Anywhere")}</dd></dl>
          </div>

          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("language")}${t("Language & currency")}</div></div>
            <div class="grid grid-2">
              <div class="field"><label>${t("Language")}</label><select class="select" data-action="lang">${P.langOptions()}</select><div class="hint">${t("Translations are machine-assisted. Programme details remain in English.")}</div></div>
              <div class="field"><label>${t("Display currency")}</label><select class="select" data-action="currency">${P.curOptions()}</select><div class="hint">${t("Converted at indicative rates; the provider charges in local currency.")}</div></div>
            </div>
          </div>

          <div class="card card--pad">
            <div class="card-hd"><div class="h3">${icon("wifiOff")}${t("Data & offline")}</div></div>
            <div class="toggle-row"><div><div class="strong small">${t("Data saver")}</div><div class="tiny">${t("Remove shadows, gradients and animations for slow connections.")}</div></div>
              <label class="toggle"><input type="checkbox" data-action="saver"${state.saver ? " checked" : ""}><span class="track"></span></label></div>
            <div class="row mt-2"><button class="btn btn--ghost" data-action="export">${icon("download", "i-sm")}${t("Export my data")}</button>
              <button class="btn btn--danger-soft" data-action="clear">${t("Delete everything")}</button></div>
          </div>
        </div>

        <aside class="stack">
          <div class="card card--pad card--sand">
            <div class="h3">${icon("shield")}${t("Privacy")}</div>
            <p class="small muted mt-1">${t("Your profile, matches and progress live in this browser. There is no account and no server. Clearing your browser data will delete them.")}</p>
            <div class="tiny mt-2">${t("Local storage key")}: scholink.global.v1</div>
          </div>
          <div class="card card--pad">
            <div class="h3">${icon("info")}${t("About the data")}</div>
            <p class="small muted mt-1">${t("Scholarships, costs and deadlines are curated estimates for 2027 entry. Always confirm details with the official provider.")}</p>
            <a class="btn btn--ghost btn--block mt-2" href="#/impact">${t("How scoring works")}</a>
          </div>
          <div class="card card--pad card--dark">
            <div class="h3 light">${t("Need a fresh start?")}</div>
            <p class="tiny light-muted mt-1">${t("Rebuild your profile with different targets or finances.")}</p>
            <button class="btn btn--sm btn--light mt-2" data-action="edit-profile">${t("Edit profile")}</button>
          </div>
        </aside>
      </div>
    </div>`;
  }

  /* ------------------------------------------------------------------ drawers */
  function drawerScholarship(state) {
    const s = E.byId(D.SCHOLARSHIPS, state.drawer.id);
    if (!s) return "";
    const p = state.profile;
    const ev = p ? E.evaluate(p, s) : null;
    const m = p ? E.matchScore(p, s) : null;
    const c = E.scholarshipCost(s, p, { level: p ? p.level : s.level[0] });
    const d = E.destination(s.dest);
    const saved = state.saved.indexOf(s.id) >= 0;
    return `<div class="drawer-head">
      <div class="drawer-title">
        <div class="row" style="gap:6px">${badge(s.funding === "full" ? t("Fully funded") : t("Partial funding"), s.funding === "full" ? "green" : "amber")} ${badge(d.code + " " + d.name, "grey")}</div>
        <h2>${esc(s.name)}</h2><div class="tiny">${esc(s.provider)} · ${s.level.join(" · ")}</div>
      </div>
      ${m ? ring(m.score) : ""}
      <button class="icon-btn" data-action="close-drawer" aria-label="${t("Close")}">${icon("x")}</button>
    </div>
    <div class="drawer-body">
      <p class="lede-sm">${esc(s.summary)}</p>
      <div class="drawer-cost"><div><span>${t("Net cost per year")}</span><b>${U.money(c.net)}</b><em>${t("after the award")}</em></div>
        <div><span>${t("Deadline")}</span><b>${I.date(s.deadline)}</b><em>${t("{n} days left", { n: E.daysUntil(s.deadline) })}</em></div></div>

      <div class="card card--pad"><div class="card-hd"><div class="h3">${icon("wallet")}${t("What it covers")}</div>${badge(s.funding === "full" ? t("Fully funded") : t("Partial funding"), s.funding === "full" ? "green" : "amber")}</div>
        <div class="check-list">${s.benefits.map((b) => `<div class="check-item"><div class="ci-icon">${icon("check", "i-sm")}</div><div class="ci-title">${esc(b)}</div></div>`).join("")}</div>
        ${P.costBreakdown(c.cost)}
        <div class="cost-summary"><span>${t("Award covers")}</span><b>− ${U.money(c.funding)}</b></div>
        ${c.net > 0 ? `<div class="savings-card"><div>${t("Save for 12 months")}<b>${U.money(Math.ceil(c.net / 12))} / ${t("month")}</b></div><div>${t("Save for 24 months")}<b>${U.money(Math.ceil(c.net / 24))} / ${t("month")}</b></div></div>` : `<div class="insight">${icon("checkCircle", "i-sm")}<span>${t("Core costs are covered by this award.")}</span></div>`}
      </div>

      <div class="card card--pad"><div class="card-hd"><div class="h3">${icon("shield")}${t("Eligibility")}</div>${ev ? badge(ev.eligible ? t("You qualify") : t("Gaps to close"), ev.eligible ? "green" : "amber") : badge(t("Check the criteria"), "grey")}</div>
        <dl class="kv"><dt>${t("Level")}</dt><dd>${s.level.join(" · ")}</dd><dt>${t("Minimum GPA")}</dt><dd>${s.minGpa.toFixed(1)} / 4.0</dd>
          <dt>${t("English")}</dt><dd>${s.ielts ? t("IELTS {n} or equivalent", { n: s.ielts }) : t("No test required")}</dd>
          <dt>${t("Income cap")}</dt><dd>${s.incomeCap ? U.money(s.incomeCap) : t("No cap")}</dd>
          <dt>${t("Regions")}</dt><dd>${s.regions.length ? s.regions.join(", ") : t("Open worldwide")}</dd>
          <dt>${t("Work experience")}</dt><dd>${s.workYears ? t("{n}+ years", { n: s.workYears }) : t("Not required")}</dd></dl>
        ${ev && ev.warns.length ? `<div class="insight warn mt-2">${icon("alert", "i-sm")}<span>${ev.warns.map((w) => w.code === "gpaClose" ? t("Your GPA is slightly below the stated minimum.") : w.code === "englishClose" ? t("Your English score is close to the requirement.") : t("You may need more work experience.")).join(" ")}</span></div>` : ""}
      </div>

      <div class="card card--pad"><div class="card-hd"><div class="h3">${icon("checkCircle")}${t("Checklist")}</div></div>
        <div class="check-list">${s.checklist.map((x) => `<div class="check-item"><div class="ci-icon">${icon("check", "i-sm")}</div><div class="ci-title">${esc(x)}</div></div>`).join("")}</div>
        <div class="row mt-2">${[t("Application") + ": " + t(s.apply === "online" ? "Online" : s.apply === "offline" ? "In person" : "Hybrid"), t("Documents") + ": " + t(s.docs === "physical" ? "Physical" : "Digital"), t("Interview") + ": " + t(s.interview === "none" ? "None" : s.interview === "online" ? "Online" : "In person")].map((x) => `<span class="chip" style="cursor:default">${esc(x)}</span>`).join("")}</div>
      </div>

      <div class="card card--pad"><div class="card-hd"><div class="h3">${icon("shield")}${t("Verification & Source Reliability")}</div></div>
        <dl class="kv">
          <dt>${t("Source tier")}</dt><dd>${(D.SOURCE_TIERS || []).find(function (s) { return s.id === s.sourceTier; }) ? "Tier " + s.sourceTier + " — " + t((D.SOURCE_TIERS.find(function (x) { return x.id === s.sourceTier; }) || {}).name) : "Tier " + (s.sourceTier || 2)}</dd>
          <dt>${t("Last verified")}</dt><dd>${s.verified || t("Unverified")}</dd>
          <dt>${t("Application status")}</dt><dd>${t(s.status === "open" ? "Open now" : s.status === "upcoming" ? "Upcoming" : s.status === "closed" ? "Closed" : s.status === "rolling" ? "Rolling" : s.status === "not-announced" ? "Not announced" : "Unverified")}</dd>
          <dt>${t("Renewal")}</dt><dd>${esc(s.renewal || t("See official terms"))}</dd>
          <dt>${t("Nominal amount")}</dt><dd>${esc(s.nominalAmount || t("Varies"))}</dd>
        </dl>
        ${(s.eligibilityNotes || []).length ? `<div class="insight warn mt-2">${icon("alert", "i-sm")}<span>${s.eligibilityNotes.map(function (n) { return esc(n); }).join(" ")}</span></div>` : ""}
      </div>

      <div class="drawer-actions">
        <button class="btn btn--primary" data-action="plan-target" data-id="${s.id}">${icon("route", "i-sm")}${t("Build my plan")}</button>
        <button class="btn btn--ghost" data-action="save" data-id="${s.id}">${icon("bookmark", "i-sm")}${saved ? t("Saved") : t("Save")}</button>
        <a class="btn btn--soft" href="${esc(s.url)}" target="_blank" rel="noopener">${t("Official site")}${icon("external", "i-sm")}</a>
      </div>
    </div>`;
  }

  function drawerDestination(state) {
    const d = E.destination(state.drawer.id);
    const p = state.profile;
    const c = E.costEstimate(d.id, p ? p.level : "Master", { lifestyle: "standard" });
    const list = D.SCHOLARSHIPS.filter((s) => s.dest === d.id);
    const unis = (d.universities || []).map((id) => E.university(id)).filter(Boolean);
    return `<div class="drawer-head">
      <div class="drawer-title"><div class="row" style="gap:6px">${badge(d.code + " " + d.region, "grey")}${badge(t("{n} scholarships", { n: list.length }), "teal")}</div>
        <h2>${esc(d.name)}</h2><div class="tiny">${esc(d.language)} · ${t("Intakes")}: ${d.intakes.join(" · ")}</div></div>
      <button class="icon-btn" data-action="close-drawer" aria-label="${t("Close")}">${icon("x")}</button>
    </div>
    <div class="drawer-body">
      <p class="lede-sm">${esc(d.summary)}</p>
      <div class="drawer-cost"><div><span>${t("Estimated first year")}</span><b>${U.money(c.total)}</b><em>${t("standard lifestyle")}</em></div>
        <div><span>${t("Living per month")}</span><b>${U.money(c.monthlyLiving)}</b><em>${t("rent, food, transport")}</em></div></div>
      <div class="card card--pad"><div class="card-hd"><div class="h3">${icon("wallet")}${t("Cost breakdown")}</div>${badge(t("Indicative"), "amber")}</div>${P.costBreakdown(c)}
        <div class="tiny mt-1">${t("Tuition is the mid-point of public university ranges; private universities can be higher.")}</div></div>
      <div class="card card--pad"><div class="card-hd"><div class="h3">${icon("graduation")}${t("Universities")}</div></div>
        <div class="uni-list">${unis.length ? unis.map((u) => `<div class="uni-row"><div><b>${esc(u.name)}</b><span>${esc(u.city)} · ${t("tuition")} ${U.money(u.tuition[p ? p.level : "Master"] || u.tuition.Master)}/${t("year")}</span></div><span class="tiny">IELTS ${u.ielts} · GPA ${u.minGpa}</span></div>`).join("") : `<p class="small muted">${t("University-level data is being expanded for this destination.")}</p>`}</div>
      </div>
      <div class="card card--pad"><div class="card-hd"><div class="h3">${icon("briefcase")}${t("After graduation")}</div></div><p class="small">${esc(d.work)}</p>
        <div class="check-list mt-2">${d.highlights.map((h) => `<div class="check-item"><div class="ci-icon">${icon("check", "i-sm")}</div><div class="ci-title">${esc(h)}</div></div>`).join("")}</div></div>
      <div class="card card--pad"><div class="card-hd"><div class="h3">${icon("sparkle")}${t("Scholarships here")}</div><a class="btn btn--sm btn--ghost" href="#/scholarships">${t("All")}</a></div>
        <div class="list">${list.slice(0, 4).map((s) => `<div class="list-item" data-action="open-scholarship" data-id="${s.id}" style="cursor:pointer"><div class="li-icon">${icon("target", "i-sm")}</div><div><div class="li-title">${esc(s.name)}</div><div class="li-sub">${esc(s.provider)}</div></div><div class="li-right">${badge(s.funding === "full" ? t("Fully funded") : t("Partial"), s.funding === "full" ? "green" : "amber")}</div></div>`).join("")}</div></div>
      <div class="drawer-actions"><a class="btn btn--primary" href="#/costs" data-action="close-drawer">${icon("wallet", "i-sm")}${t("Calculate my cost")}</a><a class="btn btn--ghost" href="#/scholarships" data-action="close-drawer">${t("See scholarships")}</a></div>
    </div>`;
  }

  global.AppPages = { appShell, dashboard, matches, report, indonesia, plan, settings, drawerScholarship, drawerDestination };
})(window);
