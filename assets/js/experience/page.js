/**
 * Experience layer: page interactions and start-up.
 *
 *   - "Beyond the code" photo strums a guitar chord
 *   - 3D tilt on the expertise cards, hero colour orbs follow the mouse
 *   - music pauses while the tab is hidden
 *   - contact form (sends through SITE_CONFIG.contactFormEndpoint, or
 *     opens the visitor's email app) and its polite "nudge"
 */
(function () {
  "use strict";

  var XP = window.XP;

  /* ------------------------------------------------------------------ */
  /* Small interactions                                                  */
  /* ------------------------------------------------------------------ */
  function initInteractions() {
    // "Beyond the code" photo: strum a chord, with a soft ripple.
    var beyond = document.querySelector(".beyond-photo");
    if (beyond) {
      beyond.style.cursor = "pointer";
      beyond.addEventListener("click", function () {
        var r = beyond.getBoundingClientRect();
        XP.Ripple.at(r.left + r.width / 2, r.top + r.height / 2, Math.min(r.width, r.height) / 2);
        XP.Sound.strum();
      });
    }

    if (XP.finePointer && !XP.reduceMotion) {
      // 3D tilt on the expertise cards, with a light that follows the cursor.
      document.querySelectorAll(".expertise-card").forEach(function (card) {
        card.classList.add("tilt");
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          card.style.setProperty("--ry", ((px - 0.5) * 10).toFixed(2) + "deg");
          card.style.setProperty("--rx", ((0.5 - py) * 10).toFixed(2) + "deg");
          card.style.setProperty("--lift", "-4px");
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        });
        card.addEventListener("pointerleave", function () {
          card.style.setProperty("--rx", "0deg");
          card.style.setProperty("--ry", "0deg");
          card.style.setProperty("--lift", "0");
        });
      });

      // Hero colour orbs drift a little towards the mouse.
      var field = document.querySelector(".bubble-field-hero");
      if (field) {
        field.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
        document.addEventListener("pointermove", function (e) {
          var dx = (e.clientX / innerWidth - 0.5) * 40, dy = (e.clientY / innerHeight - 0.5) * 40;
          field.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
        }, { passive: true });
      }
    }

    // Pause the music while the tab is hidden, resume when back.
    var pausedByHide = false;
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && XP.Music.playing) { pausedByHide = true; XP.Music.stop(); }
      else if (!document.hidden && pausedByHide) { pausedByHide = false; XP.Music.start(); }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Contact form                                                        */
  /* ------------------------------------------------------------------ */
  function formText(key) {
    var all = window.TRANSLATIONS || {};
    var dict = all[XP.lang()] || all.en || {};
    return ((dict.contact || {}).form || {})[key] || "";
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var status = document.getElementById("contactFormStatus");
    var button = form.querySelector(".contact-submit");
    var config = window.SITE_CONFIG || {};

    function say(key, kind) {
      status.textContent = formText(key);
      status.className = "form-status" + (kind ? " is-" + kind : "");
    }

    function sendToEndpoint(data) {
      button.disabled = true;
      say("sending");
      fetch(config.contactFormEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email, // becomes the Reply-To address
          company: data.company || "-",
          message: data.message,
          _subject: formText("subject") + ": " + data.name,
          _template: "table",
          _captcha: "false"
        })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (json) {
          if (!r.ok || String(json.success) !== "true") throw new Error(json.message || r.status);
        });
      }).then(function () {
        form.reset();
        say("success", "ok");
      }).catch(function () {
        say("error", "error");
      }).then(function () {
        button.disabled = false;
      });
    }

    function openEmailApp(data) {
      var body = data.message + "\n\n" + data.name + (data.company ? " (" + data.company + ")" : "") + "\n" + data.email;
      window.location.href = "mailto:" + config.professionalEmail +
        "?subject=" + encodeURIComponent(formText("subject") + ": " + data.name) +
        "&body=" + encodeURIComponent(body);
      say("mailto", "ok");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f._gotcha.value) return; // honeypot: filled in by bots only
      var data = {
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        company: f.company.value.trim(),
        message: f.message.value.trim()
      };
      if (!data.name || !data.email || !data.message) { say("missing", "error"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { say("invalidEmail", "error"); f.email.focus(); return; }
      if (config.contactFormEndpoint) sendToEndpoint(data);
      else if (config.professionalEmail) openEmailApp(data);
      else say("error", "error");
    });

    // Once the visitor starts typing, the invitation animation stops.
    form.addEventListener("focusin", function () { form.classList.add("is-engaged"); });

    // At the end of the page: one short nudge, then a gentle float.
    if (XP.reduceMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      setTimeout(function () {
        form.classList.add("is-nudging");
        setTimeout(function () {
          form.classList.remove("is-nudging");
          form.classList.add("is-calling");
        }, 900);
      }, 900);
    }, { threshold: 0.55 });
    io.observe(form);
  }

  /* ------------------------------------------------------------------ */
  /* Start-up                                                            */
  /* ------------------------------------------------------------------ */
  function boot() {
    XP.Seasons.init();
    XP.Ripple.init();
    XP.Controls.init();
    XP.Listen.init();
    initInteractions();
    initContactForm();
    XP.Intro.init(function () { XP.Controls.show(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
