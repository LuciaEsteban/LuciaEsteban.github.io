/**
 * Experience layer: visuals.
 *
 *   XP.Ripple   a soft expanding ring (used when a bubble pops)
 *   XP.Seasons  a few slow, subtle particles that follow the time of year
 *               (northern hemisphere): snow Dec–Feb, petals Mar–May,
 *               warm motes Jun–Aug, falling leaves Sep–Nov.
 *               Preview one with ?season=winter|spring|summer|autumn.
 */
(function () {
  "use strict";

  var XP = window.XP;

  /* Full-screen canvas helper: sized to the viewport, never clickable. */
  function makeCanvas(className) {
    var cv = document.createElement("canvas");
    cv.className = className;
    cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv);
    return cv;
  }

  /* ------------------------------------------------------------------ */
  /* Ripple                                                              */
  /* ------------------------------------------------------------------ */
  XP.Ripple = {
    rings: [],
    running: false,

    init: function () {
      this.canvas = makeCanvas("fx-canvas");
      this.c = this.canvas.getContext("2d");
      this.resize();
      var self = this;
      window.addEventListener("resize", function () { self.resize(); });
    },

    resize: function () {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = innerWidth * this.dpr;
      this.canvas.height = innerHeight * this.dpr;
    },

    /* x, y in viewport pixels; radius = size of the thing that popped. */
    at: function (x, y, radius, color) {
      if (!this.canvas) return;
      this.rings.push({ x: x, y: y, r0: radius * 0.6, born: performance.now(), color: color || "#cfe0ff" });
      if (this.running) return;
      this.running = true;
      var self = this;
      requestAnimationFrame(function loop() {
        self.draw();
        if (self.rings.length) requestAnimationFrame(loop);
        else self.running = false;
      });
    },

    draw: function () {
      var c = this.c, now = performance.now();
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = this.rings.length - 1; i >= 0; i--) {
        var p = this.rings[i];
        var k = Math.min((now - p.born) / 700, 1); // time-based: always ~0.7 s
        if (k >= 1) { this.rings.splice(i, 1); continue; }
        var life = 1 - k;
        c.globalAlpha = life * 0.8;
        c.strokeStyle = p.color;
        c.lineWidth = 3 * life;
        c.beginPath();
        c.arc(p.x, p.y, p.r0 + 150 * (1 - Math.pow(1 - k, 3)), 0, Math.PI * 2);
        c.stroke();
      }
      c.globalAlpha = 1;
    }
  };

  /* ------------------------------------------------------------------ */
  /* Seasons                                                             */
  /* ------------------------------------------------------------------ */
  XP.Seasons = {
    enabled: true,
    STORAGE_KEY: "lucia-portfolio-season-fx",

    palettes: {
      winter: { light: ["#9fb7d6", "#b7c9e2", "#c9d6ea"], dark: ["#ffffff", "#dbe6f7", "#c3d4ee"] },
      spring: { light: ["#f2b8c6", "#f7cdd8", "#e9a9bb"], dark: ["#f7c6d3", "#f2b0c2", "#fbdbe4"] },
      summer: { light: ["#e8b94f", "#f0c96d", "#dca544"], dark: ["#f5d06b", "#ffe29a", "#f0bd52"] },
      autumn: { light: ["#c8793a", "#b5652e", "#d49a4a", "#a8552b"], dark: ["#d98e4a", "#c9733a", "#e0aa5c", "#b8653a"] }
    },

    current: function () {
      var q = /[?&]season=(winter|spring|summer|autumn)/.exec(location.search);
      if (q) return q[1];
      var m = new Date().getMonth(); // 0 = January
      if (m === 11 || m <= 1) return "winter";
      if (m <= 4) return "spring";
      if (m <= 7) return "summer";
      return "autumn";
    },

    init: function () {
      if (XP.reduceMotion) return;
      this.season = this.current();
      this.canvas = makeCanvas("season-canvas");
      this.c = this.canvas.getContext("2d");
      this.parts = [];
      this.resize();
      this.last = performance.now();
      try { if (localStorage.getItem(this.STORAGE_KEY) === "off") this.setEnabled(false, true); } catch (e) { /* storage blocked */ }

      var self = this;
      window.addEventListener("resize", function () { self.resize(); });
      requestAnimationFrame(function loop(now) {
        if (!document.hidden && self.enabled) self.frame(now);
        requestAnimationFrame(loop);
      });
    },

    /* fromStorage: true when restoring the saved choice at start-up. */
    setEnabled: function (on, fromStorage) {
      this.enabled = on;
      if (!this.canvas) return;
      this.canvas.style.display = on ? "" : "none";
      this.last = performance.now();
      if (!fromStorage) {
        try { localStorage.setItem(this.STORAGE_KEY, on ? "on" : "off"); } catch (e) { /* storage blocked */ }
      }
    },

    resize: function () {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = innerWidth;
      this.h = innerHeight;
      this.canvas.width = this.w * this.dpr;
      this.canvas.height = this.h * this.dpr;
      // Sparse on purpose: about one particle per 105 px of width.
      var count = Math.max(7, Math.min(17, Math.round(this.w / 105)));
      while (this.parts.length < count) this.parts.push(this.spawn(true));
      this.parts.length = count;
    },

    spawn: function (anywhere) {
      var s = this.season, r = Math.random;
      var p = {
        x: r() * this.w,
        y: anywhere ? r() * this.h : (s === "summer" ? this.h + 10 : -20),
        phase: r() * Math.PI * 2,
        colorIdx: Math.floor(r() * 4),
        rot: r() * Math.PI * 2,
        vrot: (r() - 0.5) * 0.02
      };
      var cfg = {
        winter: [1.2, 2.4, 0.25, 0.45, 0.3, 0.4, 0.35, 0.35],
        spring: [3, 3, 0.3, 0.35, 0.6, 0.6, 0.35, 0.25],
        summer: [1.2, 1.8, -0.12, -0.2, 0.25, 0.3, 0.3, 0.35],
        autumn: [5, 5, 0.35, 0.4, 0.7, 0.7, 0.3, 0.25]
      }[s]; // size, size+, speed, speed+, sway, sway+, alpha, alpha+
      p.size = cfg[0] + r() * cfg[1];
      p.vy = cfg[2] + r() * cfg[3];
      p.sway = cfg[4] + r() * cfg[5];
      p.alpha = cfg[6] + r() * cfg[7];
      return p;
    },

    frame: function (now) {
      var dt = Math.min((now - this.last) / 16.67, 3);
      this.last = now;
      var c = this.c, s = this.season;
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      var pal = this.palettes[s][dark ? "dark" : "light"];
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, this.w, this.h);
      for (var i = 0; i < this.parts.length; i++) {
        var p = this.parts[i];
        p.phase += 0.012 * dt;
        p.y += p.vy * dt;
        p.x += Math.sin(p.phase) * p.sway * 0.5 * dt;
        p.rot += p.vrot * dt + (s === "autumn" ? Math.sin(p.phase) * 0.01 * dt : 0);
        if (p.y > this.h + 30 || p.y < -30 || p.x < -40 || p.x > this.w + 40) {
          this.parts[i] = this.spawn(false);
          continue;
        }
        var alpha = p.alpha * 0.8;
        if (s === "summer") alpha *= 0.65 + 0.35 * Math.sin(p.phase * 2.3); // gentle twinkle
        c.globalAlpha = alpha;
        c.fillStyle = pal[p.colorIdx % pal.length];
        this.draw(c, p, s);
      }
      c.globalAlpha = 1;
    },

    draw: function (c, p, s) {
      if (s === "winter" || s === "summer") {
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        c.fill();
        if (s === "summer") { // soft glow
          c.globalAlpha *= 0.25;
          c.beginPath();
          c.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          c.fill();
        }
        return;
      }
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      if (s === "spring") {
        // Petal: a soft teardrop that turns as it falls
        c.scale(1, 0.62 + 0.25 * Math.sin(p.phase * 1.7));
        c.beginPath();
        c.moveTo(0, -p.size);
        c.bezierCurveTo(p.size, -p.size * 0.6, p.size * 0.7, p.size, 0, p.size);
        c.bezierCurveTo(-p.size * 0.7, p.size, -p.size, -p.size * 0.6, 0, -p.size);
        c.fill();
      } else {
        // Leaf: pointed oval with a vein, flipping as it falls
        var L = p.size;
        c.scale(0.55 + 0.45 * Math.abs(Math.sin(p.phase * 0.8)), 1);
        c.beginPath();
        c.moveTo(0, -L);
        c.quadraticCurveTo(L * 0.75, -L * 0.2, 0, L);
        c.quadraticCurveTo(-L * 0.75, -L * 0.2, 0, -L);
        c.fill();
        c.globalAlpha *= 0.6;
        c.strokeStyle = "rgba(0,0,0,0.25)";
        c.lineWidth = 0.7;
        c.beginPath();
        c.moveTo(0, -L * 0.8);
        c.lineTo(0, L * 1.25);
        c.stroke();
      }
      c.restore();
    }
  };
})();
