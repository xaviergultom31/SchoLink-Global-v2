/* =========================================================================
   SchoLink Global — UI primitives (no dependencies)
   ========================================================================= */
(function (global) {
  "use strict";

  const I = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18h5a4 4 0 0 0 0-8h-3a4 4 0 0 1 0-8h5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/>',
    wallet: '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 16.5z"/><path d="M3 8.5V7a1 1 0 0 1 1-1h13"/><path d="M16 12h4v4h-4a2 2 0 0 1 0-4z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
    arrow: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    arrowUp: '<path d="M12 20V5"/><path d="m6 11 6-6 6 6"/>',
    check: '<path d="m4 12.5 5 5L20 6.5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 9v5"/><circle cx="12" cy="17.5" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r="1"/>',
    x: '<path d="m5 5 14 14"/><path d="M19 5 5 19"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 5 7 7-7 7"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15"/>',
    building: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h3a1 1 0 0 1 1 1v11"/><path d="M8 7h4M8 11h4M8 15h4M2 21h20"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 16.5 19 18l1.5.5-1.5.5-.5 1.5-.5-1.5L16.5 18l1.5-.5z"/>',
    download: '<path d="M12 3v12"/><path d="m7 12 5 5 5-5"/><path d="M4 21h16"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4 10.5 13.5"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    plane: '<path d="M21 3 3 10.5l6 2.5 2.5 6L21 3z"/><path d="m9 13 4 4"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5L16 9.5"/>',
    chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
    sliders: '<path d="M4 7h9M17 7h3"/><path d="M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14-4L3 10"/><path d="M3 5v5h5"/><path d="M4 13a8 8 0 0 0 14 4l3-3"/><path d="M21 19v-5h-5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    graduation: '<path d="M2.5 8.5 12 4l9.5 4.5L12 13z"/><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/><path d="M21.5 8.5V15"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
    language: '<path d="M3 5h9M7.5 5c0 4-2 7-4.5 9"/><path d="M5 9c1.5 3 4 5 7 6"/><path d="m12 19 4-10 4 10"/><path d="M13.6 15.5h4.8"/>',
    walletCard: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/><path d="M6 15h4"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M17.5 14.2A6 6 0 0 1 21 20"/>',
    leaf: '<path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s2-1 4-1c7 0 11-6 11-15z"/><path d="M4 20C7 13 12 9 18 7"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    wifiOff: '<path d="M2 2l20 20"/><path d="M8.5 16a5 5 0 0 1 7 0"/><path d="M5 12a10 10 0 0 1 5-2.6"/><path d="M14 9.4A10 10 0 0 1 19 12"/><path d="M2 8.5a15 15 0 0 1 4-2.8"/><path d="M18 5.7a15 15 0 0 1 4 2.8"/><circle cx="12" cy="19" r="1"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  };

  function icon(name, cls) {
    return '<svg class="i ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (I[name] || I.info) + "</svg>";
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function ring(score, size) {
    const r = size === "sm" ? 22 : 26;
    const c = 2 * Math.PI * r;
    const off = c - (Math.min(100, Math.max(0, score)) / 100) * c;
    const cls = score >= 75 ? "" : score >= 55 ? "amber" : "red";
    return '<div class="ring-wrap"><svg viewBox="0 0 62 62" role="img" aria-label="' + score + '%">' +
      '<circle class="ring-bg" cx="31" cy="31" r="' + r + '"/>' +
      '<circle class="ring-fg ' + cls + '" cx="31" cy="31" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '</svg><div class="ring-num">' + Math.round(score) + "<small>%</small></div></div>";
  }

  function bars(items) {
    return '<div class="bars">' + items.map((it) => {
      const v = Math.round(it.value);
      const cls = v < 40 ? "crit" : v < 62 ? "low" : "";
      return '<div class="bar-row"><span class="lbl">' + esc(it.label) + '</span>' +
        '<div class="bar-track"><div class="bar-fill ' + cls + '" style="width:' + Math.max(3, v) + '%"></div></div>' +
        '<span class="val">' + v + "</span></div>";
    }).join("") + "</div>";
  }

  function badge(text, tone, iko) {
    return '<span class="badge badge--' + (tone || "grey") + '">' + (iko ? icon(iko, "i-sm") : "") + esc(text) + "</span>";
  }

  function progress(value, cls) {
    return '<div class="meter ' + (cls || "") + '"><span style="width:' + Math.max(2, Math.min(100, value)) + '%"></span></div>';
  }

  function deadlineChip(days) {
    const cls = days <= 21 ? "urgent" : days <= 60 ? "soon" : "";
    const label = days <= 0 ? I18n.t("Closed") : I18n.t("{n} days left", { n: days });
    return '<span class="deadline-pill ' + cls + '">' + icon("clock", "i-sm") + esc(label) + "</span>";
  }

  function initials(name) {
    return (name || "S").trim().split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();
  }

  function toast(message, tone) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; document.body.appendChild(stack); }
    const el = document.createElement("div");
    el.className = "toast" + (tone === "warn" ? " toast--warn" : "");
    el.innerHTML = icon(tone === "warn" ? "alert" : "checkCircle", "i-sm") + "<span>" + esc(message) + "</span>";
    stack.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2800);
  }

  function money(usd, opts) { return I18n.money(usd, opts); }

  function statCard(label, value, foot, iko, tone) {
    return '<div class="card stat"><div class="spread"><div class="stat-label">' + esc(label) + "</div>" +
      '<div class="stat-icon"' + (tone ? ' data-tone="' + tone + '"' : "") + ">" + icon(iko) + "</div></div>" +
      '<div class="stat-num">' + value + '</div><div class="stat-foot">' + foot + "</div></div>";
  }

  global.UI = { icon, esc, ring, bars, badge, progress, deadlineChip, initials, toast, money, statCard };
})(window);
