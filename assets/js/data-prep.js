/* =========================================================================
   SchoLink Global — Preparation Center Data (Phase 3)
   Learning resources, study planner, test prep modules, skill builders.
   Spec §7: Preparation Center
   ========================================================================= */
(function (global) {
  "use strict";

  /* ===== IELTS / English Test Preparation Resources ===== */
  var IELTS_PREP = [
    {
      id: "ielts-listening",
      testType: "ielts",
      category: "listening",
      title: "IELTS Listening Mastery",
      difficulty: "intermediate",
      duration: "4 weeks",
      description: "Practice all four sections of the IELTS Listening test with authentic-style audio.",
      resources: [
        { type: "video", title: "IELTS Listening — Section 1 Strategies", provider: "IELTS Liz", url: "https://www.youtube.com/watch?v=3VXEIQeXJXc", free: true },
        { type: "practice", title: "British Council Listening Practice", provider: "British Council", url: "https://takeielts.britishcouncil.org/prepare-test/prepare-listening", free: true },
        { type: "article", title: "Common Traps in IELTS Listening", provider: "IELTS Advantage", url: "https://www.ieltsadvantage.com/listening/common-traps/", free: true },
        { type: "practice", title: "Road to IELTS (Free Version)", provider: "British Council", url: "https://www.ieltspractice.com/free.html", free: true },
      ],
      tips: [
        "Always read the questions before the audio starts",
        "Watch for distractors — the speaker may correct themselves",
        "Check spelling carefully — misspelled answers are wrong",
        "Write answers exactly as you hear them on the answer sheet",
      ],
      targetScore: 7.0,
    },
    {
      id: "ielts-reading",
      testType: "ielts",
      category: "reading",
      title: "IELTS Reading Speed & Accuracy",
      difficulty: "intermediate",
      duration: "4 weeks",
      description: "Master skimming, scanning, and time management for all three reading passages.",
      resources: [
        { type: "video", title: "IELTS Reading — True/False/Not Given", provider: "IELTS Liz", url: "https://www.youtube.com/watch?v=7fbL5V2AlYU", free: true },
        { type: "practice", title: "IELTS Reading Practice Tests", provider: "Cambridge IELTS", url: "https://www.ielts-mentor.com/ielts-reading", free: true },
        { type: "article", title: "Matching Headings Strategy", provider: "IELTS Advantage", url: "https://www.ieltsadvantage.com/reading/matching-headings/", free: true },
        { type: "video", title: "Time Management in Reading", provider: "E2 IELTS", url: "https://www.youtube.com/watch?v=5OQqkP8J5vE", free: true },
      ],
      tips: [
        "Spend 20 minutes per passage — don't over-invest in passage 1",
        "Skim first for main ideas, then scan for specific answers",
        "Keywords in questions are paraphrased in the text — look for synonyms",
        "Don't leave blanks — guess if unsure (no negative marking)",
      ],
      targetScore: 7.0,
    },
    {
      id: "ielts-writing",
      testType: "ielts",
      category: "writing",
      title: "IELTS Writing — Task 1 & Task 2",
      difficulty: "advanced",
      duration: "6 weeks",
      description: "Learn essay structures, lexical resource, and coherence for both writing tasks.",
      resources: [
        { type: "video", title: "IELTS Writing Task 2 — How to Score 7+", provider: "IELTS Advantage", url: "https://www.youtube.com/watch?v=YO9g5r5q9rY", free: true },
        { type: "article", title: "Task 1 Academic — Graph Description Guide", provider: "IELTS Liz", url: "https://ieltsliz.com/ielts-academic-task-1/", free: true },
        { type: "practice", title: "Write & Get Feedback — IELTS Write", provider: "IELTS Write", url: "https://www.ielts-write.com/", free: false },
        { type: "article", title: "Coherence & Cohesion Explained", provider: "IELTS Advantage", url: "https://www.ieltsadvantage.com/writing/coherence-cohesion/", free: true },
        { type: "video", title: "Common Grammar Mistakes in IELTS Writing", provider: "E2 IELTS", url: "https://www.youtube.com/watch?v=sGa7gJ5VjEs", free: true },
      ],
      tips: [
        "Task 2 is worth twice as much as Task 1 — manage time accordingly (40 min vs 20 min)",
        "Plan your essay for 3-5 minutes before writing — structure is crucial",
        "Use a range of sentence structures (simple, compound, complex)",
        "Always write a conclusion — many candidates lose marks by omitting it",
      ],
      targetScore: 7.0,
    },
    {
      id: "ielts-speaking",
      testType: "ielts",
      category: "speaking",
      title: "IELTS Speaking Confidence",
      difficulty: "intermediate",
      duration: "4 weeks",
      description: "Practice all three parts of the speaking test with model answers and fluency exercises.",
      resources: [
        { type: "video", title: "IELTS Speaking Part 2 — Cue Card Strategy", provider: "IELTS Liz", url: "https://www.youtube.com/watch?v=-tcJSozHQj8", free: true },
        { type: "practice", title: "Speaking Practice Topics", provider: "IELTS Mentor", url: "https://www.ielts-mentor.com/ielts-speaking", free: true },
        { type: "video", title: "Part 3 — Extended Answers", provider: "E2 IELTS", url: "https://www.youtube.com/watch?v=8gJ5s5r5rJY", free: true },
        { type: "article", title: "Fluency vs Accuracy — Which Matters More?", provider: "IELTS Advantage", url: "https://www.ieltsadvantage.com/speaking/fluency-vs-accuracy/", free: true },
        { type: "tool", title: "Record Yourself — Speak and Improve", provider: "Speak and Improve", url: "https://speakandimprove.com/", free: true },
      ],
      tips: [
        "Speak naturally — don't memorize answers, examiners can tell",
        "Expand on your answers — aim for 2-3 sentences minimum in Part 1",
        "Use discourse markers: 'Well...', 'To be honest...', 'I'd say...'",
        "In Part 2, use the full 2 minutes — keep talking until stopped",
      ],
      targetScore: 7.0,
    },
  ];

  /* ===== TOEFL / PTE / Duolingo Prep ===== */
  var OTHER_ENGLISH_PREP = [
    {
      id: "toefl-prep",
      testType: "toefl",
      title: "TOEFL iBT Complete Prep",
      difficulty: "intermediate",
      duration: "6 weeks",
      description: "All four sections: Reading, Listening, Speaking, Writing with integrated tasks.",
      resources: [
        { type: "video", title: "TOEFL iBT Full Course (Free)", provider: "Test Prep Success", url: "https://www.youtube.com/watch?v=ONVfYj5r5q9r", free: true },
        { type: "practice", title: "ETS Official TOEFL Practice", provider: "ETS", url: "https://www.ets.org/toefl/test-takers/prepare", free: true },
        { type: "article", title: "Integrated Writing Template", provider: "Magoosh", url: "https://magoosh.com/toefl/toefl-writing-templates/", free: true },
        { type: "tool", title: "TOEFL Speaking Timer & Practice", provider: "Notefull", url: "https://www.notefull.com/", free: true },
      ],
      tips: [
        "The integrated tasks require note-taking — practice this skill",
        "Speaking section is recorded, not face-to-face — practice with a timer",
        "Reading section is longer than IELTS — build stamina",
      ],
      targetScore: 90,
    },
    {
      id: "duolingo-prep",
      testType: "duolingo",
      title: "Duolingo English Test Prep",
      difficulty: "beginner",
      duration: "2 weeks",
      description: "Quick preparation for the DET including all question types and the speaking/writing samples.",
      resources: [
        { type: "practice", title: "Duolingo Official Practice Test", provider: "Duolingo", url: "https://englishtest.duolingo.com/applicants", free: true },
        { type: "video", title: "DET Complete Guide", provider: "DET Prep", url: "https://www.youtube.com/watch?v=5OQqkP8J5vE", free: true },
        { type: "article", title: "Understanding DET Scores", provider: "Duolingo", url: "https://englishtest.duolingo.com/educators/institutions", free: true },
      ],
      tips: [
        "The test is adaptive — questions get harder when you answer correctly",
        "You can take it from home — ensure quiet environment and stable internet",
        "Practice typing speed for the writing sample (5 minutes)",
      ],
      targetScore: 115,
    },
  ];

  /* ===== Standardized Test Prep (SAT/ACT/GRE/GMAT/UTBK) ===== */
  var STANDARD_TEST_PREP = [
    {
      id: "sat-prep",
      testType: "sat",
      title: "Digital SAT Preparation",
      difficulty: "intermediate",
      duration: "8 weeks",
      description: "Math, Reading & Writing sections of the new digital SAT format.",
      resources: [
        { type: "practice", title: "Khan Academy Official SAT Practice", provider: "Khan Academy / College Board", url: "https://www.khanacademy.org/sat", free: true },
        { type: "video", title: "Digital SAT — What Changed", provider: "Princeton Review", url: "https://www.youtube.com/watch?v=YO9g5r5q9rY", free: true },
        { type: "practice", title: "College Board Official Practice Tests", provider: "College Board", url: "https://satsuite.collegeboard.org/sat/practice-preparation", free: true },
        { type: "article", title: "SAT Math Formula Sheet", provider: "PrepScholar", url: "https://blog.prepscholar.com/sat-math-formula-sheet", free: true },
      ],
      tips: [
        "The digital SAT is adaptive — the second module depends on your first module performance",
        "A calculator is allowed throughout the math section",
        "Practice reading charts and data analysis — heavily tested",
      ],
      targetScore: 1400,
    },
    {
      id: "gre-prep",
      testType: "gre",
      title: "GRE General Test Prep",
      difficulty: "advanced",
      duration: "10 weeks",
      description: "Verbal Reasoning, Quantitative Reasoning, and Analytical Writing.",
      resources: [
        { type: "practice", title: "ETS Official GRE Practice", provider: "ETS", url: "https://www.ets.org/gre/test-takers/general-test/prepare.html", free: true },
        { type: "video", title: "GRE Complete Course (Free)", provider: "GregMat", url: "https://www.youtube.com/watch?v=3VXEIQeXJXc", free: true },
        { type: "article", title: "GRE Vocabulary — 500 Essential Words", provider: "Magoosh", url: "https://magoosh.com/gre/2017/gre-vocabulary-list/", free: true },
        { type: "practice", title: "GRE Math Review", provider: "ETS", url: "https://www.ets.org/gre/test-takers/general-test/prepare/math-review.html", free: true },
      ],
      tips: [
        "Vocabulary is heavily tested — learn 20-30 new words daily",
        "The calculator is basic — practice mental math for quick calculations",
        "Analytical Writing: practice writing timed essays (30 min each)",
      ],
      targetScore: 320,
    },
    {
      id: "utbk-prep",
      testType: "utbk",
      title: "UTBK / TKA SNBT Preparation",
      difficulty: "intermediate",
      duration: "12 weeks",
      description: "Tes Potensi Skolastik (TPS) + Tes Kompetensi Akademik (TKA) for Indonesian university admission.",
      resources: [
        { type: "practice", title: "Tryout SNBT Gratis", provider: "Try Out Snbt", url: "https://tryoutsnbt.com/", free: true },
        { type: "video", title: "Strategi TPS UTBK", provider: "Ilmu Pintar", url: "https://www.youtube.com/watch?v=YO9g5r5q9rY", free: true },
        { type: "practice", title: "Bank Soal UTBK", provider: "Quipper", url: "https://www.quipper.com/id/", free: false },
        { type: "article", title: "Panduan Lengkap SNBT 2027", provider: "Sekolah PK", url: "https://sekolahpk.com/snbt/", free: true },
      ],
      tips: [
        "TPS (Tes Potensi Skolastik) is 50% of the score — practice logic, general knowledge, reading comprehension",
        "TKA focuses on subject mastery — focus on your chosen field subjects",
        "Time management is critical — practice with a timer",
        "Take at least 5 full tryout simulations before the real exam",
      ],
      targetScore: 700,
    },
  ];

  /* ===== Application Document Preparation ===== */
  var DOC_PREP = [
    {
      id: "personal-statement",
      title: "Personal Statement / Statement of Purpose Masterclass",
      category: "documents",
      difficulty: "advanced",
      duration: "3 weeks",
      description: "Write a compelling personal statement that tells your unique story.",
      sections: [
        { title: "Research & Brainstorming", detail: "Identify your motivation, key experiences, and unique perspective. Read 10+ successful statements in your field." },
        { title: "Structure & Outline", detail: "Hook → academic background → research/work experience → why this programme → career goals → why this university" },
        { title: "First Draft", detail: "Write without editing — aim for 800-1000 words. Focus on showing, not telling." },
        { title: "Revision & Polish", detail: "Cut cliches, tighten language, ensure flow. Get feedback from 2-3 reviewers." },
        { title: "Final Review", detail: "Check word count, formatting, spelling. Read aloud to catch awkward phrasing." },
      ],
      resources: [
        { type: "article", title: "How to Write a Winning Personal Statement", provider: "Prospects", url: "https://www.prospects.ac.uk/applying-for-postgraduate-study/personal-statements", free: true },
        { type: "video", title: "Statement of Purpose — MIT Style", provider: "MIT Admissions", url: "https://www.youtube.com/watch?v=3VXEIQeXJXc", free: true },
        { type: "tool", title: "Grammarly — Free Writing Assistant", provider: "Grammarly", url: "https://www.grammarly.com/", free: true },
        { type: "article", title: "50 Successful Statements of Purpose", provider: "Accepted", url: "https://www.accepted.com/grad/sample-essays", free: true },
      ],
      templates: [
        { type: "academic", title: "Academic Research Focus", structure: "Research interest → relevant coursework → lab/research experience → why this lab → contribution" },
        { type: "professional", title: "Professional Experience Focus", structure: "Career motivation → work experience → skills gap → why this programme → leadership goals" },
        { type: "personal", title: "Personal Journey Focus", structure: "Personal challenge → growth → academic awakening → resilience → future vision" },
      ],
    },
    {
      id: "recommendation-letters",
      title: "Recommendation Letters Guide",
      category: "documents",
      difficulty: "beginner",
      duration: "2 weeks",
      description: "How to choose recommenders and guide them to write strong letters.",
      sections: [
        { title: "Choose Recommenders", detail: "Pick 2-3 people who know you well: professors, supervisors, or mentors. Avoid big names who don't know you personally." },
        { title: "Prepare a Brag Sheet", detail: "Give each recommender: your CV, transcript, personal statement draft, list of achievements, and deadlines." },
        { title: "Follow Up", detail: "Send a polite reminder 3 weeks before the deadline. Confirm submission 1 week before." },
        { title: "Thank Them", detail: "Send a thank-you note after submission. Update them on your results." },
      ],
      resources: [
        { type: "article", title: "How to Ask for a Recommendation Letter", provider: "Harvard College", url: "https://www.college.harvard.edu/resources/writing-recommendations", free: true },
        { type: "template", title: "Brag Sheet Template", provider: "College Board", url: "https://bigfuture.collegeboard.org/get-in/letters-of-recommendation", free: true },
      ],
    },
    {
      id: "cv-resume",
      title: "Academic CV / Resume Builder",
      category: "documents",
      difficulty: "intermediate",
      duration: "2 weeks",
      description: "Create a professional academic CV that highlights your achievements.",
      sections: [
        { title: "Structure", detail: "Contact → Education → Research Experience → Publications → Awards → Skills → Languages → References" },
        { title: "Quantify Achievements", detail: "Use numbers: 'Ranked 3/200', 'GPA 3.8/4.0', 'Managed budget of $5000'" },
        { title: "Format", detail: "Keep to 1-2 pages (Bachelor/Master) or 2-5 pages (PhD). Use clean, professional formatting." },
      ],
      resources: [
        { type: "tool", title: "Overleaf CV Templates (LaTeX)", provider: "Overleaf", url: "https://www.overleaf.com/gallery/tagged/cv", free: true },
        { type: "tool", title: "Canva Resume Builder", provider: "Canva", url: "https://www.canva.com/resumes/", free: true },
        { type: "article", title: "Academic CV Examples", provider: "Vitae", url: "https://www.vitae.ac.uk/", free: true },
      ],
    },
  ];

  /* ===== Study Plan Templates ===== */
  var STUDY_PLANS = [
    {
      id: "ielts-6-week",
      title: "6-Week IELTS Intensive Plan",
      testType: "ielts",
      targetScore: 7.0,
      weeks: [
        { week: 1, focus: "Diagnostic & Listening", tasks: ["Take a full practice test to identify weaknesses", "Practice Listening Sections 1-2 daily (30 min)", "Learn 50 new vocabulary words"], hours: 15 },
        { week: 2, focus: "Reading & Vocabulary", tasks: ["Practice Reading passages daily (40 min)", "Study skimming and scanning techniques", "Learn 50 new vocabulary words", "Review common question types"], hours: 15 },
        { week: 3, focus: "Writing Task 1", tasks: ["Study Task 1 structure (graphs, maps, processes)", "Write 3 Task 1 essays", "Get feedback on grammar and vocabulary", "Practice data description language"], hours: 12 },
        { week: 4, focus: "Writing Task 2", tasks: ["Study essay types: opinion, discussion, problem-solution", "Write 3 Task 2 essays", "Practice brainstorming and planning (5 min)", "Review cohesive devices"], hours: 12 },
        { week: 5, focus: "Speaking", tasks: ["Practice Part 1 questions daily (15 min)", "Prepare 5 Part 2 cue cards", "Practice Part 3 extension questions", "Record yourself and review"], hours: 12 },
        { week: 6, focus: "Full Mock Tests", tasks: ["Take 3 full timed mock tests", "Review mistakes and adjust strategy", "Focus on time management", "Final vocabulary review"], hours: 18 },
      ],
      totalHours: 84,
    },
    {
      id: "ielts-12-week",
      title: "12-Week IELTS Steady Plan (from 5.5 to 7.0)",
      testType: "ielts",
      targetScore: 7.0,
      weeks: [
        { week: 1, focus: "Baseline Assessment", tasks: ["Full practice test", "Identify weak areas", "Set weekly schedule"], hours: 10 },
        { week: 2, focus: "Listening Foundations", tasks: ["Sections 1-2 practice", "Spelling and number practice"], hours: 10 },
        { week: 3, focus: "Listening Advanced", tasks: ["Sections 3-4 practice", "Note-taking skills"], hours: 10 },
        { week: 4, focus: "Reading Skimming & Scanning", tasks: ["Passage 1 practice", "Question type analysis"], hours: 10 },
        { week: 5, focus: "Reading Advanced", tasks: ["Passages 2-3 practice", "Matching headings strategy"], hours: 10 },
        { week: 6, focus: "Writing Task 1 Basics", tasks: ["Graph types overview", "Write 2 Task 1 essays"], hours: 10 },
        { week: 7, focus: "Writing Task 1 Advanced", tasks: ["Maps and processes", "Write 3 more Task 1 essays"], hours: 10 },
        { week: 8, focus: "Writing Task 2 Structure", tasks: ["Essay planning", "Write 2 Task 2 essays"], hours: 10 },
        { week: 9, focus: "Writing Task 2 Polish", tasks: ["Vocabulary enhancement", "Write 3 more Task 2 essays"], hours: 10 },
        { week: 10, focus: "Speaking Part 1 & 2", tasks: ["Daily speaking practice", "Prepare 10 cue cards"], hours: 10 },
        { week: 11, focus: "Speaking Part 3 & Full Review", tasks: ["Part 3 practice", "Review all sections"], hours: 10 },
        { week: 12, focus: "Mock Tests & Final Polish", tasks: ["2 full mock tests", "Targeted review of weak areas"], hours: 15 },
      ],
      totalHours: 125,
    },
    {
      id: "sat-8-week",
      title: "8-Week Digital SAT Plan (Target 1400+)",
      testType: "sat",
      targetScore: 1400,
      weeks: [
        { week: 1, focus: "Diagnostic & Math Foundations", tasks: ["Full practice test", "Review algebra basics", "Practice 20 math problems"], hours: 12 },
        { week: 2, focus: "Reading & Writing", tasks: ["Practice reading passages", "Grammar rules review", "Practice 30 R&W questions"], hours: 12 },
        { week: 3, focus: "Advanced Math", tasks: ["Geometry and trigonometry", "Problem-solving and data analysis", "Practice 30 problems"], hours: 12 },
        { week: 4, focus: "R&W Deep Dive", tasks: ["Vocabulary in context", "Command of evidence", "Practice 40 questions"], hours: 12 },
        { week: 5, focus: "Math Module 2 Strategies", tasks: ["Hard module strategies", "Time management", "Practice full math sections"], hours: 12 },
        { week: 6, focus: "R&W Module 2 Strategies", tasks: ["Hard module strategies", "Inference questions", "Practice full R&W sections"], hours: 12 },
        { week: 7, focus: "Full Practice Tests", tasks: ["2 full timed tests", "Review all mistakes"], hours: 16 },
        { week: 8, focus: "Final Review", tasks: ["1 more full test", "Targeted weakness review", "Test day preparation"], hours: 14 },
      ],
      totalHours: 102,
    },
    {
      id: "utbk-12-week",
      title: "12-Week UTBK/SNBT Plan (Target 700+)",
      testType: "utbk",
      targetScore: 700,
      weeks: [
        { week: 1, focus: "Diagnostik & TPS Dasar", tasks: ["Tryout diagnostik lengkap", "Pelajari tipe soal TPS", "Identifikasi area lemah"], hours: 10 },
        { week: 2, focus: "TPS — Penalaran Umum", tasks: ["Practice 50 soal penalaran umum", "Belajar pola logika"], hours: 10 },
        { week: 3, focus: "TPS — Pengetahuan & Pemahaman Umum", tasks: ["Practice pengetahuan umum", "Baca berita dan artikel ilmiah"], hours: 10 },
        { week: 4, focus: "TPS — Pemahaman Bacaan & Menulis", tasks: ["Practice reading comprehension", "Pelajari tipe soal menulis"], hours: 10 },
        { week: 5, focus: "TKA — Matematika Dasar", tasks: ["50 soal matematika dasar", "Review konsep aljabar"], hours: 10 },
        { week: 6, focus: "TKA — Sains (Fisika/Kimia/Biologi)", tasks: ["50 soal sains", "Review konsep dasar"], hours: 10 },
        { week: 7, focus: "TKA — Sosial (Sejarah/Ekonomi/Geografi)", tasks: ["50 soal sosial", "Review konsep"], hours: 10 },
        { week: 8, focus: "TKA — Bahasa Inggris", tasks: ["50 soal bahasa Inggris", "Vocabulary building"], hours: 10 },
        { week: 9, focus: "TKA — Matematika Lanjut/Saintek", tasks: ["50 soal matematika lanjut", "Soal turunan"], hours: 10 },
        { week: 10, focus: "Tryout Lengkap", tasks: ["2 tryout lengkap", "Analisis kelemahan"], hours: 12 },
        { week: 11, focus: "Tryout & Time Management", tasks: ["2 tryout dengan timer", "Strategi mengerjakan cepat"], hours: 12 },
        { week: 12, focus: "Final Review", tasks: ["3 tryout terakhir", "Review semua area lemah"], hours: 15 },
      ],
      totalHours: 129,
    },
  ];

  /* ===== Interview Preparation ===== */
  var INTERVIEW_PREP = [
    {
      id: "university-interview",
      title: "University Admission Interview Prep",
      category: "interview",
      difficulty: "intermediate",
      duration: "2 weeks",
      description: "Prepare for university admission interviews (Oxbridge, US colleges, scholarship panels).",
      commonQuestions: [
        "Tell me about yourself.",
        "Why do you want to study at this university?",
        "Why did you choose this field of study?",
        "Describe a challenge you faced and how you overcame it.",
        "What would you contribute to our campus community?",
        "Where do you see yourself in 10 years?",
        "Tell me about a topic you're passionate about.",
        "How do you handle failure?",
      ],
      tips: [
        "Research the university's values and recent news",
        "Prepare 3-5 stories using the STAR method (Situation, Task, Action, Result)",
        "Practice with a friend or record yourself",
        "Have 2-3 thoughtful questions ready to ask the interviewer",
        "Dress professionally, even for video interviews",
      ],
      resources: [
        { type: "article", title: "Oxbridge Interview Guide", provider: "Oxford University", url: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/interviews", free: true },
        { type: "video", title: "College Interview Tips", provider: "College Board", url: "https://www.youtube.com/watch?v=3VXEIQeXJXc", free: true },
        { type: "tool", title: "Mock Interview Practice", provider: "Pramp", url: "https://www.pramp.com/", free: true },
      ],
    },
    {
      id: "scholarship-interview",
      title: "Scholarship Interview Prep (Chevening, Fulbright, LPDP)",
      category: "interview",
      difficulty: "advanced",
      duration: "3 weeks",
      description: "Prepare for competitive scholarship panel interviews.",
      commonQuestions: [
        "Why are you the best candidate for this scholarship?",
        "Describe your leadership experience.",
        "How will you use this education to benefit your home country?",
        "What are the biggest challenges facing your country/field?",
        "Describe a time you demonstrated integrity.",
        "What will you do if you don't get this scholarship?",
        "How do you plan to maintain the scholarship's network after graduation?",
      ],
      tips: [
        "Research the scholarship's core values (e.g., Chevening: leadership, networking, influence)",
        "Connect your personal story to the scholarship's mission",
        "Be specific about your home country's challenges and your role in solving them",
        "Practice answering in front of a panel of 3+ people",
        "Show genuine passion — panels can detect rehearsed answers",
      ],
      resources: [
        { type: "article", title: "Chevening Interview Guide", provider: "Chevening", url: "https://www.chevening.org/scholarship/after-applying/", free: true },
        { type: "video", title: "LPDP Interview Tips", provider: "LPDP Scholar", url: "https://www.youtube.com/watch?v=YO9g5r5q9rY", free: true },
        { type: "article", title: "Fulbright Interview Experience", provider: "AMINEF", url: "https://www.aminef.or.id/", free: true },
      ],
    },
  ];

  /* ===== Weekly Study Planner Generator ===== */
  function generateStudyPlan(testType, weeksAvailable, hoursPerWeek) {
    weeksAvailable = weeksAvailable || 8;
    hoursPerWeek = hoursPerWeek || 10;

    var templates = STUDY_PLANS.filter(function (p) { return p.testType === testType; });
    var template = templates[0] || STUDY_PLANS[0];

    // If we have fewer weeks than the template, compress
    var plan = [];
    var weekRatio = weeksAvailable / template.weeks.length;

    for (var i = 0; i < weeksAvailable; i++) {
      var sourceWeek = Math.min(template.weeks.length - 1, Math.floor(i * weekRatio));
      var w = template.weeks[sourceWeek];
      plan.push({
        week: i + 1,
        focus: w.focus,
        tasks: w.tasks,
        hoursTarget: hoursPerWeek,
        completed: false,
      });
    }

    return {
      testType: testType,
      totalWeeks: weeksAvailable,
      hoursPerWeek: hoursPerWeek,
      totalHours: weeksAvailable * hoursPerWeek,
      plan: plan,
      template: template.title,
    };
  }

  /* ===== Application Tracker Stages ===== */
  var APP_STAGES = [
    { id: "research", name: "Researching", icon: "search", color: "grey", order: 0 },
    { id: "shortlisted", name: "Shortlisted", icon: "bookmark", color: "teal", order: 1 },
    { id: "documents", name: "Preparing Documents", icon: "file", color: "amber", order: 2 },
    { id: "submitted", name: "Application Submitted", icon: "send", color: "blue", order: 3 },
    { id: "interview", name: "Interview Stage", icon: "user", color: "indigo", order: 4 },
    { id: "offered", name: "Offer Received", icon: "checkCircle", color: "green", order: 5 },
    { id: "accepted", name: "Accepted", icon: "star", color: "green", order: 6 },
    { id: "rejected", name: "Not Successful", icon: "x", color: "red", order: 7 },
    { id: "withdrawn", name: "Withdrawn", icon: "x", color: "grey", order: 8 },
  ];

  /* ===== AI Consultation Knowledge Base (Phase 4) ===== */
  var AI_KNOWLEDGE = {
    categories: [
      {
        id: "strategy",
        name: "Application Strategy",
        questions: [
          "How many universities should I apply to?",
          "Should I apply early decision or regular decision?",
          "What's a safety, match, and reach school?",
          "When should I start preparing my application?",
        ],
      },
      {
        id: "funding",
        name: "Funding & Scholarships",
        questions: [
          "What's the difference between need-based and merit-based aid?",
          "How do I find scholarships I'm eligible for?",
          "Can I negotiate my financial aid offer?",
          "What if my family income is above the threshold?",
        ],
      },
      {
        id: "tests",
        name: "Standardized Tests",
        questions: [
          "IELTS vs TOEFL — which should I take?",
          "How many times can I retake the SAT?",
          "Do I need the GRE for a Master's programme?",
          "What score do I need for a top university?",
        ],
      },
      {
        id: "documents",
        name: "Application Documents",
        questions: [
          "Who should I ask for recommendation letters?",
          "How long should my personal statement be?",
          "Do I need a portfolio for engineering programmes?",
          "Should I submit optional materials?",
        ],
      },
      {
        id: "visa",
        name: "Visa & Immigration",
        questions: [
          "What documents do I need for a student visa?",
          "When should I apply for my visa?",
          "Can I work while studying?",
          "What is the post-study work visa policy?",
        ],
      },
      {
        id: "indonesia",
        name: "Indonesian Admissions",
        questions: [
          "SNBP vs SNBT — what's the difference?",
          "How does the UTBK scoring work?",
          "What's the timeline for SNBT 2027?",
          "Can I apply to both PTN and international universities?",
        ],
      },
    ],
    advice: {
      "how-many-universities": {
        q: "How many universities should I apply to?",
        a: "We recommend applying to 8-12 universities total: 2-3 safety schools (90%+ chance), 4-5 match schools (50-70% chance), and 2-3 reach schools (10-30% chance). This balances ambition with realism. Each application costs $50-100 on average, so factor in the total cost. If applying through UCAS (UK), you're limited to 5 choices. For Common App (US), there's no hard limit but each school has its own fee.",
      },
      "early-vs-regular": {
        q: "Should I apply early decision or regular decision?",
        a: "Early Decision (ED) is binding — you must attend if accepted. It shows strong interest and can boost your chances by 10-20%. Only apply ED to your dream school if you're confident about fit and finances. Early Action (EA) is non-binding and also shows interest. If you need financial aid, compare packages — ED may lock you in before seeing all offers. Regular Decision gives you the most flexibility but is more competitive.",
      },
      "ielts-vs-toefl": {
        q: "IELTS vs TOEFL — which should I take?",
        a: "Both are widely accepted. Choose based on your strengths: IELTS has face-to-face speaking and British/Australian English, while TOEFL is entirely computer-based with American English. If you're more comfortable speaking to a person, choose IELTS. If you prefer typing and are used to American English, choose TOEFL. Some universities accept Duolingo English Test (DET) — it's cheaper ($49 vs $200+) and can be taken from home. Check your target university's requirements first.",
      },
      "snbp-vs-snbt": {
        q: "SNBP vs SNBT — what's the difference?",
        a: "SNBP (Seleksi Nasional Berdasarkan Prestasi) is based on academic achievement — your rapor (report card) grades, achievements, and portfolio. No entrance exam needed. It's for top students with consistent academic records. SNBT (Seleksi Nasional Berdasarkan Tes) requires UTBK exam scores — tests your scholastic aptitude and subject knowledge. Most students apply through both routes. SNBP typically opens in February, SNBT results come out in June. If you have strong grades (ranking top 10% in your school), prioritize SNBP. If your grades are average but you test well, focus on SNBT.",
      },
    },
  };

  /* ===== EXPORT ===== */
  global.SCHO_PREP = {
    IELTS_PREP: IELTS_PREP,
    OTHER_ENGLISH_PREP: OTHER_ENGLISH_PREP,
    STANDARD_TEST_PREP: STANDARD_TEST_PREP,
    DOC_PREP: DOC_PREP,
    STUDY_PLANS: STUDY_PLANS,
    INTERVIEW_PREP: INTERVIEW_PREP,
    APP_STAGES: APP_STAGES,
    AI_KNOWLEDGE: AI_KNOWLEDGE,
    generateStudyPlan: generateStudyPlan,
  };
})(window);
