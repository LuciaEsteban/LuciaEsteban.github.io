/**
 * Experience layer: floating controls (bottom right).
 *
 *   Music player      play/pause, volume and a live equalizer
 *   Animation switch  turns the seasonal background on or off
 *
 * Both appear once the intro has been closed (XP.Controls.show()).
 */
(function () {
  "use strict";

  var XP = window.XP, t = XP.t;

  var ICONS = {
    play: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
    pause: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>',
    winter: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    spring: '<path d="M12 12c0-4 2-7 5-7 0 3-2 7-5 7zm0 0c0-4-2-7-5-7 0 3 2 7 5 7zm0 0c3 0 6 2 6 5-3 0-6-2-6-5zm0 0c-3 0-6 2-6 5 3 0 6-2 6-5z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
    summer: '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    autumn: '<path d="M5 19C5 10 11 5 19 5c0 8-5 14-14 14zm0 0l8-8" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  /* ------------------------------------------------------------------ */
  /* Music player                                                        */
  /* ------------------------------------------------------------------ */
  var Player = {
    init: function () {
      var el = (this.el = document.createElement("div"));
      el.className = "music-dock";
      el.innerHTML =
        '<button type="button" class="music-btn"></button>' +
        '<div class="music-eq" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>' +
        '<span class="music-label"></span>' +
        '<input class="music-vol" type="range" min="0" max="1" step="0.01" />';
      document.body.appendChild(el);
      this.btn = el.querySelector(".music-btn");
      this.bars = el.querySelectorAll(".music-eq span");
      this.label = el.querySelector(".music-label");
      this.vol = el.querySelector(".music-vol");
      this.vol.value = XP.Music.volume;

      var self = this;
      this.btn.addEventListener("click", function () {
        XP.Sound.enabled = true;
        if (XP.Music.playing) XP.Music.stop(); else XP.Music.start();
      });
      this.vol.addEventListener("input", function () { XP.Music.setVolume(parseFloat(self.vol.value)); });
      XP.Music.onChange(function () { self.paint(); });
      XP.onLanguageChange(function () { self.paint(); });
      this.paint();
      this.animate();
    },

    paint: function () {
      var on = XP.Music.playing;
      this.btn.innerHTML = on ? ICONS.pause : ICONS.play;
      this.btn.setAttribute("aria-label", on ? t("pause") : t("play"));
      this.btn.setAttribute("aria-pressed", on ? "true" : "false");
      this.label.textContent = (on ? t("musicOn") : t("musicOff")).replace("♪ ", "");
      this.vol.setAttribute("aria-label", t("volume"));
    },

    /* Equalizer bars follow the music (about 16 updates a second). */
    animate: function () {
      var self = this, data = new Uint8Array(32);
      setInterval(function () {
        var analyser = XP.Sound.analyser, live = analyser && XP.Music.playing;
        if (live) analyser.getByteFrequencyData(data);
        for (var i = 0; i < self.bars.length; i++) {
          self.bars[i].style.height = live ? (4 + (data[1 + i * 3] / 255) * 14).toFixed(1) + "px" : "4px";
        }
      }, 60);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Seasonal animation switch                                           */
  /* ------------------------------------------------------------------ */
  var SeasonSwitch = {
    init: function () {
      var seasons = XP.Seasons;
      if (!seasons.canvas) return; // reduced motion: no animation, no switch
      var btn = (this.btn = document.createElement("button"));
      btn.type = "button";
      btn.className = "season-toggle";
      btn.innerHTML =
        '<span class="season-toggle-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24">' +
        ICONS[seasons.season] + '</svg></span><span class="season-toggle-label"></span>';
      document.body.appendChild(btn);

      var self = this;
      btn.addEventListener("click", function () {
        seasons.setEnabled(!seasons.enabled);
        self.paint();
      });
      XP.onLanguageChange(function () { self.paint(); });
      this.paint();
    },

    paint: function () {
      var on = XP.Seasons.enabled;
      this.btn.querySelector(".season-toggle-label").textContent = on ? t("animOn") : t("animOff");
      this.btn.setAttribute("aria-label", on ? t("animLabelOn") : t("animLabelOff"));
      this.btn.setAttribute("aria-pressed", on ? "true" : "false");
      this.btn.classList.toggle("is-off", !on);
    }
  };

  XP.Controls = {
    init: function () {
      Player.init();
      SeasonSwitch.init();
    },
    show: function () {
      Player.el.classList.add("is-visible");
      if (SeasonSwitch.btn) SeasonSwitch.btn.classList.add("is-visible");
    }
  };
})();
