/* =========================================================================
   SchoLink Global — Expanded University Database (spec §3 unified database)
   80+ universities across 15+ countries with:
   - IELTS category scores (L/R/W/S/Overall) — spec §5
   - Admission requirements (documents, personal statement, recommendations,
     portfolio, interview, application fees, application links) — spec §2
   - Source verification metadata — spec §10
   - Unified: international + Indonesian (PTN/PTS) in one structure — spec §3
   ========================================================================= */
(function (global) {
  "use strict";

  // Helper: IELTS category score object builder
  function ielts(l, r, w, s, overall) {
    return { l: l, r: r, w: w, s: s, overall: overall };
  }

  // Admission requirement builder
  function adm(docs, ps, recs, portfolio, interview, fee, link, reqs) {
    return {
      documents: docs,
      personalStatement: ps,
      recommendationLetters: recs,
      portfolio: portfolio,
      interview: interview,
      appFee: fee,
      appLink: link,
      requirements: reqs,
    };
  }

  /* ============================================== INTERNATIONAL UNIVERSITIES
     80+ universities across 15+ countries with full admission data.
  */
  const UNIVERSITIES_EXPANDED = [

    /* ===== United States (12) ===== */
    {
      id: "harvard", name: "Harvard University", dest: "us", type: "international",
      city: "Cambridge, MA", country: "United States",
      tuition: { Bachelor: 59000, Master: 55000, PhD: 0 }, livingMonthly: 2400, minGpa: 3.9,
      ielts: 7.5, ieltsCat: ielts(7.5, 7.5, 7.5, 7.5, 7.5), toefl: 100,
      tests: ["SAT/ACT", "GRE (grad)"], aid: "Need-based aid covering full demonstrated need",
      scholarships: ["harvard-aid", "fulbright"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.harvard.edu", admissionUrl: "https://college.harvard.edu/admissions",
      admission: adm(
        ["Official transcripts", "School report", "Mid-year report", "Financial aid forms (CSS Profile)"],
        "Required - main essay (650 words) plus supplemental essays",
        2, "Optional for arts", "Alumni interview (selected)", 75,
        "https://apply.college.harvard.edu",
        ["Outstanding academic record", "SAT/ACT scores", "English proficiency", "Two teacher recommendations"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "mit", name: "Massachusetts Institute of Technology", dest: "us", type: "international",
      city: "Cambridge, MA", country: "United States",
      tuition: { Bachelor: 61000, Master: 58000, PhD: 0 }, livingMonthly: 2400, minGpa: 3.9,
      ielts: 7.5, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.5), toefl: 100,
      tests: ["SAT/ACT", "GRE (grad)"], aid: "Need-blind admission with full need-based aid",
      scholarships: ["mit-aid", "fulbright"], fields: ["engineering", "cs", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.mit.edu", admissionUrl: "https://admissions.mit.edu",
      admission: adm(
        ["Transcripts", "Secondary school report", "MIT application form"],
        "Required - short answer essays (5 prompts)",
        2, "Optional (maker portfolio)", "Educational Council interview", 75,
        "https://apply.mit.edu",
        ["Exceptional math/science record", "SAT/ACT", "English proficiency"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "stanford", name: "Stanford University", dest: "us", type: "international",
      city: "Stanford, CA", country: "United States",
      tuition: { Bachelor: 65000, Master: 62000, PhD: 0 }, livingMonthly: 2600, minGpa: 3.9,
      ielts: 7.5, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.5), toefl: 100,
      tests: ["SAT/ACT", "GRE (grad)"], aid: "Need-based aid, no loans for low-income families",
      scholarships: ["stanford-aid", "fulbright"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.stanford.edu", admissionUrl: "https://admission.stanford.edu",
      admission: adm(
        ["Transcripts", "School report", "CSS Profile for financial aid"],
        "Required - Common App essay + Stanford supplements",
        2, "Optional for arts", "None", 90,
        "https://apply.stanford.edu",
        ["Top 1-5% academic record", "SAT/ACT", "CSS Profile and tax documents"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "yale", name: "Yale University", dest: "us", type: "international",
      city: "New Haven, CT", country: "United States",
      tuition: { Bachelor: 64000, Master: 45000, PhD: 0 }, livingMonthly: 2200, minGpa: 3.9,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.0), toefl: 100,
      tests: ["SAT/ACT"], aid: "Need-blind, full need met for all students",
      scholarships: ["yale-aid", "fulbright"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.yale.edu", admissionUrl: "https://admissions.yale.edu",
      admission: adm(
        ["Transcripts", "School report", "Mid-year report", "CSS Profile"],
        "Required - Common App essay + Yale supplements",
        2, "Optional for arts", "Alumni interview", 80,
        "https://admissions.yale.edu/apply",
        ["Exceptional academics", "SAT/ACT", "Two teacher recommendations"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "princeton", name: "Princeton University", dest: "us", type: "international",
      city: "Princeton, NJ", country: "United States",
      tuition: { Bachelor: 57000, Master: 53000, PhD: 0 }, livingMonthly: 2100, minGpa: 3.9,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.0), toefl: 100,
      tests: ["SAT/ACT"], aid: "Need-blind, full need met, no loans",
      scholarships: ["princeton-aid", "fulbright"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.princeton.edu", admissionUrl: "https://admission.princeton.edu",
      admission: adm(
        ["Transcripts", "School report", "Graded writing sample"],
        "Required - Common App essay + Princeton supplements",
        2, "Optional for arts", "Alumni interview", 70,
        "https://admission.princeton.edu/how-apply",
        ["Top academic record", "SAT/ACT", "Graded writing sample"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "columbia", name: "Columbia University", dest: "us", type: "international",
      city: "New York, NY", country: "United States",
      tuition: { Bachelor: 66000, Master: 60000, PhD: 0 }, livingMonthly: 2500, minGpa: 3.85,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.0), toefl: 100,
      tests: ["SAT/ACT", "GRE (grad)"], aid: "Need-based aid for international students",
      scholarships: ["columbia-aid", "fulbright"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.columbia.edu", admissionUrl: "https://www.columbia.edu/admissions",
      admission: adm(
        ["Transcripts", "School report", "CSS Profile"],
        "Required - Common App essay + Columbia supplements",
        2, "Optional for creative arts", "Alumni interview", 85,
        "https://www.commonapp.org",
        ["Exceptional academics", "SAT/ACT", "English proficiency"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "upenn", name: "University of Pennsylvania", dest: "us", type: "international",
      city: "Philadelphia, PA", country: "United States",
      tuition: { Bachelor: 61000, Master: 56000, PhD: 0 }, livingMonthly: 2300, minGpa: 3.9,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.0), toefl: 100,
      tests: ["SAT/ACT"], aid: "Need-based aid for international students",
      scholarships: ["upenn-aid", "fulbright"], fields: ["business", "social", "engineering"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.upenn.edu", admissionUrl: "https://admissions.upenn.edu",
      admission: adm(
        ["Transcripts", "School report", "CSS Profile"],
        "Required - Common App essay + Penn supplements",
        2, "Optional", "Alumni interview", 75,
        "https://admissions.upenn.edu/apply",
        ["Strong academic record", "SAT/ACT", "Two teacher recommendations"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "caltech", name: "California Institute of Technology", dest: "us", type: "international",
      city: "Pasadena, CA", country: "United States",
      tuition: { Bachelor: 60000, Master: 58000, PhD: 0 }, livingMonthly: 2300, minGpa: 3.9,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.0), toefl: 100,
      tests: ["SAT/ACT"], aid: "Need-based aid meeting full demonstrated need",
      scholarships: ["caltech-aid", "fulbright"], fields: ["science", "engineering"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.caltech.edu", admissionUrl: "https://www.admissions.caltech.edu",
      admission: adm(
        ["Transcripts", "School report", "STEM supplement"],
        "Required - Caltech-specific essays",
        2, "Not accepted", "None", 75,
        "https://www.admissions.caltech.edu/apply",
        ["Exceptional STEM record", "SAT/ACT", "Math/science recommendations"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "berkeley", name: "UC Berkeley", dest: "us", type: "international",
      city: "Berkeley, CA", country: "United States",
      tuition: { Bachelor: 44000, Master: 30000, PhD: 0 }, livingMonthly: 2200, minGpa: 3.7,
      ielts: 7.0, ieltsCat: ielts(6.5, 6.5, 6.5, 6.5, 7.0), toefl: 90,
      tests: ["SAT/ACT (optional)"], aid: "Limited need-based aid for international students",
      scholarships: ["berkeley-aid", "fulbright"], fields: ["engineering", "cs", "science", "social", "business"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.berkeley.edu", admissionUrl: "https://admissions.berkeley.edu",
      admission: adm(
        ["Transcripts", "UC application", "Self-reported grades"],
        "Required - UC personal insight questions (4 of 8)",
        0, "Optional for arts", "None", 80,
        "https://apply.universityofcalifornia.edu",
        ["Strong academic record", "SAT/ACT (test-optional)", "English proficiency"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "cmu", name: "Carnegie Mellon University", dest: "us", type: "international",
      city: "Pittsburgh, PA", country: "United States",
      tuition: { Bachelor: 58000, Master: 48000, PhD: 0 }, livingMonthly: 2000, minGpa: 3.8,
      ielts: 7.5, ieltsCat: ielts(7.5, 7.5, 7.5, 7.5, 7.5), toefl: 102,
      tests: ["SAT/ACT"], aid: "Limited need-based aid for international students",
      scholarships: ["cmu-aid", "fulbright"], fields: ["cs", "engineering", "arts"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.cmu.edu", admissionUrl: "https://admission.enrollment.cmu.edu",
      admission: adm(
        ["Transcripts", "School report", "Standardized test scores"],
        "Required - Common App essay + CMU supplements",
        2, "Required for architecture/design", "None", 75,
        "https://admission.enrollment.cmu.edu/apply",
        ["Strong STEM record", "SAT/ACT", "Portfolio for design programs"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "nyu", name: "New York University", dest: "us", type: "international",
      city: "New York, NY", country: "United States",
      tuition: { Bachelor: 56000, Master: 50000, PhD: 0 }, livingMonthly: 2500, minGpa: 3.7,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.0), toefl: 100,
      tests: ["SAT/ACT (optional)"], aid: "Need-based aid available",
      scholarships: ["nyu-aid", "fulbright"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.nyu.edu", admissionUrl: "https://www.nyu.edu/admissions",
      admission: adm(
        ["Transcripts", "School report", "CSS Profile"],
        "Required - Common App essay",
        2, "Optional for arts", "None", 80,
        "https://apply.nyu.edu",
        ["Strong academic record", "English proficiency"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "nyuad", name: "NYU Abu Dhabi", dest: "ae", type: "international",
      city: "Abu Dhabi", country: "United Arab Emirates",
      tuition: { Bachelor: 58000, Master: 50000, PhD: 0 }, livingMonthly: 1700, minGpa: 3.8,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.0), toefl: 100,
      tests: ["SAT/ACT"], aid: "Global Distinguished Scholarship for all admitted students in need",
      scholarships: ["nyuad-global"], fields: ["*"], level: ["Bachelor", "Master"],
      url: "https://nyuad.nyu.edu", admissionUrl: "https://nyuad.nyu.edu/en/admissions",
      admission: adm(
        ["Transcripts", "School report", "Financial aid forms"],
        "Required - NYU supplements + Common App",
        2, "Optional", "Candidate Weekend (selected)", 0,
        "https://nyuad.nyu.edu/en/admissions/apply.html",
        ["Outstanding academic record", "SAT/ACT", "Financial need documentation"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== United Kingdom (10) ===== */
    {
      id: "oxford", name: "University of Oxford", dest: "uk", type: "international",
      city: "Oxford", country: "United Kingdom",
      tuition: { Bachelor: 39000, Master: 36000, PhD: 30000 }, livingMonthly: 1700, minGpa: 3.8,
      ielts: 7.5, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.5), toefl: 110,
      tests: ["IELTS", "Admissions test"], aid: "Clarendon Fund and Rhodes Scholarships",
      scholarships: ["clarendon", "rhodes", "chevening"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ox.ac.uk", admissionUrl: "https://www.ox.ac.uk/admissions",
      admission: adm(
        ["Transcripts", "Academic references", "Research proposal (grad)"],
        "Required - Oxford-specific statement",
        3, "Required for fine arts", "In-person or online interview", 0,
        "https://www.ox.ac.uk/admissions/graduate/applying-online-guide",
        ["First-class or upper second class degree", "Admissions test", "Interview"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "cambridge", name: "University of Cambridge", dest: "uk", type: "international",
      city: "Cambridge", country: "United Kingdom",
      tuition: { Bachelor: 36000, Master: 34000, PhD: 29000 }, livingMonthly: 1700, minGpa: 3.8,
      ielts: 7.5, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.5), toefl: 110,
      tests: ["IELTS"], aid: "Gates Cambridge covers full cost of postgraduate study",
      scholarships: ["gates-cambridge", "chevening"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.cam.ac.uk", admissionUrl: "https://www.undergraduate.study.cam.ac.uk",
      admission: adm(
        ["Transcripts", "Academic references", "Written work sample"],
        "Required - Cambridge SAQ",
        2, "Required for some arts subjects", "In-person interview", 0,
        "https://www.undergraduate.study.cam.ac.uk/apply",
        ["Top grades", "Admissions assessment", "Interview"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "imperial", name: "Imperial College London", dest: "uk", type: "international",
      city: "London", country: "United Kingdom",
      tuition: { Bachelor: 40000, Master: 39000, PhD: 32000 }, livingMonthly: 2000, minGpa: 3.7,
      ielts: 7.0, ieltsCat: ielts(6.5, 6.5, 6.5, 6.5, 7.0), toefl: 100,
      tests: ["IELTS"], aid: "Departmental scholarships and GREAT awards",
      scholarships: ["great", "chevening"], fields: ["engineering", "cs", "science", "health"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.imperial.ac.uk", admissionUrl: "https://www.imperial.ac.uk/study/apply",
      admission: adm(
        ["Transcripts", "References", "Personal statement"],
        "Required - UCAS personal statement",
        1, "Not required", "Departmental interview (some courses)", 0,
        "https://www.ucas.com",
        ["Strong STEM background", "IELTS 7.0", "UCAS application"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "edinburgh", name: "University of Edinburgh", dest: "uk", type: "international",
      city: "Edinburgh", country: "United Kingdom",
      tuition: { Bachelor: 28000, Master: 30000, PhD: 25000 }, livingMonthly: 1400, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 92,
      tests: ["IELTS"], aid: "Edinburgh Global Scholarships",
      scholarships: ["edinburgh-global", "chevening"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ed.ac.uk", admissionUrl: "https://www.ed.ac.uk/student-admission",
      admission: adm(
        ["Transcripts", "References", "UCAS application"],
        "Required - UCAS personal statement",
        1, "Required for art programs", "None for most courses", 0,
        "https://www.ucas.com",
        ["Upper second class equivalent", "IELTS 6.5", "UCAS application"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "ucl", name: "University College London", dest: "uk", type: "international",
      city: "London", country: "United Kingdom",
      tuition: { Bachelor: 35000, Master: 32000, PhD: 28000 }, livingMonthly: 1900, minGpa: 3.6,
      ielts: 7.0, ieltsCat: ielts(6.5, 6.5, 6.5, 6.5, 7.0), toefl: 100,
      tests: ["IELTS"], aid: "UCL Global Scholarship and departmental awards",
      scholarships: ["ucl-global", "chevening"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ucl.ac.uk", admissionUrl: "https://www.ucl.ac.uk/prospective-students",
      admission: adm(
        ["Transcripts", "References", "UCAS application"],
        "Required - UCAS personal statement",
        1, "Required for architecture/fine arts", "Some courses", 0,
        "https://www.ucas.com",
        ["Upper second class or above", "IELTS 7.0", "UCAS application"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "lse", name: "London School of Economics", dest: "uk", type: "international",
      city: "London", country: "United Kingdom",
      tuition: { Bachelor: 33000, Master: 35000, PhD: 28000 }, livingMonthly: 1900, minGpa: 3.7,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 7.0, 7.0, 7.0), toefl: 100,
      tests: ["IELTS"], aid: "LSE Graduate Support Scheme and scholarships",
      scholarships: ["lse-aid", "chevening"], fields: ["business", "social"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.lse.ac.uk", admissionUrl: "https://www.lse.ac.uk/study-at-lse",
      admission: adm(
        ["Transcripts", "References", "GMAT/GRE for some programs"],
        "Required - LSE-specific statement",
        2, "Not required", "None for most courses", 0,
        "https://www.lse.ac.uk/study-at-lse/undergraduate/applying-to-lse",
        ["Strong quantitative background", "IELTS 7.0", "GMAT for some programs"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "kings", name: "King's College London", dest: "uk", type: "international",
      city: "London", country: "United Kingdom",
      tuition: { Bachelor: 31000, Master: 29000, PhD: 25000 }, livingMonthly: 1900, minGpa: 3.5,
      ielts: 7.0, ieltsCat: ielts(7.0, 7.0, 6.5, 7.0, 7.0), toefl: 100,
      tests: ["IELTS"], aid: "King's International Scholarship",
      scholarships: ["kings-intl", "chevening"], fields: ["health", "social", "arts", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.kcl.ac.uk", admissionUrl: "https://www.kcl.ac.uk/study",
      admission: adm(
        ["Transcripts", "References", "UCAS application"],
        "Required - UCAS personal statement",
        1, "Not required", "Some health programs", 0,
        "https://www.ucas.com",
        ["Upper second class equivalent", "IELTS 7.0"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "manchester", name: "University of Manchester", dest: "uk", type: "international",
      city: "Manchester", country: "United Kingdom",
      tuition: { Bachelor: 26000, Master: 27000, PhD: 24000 }, livingMonthly: 1200, minGpa: 3.4,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "Global Futures Scholarship and GREAT awards",
      scholarships: ["manchester-global", "great", "chevening"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.manchester.ac.uk", admissionUrl: "https://www.manchester.ac.uk/study",
      admission: adm(
        ["Transcripts", "References", "UCAS application"],
        "Required - UCAS personal statement",
        1, "Not required", "None", 0,
        "https://www.ucas.com",
        ["Upper second class equivalent", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "warwick", name: "University of Warwick", dest: "uk", type: "international",
      city: "Coventry", country: "United Kingdom",
      tuition: { Bachelor: 27000, Master: 28000, PhD: 25000 }, livingMonthly: 1100, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 92,
      tests: ["IELTS"], aid: "Warwick Chancellor's International Scholarship",
      scholarships: ["warwick-chancellor", "chevening"], fields: ["business", "social", "engineering", "cs"], level: ["Bachelor", "Master", "PhD"],
      url: "https://warwick.ac.uk", admissionUrl: "https://warwick.ac.uk/study",
      admission: adm(
        ["Transcripts", "References", "UCAS application"],
        "Required - UCAS personal statement",
        1, "Not required", "None for most courses", 0,
        "https://www.ucas.com",
        ["Upper second class equivalent", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "glasgow", name: "University of Glasgow", dest: "uk", type: "international",
      city: "Glasgow", country: "United Kingdom",
      tuition: { Bachelor: 24000, Master: 26000, PhD: 22000 }, livingMonthly: 1000, minGpa: 3.3,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "Glasgow International Leadership Scholarship",
      scholarships: ["glasgow-intl", "chevening"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.gla.ac.uk", admissionUrl: "https://www.gla.ac.uk/study",
      admission: adm(
        ["Transcripts", "References", "UCAS application"],
        "Required - UCAS personal statement",
        1, "Not required", "None", 0,
        "https://www.ucas.com",
        ["Upper second class equivalent", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== Canada (6) ===== */
    {
      id: "toronto", name: "University of Toronto", dest: "ca", type: "international",
      city: "Toronto", country: "Canada",
      tuition: { Bachelor: 45000, Master: 35000, PhD: 12000 }, livingMonthly: 1800, minGpa: 3.7,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 100,
      tests: ["IELTS", "Transcript"], aid: "Lester B. Pearson Scholarship for top international students",
      scholarships: ["lester-pearson", "vanier"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.utoronto.ca", admissionUrl: "https://future.utoronto.ca",
      admission: adm(
        ["Transcripts", "English proficiency proof", "Supplementary application (some programs)"],
        "Required for some programs",
        1, "Required for architecture", "None", 125,
        "https://join.utoronto.ca",
        ["Strong academic record", "IELTS 6.5", "Supplementary application for competitive programs"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "ubc", name: "University of British Columbia", dest: "ca", type: "international",
      city: "Vancouver", country: "Canada",
      tuition: { Bachelor: 38000, Master: 25000, PhD: 9500 }, livingMonthly: 1700, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "International Scholars awards and Mastercard Foundation Scholars",
      scholarships: ["ubc-scholars", "mastercard"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ubc.ca", admissionUrl: "https://you.ubc.ca",
      admission: adm(
        ["Transcripts", "English proficiency proof", "Personal profile"],
        "Required - UBC personal profile",
        1, "Required for fine arts", "None", 125,
        "https://you.ubc.ca/applying-ubc",
        ["Strong academic average", "IELTS 6.5", "Personal profile"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "mcgill", name: "McGill University", dest: "ca", type: "international",
      city: "Montreal", country: "Canada",
      tuition: { Bachelor: 42000, Master: 32000, PhD: 10000 }, livingMonthly: 1500, minGpa: 3.7,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS", "SAT (optional)"], aid: "McGill Entrance Scholarships and need-based aid",
      scholarships: ["mcgill-aid", "vanier"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.mcgill.ca", admissionUrl: "https://www.mcgill.ca/undergraduate-admissions",
      admission: adm(
        ["Transcripts", "English proficiency proof", "SAT/ACT (optional)"],
        "Required for some programs",
        0, "Required for music", "Audition for music", 120,
        "https://www.mcgill.ca/applying",
        ["Strong academic record", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "waterloo", name: "University of Waterloo", dest: "ca", type: "international",
      city: "Waterloo", country: "Canada",
      tuition: { Bachelor: 40000, Master: 28000, PhD: 9000 }, livingMonthly: 1400, minGpa: 3.6,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "Waterloo International Student Scholarship",
      scholarships: ["waterloo-intl", "vanier"], fields: ["engineering", "cs", "science", "math"], level: ["Bachelor", "Master", "PhD"],
      url: "https://uwaterloo.ca", admissionUrl: "https://uwaterloo.ca/future-students",
      admission: adm(
        ["Transcripts", "English proficiency proof", "Admission Information Form"],
        "Required - Admission Information Form",
        0, "Not required", "None", 125,
        "https://uwaterloo.ca/future-students/applying",
        ["Strong STEM record", "IELTS 6.5", "AIF submission"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "alberta", name: "University of Alberta", dest: "ca", type: "international",
      city: "Edmonton", country: "Canada",
      tuition: { Bachelor: 30000, Master: 22000, PhD: 8000 }, livingMonthly: 1300, minGpa: 3.3,
      ielts: 6.5, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.5), toefl: 86,
      tests: ["IELTS"], aid: "UA International Student Scholarship",
      scholarships: ["alberta-intl", "vanier"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ualberta.ca", admissionUrl: "https://www.ualberta.ca/admissions",
      admission: adm(
        ["Transcripts", "English proficiency proof"],
        "Not required for most programs",
        0, "Not required", "None", 125,
        "https://www.ualberta.ca/admissions/applying",
        ["Minimum GPA 3.3", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "mcmaster", name: "McMaster University", dest: "ca", type: "international",
      city: "Hamilton", country: "Canada",
      tuition: { Bachelor: 35000, Master: 26000, PhD: 9000 }, livingMonthly: 1400, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 86,
      tests: ["IELTS"], aid: "McMaster International Excellence Scholarship",
      scholarships: ["mcmaster-intl", "vanier"], fields: ["health", "engineering", "social", "business"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.mcmaster.ca", admissionUrl: "https://future.mcmaster.ca",
      admission: adm(
        ["Transcripts", "English proficiency proof", "Supplementary application (some programs)"],
        "Required for health programs",
        1, "Not required", "None", 110,
        "https://future.mcmaster.ca/apply",
        ["Strong academic record", "IELTS 6.5", "Supplementary application for some programs"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== Australia (5) ===== */
    {
      id: "melbourne", name: "University of Melbourne", dest: "au", type: "international",
      city: "Melbourne", country: "Australia",
      tuition: { Bachelor: 38000, Master: 36000, PhD: 32000 }, livingMonthly: 1900, minGpa: 3.6,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 79,
      tests: ["IELTS"], aid: "Graduate Research Scholarships and Australia Awards",
      scholarships: ["australia-awards", "rtp"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://unimelb.edu.au", admissionUrl: "https://study.unimelb.edu.au",
      admission: adm(
        ["Transcripts", "English proficiency proof", "Research proposal (grad research)"],
        "Required for some programs",
        2, "Required for architecture/design", "None", 100,
        "https://study.unimelb.edu.au/how-to-apply",
        ["Strong academic record", "IELTS 6.5", "Research proposal for PhD"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "sydney", name: "University of Sydney", dest: "au", type: "international",
      city: "Sydney", country: "Australia",
      tuition: { Bachelor: 40000, Master: 38000, PhD: 34000 }, livingMonthly: 2000, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 85,
      tests: ["IELTS"], aid: "Sydney Scholars Awards and RTP",
      scholarships: ["sydney-scholars", "rtp", "australia-awards"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.sydney.edu.au", admissionUrl: "https://www.sydney.edu.au/study",
      admission: adm(
        ["Transcripts", "English proficiency proof"],
        "Not required for most programs",
        0, "Required for visual arts", "None", 125,
        "https://www.sydney.edu.au/study/applying",
        ["Strong academic record", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "anu", name: "Australian National University", dest: "au", type: "international",
      city: "Canberra", country: "Australia",
      tuition: { Bachelor: 35000, Master: 34000, PhD: 30000 }, livingMonthly: 1600, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 80,
      tests: ["IELTS"], aid: "ANU Chancellor's International Scholarship",
      scholarships: ["anu-chancellor", "rtp", "australia-awards"], fields: ["social", "science", "business"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.anu.edu.au", admissionUrl: "https://www.anu.edu.au/study",
      admission: adm(
        ["Transcripts", "English proficiency proof"],
        "Not required for most programs",
        0, "Not required", "None", 80,
        "https://www.anu.edu.au/study/apply",
        ["Strong academic record", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unsw", name: "UNSW Sydney", dest: "au", type: "international",
      city: "Sydney", country: "Australia",
      tuition: { Bachelor: 38000, Master: 36000, PhD: 32000 }, livingMonthly: 2000, minGpa: 3.4,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "UNSW International Scholarship",
      scholarships: ["unsw-intl", "rtp", "australia-awards"], fields: ["engineering", "cs", "business", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.unsw.edu.au", admissionUrl: "https://www.unsw.edu.au/study",
      admission: adm(
        ["Transcripts", "English proficiency proof"],
        "Not required for most programs",
        0, "Required for design", "None", 100,
        "https://www.unsw.edu.au/study/applying",
        ["Strong academic record", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "monash", name: "Monash University", dest: "au", type: "international",
      city: "Melbourne", country: "Australia",
      tuition: { Bachelor: 37000, Master: 35000, PhD: 31000 }, livingMonthly: 1800, minGpa: 3.4,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 79,
      tests: ["IELTS"], aid: "Monash International Merit Scholarship",
      scholarships: ["monash-intl", "rtp", "australia-awards"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.monash.edu", admissionUrl: "https://www.monash.edu/study",
      admission: adm(
        ["Transcripts", "English proficiency proof"],
        "Required for some programs",
        0, "Required for art/design", "None", 100,
        "https://www.monash.edu/study/how-to-apply",
        ["Strong academic record", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== Germany (5) ===== */
    {
      id: "tum", name: "Technical University of Munich", dest: "de", type: "international",
      city: "Munich", country: "Germany",
      tuition: { Bachelor: 300, Master: 300, PhD: 0 }, livingMonthly: 1350, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 88,
      tests: ["IELTS", "TestAS"], aid: "DAAD and Deutschlandstipendium",
      scholarships: ["daad-epos", "deutschlandstipendium"], fields: ["engineering", "cs", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.tum.de", admissionUrl: "https://www.tum.de/en/studies",
      admission: adm(
        ["Transcripts (certified)", "APS certificate", "Passport photo", "CV"],
        "Required - motivation letter",
        1, "Not required", "None", 0,
        "https://www.tum.de/en/studies/application",
        ["APS certificate (for Chinese/Indian/Vietnamese)", "IELTS 6.5", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "lmu", name: "Ludwig Maximilian University of Munich", dest: "de", type: "international",
      city: "Munich", country: "Germany",
      tuition: { Bachelor: 0, Master: 0, PhD: 0 }, livingMonthly: 1300, minGpa: 3.3,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 88,
      tests: ["IELTS"], aid: "DAAD scholarships",
      scholarships: ["daad-epos", "deutschlandstipendium"], fields: ["social", "science", "health", "business"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.lmu.de", admissionUrl: "https://www.lmu.de/en/study",
      admission: adm(
        ["Transcripts (certified)", "APS certificate", "CV"],
        "Required - motivation letter",
        1, "Not required", "None", 0,
        "https://www.lmu.de/en/study/application",
        ["APS certificate", "IELTS 6.5", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "heidelberg", name: "Heidelberg University", dest: "de", type: "international",
      city: "Heidelberg", country: "Germany",
      tuition: { Bachelor: 1500, Master: 1500, PhD: 0 }, livingMonthly: 1100, minGpa: 3.4,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 88,
      tests: ["IELTS"], aid: "DAAD and Heidelberg University scholarships",
      scholarships: ["daad-epos", "deutschlandstipendium"], fields: ["science", "health", "social", "arts"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.uni-heidelberg.de", admissionUrl: "https://www.uni-heidelberg.de/en/study",
      admission: adm(
        ["Transcripts (certified)", "APS certificate", "CV"],
        "Required - motivation letter",
        1, "Not required", "None", 0,
        "https://www.uni-heidelberg.de/en/study/application",
        ["APS certificate", "IELTS 6.5", "German proficiency for some programs"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "rwth", name: "RWTH Aachen University", dest: "de", type: "international",
      city: "Aachen", country: "Germany",
      tuition: { Bachelor: 300, Master: 300, PhD: 0 }, livingMonthly: 1000, minGpa: 3.3,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["IELTS", "TestAS"], aid: "DAAD and RWTH scholarships",
      scholarships: ["daad-epos", "deutschlandstipendium"], fields: ["engineering", "cs", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.rwth-aachen.de", admissionUrl: "https://www.rwth-aachen.de/study",
      admission: adm(
        ["Transcripts (certified)", "APS certificate", "CV"],
        "Required - motivation letter",
        1, "Not required", "None", 0,
        "https://www.rwth-aachen.de/study/application",
        ["APS certificate", "IELTS 6.0", "Strong engineering background"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "kit", name: "Karlsruhe Institute of Technology", dest: "de", type: "international",
      city: "Karlsruhe", country: "Germany",
      tuition: { Bachelor: 300, Master: 300, PhD: 0 }, livingMonthly: 1050, minGpa: 3.3,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 88,
      tests: ["IELTS"], aid: "DAAD and KIT scholarships",
      scholarships: ["daad-epos", "deutschlandstipendium"], fields: ["engineering", "cs", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.kit.edu", admissionUrl: "https://www.kit.edu/study",
      admission: adm(
        ["Transcripts (certified)", "APS certificate", "CV"],
        "Required - motivation letter",
        1, "Not required", "None", 0,
        "https://www.kit.edu/study/application",
        ["APS certificate", "IELTS 6.5", "Strong STEM background"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== Netherlands (4) ===== */
    {
      id: "tudelft", name: "TU Delft", dest: "nl", type: "international",
      city: "Delft", country: "Netherlands",
      tuition: { Bachelor: 14000, Master: 18000, PhD: 0 }, livingMonthly: 1450, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "Holland Scholarship and Erasmus Mundus",
      scholarships: ["holland", "erasmus"], fields: ["engineering", "cs", "science", "environment"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.tudelft.nl", admissionUrl: "https://www.tudelft.nl/en/education",
      admission: adm(
        ["Transcripts", "CV", "Motivation letter", "English proficiency proof"],
        "Required - motivation letter",
        2, "Required for architecture", "None", 0,
        "https://www.tudelft.nl/en/education/practical-matters/application",
        ["Bachelor degree in related field", "IELTS 6.5", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "uva", name: "University of Amsterdam", dest: "nl", type: "international",
      city: "Amsterdam", country: "Netherlands",
      tuition: { Bachelor: 13000, Master: 19000, PhD: 0 }, livingMonthly: 1600, minGpa: 3.4,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 92,
      tests: ["IELTS"], aid: "Amsterdam Merit Scholarship and Orange Knowledge",
      scholarships: ["orange-knowledge", "erasmus"], fields: ["social", "science", "business", "arts"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.uva.nl", admissionUrl: "https://www.uva.nl/en/education",
      admission: adm(
        ["Transcripts", "CV", "Motivation letter", "English proficiency proof"],
        "Required - motivation letter",
        1, "Not required", "None", 0,
        "https://www.uva.nl/en/education/master-s/application-and-admission",
        ["Bachelor degree", "IELTS 6.5", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "leiden", name: "Leiden University", dest: "nl", type: "international",
      city: "Leiden", country: "Netherlands",
      tuition: { Bachelor: 12000, Master: 17000, PhD: 0 }, livingMonthly: 1400, minGpa: 3.3,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "Leiden University Excellence Scholarship",
      scholarships: ["leiden-excellence", "erasmus"], fields: ["social", "science", "health", "arts", "law"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.universiteitleiden.nl", admissionUrl: "https://www.universiteitleiden.nl/en/education",
      admission: adm(
        ["Transcripts", "CV", "Motivation letter", "English proficiency proof"],
        "Required - motivation letter",
        2, "Not required", "None", 0,
        "https://www.universiteitleiden.nl/en/education/study-in-leiden/application",
        ["Bachelor degree", "IELTS 6.5", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "groningen", name: "University of Groningen", dest: "nl", type: "international",
      city: "Groningen", country: "Netherlands",
      tuition: { Bachelor: 11000, Master: 16000, PhD: 0 }, livingMonthly: 1100, minGpa: 3.2,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "Groningen Scholarship and Erasmus Mundus",
      scholarships: ["erasmus"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.rug.nl", admissionUrl: "https://www.rug.nl/education",
      admission: adm(
        ["Transcripts", "CV", "Motivation letter", "English proficiency proof"],
        "Required - motivation letter",
        1, "Not required", "None", 0,
        "https://www.rug.nl/education/admission-and-application",
        ["Bachelor degree", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== Japan (5) ===== */
    {
      id: "tokyo", name: "University of Tokyo", dest: "jp", type: "international",
      city: "Tokyo", country: "Japan",
      tuition: { Bachelor: 6400, Master: 6400, PhD: 5200 }, livingMonthly: 1200, minGpa: 3.7,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 80,
      tests: ["EJU", "IELTS"], aid: "MEXT and university waivers",
      scholarships: ["mext", "jasso"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.u-tokyo.ac.jp", admissionUrl: "https://www.u-tokyo.ac.jp/en/admissions",
      admission: adm(
        ["Transcripts", "EJU scores", "Application form", "Statement of purpose"],
        "Required - statement of purpose",
        2, "Not required", "In-person or online", 0,
        "https://www.u-tokyo.ac.jp/en/admissions/undergraduate",
        ["EJU examination", "IELTS 6.5", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "kyoto", name: "Kyoto University", dest: "jp", type: "international",
      city: "Kyoto", country: "Japan",
      tuition: { Bachelor: 5800, Master: 5800, PhD: 5200 }, livingMonthly: 1000, minGpa: 3.6,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 79,
      tests: ["EJU", "IELTS"], aid: "MEXT and university scholarships",
      scholarships: ["mext", "jasso"], fields: ["science", "engineering", "social"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.kyoto-u.ac.jp", admissionUrl: "https://www.kyoto-u.ac.jp/en/admissions",
      admission: adm(
        ["Transcripts", "EJU scores", "Application form"],
        "Required - statement of purpose",
        2, "Not required", "Some programs", 0,
        "https://www.kyoto-u.ac.jp/en/admissions/undergraduate",
        ["EJU examination", "IELTS 6.0", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "osaka", name: "Osaka University", dest: "jp", type: "international",
      city: "Osaka", country: "Japan",
      tuition: { Bachelor: 5800, Master: 5800, PhD: 5200 }, livingMonthly: 1100, minGpa: 3.5,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 79,
      tests: ["EJU", "IELTS"], aid: "MEXT and JASSO",
      scholarships: ["mext", "jasso"], fields: ["engineering", "science", "health"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.osaka-u.ac.jp", admissionUrl: "https://www.osaka-u.ac.jp/en/admissions",
      admission: adm(
        ["Transcripts", "EJU scores", "Application form"],
        "Required - statement of purpose",
        2, "Not required", "Some programs", 0,
        "https://www.osaka-u.ac.jp/en/admissions",
        ["EJU examination", "IELTS 6.0"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "tohoku", name: "Tohoku University", dest: "jp", type: "international",
      city: "Sendai", country: "Japan",
      tuition: { Bachelor: 5800, Master: 5800, PhD: 5200 }, livingMonthly: 900, minGpa: 3.4,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 79,
      tests: ["EJU", "IELTS"], aid: "MEXT and JASSO",
      scholarships: ["mext", "jasso"], fields: ["engineering", "science", "social"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.tohoku.ac.jp", admissionUrl: "https://www.tohoku.ac.jp/en/admissions",
      admission: adm(
        ["Transcripts", "EJU scores", "Application form"],
        "Required - statement of purpose",
        2, "Not required", "Some programs", 0,
        "https://www.tohoku.ac.jp/en/admissions/undergraduate",
        ["EJU examination", "IELTS 6.0"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "kyutech", name: "Tokyo Institute of Technology", dest: "jp", type: "international",
      city: "Tokyo", country: "Japan",
      tuition: { Bachelor: 5800, Master: 5800, PhD: 5200 }, livingMonthly: 1100, minGpa: 3.5,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 79,
      tests: ["EJU", "IELTS"], aid: "MEXT and JASSO",
      scholarships: ["mext", "jasso"], fields: ["engineering", "cs", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.titech.ac.jp", admissionUrl: "https://www.titech.ac.jp/english/admissions",
      admission: adm(
        ["Transcripts", "EJU scores", "Application form"],
        "Required - statement of purpose",
        2, "Not required", "Some programs", 0,
        "https://www.titech.ac.jp/english/admissions/undergraduate",
        ["EJU examination", "IELTS 6.0", "Strong STEM background"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== South Korea (4) ===== */
    {
      id: "kaist", name: "KAIST", dest: "kr", type: "international",
      city: "Daejeon", country: "South Korea",
      tuition: { Bachelor: 7000, Master: 7000, PhD: 4000 }, livingMonthly: 950, minGpa: 3.6,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 83,
      tests: ["IELTS", "SAT"], aid: "KAIST International Student Scholarship",
      scholarships: ["kaist-intl", "gks"], fields: ["engineering", "cs", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.kaist.ac.kr", admissionUrl: "https://admission.kaist.ac.kr",
      admission: adm(
        ["Transcripts", "Personal statement", "Study plan", "Recommendation letters"],
        "Required - personal statement and study plan",
        2, "Not required", "Online interview (some)", 0,
        "https://admission.kaist.ac.kr/apply",
        ["Strong STEM record", "IELTS 6.5", "SAT recommended"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "snu", name: "Seoul National University", dest: "kr", type: "international",
      city: "Seoul", country: "South Korea",
      tuition: { Bachelor: 6000, Master: 6000, PhD: 5000 }, livingMonthly: 1000, minGpa: 3.7,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["IELTS"], aid: "SNU Global Scholarship and GKS",
      scholarships: ["gks"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.snu.ac.kr", admissionUrl: "https://admission.snu.ac.kr",
      admission: adm(
        ["Transcripts", "Personal statement", "Study plan", "Recommendation letters"],
        "Required - personal statement and study plan",
        2, "Not required", "Some programs", 0,
        "https://admission.snu.ac.kr/international",
        ["Strong academic record", "IELTS 6.0"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "yonsei", name: "Yonsei University", dest: "kr", type: "international",
      city: "Seoul", country: "South Korea",
      tuition: { Bachelor: 8000, Master: 9000, PhD: 7000 }, livingMonthly: 1000, minGpa: 3.5,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 83,
      tests: ["IELTS"], aid: "Yonsei International Student Scholarship",
      scholarships: ["gks"], fields: ["business", "social", "engineering", "cs", "arts"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.yonsei.ac.kr", admissionUrl: "https://www.yonsei.ac.kr/en_sc/admission",
      admission: adm(
        ["Transcripts", "Personal statement", "Recommendation letters"],
        "Required - personal statement",
        2, "Optional for arts", "None for most", 0,
        "https://www.yonsei.ac.kr/en_sc/admission/undergraduate",
        ["Strong academic record", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "korea-uni", name: "Korea University", dest: "kr", type: "international",
      city: "Seoul", country: "South Korea",
      tuition: { Bachelor: 8000, Master: 9000, PhD: 7000 }, livingMonthly: 1000, minGpa: 3.5,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["IELTS"], aid: "KU International Student Scholarship",
      scholarships: ["gks"], fields: ["business", "social", "engineering", "cs"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.korea.edu", admissionUrl: "https://admission.korea.edu",
      admission: adm(
        ["Transcripts", "Personal statement", "Recommendation letters"],
        "Required - personal statement",
        2, "Not required", "None for most", 0,
        "https://admission.korea.edu/iro/admission",
        ["Strong academic record", "IELTS 6.0"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== Singapore (2) ===== */
    {
      id: "nus", name: "National University of Singapore", dest: "sg", type: "international",
      city: "Singapore", country: "Singapore",
      tuition: { Bachelor: 24000, Master: 30000, PhD: 0 }, livingMonthly: 1900, minGpa: 3.8,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 92,
      tests: ["IELTS", "SAT"], aid: "Global Merit Scholarship and research stipends",
      scholarships: ["nus-merit", "asean-scholarship"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://nus.edu.sg", admissionUrl: "https://www.nus.edu.sg/admissions",
      admission: adm(
        ["Transcripts", "English proficiency proof", "SAT/ACT scores"],
        "Required - NUS application essay",
        2, "Optional", "Some programs", 20,
        "https://www.nus.edu.sg/admissions/undergraduate",
        ["Excellent academic record", "IELTS 6.5", "SAT/ACT recommended"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "ntu", name: "Nanyang Technological University", dest: "sg", type: "international",
      city: "Singapore", country: "Singapore",
      tuition: { Bachelor: 23000, Master: 28000, PhD: 0 }, livingMonthly: 1800, minGpa: 3.7,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 90,
      tests: ["IELTS"], aid: "NTU Nanyang Scholarship and ASEAN Scholarship",
      scholarships: ["ntu-nanyang", "asean-scholarship"], fields: ["*"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ntu.edu.sg", admissionUrl: "https://www.ntu.edu.sg/admissions",
      admission: adm(
        ["Transcripts", "English proficiency proof"],
        "Required - NTU application essay",
        2, "Optional", "Some programs", 15,
        "https://www.ntu.edu.sg/admissions/undergraduate",
        ["Excellent academic record", "IELTS 6.5"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== China (3) ===== */
    {
      id: "tsinghua", name: "Tsinghua University", dest: "cn", type: "international",
      city: "Beijing", country: "China",
      tuition: { Bachelor: 6000, Master: 7000, PhD: 6000 }, livingMonthly: 900, minGpa: 3.6,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 85,
      tests: ["HSK or IELTS"], aid: "Chinese Government Scholarship and Schwarzman Scholars",
      scholarships: ["csc", "schwarzman"], fields: ["engineering", "cs", "business", "social"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.tsinghua.edu.cn", admissionUrl: "https://www.tsinghua.edu.cn/en/admissions",
      admission: adm(
        ["Transcripts", "HSK or IELTS scores", "Application form", "Physical exam"],
        "Required - study plan",
        2, "Not required", "Some programs", 0,
        "https://www.tsinghua.edu.cn/en/admissions/undergraduate",
        ["Non-Chinese citizen", "HSK 4 or IELTS 6.5", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "pku", name: "Peking University", dest: "cn", type: "international",
      city: "Beijing", country: "China",
      tuition: { Bachelor: 5000, Master: 6000, PhD: 5000 }, livingMonthly: 850, minGpa: 3.6,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 85,
      tests: ["HSK or IELTS"], aid: "Chinese Government Scholarship",
      scholarships: ["csc"], fields: ["social", "science", "health", "arts"], level: ["Bachelor", "Master", "PhD"],
      url: "https://english.pku.edu.cn", admissionUrl: "https://issh.pku.edu.cn",
      admission: adm(
        ["Transcripts", "HSK or IELTS scores", "Application form", "Physical exam"],
        "Required - study plan",
        2, "Not required", "Some programs", 0,
        "https://issh.pku.edu.cn/admission",
        ["Non-Chinese citizen", "HSK 4 or IELTS 6.5", "Strong academic record"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "fudan", name: "Fudan University", dest: "cn", type: "international",
      city: "Shanghai", country: "China",
      tuition: { Bachelor: 5000, Master: 6000, PhD: 5000 }, livingMonthly: 950, minGpa: 3.5,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["HSK or IELTS"], aid: "Chinese Government Scholarship",
      scholarships: ["csc"], fields: ["social", "business", "health", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.fudan.edu.cn", admissionUrl: "https://iso.fudan.edu.cn",
      admission: adm(
        ["Transcripts", "HSK or IELTS scores", "Application form"],
        "Required - study plan",
        2, "Not required", "Some programs", 0,
        "https://iso.fudan.edu.cn/en",
        ["Non-Chinese citizen", "HSK 4 or IELTS 6.0"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== Türkiye (2) ===== */
    {
      id: "bogazici", name: "Bogazici University", dest: "tr", type: "international",
      city: "Istanbul", country: "Türkiye",
      tuition: { Bachelor: 600, Master: 800, PhD: 600 }, livingMonthly: 700, minGpa: 3.4,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 78,
      tests: ["IELTS", "SAT"], aid: "Türkiye Bursları",
      scholarships: ["turkiye-burslari"], fields: ["engineering", "cs", "social", "science", "business"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.boun.edu.tr", admissionUrl: "https://www.boun.edu.tr/en-US/Content",
      admission: adm(
        ["Transcripts", "IELTS or TOEFL scores", "Application form"],
        "Required - statement of purpose",
        2, "Not required", "Some programs", 0,
        "https://www.boun.edu.tr/en-US/Admission",
        ["Strong academic record", "IELTS 6.0"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "itu", name: "Istanbul Technical University", dest: "tr", type: "international",
      city: "Istanbul", country: "Türkiye",
      tuition: { Bachelor: 500, Master: 700, PhD: 500 }, livingMonthly: 700, minGpa: 3.3,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 78,
      tests: ["IELTS"], aid: "Türkiye Bursları",
      scholarships: ["turkiye-burslari"], fields: ["engineering", "cs", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.itu.edu.tr", admissionUrl: "https://www.itu.edu.tr/en/admissions",
      admission: adm(
        ["Transcripts", "IELTS scores", "Application form"],
        "Required - statement of purpose",
        2, "Not required", "Some programs", 0,
        "https://www.itu.edu.tr/en/admissions/undergraduate",
        ["Strong academic record", "IELTS 6.0", "Strong STEM background"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },

    /* ===== Indonesia PTN — merged from data-id.js (spec §3: unified database) =====
       Tuition is shown in USD (converted from IDR for unified comparison).
       Routes: SNBP / SNBT / Mandiri. Competitiveness and accreditation included.
    */
    {
      id: "itb", name: "Institut Teknologi Bandung", dest: "id", type: "PTN",
      city: "Bandung, Jawa Barat", country: "Indonesia",
      tuition: { Bachelor: 10, Master: 16, PhD: 13 }, livingMonthly: 175, minGpa: 3.0,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah and LPDP",
      scholarships: ["kip-kuliah", "lpdp-luar-negeri"], fields: ["engineering", "cs", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.itb.ac.id/", admissionUrl: "https://admission.itb.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "very-high", accreditation: "Unggul", code: "ITB",
      admission: adm(
        ["Rapor (X-XII)", "Birth certificate", "SKHUN", "Passport photo", "Achievement certificates"],
        "Not required for SNBP/SNBT; required for some Mandiri programs",
        0, "Not required for most programs", "Some Mandiri programs", 0,
        "https://admission.itb.ac.id/",
        ["Rapor grades X-XII", "UTBK score (for SNBT)", "Maximum 21 years for SNBP"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "ui", name: "Universitas Indonesia", dest: "id", type: "PTN",
      city: "Depok, Jawa Barat", country: "Indonesia",
      tuition: { Bachelor: 10, Master: 16, PhD: 13 }, livingMonthly: 218, minGpa: 3.0,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah and LPDP",
      scholarships: ["kip-kuliah", "lpdp-luar-negeri"], fields: ["business", "social", "engineering", "cs", "health"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ui.ac.id/", admissionUrl: "https://ppmb.ui.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "very-high", accreditation: "Unggul", code: "UI",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN", "Photo", "Achievement certificates"],
        "Required for some Mandiri programs",
        0, "Not required", "Some Mandiri programs", 0,
        "https://ppmb.ui.ac.id/",
        ["Rapor grades X-XII", "UTBK score (for SNBT)"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "ugm", name: "Universitas Gadjah Mada", dest: "id", type: "PTN",
      city: "Yogyakarta, Jawa Tengah", country: "Indonesia",
      tuition: { Bachelor: 10, Master: 16, PhD: 13 }, livingMonthly: 150, minGpa: 2.9,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "UGM Mandiri Beasiswa and KIP Kuliah",
      scholarships: ["kip-kuliah", "lpdp-luar-negeri", "ugm-mandiri-beasiswa"], fields: ["engineering", "business", "social", "environment", "arts"], level: ["Bachelor", "Master", "PhD"],
      url: "https://ugm.ac.id/", admissionUrl: "https://admissions.ugm.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "very-high", accreditation: "Unggul", code: "UGM",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN", "Photo"],
        "Required for some Mandiri programs",
        0, "Not required", "Some programs", 0,
        "https://admissions.ugm.ac.id/",
        ["Rapor grades X-XII", "UTBK score (for SNBT)"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "its", name: "Institut Teknologi Sepuluh Nopember", dest: "id", type: "PTN",
      city: "Surabaya, Jawa Timur", country: "Indonesia",
      tuition: { Bachelor: 8, Master: 14, PhD: 10 }, livingMonthly: 156, minGpa: 2.9,
      ielts: 6.5, ieltsCat: ielts(6.0, 6.0, 6.0, 6.0, 6.5), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["engineering", "cs", "business", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.its.ac.id/", admissionUrl: "https://admissions.its.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "high", accreditation: "Unggul", code: "ITS",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Required for some Mandiri programs",
        0, "Not required", "Some Mandiri programs", 0,
        "https://admissions.its.ac.id/",
        ["Rapor grades X-XII", "UTBK score (for SNBT)"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "ipb", name: "IPB University", dest: "id", type: "PTN",
      city: "Bogor, Jawa Barat", country: "Indonesia",
      tuition: { Bachelor: 8, Master: 14, PhD: 10 }, livingMonthly: 162, minGpa: 2.8,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["environment", "business", "engineering", "science"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ipb.ac.id/", admissionUrl: "https://pmb.ipb.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "high", accreditation: "Unggul", code: "IPB",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.ipb.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unpad", name: "Universitas Padjadjaran", dest: "id", type: "PTN",
      city: "Bandung, Jawa Barat", country: "Indonesia",
      tuition: { Bachelor: 8, Master: 14, PhD: 10 }, livingMonthly: 175, minGpa: 2.8,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["business", "health", "engineering", "social"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.unpad.ac.id/", admissionUrl: "https://admissions.unpad.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "high", accreditation: "Unggul", code: "UNPAD",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://admissions.unpad.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "undip", name: "Universitas Diponegoro", dest: "id", type: "PTN",
      city: "Semarang, Jawa Tengah", country: "Indonesia",
      tuition: { Bachelor: 8, Master: 14, PhD: 10 }, livingMonthly: 144, minGpa: 2.8,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["engineering", "business", "social", "health", "environment"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.undip.ac.id/", admissionUrl: "https://pmb.undip.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "high", accreditation: "Unggul", code: "UNDIP",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.undip.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unair", name: "Universitas Airlangga", dest: "id", type: "PTN",
      city: "Surabaya, Jawa Timur", country: "Indonesia",
      tuition: { Bachelor: 8, Master: 14, PhD: 10 }, livingMonthly: 156, minGpa: 2.9,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["health", "science", "business", "social"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.unair.ac.id/", admissionUrl: "https://pmb.unair.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "very-high", accreditation: "Unggul", code: "UNAIR",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.unair.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "ub", name: "Universitas Brawijaya", dest: "id", type: "PTN",
      city: "Malang, Jawa Timur", country: "Indonesia",
      tuition: { Bachelor: 8, Master: 14, PhD: 10 }, livingMonthly: 138, minGpa: 2.8,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["business", "engineering", "science", "environment"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.ub.ac.id/", admissionUrl: "https://pmb.ub.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "high", accreditation: "Unggul", code: "UB",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.ub.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "uns", name: "Universitas Sebelas Maret", dest: "id", type: "PTN",
      city: "Surakarta, Jawa Tengah", country: "Indonesia",
      tuition: { Bachelor: 7, Master: 12, PhD: 9 }, livingMonthly: 131, minGpa: 2.8,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["science", "engineering", "business", "arts"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.uns.ac.id/", admissionUrl: "https://pmb.uns.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "moderate", accreditation: "Unggul", code: "UNS",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.uns.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "upi", name: "Universitas Pendidikan Indonesia", dest: "id", type: "PTN",
      city: "Bandung, Jawa Barat", country: "Indonesia",
      tuition: { Bachelor: 6, Master: 11, PhD: 8 }, livingMonthly: 175, minGpa: 2.7,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["education", "science", "arts", "business"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.upi.edu/", admissionUrl: "https://pmb.upi.edu/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "moderate", accreditation: "Unggul", code: "UPI",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.upi.edu/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unhas", name: "Universitas Hasanuddin", dest: "id", type: "PTN",
      city: "Makassar, Sulawesi Selatan", country: "Indonesia",
      tuition: { Bachelor: 8, Master: 13, PhD: 10 }, livingMonthly: 138, minGpa: 2.8,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["health", "social", "science", "engineering"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.unhas.ac.id/", admissionUrl: "https://pmb.unhas.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "high", accreditation: "Unggul", code: "UNHAS",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.unhas.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unud", name: "Universitas Udayana", dest: "id", type: "PTN",
      city: "Denpasar, Bali", country: "Indonesia",
      tuition: { Bachelor: 7, Master: 11, PhD: 9 }, livingMonthly: 150, minGpa: 2.7,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["social", "health", "science", "arts"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.unud.ac.id/", admissionUrl: "https://pmb.unud.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "moderate", accreditation: "Unggul", code: "UNUD",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.unud.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "untad", name: "Universitas Tadulako", dest: "id", type: "PTN",
      city: "Palu, Sulawesi Tengah", country: "Indonesia",
      tuition: { Bachelor: 7, Master: 11, PhD: 9 }, livingMonthly: 119, minGpa: 2.6,
      ielts: 5.5, ieltsCat: ielts(5.0, 5.0, 5.0, 5.0, 5.5), toefl: 70,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["engineering", "business", "science", "health"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.untad.ac.id/", admissionUrl: "https://pmb.untad.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "moderate", accreditation: "Baik Sekali", code: "UNTAD",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.untad.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unsyiah", name: "Universitas Syiah Kuala", dest: "id", type: "PTN",
      city: "Banda Aceh, Aceh", country: "Indonesia",
      tuition: { Bachelor: 7, Master: 11, PhD: 9 }, livingMonthly: 125, minGpa: 2.7,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["engineering", "business", "science", "environment"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.unsyiah.ac.id/", admissionUrl: "https://pmb.unsyiah.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "moderate", accreditation: "Unggul", code: "UNSYIAH",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.unsyiah.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unila", name: "Universitas Lampung", dest: "id", type: "PTN",
      city: "Bandar Lampung, Lampung", country: "Indonesia",
      tuition: { Bachelor: 7, Master: 11, PhD: 9 }, livingMonthly: 138, minGpa: 2.7,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["engineering", "science", "social", "education"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.unila.ac.id/", admissionUrl: "https://pmb.unila.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "moderate", accreditation: "Baik Sekali", code: "UNILA",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.unila.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unp", name: "Universitas Negeri Padang", dest: "id", type: "PTN",
      city: "Padang, Sumatera Barat", country: "Indonesia",
      tuition: { Bachelor: 6, Master: 10, PhD: 8 }, livingMonthly: 131, minGpa: 2.7,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["education", "social", "science", "engineering"], level: ["Bachelor", "Master", "PhD"],
      url: "https://www.unp.ac.id/", admissionUrl: "https://pmb.unp.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "moderate", accreditation: "Baik Sekali", code: "UNP",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.unp.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
    {
      id: "unsoed", name: "Universitas Jenderal Soedirman", dest: "id", type: "PTN",
      city: "Purwokerto, Jawa Tengah", country: "Indonesia",
      tuition: { Bachelor: 6, Master: 10, PhD: 8 }, livingMonthly: 128, minGpa: 2.7,
      ielts: 6.0, ieltsCat: ielts(5.5, 5.5, 5.5, 5.5, 6.0), toefl: 80,
      tests: ["UTBK", "TKA"], aid: "KIP Kuliah",
      scholarships: ["kip-kuliah"], fields: ["science", "social", "economics", "engineering"], level: ["Bachelor", "Master", "PhD"],
      url: "https://unsoed.ac.id/", admissionUrl: "https://pmb.unsoed.ac.id/",
      routes: ["SNBP", "SNBT", "Mandiri"], competitiveness: "moderate", accreditation: "Unggul", code: "UNSOED",
      admission: adm(
        ["Rapor", "Birth certificate", "SKHUN"],
        "Not required for SNBP/SNBT",
        0, "Not required", "Some Mandiri", 0,
        "https://pmb.unsoed.ac.id/",
        ["Rapor grades X-XII", "UTBK score"]
      ),
      sourceTier: 1, verified: "2026-06-01",
    },
  ];

  global.SCHO_UNIS = { UNIVERSITIES_EXPANDED: UNIVERSITIES_EXPANDED };
})(window);