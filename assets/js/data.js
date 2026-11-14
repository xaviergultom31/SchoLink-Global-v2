/* =========================================================================
   SchoLink Global — Data layer
   Scholarships, destinations, universities, cost profiles, origins, archetypes.
   All amounts are indicative USD estimates for 2027 entry, for a prototype.
   ========================================================================= */
(function (global) {
  "use strict";

  const META = {
    name: "SchoLink",
    tagline: "Scholarships without borders.",
    version: "3.0.0",
    stats: {
      scholarships: 37,
      destinations: 12,
      universities: 18,
      languages: 27,
      origins: 36,
      curricula: 5,
      standardTests: 13,
      matchCategories: 4,
    },
    disclaimer:
      "Costs, deadlines, and eligibility are indicative estimates for a prototype. Always verify with the official provider before applying.",
  };

  /* --------------------------------------------------------------- curricula */
  // Curriculum types for holistic academic assessment (spec §3).
  // No universal 4.0 GPA conversion — each curriculum is interpreted in its own scale.
  const CURRICULA = [
    { id: "national", name: "National / Senior Secondary",
      scale: "0–100", passingGrade: 60, topGrade: 90,
      description: "Standard national secondary school curriculum (e.g., SMA in Indonesia, WASSCE in Nigeria, CBSE in India)." },
    { id: "ib", name: "International Baccalaureate (IB) Diploma",
      scale: "0–45 points", passingGrade: 24, topGrade: 42,
      description: "IB Diploma Programme with six subjects plus TOK, CAS and Extended Essay." },
    { id: "cambridge", name: "Cambridge IGCSE / A-Level",
      scale: "A*–G (IGCSE) / A*–E (A-Level)", passingGrade: "E", topGrade: "A*",
      description: "Cambridge International A-Level or IGCSE examinations." },
    { id: "ap", name: "Advanced Placement (AP) — US system",
      scale: "1–5 per exam", passingGrade: 3, topGrade: 5,
      description: "College Board Advanced Placement courses and exams, typically taken in US high schools." },
    { id: "wace", name: "WACE / Australian Year 12",
      scale: "ATAR 0–99.95", passingGrade: 50, topGrade: 90,
      description: "Australian Tertiary Admission Rank or Western Australian Certificate of Education." },
  ];

  /* ---------------------------------------------------------- standard tests */
  // Test types with status tracking (spec §4): Taken / Registered / Planning / Not Taken / NA
  const TEST_STATUSES = [
    { id: "taken", name: "Taken — score available" },
    { id: "registered", name: "Registered — exam date booked" },
    { id: "planning", name: "Planning — intend to take" },
    { id: "not-taken", name: "Not taken — will not take" },
    { id: "na", name: "Not applicable for my path" },
  ];

  const STANDARD_TESTS = [
    { id: "ielts", name: "IELTS Academic", type: "english", scale: "0–9", minScore: 6.0, typicalReq: 6.5 },
    { id: "toefl", name: "TOEFL iBT", type: "english", scale: "0–120", minScore: 80, typicalReq: 90 },
    { id: "pte", name: "PTE Academic", type: "english", scale: "10–90", minScore: 58, typicalReq: 62 },
    { id: "duolingo", name: "Duolingo English Test", type: "english", scale: "10–160", minScore: 100, typicalReq: 115 },
    { id: "sat", name: "SAT (College Board)", type: "aptitude", scale: "400–1600", minScore: 1200, typicalReq: 1400 },
    { id: "act", name: "ACT", type: "aptitude", scale: "1–36", minScore: 24, typicalReq: 30 },
    { id: "gre", name: "GRE General", type: "graduate", scale: "130–170 per section", minScore: 155, typicalReq: 160 },
    { id: "gmat", name: "GMAT", type: "graduate", scale: "200–800", minScore: 600, typicalReq: 680 },
    { id: "utbk", name: "UTBK (Indonesia)", type: "national", scale: "0–1000", minScore: 400, typicalReq: 600 },
    { id: "tka", name: "TKA (Indonesia)", type: "national", scale: "0–1000", minScore: 400, typicalReq: 600 },
    { id: "eju", name: "EJU (Japan)", type: "national", scale: "0–800 per subject", minScore: 400, typicalReq: 600 },
    { id: "hsk", name: "HSK (China)", type: "language", scale: "1–6", minScore: 4, typicalReq: 5 },
    { id: "jlpt", name: "JLPT (Japan)", type: "language", scale: "N5–N1", minScore: "N3", typicalReq: "N2" },
  ];

  /* ----------------------------------------------------------- match categories */
  // Spec §6: four matching categories replacing the single numeric score.
  const MATCH_CATEGORIES = [
    { id: "high", name: "HIGH MATCH", color: "#1a8c5a", description: "You exceed the stated minimums and match the typical recipient profile. Apply with confidence." },
    { id: "competitive", name: "COMPETITIVE MATCH", color: "#b8860b", description: "You meet or are close to the stated minimums. With a strong application and essay, this is realistic." },
    { id: "reach", name: "REACH MATCH", color: "#b85c00", description: "You fall below one or more thresholds but are not excluded. Address the gaps and apply with a backup plan." },
    { id: "not-eligible", name: "NOT CURRENTLY ELIGIBLE", color: "#999", description: "A hard eligibility requirement is not met. Do not apply until the condition changes." },
  ];

  /* ---------------------------------------------------- source verification tiers */
  // Spec §12: source-tier reliability for scholarship data.
  const SOURCE_TIERS = [
    { id: 1, name: "Tier 1 — Official primary source", description: "Scholarship provider's official website or government regulation. Most reliable." },
    { id: 2, name: "Tier 2 — Verified secondary source", description: "Embassy, university financial aid page, or reputable aggregator. Confirm with Tier 1 before applying." },
    { id: 3, name: "Tier 3 — Indicative / unverified", description: "Publicly reported but not confirmed against an official source. Treat as a lead, not a fact." },
  ];

  const APPLICATION_STATUSES = [
    { id: "open", name: "Application open — apply now" },
    { id: "upcoming", name: "Application upcoming — not yet open" },
    { id: "closed", name: "Application closed for this cycle" },
    { id: "rolling", name: "Rolling admissions — apply anytime" },
    { id: "not-announced", name: "Not announced — expected but not confirmed" },
    { id: "unverified", name: "Unverified — confirm independently" },
  ];

  /* ------------------------------------------------------------------ fields */
  const FIELDS = [
    { id: "engineering", name: "Engineering & Technology" },
    { id: "cs", name: "Computer Science & AI" },
    { id: "health", name: "Medicine & Health" },
    { id: "business", name: "Business & Economics" },
    { id: "social", name: "Social Sciences & Law" },
    { id: "arts", name: "Arts, Design & Media" },
    { id: "education", name: "Education" },
    { id: "environment", name: "Environment & Agriculture" },
    { id: "science", name: "Natural Sciences" },
  ];

  const LEVELS = ["Bachelor", "Master", "PhD"];

  /* ----------------------------------------------------------------- origins */
  // equity: 0-100, higher = fewer opportunities / more underserved.
  const ORIGINS = [
    { id: "id", name: "Indonesia", region: "Southeast Asia", equity: 78, connectivity: "mixed", flag: "🇮🇩" },
    { id: "ph", name: "Philippines", region: "Southeast Asia", equity: 72, connectivity: "mixed", flag: "🇵🇭" },
    { id: "vn", name: "Vietnam", region: "Southeast Asia", equity: 58, connectivity: "mixed", flag: "🇻🇳" },
    { id: "kh", name: "Cambodia", region: "Southeast Asia", equity: 76, connectivity: "low", flag: "🇰🇭" },
    { id: "la", name: "Laos", region: "Southeast Asia", equity: 82, connectivity: "low", flag: "🇱🇦" },
    { id: "mm", name: "Myanmar", region: "Southeast Asia", equity: 86, connectivity: "low", flag: "🇲🇲" },
    { id: "tl", name: "Timor-Leste", region: "Southeast Asia", equity: 88, connectivity: "low", flag: "🇹🇱" },
    { id: "in", name: "India", region: "South Asia", equity: 64, connectivity: "mixed", flag: "🇮🇳" },
    { id: "bd", name: "Bangladesh", region: "South Asia", equity: 74, connectivity: "mixed", flag: "🇧🇩" },
    { id: "np", name: "Nepal", region: "South Asia", equity: 78, connectivity: "low", flag: "🇳🇵" },
    { id: "pk", name: "Pakistan", region: "South Asia", equity: 70, connectivity: "mixed", flag: "🇵🇰" },
    { id: "lk", name: "Sri Lanka", region: "South Asia", equity: 52, connectivity: "good", flag: "🇱🇰" },
    { id: "ng", name: "Nigeria", region: "Sub-Saharan Africa", equity: 80, connectivity: "mixed", flag: "🇳🇬" },
    { id: "gh", name: "Ghana", region: "Sub-Saharan Africa", equity: 72, connectivity: "mixed", flag: "🇬🇭" },
    { id: "ke", name: "Kenya", region: "Sub-Saharan Africa", equity: 76, connectivity: "mixed", flag: "🇰🇪" },
    { id: "et", name: "Ethiopia", region: "Sub-Saharan Africa", equity: 86, connectivity: "low", flag: "🇪🇹" },
    { id: "rw", name: "Rwanda", region: "Sub-Saharan Africa", equity: 78, connectivity: "mixed", flag: "🇷🇼" },
    { id: "ug", name: "Uganda", region: "Sub-Saharan Africa", equity: 82, connectivity: "low", flag: "🇺🇬" },
    { id: "za", name: "South Africa", region: "Sub-Saharan Africa", equity: 58, connectivity: "good", flag: "🇿🇦" },
    { id: "zw", name: "Zimbabwe", region: "Sub-Saharan Africa", equity: 84, connectivity: "mixed", flag: "🇿🇼" },
    { id: "eg", name: "Egypt", region: "MENA", equity: 54, connectivity: "good", flag: "🇪🇬" },
    { id: "ma", name: "Morocco", region: "MENA", equity: 46, connectivity: "good", flag: "🇲🇦" },
    { id: "jo", name: "Jordan", region: "MENA", equity: 38, connectivity: "good", flag: "🇯🇴" },
    { id: "br", name: "Brazil", region: "Latin America", equity: 42, connectivity: "good", flag: "🇧🇷" },
    { id: "mx", name: "Mexico", region: "Latin America", equity: 40, connectivity: "good", flag: "🇲🇽" },
    { id: "co", name: "Colombia", region: "Latin America", equity: 44, connectivity: "good", flag: "🇨🇴" },
    { id: "pe", name: "Peru", region: "Latin America", equity: 50, connectivity: "mixed", flag: "🇵🇪" },
    { id: "bo", name: "Bolivia", region: "Latin America", equity: 62, connectivity: "mixed", flag: "🇧🇴" },
    { id: "gt", name: "Guatemala", region: "Latin America", equity: 60, connectivity: "mixed", flag: "🇬🇹" },
    { id: "ua", name: "Ukraine", region: "Europe & Central Asia", equity: 56, connectivity: "good", flag: "🇺🇦" },
    { id: "tr", name: "Türkiye", region: "Europe & Central Asia", equity: 32, connectivity: "good", flag: "🇹🇷" },
    { id: "us", name: "United States", region: "North America", equity: 8, connectivity: "good", flag: "🇺🇸" },
    { id: "gb", name: "United Kingdom", region: "Europe & Central Asia", equity: 6, connectivity: "good", flag: "🇬🇧" },
    { id: "de", name: "Germany", region: "Europe & Central Asia", equity: 5, connectivity: "good", flag: "🇩🇪" },
    { id: "ca", name: "Canada", region: "North America", equity: 5, connectivity: "good", flag: "🇨🇦" },
    { id: "au", name: "Australia", region: "Pacific", equity: 6, connectivity: "good", flag: "🇦🇺" },
  ];

  const REGION_TYPES = [
    { id: "rural", name: "Rural or remote area", equity: 16 },
    { id: "small", name: "Small city or town", equity: 8 },
    { id: "metro", name: "Major city", equity: 0 },
  ];

  const CONNECTIVITY = [
    { id: "low", name: "Low — 2G or patchy mobile data", equity: 12 },
    { id: "mixed", name: "Mixed — 3G/4G, limited data", equity: 6 },
    { id: "good", name: "Good — reliable broadband", equity: 0 },
  ];

  const INCOME_BANDS = [
    { id: "a", name: "Under $2,000 per year", usd: 1500 },
    { id: "b", name: "$2,000 – $5,000 per year", usd: 3500 },
    { id: "c", name: "$5,000 – $10,000 per year", usd: 7500 },
    { id: "d", name: "$10,000 – $20,000 per year", usd: 15000 },
    { id: "e", name: "$20,000 – $40,000 per year", usd: 30000 },
    { id: "f", name: "Above $40,000 per year", usd: 60000 },
  ];

  const PRIORITIES = [
    { id: "cost", name: "Lowest out-of-pocket cost" },
    { id: "prestige", name: "Most prestigious university" },
    { id: "speed", name: "Fastest path to graduation" },
    { id: "work", name: "Best post-study work options" },
  ];

  /* ------------------------------------------------------------ destinations */
  // tuition ranges in USD per academic year.
  const DESTINATIONS = [
    {
      id: "us", name: "United States", flag: "🇺🇸", region: "North America", language: "English",
      tuition: { Bachelor: [26000, 48000], Master: [30000, 55000], PhD: [0, 18000] },
      livingMonthly: 1900, insuranceYear: 1400, visaFee: 185, flights: 1100, applicationFee: 75,
      duration: { Bachelor: 4, Master: 2, PhD: 5 }, work: "Up to 3 years of post-study work (OPT) for eligible graduates",
      intakes: ["Fall — August", "Spring — January"], summary: "The largest choice of universities and need-based aid, but the highest sticker prices and visa hurdles.",
      highlights: ["Need-based aid can cover the full cost at top universities", "Strong research funding for PhD students", "Optional Practical Training after graduation"],
      universities: ["harvard", "mit", "stanford"],
    },
    {
      id: "uk", name: "United Kingdom", flag: "🇬🇧", region: "Europe & Central Asia", language: "English",
      tuition: { Bachelor: [18000, 32000], Master: [20000, 36000], PhD: [18000, 28000] },
      livingMonthly: 1600, insuranceYear: 1035, visaFee: 750, flights: 800, applicationFee: 0,
      duration: { Bachelor: 3, Master: 1, PhD: 4 }, work: "2-year Graduate Route for eligible graduates (3 years for PhD)",
      intakes: ["September", "January"], summary: "One-year master's degrees keep total costs lower, and Chevening/Commonwealth cover almost everything.",
      highlights: ["One-year master's programmes", "Graduate Route work visa", "Many full scholarships for developing countries"],
      universities: ["oxford", "cambridge", "imperial", "edinburgh"],
    },
    {
      id: "ca", name: "Canada", flag: "🇨🇦", region: "North America", language: "English / French",
      tuition: { Bachelor: [22000, 38000], Master: [18000, 32000], PhD: [8000, 20000] },
      livingMonthly: 1500, insuranceYear: 800, visaFee: 175, flights: 1000, applicationFee: 100,
      duration: { Bachelor: 4, Master: 2, PhD: 4 }, work: "Post-Graduation Work Permit of up to 3 years",
      intakes: ["September", "January"], summary: "More affordable than its neighbour, with a clear path from study to permanent residency.",
      highlights: ["Post-graduation work permit", "Funded PhD places", "Safe, multicultural campuses"],
      universities: ["toronto", "ubc"],
    },
    {
      id: "au", name: "Australia", flag: "🇦🇺", region: "Pacific", language: "English",
      tuition: { Bachelor: [26000, 42000], Master: [24000, 38000], PhD: [20000, 35000] },
      livingMonthly: 1800, insuranceYear: 700, visaFee: 500, flights: 900, applicationFee: 0,
      duration: { Bachelor: 3, Master: 2, PhD: 4 }, work: "2–4 years of post-study work rights depending on degree",
      intakes: ["February", "July"], summary: "Strong research culture and generous Australia Awards for the Indo-Pacific.",
      highlights: ["Australia Awards cover full costs", "Research Training Program for PhDs", "Work rights after graduation"],
      universities: ["melbourne"],
    },
    {
      id: "de", name: "Germany", flag: "🇩🇪", region: "Europe & Central Asia", language: "English / German",
      tuition: { Bachelor: [0, 1500], Master: [0, 1500], PhD: [0, 0] },
      livingMonthly: 1200, insuranceYear: 1300, visaFee: 80, flights: 600, applicationFee: 0,
      duration: { Bachelor: 3, Master: 2, PhD: 4 }, work: "18-month job-seeking permit after graduation",
      intakes: ["October", "April"], summary: "Public universities charge almost no tuition; the real cost is living, and DAAD covers it.",
      highlights: ["Low or no tuition at public universities", "Strong engineering and research", "18-month post-study job search visa"],
      universities: ["tum"],
    },
    {
      id: "nl", name: "Netherlands", flag: "🇳🇱", region: "Europe & Central Asia", language: "English / Dutch",
      tuition: { Bachelor: [9000, 15000], Master: [12000, 20000], PhD: [0, 0] },
      livingMonthly: 1400, insuranceYear: 600, visaFee: 200, flights: 700, applicationFee: 0,
      duration: { Bachelor: 3, Master: 2, PhD: 4 }, work: "1-year orientation year for graduates",
      intakes: ["September", "February"], summary: "English-taught degrees, a one-year job-search visa, and Erasmus Mundus options.",
      highlights: ["Most master's taught in English", "Orientation year visa", "Erasmus Mundus joint degrees"],
      universities: ["tudelft", "uva"],
    },
    {
      id: "jp", name: "Japan", flag: "🇯🇵", region: "East Asia", language: "Japanese / English",
      tuition: { Bachelor: [5000, 9000], Master: [5000, 8000], PhD: [5000, 5000] },
      livingMonthly: 1100, insuranceYear: 400, visaFee: 60, flights: 700, applicationFee: 0,
      duration: { Bachelor: 4, Master: 2, PhD: 5 }, work: "Work visa sponsorship after graduation",
      intakes: ["April", "September"], summary: "Low tuition and MEXT's generous stipend make Japan one of the best value options.",
      highlights: ["MEXT covers tuition, flights and stipend", "Low tuition at national universities", "Strong engineering and science"],
      universities: ["tokyo"],
    },
    {
      id: "kr", name: "South Korea", flag: "🇰🇷", region: "East Asia", language: "Korean / English",
      tuition: { Bachelor: [4000, 8000], Master: [4000, 9000], PhD: [4000, 4000] },
      livingMonthly: 950, insuranceYear: 500, visaFee: 60, flights: 650, applicationFee: 0,
      duration: { Bachelor: 4, Master: 2, PhD: 5 }, work: "Job-seeking visa and work sponsorship available",
      intakes: ["March", "September"], summary: "GKS funds thousands of international students each year, including Korean language training.",
      highlights: ["GKS covers tuition, stipend and language course", "Low living costs", "Strong technology sector"],
      universities: ["kaist"],
    },
    {
      id: "sg", name: "Singapore", flag: "🇸🇬", region: "Southeast Asia", language: "English",
      tuition: { Bachelor: [14000, 26000], Master: [18000, 30000], PhD: [0, 0] },
      livingMonthly: 1800, insuranceYear: 500, visaFee: 90, flights: 450, applicationFee: 50,
      duration: { Bachelor: 4, Master: 1, PhD: 4 }, work: "Employment pass sponsorship after graduation",
      intakes: ["August", "January"], summary: "World-class universities close to home for Southeast Asian students, with generous research funding.",
      highlights: ["NUS and NTU rank globally", "Scholarships often include stipends", "English-speaking environment"],
      universities: ["nus"],
    },
    {
      id: "ae", name: "United Arab Emirates", flag: "🇦🇪", region: "MENA", language: "English / Arabic",
      tuition: { Bachelor: [16000, 30000], Master: [18000, 32000], PhD: [0, 0] },
      livingMonthly: 1700, insuranceYear: 700, visaFee: 400, flights: 550, applicationFee: 0,
      duration: { Bachelor: 4, Master: 2, PhD: 4 }, work: "Employment visa sponsorship after graduation",
      intakes: ["August", "January"], summary: "Home to NYU Abu Dhabi's fully funded global programme and a growing research hub.",
      highlights: ["NYU Abu Dhabi offers full funding", "Tax-free stipends", "Global campus networks"],
      universities: ["nyuad"],
    },
    {
      id: "cn", name: "China", flag: "🇨🇳", region: "East Asia", language: "Chinese / English",
      tuition: { Bachelor: [4000, 8000], Master: [4000, 9000], PhD: [4000, 4000] },
      livingMonthly: 850, insuranceYear: 300, visaFee: 140, flights: 700, applicationFee: 0,
      duration: { Bachelor: 4, Master: 3, PhD: 4 }, work: "Work permit possible after graduation",
      intakes: ["September"], summary: "The Chinese Government Scholarship covers tuition, housing and a monthly stipend.",
      highlights: ["CSC covers tuition and living costs", "Low living costs", "Fast-growing research output"],
      universities: ["tsinghua"],
    },
    {
      id: "tr", name: "Türkiye", flag: "🇹🇷", region: "Europe & Central Asia", language: "Turkish / English",
      tuition: { Bachelor: [3000, 8000], Master: [4000, 9000], PhD: [4000, 4000] },
      livingMonthly: 750, insuranceYear: 300, visaFee: 60, flights: 500, applicationFee: 0,
      duration: { Bachelor: 4, Master: 2, PhD: 4 }, work: "Work permit possible after graduation",
      intakes: ["September", "February"], summary: "Türkiye Bursları is one of the most generous packages: tuition, housing, food and flights.",
      highlights: ["Türkiye Bursları covers almost everything", "Low cost of living", "Bridge between Europe and Asia"],
      universities: [],
    },
  ];

  const DEST_CODES = { us: "US", uk: "GB", ca: "CA", au: "AU", de: "DE", nl: "NL", jp: "JP", kr: "KR", sg: "SG", ae: "AE", cn: "CN", tr: "TR" };
  DESTINATIONS.forEach((d) => { d.code = DEST_CODES[d.id]; });
  ORIGINS.forEach((o) => { o.code = o.id.toUpperCase(); });

  /* ------------------------------------------------------------- universities */
  const UNIVERSITIES = [
    { id: "harvard", name: "Harvard University", dest: "us", city: "Cambridge, MA", tuition: { Bachelor: 59000, Master: 55000, PhD: 0 }, livingMonthly: 2400, minGpa: 3.9, ielts: 7.5, tests: ["SAT/ACT"], aid: "Need-based aid covering full demonstrated need", scholarships: ["harvard-aid"] },
    { id: "mit", name: "Massachusetts Institute of Technology", dest: "us", city: "Cambridge, MA", tuition: { Bachelor: 61000, Master: 58000, PhD: 0 }, livingMonthly: 2400, minGpa: 3.9, ielts: 7.5, tests: ["SAT/ACT"], aid: "Need-blind admission with full need-based aid", scholarships: ["mit-aid"] },
    { id: "stanford", name: "Stanford University", dest: "us", city: "Stanford, CA", tuition: { Bachelor: 65000, Master: 62000, PhD: 0 }, livingMonthly: 2600, minGpa: 3.9, ielts: 7.5, tests: ["SAT/ACT"], aid: "Need-based aid, no loans for low-income families", scholarships: ["stanford-aid"] },
    { id: "toronto", name: "University of Toronto", dest: "ca", city: "Toronto", tuition: { Bachelor: 45000, Master: 35000, PhD: 12000 }, livingMonthly: 1800, minGpa: 3.7, ielts: 6.5, tests: ["IELTS", "Transcript"], aid: "Lester B. Pearson Scholarship for top international students", scholarships: ["lester-pearson"] },
    { id: "ubc", name: "University of British Columbia", dest: "ca", city: "Vancouver", tuition: { Bachelor: 38000, Master: 25000, PhD: 9500 }, livingMonthly: 1700, minGpa: 3.5, ielts: 6.5, tests: ["IELTS"], aid: "International Scholars awards and Mastercard Foundation Scholars", scholarships: ["ubc-scholars", "mastercard"] },
    { id: "oxford", name: "University of Oxford", dest: "uk", city: "Oxford", tuition: { Bachelor: 39000, Master: 36000, PhD: 30000 }, livingMonthly: 1700, minGpa: 3.8, ielts: 7.5, tests: ["IELTS", "Admissions test"], aid: "Clarendon Fund and Rhodes Scholarships", scholarships: ["clarendon", "rhodes"] },
    { id: "cambridge", name: "University of Cambridge", dest: "uk", city: "Cambridge", tuition: { Bachelor: 36000, Master: 34000, PhD: 29000 }, livingMonthly: 1700, minGpa: 3.8, ielts: 7.5, tests: ["IELTS"], aid: "Gates Cambridge covers full cost of postgraduate study", scholarships: ["gates-cambridge"] },
    { id: "imperial", name: "Imperial College London", dest: "uk", city: "London", tuition: { Bachelor: 40000, Master: 39000, PhD: 32000 }, livingMonthly: 2000, minGpa: 3.7, ielts: 7.0, tests: ["IELTS"], aid: "Departmental scholarships and GREAT awards", scholarships: ["great"] },
    { id: "edinburgh", name: "University of Edinburgh", dest: "uk", city: "Edinburgh", tuition: { Bachelor: 28000, Master: 30000, PhD: 25000 }, livingMonthly: 1400, minGpa: 3.5, ielts: 6.5, tests: ["IELTS"], aid: "Edinburgh Global Scholarships", scholarships: ["edinburgh-global"] },
    { id: "melbourne", name: "University of Melbourne", dest: "au", city: "Melbourne", tuition: { Bachelor: 38000, Master: 36000, PhD: 32000 }, livingMonthly: 1900, minGpa: 3.6, ielts: 6.5, tests: ["IELTS"], aid: "Graduate Research Scholarships and Australia Awards", scholarships: ["australia-awards", "rtp"] },
    { id: "tum", name: "Technical University of Munich", dest: "de", city: "Munich", tuition: { Bachelor: 300, Master: 300, PhD: 0 }, livingMonthly: 1350, minGpa: 3.5, ielts: 6.5, tests: ["IELTS"], aid: "DAAD and Deutschlandstipendium", scholarships: ["daad-epos", "deutschlandstipendium"] },
    { id: "tudelft", name: "TU Delft", dest: "nl", city: "Delft", tuition: { Bachelor: 14000, Master: 18000, PhD: 0 }, livingMonthly: 1450, minGpa: 3.5, ielts: 6.5, tests: ["IELTS"], aid: "Holland Scholarship and Erasmus Mundus", scholarships: ["holland", "erasmus"] },
    { id: "uva", name: "University of Amsterdam", dest: "nl", city: "Amsterdam", tuition: { Bachelor: 13000, Master: 19000, PhD: 0 }, livingMonthly: 1600, minGpa: 3.4, ielts: 6.5, tests: ["IELTS"], aid: "Amsterdam Merit Scholarship and Orange Knowledge", scholarships: ["orange-knowledge"] },
    { id: "tokyo", name: "University of Tokyo", dest: "jp", city: "Tokyo", tuition: { Bachelor: 6400, Master: 6400, PhD: 5200 }, livingMonthly: 1200, minGpa: 3.7, ielts: 6.5, tests: ["EJU", "IELTS"], aid: "MEXT and university waivers", scholarships: ["mext"] },
    { id: "kaist", name: "KAIST", dest: "kr", city: "Daejeon", tuition: { Bachelor: 7000, Master: 7000, PhD: 4000 }, livingMonthly: 950, minGpa: 3.6, ielts: 6.5, tests: ["IELTS"], aid: "KAIST International Student Scholarship", scholarships: ["kaist-intl"] },
    { id: "nus", name: "National University of Singapore", dest: "sg", city: "Singapore", tuition: { Bachelor: 24000, Master: 30000, PhD: 0 }, livingMonthly: 1900, minGpa: 3.8, ielts: 6.5, tests: ["IELTS"], aid: "Global Merit Scholarship and research stipends", scholarships: ["nus-merit"] },
    { id: "tsinghua", name: "Tsinghua University", dest: "cn", city: "Beijing", tuition: { Bachelor: 6000, Master: 7000, PhD: 6000 }, livingMonthly: 900, minGpa: 3.6, ielts: 6.5, tests: ["HSK or IELTS"], aid: "Chinese Government Scholarship and Schwarzman Scholars", scholarships: ["csc", "schwarzman"] },
    { id: "nyuad", name: "NYU Abu Dhabi", dest: "ae", city: "Abu Dhabi", tuition: { Bachelor: 58000, Master: 50000, PhD: 0 }, livingMonthly: 1700, minGpa: 3.8, ielts: 7.0, tests: ["SAT/ACT"], aid: "Global Distinguished Scholarship for all admitted students in need", scholarships: ["nyuad-global"] },
  ];

  /* --------------------------------------------------------------- scholarships */
  const SCHOLARSHIPS = [
    {
      id: "fulbright", name: "Fulbright Foreign Student Program", provider: "US Department of State", dest: "us",
      level: ["Master", "PhD"], funding: "full", coverage: { t: 1, s: 2000, travel: true, ins: true },
      benefits: ["Full tuition", "Monthly living stipend", "Round-trip airfare and insurance"],
      minGpa: 3.0, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-05-30", selectivity: 0.12, apply: "online", docs: "online", interview: "online", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://foreign.fulbrightonline.org",
      summary: "The flagship US government exchange programme, funding a full master's or PhD at an American university.",
      checklist: ["Bachelor's degree with strong grades", "IELTS 6.5 or TOEFL equivalent", "Three recommendation letters", "Study objective and personal statement"],
    },
    {
      id: "humphrey", name: "Hubert H. Humphrey Fellowship", provider: "US Department of State", dest: "us",
      level: ["Master"], funding: "full", coverage: { t: 1, s: 1900, travel: true, ins: true },
      benefits: ["Full tuition and fees", "Living stipend", "Professional development allowance"],
      minGpa: 3.0, ielts: 6.0, incomeCap: null, regions: [], firstGen: false, workYears: 5,
      fields: ["social", "education", "environment", "health"], deadline: "2027-08-15", selectivity: 0.1,
      apply: "online", docs: "online", interview: "online", connectivity: "medium", appFee: 0, testsCost: 250,
      url: "https://www.humphreyfellowship.org",
      summary: "A one-year professional development programme for mid-career leaders, with no degree requirement.",
      checklist: ["At least five years of professional experience", "Leadership record in public service", "English proficiency", "Commitment to return home"],
    },
    {
      id: "harvard-aid", name: "Harvard Financial Aid Initiative", provider: "Harvard University", dest: "us",
      level: ["Bachelor"], funding: "full", coverage: { t: 1, s: 2500, travel: false, ins: true },
      benefits: ["Full need-based grant", "No loans for low-income families", "On-campus work-study"],
      minGpa: 3.9, ielts: 7.5, incomeCap: 75000, regions: [], firstGen: true, workYears: 0,
      fields: ["*"], deadline: "2027-01-01", selectivity: 0.04, apply: "online", docs: "online", interview: "online", connectivity: "high",
      appFee: 75, testsCost: 300, url: "https://college.harvard.edu/financial-aid",
      summary: "Harvard meets 100% of demonstrated financial need for international students, with no loans.",
      checklist: ["Outstanding academic record", "SAT/ACT scores", "Financial aid application (CSS Profile)", "Two teacher recommendations"],
    },
    {
      id: "mit-aid", name: "MIT Need-Based Financial Aid", provider: "MIT", dest: "us",
      level: ["Bachelor"], funding: "full", coverage: { t: 1, s: 2400, travel: false, ins: true },
      benefits: ["Full demonstrated need met", "No loans", "Paid research opportunities"],
      minGpa: 3.9, ielts: 7.5, incomeCap: 80000, regions: [], firstGen: true, workYears: 0,
      fields: ["*"], deadline: "2027-01-05", selectivity: 0.04, apply: "online", docs: "online", interview: "online", connectivity: "high",
      appFee: 75, testsCost: 300, url: "https://sfs.mit.edu",
      summary: "MIT is need-blind for all applicants and meets full need without loans, including for international students.",
      checklist: ["Exceptional maths and science record", "SAT/ACT or predicted grades", "Financial documents", "MIT interview"],
    },
    {
      id: "stanford-aid", name: "Stanford Financial Aid", provider: "Stanford University", dest: "us",
      level: ["Bachelor"], funding: "full", coverage: { t: 1, s: 2500, travel: false, ins: true },
      benefits: ["Full need-based aid", "No-loan package", "Summer research funding"],
      minGpa: 3.9, ielts: 7.5, incomeCap: 90000, regions: [], firstGen: true, workYears: 0,
      fields: ["*"], deadline: "2027-01-05", selectivity: 0.04, apply: "online", docs: "online", interview: "none", connectivity: "high",
      appFee: 90, testsCost: 300, url: "https://financialaid.stanford.edu",
      summary: "Stanford meets full demonstrated need for admitted international students, with generous aid for low-income families.",
      checklist: ["Top 1–5% academic record", "SAT/ACT", "CSS Profile and tax documents", "Three short essays"],
    },
    {
      id: "mastercard", name: "Mastercard Foundation Scholars Program", provider: "Mastercard Foundation", dest: "ca",
      level: ["Bachelor", "Master"], funding: "full", coverage: { t: 1, s: 1500, travel: true, ins: true },
      benefits: ["Full tuition", "Living stipend", "Leadership training and mentoring"],
      minGpa: 3.2, ielts: 6.5, incomeCap: 15000, regions: ["Sub-Saharan Africa"], firstGen: true, workYears: 0,
      fields: ["*"], deadline: "2027-03-31", selectivity: 0.08, apply: "online", docs: "online", interview: "online", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://mastercardfdn.org/all/scholars",
      summary: "Full funding for academically talented young people from Africa who face financial barriers.",
      checklist: ["Citizen of a Sub-Saharan African country", "Strong academic record", "Demonstrated financial need", "Commitment to give back"],
    },
    {
      id: "aauw", name: "AAUW International Fellowship", provider: "AAUW", dest: "us",
      level: ["Master", "PhD"], funding: "partial", coverage: { t: 0.4, s: 0, travel: false, ins: false },
      benefits: ["$18,000–$30,000 grant", "Women-only cohort", "Alumni network"],
      minGpa: 3.3, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0, women: true,
      fields: ["*"], deadline: "2027-11-15", selectivity: 0.15, apply: "online", docs: "online", interview: "none", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://www.aauw.org/resources/programs/fellowships-grants",
      summary: "Funding for women pursuing full-time graduate study in the United States.",
      checklist: ["Identify as a woman", "Enrolled or admitted to a US graduate programme", "Research or study proposal", "Three recommendations"],
    },
    {
      id: "chevening", name: "Chevening Scholarship", provider: "UK Government", dest: "uk",
      level: ["Master"], funding: "full", coverage: { t: 1, s: 1600, travel: true, ins: true },
      benefits: ["Full tuition", "Living stipend", "Flights and visa costs"],
      minGpa: 3.0, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 2,
      fields: ["*"], deadline: "2027-11-05", selectivity: 0.05, apply: "online", docs: "online", interview: "offline", connectivity: "high",
      appFee: 0, testsCost: 250, url: "https://www.chevening.org",
      summary: "The UK government's global scholarship for future leaders, covering a one-year master's degree.",
      checklist: ["Bachelor's degree", "At least two years of work experience", "Four leadership essays", "Unconditional UK offer"],
    },
    {
      id: "commonwealth-master", name: "Commonwealth Master's Scholarship", provider: "Commonwealth Scholarship Commission", dest: "uk",
      level: ["Master"], funding: "full", coverage: { t: 1, s: 1500, travel: true, ins: true },
      benefits: ["Full tuition", "Stipend and airfare", "Thesis grant"],
      minGpa: 3.2, ielts: 6.5, incomeCap: 12000, regions: ["South Asia", "Sub-Saharan Africa", "Southeast Asia", "Pacific"], firstGen: true, workYears: 0,
      fields: ["*"], deadline: "2027-10-18", selectivity: 0.07, apply: "online", docs: "online", interview: "online", connectivity: "low",
      appFee: 0, testsCost: 250, url: "https://cscuk.fcdo.gov.uk",
      summary: "Fully funded UK master's degrees for students from low- and middle-income Commonwealth countries.",
      checklist: ["Citizen of an eligible Commonwealth country", "Bachelor's degree with upper second class", "Development impact plan", "Financial need"],
    },
    {
      id: "rhodes", name: "Rhodes Scholarship", provider: "Rhodes Trust", dest: "uk",
      level: ["Master", "PhD"], funding: "full", coverage: { t: 1, s: 1800, travel: true, ins: true },
      benefits: ["Full University of Oxford costs", "Personal stipend", "Global Rhodes community"],
      minGpa: 3.8, ielts: 7.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-08-31", selectivity: 0.01, apply: "online", docs: "online", interview: "offline", connectivity: "high",
      appFee: 0, testsCost: 250, url: "https://www.rhodeshouse.ox.ac.uk",
      summary: "One of the world's oldest and most competitive postgraduate scholarships, for study at Oxford.",
      checklist: ["First-class undergraduate degree", "Exceptional leadership and service", "Eight references and essays", "Final interview"],
    },
    {
      id: "gates-cambridge", name: "Gates Cambridge Scholarship", provider: "Gates Cambridge Trust", dest: "uk",
      level: ["Master", "PhD"], funding: "full", coverage: { t: 1, s: 1900, travel: true, ins: true },
      benefits: ["Full tuition", "Maintenance allowance", "Family allowance where applicable"],
      minGpa: 3.7, ielts: 7.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-01-05", selectivity: 0.02, apply: "online", docs: "online", interview: "online", connectivity: "high",
      appFee: 0, testsCost: 250, url: "https://www.gatescambridge.org",
      summary: "Full-cost scholarships for outstanding postgraduate students at the University of Cambridge.",
      checklist: ["Admission offer from Cambridge", "Outstanding academic record", "Research proposal", "Two academic references"],
    },
    {
      id: "clarendon", name: "Clarendon Fund Scholarship", provider: "University of Oxford", dest: "uk",
      level: ["Master", "PhD"], funding: "full", coverage: { t: 1, s: 1700, travel: false, ins: true },
      benefits: ["Full tuition", "Living stipend", "Automatic consideration with admission"],
      minGpa: 3.7, ielts: 7.0, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-01-20", selectivity: 0.06, apply: "online", docs: "online", interview: "none", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://www.ox.ac.uk/clarendon",
      summary: "Oxford's flagship graduate scholarship, awarded automatically to the strongest applicants.",
      checklist: ["Apply to an Oxford graduate programme", "Academic excellence", "No separate scholarship application", "Meet the January deadline"],
    },
    {
      id: "great", name: "GREAT Scholarships", provider: "British Council", dest: "uk",
      level: ["Master"], funding: "partial", coverage: { t: 0.3, s: 0, travel: false, ins: false },
      benefits: ["£10,000 tuition award", "Selected UK universities", "Alumni events"],
      minGpa: 3.0, ielts: 6.5, incomeCap: null, regions: ["South Asia", "Southeast Asia", "Sub-Saharan Africa", "MENA"], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-05-31", selectivity: 0.2, apply: "online", docs: "online", interview: "none", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://study-uk.britishcouncil.org",
      summary: "£10,000 tuition awards for students from selected countries at participating UK universities.",
      checklist: ["Citizen of an eligible country", "Apply to a participating UK university", "Meet English requirements", "Submit a short statement"],
    },
    {
      id: "edinburgh-global", name: "Edinburgh Global Scholarships", provider: "University of Edinburgh", dest: "uk",
      level: ["Master"], funding: "partial", coverage: { t: 1, s: 0, travel: false, ins: false },
      benefits: ["Full tuition waiver", "Living costs not covered", "Strong alumni network"],
      minGpa: 3.5, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-04-15", selectivity: 0.12, apply: "online", docs: "online", interview: "none", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://www.ed.ac.uk/student-funding",
      summary: "Tuition-only awards for international master's students at the University of Edinburgh.",
      checklist: ["Offer from an Edinburgh master's programme", "Academic merit", "Personal statement", "One reference"],
    },
    {
      id: "lester-pearson", name: "Lester B. Pearson Scholarship", provider: "University of Toronto", dest: "ca",
      level: ["Bachelor"], funding: "full", coverage: { t: 1, s: 1800, travel: false, ins: true },
      benefits: ["Full tuition for four years", "Residence and meal plan", "Books and supplies"],
      minGpa: 3.8, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-01-15", selectivity: 0.01, apply: "offline", docs: "online", interview: "none", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://future.utoronto.ca/pearson",
      summary: "Canada's most prestigious international undergraduate award, covering four years at Toronto.",
      checklist: ["Nominated by your school", "Exceptional academics and leadership", "Financial need", "Creative essays"],
    },
    {
      id: "vanier", name: "Vanier Canada Graduate Scholarship", provider: "Government of Canada", dest: "ca",
      level: ["PhD"], funding: "full", coverage: { t: 1, s: 2500, travel: false, ins: true },
      benefits: ["CAD 50,000 per year for three years", "Research allowance", "Leadership development"],
      minGpa: 3.7, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-11-01", selectivity: 0.05, apply: "online", docs: "online", interview: "none", connectivity: "high",
      appFee: 0, testsCost: 250, url: "https://vanier.gc.ca",
      summary: "CAD 50,000 per year for three years for doctoral students with leadership potential.",
      checklist: ["Admitted or applying to a Canadian PhD", "Academic excellence", "Research potential", "Two leadership references"],
    },
    {
      id: "ubc-scholars", name: "UBC International Scholars", provider: "University of British Columbia", dest: "ca",
      level: ["Bachelor"], funding: "partial", coverage: { t: 0.6, s: 0, travel: false, ins: false },
      benefits: ["Tuition award", "Merit-based", "Renewable for four years"],
      minGpa: 3.7, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-01-15", selectivity: 0.08, apply: "online", docs: "online", interview: "none", connectivity: "medium",
      appFee: 125, testsCost: 250, url: "https://you.ubc.ca/financial-planning/awards",
      summary: "Merit-based tuition awards for outstanding international undergraduates at UBC.",
      checklist: ["Strong academic average", "Leadership and community involvement", "Apply by the international deadline", "English proficiency"],
    },
    {
      id: "australia-awards", name: "Australia Awards Scholarship", provider: "Australian Government", dest: "au",
      level: ["Master", "PhD"], funding: "full", coverage: { t: 1, s: 1800, travel: true, ins: true },
      benefits: ["Full tuition", "Living stipend and flights", "Overseas Student Health Cover"],
      minGpa: 3.0, ielts: 6.5, incomeCap: null, regions: ["Southeast Asia", "South Asia", "Pacific", "Sub-Saharan Africa"], firstGen: true, workYears: 0,
      fields: ["*"], deadline: "2027-04-30", selectivity: 0.09, apply: "online", docs: "online", interview: "offline", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://www.dfat.gov.au/people-to-people/australia-awards",
      summary: "Australia's flagship development scholarship, funding study at Australian universities.",
      checklist: ["Citizen of an eligible country", "Development impact plan", "IELTS 6.5", "Employer or community support"],
    },
    {
      id: "rtp", name: "Research Training Program", provider: "Australian Government", dest: "au",
      level: ["PhD"], funding: "full", coverage: { t: 1, s: 1900, travel: false, ins: true },
      benefits: ["Tuition offset", "Living stipend", "Research support"],
      minGpa: 3.5, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-08-31", selectivity: 0.15, apply: "online", docs: "online", interview: "none", connectivity: "high",
      appFee: 0, testsCost: 250, url: "https://www.education.gov.au",
      summary: "Government-funded PhD places at Australian universities, covering fees and a stipend.",
      checklist: ["Master's degree or honours", "Research proposal", "Supervisor confirmation", "English proficiency"],
    },
    {
      id: "daad-epos", name: "DAAD EPOS Development Scholarship", provider: "DAAD", dest: "de",
      level: ["Master"], funding: "full", coverage: { t: 1, s: 1100, travel: true, ins: true },
      benefits: ["Full tuition", "€992 monthly stipend", "Travel and health insurance"],
      minGpa: 3.0, ielts: 6.0, incomeCap: null, regions: ["South Asia", "Southeast Asia", "Sub-Saharan Africa", "Latin America", "MENA"], firstGen: false, workYears: 2,
      fields: ["environment", "engineering", "social", "health"], deadline: "2027-08-31", selectivity: 0.1,
      apply: "online", docs: "online", interview: "online", connectivity: "medium", appFee: 0, testsCost: 250,
      url: "https://www.daad.de/en",
      summary: "Development-related master's degrees in Germany for professionals from partner countries.",
      checklist: ["Bachelor's degree", "Two years of relevant work experience", "IELTS 6.0 or German", "Development-related motivation"],
    },
    {
      id: "deutschlandstipendium", name: "Deutschlandstipendium", provider: "German universities and sponsors", dest: "de",
      level: ["Bachelor", "Master"], funding: "partial", coverage: { t: 0, s: 300, travel: false, ins: false },
      benefits: ["€300 per month", "Industry mentoring", "No tuition requirement"],
      minGpa: 3.2, ielts: 6.0, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-09-30", selectivity: 0.25, apply: "offline", docs: "physical", interview: "none", connectivity: "low",
      appFee: 0, testsCost: 0, url: "https://www.deutschlandstipendium.de",
      summary: "A €300 monthly stipend awarded by German universities, based on grades and social engagement.",
      checklist: ["Enrolled at a participating German university", "Strong grades", "Social engagement", "Apply through your university"],
    },
    {
      id: "heinrich-boll", name: "Heinrich Böll Foundation Scholarship", provider: "Heinrich Böll Foundation", dest: "de",
      level: ["Bachelor", "Master", "PhD"], funding: "full", coverage: { t: 1, s: 950, travel: false, ins: true },
      benefits: ["Full tuition", "Monthly stipend", "Political education programme"],
      minGpa: 3.4, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["social", "environment", "arts", "education"], deadline: "2027-03-01", selectivity: 0.12,
      apply: "offline", docs: "physical", interview: "online", connectivity: "low", appFee: 0, testsCost: 250,
      url: "https://www.boell.de/en",
      summary: "Full funding for students in Germany who share the foundation's green and social values.",
      checklist: ["Admitted to a German university", "Social or environmental engagement", "German or English proficiency", "Motivation letter"],
    },
    {
      id: "holland", name: "Holland Scholarship", provider: "Dutch universities", dest: "nl",
      level: ["Bachelor", "Master"], funding: "partial", coverage: { t: 0.2, s: 0, travel: false, ins: false },
      benefits: ["€5,000 one-time award", "For non-EU students", "Combined with other funding"],
      minGpa: 3.2, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-05-01", selectivity: 0.3, apply: "online", docs: "online", interview: "none", connectivity: "medium",
      appFee: 0, testsCost: 250, url: "https://www.studyinnl.org",
      summary: "€5,000 awards for non-EU students starting a bachelor's or master's in the Netherlands.",
      checklist: ["Non-EU passport", "Admitted to a participating Dutch university", "Meet English requirements", "Apply by 1 May"],
    },
    {
      id: "erasmus", name: "Erasmus Mundus Joint Master", provider: "European Commission", dest: "nl",
      level: ["Master"], funding: "full", coverage: { t: 1, s: 1400, travel: true, ins: true },
      benefits: ["Full tuition", "€1,400 monthly allowance", "Travel between countries"],
      minGpa: 3.2, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-01-15", selectivity: 0.08, apply: "online", docs: "online", interview: "none", connectivity: "high",
      appFee: 0, testsCost: 250, url: "https://www.eacea.ec.europa.eu",
      summary: "Study in two or more European countries with a full scholarship and travel allowance.",
      checklist: ["Bachelor's degree", "IELTS 6.5", "Motivation letter", "Two academic references"],
    },
    {
      id: "mext", name: "MEXT Japanese Government Scholarship", provider: "Government of Japan", dest: "jp",
      level: ["Bachelor", "Master", "PhD"], funding: "full", coverage: { t: 1, s: 1200, travel: true, ins: true },
      benefits: ["Full tuition", "¥117,000 monthly stipend", "Flights and Japanese course"],
      minGpa: 3.5, ielts: 6.0, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-05-20", selectivity: 0.05, apply: "offline", docs: "physical", interview: "offline", connectivity: "low",
      appFee: 0, testsCost: 200, url: "https://www.studyinjapan.go.jp",
      summary: "Japan's flagship government scholarship, covering tuition, flights and a monthly stipend.",
      checklist: ["Under 25 for bachelor's, under 35 for master's", "Written exams at the embassy", "Physical documents", "Interview"],
    },
    {
      id: "jasso", name: "JASSO Honors Scholarship", provider: "JASSO", dest: "jp",
      level: ["Bachelor", "Master"], funding: "partial", coverage: { t: 0, s: 500, travel: false, ins: false },
      benefits: ["¥80,000 monthly stipend", "For privately funded students", "Renewable"],
      minGpa: 3.0, ielts: 5.5, incomeCap: 12000, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-07-31", selectivity: 0.35, apply: "offline", docs: "physical", interview: "none", connectivity: "low",
      appFee: 0, testsCost: 200, url: "https://www.jasso.go.jp",
      summary: "A monthly stipend for self-funded international students already enrolled in Japan.",
      checklist: ["Enrolled at a Japanese institution", "Financial need", "Good academic standing", "Apply through your university"],
    },
    {
      id: "gks", name: "Global Korea Scholarship", provider: "Government of Korea", dest: "kr",
      level: ["Bachelor", "Master", "PhD"], funding: "full", coverage: { t: 1, s: 900, travel: true, ins: true },
      benefits: ["Full tuition", "Monthly allowance", "One-year Korean language course"],
      minGpa: 3.5, ielts: 6.0, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-02-20", selectivity: 0.06, apply: "offline", docs: "physical", interview: "offline", connectivity: "low",
      appFee: 0, testsCost: 200, url: "https://www.studyinkorea.go.kr",
      summary: "Korea's government scholarship covering tuition, living costs, flights and language training.",
      checklist: ["Under 25 for undergraduate", "Top 20% of your class", "Physical documents", "Embassy interview"],
    },
    {
      id: "kaist-intl", name: "KAIST International Scholarship", provider: "KAIST", dest: "kr",
      level: ["Bachelor"], funding: "full", coverage: { t: 1, s: 350, travel: false, ins: true },
      benefits: ["Full tuition", "Monthly stipend", "Research opportunities"],
      minGpa: 3.6, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["engineering", "cs", "science"], deadline: "2027-01-10", selectivity: 0.15, apply: "online", docs: "online", interview: "none", connectivity: "medium",
      appFee: 0, testsCost: 200, url: "https://admission.kaist.ac.kr",
      summary: "KAIST funds most international undergraduates with tuition waivers and a stipend.",
      checklist: ["Strong maths and science record", "English proficiency", "Application essays", "Two recommendations"],
    },
    {
      id: "nus-merit", name: "NUS Global Merit Scholarship", provider: "National University of Singapore", dest: "sg",
      level: ["Bachelor"], funding: "partial", coverage: { t: 1, s: 0, travel: false, ins: false },
      benefits: ["Full tuition", "Some living allowance", "Overseas exchange support"],
      minGpa: 3.8, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-02-28", selectivity: 0.05, apply: "online", docs: "online", interview: "online", connectivity: "medium",
      appFee: 50, testsCost: 250, url: "https://nus.edu.sg/oam",
      summary: "Tuition coverage for top international students at NUS, with leadership development.",
      checklist: ["Excellent academic record", "Leadership experience", "Interview", "English proficiency"],
    },
    {
      id: "ntu-nanyang", name: "NTU Nanyang Scholarship", provider: "Nanyang Technological University", dest: "sg",
      level: ["Bachelor"], funding: "full", coverage: { t: 1, s: 650, travel: false, ins: true },
      benefits: ["Full tuition", "Living allowance", "Hostel allowance"],
      minGpa: 3.8, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-03-15", selectivity: 0.06, apply: "online", docs: "online", interview: "online", connectivity: "medium",
      appFee: 50, testsCost: 250, url: "https://www.ntu.edu.sg/admissions",
      summary: "A full-ride undergraduate scholarship at NTU, including hostel and living allowances.",
      checklist: ["Top academic results", "Leadership potential", "Interview", "English proficiency"],
    },
    {
      id: "csc", name: "Chinese Government Scholarship", provider: "China Scholarship Council", dest: "cn",
      level: ["Bachelor", "Master", "PhD"], funding: "full", coverage: { t: 1, s: 500, travel: false, ins: true },
      benefits: ["Full tuition", "Monthly stipend", "Free university accommodation"],
      minGpa: 3.0, ielts: 6.0, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-01-31", selectivity: 0.25, apply: "online", docs: "online", interview: "none", connectivity: "low",
      appFee: 0, testsCost: 200, url: "https://www.campuschina.org",
      summary: "China's government scholarship covering tuition, accommodation and a monthly stipend.",
      checklist: ["Non-Chinese citizen", "Bachelor's degree for master's", "Two recommendations", "Medical certificate"],
    },
    {
      id: "schwarzman", name: "Schwarzman Scholars", provider: "Schwarzman Scholars", dest: "cn",
      level: ["Master"], funding: "full", coverage: { t: 1, s: 1200, travel: true, ins: true },
      benefits: ["Full tuition", "Room and board", "Travel stipend"],
      minGpa: 3.6, ielts: 7.0, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["social", "business", "engineering", "education"], deadline: "2027-05-20", selectivity: 0.03,
      apply: "online", docs: "online", interview: "online", connectivity: "high", appFee: 0, testsCost: 250,
      url: "https://www.schwarzmanscholars.org",
      summary: "A one-year master's at Tsinghua University in Beijing, fully funded, for future global leaders.",
      checklist: ["Bachelor's degree", "English proficiency", "Leadership essays", "Two recommendations"],
    },
    {
      id: "turkiye-burslari", name: "Türkiye Bursları", provider: "Government of Türkiye", dest: "tr",
      level: ["Bachelor", "Master", "PhD"], funding: "full", coverage: { t: 1, s: 700, travel: true, ins: true },
      benefits: ["Full tuition", "Monthly stipend", "Accommodation and flights"],
      minGpa: 3.0, ielts: 5.5, incomeCap: null, regions: [], firstGen: false, workYears: 0,
      fields: ["*"], deadline: "2027-02-10", selectivity: 0.1, apply: "online", docs: "online", interview: "online", connectivity: "low",
      appFee: 0, testsCost: 200, url: "https://turkiyeburslari.gov.tr",
      summary: "Türkiye's government scholarship covering tuition, accommodation, food and flights.",
      checklist: ["Under 21 for bachelor's, under 30 for master's", "Academic merit", "Motivation letter", "Online interview"],
    },
    {
      id: "nyuad-global", name: "NYU Abu Dhabi Global Distinguished Scholarship", provider: "NYU Abu Dhabi", dest: "ae",
      level: ["Bachelor"], funding: "full", coverage: { t: 1, s: 1800, travel: true, ins: true },
      benefits: ["Full tuition", "Housing and meals", "Travel and stipend"],
      minGpa: 3.8, ielts: 7.0, incomeCap: 100000, regions: [], firstGen: true, workYears: 0,
      fields: ["*"], deadline: "2027-01-01", selectivity: 0.03, apply: "online", docs: "online", interview: "online", connectivity: "high",
      appFee: 0, testsCost: 300, url: "https://nyuad.nyu.edu",
      summary: "One of the most generous undergraduate scholarships in the world, covering tuition, housing and travel.",
      checklist: ["Outstanding academic record", "SAT/ACT or predicted grades", "Financial need", "Two essays and interview"],
    },
    {
      id: "aga-khan", name: "Aga Khan Foundation International Scholarship", provider: "Aga Khan Foundation", dest: "uk",
      level: ["Master"], funding: "full", coverage: { t: 0.8, s: 800, travel: false, ins: false },
      benefits: ["Tuition grant", "Living allowance", "Postgraduate only"],
      minGpa: 3.3, ielts: 6.5, incomeCap: 10000, regions: ["South Asia", "Sub-Saharan Africa", "MENA", "Europe & Central Asia"], firstGen: true, workYears: 0,
      fields: ["*"], deadline: "2027-03-31", selectivity: 0.1, apply: "offline", docs: "physical", interview: "offline", connectivity: "low",
      appFee: 0, testsCost: 250, url: "https://the.akdn/en/how-we-work/our-agencies/aga-khan-foundation",
      summary: "Partial to full funding for postgraduate study, for students from selected developing countries.",
      checklist: ["Citizen of an eligible country", "Admission to a reputable graduate programme", "Genuine financial need", "Apply through a local AKF office"],
    },
    {
      id: "joint-japan-world-bank", name: "Joint Japan/World Bank Graduate Scholarship", provider: "World Bank", dest: "us",
      level: ["Master"], funding: "full", coverage: { t: 1, s: 1600, travel: true, ins: true },
      benefits: ["Full tuition", "Living stipend", "Travel and insurance"],
      minGpa: 3.2, ielts: 6.5, incomeCap: null, regions: ["South Asia", "Southeast Asia", "Sub-Saharan Africa", "Latin America", "MENA"], firstGen: false, workYears: 3,
      fields: ["business", "social", "environment", "health"], deadline: "2027-05-31", selectivity: 0.12,
      apply: "online", docs: "online", interview: "none", connectivity: "medium", appFee: 0, testsCost: 250,
      url: "https://www.worldbank.org/en/programs/scholarships",
      summary: "Full funding for mid-career professionals from developing countries to study a master's abroad.",
      checklist: ["Citizen of a developing country", "Three years of development-related work", "Admission to a partner programme", "English proficiency"],
    },
    {
      id: "rotary-peace", name: "Rotary Peace Fellowship", provider: "Rotary Foundation", dest: "us",
      level: ["Master"], funding: "full", coverage: { t: 1, s: 1800, travel: true, ins: true },
      benefits: ["Full tuition", "Living and travel allowance", "Global peace network"],
      minGpa: 3.0, ielts: 6.5, incomeCap: null, regions: [], firstGen: false, workYears: 2,
      fields: ["social", "education"], deadline: "2027-05-15", selectivity: 0.08,
      apply: "online", docs: "online", interview: "online", connectivity: "medium", appFee: 0, testsCost: 250,
      url: "https://www.rotary.org/en/our-programs/peace-fellowships",
      summary: "A fully funded master's in peace and conflict resolution at a Rotary Peace Center.",
      checklist: ["Bachelor's degree", "Three years of peace-related work", "Leadership and service", "Two references"],
    },
  ];

  /* ------------------------------------------------------------- diagnosis */
  const DIAGNOSTIC = [
    { id: "e1", level: "easy", domain: "Numeracy", question: "If 3x + 6 = 21, what is x?", options: ["3", "5", "7", "9"], answer: 1 },
    { id: "e2", level: "easy", domain: "Verbal", question: "Choose the closest synonym of “sufficient”.", options: ["Excessive", "Enough", "Impossible", "Temporary"], answer: 1 },
    { id: "e3", level: "easy", domain: "English", question: "Choose the correct sentence.", options: ["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She gone to school every day."], answer: 1 },
    { id: "e4", level: "easy", domain: "Logic", question: "All eligible students can apply. Ana is eligible. Therefore…", options: ["Ana may not apply", "Ana can apply", "Ana must apply today", "Cannot be concluded"], answer: 1 },
    { id: "m1", level: "medium", domain: "Numeracy", question: "A scholarship covers 80% of a $12,000 tuition. How much do you pay for two semesters?", options: ["$2,400", "$4,800", "$9,600", "$1,200"], answer: 1 },
    { id: "m2", level: "medium", domain: "Numeracy", question: "The average of five scores is 82. If one score of 92 is removed, the average of the other four is…", options: ["79.5", "80", "80.5", "81"], answer: 0 },
    { id: "m3", level: "medium", domain: "English", question: "“The committee requires that each applicant ___ two letters.”", options: ["submit", "submits", "submitted", "submitting"], answer: 0 },
    { id: "m4", level: "medium", domain: "Logic", question: "If the connection is only 2G, video interviews are impossible. A student completes a video interview. Then…", options: ["The connection is 4G", "The connection is not only 2G", "They used a cafe", "No conclusion"], answer: 1 },
    { id: "h1", level: "hard", domain: "Numeracy", question: "60% applied for A, 45% for B, 25% for both. What share applied for neither?", options: ["15%", "20%", "25%", "30%"], answer: 1 },
    { id: "h2", level: "hard", domain: "English", question: "“Had the deadline been announced earlier, more students ___.”", options: ["will apply", "would apply", "would have applied", "had applied"], answer: 2 },
    { id: "h3", level: "hard", domain: "Logic", question: "Five students sit in a row. Budi is left of Cici, Dina is right of Cici, and Eka is next to Budi. Who is leftmost?", options: ["Budi", "Cici", "Dina", "Eka"], answer: 3 },
    { id: "h4", level: "hard", domain: "Numeracy", question: "You save $150 monthly at 0.5% monthly interest. After 12 months, the closest value is…", options: ["$1,800", "$1,850", "$1,950", "$2,100"], answer: 1 },
  ];

  /* --------------------------------------------------------------- archetypes */
  // Vectors: [academic, test readiness, financial need, equity, global ambition]
  const ARCHETYPES = [
    { id: "first-gen", name: "First-generation striver", vector: [0.78, 0.55, 0.9, 0.7, 0.55], saves: ["chevening", "commonwealth-master", "mastercard", "holland", "great"] },
    { id: "top-scholar", name: "Global top scholar", vector: [0.96, 0.9, 0.35, 0.2, 0.95], saves: ["rhodes", "gates-cambridge", "harvard-aid", "mit-aid", "stanford-aid"] },
    { id: "stem-builder", name: "STEM builder", vector: [0.88, 0.75, 0.6, 0.45, 0.6], saves: ["daad-epos", "kaist-intl", "mext", "erasmus", "australia-awards"] },
    { id: "community-leader", name: "Community leader", vector: [0.75, 0.65, 0.8, 0.75, 0.4], saves: ["mastercard", "australia-awards", "rotary-peace", "joint-japan-world-bank", "aga-khan"] },
    { id: "budget-planner", name: "Budget-conscious planner", vector: [0.7, 0.5, 0.85, 0.8, 0.3], saves: ["deutschlandstipendium", "jasso", "csc", "turkiye-burslari", "holland"] },
    { id: "creative", name: "Creative storyteller", vector: [0.8, 0.7, 0.55, 0.4, 0.7], saves: ["heinrich-boll", "schwarzman", "great", "edinburgh-global", "erasmus"] },
    { id: "women-stem", name: "Women in STEM", vector: [0.86, 0.72, 0.7, 0.55, 0.65], saves: ["aauw", "kaist-intl", "daad-epos", "gates-cambridge", "mit-aid"] },
    { id: "local-impact", name: "Local impact maker", vector: [0.72, 0.55, 0.85, 0.9, 0.25], saves: ["australia-awards", "aga-khan", "csc", "turkiye-burslari", "jasso"] },
  ];

  /* ------------------------------------------------------------------ modules */
  const MODULES = {
    "english-test": { name: "English test sprint", domain: "English", hours: 4, activities: ["Take a full diagnostic test", "Practise speaking 15 minutes daily", "Book your IELTS/TOEFL date"] },
    "essay": { name: "Motivation essay lab", domain: "Essays", hours: 3, activities: ["Draft a 600-word story with one clear goal", "Get feedback from two readers", "Cut 20% of the words"] },
    "interview": { name: "Interview simulation", domain: "Interview", hours: 2, activities: ["Prepare six STAR stories", "Record a 20-minute mock interview", "Review body language and pace"] },
    "documents": { name: "Documents & legalisation", domain: "Admin", hours: 2, activities: ["Scan transcripts, passport and certificates", "Check translation and legalisation rules", "Create a shared backup folder"] },
    "budget": { name: "Funding gap plan", domain: "Finance", hours: 2, activities: ["Enter every cost line in the calculator", "Identify three cost-cutting levers", "Set a monthly savings target"] },
    "gpa": { name: "Academic record booster", domain: "Academics", hours: 4, activities: ["Meet your academic adviser", "Choose two grade-improvement actions", "Request updated transcripts"] },
    "portfolio": { name: "Portfolio & evidence", domain: "Profile", hours: 3, activities: ["Collect five pieces of evidence", "Write a one-page impact summary", "Ask a mentor to review"] },
    "visa": { name: "Visa & arrival checklist", domain: "Admin", hours: 2, activities: ["Check financial proof requirements", "Book the visa appointment", "Plan the first two weeks"] },
    "networking": { name: "Alumni and mentor outreach", domain: "Network", hours: 2, activities: ["Find three alumni on LinkedIn", "Send three short, specific messages", "Prepare questions for a call"] },
    "test-prep": { name: "Standardised test prep", domain: "Tests", hours: 5, activities: ["Take a baseline test", "Study the two weakest sections", "Schedule a retake if needed"] },
  };

  /* ------------------------------------------------------- verification defaults */
  // Spec §12: tag every scholarship with source-tier and application status if absent.
  // These are indicative records for a 2027 entry prototype — verify before applying.
  SCHOLARSHIPS.forEach(function (s) {
    if (!s.sourceTier) s.sourceTier = 2; // Tier 2 — verified secondary source
    if (!s.verified) s.verified = "2026-06-01"; // last verified date
    if (!s.status) {
      // Infer status from deadline proximity for the prototype
      var dl = s.deadline || "";
      if (dl === "Rolling across the year; university selection windows vary" || dl.indexOf("Rolling") >= 0 || dl.indexOf("rolling") >= 0) {
        s.status = "rolling";
      } else if (dl.indexOf("Typically") >= 0 || dl.indexOf("Announced") >= 0 || dl.indexOf("Aligned") >= 0) {
        s.status = "not-announced";
      } else {
        s.status = "upcoming";
      }
    }
    if (!s.renewal) {
      s.renewal = s.funding === "full"
        ? "Renewable annually subject to academic progress and programme continuation."
        : "Renewable per the award terms subject to academic standing.";
    }
    if (!s.eligibilityNotes) {
      s.eligibilityNotes = [
        "Eligibility criteria and deadlines may change between admission cycles — verify on the official provider page.",
        "This is an indicative record for 2027 entry planning, not a guarantee of eligibility.",
      ];
    }
    if (!s.nominalAmount) {
      var cov = s.coverage || {};
      if (cov.t >= 1 && (cov.s || 0) > 0) {
        s.nominalAmount = "Full tuition + monthly stipend (varies by destination)";
      } else if (cov.t >= 1) {
        s.nominalAmount = "Full tuition waiver";
      } else if (cov.t > 0) {
        s.nominalAmount = "Partial tuition coverage (" + Math.round((cov.t || 0) * 100) + "%)";
      } else if ((cov.s || 0) > 0) {
        s.nominalAmount = "Monthly stipend only";
      } else {
        s.nominalAmount = "Amount varies — see official page";
      }
    }
  });

  /* Merge expanded scholarships from data-expanded.js */
  if (global.SCHO_EXPANDED && global.SCHO_EXPANDED.EXPANDED_SCHOLARSHIPS) {
    SCHOLARSHIPS.push.apply(SCHOLARSHIPS, global.SCHO_EXPANDED.EXPANDED_SCHOLARSHIPS);
  }

  /* Update stats to reflect expanded database */
  META.stats.scholarships = SCHOLARSHIPS.length;

  window.SCHO = {
    META, FIELDS, LEVELS, ORIGINS, REGION_TYPES, CONNECTIVITY, INCOME_BANDS, PRIORITIES,
    DESTINATIONS, UNIVERSITIES, SCHOLARSHIPS, DIAGNOSTIC, ARCHETYPES, MODULES,
    CURRICULA, TEST_STATUSES, STANDARD_TESTS, MATCH_CATEGORIES, SOURCE_TIERS, APPLICATION_STATUSES,
  };
})(window);
