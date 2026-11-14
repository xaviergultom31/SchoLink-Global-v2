/* =========================================================================
   SchoLink Global — Engine v3
   Curriculum-aware eligibility, 4-category matching (HIGH / COMPETITIVE /
   REACH / NOT CURRENTLY ELIGIBLE), cost estimation, funding gaps, study plans.
   Spec §3 (assessment), §4 (tests), §6 (matching), §9 (costs).
   ========================================================================= */
(function (global) {
  "use strict";

  const D = global.SCHO;
  const D_ID = global.SCHO_ID || { UNIVERSITIES_ID: [], SCHOLARSHIPS_ID: [], ROUTES: [], PREP_MODULES: [], LIVING_ID: {}, CALENDAR_ID: [] };

  /* Merge expanded scholarships (loaded after data.js, before engine.js) */
  if (global.SCHO_EXPANDED && global.SCHO_EXPANDED.EXPANDED_SCHOLARSHIPS) {
    var existingIds = {};
    D.SCHOLARSHIPS.forEach(function (s) { existingIds[s.id] = true; });
    global.SCHO_EXPANDED.EXPANDED_SCHOLARSHIPS.forEach(function (s) {
      if (!existingIds[s.id]) {
        D.SCHOLARSHIPS.push(s);
      }
    });
    D.META.stats.scholarships = D.SCHOLARSHIPS.length;
  }

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const round = (v, d) => Math.round(v * Math.pow(10, d || 0)) / Math.pow(10, d || 0);

  const COVERAGE = { t: 0, s: 0, travel: false, ins: false };
  const LIFESTYLE = { budget: 0.78, standard: 1, comfort: 1.32 };
  const ENGLISH_EQUIV = {
    IELTS: (v) => v,
    TOEFL: (v) => (v >= 110 ? 7.5 : v >= 100 ? 7 : v >= 90 ? 6.5 : v >= 80 ? 6 : v >= 70 ? 5.5 : 5),
    PTE: (v) => (v >= 73 ? 7.5 : v >= 65 ? 7 : v >= 58 ? 6.5 : v >= 50 ? 6 : v >= 42 ? 5.5 : 5),
    Duolingo: (v) => (v >= 125 ? 7 : v >= 115 ? 6.5 : v >= 100 ? 6 : v >= 90 ? 5.5 : 5),
  };

  const byId = (list, id) => list.find((x) => x.id === id);
  const origin = (id) => byId(D.ORIGINS, id) || D.ORIGINS[0];
  const destination = (id) => byId(D.DESTINATIONS, id) || D.DESTINATIONS[0];
  const university = (id) => byId(D.UNIVERSITIES, id);
  const fieldName = (id) => (byId(D.FIELDS, id) || { name: "All fields" }).name;
  const matchCategory = (id) => byId(D.MATCH_CATEGORIES, id) || D.MATCH_CATEGORIES[0];

  /* ------------------------------------------------------------------ tests */
  // Spec §4: test-status-aware evaluation.
  // Missing tests must NOT disqualify — they should produce a gap/prepare signal.
  function getTestStatus(profile, testId) {
    if (!profile.tests) return "na";
    const entry = profile.tests[testId];
    if (!entry) return "na";
    return entry.status || "na";
  }

  function getTestScore(profile, testId) {
    if (!profile.tests) return null;
    const entry = profile.tests[testId];
    if (!entry || entry.status !== "taken") return null;
    return Number(entry.score) || null;
  }

  /* ------------------------------------------------------------------ english */
  function englishEquivalent(p) {
    // Prefer explicit test-status entry if available (spec §4 model)
    if (p.tests) {
      var ieltsScore = getTestScore(p, "ielts");
      if (ieltsScore) return Number(ieltsScore);
      var toeflScore = getTestScore(p, "toefl");
      if (toeflScore) return ENGLISH_EQUIV.TOEFL(toeflScore);
      var pteScore = getTestScore(p, "pte");
      if (pteScore) return ENGLISH_EQUIV.PTE(pteScore);
      var duoScore = getTestScore(p, "duolingo");
      if (duoScore) return ENGLISH_EQUIV.Duolingo(duoScore);
    }
    // Fallback to legacy single-score model
    if (!p || !p.englishType || p.englishType === "None") return 0;
    var fn = ENGLISH_EQUIV[p.englishType] || ENGLISH_EQUIV.IELTS;
    return Number(fn(Number(p.englishScore) || 0)) || 0;
  }

  function englishTestStatus(p) {
    if (p.tests) {
      if (getTestStatus(p, "ielts") !== "na") return getTestStatus(p, "ielts");
      if (getTestStatus(p, "toefl") !== "na") return getTestStatus(p, "toefl");
      if (getTestStatus(p, "pte") !== "na") return getTestStatus(p, "pte");
      if (getTestStatus(p, "duolingo") !== "na") return getTestStatus(p, "duolingo");
    }
    if (p.englishType && p.englishType !== "None" && p.englishScore) return "taken";
    return "not-taken";
  }

  function incomeUSD(p) {
    const band = byId(D.INCOME_BANDS, p.incomeBand);
    return band ? band.usd : 30000;
  }

  /* ------------------------------------------------- curriculum-aware grades */
  // Spec §3: holistic assessment across multiple curricula.
  // No universal 4.0 GPA conversion — interpret in-context.
  function interpretGPA(p) {
    var curriculum = p.curriculum || "national";
    var gpa = Number(p.gpa) || 0;

    if (curriculum === "ib") {
      // IB: 0–45 points. 24 = passing, 42+ = top
      return {
        raw: gpa,
        scale: "0–45 IB points",
        normalized: clamp(gpa / 45, 0, 1),
        interpretation: gpa >= 40 ? "Excellent" : gpa >= 33 ? "Strong" : gpa >= 24 ? "Passing" : "Below IB pass",
        isPassing: gpa >= 24,
      };
    }
    if (curriculum === "cambridge") {
      // A-Level: convert letter grades to a 0–1 scale
      var aLevelMap = { "A*": 1.0, A: 0.9, B: 0.75, C: 0.65, D: 0.55, E: 0.45 };
      // If gpa is numeric, treat it as a percentage average
      if (typeof p.gpa === "number" && gpa > 0 && gpa <= 5) {
        // Some schools report A-Level as a 4.0-style scale
        return {
          raw: gpa, scale: "Approx 4.0 scale",
          normalized: clamp(gpa / 4, 0, 1),
          interpretation: gpa >= 3.7 ? "A*/A equivalent" : gpa >= 3.0 ? "B/C equivalent" : "Below C",
          isPassing: gpa >= 2.0,
        };
      }
      return {
        raw: gpa, scale: "A*–E (Cambridge)",
        normalized: clamp(gpa / 100, 0, 1),
        interpretation: gpa >= 80 ? "A*/A equivalent" : gpa >= 60 ? "B/C equivalent" : "Below C",
        isPassing: gpa >= 40,
      };
    }
    if (curriculum === "ap") {
      // AP: 1–5 per exam. Average across exams.
      return {
        raw: gpa, scale: "1–5 AP average",
        normalized: clamp(gpa / 5, 0, 1),
        interpretation: gpa >= 4 ? "Strong (4–5)" : gpa >= 3 ? "Passing (3)" : "Below AP pass",
        isPassing: gpa >= 3,
      };
    }
    if (curriculum === "wace") {
      // ATAR: 0–99.95
      return {
        raw: gpa, scale: "ATAR 0–99.95",
        normalized: clamp(gpa / 100, 0, 1),
        interpretation: gpa >= 90 ? "Top 10%" : gpa >= 75 ? "Strong" : gpa >= 50 ? "Passing" : "Below ATAR 50",
        isPassing: gpa >= 50,
      };
    }
    // Default: national 0–100 or 0–4 scale
    if (gpa > 4) {
      return {
        raw: gpa, scale: "0–100 national",
        normalized: clamp(gpa / 100, 0, 1),
        interpretation: gpa >= 85 ? "Excellent" : gpa >= 75 ? "Strong" : gpa >= 60 ? "Passing" : "Below pass",
        isPassing: gpa >= 60,
      };
    }
    return {
      raw: gpa, scale: "0–4 GPA",
      normalized: clamp(gpa / 4, 0, 1),
      interpretation: gpa >= 3.5 ? "Excellent" : gpa >= 3.0 ? "Strong" : gpa >= 2.0 ? "Passing" : "Below pass",
      isPassing: gpa >= 2.0,
    };
  }

  /* ------------------------------------------------------------------ costs */
  function tuitionOf(destId, level) {
    const d = destination(destId);
    const range = d.tuition[level] || d.tuition.Master;
    return Math.round((range[0] + range[1]) / 2);
  }

  function costEstimate(destId, level, opts) {
    opts = opts || {};
    const d = destination(destId);
    const lifestyle = LIFESTYLE[opts.lifestyle] || 1;
    const tuition = tuitionOf(destId, level);
    const living = Math.round(d.livingMonthly * 12 * lifestyle);
    const insurance = d.insuranceYear;
    const visa = d.visaFee;
    const flights = d.flights;
    const application = d.applicationFee;
    // Phase 6: Additional cost components
    const booksSupplies = Math.round(tuition * 0.04 + 300);
    const residencePermit = Math.round(visa * 0.6);
    const oneTimeSetup = Math.round(500 * lifestyle); // deposit, household setup, phone/SIM, initial transport
    const oneTime = visa + flights + application + residencePermit + oneTimeSetup;
    const recurringAnnual = tuition + living + insurance + booksSupplies;
    const total = recurringAnnual + oneTime;
    return {
      destination: d, tuition, living, insurance, visa, flights, application,
      booksSupplies, residencePermit, oneTimeSetup,
      oneTime, recurringAnnual, total,
      duration: d.duration[level] || 2,
      monthlyLiving: Math.round(d.livingMonthly * lifestyle),
      // Multi-year totals
      totalProgram: Math.round(tuition * (d.duration[level] || 2) + living * (d.duration[level] || 2) + insurance * (d.duration[level] || 2) + booksSupplies * (d.duration[level] || 2) + oneTime),
    };
  }

  function scholarshipCoverage(s) {
    return Object.assign({}, COVERAGE, s.coverage || {});
  }

  function scholarshipCost(s, profile, opts) {
    opts = opts || {};
    const level = opts.level || (profile && profile.level) || s.level[0];
    const cost = costEstimate(s.dest, level, opts);
    const cov = scholarshipCoverage(s);
    const tuitionAid = Math.round(cost.tuition * clamp(cov.t, 0, 1));
    const stipend = Math.round((cov.s || 0) * 12);
    const travelAid = cov.travel ? cost.flights + cost.visa : 0;
    const insuranceAid = cov.ins ? cost.insurance : 0;
    const funding = tuitionAid + stipend + travelAid + insuranceAid;
    const net = Math.max(0, cost.total - funding);
    return {
      cost, funding, tuitionAid, stipend, travelAid, insuranceAid,
      net, netYear: net, totalProgram: Math.round(net * cost.duration),
      outOfPocket: Math.max(0, cost.oneTime + cost.tuition - tuitionAid),
      gapMonthly: Math.round(net / 12),
      duration: cost.duration,
    };
  }

  /* ------------------------------------------------------------ eligibility */
  // Spec §3/§4: hard gates + soft warnings.
  // Test-status aware: missing tests produce warnings, not failures.
  function evaluate(p, s) {
    const fails = [];
    const warns = [];
    const eq = englishEquivalent(p);
    const engStatus = englishTestStatus(p);
    const gpaInfo = interpretGPA(p);

    // Hard gate: level match
    if (s.level.indexOf(p.level) < 0) {
      fails.push({ code: "level", vars: { level: p.level, options: s.level.join(", ") } });
    }

    // Hard gate: GPA — use curriculum interpretation but compare against minGpa on a 4.0-normalised basis
    if (s.minGpa) {
      var gpa4 = gpaInfo.normalized * 4; // normalise to 4.0 scale for comparison
      if (gpa4 < s.minGpa - 0.25) {
        fails.push({ code: "gpa", vars: { have: gpa4.toFixed(2), need: s.minGpa.toFixed(1), scale: gpaInfo.scale } });
      } else if (gpa4 < s.minGpa) {
        warns.push({ code: "gpaClose", vars: { have: gpa4.toFixed(2), need: s.minGpa.toFixed(1), scale: gpaInfo.scale } });
      }
    }

    // English: test-status aware (spec §4)
    // If test is "taken" and score is below requirement, it's a fail (if far) or warning (if close)
    // If test is "registered" or "planning", it's a warning (not yet ready, but not disqualified)
    // If test is "not-taken" or "na", it's a warning (gap to address)
    if (s.ielts) {
      if (engStatus === "taken") {
        if (eq < s.ielts - 0.5) {
          fails.push({ code: "english", vars: { have: eq || "none", need: s.ielts } });
        } else if (eq < s.ielts) {
          warns.push({ code: "englishClose", vars: { have: eq, need: s.ielts } });
        }
      } else if (engStatus === "registered" || engStatus === "planning") {
        warns.push({ code: "englishPending", vars: { status: engStatus, need: s.ielts } });
      } else {
        warns.push({ code: "englishNotTaken", vars: { need: s.ielts } });
      }
    }

    // Hard gate: income cap
    if (s.incomeCap && incomeUSD(p) > s.incomeCap) {
      fails.push({ code: "income", vars: { cap: s.incomeCap, income: incomeUSD(p) } });
    }

    // Hard gate: region restriction
    if (s.regions && s.regions.length && s.regions.indexOf(origin(p.origin).region) < 0) {
      fails.push({ code: "region", vars: { region: origin(p.origin).region } });
    }

    // Soft warning: work experience
    if (s.workYears && Number(p.workYears || 0) < s.workYears) {
      warns.push({ code: "work", vars: { have: Number(p.workYears || 0), need: s.workYears } });
    }

    // Hard gate: women-only
    if (s.women && p.gender !== "woman") {
      fails.push({ code: "women" });
    }

    const fieldMatch = s.fields.indexOf("*") >= 0 || s.fields.indexOf(p.field) >= 0;
    return { eligible: fails.length === 0, fails, warns, fieldMatch, english: eq, englishStatus: engStatus, gpaInfo: gpaInfo };
  }

  /* ------------------------------------------------------- 4-category matching */
  // Spec §6: HIGH MATCH / COMPETITIVE MATCH / REACH MATCH / NOT CURRENTLY ELIGIBLE
  function determineCategory(p, s, ev, scoreData) {
    // Hard gate: not eligible if any hard failure
    if (!ev.eligible) return "not-eligible";

    var score = scoreData.score;
    var readiness = scoreData.readiness;
    var hasWarns = ev.warns.length > 0;

    // HIGH MATCH: exceeds minimums, no warnings, high readiness
    if (!hasWarns && readiness >= 0.75 && score >= 70) return "high";

    // COMPETITIVE MATCH: meets minimums, may have minor warnings, decent readiness
    if (readiness >= 0.55 && score >= 45) return "competitive";

    // REACH MATCH: eligible but below competitive threshold or significant gaps
    return "reach";
  }

  /* --------------------------------------------------------------- scoring */
  function vector(p) {
    const o = origin(p.origin);
    var gpaNorm = interpretGPA(p).normalized;
    return [
      clamp(gpaNorm, 0, 1),
      clamp(englishEquivalent(p) / 9, 0, 1),
      clamp(1 - (incomeUSD(p) / 60000), 0, 1),
      clamp((o.equity + (p.regionType === "rural" ? 15 : p.regionType === "small" ? 7 : 0)) / 100, 0, 1),
      p.targets && p.targets.length ? 0.85 : 0.3,
    ];
  }

  function cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
  }

  function peerSignal(p, s) {
    const v = vector(p);
    let total = 0, weight = 0, best = null, bestSim = 0;
    D.ARCHETYPES.forEach((a) => {
      const sim = cosine(v, a.vector);
      const saves = a.saves.indexOf(s.id) >= 0 ? 1 : 0.1;
      total += sim * saves;
      weight += sim;
      if (sim > bestSim) { bestSim = sim; best = a; }
    });
    return { score: weight ? clamp(total / weight, 0, 1) : 0.3, archetype: best, similarity: round(bestSim, 2) };
  }

  function matchScore(p, s) {
    const ev = evaluate(p, s);
    const o = origin(p.origin);
    const eq = ev.english;
    const gpaInfo = ev.gpaInfo;

    // Sub-scores (0–1 each)
    var gpaFit = s.minGpa
      ? clamp((gpaInfo.normalized * 4 - (s.minGpa - 0.4)) / 0.9, 0, 1)
      : 0.75;
    var need = s.incomeCap
      ? clamp(1 - incomeUSD(p) / (s.incomeCap * 1.35), 0, 1)
      : clamp(1 - incomeUSD(p) / 50000, 0.1, 1);
    var equity = clamp((o.equity + (p.regionType === "rural" ? 12 : p.regionType === "small" ? 6 : 0) + (p.connectivity === "low" ? 8 : p.connectivity === "mixed" ? 4 : 0)) / 100, 0, 1);

    // Readiness: test-status aware
    var engRatio = 0.85;
    if (s.ielts) {
      if (ev.englishStatus === "taken") {
        engRatio = clamp(eq / s.ielts, 0, 1);
      } else if (ev.englishStatus === "registered") {
        engRatio = clamp((eq || 4) / s.ielts * 0.5, 0, 0.6); // partially ready
      } else if (ev.englishStatus === "planning") {
        engRatio = 0.2; // not started yet
      } else {
        engRatio = 0.15;
      }
    }
    var diagRatio = clamp((Number(p.diagnostic) || 55) / 100, 0, 1);
    var readiness = clamp(engRatio * 0.6 + diagRatio * 0.4, 0, 1);

    var fieldFit = ev.fieldMatch ? 1 : 0.3;
    var opportunity = clamp(1 - s.selectivity, 0, 1);
    var peer = peerSignal(p, s);

    const W = { gpa: 0.25, need: 0.18, equity: 0.18, readiness: 0.15, field: 0.06, opportunity: 0.03, peer: 0.15 };
    const score = 100 * (
      W.gpa * gpaFit + W.need * need + W.equity * equity + W.readiness * readiness +
      W.field * fieldFit + W.opportunity * opportunity + W.peer * peer.score
    );

    const parts = {
      academic: Math.round(gpaFit * 100),
      financial: Math.round(need * 100),
      equity: Math.round(equity * 100),
      readiness: Math.round(readiness * 100),
      field: Math.round(fieldFit * 100),
      opportunity: Math.round(opportunity * 100),
      peers: Math.round(peer.score * 100),
    };

    var scoreData = {
      score: Math.round(clamp(score, 1, 99)),
      parts: parts, peer: peer,
      readiness: readiness,
      englishRatio: engRatio,
    };

    var category = determineCategory(p, s, ev, scoreData);
    var catInfo = matchCategory(category);

    return {
      score: scoreData.score,
      category: category,
      categoryName: catInfo.name,
      categoryColor: catInfo.color,
      categoryDescription: catInfo.description,
      parts, peer, eligibility: ev, origin: o,
      ready: ev.eligible && readiness >= 0.62,
      readiness: Math.round(readiness * 100),
      status: category === "not-eligible" ? "not-eligible" : (readiness >= 0.62 ? "ready" : "prepare"),
      reasons: buildReasons(p, s, ev, peer, o),
      gpaInfo: gpaInfo,
      englishStatus: ev.englishStatus,
    };
  }

  function buildReasons(p, s, ev, peer, o) {
    const reasons = [];
    const cov = scholarshipCoverage(s);
    if (cov.t >= 1) reasons.push({ code: "fullTuition" });
    if (cov.s > 0) reasons.push({ code: "stipend", vars: { amount: cov.s } });
    if (s.incomeCap && incomeUSD(p) <= s.incomeCap) reasons.push({ code: "incomeEligible", vars: { cap: s.incomeCap } });
    if (s.regions && s.regions.length && s.regions.indexOf(o.region) >= 0) reasons.push({ code: "regionPriority", vars: { region: o.region } });
    if (s.firstGen && p.firstGen) reasons.push({ code: "firstGen" });
    if (o.equity >= 60) reasons.push({ code: "equity", vars: { origin: o.name, index: o.equity } });
    if (s.ielts && ev.englishStatus === "taken" && ev.english >= s.ielts) reasons.push({ code: "englishMet", vars: { score: ev.english } });
    if (s.ielts && ev.englishStatus === "registered") reasons.push({ code: "englishRegistered", vars: { need: s.ielts } });
    if (s.ielts && ev.englishStatus === "planning") reasons.push({ code: "englishPlanning", vars: { need: s.ielts } });
    if (!s.ielts) reasons.push({ code: "noEnglish" });
    if (s.minGpa && ev.gpaInfo.normalized * 4 >= s.minGpa) reasons.push({ code: "gpaMet", vars: { margin: round(ev.gpaInfo.normalized * 4 - s.minGpa, 2) } });
    if (s.connectivity === "low") reasons.push({ code: "lowBandwidth" });
    if (peer.similarity >= 0.82) reasons.push({ code: "peers", vars: { pct: Math.round(peer.similarity * 100) } });
    if (ev.fieldMatch && s.fields.indexOf("*") < 0) reasons.push({ code: "fieldMatch", vars: { field: fieldName(p.field) } });
    return reasons.slice(0, 4);
  }

  /* --------------------------------------------------------------- gaps */
  function gaps(p, s, cost) {
    const list = [];
    const eq = englishEquivalent(p);
    const engStatus = englishTestStatus(p);
    const gpaInfo = interpretGPA(p);
    var gpa4 = gpaInfo.normalized * 4;

    if (s.minGpa && gpa4 < s.minGpa) {
      list.push({ code: "gpa", vars: { have: gpa4.toFixed(2), need: s.minGpa.toFixed(1), gap: round(s.minGpa - gpa4, 2), scale: gpaInfo.scale } });
    }
    if (s.ielts) {
      if (engStatus === "taken" && eq < s.ielts) {
        list.push({ code: "english", vars: { have: eq || 0, need: s.ielts, gap: round(s.ielts - eq, 1) } });
      } else if (engStatus === "registered" || engStatus === "planning") {
        list.push({ code: "englishPending", vars: { status: engStatus, need: s.ielts } });
      } else if (engStatus === "not-taken" || engStatus === "na") {
        list.push({ code: "englishNotTaken", vars: { need: s.ielts } });
      }
    }
    if (s.workYears && Number(p.workYears || 0) < s.workYears) list.push({ code: "work", vars: { have: Number(p.workYears || 0), need: s.workYears } });
    if (s.incomeCap && incomeUSD(p) > s.incomeCap) list.push({ code: "income", vars: { have: incomeUSD(p), cap: s.incomeCap } });
    if (s.docs === "physical") list.push({ code: "documents" });
    if (cost && cost.net > 2500) list.push({ code: "funding", vars: { amount: cost.net } });
    if (s.interview === "offline") list.push({ code: "interviewTravel" });

    // Standardized test gaps (spec §4)
    if (p.level === "Bachelor" && p.dest === "us") {
      var satStatus = getTestStatus(p, "sat");
      if (satStatus === "not-taken" || satStatus === "na") {
        list.push({ code: "standardTest", vars: { test: "SAT/ACT", need: "Required for US undergraduate admission" } });
      }
    }
    if (p.level === "Master" || p.level === "PhD") {
      var greStatus = getTestStatus(p, "gre");
      if (greStatus === "not-taken") {
        list.push({ code: "standardTest", vars: { test: "GRE", need: "May be required for graduate programmes" } });
      }
    }
    return list;
  }

  /* ---------------------------------------------------------- recommendations */
  function recommend(p, opts) {
    opts = opts || {};
    const rows = [];
    D.SCHOLARSHIPS.forEach((s) => {
      if (opts.level && s.level.indexOf(opts.level) < 0) return;
      const ev = evaluate(p, s);
      if (s.level.indexOf(p.level) < 0) return;
      // Include not-eligible in results so user can see them, but rank them last
      const m = matchScore(p, s);
      const cost = scholarshipCost(s, p, { level: p.level, lifestyle: opts.lifestyle });
      rows.push({
        scholarship: s, score: m.score, category: m.category, categoryName: m.categoryName,
        categoryColor: m.categoryColor, categoryDescription: m.categoryDescription,
        parts: m.parts, peer: m.peer, eligibility: m.eligibility,
        reasons: m.reasons, status: m.status, cost, gaps: gaps(p, s, cost),
        readiness: m.readiness, englishStatus: m.englishStatus, gpaInfo: m.gpaInfo,
        deadlineDays: daysUntil(s.deadline),
        verification: {
          sourceTier: s.sourceTier, verified: s.verified, status: s.status,
          renewal: s.renewal, nominalAmount: s.nominalAmount,
        },
      });
    });

    // Sort by category priority then score
    var catOrder = { "high": 0, "competitive": 1, "reach": 2, "not-eligible": 3 };
    rows.sort((a, b) => {
      var ca = catOrder[a.category] || 3;
      var cb = catOrder[b.category] || 3;
      if (ca !== cb) return ca - cb;
      return b.score - a.score;
    });
    return rows;
  }

  /* --------------------------------------------------- Indonesia matching */
  // Spec §8: domestic admissions matching for Indonesian universities.
  function recommendID(p, opts) {
    opts = opts || {};
    if (!D_ID.UNIVERSITIES_ID || !D_ID.UNIVERSITIES_ID.length) return [];
    const rows = [];
    var gpaInfo = interpretGPA(p);
    var gpa4 = gpaInfo.normalized * 4;

    D_ID.UNIVERSITIES_ID.forEach((u) => {
      var ev = { eligible: true, fails: [], warns: [] };
      if (u.minGpa && gpa4 < u.minGpa - 0.25) {
        ev.eligible = false;
        ev.fails.push({ code: "gpa", vars: { have: gpa4.toFixed(2), need: u.minGpa } });
      } else if (u.minGpa && gpa4 < u.minGpa) {
        ev.warns.push({ code: "gpaClose", vars: { have: gpa4.toFixed(2), need: u.minGpa } });
      }
      if (u.ielts && englishEquivalent(p) < u.ielts - 0.5 && p.level === "Master") {
        ev.warns.push({ code: "englishClose", vars: { have: englishEquivalent(p), need: u.ielts } });
      }
      // Field match
      var fm = u.fields.indexOf(p.field) >= 0 || u.fields.indexOf("*") >= 0;

      // Determine category
      var category = "not-eligible";
      if (ev.eligible) {
        if (ev.warns.length === 0 && u.competitiveness !== "very-high") category = "high";
        else if (ev.warns.length <= 1) category = "competitive";
        else category = "reach";
        // Very competitive universities push everything down one notch
        if (u.competitiveness === "very-high" && category === "high") category = "competitive";
      }

      var catInfo = matchCategory(category);
      var scholarshipMatches = (u.scholarshipIds || []).map(function (sid) {
        return byId(D_ID.SCHOLARSHIPS_ID, sid);
      }).filter(Boolean);

      rows.push({
        university: u,
        category: category,
        categoryName: catInfo.name,
        categoryColor: catInfo.color,
        categoryDescription: catInfo.description,
        eligibility: ev,
        fieldMatch: fm,
        routes: u.routes,
        scholarshipMatches: scholarshipMatches,
        fees: u.fees,
        tests: u.tests,
        competitiveness: u.competitiveness,
      });
    });

    var catOrder = { "high": 0, "competitive": 1, "reach": 2, "not-eligible": 3 };
    rows.sort((a, b) => (catOrder[a.category] || 3) - (catOrder[b.category] || 3));
    return rows;
  }

  /* ------------------------------------------------------------- profile stats */
  function profileStats(p) {
    const o = origin(p.origin);
    const eq = englishEquivalent(p);
    const gpaInfo = interpretGPA(p);
    const completeness = 0.25 +
      (p.name ? 0.08 : 0) +
      (p.gpa ? 0.12 : 0) +
      (eq ? 0.1 : 0) +
      (p.incomeBand ? 0.08 : 0) +
      (p.targets && p.targets.length ? 0.08 : 0) +
      (p.field ? 0.04 : 0) +
      (p.curriculum ? 0.07 : 0) +
      (p.tests && Object.keys(p.tests).length ? 0.1 : 0) +
      (p.extracurriculars && p.extracurriculars.length ? 0.04 : 0) +
      (p.altMajors && p.altMajors.length ? 0.04 : 0);
    return {
      origin: o, english: eq, income: incomeUSD(p),
      strength: Math.round(clamp(0.3 * gpaInfo.normalized + 0.3 * (eq / 9) + 0.2 * (o.equity / 100) + 0.2 * completeness, 0, 1) * 100),
      completeness: Math.round(clamp(completeness, 0, 1) * 100),
      vector: vector(p).map((v) => Math.round(v * 100)),
      gpaInfo: gpaInfo,
      englishStatus: englishTestStatus(p),
    };
  }

  /* ------------------------------------------------------------------ plan */
  function planFor(p, scholarshipId) {
    const s = byId(D.SCHOLARSHIPS, scholarshipId);
    if (!s) return null;
    const cost = scholarshipCost(s, p, { level: p.level });
    const gapList = gaps(p, s, cost);
    const modules = [];
    const add = (id) => { if (modules.indexOf(id) < 0) modules.push(id); };

    if (gapList.some((g) => g.code === "english" || g.code === "englishPending" || g.code === "englishNotTaken")) add("english-test");
    if (gapList.some((g) => g.code === "gpa")) add("gpa");
    if (gapList.some((g) => g.code === "standardTest")) add("test-prep");
    if (s.interview !== "none") add("interview");
    if (s.fields.indexOf("*") < 0) add("portfolio");
    if (s.docs === "physical") add("documents");
    if (cost.net > 0) add("budget");
    if (s.apply === "offline") add("documents");
    if (s.level.indexOf("PhD") >= 0) add("networking");
    if (s.selectivity <= 0.1 || s.level.indexOf("Master") >= 0) add("essay");
    if (s.connectivity === "low") add("visa");
    add("documents");

    const weeks = Math.max(4, Math.min(16, Math.ceil((daysUntil(s.deadline) || 30) / 7)));
    const plan = modules.slice(0, 8).map((id, i) => {
      const m = D.MODULES[id] || Object.values(D.MODULES)[0];
      const week = 1 + Math.floor((i * weeks) / Math.max(1, modules.slice(0, 8).length));
      const start = new Date();
      start.setDate(start.getDate() + (week - 1) * 7);
      return { id: s.id + ":" + id, moduleId: id, title: m.name, domain: m.domain, hours: m.hours, activities: m.activities, week, start: start.toISOString().slice(0, 10) };
    });

    return {
      scholarship: s, cost, gaps: gapList, plan, weeks,
      readiness: readinessScore(p, s, cost),
      category: matchScore(p, s).category,
      verification: {
        sourceTier: s.sourceTier, verified: s.verified, status: s.status,
        renewal: s.renewal, nominalAmount: s.nominalAmount,
      },
      savings: cost.net > 0 ? {
        target: cost.net,
        monthly12: Math.ceil(cost.net / 12),
        monthly24: Math.ceil(cost.net / 24),
      } : null,
      notes: gapList.length
        ? { code: "gaps", vars: { count: gapList.length } }
        : { code: "clear" },
    };
  }

  function readinessScore(p, s, cost) {
    const eq = englishEquivalent(p);
    const engStatus = englishTestStatus(p);
    const gpaInfo = interpretGPA(p);
    const gpaRatio = s.minGpa ? clamp(gpaInfo.normalized * 4 / s.minGpa, 0, 1) : 0.8;

    var engRatio;
    if (s.ielts) {
      if (engStatus === "taken") engRatio = clamp(eq / s.ielts, 0, 1);
      else if (engStatus === "registered") engRatio = 0.4;
      else if (engStatus === "planning") engRatio = 0.2;
      else engRatio = 0.1;
    } else {
      engRatio = 0.85;
    }

    const fundingRatio = cost && cost.net > 0 ? clamp(1 - cost.net / 60000, 0.2, 1) : 1;
    const docs = s.docs === "physical" && p.connectivity === "low" ? 0.75 : 1;
    return Math.round(clamp(0.4 * gpaRatio + 0.3 * engRatio + 0.2 * fundingRatio + 0.1 * docs, 0, 1) * 100);
  }

  /* ------------------------------------------------------------- utilities */
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function daysUntil(iso) {
    const now = new Date();
    const d = new Date(iso + "T23:59:59");
    return Math.ceil((d - now) / 86400000);
  }
  function formatDate(iso, lang) {
    const d = new Date(iso + "T00:00:00");
    try {
      return d.toLocaleDateString(lang || "en", { day: "numeric", month: "short", year: "numeric" });
    } catch (e) {
      return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
    }
  }

  function average(numbers) {
    return numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
  }

  function destinationStats(destId) {
    const list = D.SCHOLARSHIPS.filter((s) => s.dest === destId);
    return { count: list.length, minNet: Math.min.apply(null, list.map((s) => scholarshipCost(s, null, { level: s.level[0] }).net)) };
  }

  /* ----------------------------------------------- Indonesia cost estimation */
  function costEstimateID(universityId, level, lifestyle) {
    var u = byId(D_ID.UNIVERSITIES_ID, universityId);
    if (!u) return null;
    var feeRange = u.fees[level] || u.fees.Bachelor;
    var tuition = Math.round((feeRange[0] + feeRange[1]) / 2);
    var city = (u.city || "").split(",")[0].toLowerCase().trim();
    var livingInfo = D_ID.LIVING_ID[city] || D_ID.LIVING_ID["lainnya"];
    var lifeMult = LIFESTYLE[lifestyle] || 1;
    var living = Math.round(livingInfo.monthly * 12 * lifeMult);
    return {
      university: u, tuition: tuition, living: living, monthlyLiving: Math.round(livingInfo.monthly * lifeMult),
      total: tuition + living, duration: level === "Bachelor" ? 4 : level === "Master" ? 2 : 3,
    };
  }

  global.SchoEngine = {
    byId, origin, destination, university, fieldName, matchCategory,
    englishEquivalent, englishTestStatus, incomeUSD, tuitionOf, costEstimate, scholarshipCost, scholarshipCoverage,
    interpretGPA,
    evaluate, matchScore, determineCategory, gaps, recommend, recommendID, profileStats, planFor, readinessScore,
    vector, cosine, peerSignal, daysUntil, formatDate, average, destinationStats,
    costEstimateID,
    getTestStatus, getTestScore,
    LIFESTYLE,
  };
})(window);
