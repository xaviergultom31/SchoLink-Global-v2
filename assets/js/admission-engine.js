/* =========================================================================
   SchoLink Global — Admission Engine
   Spec §2: University Admission & LoA Preparation
   Spec §5: IELTS Category Validation (L/R/W/S/Overall)
   Spec §6: Admission Readiness Assessment

   Builds on the existing matching engine but adds:
   - IELTS per-category validation (not just overall)
   - Admission readiness scoring (requirements fulfilled vs missing)
   - Suitability classification (Strong / Competitive / Reach / Not Eligible)
   - Unified domestic + international admission pathways
   - Actionable recommendations to improve readiness
   ========================================================================= */
(function (global) {
  "use strict";

  const D = global.SCHO;
  const E = global.SchoEngine;
  const D_ID = global.SCHO_ID || { UNIVERSITIES_ID: [], ROUTES: [] };

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const round = (v, d) => Math.round(v * Math.pow(10, d || 0)) / Math.pow(10, d || 0);

  /* ============================================================
     §5 — IELTS CATEGORY VALIDATION
     Validates Listening, Reading, Writing, Speaking, and Overall
     independently. A student must meet ALL category minimums.
     ============================================================ */

  function validateIeltsCategories(profileIelts, universityIeltsCat) {
    if (!universityIeltsCat) return { passed: true, gaps: [] };

    var result = { passed: true, gaps: [], details: {} };
    var categories = ["listening", "reading", "writing", "speaking", "overall"];

    // Map short keys to full names
    var catMap = { l: "listening", r: "reading", w: "writing", s: "speaking", overall: "overall" };

    categories.forEach(function (cat) {
      var shortKey = cat === "overall" ? "overall" : cat[0]; // l, r, w, s
      var required = universityIeltsCat[shortKey] || universityIeltsCat[cat];
      var achieved = profileIelts ? (profileIelts[cat] || profileIelts[shortKey]) : null;

      if (required && required > 0) {
        var status = "na";
        if (achieved !== null && achieved !== undefined) {
          status = achieved >= required ? "met" : "not-met";
          if (status === "not-met") result.passed = false;
        } else {
          // If profile doesn't have category scores, check overall only
          status = "missing";
        }

        result.details[cat] = {
          required: required,
          achieved: achieved,
          status: status,
          gap: (achieved !== null && achieved !== undefined) ? round(required - achieved, 1) : null,
        };

        if (status === "not-met") {
          result.gaps.push({
            category: cat,
            required: required,
            achieved: achieved,
            gap: round(required - achieved, 1),
          });
        }
      }
    });

    return result;
  }

  /* ============================================================
     §5 — ENGLISH PROFICIENCY MULTI-TEST SUPPORT
     Supports IELTS, TOEFL iBT, PTE Academic, Duolingo, Cambridge
     with official equivalency (NOT direct conversion)
     ============================================================ */

  var ENGLISH_TESTS = {
    ielts: {
      name: "IELTS Academic",
      scale: "0-9",
      categories: ["listening", "reading", "writing", "speaking", "overall"],
    },
    toefl: {
      name: "TOEFL iBT",
      scale: "0-120",
      categories: ["listening", "reading", "writing", "speaking", "total"],
    },
    pte: {
      name: "PTE Academic",
      scale: "10-90",
      categories: ["listening", "reading", "writing", "speaking", "overall"],
    },
    duolingo: {
      name: "Duolingo English Test",
      scale: "10-160",
      categories: ["overall"], // DET only reports overall + subscores since 2024
    },
    cambridge: {
      name: "Cambridge English (C1 Advanced / C2 Proficiency)",
      scale: "Pass/A/B/C",
      categories: ["overall"],
    },
  };

  // Official IELTS <-> TOEFL/PTE/Duolingo equivalency (approximate, per university guidelines)
  var EQUIV_TABLE = [
    { ielts: 5.0, toefl: 35, pte: 30, duolingo: 60 },
    { ielts: 5.5, toefl: 46, pte: 42, duolingo: 90 },
    { ielts: 6.0, toefl: 60, pte: 50, duolingo: 100 },
    { ielts: 6.5, toefl: 79, pte: 58, duolingo: 115 },
    { ielts: 7.0, toefl: 94, pte: 65, duolingo: 125 },
    { ielts: 7.5, toefl: 102, pte: 73, duolingo: 130 },
    { ielts: 8.0, toefl: 110, pte: 79, duolingo: 135 },
    { ielts: 8.5, toefl: 115, pte: 82, duolingo: 140 },
    { ielts: 9.0, toefl: 120, pte: 90, duolingo: 160 },
  ];

  function ieltsToEquiv(ieltsScore, testType) {
    for (var i = EQUIV_TABLE.length - 1; i >= 0; i--) {
      if (ieltsScore >= EQUIV_TABLE[i].ielts) {
        return EQUIV_TABLE[i][testType] || null;
      }
    }
    return null;
  }

  function equivToIelts(score, testType) {
    for (var i = 0; i < EQUIV_TABLE.length; i++) {
      if (score >= EQUIV_TABLE[i][testType]) {
        return EQUIV_TABLE[i].ielts;
      }
    }
    return 0;
  }

  /* ============================================================
     §2 — ADMISSION READINESS ASSESSMENT
     Evaluates a student's readiness for a specific university.
     Returns: fulfilled, missing, weaknesses, recommendations.
     ============================================================ */

  function assessReadiness(profile, university) {
    if (!profile || !university) return null;

    var result = {
      university: university,
      overall: 0,
      fulfilled: [],
      missing: [],
      weaknesses: [],
      recommendations: [],
      category: "not-eligible",
      categoryName: "Not Currently Eligible",
      categoryColor: "red",
      ieltsValidation: null,
      gpaStatus: null,
      testStatus: null,
      documentStatus: null,
      englishStatus: null,
    };

    var gpaInfo = E.interpretGPA(profile);
    var gpa4 = gpaInfo.normalized * 4;
    var englishEq = E.englishEquivalent(profile);
    var engStatus = E.englishTestStatus(profile);

    /* --- GPA / Academic Qualification --- */
    if (university.minGpa) {
      if (gpa4 >= university.minGpa) {
        result.fulfilled.push({
          requirement: "Minimum GPA",
          detail: "GPA " + gpa4.toFixed(2) + " (on 4.0 scale) meets minimum " + university.minGpa,
          status: "met",
        });
        result.gpaStatus = "met";
      } else if (gpa4 >= university.minGpa - 0.3) {
        result.weaknesses.push({
          requirement: "Minimum GPA",
          detail: "GPA " + gpa4.toFixed(2) + " is close to minimum " + university.minGpa + " but below",
          status: "close",
          gap: round(university.minGpa - gpa4, 2),
        });
        result.gpaStatus = "close";
        result.recommendations.push({
          priority: "high",
          action: "Improve academic grades in remaining courses",
          detail: "Your GPA is " + round(university.minGpa - gpa4, 2) + " below the minimum. Focus on upcoming exams to close the gap.",
        });
      } else {
        result.missing.push({
          requirement: "Minimum GPA",
          detail: "GPA " + gpa4.toFixed(2) + " is significantly below minimum " + university.minGpa,
          status: "not-met",
          gap: round(university.minGpa - gpa4, 2),
        });
        result.gpaStatus = "not-met";
        result.recommendations.push({
          priority: "critical",
          action: "Significant GPA improvement needed",
          detail: "Your GPA is " + round(university.minGpa - gpa4, 2) + " below minimum. Consider alternative programmes or pathways.",
        });
      }
    } else {
      result.fulfilled.push({
        requirement: "Academic Qualification",
        detail: "No specific GPA minimum published — academic record will be reviewed holistically.",
        status: "review",
      });
    }

    /* --- IELTS Category Validation (spec §5) --- */
    if (university.ieltsCat) {
      // Build profile IELTS categories from test data
      var profileIelts = null;
      if (profile.tests && profile.tests.ielts && profile.tests.ielts.status === "taken") {
        var score = profile.tests.ielts.score;
        // If profile has category scores, use them; otherwise estimate from overall
        profileIelts = {
          overall: score,
          listening: profile.tests.ielts.listening || score,
          reading: profile.tests.ielts.reading || score,
          writing: profile.tests.ielts.writing || score,
          speaking: profile.tests.ielts.speaking || score,
        };
      } else if (englishEq > 0) {
        // Estimate from overall equivalent score
        profileIelts = {
          overall: englishEq,
          listening: englishEq,
          reading: englishEq,
          writing: englishEq,
          speaking: englishEq,
        };
      }

      var ieltsResult = validateIeltsCategories(profileIelts, university.ieltsCat);
      result.ieltsValidation = ieltsResult;

      if (ieltsResult.passed && profileIelts) {
        result.fulfilled.push({
          requirement: "English Proficiency (IELTS categories)",
          detail: "All IELTS category minimums met (L/R/W/S/Overall)",
          status: "met",
        });
        result.englishStatus = "met";
      } else if (ieltsResult.gaps.length > 0) {
        ieltsResult.gaps.forEach(function (gap) {
          result.missing.push({
            requirement: "IELTS " + gap.category,
            detail: "Required: " + gap.required + ", Achieved: " + gap.achieved + ", Gap: " + gap.gap,
            status: "not-met",
          });
        });
        result.englishStatus = "not-met";
        result.recommendations.push({
          priority: "high",
          action: "Retake IELTS to improve " + ieltsResult.gaps.map(function (g) { return g.category; }).join(", "),
          detail: "You meet the overall score but fall short in specific categories. Focus preparation on weak areas.",
        });
      } else if (!profileIelts) {
        // No IELTS taken yet
        if (engStatus === "registered") {
          result.weaknesses.push({
            requirement: "English Proficiency (IELTS)",
            detail: "IELTS registered but not yet taken. Required: Overall " + (university.ielts || university.ieltsCat.overall),
            status: "pending",
          });
          result.englishStatus = "pending";
          result.recommendations.push({
            priority: "high",
            action: "Prepare for and take the IELTS exam",
            detail: "Required overall: " + (university.ielts || university.ieltsCat.overall) + ". Check category minimums: L" + university.ieltsCat.l + " R" + university.ieltsCat.r + " W" + university.ieltsCat.w + " S" + university.ieltsCat.s,
          });
        } else {
          result.missing.push({
            requirement: "English Proficiency (IELTS)",
            detail: "IELTS not taken. Required: Overall " + (university.ielts || university.ieltsCat.overall) + " with category minimums L" + university.ieltsCat.l + " R" + university.ieltsCat.r + " W" + university.ieltsCat.w + " S" + university.ieltsCat.s,
            status: "not-met",
          });
          result.englishStatus = "not-taken";
          result.recommendations.push({
            priority: "critical",
            action: "Register for and prepare for IELTS",
            detail: "Required: Overall " + (university.ielts || university.ieltsCat.overall) + " (L" + university.ieltsCat.l + "/R" + university.ieltsCat.r + "/W" + university.ieltsCat.w + "/S" + university.ieltsCat.s + "). Start preparation immediately.",
          });
        }
      }
    } else if (university.ielts) {
      // University has overall IELTS only (no category breakdown)
      if (englishEq >= university.ielts) {
        result.fulfilled.push({
          requirement: "English Proficiency",
          detail: "English score equivalent to IELTS " + englishEq + " meets requirement " + university.ielts,
          status: "met",
        });
        result.englishStatus = "met";
      } else if (engStatus === "taken") {
        result.weaknesses.push({
          requirement: "English Proficiency",
          detail: "Score " + englishEq + " below required " + university.ielts,
          status: "close",
          gap: round(university.ielts - englishEq, 1),
        });
        result.englishStatus = "close";
        result.recommendations.push({
          priority: "high",
          action: "Retake English proficiency test",
          detail: "Need to improve by " + round(university.ielts - englishEq, 1) + " band points.",
        });
      } else {
        result.missing.push({
          requirement: "English Proficiency",
          detail: "IELTS " + university.ielts + " required, not yet taken",
          status: "not-met",
        });
        result.englishStatus = "not-taken";
        result.recommendations.push({
          priority: "high",
          action: "Take IELTS or equivalent English test",
          detail: "Required: IELTS " + university.ielts + " or equivalent.",
        });
      }
    }

    /* --- Standardized Tests (SAT/ACT/GRE/GMAT) --- */
    if (university.tests && university.tests.length) {
      var testGaps = [];
      university.tests.forEach(function (testReq) {
        var testId = null;
        var testName = testReq;
        if (testReq.indexOf("SAT") >= 0) { testId = "sat"; testName = "SAT/ACT"; }
        else if (testReq.indexOf("ACT") >= 0) { testId = "act"; testName = "SAT/ACT"; }
        else if (testReq.indexOf("GRE") >= 0) { testId = "gre"; testName = "GRE"; }
        else if (testReq.indexOf("GMAT") >= 0) { testId = "gmat"; testName = "GMAT"; }
        else if (testReq.indexOf("UTBK") >= 0) { testId = "utbk"; testName = "UTBK"; }
        else if (testReq.indexOf("TKA") >= 0) { testId = "tka"; testName = "TKA"; }

        if (testId) {
          var status = E.getTestStatus(profile, testId);
          if (status === "taken") {
            result.fulfilled.push({
              requirement: testName,
              detail: testName + " taken",
              status: "met",
            });
          } else if (status === "registered") {
            result.weaknesses.push({
              requirement: testName,
              detail: testName + " registered but not yet taken",
              status: "pending",
            });
            testGaps.push(testName);
          } else {
            result.missing.push({
              requirement: testName,
              detail: testName + " required but not taken",
              status: "not-met",
            });
            testGaps.push(testName);
          }
        }
      });

      if (testGaps.length) {
        result.testStatus = testGaps.length > 1 ? "multiple-missing" : "missing";
        result.recommendations.push({
          priority: "high",
          action: "Register for " + testGaps.join(" and "),
          detail: "These tests are required for admission. Allow 2-3 months for preparation.",
        });
      } else {
        result.testStatus = "met";
      }
    }

    /* --- Admission Documents --- */
    if (university.admission && university.admission.documents) {
      var docs = university.admission.documents;
      var docChecklist = docs.map(function (doc) {
        return { name: doc, status: "not-prepared" };
      });
      result.documentStatus = { total: docs.length, prepared: 0, checklist: docChecklist };
      result.missing.push({
        requirement: "Application Documents",
        detail: docs.length + " documents required: " + docs.join(", "),
        status: "not-prepared",
      });
      result.recommendations.push({
        priority: "medium",
        action: "Prepare application documents",
        detail: "Gather: " + docs.join(", "),
      });
    }

    /* --- Personal Statement --- */
    if (university.admission && university.admission.personalStatement && university.admission.personalStatement !== "none") {
      result.missing.push({
        requirement: "Personal Statement / Essay",
        detail: university.admission.personalStatement,
        status: "not-prepared",
      });
      result.recommendations.push({
        priority: "medium",
        action: "Draft personal statement",
        detail: university.admission.personalStatement,
      });
    }

    /* --- Recommendation Letters --- */
    if (university.admission && university.admission.recommendationLetters > 0) {
      result.missing.push({
        requirement: "Recommendation Letters",
        detail: university.admission.recommendationLetters + " letters required",
        status: "not-prepared",
      });
      result.recommendations.push({
        priority: "medium",
        action: "Request " + university.admission.recommendationLetters + " recommendation letters",
        detail: "Ask teachers or supervisors who know you well. Allow 4-6 weeks for them to write.",
      });
    }

    /* --- Portfolio --- */
    if (university.admission && university.admission.portfolio && university.admission.portfolio !== "none") {
      result.missing.push({
        requirement: "Portfolio",
        detail: university.admission.portfolio,
        status: "not-prepared",
      });
      result.recommendations.push({
        priority: "medium",
        action: "Prepare portfolio",
        detail: university.admission.portfolio,
      });
    }

    /* --- Interview --- */
    if (university.admission && university.admission.interview && university.admission.interview !== "none") {
      result.missing.push({
        requirement: "Interview",
        detail: university.admission.interview,
        status: "pending",
      });
      result.recommendations.push({
        priority: "low",
        action: "Prepare for interview",
        detail: university.admission.interview + ". Practice common interview questions.",
      });
    }

    /* --- Calculate Overall Readiness Score --- */
    var totalReqs = result.fulfilled.length + result.missing.length + result.weaknesses.length;
    var fulfilledWeight = result.fulfilled.length;
    var weaknessWeight = result.weaknesses.length * 0.5;
    var missingWeight = result.missing.length;
    var score = totalReqs > 0 ? clamp((fulfilledWeight + weaknessWeight) / totalReqs, 0, 1) : 0.5;

    // Adjust for critical items
    if (result.gpaStatus === "not-met") score *= 0.3;
    if (result.englishStatus === "not-taken") score *= 0.5;
    if (result.englishStatus === "not-met") score *= 0.4;

    result.overall = Math.round(score * 100);

    /* --- Determine Suitability Category --- */
    // Strong Match: all major requirements met, readiness >= 70%
    if (result.overall >= 70 && result.missing.filter(function (m) {
      return m.requirement.indexOf("GPA") >= 0 || m.requirement.indexOf("English") >= 0 || m.requirement.indexOf("IELTS") >= 0;
    }).length === 0) {
      result.category = "strong";
      result.categoryName = "Strong Match";
      result.categoryColor = "green";
    }
    // Competitive Match: most requirements met, readiness >= 50%
    else if (result.overall >= 50 && (result.gpaStatus !== "not-met")) {
      result.category = "competitive";
      result.categoryName = "Competitive Match";
      result.categoryColor = "teal";
    }
    // Reach: eligible but significant gaps
    else if (result.gpaStatus !== "not-met" || !university.minGpa) {
      result.category = "reach";
      result.categoryName = "Reach";
      result.categoryColor = "amber";
    }
    // Not Currently Eligible
    else {
      result.category = "not-eligible";
      result.categoryName = "Currently Not Eligible";
      result.categoryColor = "red";
    }

    /* --- Sort recommendations by priority --- */
    var priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    result.recommendations.sort(function (a, b) {
      return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
    });

    return result;
  }

  /* ============================================================
     §3 — UNIFIED UNIVERSITY MATCHING
     Matches student against ALL universities (international + Indonesian)
     in one unified result set.
     ============================================================ */

  function matchUniversities(profile, opts) {
    opts = opts || {};
    if (!profile) return [];

    var results = [];

    // International universities (from data-unis.js)
    var allUnis = [];
    if (global.SCHO_UNIS && global.SCHO_UNIS.UNIVERSITIES_EXPANDED) {
      allUnis = allUnis.concat(global.SCHO_UNIS.UNIVERSITIES_EXPANDED);
    }
    // Original universities from data.js
    if (D.UNIVERSITIES) {
      D.UNIVERSITIES.forEach(function (u) {
        if (!allUnis.find(function (x) { return x.id === u.id; })) {
          allUnis.push(u);
        }
      });
    }
    // Indonesian universities from data-id.js
    if (D_ID.UNIVERSITIES_ID) {
      D_ID.UNIVERSITIES_ID.forEach(function (u) {
        if (!allUnis.find(function (x) { return x.id === u.id; })) {
          // Normalize Indonesian university to unified format
          allUnis.push(Object.assign({}, u, {
            dest: "id",
            type: u.type === "PTN" ? "national-public" : "national-private",
            country: "Indonesia",
            admission: {
              documents: ["Transcript / rapor", "Birth certificate", "Identity card"],
              personalStatement: "none",
              recommendationLetters: 0,
              portfolio: "none",
              interview: u.routes && u.routes.indexOf("Mandiri") >= 0 ? "May be required for Mandiri" : "none",
              appFee: 0,
              appLink: u.admissionUrl || u.url,
              requirements: u.routes || [],
            },
            ieltsCat: u.ielts ? { l: u.ielts, r: u.ielts, w: u.ielts, s: u.ielts, overall: u.ielts } : null,
          }));
        }
      });
    }

    allUnis.forEach(function (uni) {
      // Filter by level if specified
      if (opts.level && uni.level && uni.level.indexOf(opts.level) < 0) return;
      // Filter by destination if specified
      if (opts.dest && uni.dest !== opts.dest) return;

      var readiness = assessReadiness(profile, uni);

      // Determine admission route for Indonesian universities
      var routes = [];
      if (uni.routes) {
        routes = uni.routes.map(function (routeId) {
          var route = (D_ID.ROUTES || []).find(function (r) { return r.id === routeId.toLowerCase() || r.id === routeId; });
          return route || { id: routeId, name: routeId };
        });
      }

      // Get scholarship matches for this university
      var scholarshipIds = uni.scholarships || uni.scholarshipIds || [];
      var scholarshipMatches = scholarshipIds.map(function (sid) {
        return (D.SCHOLARSHIPS || []).find(function (s) { return s.id === sid; }) ||
               (D_ID.SCHOLARSHIPS_ID || []).find(function (s) { return s.id === sid; });
      }).filter(Boolean);

      results.push({
        university: uni,
        readiness: readiness,
        category: readiness.category,
        categoryName: readiness.categoryName,
        categoryColor: readiness.categoryColor,
        routes: routes,
        scholarshipMatches: scholarshipMatches,
        ieltsValidation: readiness.ieltsValidation,
        gpaStatus: readiness.gpaStatus,
        englishStatus: readiness.englishStatus,
        testStatus: readiness.testStatus,
        overall: readiness.overall,
        fulfilled: readiness.fulfilled.length,
        missing: readiness.missing.length,
        weaknesses: readiness.weaknesses.length,
        recommendations: readiness.recommendations,
      });
    });

    // Sort by readiness score descending
    var catOrder = { "strong": 0, "competitive": 1, "reach": 2, "not-eligible": 3 };
    results.sort(function (a, b) {
      var ca = catOrder[a.category] || 3;
      var cb = catOrder[b.category] || 3;
      if (ca !== cb) return ca - cb;
      return b.overall - a.overall;
    });

    return results;
  }

  /* ============================================================
     §3 — ADMISSION PATHWAY DETECTION
     Determines the applicable admission pathway based on
     university, degree, and admission cycle.
     ============================================================ */

  function detectAdmissionPathway(university, profile) {
    if (!university) return null;

    // Indonesian universities
    if (university.dest === "id" || university.type === "PTN" || university.type === "PTS" ||
        university.type === "national-public" || university.type === "national-private") {
      var pathways = [];

      if (university.routes) {
        university.routes.forEach(function (routeId) {
          var route = (D_ID.ROUTES || []).find(function (r) { return r.id === routeId.toLowerCase(); });
          if (route) {
            pathways.push({
              id: route.id,
              name: route.name,
              type: "indonesian",
              official: route.official,
              period: route.period,
              exam: route.exam,
              requirements: route.requirements,
              documents: route.documents,
              notes: route.notes,
              weight: route.weight,
              applicable: profile && profile.level === "Bachelor" ? true : (route.level || []).indexOf(profile && profile.level || "Bachelor") >= 0,
            });
          }
        });
      }

      // International pathway for Indonesian universities
      if (university.notes && university.notes.indexOf("international") >= 0) {
        pathways.push({
          id: "international-track",
          name: "International Admission Track",
          type: "international",
          official: university.url,
          period: "Varies by university",
          exam: "English proficiency + university-specific requirements",
          requirements: ["IELTS/TOEFL", "Academic transcripts", "Passport", "Application form"],
          documents: ["Transcripts (translated)", "Passport copy", "English certificate", "Recommendation letters"],
          notes: ["Available at select Indonesian universities for international students"],
          applicable: true,
        });
      }

      return {
        country: "Indonesia",
        pathways: pathways,
        primary: pathways[0] || null,
      };
    }

    // International universities
    var countryPathway = {
      country: university.country || "International",
      pathways: [],
    };

    // US pathway
    if (university.dest === "us") {
      countryPathway.pathways.push({
        id: "common-app",
        name: profile && profile.level === "Bachelor" ? "Common Application" : "Direct Graduate Application",
        type: "us",
        official: profile && profile.level === "Bachelor" ? "https://www.commonapp.org" : university.admissionUrl || university.url,
        period: "Early Decision: Nov 1, Regular Decision: Jan 1-15 (typical)",
        exam: "SAT/ACT (test-optional at many schools), GRE for graduate",
        requirements: ["Completed application", "Transcripts", "SAT/ACT scores (if required)", "English proficiency", "Essays", "Recommendation letters"],
        documents: ["Official transcripts", "Test scores", "Essays", "Recommendation letters", "Financial documents", "Application fee"],
        notes: ["Many US universities are now test-optional", "CSS Profile required for financial aid", "Apply 8-12 months before intended start date"],
        applicable: true,
      });
    }

    // UK pathway
    if (university.dest === "gb") {
      countryPathway.pathways.push({
        id: "ucas",
        name: profile && profile.level === "Bachelor" ? "UCAS" : "Direct University Application",
        type: "uk",
        official: "https://www.ucas.com",
        period: "UCAS deadline: Jan 15 (Bachelor), varies for graduate",
        exam: "No standard entrance exam for most programmes; some require BMAT, LNAT, MAT",
        requirements: ["UCAS application (for Bachelor)", "Transcripts", "Personal statement", "Reference", "English proficiency"],
        documents: ["UCAS application", "Transcripts", "Personal statement", "Academic reference", "IELTS certificate"],
        notes: ["Bachelor: apply through UCAS (max 5 choices)", "Graduate: apply directly to university", "Personal statement is crucial"],
        applicable: true,
      });
    }

    // Australia pathway
    if (university.dest === "au") {
      countryPathway.pathways.push({
        id: "direct-au",
        name: "Direct Application or via Agent",
        type: "australia",
        official: university.admissionUrl || university.url,
        period: "Semester 1 (Feb-Jun): apply by Dec; Semester 2 (Jul-Nov): apply by May",
        exam: "No standard entrance exam; some programmes require STAT, GMAT, or portfolio",
        requirements: ["Completed application", "Transcripts", "English proficiency", "Course selection"],
        documents: ["Transcripts", "Passport", "IELTS/TOEFL", "Statement of purpose (for some programmes)", "CV (for graduate)"],
        notes: ["Apply directly to university or through an education agent", "GTE (Genuine Temporary Entrant) requirement for visa", "Offer letter typically issued within 2-4 weeks"],
        applicable: true,
      });
    }

    // Germany pathway
    if (university.dest === "de") {
      countryPathway.pathways.push({
        id: "uni-assist",
        name: "uni-assist or Direct Application",
        type: "german",
        official: "https://www.uni-assist.de",
        period: "Winter semester: apply by Jul 15; Summer semester: apply by Jan 15",
        exam: "TestAS (recommended), DSH or TestDaF (German language, for German-taught programmes)",
        requirements: ["uni-assist application (for most universities)", "Transcripts (certified)", "APS certificate (for some countries)", "Language certificate"],
        documents: ["Transcripts (certified translation)", "APS certificate", "Language certificate", "Passport photo", "CV", "Motivation letter"],
        notes: ["APS certificate required for applicants from China, India, Vietnam", "uni-assist processes applications for 170+ universities", "English-taught programmes may not require German"],
        applicable: true,
      });
    }

    // Netherlands pathway
    if (university.dest === "nl") {
      countryPathway.pathways.push({
        id: "studielink",
        name: "Studielink + Direct Application",
        type: "dutch",
        official: "https://www.studielink.nl",
        period: "Fall intake: apply by Jan 15 - Apr 1 (varies); Spring intake: apply by Oct 1",
        exam: "No standard entrance exam; some programmes require GMAT",
        requirements: ["Studielink registration", "University application", "Transcripts", "English proficiency", "Motivation letter"],
        documents: ["Transcripts", "Passport", "IELTS/TOEFL", "Motivation letter", "CV"],
        notes: ["Register in Studielink first, then apply via university portal", "Some programmes have numerus fixus (limited places)"],
        applicable: true,
      });
    }

    // Japan pathway
    if (university.dest === "jp") {
      countryPathway.pathways.push({
        id: "eju",
        name: "EJU + University Exam",
        type: "japanese",
        official: "https://www.jasso.go.jp/en/study_j/eju/",
        period: "EJU: June and November; University exams: Feb-March",
        exam: "EJU (Examination for Japanese University Admission), university-specific entrance exam",
        requirements: ["EJU scores", "University application", "Transcripts", "Japanese/English proficiency"],
        documents: ["EJU score report", "Transcripts", "Passport", "Application form", "Recommendation letter"],
        notes: ["EJU is required for most Japanese-taught programmes", "English-taught programmes may not require EJU", "MEXT scholars are exempt from some exams"],
        applicable: true,
      });
    }

    // Singapore pathway
    if (university.dest === "sg") {
      countryPathway.pathways.push({
        id: "direct-sg",
        name: "Direct University Application",
        type: "singapore",
        official: university.admissionUrl || university.url,
        period: "Apply by Feb-Mar for August intake (typical)",
        exam: "No standard entrance exam; some programmes require SAT, BMAT, or interview",
        requirements: ["University application", "Transcripts", "English proficiency", "SAT/ACT (optional for some)"],
        documents: ["Transcripts", "Passport", "IELTS/TOEFL", "SAT scores (if applicable)", "Achievement records"],
        notes: ["Highly competitive for international students", "Some scholarships offer automatic consideration"],
        applicable: true,
      });
    }

    // South Korea pathway
    if (university.dest === "kr") {
      countryPathway.pathways.push({
        id: "direct-kr",
        name: "Direct University Application",
        type: "korean",
        official: university.admissionUrl || university.url,
        period: "Spring intake: apply by Sep-Nov; Fall intake: apply by Apr-May",
        exam: "No standard entrance exam for international students; some require Korean proficiency (TOPIK)",
        requirements: ["University application", "Transcripts", "English or Korean proficiency", "Financial proof"],
        documents: ["Transcripts", "Passport", "Language certificate", "Financial statement", "Recommendation letter"],
        notes: ["TOPIK Level 3+ required for Korean-taught programmes", "English-taught programmes available at top universities", "GKS scholars have separate admission track"],
        applicable: true,
      });
    }

    // Canada pathway
    if (university.dest === "ca") {
      countryPathway.pathways.push({
        id: "ouac",
        name: profile && profile.level === "Bachelor" ? "OUAC / Provincial Application" : "Direct Graduate Application",
        type: "canadian",
        official: "https://www.ouac.on.ca",
        period: "Bachelor: apply by Jan 15 (typical); Graduate: varies by programme",
        exam: "No standard entrance exam for Bachelor; GRE/GMAT for some graduate programmes",
        requirements: ["Application via provincial system or direct", "Transcripts", "English proficiency", "Supplementary application (some)"],
        documents: ["Transcripts", "Passport", "IELTS/TOEFL", "Application", "Supplementary essay (if required)"],
        notes: ["Ontario: apply through OUAC", "Other provinces: apply directly to university", "Study permit required for international students"],
        applicable: true,
      });
    }

    // China pathway
    if (university.dest === "cn") {
      countryPathway.pathways.push({
        id: "csc-application",
        name: "CSC Application or Direct",
        type: "chinese",
        official: "https://studyinchina.csc.edu.cn",
        period: "CSC: apply by Dec 15 - Mar 31; Direct: varies",
        exam: "HSK (Chinese proficiency) for Chinese-taught; no standard exam for English-taught",
        requirements: ["CSC online application (for scholarship)", "University application", "Transcripts", "Language certificate", "Physical examination"],
        documents: ["Transcripts", "Passport", "HSK certificate (if applicable)", "Physical exam form", "Recommendation letters", "Study plan"],
        notes: ["CSC scholarship covers tuition, accommodation, stipend, and insurance", "HSK Level 4-6 required for Chinese-taught programmes", "English-taught programmes increasingly available"],
        applicable: true,
      });
    }

    // Turkey pathway
    if (university.dest === "tr") {
      countryPathway.pathways.push({
        id: "turkiye-burslari",
        name: "Turkiye Burslari or Direct",
        type: "turkish",
        official: "https://www.turkiyeburslari.gov.tr",
        period: "Turkiye Burslari: Jan-Feb; Direct: varies",
        exam: "YOS (Foreign Student Exam) for some universities; Turkiye Burslari has its own selection",
        requirements: ["Online application", "Transcripts", "Language certificate", "Letter of intent", "Recommendation letters"],
        documents: ["Transcripts", "Passport", "Language certificate", "Recommendation letters", "Letter of intent"],
        notes: ["Turkiye Burslari is highly competitive", "Some universities accept international SAT/ACT", "Turkish or English proficiency required"],
        applicable: true,
      });
    }

    // UAE pathway
    if (university.dest === "ae") {
      countryPathway.pathways.push({
        id: "direct-ae",
        name: "Direct University Application",
        type: "uae",
        official: university.admissionUrl || university.url,
        period: "Fall intake: apply by Jun; Spring intake: apply by Nov",
        exam: "No standard entrance exam; some programmes require SAT, GMAT, or portfolio",
        requirements: ["University application", "Transcripts", "English proficiency", "Passport copy"],
        documents: ["Transcripts", "Passport", "IELTS/TOEFL", "Application form", "Photos"],
        notes: ["Many UAE universities teach in English", "Visa processed by university", "Growing number of scholarship programmes"],
        applicable: true,
      });
    }

    // Fallback: generic international pathway
    if (countryPathway.pathways.length === 0) {
      countryPathway.pathways.push({
        id: "direct-intl",
        name: "Direct University Application",
        type: "international",
        official: university.admissionUrl || university.url,
        period: "Check university website for deadlines",
        exam: "Check programme requirements",
        requirements: ["University application", "Transcripts", "English proficiency", "Recommendation letters"],
        documents: ["Transcripts", "Passport", "IELTS/TOEFL", "Recommendation letters", "Statement of purpose"],
        notes: ["Apply directly through the university website", "Verify deadlines for your intended intake"],
        applicable: true,
      });
    }

    countryPathway.primary = countryPathway.pathways[0];
    return countryPathway;
  }

  /* ============================================================
     EXPORT
     ============================================================ */
  global.SchoAdmission = {
    validateIeltsCategories: validateIeltsCategories,
    assessReadiness: assessReadiness,
    matchUniversities: matchUniversities,
    detectAdmissionPathway: detectAdmissionPathway,
    ENGLISH_TESTS: ENGLISH_TESTS,
    EQUIV_TABLE: EQUIV_TABLE,
    ieltsToEquiv: ieltsToEquiv,
    equivToIelts: equivToIelts,
  };
})(window);
