/* =========================================================================
   SchoLink Global — App controller
   ========================================================================= */
(function (global) {
  "use strict";

  const D = global.SCHO;
  const E = global.SchoEngine;
  const P = global.Pages;
  const A = global.AppPages;
  const I = global.I18n;
  const U = global.UI;
  const t = (s, v) => I.t(s, v);

  const KEY = "scholink.global.v1";
  const APP_ROUTES = ["dashboard", "matches", "report", "indonesia", "plan", "settings"];
  const SITE_ROUTES = ["home", "destinations", "scholarships", "costs", "impact"];

  const DEFAULT_DRAFT = {
    name: "", origin: "id", regionType: "rural", connectivity: "mixed",
    level: "Master", field: "engineering", gpa: 3.4,
    englishType: "IELTS", englishScore: 6.5, workYears: 0,
    incomeBand: "b", firstGen: true, gender: "woman", needAid: true,
    targets: ["uk", "de"], priority: "cost", intake: "2027",
    // Spec §3/§14: curriculum and extended profile
    curriculum: "national",
    classRank: "", altMajors: [], extracurriculars: [],
    maxAffordableTuition: 5000,
    // Spec §4: test-status model — { testId: { status, score } }
    tests: {
      ielts: { status: "taken", score: 6.5 },
      toefl: { status: "na", score: null },
      pte: { status: "na", score: null },
      duolingo: { status: "na", score: null },
      sat: { status: "na", score: null },
      act: { status: "na", score: null },
      gre: { status: "na", score: null },
      gmat: { status: "na", score: null },
    },
  };

  const state = {
    route: "home",
    profile: null,
    step: 1,
    draft: Object.assign({}, DEFAULT_DRAFT),
    filters: { q: "", level: "Any", field: "Any", dest: "Any", funding: "Any" },
    destRegion: "All",
    calc: { dest: "uk", level: "Master", lifestyle: "standard", scholarship: "" },
    costMini: { dest: "us", level: "Master", lifestyle: "standard" },
    matches: [],
    saved: [],
    progress: {},
    planTarget: null,
    matchFilter: "all",
    matchSort: "score",
    drawer: null,
    saver: false,
  };

  /* --------------------------------------------------------------- storage */
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        profile: state.profile, saved: state.saved, progress: state.progress,
        planTarget: state.planTarget, saver: state.saver,
        lang: I.state.lang, currency: I.state.currency,
      }));
    } catch (e) { /* ignore */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      state.profile = d.profile || null;
      state.saved = d.saved || [];
      state.progress = d.progress || {};
      state.planTarget = d.planTarget || null;
      state.saver = !!d.saver;
      if (d.lang) I.state.lang = d.lang;
      if (d.currency) I.state.currency = d.currency;
      document.body.classList.toggle("saver", state.saver);
    } catch (e) { /* ignore */ }
  }

  function refreshMatches() {
    state.matches = state.profile ? E.recommend(state.profile) : [];
  }

  /* ---------------------------------------------------------------- routing */
  function routeFromHash() {
    const h = (location.hash || "#/").replace(/^#\/?/, "").split("?")[0];
    return h || "home";
  }

  function go(route) {
    if (location.hash === "#/" + route || (route === "home" && location.hash === "")) {
      render();
      return;
    }
    location.hash = "#/" + route;
  }

  function activeFor(route) {
    return route === "home" ? "home" : route;
  }

  function render() {
    const app = document.getElementById("app");
    const active = document.activeElement;
    const focusAction = active && active.getAttribute ? active.getAttribute("data-action") : null;
    const focusFilter = active && active.getAttribute ? active.getAttribute("data-filter-q") : null;
    const selection = active && typeof active.selectionStart === "number" ? active.selectionStart : null;

    document.body.classList.toggle("saver", state.saver);
    I.applyDocument();

    const route = state.route;
    if (APP_ROUTES.indexOf(route) >= 0) {
      if (!state.profile) {
        state.route = "start";
        state.step = 1;
        try { history.replaceState(null, "", "#/start"); } catch (e) { location.hash = "#/start"; }
        app.innerHTML = P.start(state);
        return;
      }
      const page = A[route](state);
      app.innerHTML = A.appShell(state, route, page);
    } else if (route === "start") {
      app.innerHTML = P.start(state);
    } else {
      const map = { home: P.home, destinations: P.destinations, scholarships: P.scholarships, costs: P.costs, impact: P.impact };
      const page = (map[route] || P.home)(state);
      app.innerHTML = P.header(state, activeFor(route)) + page + P.footer();
    }

    if (state.drawer) renderDrawer(); else closeDrawer(false);

    if (focusAction) {
      const el = document.querySelector('[data-action="' + focusAction + '"]');
      if (el && el.focus) { el.focus(); if (selection != null && el.setSelectionRange) { try { el.setSelectionRange(selection, selection); } catch (e) {} } }
    }
    if (focusFilter) {
      const el = document.querySelector('[data-filter-q]');
      if (el) { el.focus(); if (selection != null) { try { el.setSelectionRange(selection, selection); } catch (e) {} } }
    }
  }

  /* --------------------------------------------------------------- drawers */
  function openDrawer(type, id) {
    state.drawer = { type, id };
    renderDrawer();
    const dr = document.getElementById("drawer");
    dr.classList.add("open");
    dr.setAttribute("aria-hidden", "false");
    document.getElementById("backdrop").classList.add("show");
    document.body.classList.add("no-scroll");
  }

  function closeDrawer(clear) {
    const dr = document.getElementById("drawer");
    if (!dr) return;
    if (clear) state.drawer = null;
    dr.classList.remove("open");
    dr.setAttribute("aria-hidden", "true");
    document.getElementById("backdrop").classList.remove("show");
    document.body.classList.remove("no-scroll");
  }

  function renderDrawer() {
    const dr = document.getElementById("drawer");
    if (!state.drawer) return;
    const html = state.drawer.type === "scholarship" ? A.drawerScholarship(state) : A.drawerDestination(state);
    dr.innerHTML = html;
  }

  /* ------------------------------------------------------------------ modal */
  function modal(html) {
    const m = document.getElementById("modal");
    m.innerHTML = html;
    m.classList.add("open");
    document.getElementById("backdrop").classList.add("show");
  }
  function closeModal() {
    document.getElementById("modal").classList.remove("open");
    if (!document.getElementById("drawer").classList.contains("open")) document.getElementById("backdrop").classList.remove("show");
  }

  /* ------------------------------------------------------------- onboarding */
  function finishOnboarding() {
    const d = state.draft;
    if (!String(d.name).trim()) {
      U.toast(t("Please add your first name."), "warn");
      return;
    }
    state.profile = {
      name: d.name.trim(),
      origin: d.origin,
      regionType: d.regionType,
      connectivity: d.connectivity,
      level: d.level,
      field: d.field,
      gpa: Number(d.gpa),
      englishType: d.englishType,
      englishScore: d.englishType === "None" ? 0 : Number(d.englishScore),
      workYears: Number(d.workYears) || 0,
      incomeBand: d.incomeBand,
      firstGen: !!d.firstGen,
      gender: d.gender,
      needAid: !!d.needAid,
      targets: d.targets.slice(),
      priority: d.priority,
      intake: d.intake,
      diagnostic: 55,
      // Spec §3/§14: extended profile
      curriculum: d.curriculum || "national",
      classRank: d.classRank || "",
      altMajors: (d.altMajors || []).slice(),
      extracurriculars: (d.extracurriculars || []).slice(),
      maxAffordableTuition: Number(d.maxAffordableTuition) || 5000,
      tests: Object.assign({}, d.tests || {}),
    };
    refreshMatches();
    const first = state.matches.find((r) => r.eligibility.eligible) || state.matches[0];
    state.planTarget = first ? first.scholarship.id : null;
    save();
    go("dashboard");
    U.toast(t("Profile saved. {n} matches found.", { n: state.matches.length }));
  }

  function editProfile() {
    const p = state.profile;
    if (!p) { go("start"); return; }
    state.draft = {
      name: p.name, origin: p.origin, regionType: p.regionType, connectivity: p.connectivity,
      level: p.level, field: p.field, gpa: p.gpa, englishType: p.englishType,
      englishScore: p.englishScore, workYears: p.workYears, incomeBand: p.incomeBand,
      firstGen: p.firstGen, gender: p.gender, needAid: p.needAid,
      targets: p.targets.slice(), priority: p.priority, intake: p.intake,
      curriculum: p.curriculum || "national",
      classRank: p.classRank || "",
      altMajors: (p.altMajors || []).slice(),
      extracurriculars: (p.extracurriculars || []).slice(),
      maxAffordableTuition: p.maxAffordableTuition || 5000,
      tests: Object.assign({}, p.tests || {}),
    };
    state.step = 1;
    go("start");
  }

  function nextStep() {
    if (state.step === 1 && !String(state.draft.name).trim()) {
      U.toast(t("Please add your first name."), "warn");
      return;
    }
    if (state.step === 2) {
      var g = Number(state.draft.gpa);
      var maxGpa = state.draft.curriculum === "ib" ? 45 : state.draft.curriculum === "ap" ? 5 : state.draft.curriculum === "wace" ? 100 : 4;
      if (!(g >= 0 && g <= maxGpa)) { U.toast(t("GPA must be between 0 and {n}.", { n: maxGpa }), "warn"); return; }
    }
    state.step = Math.min(4, state.step + 1);
    render();
    window.scrollTo(0, 0);
  }

  /* -------------------------------------------------------------- actions */
  function changeLang(code) {
    I.loadLang(code).then(() => {
      I.setLang(code);
      save();
      render();
    }).catch(() => {
      U.toast(t("Translation could not be loaded. Showing English."), "warn");
    });
  }

  function exportPlan() {
    const plan = state.planTarget ? E.planFor(state.profile, state.planTarget) : null;
    const payload = {
      app: "SchoLink", version: D.META.version, exportedAt: new Date().toISOString(),
      language: I.state.lang, currency: I.state.currency,
      profile: state.profile,
      matches: state.matches.slice(0, 10).map((r) => ({
        id: r.scholarship.id, name: r.scholarship.name, score: r.score,
        netCost: r.cost.net, deadline: r.scholarship.deadline,
      })),
      saved: state.saved,
      plan: plan ? { scholarship: plan.scholarship.name, readiness: plan.readiness, modules: plan.plan.map((m) => ({ week: m.week, title: m.title, done: !!(state.progress[plan.scholarship.id] || {})[m.moduleId] })) } : null,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scholink-plan.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    U.toast(t("Your plan has been downloaded."));
  }

  function confirmClear() {
    modal(`<div class="modal-head"><h3>${t("Delete all your data?")}</h3><button class="icon-btn" data-action="close-modal">${U.icon("x", "i-sm")}</button></div>
      <p class="small muted">${t("This removes your profile, matches, saved scholarships and plan from this browser. It cannot be undone.")}</p>
      <div class="modal-actions"><button class="btn btn--ghost" data-action="close-modal">${t("Cancel")}</button><button class="btn btn--danger" data-action="clear-confirm">${t("Delete everything")}</button></div>`);
  }

  function clearAll() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    state.profile = null; state.matches = []; state.saved = []; state.progress = {};
    state.planTarget = null; state.draft = Object.assign({}, DEFAULT_DRAFT); state.step = 1;
    closeModal(); closeDrawer(true);
    go("home");
    U.toast(t("All local data has been deleted."));
  }

  function handleAction(el) {
    const action = el.getAttribute("data-action");
    if (!action) return;
    const id = el.getAttribute("data-id");
    switch (action) {
      case "menu":
        document.getElementById("mobilePanel").classList.toggle("open");
        break;
      case "search": {
        document.querySelectorAll("[data-search]").forEach((sel) => {
          const key = sel.getAttribute("data-search");
          state.filters[key] = sel.value;
        });
        state.filters.q = "";
        state.filters.funding = "Any";
        go("scholarships");
        break;
      }
      case "filter": {
        state.filters[el.getAttribute("data-field")] = el.getAttribute("data-value");
        render();
        break;
      }
      case "reset-filters":
        state.filters = { q: "", level: "Any", field: "Any", dest: "Any", funding: "Any" };
        render();
        break;
      case "dest-region": state.destRegion = el.getAttribute("data-value"); render(); break;
      case "open-scholarship": openDrawer("scholarship", id); break;
      case "open-destination": openDrawer("destination", id); break;
      case "close-drawer": closeDrawer(true); break;
      case "close-modal": closeModal(); break;
      case "calc-level": state.calc.level = el.getAttribute("data-value"); render(); break;
      case "calc-lifestyle": state.calc.lifestyle = el.getAttribute("data-value"); render(); break;
      case "calc-dest": state.calc.dest = el.getAttribute("data-value"); render(); break;
      case "next": nextStep(); break;
      case "back": state.step = Math.max(1, state.step - 1); render(); window.scrollTo(0, 0); break;
      case "pick": state.draft[el.getAttribute("data-field")] = el.getAttribute("data-value"); render(); break;
      case "pick-target": {
        const v = el.getAttribute("data-value");
        const i = state.draft.targets.indexOf(v);
        if (i >= 0) state.draft.targets.splice(i, 1);
        else if (state.draft.targets.length < 4) state.draft.targets.push(v);
        else U.toast(t("Choose up to four destinations."), "warn");
        render();
        break;
      }
      case "finish": finishOnboarding(); break;
      case "save": {
        const i = state.saved.indexOf(id);
        if (i >= 0) state.saved.splice(i, 1); else state.saved.push(id);
        save();
        if (state.drawer) renderDrawer();
        render();
        U.toast(i >= 0 ? t("Removed from saved.") : t("Saved to your list."));
        break;
      }
      case "plan-target": {
        state.planTarget = id;
        save();
        closeDrawer(true);
        go("plan");
        break;
      }
      case "change-target": state.planTarget = null; save(); render(); break;
      case "module": {
        if (!state.planTarget) break;
        state.progress[state.planTarget] = state.progress[state.planTarget] || {};
        state.progress[state.planTarget][el.getAttribute("data-module")] = el.checked;
        save();
        break;
      }
      case "match-filter": state.matchFilter = el.getAttribute("data-value"); render(); break;
      case "export": exportPlan(); break;
      case "clear": confirmClear(); break;
      case "clear-confirm": clearAll(); break;
      case "edit-profile": editProfile(); break;
      case "saver": state.saver = !state.saver; document.body.classList.toggle("saver", state.saver); save(); render(); break;
      default: break;
    }
  }

  /* ---------------------------------------------------------------- events */
  function bind() {
    document.addEventListener("click", (ev) => {
      const el = ev.target.closest("[data-action]");
      if (!el) return;
      if (el.tagName === "INPUT" || el.tagName === "SELECT") return;
      ev.preventDefault();
      handleAction(el);
    });

    document.addEventListener("change", (ev) => {
      const el = ev.target;
      const action = el.getAttribute("data-action");
      if (action === "lang") { changeLang(el.value); return; }
      if (action === "currency") { I.setCurrency(el.value); save(); render(); return; }
      if (action === "saver" && el.type === "checkbox") { state.saver = el.checked; document.body.classList.toggle("saver", state.saver); save(); render(); return; }
      if (action === "match-sort") { state.matchSort = el.value; render(); return; }
      if (action === "save" && el.type === "checkbox") { handleAction(el); return; }
      if (action === "test-status") {
        var testId = el.getAttribute("data-test");
        if (!state.draft.tests) state.draft.tests = {};
        if (!state.draft.tests[testId]) state.draft.tests[testId] = { status: "na", score: null };
        state.draft.tests[testId].status = el.value;
        if (el.value !== "taken") state.draft.tests[testId].score = null;
        render();
        return;
      }
      if (action === "test-score") {
        var testId2 = el.getAttribute("data-test");
        if (!state.draft.tests) state.draft.tests = {};
        if (!state.draft.tests[testId2]) state.draft.tests[testId2] = { status: "taken", score: null };
        state.draft.tests[testId2].score = el.value ? Number(el.value) : null;
        return;
      }
      if (action === "module" && el.type === "checkbox") {
        if (!state.planTarget) return;
        state.progress[state.planTarget] = state.progress[state.planTarget] || {};
        state.progress[state.planTarget][el.getAttribute("data-module")] = el.checked;
        save();
        render();
        return;
      }
      const filter = el.getAttribute("data-filter");
      if (filter) { state.filters[filter] = el.value; render(); return; }
      const calc = el.getAttribute("data-calc");
      if (calc) { state.calc[calc] = el.value; render(); return; }
      const binder = el.getAttribute("data-bind");
      if (binder) { onBind(binder, el.type === "checkbox" ? el.checked : el.value); }
    });

    document.addEventListener("input", (ev) => {
      const el = ev.target;
      const binder = el.getAttribute("data-bind");
      if (binder) { onBind(binder, el.type === "checkbox" ? el.checked : el.value); return; }
      if (el.getAttribute("data-filter-q") !== null || el.getAttribute("data-action") === "filter-q") {
        state.filters.q = el.value;
        clearTimeout(el._timer);
        el._timer = setTimeout(render, 260);
        return;
      }
      const mini = el.getAttribute("data-mini");
      if (mini) { state.costMini[mini] = el.value; clearTimeout(el._timer); el._timer = setTimeout(render, 120); }
    });

    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") closeDrawer(true);
      if ((ev.key === "Enter" || ev.key === " ") && ev.target.classList && (ev.target.classList.contains("sch-card") || ev.target.classList.contains("dest-card"))) {
        ev.preventDefault();
        handleAction(ev.target);
      }
    });

    document.getElementById("backdrop").addEventListener("click", () => { closeDrawer(true); closeModal(); });
    window.addEventListener("hashchange", () => {
      state.route = routeFromHash();
      render();
      window.scrollTo(0, 0);
    });
  }

  function onBind(field, value) {
    if (field === "gpa") {
      var maxGpa = state.draft.curriculum === "ib" ? 45 : state.draft.curriculum === "ap" ? 5 : state.draft.curriculum === "wace" ? 100 : 4;
      value = value === "" ? "" : Math.max(0, Math.min(maxGpa, Number(value)));
    }
    if (field === "altMajors" || field === "extracurriculars") {
      state.draft[field] = String(value).split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      return;
    }
    state.draft[field] = value;
    if (field === "englishType" || field === "curriculum") render();
  }

  /* ------------------------------------------------------------------ boot */
  async function boot() {
    load();
    state.route = routeFromHash();
    if (!SITE_ROUTES.concat(APP_ROUTES, ["start"]).includes(state.route)) state.route = "home";
    if (I.state.lang !== "en") {
      try { await I.loadLang(I.state.lang); } catch (e) { I.state.lang = "en"; }
    }
    I.applyDocument();
    refreshMatches();
    bind();
    render();
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  global.SchoApp = { state, render, go };
})(window);
