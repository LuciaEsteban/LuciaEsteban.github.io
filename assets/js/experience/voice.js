/**
 * Experience layer: "Listen to me".
 *
 * A comic-style speech bubble with a sound icon sits at the top right of
 * the profile photo. Clicking it (or the photo) pops the bubble and plays
 * Lucía's recorded welcome, with captions that appear word by word in
 * time with the voice. While she speaks, the page scrolls to each part
 * she mentions (a guided tour, with gently eased scrolling) and returns
 * to the top at the end; the visitor's own scrolling is paused meanwhile.
 * Captions live at page level, above everything else. The message plays
 * once per visit and can never overlap itself.
 */
(function () {
  "use strict";

  var XP = window.XP, t = XP.t;

  var SPEAKER_SVG =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<path d="M8 19v10h7l9 7V12l-9 7H8z" fill="currentColor"/>' +
    '<path class="w1" d="M29 18.5a8 8 0 010 11" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
    '<path class="w2" d="M33.5 14a14 14 0 010 20" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
    '<path class="w3" d="M38 9.5a20 20 0 010 29" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round"/></svg>';

  /* ------------------------------------------------------------------ */
  /* Captions, synced to the recording                                   */
  /* ------------------------------------------------------------------ */
  function Captions(frame) {
    var box = document.createElement("div");
    box.className = "voice-cc";
    box.innerHTML =
      '<div class="voice-cc-head">' +
      '<span class="voice-cc-icon">' + SPEAKER_SVG + "</span>" +
      '<span class="voice-cc-name"></span>' +
      '<span class="voice-cc-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
      "</div>" +
      '<p class="voice-cc-prev"></p>' +
      '<p class="voice-cc-now"></p>';
    // Lives at page level (not inside the photo) so it stays above everything.
    document.body.appendChild(box);
    var prevEl = box.querySelector(".voice-cc-prev");
    var nowEl = box.querySelector(".voice-cc-now");
    var cues = [], words = [], current = -1, raf = 0;

    /* Split a cue into words, each with the share of the cue's time at
       which it should appear (proportional to its length). */
    function showCue(i) {
      current = i;
      prevEl.textContent = i > 0 ? cues[i - 1][2] : "";
      nowEl.innerHTML = "";
      var parts = cues[i][2].split(" "), total = cues[i][2].length, acc = 0;
      words = parts.map(function (w) {
        var span = document.createElement("span");
        span.textContent = w + " ";
        nowEl.appendChild(span);
        var at = acc / total;
        acc += w.length + 1;
        return { el: span, at: at };
      });
    }

    function sync(audio, tour) {
      var time = audio.currentTime, i = -1;
      tour.update(time);
      for (var k = 0; k < cues.length; k++) if (time >= cues[k][0]) i = k;
      if (i >= 0) {
        if (i !== current) showCue(i);
        var cue = cues[i];
        var progress = (time - cue[0]) / Math.max(cue[1] - cue[0], 0.1);
        // A small lag keeps the words just behind the voice, never ahead of it.
        words.forEach(function (w) { if (w.at <= progress - 0.03) w.el.classList.add("is-said"); });
      }
      raf = requestAnimationFrame(function () { sync(audio, tour); });
    }

    /* Where the captions go, so they never cover any text:
         right of the photo  when there is room (wide screens)
         below the photo     on narrower desktops
         over the photo      when the hero is stacked (tablet / mobile)
       During the guided tour it floats in a screen corner instead. */
    var floating = false;
    function place() {
      if (floating) return;
      var r = frame.getBoundingClientRect();
      var spaceRight = innerWidth - r.right - 24;
      var where = innerWidth <= 900 ? "over" : spaceRight >= 260 ? "right" : "below";
      var pos = {
        right: [r.right + 20, r.top + r.height / 2, Math.min(320, spaceRight - 16)],
        below: [r.left, r.bottom + 18, r.width],
        over: [r.left + 12, r.bottom - 12, r.width - 24]
      }[where];
      box.classList.remove("cc-right", "cc-below", "cc-over");
      box.classList.add("cc-" + where);
      box.style.left = pos[0] + scrollX + "px";
      box.style.top = pos[1] + scrollY + "px";
      box.style.width = pos[2] + "px";
    }
    window.addEventListener("resize", place);

    return {
      open: function () {
        place();
        cues = t("openingCues");
        box.querySelector(".voice-cc-name").textContent = t("speaker") + " · " + t("nowPlaying");
        box.classList.add("is-open");
      },
      follow: function (audio, tour) {
        box.classList.add("is-live");
        sync(audio, tour);
      },
      /* Leave the photo and stay in a corner of the screen (tour). */
      float: function () {
        if (floating) return;
        floating = true;
        box.classList.remove("cc-right", "cc-below", "cc-over");
        box.style.left = box.style.top = box.style.width = "";
        box.classList.add("cc-float");
      },
      close: function (delay) {
        cancelAnimationFrame(raf);
        words.forEach(function (w) { w.el.classList.add("is-said"); });
        box.classList.remove("is-live");
        setTimeout(function () {
          box.classList.add("is-closing");
          setTimeout(function () { box.remove(); }, 600);
        }, delay);
      }
    };
  }

  /* ------------------------------------------------------------------ */
  /* Guided tour: glide to what the voice is talking about               */
  /* ------------------------------------------------------------------ */

  /* Eased scroll (slow start, slow end) that can be retargeted mid-way. */
  var Glide = {
    raf: 0,
    to: function (target, duration) {
      cancelAnimationFrame(this.raf);
      var start = scrollY, dist = target - start, t0 = performance.now(), self = this;
      // "instant" per frame: the page's CSS smooth scrolling would fight the easing.
      function jump(y) { window.scrollTo({ top: y, behavior: "instant" }); }
      if (XP.reduceMotion || Math.abs(dist) < 2) { jump(target); return; }
      (function step(now) {
        var k = Math.min((now - t0) / duration, 1);
        var ease = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // easeInOutCubic
        jump(start + dist * ease);
        if (k < 1) self.raf = requestAnimationFrame(step);
      })(t0);
    }
  };

  function Tour(steps, onFirstStep) {
    var next = 0, locked = true;

    // While the tour runs, the page follows the voice: the visitor's own
    // scrolling (wheel, touch, keys, in-page links) is paused until it ends.
    var SCROLL_KEYS = { ArrowUp: 1, ArrowDown: 1, PageUp: 1, PageDown: 1, Home: 1, End: 1, " ": 1 };
    function block(e) {
      if (!locked) return;
      if (e.type === "keydown" && !SCROLL_KEYS[e.key]) return;
      if (e.type === "click" && !(e.target.closest && e.target.closest('a[href^="#"]'))) return;
      e.preventDefault();
    }
    var LOCK_EVENTS = ["wheel", "touchmove", "keydown", "click"];
    LOCK_EVENTS.forEach(function (ev) { window.addEventListener(ev, block, { passive: false, capture: true }); });

    function unlock() {
      locked = false;
      LOCK_EVENTS.forEach(function (ev) { window.removeEventListener(ev, block, { capture: true }); });
    }

    function targetFor(selector) {
      var el = document.querySelector(selector);
      if (!el) return null;
      var r = el.getBoundingClientRect();
      var header = document.querySelector(".site-header");
      var top = el.tagName === "SECTION"
        ? r.top + scrollY - (header ? header.offsetHeight : 0) - 8 // section: its start
        : r.top + scrollY - Math.max((innerHeight - r.height) / 2, 80); // card: centred
      return Math.max(top, 0);
    }

    function glideTo(top) {
      // Longer trips take a little longer, always gently.
      Glide.to(top, Math.min(1100 + Math.abs(top - scrollY) * 0.35, 2200));
    }

    return {
      update: function (time) {
        while (next < steps.length && time >= steps[next][0]) {
          if (next === 0) onFirstStep();
          var top = targetFor(steps[next][1]);
          if (top !== null) glideTo(top);
          next++;
        }
      },
      finish: function () {
        if (next > 0) Glide.to(0, Math.min(1400 + scrollY * 0.2, 2600)); // back to the top
        unlock();
      }
    };
  }

  /* ------------------------------------------------------------------ */
  /* Speech bubble                                                       */
  /* ------------------------------------------------------------------ */
  XP.Listen = {
    init: function () {
      var frame = document.querySelector(".hero-photo-frame");
      if (!frame) return;
      var used = false;

      var bubble = document.createElement("button");
      bubble.type = "button";
      bubble.className = "speech-bubble";
      bubble.innerHTML =
        '<span class="speech-icon">' + SPEAKER_SVG + "</span>" +
        '<span class="speech-text"></span>' +
        '<span class="speech-ring" aria-hidden="true"></span>' +
        '<span class="speech-lines" aria-hidden="true"><i></i><i></i><i></i></span>';
      frame.appendChild(bubble);
      frame.classList.add("has-listen");

      var captions = Captions(frame);

      function paint() {
        bubble.querySelector(".speech-text").textContent = t("listen");
        bubble.setAttribute("aria-label", t("listenLabel"));
      }

      /* Pop the bubble like the intro one: swell, burst lines, ripple. */
      function popBubble() {
        var r = bubble.getBoundingClientRect();
        var burst = document.createElement("span");
        burst.className = "speech-burst";
        burst.setAttribute("aria-hidden", "true");
        burst.innerHTML = new Array(9).join("<i></i>");
        burst.style.left = bubble.offsetLeft + bubble.offsetWidth / 2 + "px";
        burst.style.top = bubble.offsetTop + bubble.offsetHeight / 2 + "px";
        frame.appendChild(burst);
        setTimeout(function () { burst.remove(); }, 800);
        bubble.classList.add("is-popping");
        setTimeout(function () { bubble.remove(); }, 450);
        XP.Ripple.at(r.left + r.width / 2, r.top + r.height / 2, r.width / 2, "#9dc0f5");
        if (XP.Sound.enabled) { XP.Sound.init(); XP.Sound.pop(0.5); }
      }

      function play(e) {
        e.stopPropagation();
        if (used) return; // once per visit, never on top of itself
        used = true;
        frame.classList.remove("has-listen");
        popBubble();
        captions.open();
        var started = false;
        var tour = Tour(t("openingTour"), function () { captions.float(); });
        setTimeout(function () {
          XP.Voice.play("opening", {
            onStart: function (audio) { started = true; captions.follow(audio, tour); },
            onEnd: function () {
              tour.finish(); // back to the top
              // Leave the last words on screen for a moment; close at once if it never played.
              captions.close(started ? 2500 : 0);
            }
          });
        }, 350);
      }

      bubble.addEventListener("click", play);
      frame.addEventListener("click", play);
      XP.onLanguageChange(paint);
      paint();
    }
  };
})();
