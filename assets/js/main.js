/**
 * Site interactivity: language switching, mobile nav, scroll reveal,
 * automatic experience-duration calculation and contact link wiring.
 *
 * Vanilla JS, no build step, no external runtime dependencies.
 */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || {};
  var TRANSLATIONS = window.TRANSLATIONS || {};
  var LANG_STORAGE_KEY = "lucia-portfolio-lang"; // documented in README
  var THEME_STORAGE_KEY = "lucia-portfolio-theme"; // "light" | "dark" — same idea as the language toggle

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* i18n                                                                */
  /* ------------------------------------------------------------------ */

  function resolvePath(obj, path) {
    var parts = path.split(".");
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      if (current == null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  function getLang() {
    var stored = null;
    try {
      stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    } catch (e) {
      /* localStorage may be unavailable (private mode, blocked storage) — default to English */
    }
    if (stored === "en" || stored === "es") return stored;
    return "en";
  }

  function setLang(lang) {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      /* non-fatal: language just won't persist across visits */
    }
    applyTranslations(lang);
    updateLangButtons(lang);
    document.documentElement.setAttribute("lang", lang);
    renderExpertiseIntro(lang);
    renderTimelineMeta(lang);
  }

  function applyTranslations(lang) {
    var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = resolvePath(dict, key);
      if (typeof value === "string") {
        // innerHTML, not textContent: a few strings in i18n.js wrap a
        // phrase in <strong> for emphasis. Safe here because every value
        // comes from our own dictionary, never from a visitor.
        el.innerHTML = value;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr")
        .split(";")
        .forEach(function (pair) {
          var split = pair.split(":");
          var attr = split[0];
          var key = split[1];
          if (!attr || !key) return;
          var value = resolvePath(dict, key.trim());
          if (typeof value === "string") {
            el.setAttribute(attr.trim(), value);
          }
        });
    });

    document.title = resolvePath(dict, "meta.title") || document.title;
  }

  function updateLangButtons(lang) {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Mobile navigation                                                   */
  /* ------------------------------------------------------------------ */

  function initNavToggle() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal (respects prefers-reduced-motion)                     */
  /* ------------------------------------------------------------------ */

  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scrollspy — highlights the nav link for the section in view          */
  /* ------------------------------------------------------------------ */

  function initScrollSpy() {
    var navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
    if (!navLinks.length || !("IntersectionObserver" in window)) return;

    var linksBySectionId = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      if (id) linksBySectionId[id] = link;
    });

    var sections = Object.keys(linksBySectionId)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;

    // Counts a section "active" once it's crossed roughly the upper third
    // of the viewport — feels closer to what you're actually reading than
    // triggering the instant a section's top edge appears at the bottom.
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linksBySectionId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ------------------------------------------------------------------ */
  /* Experience duration                                                 */
  /* ------------------------------------------------------------------ */

  function computeDuration(startDateString) {
    var start = new Date(startDateString);
    if (isNaN(start.getTime())) return null;

    var now = new Date();
    var totalMonths =
      (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    // Started on the 20th and it's only the 5th this month? Not a full month yet.
    if (now.getDate() < start.getDate()) totalMonths -= 1;
    if (totalMonths < 0) totalMonths = 0;

    return {
      years: Math.floor(totalMonths / 12),
      months: totalMonths % 12,
    };
  }

  function pluralKey(base, count) {
    return count === 1 ? base + "_one" : base + "_other";
  }

  // Turns a computeDuration() result into ["1 year", "8 months"] style
  // parts, already translated — kept separate so renderExpertiseIntro
  // doesn't have to know about pluralization rules itself.
  function durationParts(lang, duration) {
    var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    var parts = [];
    if (duration.years > 0) {
      var yearsTemplate = resolvePath(dict, pluralKey("experience.years", duration.years));
      if (yearsTemplate) parts.push(yearsTemplate.replace("{n}", duration.years));
    }
    if (duration.months > 0) {
      var monthsTemplate = resolvePath(dict, pluralKey("experience.months", duration.months));
      if (monthsTemplate) parts.push(monthsTemplate.replace("{n}", duration.months));
    }
    return parts;
  }

  // Prose form ("1 year and 8 months") used inline in a sentence, as
  // opposed to the compact form used in the Experience section counter.
  function renderExpertiseIntro(lang) {
    var el = document.getElementById("expertiseDuration");
    if (!el) return;

    var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    var duration = computeDuration(CONFIG.businessCentralStartDate);

    if (!duration) {
      el.textContent = "";
      return;
    }

    if (duration.years === 0 && duration.months === 0) {
      el.textContent = resolvePath(dict, "experience.lessThanAMonth") || "";
      return;
    }

    var parts = durationParts(lang, duration);
    var conjunction = resolvePath(dict, "experience.conjunction") || "and";
    el.textContent = parts.length === 2 ? parts.join(" " + conjunction + " ") : parts.join(" ");
  }

  function renderTimelineMeta(lang) {
    var dict = TRANSLATIONS[lang || getLang()] || TRANSLATIONS.en;
    var startLabelEl = document.getElementById("timelineStartLabel");
    var companyEl = document.getElementById("timelineCompany");

    var start = new Date(CONFIG.businessCentralStartDate);
    if (startLabelEl && !isNaN(start.getTime())) {
      var since = resolvePath(dict, "journey.items.professional.since") || "{year}";
      startLabelEl.textContent = since.replace("{year}", start.getFullYear());
    }

    if (companyEl && CONFIG.currentCompanyDisplayName) {
      companyEl.textContent = CONFIG.currentCompanyDisplayName;
      companyEl.removeAttribute("data-i18n"); // custom value overrides translation lookup
    }
  }

  /* ------------------------------------------------------------------ */
  /* Theme (light/dark)                                                   */
  /* ------------------------------------------------------------------ */
  // Mirrors the language toggle: an explicit choice wins, otherwise we
  // follow the OS-level prefers-color-scheme. The inline snippet in
  // index.html's <head> does this same check before first paint so
  // there's no flash of the wrong theme — this just keeps it in sync
  // afterwards and handles the toggle button.

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function effectiveTheme() {
    var stored = getStoredTheme();
    if (stored === "light" || stored === "dark") return stored;
    return systemPrefersDark() ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var toggle = document.getElementById("themeToggle");
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  function initThemeToggle() {
    applyTheme(effectiveTheme());

    var toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (e) {
        /* non-fatal: theme just won't persist across visits */
      }
      applyTheme(next);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Contact links — wired from central config, never fabricated         */
  /* ------------------------------------------------------------------ */

  function initContactLinks() {
    var lang = getLang();
    var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    wireLink("contactEmail", CONFIG.professionalEmail, function (value) {
      return "mailto:" + value;
    }, resolvePath(dict, "contact.emailUnavailable"));

    wireLink("contactLinkedIn", CONFIG.linkedInUrl, function (value) {
      return value;
    }, resolvePath(dict, "contact.linkedinUnavailable"));

    wireLink("contactGithub", CONFIG.githubUrl, function (value) {
      return value;
    }, null);

    wireLink("contactCv", CONFIG.cvPdfUrl, function (value) {
      return value;
    }, resolvePath(dict, "contact.cvUnavailable"));
  }

  function wireLink(id, value, hrefBuilder, unavailableText) {
    var el = document.getElementById(id);
    if (!el) return;

    if (value) {
      el.setAttribute("href", hrefBuilder(value));
      el.removeAttribute("aria-disabled");
    } else {
      el.setAttribute("href", "#contact");
      el.setAttribute("aria-disabled", "true");
      el.setAttribute("tabindex", "-1");
      if (unavailableText) {
        el.textContent = unavailableText;
        el.removeAttribute("data-i18n");
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                 */
  /* ------------------------------------------------------------------ */

  document.addEventListener("DOMContentLoaded", function () {
    var footerYear = document.getElementById("footerYear");
    if (footerYear) footerYear.textContent = "© " + new Date().getFullYear();

    var lang = getLang();
    applyTranslations(lang);
    updateLangButtons(lang);
    document.documentElement.setAttribute("lang", lang);

    initNavToggle();
    initScrollReveal();
    initContactLinks();
    initThemeToggle();
    initScrollSpy();
    renderExpertiseIntro(lang);
    renderTimelineMeta(lang);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        setLang(lang);
        initContactLinks(); // re-run so "unavailable" labels match the new language
      });
    });
  });
})();
