/* =========================================================================
   SchoLink Global — Internationalisation
   English is the source language. Translations are loaded on demand from
   assets/i18n/<code>.js and cached in memory. Missing strings fall back to
   the English source.
   ========================================================================= */
(function (global) {
  "use strict";

  const LANGS = [
    { code: "en", name: "English", native: "English", dir: "ltr" },
    { code: "es", name: "Spanish", native: "Español", dir: "ltr" },
    { code: "fr", name: "French", native: "Français", dir: "ltr" },
    { code: "de", name: "German", native: "Deutsch", dir: "ltr" },
    { code: "pt", name: "Portuguese", native: "Português", dir: "ltr" },
    { code: "it", name: "Italian", native: "Italiano", dir: "ltr" },
    { code: "nl", name: "Dutch", native: "Nederlands", dir: "ltr" },
    { code: "pl", name: "Polish", native: "Polski", dir: "ltr" },
    { code: "ru", name: "Russian", native: "Русский", dir: "ltr" },
    { code: "uk", name: "Ukrainian", native: "Українська", dir: "ltr" },
    { code: "tr", name: "Turkish", native: "Türkçe", dir: "ltr" },
    { code: "ar", name: "Arabic", native: "العربية", dir: "rtl" },
    { code: "fa", name: "Persian", native: "فارسی", dir: "rtl" },
    { code: "he", name: "Hebrew", native: "עברית", dir: "rtl" },
    { code: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr" },
    { code: "bn", name: "Bengali", native: "বাংলা", dir: "ltr" },
    { code: "ur", name: "Urdu", native: "اردو", dir: "rtl" },
    { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr" },
    { code: "vi", name: "Vietnamese", native: "Tiếng Việt", dir: "ltr" },
    { code: "th", name: "Thai", native: "ไทย", dir: "ltr" },
    { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", dir: "ltr", google: "zh-CN" },
    { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", dir: "ltr", google: "zh-TW" },
    { code: "ja", name: "Japanese", native: "日本語", dir: "ltr" },
    { code: "ko", name: "Korean", native: "한국어", dir: "ltr" },
    { code: "ms", name: "Malay", native: "Bahasa Melayu", dir: "ltr" },
    { code: "fil", name: "Filipino", native: "Filipino", dir: "ltr" },
    { code: "sw", name: "Swahili", native: "Kiswahili", dir: "ltr" },
  ];

  const CURRENCIES = [
    { code: "USD", name: "US Dollar", rate: 1, locale: "en-US" },
    { code: "EUR", name: "Euro", rate: 0.92, locale: "de-DE" },
    { code: "GBP", name: "British Pound", rate: 0.79, locale: "en-GB" },
    { code: "CAD", name: "Canadian Dollar", rate: 1.36, locale: "en-CA" },
    { code: "AUD", name: "Australian Dollar", rate: 1.52, locale: "en-AU" },
    { code: "IDR", name: "Indonesian Rupiah", rate: 16300, locale: "id-ID" },
    { code: "INR", name: "Indian Rupee", rate: 84, locale: "en-IN" },
    { code: "NGN", name: "Nigerian Naira", rate: 1550, locale: "en-NG" },
    { code: "BRL", name: "Brazilian Real", rate: 5.4, locale: "pt-BR" },
    { code: "JPY", name: "Japanese Yen", rate: 150, locale: "ja-JP" },
    { code: "CNY", name: "Chinese Yuan", rate: 7.2, locale: "zh-CN" },
    { code: "ZAR", name: "South African Rand", rate: 18.5, locale: "en-ZA" },
    { code: "KES", name: "Kenyan Shilling", rate: 129, locale: "en-KE" },
    { code: "PHP", name: "Philippine Peso", rate: 57, locale: "en-PH" },
    { code: "VND", name: "Vietnamese Dong", rate: 25400, locale: "vi-VN" },
  ];

  const state = { lang: "en", currency: "USD" };
  const cache = global.SCHOLINK_I18N || (global.SCHOLINK_I18N = {});
  const pending = {};

  /* Human-reviewed overrides for high-traffic terms where machine translation
     is ambiguous (for example “matches” becoming “partidos” in Spanish). */
  const OVERRIDES = {
    es: {
      "My matches": "Mis becas", "Top matches": "Tus mejores becas",
      "Matches you can apply to": "Becas a las que puedes postular",
      "Best match": "Mejor opción", "No matches in this filter": "No hay becas con este filtro",
      "Show all": "Ver todas", "1 gap": "1 brecha", "{n} gaps": "{n} brechas",
      "Build my plan": "Crear mi plan", "One gap to close": "Una brecha por cerrar",
      "curated scholarships": "becas seleccionadas", "of {n} checked": "de {n} revisadas",
      "My plan": "Mi plan", "Cost calculator": "Calculadora de costos",
      "Dashboard": "Panel de control", "Settings": "Configuración",
      "Find scholarships": "Buscar becas", "Any level": "Cualquier nivel",
      "Any field": "Cualquier campo", "Award covers": "La beca cubre",
      "{n} scholarships, ranked for real life": "{n} becas, ordenadas para la vida real",
      "Continue": "Continuar", "Back": "Volver", "Open": "Abrir", "Done": "Hecho", "Save": "Guardar",
    },
    id: {
      "My matches": "Kecocokan saya", "Top matches": "Kecocokan teratas",
      "Matches you can apply to": "Beasiswa yang bisa kamu lamar",
      "Best match": "Paling cocok", "No matches in this filter": "Tidak ada beasiswa dengan filter ini",
      "Show all": "Tampilkan semua", "1 gap": "1 kesenjangan", "{n} gaps": "{n} kesenjangan",
      "Build my plan": "Buat rencana saya", "One gap to close": "Satu kesenjangan untuk ditutup",
      "curated scholarships": "beasiswa terkurasi", "of {n} checked": "dari {n} diperiksa",
      "Net cost": "Biaya bersih", "Readiness": "Kesiapan",
    },
    fr: {
      "My matches": "Mes bourses", "Top matches": "Vos meilleures bourses",
      "Matches you can apply to": "Bourses auxquelles postuler",
      "Best match": "Meilleure option", "Build my plan": "Créer mon plan",
      "No matches in this filter": "Aucune bourse avec ce filtre",
    },
    pt: {
      "My matches": "Minhas bolsas", "Top matches": "Suas melhores bolsas",
      "Matches you can apply to": "Bolsas às quais você pode se candidatar",
      "Best match": "Melhor opção", "Build my plan": "Criar meu plano",
      "No matches in this filter": "Nenhuma bolsa com este filtro",
    },
  };

  function languageMeta(code) {
    return LANGS.find((l) => l.code === code) || LANGS[0];
  }

  function currentDict() {
    return cache[state.lang] || null;
  }

  function t(text, vars) {
    const dict = currentDict();
    const override = OVERRIDES[state.lang] && OVERRIDES[state.lang][text];
    let out = override || (dict && dict[text]) || text;
    if (vars) {
      out = out.replace(/\{(\w+)\}/g, (match, key) => (vars[key] !== undefined ? vars[key] : match));
    }
    return out;
  }

  function loadLang(code) {
    if (code === "en" || cache[code]) return Promise.resolve();
    if (pending[code]) return pending[code];
    pending[code] = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "assets/i18n/" + code + ".js";
      script.async = true;
      script.onload = () => { delete pending[code]; if (cache[code]) resolve(); else reject(new Error("empty")); };
      script.onerror = () => { delete pending[code]; reject(new Error("load")); };
      document.head.appendChild(script);
    });
    return pending[code];
  }

  function applyDocument() {
    const meta = languageMeta(state.lang);
    document.documentElement.lang = state.lang;
    document.documentElement.dir = meta.dir;
  }

  function setLang(code) {
    state.lang = code;
    applyDocument();
  }

  function setCurrency(code) {
    if (CURRENCIES.some((c) => c.code === code)) state.currency = code;
  }

  function currencyMeta() {
    return CURRENCIES.find((c) => c.code === state.currency) || CURRENCIES[0];
  }

  function money(usd, opts) {
    opts = opts || {};
    const cur = currencyMeta();
    const amount = Math.round(Number(usd || 0) * cur.rate);
    const zero = ["IDR", "JPY", "VND", "KRW"].indexOf(cur.code) >= 0;
    try {
      return new Intl.NumberFormat(currencyMeta().locale, {
        style: "currency", currency: cur.code,
        maximumFractionDigits: zero ? 0 : opts.cents ? 2 : 0,
        minimumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      return cur.code + " " + amount.toLocaleString("en-US");
    }
  }

  function number(value, opts) {
    try {
      return new Intl.NumberFormat(state.lang, opts || {}).format(value);
    } catch (e) {
      return String(value);
    }
  }

  function date(iso) {
    try {
      return new Date(iso + "T00:00:00").toLocaleDateString(state.lang, { day: "numeric", month: "short", year: "numeric" });
    } catch (e) {
      return iso;
    }
  }

  function percent(value) {
    return new Intl.NumberFormat(state.lang, { style: "percent", maximumFractionDigits: 0 }).format(value);
  }

  global.I18n = {
    LANGS, CURRENCIES, state, t, loadLang, setLang, setCurrency, money, number, date, percent,
    languageMeta, currencyMeta, applyDocument, cache,
  };
})(window);
