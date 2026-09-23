/**
 * Experience layer: intro screen.
 *
 * A glass bubble emerges from a blurred background (faint Business
 * Central / AL code falls behind it). A welcome text is typed out, the
 * EN/ES switch is pointed out, and popping the bubble (click, Enter or
 * Space) plays a pop + chord, starts the music and reveals the site.
 * Escape enters without any sound.
 */
(function () {
  "use strict";

  var XP = window.XP, t = XP.t;

  /* ------------------------------------------------------------------ */
  /* Falling AL code (barely visible, loops forever)                     */
  /* ------------------------------------------------------------------ */
  var AL_SNIPPETS = [
    "[EventSubscriber(ObjectType::Codeunit, Codeunit::\"Sales-Post\",\n    'OnAfterPostSalesDoc', '', false, false)]\nlocal procedure OnAfterPostSalesDoc(var SalesHeader: Record \"Sales Header\";\n    SalesInvHdrNo: Code[20])\nbegin\n    if SalesInvHdrNo = '' then\n        exit;\n    WebhookMgt.QueueInvoice(SalesInvHdrNo);\nend;",
    "page 50120 \"Customer API\"\n{\n    PageType = API;\n    APIPublisher = 'contoso';\n    APIGroup = 'sales';\n    APIVersion = 'v2.0';\n    EntityName = 'customer';\n    EntitySetName = 'customers';\n    SourceTable = Customer;\n    DelayedInsert = true;\n    ODataKeyFields = SystemId;\n\n    layout\n    {\n        area(Content)\n        {\n            repeater(Records)\n            {\n                field(id; Rec.SystemId) { }\n                field(number; Rec.\"No.\") { }\n                field(displayName; Rec.Name) { }\n                field(balance; Rec.\"Balance (LCY)\") { }\n            }\n        }\n    }\n}",
    "codeunit 50130 \"Webhook Sender\"\n{\n    procedure Send(Payload: JsonObject): Boolean\n    var\n        Client: HttpClient;\n        Content: HttpContent;\n        Headers: HttpHeaders;\n        Response: HttpResponseMessage;\n        Body: Text;\n    begin\n        Payload.WriteTo(Body);\n        Content.WriteFrom(Body);\n        Content.GetHeaders(Headers);\n        Headers.Remove('Content-Type');\n        Headers.Add('Content-Type', 'application/json');\n        Client.Post(GetEndpoint(), Content, Response);\n        exit(Response.IsSuccessStatusCode());\n    end;\n}",
    "[EventSubscriber(ObjectType::Table, Database::Customer,\n    'OnAfterInsertEvent', '', false, false)]\nlocal procedure OnAfterInsertCustomer(var Rec: Record Customer;\n    RunTrigger: Boolean)\nbegin\n    if Rec.IsTemporary() then\n        exit;\n    SyncMgt.EnqueueCustomer(Rec.SystemId);\nend;",
    "tableextension 50140 \"Sales Header Ext\" extends \"Sales Header\"\n{\n    fields\n    {\n        field(50140; \"External Order ID\"; Text[50])\n        {\n            Caption = 'External Order ID';\n            DataClassification = CustomerContent;\n        }\n    }\n}",
    "local procedure BuildPayload(SalesInvHeader: Record \"Sales Invoice Header\")\n    Result: JsonObject\nvar\n    Lines: JsonArray;\n    Line: Record \"Sales Invoice Line\";\nbegin\n    Result.Add('number', SalesInvHeader.\"No.\");\n    Result.Add('customer', SalesInvHeader.\"Sell-to Customer No.\");\n    Result.Add('amount', SalesInvHeader.\"Amount Including VAT\");\n    Line.SetRange(\"Document No.\", SalesInvHeader.\"No.\");\n    if Line.FindSet() then\n        repeat\n            Lines.Add(LineToJson(Line));\n        until Line.Next() = 0;\n    Result.Add('lines', Lines);\nend;",
    "[EventSubscriber(ObjectType::Codeunit, Codeunit::\"Purch.-Post\",\n    'OnBeforePostPurchaseDoc', '', false, false)]\nlocal procedure CheckApproval(var PurchaseHeader: Record \"Purchase Header\")\nbegin\n    if not ApprovalMgt.IsApproved(PurchaseHeader) then\n        Error(NotApprovedErr, PurchaseHeader.\"No.\");\nend;",
    "xmlport 50150 \"Item Export\"\n{\n    Direction = Export;\n    Format = Xml;\n    schema\n    {\n        textelement(Items)\n        {\n            tableelement(Item; Item)\n            {\n                fieldelement(No; Item.\"No.\") { }\n                fieldelement(Description; Item.Description) { }\n                fieldelement(UnitPrice; Item.\"Unit Price\") { }\n            }\n        }\n    }\n}"
  ];

  var AL_KEYWORDS = /\b(procedure|local|var|begin|end|if|then|exit|not|repeat|until|codeunit|page|tableextension|extends|xmlport|field|fields|layout|area|repeater|schema|textelement|tableelement|fieldelement|Record|Code|Text|Boolean|JsonObject|JsonArray|HttpClient|HttpContent|HttpHeaders|HttpResponseMessage|Error)\b/g;

  /* Minimal AL syntax colouring: attributes, strings, then keywords. */
  function highlightAL(src) {
    var esc = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc.split(/('(?:[^'])*'|"(?:[^"])*"|\[EventSubscriber[^\]]*\])/g).map(function (part, i) {
      if (i % 2) return '<span class="' + (part.charAt(0) === "[" ? "c-a" : "c-s") + '">' + part + "</span>";
      return part.replace(AL_KEYWORDS, '<span class="c-k">$1</span>');
    }).join("");
  }

  function addCodeRain(intro) {
    var layer = document.createElement("div");
    layer.className = "intro-code";
    layer.setAttribute("aria-hidden", "true");
    var cols = innerWidth >= 1100 ? 4 : innerWidth >= 700 ? 3 : 2;
    for (var c = 0; c < cols; c++) {
      // Each column starts at a different snippet so they never line up.
      var order = AL_SNIPPETS.map(function (_, i) { return AL_SNIPPETS[(i + c * 3) % AL_SNIPPETS.length]; });
      var block = order.map(highlightAL).join("\n\n\n");
      var col = document.createElement("div");
      col.className = "intro-code-col";
      // Two identical copies stacked: moving by exactly one copy loops seamlessly.
      col.innerHTML = '<pre class="intro-code-track" style="animation-duration:' + (70 + c * 13) +
        "s;animation-delay:-" + c * 17 + 's">' + block + "\n\n\n" + block + "\n\n\n</pre>";
      layer.appendChild(col);
    }
    intro.insertBefore(layer, intro.querySelector(".intro-stage"));
  }

  /* ------------------------------------------------------------------ */
  /* Intro                                                               */
  /* ------------------------------------------------------------------ */
  XP.Intro = {
    init: function (onDone) {
      var intro = document.getElementById("intro");
      if (!intro) { onDone(); return; }

      var bubble = intro.querySelector(".intro-bubble");
      var musicToggle = intro.querySelector("[data-intro-music]");
      var wantMusic = true;
      var entered = false;
      var timers = {};

      addCodeRain(intro);

      /* --- Language switch (top right); drives the site's EN/ES buttons --- */
      var langBox = document.createElement("div");
      langBox.className = "intro-lang";
      langBox.innerHTML =
        '<span class="intro-lang-label" aria-hidden="true">' +
        '<svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" fill="none"/>' +
        '<path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>' +
        "Language · Idioma</span>" +
        '<div class="intro-lang-buttons" role="group" aria-label="Language / Idioma">' +
        '<button type="button" data-lang="en" lang="en">English</button>' +
        '<button type="button" data-lang="es" lang="es">Español</button></div>' +
        '<span class="intro-lang-tip" aria-hidden="true"></span>';
      intro.appendChild(langBox);
      var tip = langBox.querySelector(".intro-lang-tip");

      /* Pulse around the switch + a small tooltip pointing at it. */
      function hintLanguage() {
        if (entered) return;
        tip.textContent = t("langTip");
        tip.classList.add("is-visible");
        clearTimeout(timers.tip);
        timers.tip = setTimeout(function () { tip.classList.remove("is-visible"); }, 5000);
        if (XP.reduceMotion) return;
        langBox.classList.remove("is-hinting");
        void langBox.offsetWidth; // restart the animation
        langBox.classList.add("is-hinting");
      }

      function paintMusicToggle() {
        musicToggle.textContent = wantMusic ? t("musicOn") : t("musicOff");
        musicToggle.setAttribute("aria-pressed", wantMusic ? "true" : "false");
      }

      function localise() {
        intro.querySelectorAll("[data-intro-text]").forEach(function (el) {
          el.textContent = t(el.getAttribute("data-intro-text"));
        });
        bubble.setAttribute("aria-label", t("bubbleLabel"));
        langBox.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-lang") === XP.lang() ? "true" : "false");
        });
        paintMusicToggle();
      }

      langBox.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-lang]");
        if (!b) return;
        langBox.classList.remove("is-hinting");
        tip.classList.remove("is-visible");
        var siteBtn = document.querySelector('.lang-btn[data-lang="' + b.getAttribute("data-lang") + '"]');
        if (siteBtn) siteBtn.click();
        localise();
        typeWelcome();
      });

      /* --- Welcome text, typed out under the bubble --- */
      var welcome = document.createElement("p");
      welcome.className = "intro-welcome";
      welcome.setAttribute("aria-live", "polite");
      intro.querySelector(".intro-stage").insertBefore(welcome, intro.querySelector(".intro-options"));

      function typeWelcome() {
        clearTimeout(timers.type);
        var text = t("welcomeText"), i = 0;
        if (XP.reduceMotion) { welcome.textContent = text; hintLanguage(); return; }
        welcome.classList.add("is-typing");
        (function step() {
          i += 1;
          welcome.textContent = text.slice(0, i);
          if (i < text.length) timers.type = setTimeout(step, text.charAt(i - 1) === "." ? 380 : 32);
          else { welcome.classList.remove("is-typing"); hintLanguage(); }
        })();
      }

      /* --- Tiny bubbles rising in the background --- */
      if (!XP.reduceMotion) {
        timers.fizz = setInterval(function () {
          var f = document.createElement("span");
          var s = 4 + Math.random() * 14;
          f.className = "intro-fizz";
          f.style.width = f.style.height = s + "px";
          f.style.left = Math.random() * 100 + "%";
          f.style.setProperty("--drift", Math.random() * 80 - 40 + "px");
          f.style.animationDuration = 6 + Math.random() * 7 + "s";
          intro.appendChild(f);
          setTimeout(function () { f.remove(); }, 13500);
        }, 380);
      }

      musicToggle.addEventListener("click", function () {
        wantMusic = !wantMusic;
        paintMusicToggle();
      });

      /* --- Pop the bubble and open the site --- */
      function enter(withSound) {
        if (entered) return;
        entered = true;
        clearTimeout(timers.type);
        XP.Sound.enabled = withSound;
        if (withSound) XP.Sound.init();

        var r = bubble.getBoundingClientRect();
        XP.Sound.pop();
        XP.Sound.chime();
        bubble.classList.add("is-popping");
        XP.Ripple.at(r.left + r.width / 2, r.top + r.height / 2, r.width / 2);

        setTimeout(function () {
          intro.classList.add("is-leaving");
          document.documentElement.classList.remove("intro-open");
          if (withSound && wantMusic) setTimeout(function () { XP.Music.start(); }, 500);
        }, 380);
        setTimeout(function () {
          intro.classList.add("is-gone");
          clearInterval(timers.fizz);
          var main = document.getElementById("main");
          if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
          onDone();
        }, 1400);
      }

      bubble.addEventListener("click", function () { enter(true); });
      document.addEventListener("keydown", function onKey(e) {
        if (entered) { document.removeEventListener("keydown", onKey); return; }
        // Let Enter/Space work normally on the other intro buttons.
        var onOtherButton = e.target !== bubble && e.target.tagName === "BUTTON";
        if ((e.key === "Enter" || e.key === " ") && !onOtherButton) { e.preventDefault(); enter(true); }
        if (e.key === "Escape") enter(false);
      });

      localise();
      timers.type = setTimeout(typeWelcome, 2500);
      setTimeout(function () { bubble.focus({ preventScroll: true }); }, 400);
    }
  };
})();
