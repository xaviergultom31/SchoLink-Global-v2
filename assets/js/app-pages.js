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
    ["universities", "graduation", "Universities"],
    ["tracker", "briefcase", "Applications"],
    ["prep", "book", "Prep Center"],
    ["consult", "sparkle", "AI Consult"],
    ["report", "file", "My report"],
    ["plan", "route", "My plan"],
    ["indonesia", "globe", "Indonesia"],
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
    return `<nav class="mobile-nav">${[["dashboard", "home"], ["matches", "target"], ["universities", "graduation"], ["tracker", "briefcase"], ["prep", "book"]].map((n) => `<a class="mnav-item${active === n[0] ? " active" : ""}" href="#/${n[0]}">${icon(n[1])}<span>${t(NAV.find((x) => x[0] === n[0])[2])}</span></a>`).join("")}</nav>`;
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

      ${/* Phase 2: University Admission Readiness preview */ ""}
      ${(function () {
        const ADM = global.SchoAdmission;
        if (!ADM || !p) return "";
        var uniMatches = state.uniMatches || [];
        if (!uniMatches.length) {
          uniMatches = ADM.matchUniversities(p);
          state.uniMatches = uniMatches;
        }
        if (!uniMatches.length) return "";
        var topUnis = uniMatches.slice(0, 3);
        var strongCount = uniMatches.filter(function (m) { return m.category === "strong"; }).length;
        var compCount = uniMatches.filter(function (m) { return m.category === "competitive"; }).length;
        return '<div class="card card--pad mt-3">' +
          '<div class="card-hd"><div class="h3">' + icon("graduation") + t("University admission readiness") + '</div>' +
          '<a class="btn btn--sm btn--ghost" href="#/universities">' + t("View all") + icon("arrow", "i-sm") + "</a></div>" +
          '<div class="row mt-1" style="gap:12px">' +
            '<div class="mini-stat"><b>' + uniMatches.length + "</b><span>" + t("Universities") + "</span></div>" +
            '<div class="mini-stat"><b>' + strongCount + "</b><span>" + t("Strong") + "</span></div>" +
            '<div class="mini-stat"><b>' + compCount + "</b><span>" + t("Competitive") + "</span></div>" +
          "</div>" +
          '<div class="list mt-2">' + topUnis.map(function (m) {
            var u = m.university;
            var catClr = m.categoryColor || "grey";
            return '<div class="list-item" data-action="open-university" data-id="' + u.id + '" style="cursor:pointer">' +
              '<div class="li-icon">' + icon("graduation", "i-sm") + "</div>" +
              "<div><div class=\"li-title\">" + esc(u.name) + "</div>" +
              '<div class="li-sub">' + esc(u.city || "") + (u.city ? ", " : "") + esc(u.country || "") + " · " + t("Readiness") + " " + m.overall + "%</div></div>" +
              '<div class="li-right">' + badge(m.categoryName, catClr) + "</div></div>";
          }).join("") + "</div>" +
        "</div>";
      })()}

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
        <div class="report-sec-num">8b</div>
        <div class="h3">${t("University Admission Readiness")}</div>
        ${(function () {
          var ADM = global.SchoAdmission;
          if (!ADM) return '<p class="small muted">' + t("Admission engine not loaded.") + "</p>";
          var um = state.uniMatches || [];
          if (!um.length) { um = ADM.matchUniversities(p); state.uniMatches = um; }
          if (!um.length) return '<p class="small muted">' + t("No university data available.") + "</p>";
          var top5 = um.slice(0, 5);
          var strong = um.filter(function (m) { return m.category === "strong"; }).length;
          var comp = um.filter(function (m) { return m.category === "competitive"; }).length;
          return '<div class="row mt-1" style="gap:12px">' +
            '<div class="mini-stat"><b>' + um.length + "</b><span>" + t("Total universities") + "</span></div>" +
            '<div class="mini-stat"><b>' + strong + "</b><span>" + t("Strong") + "</span></div>" +
            '<div class="mini-stat"><b>' + comp + "</b><span>" + t("Competitive") + "</span></div>" +
          "</div>" +
          '<div class="list mt-2">' + top5.map(function (m) {
            return '<div class="list-item" data-action="open-university" data-id="' + m.university.id + '" style="cursor:pointer">' +
              '<div class="li-icon">' + icon("graduation", "i-sm") + "</div>" +
              "<div><div class=\"li-title\">" + esc(m.university.name) + "</div>" +
              '<div class="li-sub">' + esc(m.university.country || "") + " · " + t("Readiness") + " " + m.overall + "%</div></div>" +
              '<div class="li-right">' + badge(m.categoryName, m.categoryColor) + "</div></div>";
          }).join("") + "</div>" +
          '<a class="btn btn--ghost btn--block mt-2" href="#/universities">' + t("See all universities") + icon("arrow", "i-sm") + "</a>";
        })()}
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

  /* --------------------------------------------------------- Universities discovery (Phase 2 — Admission Engine) */
  function universities(state) {
    const p = state.profile;
    const ADM = global.SchoAdmission;
    if (!ADM) return '<div class="page app-page">' + P.emptyState("alert", t("Admission engine not loaded"), t("Please refresh the page.")) + "</div>";

    // Compute university matches using the admission engine
    var uniMatches = state.uniMatches || [];
    if (!uniMatches.length && p) {
      uniMatches = ADM.matchUniversities(p);
      state.uniMatches = uniMatches;
    }

    // Filter
    var filterCat = state.uniFilter || "all";
    var filterDest = state.uniDest || "all";
    var filtered = uniMatches;
    if (filterCat !== "all") filtered = filtered.filter(function (m) { return m.category === filterCat; });
    if (filterDest !== "all") filtered = filtered.filter(function (m) {
      var u = m.university;
      return u.dest === filterDest || u.country === filterDest;
    });

    // Category counts
    var counts = { strong: 0, competitive: 0, reach: 0, "not-eligible": 0 };
    uniMatches.forEach(function (m) { counts[m.category] = (counts[m.category] || 0) + 1; });

    // Destination options from data
    var dests = (D.DESTINATIONS || []).map(function (d) { return { id: d.id, name: d.name, code: d.code }; });
    // Add Indonesia if present
    dests.push({ id: "id", name: "Indonesia", code: "ID" });

    return '<div class="page app-page">' +
      '<div class="page-head"><div><div class="eyebrow">' + t("University Admission Discovery") + '</div>' +
      '<h1 class="h1">' + t("Find universities you can get into.") + '</h1>' +
      '<p class="sub">' + t("See your admission readiness for 80+ universities worldwide and in Indonesia. We check your GPA, English scores (per IELTS category), tests, and documents — then tell you exactly what to fix.") + '</p></div>' +
      '<div class="page-head-actions"><a class="btn btn--ghost" href="#/matches">' + icon("target", "i-sm") + t("Scholarship matches") + '</a></div></div>' +

      // Stat cards
      '<div class="grid grid-4">' +
        U.statCard(t("Universities checked"), String(uniMatches.length), t("international + domestic"), "graduation") +
        U.statCard(t("Strong matches"), String(counts.strong), t("highly likely to be admitted"), "checkCircle", "green") +
        U.statCard(t("Competitive"), String(counts.competitive), t("solid chance with effort"), "target", "teal") +
        U.statCard(t("Reach schools"), String(counts.reach), t("ambitious but possible"), "trending", "amber") +
      "</div>" +

      // Filters
      '<div class="match-toolbar mt-2">' +
        '<div class="chips-row">' +
          [["all", t("All")], ["strong", t("Strong")], ["competitive", t("Competitive")], ["reach", t("Reach")], ["not-eligible", t("Not eligible")]].map(function (x) {
            return '<button class="chip' + (filterCat === x[0] ? " active" : "") + '" data-action="uni-filter" data-value="' + x[0] + '">' + x[1] + (x[0] !== "all" ? " (" + (counts[x[0]] || 0) + ")" : "") + "</button>";
          }).join("") +
        "</div>" +
        '<label class="tool-select">' + icon("globe", "i-sm") + '<select data-action="uni-dest">' +
          '<option value="all"' + (filterDest === "all" ? " selected" : "") + ">" + t("All countries") + "</option>" +
          dests.map(function (d) { return '<option value="' + d.id + '"' + (filterDest === d.id ? " selected" : "") + ">" + d.code + " " + esc(d.name) + "</option>"; }).join("") +
        "</select></label>" +
      "</div>" +

      // University list
      (filtered.length ?
        '<div class="sch-grid sch-grid--list mt-2">' + filtered.map(function (m) {
          var u = m.university;
          var r = m.readiness;
          var catColor = r.categoryColor || "grey";
          var pathway = ADM.detectAdmissionPathway(u, p);
          var primaryPathway = pathway && pathway.primary ? pathway.primary.name : t("Direct application");

          // IELTS category summary
          var ieltsSummary = "";
          if (r.ieltsValidation && r.ieltsValidation.details) {
            var catLabels = { listening: "L", reading: "R", writing: "W", speaking: "S", overall: "Overall" };
            var parts = [];
            Object.keys(r.ieltsValidation.details).forEach(function (cat) {
              var d = r.ieltsValidation.details[cat];
              var mark = d.status === "met" ? "&#10003;" : d.status === "not-met" ? "&#10007;" : "?";
              var cls = d.status === "met" ? "green" : d.status === "not-met" ? "red" : "grey";
              parts.push('<span class="ielts-cat ielts-cat--' + cls + '">' + catLabels[cat] + ": " + d.required + " (" + mark + ")</span>");
            });
            if (parts.length) ieltsSummary = '<div class="ielts-cats">' + parts.join(" ") + "</div>";
          }

          return '<div class="uni-card-wrap" data-action="open-university" data-id="' + u.id + '" style="cursor:pointer">' +
            '<div class="card card--pad">' +
              '<div class="card-hd">' +
                '<div class="row" style="gap:8px;align-items:flex-start">' +
                  '<div class="uni-flag">' + esc((u.dest || u.country || "??").toUpperCase().substring(0, 2)) + "</div>" +
                  '<div style="flex:1">' +
                    '<div class="h3" style="margin:0">' + esc(u.name) + "</div>" +
                    '<div class="tiny">' + esc(u.city || "") + (u.city ? ", " : "") + esc(u.country || "") + "</div>" +
                  "</div>" +
                  '<span class="badge badge--' + catColor + '">' + r.categoryName + "</span>" +
                "</div>" +
              "</div>" +
              '<div class="row mt-2" style="gap:12px">' +
                '<div class="mini-stat"><b>' + r.overall + "%</b><span>" + t("Readiness") + "</span></div>" +
                '<div class="mini-stat"><b>' + r.fulfilled + "</b><span>" + t("Met") + "</span></div>" +
                '<div class="mini-stat"><b>' + r.missing + "</b><span>" + t("Missing") + "</span></div>" +
                '<div class="mini-stat"><b>' + r.weaknesses + "</b><span>" + t("Close") + "</span></div>" +
              "</div>" +
              ieltsSummary +
              '<div class="row mt-2" style="gap:6px;flex-wrap:wrap">' +
                '<span class="chip" style="cursor:default">' + icon("route", "i-sm") + esc(primaryPathway) + "</span>" +
                (u.minGpa ? '<span class="chip" style="cursor:default">GPA ' + u.minGpa + "+</span>" : "") +
                (u.ielts ? '<span class="chip" style="cursor:default">IELTS ' + u.ielts + "+</span>" : "") +
                (u.admission && u.admission.appFee ? '<span class="chip" style="cursor:default">' + t("Fee") + " $" + u.admission.appFee + "</span>" : "") +
              "</div>" +
              (r.recommendations.length ?
                '<div class="insight warn mt-2">' + icon("alert", "i-sm") +
                '<span>' + esc(r.recommendations[0].action) + "</span></div>" : "") +
            "</div>" +
          "</div>";
        }).join("") + "</div>"
      :
        P.emptyState("search", t("No universities in this filter"), t("Try another category or country filter."),
          '<button class="btn btn--ghost" data-action="uni-filter" data-value="all">' + t("Show all") + "</button>")
      ) +
    "</div>";
  }

  /* --------------------------------------------------------- University detail drawer (Phase 2) */
  function drawerUniversity(state) {
    const p = state.profile;
    const ADM = global.SchoAdmission;
    if (!ADM) return "";

    // Find university in all sources
    var uni = null;
    var allUnis = [];
    if (global.SCHO_UNIS && global.SCHO_UNIS.UNIVERSITIES_EXPANDED) allUnis = allUnis.concat(global.SCHO_UNIS.UNIVERSITIES_EXPANDED);
    if (D.UNIVERSITIES) allUnis = allUnis.concat(D.UNIVERSITIES);
    var D_ID = global.SCHO_ID || { UNIVERSITIES_ID: [] };
    if (D_ID.UNIVERSITIES_ID) allUnis = allUnis.concat(D_ID.UNIVERSITIES_ID);
    uni = allUnis.find(function (u) { return u.id === state.drawer.id; });
    if (!uni) return "";

    var readiness = ADM.assessReadiness(p, uni);
    var pathway = ADM.detectAdmissionPathway(uni, p);
    var ieltsVal = readiness.ieltsValidation;
    var destInfo = E.destination(uni.dest);

    // Scholarship matches
    var schIds = uni.scholarships || uni.scholarshipIds || [];
    var schMatches = schIds.map(function (sid) {
      return (D.SCHOLARSHIPS || []).find(function (s) { return s.id === sid; }) ||
             (D_ID.SCHOLARSHIPS_ID || []).find(function (s) { return s.id === sid; });
    }).filter(Boolean);

    // IELTS category detail table
    var ieltsTable = "";
    if (ieltsVal && ieltsVal.details) {
      var catLabels = { listening: "Listening", reading: "Reading", writing: "Writing", speaking: "Speaking", overall: "Overall" };
      ieltsTable = '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("language") + t("IELTS Category Validation") + "</div>" +
        (ieltsVal.passed ? badge(t("All met"), "green") : badge(t("Gaps found"), "red")) + "</div>" +
        '<table class="ielts-table"><thead><tr><th>' + t("Category") + "</th><th>" + t("Required") + "</th><th>" + t("Your score") + "</th><th>" + t("Status") + "</th></tr></thead><tbody>" +
        Object.keys(ieltsVal.details).map(function (cat) {
          var d = ieltsVal.details[cat];
          var mark = d.status === "met" ? "&#10003; " + t("Met") : d.status === "not-met" ? "&#10007; " + t("Not met") : d.status === "missing" ? "? " + t("Not provided") : "? " + t("N/A");
          var rowClass = d.status === "met" ? "" : d.status === "not-met" ? " class=\"ielts-row--fail\"" : "";
          return "<tr" + rowClass + "><td>" + catLabels[cat] + "</td><td>" + d.required + "</td><td>" + (d.achieved !== null && d.achieved !== undefined ? d.achieved : "—") + "</td><td>" + mark + "</td></tr>";
        }).join("") +
        "</tbody></table>" +
        (ieltsVal.gaps.length ?
          '<div class="insight warn mt-2">' + icon("alert", "i-sm") +
          '<span>' + t("Improve these categories") + ": " + ieltsVal.gaps.map(function (g) { return catLabels[g.category] + " (+" + g.gap + ")"; }).join(", ") + "</span></div>" : "") +
        "</div>";
    }

    // Admission pathway details
    var pathwayHtml = "";
    if (pathway && pathway.pathways && pathway.pathways.length) {
      pathwayHtml = '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("route") + t("Admission Pathway") + "</div></div>" +
        pathway.pathways.map(function (pw) {
          return '<div class="pathway-block">' +
            '<div class="row" style="gap:6px"><b>' + esc(pw.name) + "</b>" + (pw.applicable ? badge(t("Applicable"), "green") : badge(t("Check eligibility"), "amber")) + "</div>" +
            '<dl class="kv mt-1">' +
            (pw.official ? "<dt>" + t("Official portal") + '</dt><dd><a href="' + esc(pw.official) + '" target="_blank" rel="noopener">' + esc(pw.official) + " " + icon("external", "i-sm") + "</a></dd>" : "") +
            "<dt>" + t("Timeline") + "</dt><dd>" + esc(pw.period) + "</dd>" +
            "<dt>" + t("Exam") + "</dt><dd>" + esc(pw.exam) + "</dd>" +
            "<dt>" + t("Requirements") + "</dt><dd>" + pw.requirements.map(function (r) { return esc(r); }).join(", ") + "</dd>" +
            "<dt>" + t("Documents") + "</dt><dd>" + pw.documents.map(function (d) { return esc(d); }).join(", ") + "</dd>" +
            "</dl>" +
            (pw.notes && pw.notes.length ? '<ul class="rm-acts mt-1">' + pw.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" : "") +
          "</div>";
        }).join("") +
        "</div>";
    }

    // Recommendations
    var recsHtml = readiness.recommendations.length ?
      '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("sparkle") + t("Action Plan") + "</div>" +
      badge(readiness.recommendations.length + " " + t("steps"), "amber") + "</div>" +
      '<div class="check-list">' + readiness.recommendations.map(function (r) {
        var priorityBadge = r.priority === "critical" ? badge(t("Critical"), "red") : r.priority === "high" ? badge(t("High"), "amber") : badge(t(r.priority.charAt(0).toUpperCase() + r.priority.slice(1)), "grey");
        return '<div class="check-item warn"><div class="ci-icon">' + icon("alert", "i-sm") + "</div>" +
          '<div><div class="ci-title">' + esc(r.action) + " " + priorityBadge + "</div>" +
          '<div class="ci-desc">' + esc(r.detail) + "</div></div></div>";
      }).join("") + "</div></div>" : "";

    // Related scholarships
    var schHtml = schMatches.length ?
      '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("target") + t("Scholarships for this university") + '</div></div>' +
      '<div class="list">' + schMatches.map(function (s) {
        return '<div class="list-item" data-action="open-scholarship" data-id="' + s.id + '" style="cursor:pointer">' +
          '<div class="li-icon">' + icon("target", "i-sm") + "</div>" +
          '<div><div class="li-title">' + esc(s.name) + "</div>" +
          '<div class="li-sub">' + esc(s.provider) + " · " + (s.funding === "full" ? t("Fully funded") : t("Partial")) + "</div></div>" +
          '<div class="li-right">' + badge("Tier " + (s.sourceTier || 2), "grey") + "</div></div>";
      }).join("") + "</div></div>" : "";

    // University facts
    var factsHtml = '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("shield") + t("University facts") + "</div></div>" +
      '<dl class="kv">' +
      "<dt>" + t("Country") + "</dt><dd>" + destInfo.code + " " + esc(destInfo.name) + "</dd>" +
      "<dt>" + t("City") + "</dt><dd>" + esc(uni.city || "—") + "</dd>" +
      "<dt>" + t("Type") + "</dt><dd>" + (uni.type === "PTN" || uni.type === "national-public" ? t("Public (PTN)") : uni.type === "PTS" || uni.type === "national-private" ? t("Private (PTS)") : uni.type === "international" ? t("International") : esc(uni.type || "—")) + "</dd>" +
      "<dt>" + t("Levels") + "</dt><dd>" + (uni.level ? uni.level.join(" · ") : t("All levels")) + "</dd>" +
      (uni.minGpa ? "<dt>" + t("Min GPA") + "</dt><dd>" + uni.minGpa + " / 4.0</dd>" : "") +
      (uni.ielts ? "<dt>" + t("IELTS overall") + "</dt><dd>" + uni.ielts + "+</dd>" : "") +
      (uni.toefl ? "<dt>" + t("TOEFL") + "</dt><dd>" + uni.toefl + "+</dd>" : "") +
      (uni.tuition ? "<dt>" + t("Tuition") + "</dt><dd>" + U.money(uni.tuition[p ? p.level : "Master"] || uni.tuition.Master || 0) + "/" + t("year") + "</dd>" : "") +
      (uni.livingMonthly ? "<dt>" + t("Living") + "</dt><dd>" + U.money(uni.livingMonthly) + "/" + t("month") + "</dd>" : "") +
      (uni.aid ? "<dt>" + t("Financial aid") + "</dt><dd>" + esc(uni.aid) + "</dd>" : "") +
      "</dl>" +
      '<a class="btn btn--ghost btn--block mt-2" href="' + esc(uni.url || "#") + '" target="_blank" rel="noopener">' + t("Official website") + icon("external", "i-sm") + "</a>" +
      "</div>";

    return '<div class="drawer-head">' +
      '<div class="drawer-title">' +
        '<div class="row" style="gap:6px">' + badge(destInfo.code + " " + destInfo.name, "grey") + badge(readiness.categoryName, readiness.categoryColor) + "</div>" +
        '<h2>' + esc(uni.name) + "</h2>" +
        '<div class="tiny">' + esc(uni.city || "") + (uni.city ? ", " : "") + esc(uni.country || "") + "</div>" +
      "</div>" +
      '<div class="readiness-ring"><div class="ring-big" style="--c:var(--' + readiness.categoryColor + ',var(--teal))">' + readiness.overall + '<span>%</span></div><span class="tiny">' + t("Readiness") + "</span></div>" +
      '<button class="icon-btn" data-action="close-drawer" aria-label="' + t("Close") + '">' + icon("x") + "</button>" +
    "</div>" +
    '<div class="drawer-body">' +
      '<div class="drawer-cost"><div><span>' + t("Admission readiness") + '</span><b>' + readiness.overall + '%</b><em>' + readiness.categoryName + "</em></div>" +
      '<div><span>' + t("Requirements met") + '</span><b>' + readiness.fulfilled + " / " + (readiness.fulfilled + readiness.missing + readiness.weaknesses) + "</b><em>" + readiness.missing + " " + t("missing") + "</em></div></div>" +

      // Fulfilled + Missing summary
      (readiness.fulfilled.length ?
        '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("checkCircle") + t("Requirements met") + "</div>" + badge(String(readiness.fulfilled.length), "green") + "</div>" +
        '<div class="check-list">' + readiness.fulfilled.map(function (f) {
          return '<div class="check-item"><div class="ci-icon">' + icon("check", "i-sm") + '</div><div><div class="ci-title">' + esc(f.requirement) + '</div><div class="ci-desc">' + esc(f.detail) + '</div></div></div></div>';
        }).join("") + "</div></div>" : "") +

      (readiness.weaknesses.length ?
        '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("alert") + t("Close — needs work") + "</div>" + badge(String(readiness.weaknesses.length), "amber") + "</div>" +
        '<div class="check-list">' + readiness.weaknesses.map(function (w) {
          return '<div class="check-item warn"><div class="ci-icon">' + icon("alert", "i-sm") + '</div><div><div class="ci-title">' + esc(w.requirement) + '</div><div class="ci-desc">' + esc(w.detail) + '</div></div></div></div>';
        }).join("") + "</div></div>" : "") +

      (readiness.missing.length ?
        '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("x") + t("Missing requirements") + "</div>" + badge(String(readiness.missing.length), "red") + "</div>" +
        '<div class="check-list">' + readiness.missing.map(function (m) {
          return '<div class="check-item warn"><div class="ci-icon">' + icon("x", "i-sm") + '</div><div><div class="ci-title">' + esc(m.requirement) + '</div><div class="ci-desc">' + esc(m.detail) + '</div></div></div></div>';
        }).join("") + "</div></div>" : "") +

      ieltsTable +
      pathwayHtml +
      recsHtml +
      factsHtml +
      schHtml +

      '<div class="drawer-actions">' +
        '<a class="btn btn--primary" href="' + esc(uni.admission ? uni.admission.appLink || uni.url : uni.url || "#") + '" target="_blank" rel="noopener">' + icon("external", "i-sm") + t("Apply now") + "</a>" +
        '<a class="btn btn--ghost" href="' + esc(uni.url || "#") + '" target="_blank" rel="noopener">' + t("Website") + "</a>" +
        '<button class="btn btn--soft" data-action="close-drawer">' + t("Close") + "</button>" +
      "</div>" +
    "</div>";
  }

  /* --------------------------------------------------------- Preparation Center (Phase 3) */
  function prepCenter(state) {
    const PREP = global.SCHO_PREP;
    if (!PREP) return '<div class="page app-page">' + P.emptyState("alert", t("Preparation data not loaded"), t("Please refresh the page.")) + "</div>";
    const p = state.profile;

    // Determine which test to focus on
    var focusTest = "ielts";
    if (p && p.tests) {
      var testPriority = ["ielts", "toefl", "duolingo", "sat", "gre", "utbk"];
      for (var i = 0; i < testPriority.length; i++) {
        if (p.tests[testPriority[i]] && p.tests[testPriority[i]].status !== "na") {
          focusTest = testPriority[i];
          break;
        }
      }
    }

    var ieltsModules = PREP.IELTS_PREP || [];
    var otherEngModules = PREP.OTHER_ENGLISH_PREP || [];
    var stdTestModules = PREP.STANDARD_TEST_PREP || [];
    var docModules = PREP.DOC_PREP || [];
    var interviewModules = PREP.INTERVIEW_PREP || [];
    var studyPlans = PREP.STUDY_PLANS || [];

    return '<div class="page app-page">' +
      '<div class="page-head"><div><div class="eyebrow">' + t("Preparation Center") + '</div>' +
      '<h1 class="h1">' + t("Everything you need to get ready.") + '</h1>' +
      '<p class="sub">' + t("Test prep, document guides, study plans, and interview practice — all in one place. Free resources, curated by topic.") + '</p></div></div>' +

      // Quick links
      '<div class="grid grid-4 mt-2">' +
        '<a class="card card--pad card--clickable" href="#/prep-ielts" style="text-decoration:none;color:inherit">' +
          '<div class="row" style="gap:8px">' + icon("language") + '<b>' + t("IELTS Prep") + "</b></div>" +
          '<div class="tiny mt-1">' + t("Listening, Reading, Writing, Speaking") + "</div></a>" +
        '<a class="card card--pad card--clickable" href="#/prep-tests" style="text-decoration:none;color:inherit">' +
          '<div class="row" style="gap:8px">' + icon("target") + '<b>' + t("Test Prep") + "</b></div>" +
          '<div class="tiny mt-1">' + t("TOEFL, SAT, GRE, UTBK") + "</div></a>" +
        '<a class="card card--pad card--clickable" href="#/prep-docs" style="text-decoration:none;color:inherit">' +
          '<div class="row" style="gap:8px">' + icon("file") + '<b>' + t("Documents") + "</b></div>" +
          '<div class="tiny mt-1">' + t("Personal statement, CV, recommendations") + "</div></a>" +
        '<a class="card card--pad card--clickable" href="#/prep-plans" style="text-decoration:none;color:inherit">' +
          '<div class="row" style="gap:8px">' + icon("route") + '<b>' + t("Study Plans") + "</b></div>" +
          '<div class="tiny mt-1">' + t("Week-by-week schedules") + "</div></a>" +
      "</div>" +

      // IELTS section
      '<div class="card card--pad mt-3">' +
        '<div class="card-hd"><div class="h3">' + icon("language") + t("IELTS Preparation") + "</div>" + badge(ieltsModules.length + " " + t("modules"), "teal") + "</div>" +
        '<div class="grid grid-2 mt-2">' + ieltsModules.map(function (m) {
          return '<div class="prep-module" data-action="open-prep" data-id="' + m.id + '" style="cursor:pointer">' +
            '<div class="row" style="gap:6px">' +
              '<span class="badge badge--' + (m.difficulty === "advanced" ? "red" : m.difficulty === "intermediate" ? "amber" : "green") + '">' + t(m.difficulty) + "</span>" +
              "<b>" + esc(m.title) + "</b></div>" +
            '<div class="tiny mt-1">' + esc(m.description) + "</div>" +
            '<div class="row mt-2" style="gap:6px">' +
              '<span class="chip" style="cursor:default">' + icon("clock", "i-sm") + esc(m.duration) + "</span>" +
              '<span class="chip" style="cursor:default">' + icon("target", "i-sm") + t("Target") + " " + m.targetScore + "</span>" +
              '<span class="chip" style="cursor:default">' + m.resources.length + " " + t("resources") + "</span>" +
            "</div></div>";
        }).join("") + "</div>" +
      "</div>" +

      // Other English tests
      '<div class="card card--pad mt-3">' +
        '<div class="card-hd"><div class="h3">' + icon("language") + t("Other English Tests") + "</div></div>" +
        '<div class="grid grid-2 mt-2">' + otherEngModules.map(function (m) {
          return '<div class="prep-module" data-action="open-prep" data-id="' + m.id + '" style="cursor:pointer">' +
            '<div class="row" style="gap:6px"><b>' + esc(m.title) + "</b>" +
              '<span class="badge badge--' + (m.difficulty === "beginner" ? "green" : "amber") + '">' + t(m.difficulty) + "</span></div>" +
            '<div class="tiny mt-1">' + esc(m.description) + "</div>" +
            '<div class="row mt-2" style="gap:6px">' +
              '<span class="chip" style="cursor:default">' + icon("clock", "i-sm") + esc(m.duration) + "</span>" +
              '<span class="chip" style="cursor:default">' + m.resources.length + " " + t("resources") + "</span>" +
            "</div></div>";
        }).join("") + "</div>" +
      "</div>" +

      // Standardized tests
      '<div class="card card--pad mt-3">' +
        '<div class="card-hd"><div class="h3">' + icon("target") + t("Standardized Test Prep") + "</div></div>" +
        '<div class="grid grid-2 mt-2">' + stdTestModules.map(function (m) {
          return '<div class="prep-module" data-action="open-prep" data-id="' + m.id + '" style="cursor:pointer">' +
            '<div class="row" style="gap:6px"><b>' + esc(m.title) + "</b>" +
              '<span class="badge badge--' + (m.difficulty === "advanced" ? "red" : "amber") + '">' + t(m.difficulty) + "</span></div>" +
            '<div class="tiny mt-1">' + esc(m.description) + "</div>" +
            '<div class="row mt-2" style="gap:6px">' +
              '<span class="chip" style="cursor:default">' + icon("clock", "i-sm") + esc(m.duration) + "</span>" +
              '<span class="chip" style="cursor:default">' + icon("target", "i-sm") + t("Target") + " " + m.targetScore + "</span>" +
              '<span class="chip" style="cursor:default">' + m.resources.length + " " + t("resources") + "</span>" +
            "</div></div>";
        }).join("") + "</div>" +
      "</div>" +

      // Documents
      '<div class="card card--pad mt-3">' +
        '<div class="card-hd"><div class="h3">' + icon("file") + t("Application Documents") + "</div></div>" +
        '<div class="grid grid-2 mt-2">' + docModules.map(function (m) {
          return '<div class="prep-module" data-action="open-prep" data-id="' + m.id + '" style="cursor:pointer">' +
            '<div class="row" style="gap:6px"><b>' + esc(m.title) + "</b></div>" +
            '<div class="tiny mt-1">' + esc(m.description) + "</div>" +
            '<div class="row mt-2" style="gap:6px">' +
              '<span class="chip" style="cursor:default">' + icon("clock", "i-sm") + esc(m.duration) + "</span>" +
              '<span class="chip" style="cursor:default">' + (m.sections || m.resources || []).length + " " + t("steps") + "</span>" +
            "</div></div>";
        }).join("") + "</div>" +
      "</div>" +

      // Study Plans
      '<div class="card card--pad mt-3">' +
        '<div class="card-hd"><div class="h3">' + icon("route") + t("Study Plan Templates") + "</div></div>" +
        '<div class="list mt-2">' + studyPlans.map(function (plan) {
          return '<div class="list-item" data-action="open-plan" data-id="' + plan.id + '" style="cursor:pointer">' +
            '<div class="li-icon">' + icon("route", "i-sm") + "</div>" +
            "<div><div class=\"li-title\">" + esc(plan.title) + "</div>" +
            '<div class="li-sub">' + plan.weeks.length + " " + t("weeks") + " · " + plan.totalHours + " " + t("hours total") + " · " + t("Target") + " " + plan.targetScore + "</div></div>" +
            '<div class="li-right">' + badge(plan.testType.toUpperCase(), "grey") + "</div></div>";
        }).join("") + "</div>" +
      "</div>" +

      // Interview Prep
      '<div class="card card--pad mt-3">' +
        '<div class="card-hd"><div class="h3">' + icon("user") + t("Interview Preparation") + "</div></div>" +
        '<div class="grid grid-2 mt-2">' + interviewModules.map(function (m) {
          return '<div class="prep-module" data-action="open-prep" data-id="' + m.id + '" style="cursor:pointer">' +
            '<div class="row" style="gap:6px"><b>' + esc(m.title) + "</b>" +
              '<span class="badge badge--' + (m.difficulty === "advanced" ? "red" : "amber") + '">' + t(m.difficulty) + "</span></div>" +
            '<div class="tiny mt-1">' + esc(m.description) + "</div>" +
            '<div class="row mt-2" style="gap:6px">' +
              '<span class="chip" style="cursor:default">' + icon("clock", "i-sm") + esc(m.duration) + "</span>" +
              '<span class="chip" style="cursor:default">' + m.commonQuestions.length + " " + t("practice questions") + "</span>" +
            "</div></div>";
        }).join("") + "</div>" +
      "</div>" +
    "</div>";
  }

  /* --------------------------------------------------------- Application Tracker (Phase 5) */
  function tracker(state) {
    var apps = state.applications || [];
    var PREP = global.SCHO_PREP;
    var stages = PREP ? PREP.APP_STAGES : [];

    // Stats by stage
    var stageCounts = {};
    apps.forEach(function (a) { stageCounts[a.stage] = (stageCounts[a.stage] || 0) + 1; });

    return '<div class="page app-page">' +
      '<div class="page-head"><div><div class="eyebrow">' + t("Application Tracker") + '</div>' +
      '<h1 class="h1">' + t("Track every application.") + "</h1>" +
      '<p class="sub">' + t("Keep all your university and scholarship applications in one place. Update stages, set deadlines, and never miss a step.") + '</p></div>' +
      '<div class="page-head-actions"><button class="btn btn--primary" data-action="add-application">' + icon("plus", "i-sm") + t("Add application") + '</button></div></div>' +

      // Stats
      '<div class="grid grid-4 mt-2">' +
        U.statCard(t("Total applications"), String(apps.length), t("in progress or completed"), "briefcase") +
        U.statCard(t("Active"), String(apps.filter(function (a) { return ["research", "shortlisted", "documents", "submitted", "interview"].indexOf(a.stage) >= 0; }).length), t("currently working on"), "clock", "amber") +
        U.statCard(t("Offers"), String(stageCounts.offered || 0), t("admission or scholarship offers"), "checkCircle", "green") +
        U.statCard(t("Accepted"), String(stageCounts.accepted || 0), t("final decisions"), "star", "green") +
      "</div>" +

      (apps.length ?
        // Application list grouped by stage
        '<div class="mt-3">' + stages.filter(function (s) { return s.id !== "withdrawn"; }).map(function (stage) {
          var stageApps = apps.filter(function (a) { return a.stage === stage.id; });
          if (!stageApps.length) return "";
          return '<div class="card card--pad mt-2">' +
            '<div class="card-hd"><div class="h3">' + icon(stage.icon) + t(stage.name) + "</div>" + badge(String(stageApps.length), stage.color) + "</div>" +
            '<div class="list">' + stageApps.map(function (a) {
              var dl = a.deadline ? new Date(a.deadline) : null;
              var daysLeft = dl ? Math.ceil((dl - new Date()) / 86400000) : null;
              return '<div class="list-item" data-action="open-app-detail" data-id="' + a.id + '" style="cursor:pointer">' +
                '<div class="li-icon">' + icon(a.type === "scholarship" ? "target" : "graduation", "i-sm") + "</div>" +
                "<div><div class=\"li-title\">" + esc(a.name) + "</div>" +
                '<div class="li-sub">' + esc(a.org || "") + (a.deadline ? " · " + t("Deadline") + ": " + a.deadline : "") + "</div></div>" +
                '<div class="li-right">' + (daysLeft !== null && daysLeft >= 0 ? badge(t("{n} days left", { n: daysLeft }), daysLeft < 14 ? "red" : "amber") : "") + "</div></div>";
            }).join("") + "</div></div>";
        }).join("") + "</div>"
      :
        P.emptyState("briefcase", t("No applications yet"), t("Add your first university or scholarship application to start tracking."),
          '<button class="btn btn--primary" data-action="add-application">' + icon("plus", "i-sm") + t("Add your first application") + "</button>")
      ) +
    "</div>";
  }

  /* --------------------------------------------------------- AI Consultation (Phase 4) */
  function aiConsult(state) {
    var PREP = global.SCHO_PREP;
    if (!PREP || !PREP.AI_KNOWLEDGE) return '<div class="page app-page">' + P.emptyState("alert", t("AI consultation not loaded"), t("Please refresh.")) + "</div>";

    var cats = PREP.AI_KNOWLEDGE.categories || [];
    var advice = PREP.AI_KNOWLEDGE.advice || {};
    var selectedCat = state.aiCategory || "strategy";
    var cat = cats.find(function (c) { return c.id === selectedCat; }) || cats[0];

    return '<div class="page app-page">' +
      '<div class="page-head"><div><div class="eyebrow">' + t("AI Consultation") + '</div>' +
      '<h1 class="h1">' + t("Ask SchoLink AI.") + "</h1>" +
      '<p class="sub">' + t("Get instant guidance on applications, funding, tests, visas, and more. Choose a topic to see common questions and expert answers.") + '</p></div></div>' +

      '<div class="split mt-2">' +
        '<div class="stack" style="flex:0 0 220px">' +
          '<div class="card card--pad"><div class="card-hd"><div class="h3">' + icon("list") + t("Topics") + '</div></div>' +
          '<div class="list">' + cats.map(function (c) {
            return '<button class="list-item" style="cursor:pointer;border:none;background:none;width:100%;text-align:left' + (c.id === selectedCat ? ";background:var(--teal-soft)" : "") + '" data-action="ai-category" data-value="' + c.id + '">' +
              '<div class="li-icon">' + icon("chevronRight", "i-sm") + "</div>" +
              "<div><div class=\"li-title\">" + esc(c.name) + "</div></div></button>";
          }).join("") + "</div></div>" +
        "</div>" +

        '<div class="stack" style="flex:1">' +
          '<div class="card card--pad">' +
            '<div class="card-hd"><div class="h3">' + icon("sparkle") + esc(cat.name) + "</div></div>" +
            '<div class="stack mt-2">' + cat.questions.map(function (q, i) {
              var key = q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              var answer = advice[key];
              return '<div class="ai-q-block" style="border:1px solid var(--line);border-radius:12px;padding:16px">' +
                '<div class="row" style="gap:6px"><b>' + icon("help", "i-sm") + esc(q) + "</b></div>" +
                (answer ?
                  '<div class="mt-1" style="font-size:14px;line-height:1.6">' + esc(answer.a) + "</div>"
                :
                  '<div class="mt-1 tiny muted">' + t("Detailed answer coming soon. In the meantime, check the related resources in the Preparation Center.") + "</div>"
                ) +
                "</div>";
            }).join("") + "</div>" +
          "</div>" +

          '<div class="card card--pad card--sand">' +
            '<div class="h3">' + icon("info") + t("About SchoLink AI") + "</div>" +
            '<p class="small muted mt-1">' + t("This is a knowledge-based consultation tool with curated answers to the most common questions. It is not a replacement for official guidance — always verify deadlines and requirements with the official university or scholarship provider.") + "</p>" +
            '<a class="btn btn--ghost mt-2" href="#/universities">' + t("Browse universities") + icon("arrow", "i-sm") + "</a>" +
            '<a class="btn btn--ghost mt-2" href="#/prep">' + t("Preparation Center") + icon("arrow", "i-sm") + "</a>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>";
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

  global.AppPages = { appShell, dashboard, matches, universities, tracker, prepCenter, aiConsult, report, indonesia, plan, settings, drawerScholarship, drawerDestination, drawerUniversity };
})(window);
