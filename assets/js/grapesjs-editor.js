/* =========================================================================
   SchoLink — GrapesJS visual editor integration
   Loads on demand when user clicks "Edit with GrapesJS" button.
   ========================================================================= */
(function (global) {
  "use strict";

  var editor = null;
  var isActive = false;
  var EDITOR_CONTAINER_ID = "grapesjs-container";
  var TOGGLE_BTN_ID = "gjs-toggle-btn";

  /* Load CSS link dynamically */
  function loadCSS(href) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('link[href="' + href + '"]');
      if (existing) { resolve(); return; }
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /* Load JS script dynamically */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) { resolve(); return; }
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /* Load GrapesJS + preset plugin from CDN */
  function loadGrapesJS() {
    return Promise.resolve()
      .then(function () {
        return loadCSS("https://unpkg.com/grapesjs@0.21.4/dist/css/grapes.min.css");
      })
      .then(function () {
        return loadScript("https://unpkg.com/grapesjs@0.21.4/dist/grapes.min.js");
      })
      .then(function () {
        return loadScript("https://unpkg.com/grapesjs-preset-webpage@1.0.2/dist/grapesjs-preset-webpage.min.js");
      });
  }

  /* Create floating toggle button */
  function createToggleButton() {
    var existing = document.getElementById(TOGGLE_BTN_ID);
    if (existing) return;
    var btn = document.createElement("button");
    btn.id = TOGGLE_BTN_ID;
    btn.innerHTML = '\u270f\ufe0f Edit';
    btn.style.cssText = [
      "position:fixed",
      "bottom:20px",
      "right:20px",
      "z-index:99999",
      "background:#0f9d8a",
      "color:#fff",
      "border:none",
      "border-radius:10px",
      "padding:10px 18px",
      "font-size:14px",
      "font-weight:600",
      "cursor:pointer",
      "box-shadow:0 4px 12px rgba(15,157,138,0.4)",
      "transition:opacity 0.2s",
      "font-family:inherit",
    ].join(";");
    btn.title = "Edit page with GrapesJS";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      toggle();
    });
    document.body.appendChild(btn);
  }

  /* Enter editor mode */
  function openEditor() {
    if (isActive) return;

    loadGrapesJS().then(function () {
      if (!global.grapesjs) {
        console.error("GrapesJS failed to load");
        return;
      }

      /* Create container */
      var container = document.createElement("div");
      container.id = EDITOR_CONTAINER_ID;
      container.style.cssText = [
        "position:fixed",
        "top:0",
        "left:0",
        "width:100vw",
        "height:100vh",
        "z-index:99998",
      ].join(";");
      document.body.appendChild(container);

      /* Capture current #app innerHTML as the editable content */
      var appEl = document.getElementById("app");
      var currentHTML = appEl.innerHTML;

      /* Hide app elements that should not be in the editor */
      var backdrop = document.getElementById("backdrop");
      var drawer = document.getElementById("drawer");
      var modal = document.getElementById("modal");
      var toastStack = document.querySelector(".toast-stack");
      var toggleBtn = document.getElementById(TOGGLE_BTN_ID);

      if (backdrop) backdrop.style.display = "none";
      if (drawer) drawer.style.display = "none";
      if (modal) modal.style.display = "none";
      if (toastStack) toastStack.style.display = "none";
      if (toggleBtn) toggleBtn.style.display = "none";

      /* Hide the #app container itself since GrapesJS will render into the container */
      appEl.style.display = "none";

      /* Initialize GrapesJS */
      editor = global.grapesjs.init({
        container: "#" + EDITOR_CONTAINER_ID,
        fromElement: false,
        html: currentHTML,
        css: getInlineCSS(),
        storageManager: false,
        width: "100%",
        height: "100%",
        plugins: ["gjs-preset-webpage"],
        pluginsOpts: {
          "gjs-preset-webpage": {
            modalImportTitle: "Import HTML",
            modalExportTitle: "Export Code",
          },
        },
        blockManager: {
          appendTo: "#blocks",
        },
        styleManager: {
          appendTo: "#styles-container",
        },
        layerManager: {
          appendTo: "#layers-container",
        },
      });

      /* Add custom blocks */
      addCustomBlocks(editor);

      /* Add Save / Export / Close buttons to the panel */
      addPanelButtons(editor);

      isActive = true;
    }).catch(function (err) {
      console.error("Failed to load GrapesJS:", err);
      alert("Failed to load GrapesJS. Check your internet connection and try again.");
    });
  }

  /* Get inline CSS from loaded stylesheets (just the app CSS text) */
  function getInlineCSS() {
    var css = "";
    try {
      for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        try {
          if (sheet.cssRules) {
            for (var j = 0; j < sheet.cssRules.length; j++) {
              css += sheet.cssRules[j].cssText + "\n";
            }
          }
        } catch (e) {
          /* Cross-origin sheet, skip */
        }
      }
    } catch (e) { /* ignore */ }
    return css;
  }

  /* Add SchoLink-specific blocks */
  function addCustomBlocks(editor) {
    var blockManager = editor.BlockManager;

    blockManager.add("scholink-hero", {
      label: "Hero Section",
      content: '<section class="hero"><div class="hero-inner"><div class="hero-badge">Scholarships without borders</div><h1>Find scholarships you can actually win</h1><p class="lede">Free, independent, and private. Estimate real costs after funding and build a week-by-week plan.</p><div class="hero-cta"><a class="btn btn--primary btn--lg" href="#/start">Start free</a><a class="btn btn--ghost btn--lg" href="#/scholarships">Browse scholarships</a></div></div></section>',
      category: "SchoLink",
    });

    blockManager.add("scholink-card", {
      label: "Card",
      content: '<div class="card"><h3>Card Title</h3><p>Card description goes here.</p><a class="btn btn--primary btn--sm" href="#">Action</a></div>',
      category: "SchoLink",
    });

    blockManager.add("scholink-stat", {
      label: "Stat Card",
      content: '<div class="card stat"><div class="stat-label">Total</div><div class="stat-num">169</div><div class="stat-foot">scholarships</div></div>',
      category: "SchoLink",
    });

    blockManager.add("scholink-grid", {
      label: "Grid (3 col)",
      content: '<div class="grid grid--3"><div>Item 1</div><div>Item 2</div><div>Item 3</div></div>',
      category: "SchoLink",
    });

    blockManager.add("scholink-section", {
      label: "Page Section",
      content: '<section class="page-hero"><div class="page-hero-inner"><div class="eyebrow">Section</div><h1>Section Title</h1><p class="lede">Section description.</p></div></section>',
      category: "SchoLink",
    });

    blockManager.add("scholink-cta", {
      label: "CTA Button",
      content: '<a class="btn btn--primary" href="#">Click here</a>',
      category: "SchoLink",
    });
  }

  /* Add custom panel buttons: Save, Export, Close */
  function addPanelButtons(editor) {
    var pm = editor.Panels;

    /* Add a new button set */
    pm.addButton("options", [{
      id: "save-html",
      className: "fa fa-save",
      command: "save-html",
      attributes: { title: "Save HTML to file" },
    }, {
      id: "export-html",
      className: "fa fa-download",
      command: "export-html",
      attributes: { title: "Export HTML" },
    }, {
      id: "close-editor",
      className: "fa fa-times",
      command: "close-editor",
      attributes: { title: "Close editor" },
    }]);

    /* Register commands */
    editor.Commands.add("save-html", {
      run: function (editor) {
        var html = editor.getHtml();
        var css = editor.getCss();
        var fullHTML = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<link rel=\"stylesheet\" href=\"assets/css/app.css\">\n<link rel=\"stylesheet\" href=\"assets/css/theme.css\">\n<style>\n" + css + "\n</style>\n</head>\n<body>\n" + html + "\n</body>\n</html>";
        var blob = new Blob([fullHTML], { type: "text/html" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "scholink-edited.html";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        if (global.UI && global.UI.toast) global.UI.toast("HTML saved!");
      },
    });

    editor.Commands.add("export-html", {
      run: function (editor) {
        var html = editor.getHtml();
        var css = editor.getCss();
        var code = "<!-- HTML -->\n" + html + "\n\n<!-- CSS -->\n<style>\n" + css + "\n</style>";
        var blob = new Blob([code], { type: "text/plain" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "scholink-export.txt";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      },
    });

    editor.Commands.add("close-editor", {
      run: function (editor) {
        closeEditor();
      },
    });

    /* Open import/export code viewer */
    editor.Commands.add("open-code", {
      run: function (editor) {
        var html = editor.getHtml();
        var css = editor.getCss();
        var modal = editor.Modal;
        modal.setTitle("Code Preview");
        modal.setContent('<pre style="padding:20px;max-height:60vh;overflow:auto;font-size:12px;background:#1a1a2e;color:#0f0;border-radius:8px;white-space:pre-wrap;word-break:break-all"><code>' + escapeHtml("<!-- HTML -->\n" + html + "\n\n<!-- CSS -->\n" + css) + "</code></pre>");
        modal.open();
      },
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* Exit editor mode */
  function closeEditor() {
    if (!isActive || !editor) return;

    /* Get the edited HTML */
    var newHTML = editor.getHtml();
    var newCSS = editor.getCss();

    /* Destroy the editor */
    editor.destroy();
    editor = null;

    /* Remove the container */
    var container = document.getElementById(EDITOR_CONTAINER_ID);
    if (container) container.remove();

    /* Restore the app */
    var appEl = document.getElementById("app");
    appEl.style.display = "";

    /* Restore hidden elements */
    var backdrop = document.getElementById("backdrop");
    var drawer = document.getElementById("drawer");
    var modal = document.getElementById("modal");
    var toastStack = document.querySelector(".toast-stack");
    var toggleBtn = document.getElementById(TOGGLE_BTN_ID);

    if (backdrop) backdrop.style.display = "";
    if (drawer) drawer.style.display = "";
    if (modal) modal.style.display = "";
    if (toastStack) toastStack.style.display = "";
    if (toggleBtn) toggleBtn.style.display = "";

    /* Apply edited HTML to the app container */
    if (newHTML && newHTML.trim()) {
      appEl.innerHTML = newHTML;
    }

    /* Apply edited CSS if any custom styles were added */
    if (newCSS && newCSS.trim()) {
      var styleEl = document.getElementById("grapesjs-custom-css");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "grapesjs-custom-css";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = newCSS;
    }

    /* Re-run the app render to restore functionality */
    if (global.SchoApp && global.SchoApp.render) {
      try { global.SchoApp.render(); } catch (e) { /* ignore */ }
    }

    isActive = false;

    if (global.UI && global.UI.toast) {
      global.UI.toast("Editor closed. Changes applied.");
    }
  }

  /* Toggle editor */
  function toggle() {
    if (isActive) closeEditor();
    else openEditor();
  }

  /* Auto-init: add the floating button when the page loads */
  function init() {
    /* Only show button on desktop / larger screens */
    function checkSize() {
      var btn = document.getElementById(TOGGLE_BTN_ID);
      if (window.innerWidth >= 768) {
        if (!btn) createToggleButton();
      } else {
        if (btn) btn.remove();
      }
    }
    checkSize();
    window.addEventListener("resize", checkSize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Expose API */
  global.SchoGJS = {
    toggle: toggle,
    open: openEditor,
    close: closeEditor,
    isActive: function () { return isActive; },
  };
})(window);
