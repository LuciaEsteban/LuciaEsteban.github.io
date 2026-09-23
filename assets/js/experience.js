/**
 * Experience layer — intro bubble with falling AL code, sound effects
 * and a generative background soundtrack.
 *
 * All audio is synthesised live with the Web Audio API: there are no
 * audio files, so there is nothing to license and nothing extra to
 * download. The music is a small generative engine — piano arpeggios
 * over a soft string pad and bass, in D major — that never plays
 * exactly the same way twice.
 *
 * Browsers only allow sound after a user gesture, which is exactly
 * what the intro bubble provides: the click that pops it also unlocks
 * the audio.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && matchMedia("(pointer: fine)").matches;

  /* ------------------------------------------------------------------ */
  /* Copy                                                                */
  /* ------------------------------------------------------------------ */
  var TEXT = {
    en: {
      eyebrow: "Portfolio",
      role: "Microsoft Dynamics 365 Business Central / AL Developer",
      cta: "Tap the bubble to enter",
      musicOn: "♪ Music: on",
      musicOff: "♪ Music: off",
      hint: "Or press Enter to continue",
      dockLabel: "Music",
      play: "Play background music",
      pause: "Pause background music",
      volume: "Music volume",
      bubbleLabel: "Enter the portfolio",
      langTip: "You can change the language here",
      listen: "Listen to my welcome",
      listening: "Playing…",
      listenLabel: "Play a short spoken welcome message (about 20 seconds)",
      animOn: "Animation: on",
      animOff: "Animation: off",
      animLabelOn: "Turn off the seasonal background animation",
      animLabelOff: "Turn on the seasonal background animation",
      welcomeText: "Welcome to my portfolio. If you would like to get to know me a little better, tap the bubble on the screen. You can also change the language in the top right corner.",
      openingVO: "Hello, and welcome to my portfolio. I'm Lucía Esteban, a Business Central developer. Here you'll discover what I work on, how I approach each project, my background, and a little about who I am beyond the code. Thank you for stopping by. If you think I could be a good fit for your team, I'd be glad to talk."
    },
    es: {
      eyebrow: "Portfolio",
      role: "Desarrolladora Microsoft Dynamics 365 Business Central / AL",
      cta: "Toca la burbuja para entrar",
      musicOn: "♪ Música: on",
      musicOff: "♪ Música: off",
      hint: "O pulsa Enter para continuar",
      dockLabel: "Música",
      play: "Reproducir música de fondo",
      pause: "Pausar música de fondo",
      volume: "Volumen de la música",
      bubbleLabel: "Entrar al portfolio",
      langTip: "Puedes cambiar el idioma aquí",
      listen: "Escucha mi bienvenida",
      listening: "Reproduciendo…",
      listenLabel: "Reproducir un breve mensaje de bienvenida (unos 20 segundos)",
      animOn: "Animación: on",
      animOff: "Animación: off",
      animLabelOn: "Desactivar la animación de fondo de temporada",
      animLabelOff: "Activar la animación de fondo de temporada",
      welcomeText: "Bienvenidos a mi portfolio. Si quieres conocerme un poco más, toca la burbuja que aparece en pantalla. También puedes cambiar el idioma en la esquina superior derecha.",
      openingVO: "Hola, y bienvenidos a mi portfolio. Soy Lucía Esteban, desarrolladora de Business Central. Aquí descubrirás en qué trabajo, cómo abordo cada proyecto, mi formación y también un poco de quién soy fuera del código. Gracias por tu visita. Si crees que puedo encajar en tu equipo, estaré encantada de hablar contigo."
    }
  };
  function lang() {
    var l = document.documentElement.getAttribute("lang");
    try { l = localStorage.getItem("lucia-portfolio-lang") || l; } catch (e) {}
    return l === "es" ? "es" : "en";
  }
  function t(key) { return (TEXT[lang()] || TEXT.en)[key]; }

  /* ------------------------------------------------------------------ */
  /* Audio engine                                                        */
  /* ------------------------------------------------------------------ */
  var Audio = {
    ctx: null,
    enabled: false,   // sfx allowed (visitor didn't choose "silent")
    master: null, sfxBus: null, musicBus: null, musicGain: null, reverb: null, analyser: null,

    init: function () {
      if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return true; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      var ctx = this.ctx = new AC();

      this.master = ctx.createGain();
      this.master.gain.value = 0.9;
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 3;
      this.master.connect(comp); comp.connect(ctx.destination);

      this.reverb = ctx.createConvolver();
      this.reverb.buffer = this.impulse(2.8, 2.2);
      var revGain = ctx.createGain(); revGain.gain.value = 0.35;
      this.reverb.connect(revGain); revGain.connect(this.master);

      this.sfxBus = ctx.createGain(); this.sfxBus.gain.value = 0.6;
      this.sfxBus.connect(this.master); this.sfxBus.connect(this.reverb);

      // Music: everything through a warm low-pass, then a fader.
      this.musicBus = ctx.createGain();
      var warm = ctx.createBiquadFilter();
      warm.type = "lowpass"; warm.frequency.value = 2400; warm.Q.value = 0.5;
      this.musicGain = ctx.createGain(); this.musicGain.gain.value = 0;
      this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 64;
      this.musicBus.connect(warm); warm.connect(this.musicGain);
      this.musicGain.connect(this.master); this.musicGain.connect(this.analyser);
      // The music has its own reverb, placed before the fader, so that
      // switching the music off silences its echo tail at once too.
      var musicVerb = ctx.createConvolver(); musicVerb.buffer = this.impulse(2.4, 2.4);
      var musicSend = ctx.createGain(); musicSend.gain.value = 0.3;
      warm.connect(musicSend); musicSend.connect(musicVerb); musicVerb.connect(this.musicGain);
      this.warm = warm;
      return true;
    },

    impulse: function (seconds, decay) {
      var rate = this.ctx.sampleRate, len = rate * seconds;
      var buf = this.ctx.createBuffer(2, len, rate);
      for (var c = 0; c < 2; c++) {
        var d = buf.getChannelData(c);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
      return buf;
    },

    noiseBuffer: function (seconds) {
      if (this._noise) return this._noise;
      var len = this.ctx.sampleRate * (seconds || 1);
      var buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return (this._noise = buf);
    },

    /* A soft "bell / electric piano" voice */
    tone: function (freq, when, dur, vol, dest, type) {
      var ctx = this.ctx;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol, when + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      g.connect(dest || this.sfxBus);
      var o1 = ctx.createOscillator(); o1.type = type || "sine"; o1.frequency.value = freq;
      var o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2.001;
      var g2 = ctx.createGain(); g2.gain.value = 0.18;
      o1.connect(g); o2.connect(g2); g2.connect(g);
      o1.start(when); o2.start(when);
      o1.stop(when + dur + 0.05); o2.stop(when + dur + 0.05);
    },

    /* Plucked-string-ish voice (a nod to the guitar) */
    pluck: function (freq, when, vol) {
      var ctx = this.ctx;
      var o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = freq;
      var f = ctx.createBiquadFilter(); f.type = "lowpass";
      f.frequency.setValueAtTime(freq * 8, when);
      f.frequency.exponentialRampToValueAtTime(freq * 1.2, when + 0.4);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol, when + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 1.2);
      o.connect(f); f.connect(g); g.connect(this.sfxBus);
      o.start(when); o.stop(when + 1.3);
    },

    /* Bubble pop: quick pitch drop + a tiny burst of air */
    pop: function () {
      if (!this.enabled || !this.ctx) return;
      var ctx = this.ctx, now = ctx.currentTime;
      var o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(1200, now);
      o.frequency.exponentialRampToValueAtTime(180, now + 0.09);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.45, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.connect(g); g.connect(this.sfxBus); o.start(now); o.stop(now + 0.15);

      var n = ctx.createBufferSource(); n.buffer = this.noiseBuffer();
      var bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2500; bp.Q.value = 1.2;
      var ng = ctx.createGain();
      ng.gain.setValueAtTime(0.3, now);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      n.connect(bp); bp.connect(ng); ng.connect(this.sfxBus); n.start(now); n.stop(now + 0.1);
    },

    /* A soft felt-piano voice: a few partials with their own decays,
       through a closing low-pass so notes bloom and then mellow. */
    piano: function (freq, when, vol, dest, dur) {
      var ctx = this.ctx;
      dur = dur || 2.6;
      var out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, when);
      out.gain.exponentialRampToValueAtTime(vol, when + 0.006);
      out.gain.exponentialRampToValueAtTime(vol * 0.35, when + 0.35);
      out.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      var lp = ctx.createBiquadFilter(); lp.type = "lowpass";
      lp.frequency.setValueAtTime(Math.min(freq * 7, 12000), when);
      lp.frequency.exponentialRampToValueAtTime(Math.max(freq * 2.2, 300), when + 1.2);
      lp.connect(out); out.connect(dest || this.sfxBus);
      var partials = [[1, "triangle", 1, dur], [2, "sine", 0.22, 0.7], [3.01, "sine", 0.07, 0.35]];
      partials.forEach(function (p) {
        var o = ctx.createOscillator(); o.type = p[1]; o.frequency.value = freq * p[0];
        var g = ctx.createGain();
        g.gain.setValueAtTime(p[2], when);
        g.gain.exponentialRampToValueAtTime(0.0001, when + p[3]);
        o.connect(g); g.connect(lp);
        o.start(when); o.stop(when + dur + 0.05);
      });
    },

    /* Warm string-like pad: detuned saws, slow swell, dark filter */
    pad: function (freqs, when, dur, vol, dest) {
      var ctx = this.ctx;
      var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 850; lp.Q.value = 0.6;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(vol, when + 2.2);
      g.gain.setValueAtTime(vol, when + dur - 1.4);
      g.gain.linearRampToValueAtTime(0.0001, when + dur);
      lp.connect(g); g.connect(dest);
      freqs.forEach(function (f) {
        [-7, 7].forEach(function (cents) {
          var o = ctx.createOscillator(); o.type = "sawtooth";
          o.frequency.value = f; o.detune.value = cents;
          o.connect(lp); o.start(when); o.stop(when + dur + 0.05);
        });
      });
    },

    /* Welcome chord when the bubble is popped: an open D major 9, rolled */
    chime: function () {
      if (!this.enabled || !this.ctx) return;
      var now = this.ctx.currentTime + 0.04;
      var notes = [50, 57, 62, 66, 69, 76];
      for (var i = 0; i < notes.length; i++) this.piano(hz(notes[i]), now + i * 0.05, i ? 0.13 : 0.18, null, 3.5);
    },

    /* Guitar Easter egg (photo / guitar image) */
    strum: function () {
      if (!this.enabled || !this.ctx) return;
      var now = this.ctx.currentTime;
      var chord = Music.currentChord();
      var voicing = [chord[0] / 2].concat(chord, [chord[1] * 2]);
      for (var i = 0; i < voicing.length; i++) this.pluck(voicing[i], now + i * 0.028, 0.2);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Background music — calm, cinematic piano + strings                  */
  /* ------------------------------------------------------------------ */
  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  var Music = {
    playing: false,
    bpm: 68,
    step: 0,          // 8th-note counter; each chord lasts 2 bars (16 eighths)
    nextTime: 0,
    timer: null,
    volume: 0.55,
    // D major, elegant and unhurried:  Dmaj9 → Bm11 → Gmaj7 → A7sus4
    progression: [
      { bass: 38, pad: [57, 61, 64, 66], arp: [62, 66, 69, 73, 76] },
      { bass: 35, pad: [57, 62, 64, 66], arp: [59, 62, 66, 69, 73] },
      { bass: 31, pad: [54, 59, 62, 66], arp: [55, 59, 62, 66, 69] },
      { bass: 33, pad: [55, 59, 62, 64], arp: [57, 62, 64, 67, 71] }
    ],
    patterns: [[0, 1, 2, 4, 3, 2, 1, 2], [0, 2, 4, 3, 1, 3, 2, 4]],

    chordAt: function (step) { return this.progression[Math.floor(step / 16) % 4]; },
    currentChord: function () { return this.chordAt(this.step).arp.slice(0, 4).map(hz); },

    start: function () {
      if (!Audio.init()) return;
      var ctx = Audio.ctx;
      this.playing = true;
      this.step = 0;
      this.nextTime = ctx.currentTime + 0.15;
      var self = this;
      clearInterval(this.timer);
      this.timer = setInterval(function () { self.schedule(); }, 25);
      var g = Audio.musicGain.gain;
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(g.value, ctx.currentTime);
      g.linearRampToValueAtTime(this.volume, ctx.currentTime + 3);
      Dock.update();
    },

    stop: function () {
      if (!Audio.ctx) return;
      var ctx = Audio.ctx, self = this;
      this.playing = false;
      var g = Audio.musicGain.gain;
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(g.value, ctx.currentTime);
      g.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      clearInterval(this.timer);
      // Cut off every note that was already scheduled: they were all wired
      // into the old bus, so detaching it silences them for good.
      setTimeout(function () {
        if (self.playing) return;
        try { Audio.musicBus.disconnect(); } catch (e) {}
        Audio.musicBus = ctx.createGain();
        Audio.musicBus.connect(Audio.warm);
      }, 300);
      Dock.update();
    },

    setVolume: function (v) {
      this.volume = v;
      if (this.playing && Audio.ctx) Audio.musicGain.gain.setTargetAtTime(v, Audio.ctx.currentTime, 0.1);
    },

    schedule: function () {
      var ctx = Audio.ctx;
      var eighth = 60 / this.bpm / 2;
      while (this.nextTime < ctx.currentTime + 0.25) {
        this.playStep(this.step, this.nextTime, eighth);
        this.nextTime += eighth;
        this.step++;
      }
    },

    playStep: function (step, when, eighth) {
      var s = step % 16, cycle = Math.floor(step / 64);
      var ch = this.chordAt(step), dest = Audio.musicBus;

      if (s === 0) {
        Audio.pad(ch.pad.map(hz), when, 16 * eighth + 1.4, 0.022, dest);
        this.bass(hz(ch.bass), when, 16 * eighth + 0.5);
      }

      // Piano arpeggio: quarter notes on the first pass, flowing eighths after.
      if (cycle > 0 || s % 2 === 0) {
        var pat = this.patterns[cycle % 2];
        var vel = (s % 4 === 0 ? 0.075 : 0.05) * (0.9 + Math.random() * 0.2);
        Audio.piano(hz(ch.arp[pat[s % 8]]), when, vel, dest, 2.4);
      }

      // A sparse, singing top line from the second pass on.
      if (cycle > 0 && (s === 0 || (s === 12 && Math.random() < 0.5))) {
        var top = ch.arp[s === 0 ? 4 : 3] + 12;
        Audio.piano(hz(top), when + 0.012, 0.06, dest, 4);
      }

      // Very soft pulse from the third pass on, to give it some momentum.
      if (cycle > 1 && s % 4 === 0) this.kick(when, s % 8 === 0 ? 0.16 : 0.09);
    },

    bass: function (f, when, dur) {
      var ctx = Audio.ctx;
      var o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(0.2, when + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(g); g.connect(Audio.musicBus); o.start(when); o.stop(when + dur + 0.05);
    },
    kick: function (when, vol) {
      var ctx = Audio.ctx;
      var o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(95, when);
      o.frequency.exponentialRampToValueAtTime(40, when + 0.14);
      var g = ctx.createGain();
      g.gain.setValueAtTime(vol, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.4);
      o.connect(g); g.connect(Audio.musicBus); o.start(when); o.stop(when + 0.45);
    }
  };

  /* ------------------------------------------------------------------ */
  /* FX canvas: sparkles + cursor trail                                  */
  /* ------------------------------------------------------------------ */
  var FX = {
    canvas: null, c: null, parts: [], running: false, dpr: 1,
    colors: ["#ffffff", "#9dc0f5", "#5b93f5", "#f5d06b", "#e879f9", "#16a394", "#c4b5fd"],

    init: function () {
      var cv = this.canvas = document.createElement("canvas");
      cv.className = "fx-canvas";
      cv.setAttribute("aria-hidden", "true");
      document.body.appendChild(cv);
      this.c = cv.getContext("2d");
      this.resize();
      var self = this;
      window.addEventListener("resize", function () { self.resize(); });
    },
    resize: function () {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = innerWidth * this.dpr;
      this.canvas.height = innerHeight * this.dpr;
    },

    burst: function (x, y, count, power) {
      count = reduceMotion ? Math.min(count, 12) : count;
      power = power || 1;
      for (var i = 0; i < count; i++) {
        var a = Math.random() * Math.PI * 2;
        var sp = (1.5 + Math.random() * 6) * power;
        this.parts.push({
          x: x, y: y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2 * power,
          life: 1, decay: 0.008 + Math.random() * 0.018,
          size: 2 + Math.random() * 4 * power,
          color: this.colors[(Math.random() * this.colors.length) | 0],
          star: Math.random() < 0.55,
          spin: Math.random() * Math.PI, vs: (Math.random() - 0.5) * 0.3,
          g: 0.06 + Math.random() * 0.05
        });
      }
      this.run();
    },

    ring: function (x, y, radius) {
      this.parts.push({ ring: true, x: x, y: y, r: radius * 0.6, r0: radius * 0.6, born: performance.now(), life: 1, decay: 0 });
      this.run();
    },

    trail: function (x, y) {
      if (this.parts.length > 400) return;
      this.parts.push({
        x: x, y: y, vx: (Math.random() - 0.5) * 0.6, vy: Math.random() * 0.6 + 0.2,
        life: 0.9, decay: 0.03, size: 1.5 + Math.random() * 2.2,
        color: this.colors[(Math.random() * this.colors.length) | 0],
        star: Math.random() < 0.3, spin: 0, vs: 0.1, g: 0.01
      });
      this.run();
    },

    run: function () {
      if (this.running) return;
      this.running = true;
      var self = this;
      requestAnimationFrame(function loop() {
        self.draw();
        if (self.parts.length) requestAnimationFrame(loop);
        else { self.running = false; self.c.clearRect(0, 0, self.canvas.width, self.canvas.height); }
      });
    },

    draw: function () {
      var c = this.c, dpr = this.dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, innerWidth, innerHeight);
      c.globalCompositeOperation = "lighter";
      for (var i = this.parts.length - 1; i >= 0; i--) {
        var p = this.parts[i];
        p.life -= p.decay;
        if (p.life <= 0) { this.parts.splice(i, 1); continue; }
        if (p.ring) {
          // Time-based so it always fades in ~0.7s, even on slow frames.
          var k = Math.min((performance.now() - p.born) / 700, 1);
          p.life = 1 - k;
          if (p.life <= 0) { this.parts.splice(i, 1); continue; }
          p.r = p.r0 + 150 * (1 - Math.pow(1 - k, 3));
          c.globalAlpha = p.life * 0.8;
          c.strokeStyle = "#cfe0ff"; c.lineWidth = 3 * p.life;
          c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.stroke();
          continue;
        }
        p.vx *= 0.985; p.vy = p.vy * 0.985 + p.g;
        p.x += p.vx; p.y += p.vy; p.spin += p.vs;
        c.globalAlpha = Math.max(0, p.life);
        c.fillStyle = p.color;
        if (p.star) this.star(p.x, p.y, p.size * 1.6, p.spin);
        else { c.beginPath(); c.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2); c.fill(); }
      }
      c.globalAlpha = 1;
      c.globalCompositeOperation = "source-over";
    },

    // Four-point twinkle star
    star: function (x, y, r, rot) {
      var c = this.c;
      c.save(); c.translate(x, y); c.rotate(rot);
      c.beginPath();
      for (var i = 0; i < 8; i++) {
        var rad = i % 2 ? r * 0.28 : r;
        var a = (i / 8) * Math.PI * 2;
        c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      c.closePath(); c.fill(); c.restore();
    }
  };

  /* ------------------------------------------------------------------ */
  /* Floating music dock                                                 */
  /* ------------------------------------------------------------------ */
  var Dock = {
    el: null, btn: null, bars: [], label: null, vol: null,

    init: function () {
      var el = this.el = document.createElement("div");
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
      this.vol.value = Music.volume;

      var self = this;
      this.btn.addEventListener("click", function (e) {
        e.stopPropagation();
        Audio.enabled = true;
        if (Music.playing) Music.stop(); else Music.start();
      });
      this.vol.addEventListener("input", function () { Music.setVolume(parseFloat(self.vol.value)); });
      this.vol.addEventListener("click", function (e) { e.stopPropagation(); });
      document.querySelectorAll(".lang-btn").forEach(function (b) {
        b.addEventListener("click", function () { setTimeout(function () { self.update(); }, 0); });
      });
      this.update();
      this.animate();
    },

    show: function () { if (this.el) this.el.classList.add("is-visible"); Seasons.show(); },

    update: function () {
      if (!this.btn) return;
      var on = Music.playing;
      this.btn.innerHTML = on
        ? '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
      this.btn.setAttribute("aria-label", on ? t("pause") : t("play"));
      this.btn.setAttribute("aria-pressed", on ? "true" : "false");
      this.label.textContent = (on ? t("musicOn") : t("musicOff")).replace("♪ ", "");
      this.vol.setAttribute("aria-label", t("volume"));
    },

    animate: function () {
      var self = this, data = new Uint8Array(32);
      (function loop() {
        if (Audio.analyser && Music.playing) {
          Audio.analyser.getByteFrequencyData(data);
          for (var i = 0; i < self.bars.length; i++) {
            var v = data[1 + i * 3] / 255;
            self.bars[i].style.height = (4 + v * 14).toFixed(1) + "px";
          }
        } else {
          for (var k = 0; k < self.bars.length; k++) self.bars[k].style.height = "4px";
        }
        setTimeout(function () { requestAnimationFrame(loop); }, 60);
      })();
    }
  };

  /* ------------------------------------------------------------------ */
  /* Intro background: faint Business Central / AL code, falling slowly  */
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

  function highlightAL(src) {
    var esc = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // strings and attributes first, then keywords outside of them
    return esc.split(/('(?:[^'])*'|"(?:[^"])*"|\[EventSubscriber[^\]]*\])/g).map(function (part, i) {
      if (i % 2) return '<span class="' + (part.charAt(0) === "[" ? "c-a" : "c-s") + '">' + part + "</span>";
      return part.replace(AL_KEYWORDS, '<span class="c-k">$1</span>');
    }).join("");
  }

  function initCodeRain(intro) {
    var layer = document.createElement("div");
    layer.className = "intro-code";
    layer.setAttribute("aria-hidden", "true");
    var cols = innerWidth >= 1100 ? 4 : innerWidth >= 700 ? 3 : 2;
    for (var c = 0; c < cols; c++) {
      // Each column gets its own order of snippets so they never line up.
      var order = AL_SNIPPETS.map(function (_, i) { return AL_SNIPPETS[(i + c * 3) % AL_SNIPPETS.length]; });
      var block = order.map(highlightAL).join("\n\n\n");
      var col = document.createElement("div");
      col.className = "intro-code-col";
      var dur = 70 + c * 13;
      // Two identical copies stacked → translate by exactly one copy for a seamless loop.
      col.innerHTML = '<pre class="intro-code-track" style="animation-duration:' + dur + "s;animation-delay:-" + (c * 17) + 's">' +
        block + "\n\n\n" + block + "\n\n\n</pre>";
      layer.appendChild(col);
    }
    var stage = intro.querySelector(".intro-stage");
    intro.insertBefore(layer, stage);
  }

  /* ------------------------------------------------------------------ */
  /* Voice-over                                                          */
  /* Plays recorded clips from assets/audio/ when they exist:            */
  /*   opening-en.mp3 / opening-es.mp3  (right after entering the site)  */
  /* Missing files are simply skipped, so the site works without them.   */
  /* A caption with the same words is shown while a clip plays.          */
  /* ------------------------------------------------------------------ */
  var Voice = {
    clip: null,
    exists: {},
    caption: null,

    has: function (url) {
      if (!(url in this.exists)) {
        this.exists[url] = fetch(url, { method: "HEAD", cache: "no-cache" })
          .then(function (r) { return r.ok; })
          .catch(function () { return false; });
      }
      return this.exists[url];
    },

    stop: function () {
      if (this.clip) { this.clip.pause(); this.clip = null; }
      this.hideCaption();
      this.unduck();
    },

    play: function (kind, onEnd) {
      var self = this, l = lang();
      var url = "assets/audio/" + kind + "-" + l + ".mp3?v=2"; // bump when a clip is replaced
      this.stop();
      var token = this.token = {};
      return this.has(url).then(function (ok) {
        if (self.token !== token) return;
        if (!ok) { if (onEnd) onEnd(); return; }
        var a = new window.Audio(url);
        a.volume = 0.85;
        self.clip = a;
        self.showCaption(t(kind + "VO"));
        self.duck();
        a.addEventListener("ended", function () {
          if (self.clip !== a) return;
          self.stop();
          if (onEnd) onEnd();
        });
        a.play().catch(function () { self.stop(); if (onEnd) onEnd(); });
      });
    },

    // Lower the music while someone is speaking.
    duck: function () {
      if (Music.playing && Audio.ctx) Audio.musicGain.gain.setTargetAtTime(Music.volume * 0.3, Audio.ctx.currentTime, 0.3);
    },
    unduck: function () {
      if (Music.playing && Audio.ctx) Audio.musicGain.gain.setTargetAtTime(Music.volume, Audio.ctx.currentTime, 0.6);
    },

    showCaption: function (text) {
      if (!this.caption) {
        this.caption = document.createElement("p");
        this.caption.className = "voice-caption";
        this.caption.setAttribute("aria-live", "polite");
        document.body.appendChild(this.caption);
      }
      this.caption.textContent = text;
      var c = this.caption;
      requestAnimationFrame(function () { c.classList.add("is-visible"); });
    },
    hideCaption: function () { if (this.caption) this.caption.classList.remove("is-visible"); }
  };

  /* ------------------------------------------------------------------ */
  /* Intro                                                               */
  /* ------------------------------------------------------------------ */
  function initIntro() {
    var intro = document.getElementById("intro");
    if (!intro) return;
    var bubble = intro.querySelector(".intro-bubble");
    var musicToggle = intro.querySelector("[data-intro-music]");
    var wantMusic = true;
    var entered = false;
    initCodeRain(intro);

    // Language switch (top right of the intro). It drives the site's own
    // EN/ES buttons, so the choice carries over to the whole page.
    var langBox = document.createElement("div");
    langBox.className = "intro-lang";
    langBox.innerHTML =
      '<span class="intro-lang-label" aria-hidden="true">' +
      '<svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" fill="none"/>' +
      '<path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>' +
      'Language · Idioma</span>' +
      '<div class="intro-lang-buttons" role="group" aria-label="Language / Idioma">' +
      '<button type="button" data-lang="en" lang="en">English</button>' +
      '<button type="button" data-lang="es" lang="es">Español</button></div>';
    intro.appendChild(langBox);
    // Pulse around the switch: once when the intro appears, and again
    // whenever the welcome message finishes, to point out where it is.
    var tip = document.createElement("span");
    tip.className = "intro-lang-tip";
    tip.setAttribute("aria-hidden", "true");
    langBox.appendChild(tip);
    var tipTimer = null;
    function hintLanguage() {
      if (entered) return;
      tip.textContent = t("langTip");
      tip.classList.add("is-visible");
      clearTimeout(tipTimer);
      tipTimer = setTimeout(function () { tip.classList.remove("is-visible"); }, 5000);
      if (reduceMotion) return;
      langBox.classList.remove("is-hinting");
      void langBox.offsetWidth; // restart the animation
      langBox.classList.add("is-hinting");
    }

    function localise() {
      intro.querySelectorAll("[data-intro-text]").forEach(function (el) {
        el.textContent = t(el.getAttribute("data-intro-text"));
      });
      bubble.setAttribute("aria-label", t("bubbleLabel"));
      langBox.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang() ? "true" : "false");
      });
      paintToggle();
    }
    function paintToggle() {
      musicToggle.textContent = wantMusic ? t("musicOn") : t("musicOff");
      musicToggle.setAttribute("aria-pressed", wantMusic ? "true" : "false");
    }
    localise();

    langBox.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]");
      if (!b) return;
      e.stopPropagation();
      langBox.classList.remove("is-hinting");
      tip.classList.remove("is-visible");
      var siteBtn = document.querySelector('.lang-btn[data-lang="' + b.getAttribute("data-lang") + '"]');
      if (siteBtn) siteBtn.click();
      else { try { localStorage.setItem("lucia-portfolio-lang", b.getAttribute("data-lang")); } catch (err) {} }
      localise();
      typeWelcome(); // re-type the welcome text in the new language
    });

    // Welcome text, typed out under the bubble. (Browsers block sound until
    // the first click, so this part is written rather than spoken.) When it
    // finishes, the language switch is pointed out.
    var welcome = document.createElement("p");
    welcome.className = "intro-welcome";
    welcome.setAttribute("aria-live", "polite");
    intro.querySelector(".intro-stage").insertBefore(welcome, intro.querySelector(".intro-options"));
    var typeTimer = null;
    function typeWelcome() {
      clearTimeout(typeTimer);
      var text = t("welcomeText"), i = 0;
      if (reduceMotion) { welcome.textContent = text; hintLanguage(); return; }
      welcome.classList.add("is-typing");
      (function step() {
        i += 1;
        welcome.textContent = text.slice(0, i);
        if (i < text.length) typeTimer = setTimeout(step, text.charAt(i - 1) === "." ? 380 : 32);
        else { welcome.classList.remove("is-typing"); hintLanguage(); }
      })();
    }
    typeTimer = setTimeout(typeWelcome, 2500);

    // Rising fizz
    var fizzTimer = null;
    if (!reduceMotion) {
      fizzTimer = setInterval(function () {
        var f = document.createElement("span");
        f.className = "intro-fizz";
        var s = 4 + Math.random() * 14;
        f.style.width = f.style.height = s + "px";
        f.style.left = Math.random() * 100 + "%";
        f.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
        f.style.animationDuration = (6 + Math.random() * 7) + "s";
        intro.appendChild(f);
        setTimeout(function () { f.remove(); }, 13500);
      }, 380);
    }

    musicToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      wantMusic = !wantMusic;
      paintToggle();
    });

    function enter(withSound) {
      if (entered) return;
      entered = true;
      Voice.stop();
      clearTimeout(typeTimer);
      Audio.enabled = !!withSound;
      if (withSound) Audio.init();

      var r = bubble.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      Audio.pop();
      Audio.chime();
      bubble.classList.add("is-popping");
      FX.ring(cx, cy, r.width / 2);

      setTimeout(function () {
        intro.classList.add("is-leaving");
        document.documentElement.classList.remove("intro-open");
        if (withSound && wantMusic) setTimeout(function () { Music.start(); }, 500);
      }, 380);
      setTimeout(function () {
        intro.classList.add("is-gone");
        clearInterval(fizzTimer);
        Dock.show();
        var main = document.getElementById("main");
        if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
      }, 1400);
    }

    bubble.addEventListener("click", function (e) { e.stopPropagation(); enter(true); });
    document.addEventListener("keydown", function onKey(e) {
      if (entered) { document.removeEventListener("keydown", onKey); return; }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(true); }
      if (e.key === "Escape") enter(false);
    });
    setTimeout(function () { bubble.focus({ preventScroll: true }); }, 400);
  }

  /* ------------------------------------------------------------------ */
  /* "Listen to my welcome": the spoken message plays only when the      */
  /* visitor asks for it, by clicking the badge or the profile photo.    */
  /* It can be played once per visit, never twice at the same time.     */
  /* ------------------------------------------------------------------ */
  function initListenBadge() {
    var frame = document.querySelector(".hero-photo-frame");
    if (!frame) return;
    var state = "idle"; // idle → playing → done
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "listen-badge";
    btn.innerHTML =
      '<span class="listen-icon" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24">' +
      '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>' +
      '<path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg></span>' +
      '<span class="listen-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
      '<span class="listen-text"></span>';
    frame.appendChild(btn);
    frame.classList.add("has-listen");

    function paint() {
      btn.querySelector(".listen-text").textContent = state === "playing" ? t("listening") : t("listen");
      btn.setAttribute("aria-label", t("listenLabel"));
      btn.classList.toggle("is-playing", state === "playing");
    }
    function play(e) {
      if (e) e.stopPropagation();
      if (state !== "idle") return; // once only, and never on top of itself
      state = "playing";
      paint();
      Voice.play("opening", function () {
        state = "done";
        btn.classList.add("is-done");
        frame.classList.remove("has-listen");
        setTimeout(function () { btn.remove(); }, 600);
      });
    }
    btn.addEventListener("click", play);
    frame.addEventListener("click", play);
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.addEventListener("click", function () { setTimeout(paint, 0); });
    });
    paint();
  }

  /* ------------------------------------------------------------------ */
  /* Page interactivity                                                  */
  /* ------------------------------------------------------------------ */
  function initPageFx() {
    initListenBadge();

    // "Beyond the code" photo: strum a chord, with a soft ripple
    ["beyond-photo"].forEach(function (cls) {
      var el = document.querySelector("." + cls);
      if (!el) return;
      el.style.cursor = "pointer";
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        var r = el.getBoundingClientRect();
        FX.ring(r.left + r.width / 2, r.top + r.height / 2, Math.min(r.width, r.height) / 2);
        Audio.strum();
      });
    });

    // 3D tilt on the expertise cards
    if (finePointer && !reduceMotion) {
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

      // Hero orbs follow the mouse a little (parallax)
      var field = document.querySelector(".bubble-field-hero");
      if (field) {
        document.addEventListener("pointermove", function (e) {
          var dx = (e.clientX / innerWidth - 0.5) * 40, dy = (e.clientY / innerHeight - 0.5) * 40;
          field.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
        }, { passive: true });
        field.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
      }
    }

    // Pause the music while the tab is hidden, resume when back.
    var pausedByHide = false;
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && Music.playing) { pausedByHide = true; Music.stop(); }
      else if (!document.hidden && pausedByHide) { pausedByHide = false; Music.start(); }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Contact form                                                        */
  /* ------------------------------------------------------------------ */
  function formText(key) {
    var dict = (window.TRANSLATIONS || {})[lang()] || (window.TRANSLATIONS || {}).en || {};
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

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim(),
        message: form.message.value.trim()
      };
      if (form._gotcha.value) return; // bot
      if (!data.name || !data.email || !data.message) { say("missing", "error"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { say("invalidEmail", "error"); form.email.focus(); return; }

      if (config.contactFormEndpoint) {
        button.disabled = true;
        say("sending");
        fetch(config.contactFormEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,            // used as Reply-To, so answering goes straight to the sender
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
          Audio.chime();
        }).catch(function () {
          say("error", "error");
        }).then(function () { button.disabled = false; });
        return;
      }

      // No endpoint configured: hand the message to the visitor's email app.
      var to = config.professionalEmail;
      if (!to) { say("error", "error"); return; }
      var body = data.message + "\n\n" + data.name + (data.company ? " (" + data.company + ")" : "") + "\n" + data.email;
      window.location.href = "mailto:" + to +
        "?subject=" + encodeURIComponent(formText("subject") + ": " + data.name) +
        "&body=" + encodeURIComponent(body);
      say("mailto", "ok");
    });

    // Once the visitor starts typing, the "come say hi" motion stops.
    form.addEventListener("focusin", function () { form.classList.add("is-engaged"); });
  }

  /* When the visitor reaches the end of the page, the form gives a
     short, polite nudge and then floats gently to invite a message. */
  function initContactNudge() {
    var form = document.getElementById("contactForm");
    if (!form || reduceMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setTimeout(function () {
          form.classList.add("is-nudging");
          setTimeout(function () {
            form.classList.remove("is-nudging");
            form.classList.add("is-calling");
          }, 900);
        }, 900);
      });
    }, { threshold: 0.55 });
    io.observe(form);
  }

  /* ------------------------------------------------------------------ */
  /* Seasonal background: a few slow, subtle particles that change with  */
  /* the time of year (northern hemisphere).                             */
  /*   winter  Dec–Feb  snow        spring  Mar–May  petals              */
  /*   summer  Jun–Aug  warm motes  autumn  Sep–Nov  falling leaves      */
  /* Add ?season=winter|spring|summer|autumn to the URL to preview one.  */
  /* ------------------------------------------------------------------ */
  var Seasons = {
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

    isDark: function () { return document.documentElement.getAttribute("data-theme") === "dark"; },

    enabled: true,
    storageKey: "lucia-portfolio-season-fx",
    icons: {
      winter: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
      spring: '<path d="M12 12c0-4 2-7 5-7 0 3-2 7-5 7zm0 0c0-4-2-7-5-7 0 3 2 7 5 7zm0 0c3 0 6 2 6 5-3 0-6-2-6-5zm0 0c-3 0-6 2-6 5 3 0 6-2 6-5z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
      summer: '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      autumn: '<path d="M5 19C5 10 11 5 19 5c0 8-5 14-14 14zm0 0l8-8" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    },

    initToggle: function () {
      var self = this;
      var btn = this.toggle = document.createElement("button");
      btn.type = "button";
      btn.className = "season-toggle";
      btn.innerHTML = '<span class="season-toggle-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24">' +
        this.icons[this.season] + '</svg></span><span class="season-toggle-label"></span>';
      document.body.appendChild(btn);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        self.setEnabled(!self.enabled);
        try { localStorage.setItem(self.storageKey, self.enabled ? "on" : "off"); } catch (err) {}
      });
      document.querySelectorAll(".lang-btn").forEach(function (b) {
        b.addEventListener("click", function () { setTimeout(function () { self.paintToggle(); }, 0); });
      });
      this.paintToggle();
    },

    paintToggle: function () {
      if (!this.toggle) return;
      this.toggle.querySelector(".season-toggle-label").textContent = this.enabled ? t("animOn") : t("animOff");
      this.toggle.setAttribute("aria-label", this.enabled ? t("animLabelOn") : t("animLabelOff"));
      this.toggle.setAttribute("aria-pressed", this.enabled ? "true" : "false");
      this.toggle.classList.toggle("is-off", !this.enabled);
    },

    setEnabled: function (on) {
      this.enabled = on;
      if (this.canvas) {
        this.canvas.style.display = on ? "" : "none";
        if (!on) this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.last = performance.now();
      this.paintToggle();
    },

    show: function () { if (this.toggle) this.toggle.classList.add("is-visible"); },

    init: function () {
      if (reduceMotion) return;
      this.season = this.current();
      var cv = this.canvas = document.createElement("canvas");
      cv.className = "season-canvas season-" + this.season;
      cv.setAttribute("aria-hidden", "true");
      document.body.appendChild(cv);
      this.c = cv.getContext("2d");
      var self = this;
      this.resize();
      window.addEventListener("resize", function () { self.resize(); });
      this.parts = [];
      for (var i = 0; i < this.count; i++) this.parts.push(this.spawn(true));
      this.last = performance.now();
      this.initToggle();
      try { if (localStorage.getItem(this.storageKey) === "off") this.setEnabled(false); } catch (err) {}
      requestAnimationFrame(function loop(now) {
        if (!document.hidden && self.enabled) self.frame(now);
        requestAnimationFrame(loop);
      });
    },

    resize: function () {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = innerWidth; this.h = innerHeight;
      this.canvas.width = this.w * this.dpr; this.canvas.height = this.h * this.dpr;
      // Sparse on purpose: roughly one particle per 105px of width.
      this.count = Math.max(7, Math.min(17, Math.round(this.w / 105)));
      if (this.parts) while (this.parts.length < this.count) this.parts.push(this.spawn(true));
      if (this.parts) this.parts.length = Math.min(this.parts.length, this.count);
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
      if (s === "winter") { p.size = 1.2 + r() * 2.4; p.vy = 0.25 + r() * 0.45; p.sway = 0.3 + r() * 0.4; p.alpha = 0.35 + r() * 0.35; }
      if (s === "spring") { p.size = 3 + r() * 3; p.vy = 0.3 + r() * 0.35; p.sway = 0.6 + r() * 0.6; p.alpha = 0.35 + r() * 0.25; }
      if (s === "summer") { p.size = 1.2 + r() * 1.8; p.vy = -(0.12 + r() * 0.2); p.sway = 0.25 + r() * 0.3; p.alpha = 0.3 + r() * 0.35; }
      if (s === "autumn") { p.size = 5 + r() * 5; p.vy = 0.35 + r() * 0.4; p.sway = 0.7 + r() * 0.7; p.alpha = 0.3 + r() * 0.25; }
      return p;
    },

    frame: function (now) {
      var dt = Math.min((now - this.last) / 16.67, 3);
      this.last = now;
      var c = this.c, s = this.season;
      var pal = this.palettes[s][this.isDark() ? "dark" : "light"];
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, this.w, this.h);
      for (var i = 0; i < this.parts.length; i++) {
        var p = this.parts[i];
        p.phase += 0.012 * dt;
        p.y += p.vy * dt;
        p.x += Math.sin(p.phase) * p.sway * 0.5 * dt;
        p.rot += p.vrot * dt + (s === "autumn" ? Math.sin(p.phase) * 0.01 * dt : 0);
        if (p.y > this.h + 30 || p.y < -30 || p.x < -40 || p.x > this.w + 40) { this.parts[i] = this.spawn(false); continue; }
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
        c.beginPath(); c.arc(p.x, p.y, p.size, 0, Math.PI * 2); c.fill();
        if (s === "summer") { c.globalAlpha *= 0.25; c.beginPath(); c.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2); c.fill(); }
        return;
      }
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      if (s === "spring") {
        // Petal: a soft teardrop
        c.scale(1, 0.62 + 0.25 * Math.sin(p.phase * 1.7)); // turns as it falls
        c.beginPath();
        c.moveTo(0, -p.size);
        c.bezierCurveTo(p.size, -p.size * 0.6, p.size * 0.7, p.size, 0, p.size);
        c.bezierCurveTo(-p.size * 0.7, p.size, -p.size, -p.size * 0.6, 0, -p.size);
        c.fill();
      } else {
        // Leaf: pointed oval with a central vein, flipping as it falls
        c.scale(0.55 + 0.45 * Math.abs(Math.sin(p.phase * 0.8)), 1);
        var L = p.size;
        c.beginPath();
        c.moveTo(0, -L);
        c.quadraticCurveTo(L * 0.75, -L * 0.2, 0, L);
        c.quadraticCurveTo(-L * 0.75, -L * 0.2, 0, -L);
        c.fill();
        c.globalAlpha *= 0.6;
        c.strokeStyle = "rgba(0,0,0,0.25)";
        c.lineWidth = 0.7;
        c.beginPath(); c.moveTo(0, -L * 0.8); c.lineTo(0, L * 1.25); c.stroke();
      }
      c.restore();
    }
  };

  /* ------------------------------------------------------------------ */
  function boot() {
    Seasons.init();
    FX.init();
    Dock.init();
    initIntro();
    initPageFx();
    initContactForm();
    initContactNudge();
    if (!document.getElementById("intro")) Dock.show();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
