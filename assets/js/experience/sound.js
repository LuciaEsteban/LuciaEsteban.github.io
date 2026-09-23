/**
 * Experience layer: sound.
 *
 *   XP.Sound  small Web Audio engine for sound effects (pop, chime, strum)
 *   XP.Music  generative background music: piano over strings, in D major
 *   XP.Voice  plays Lucía's recorded voice clips from assets/audio/
 *
 * Effects and music are synthesised live, so there are no music files to
 * license or download. Browsers only allow sound after a click, which the
 * intro bubble provides.
 */
(function () {
  "use strict";

  var XP = window.XP;
  var hz = XP.hz;

  /* ------------------------------------------------------------------ */
  /* Sound engine                                                        */
  /* ------------------------------------------------------------------ */
  var Sound = (XP.Sound = {
    ctx: null,
    enabled: false, // sound effects allowed (false after entering with Escape)

    init: function () {
      if (this.ctx) {
        if (this.ctx.state === "suspended") this.ctx.resume();
        return true;
      }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      var ctx = (this.ctx = new AC());

      // Master output with a gentle compressor.
      this.master = ctx.createGain();
      this.master.gain.value = 0.9;
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 3;
      this.master.connect(comp);
      comp.connect(ctx.destination);

      // Effects: dry + a little reverb.
      var fxVerb = ctx.createConvolver();
      fxVerb.buffer = this.impulse(2.8, 2.2);
      var fxVerbGain = ctx.createGain();
      fxVerbGain.gain.value = 0.35;
      fxVerb.connect(fxVerbGain);
      fxVerbGain.connect(this.master);
      this.sfxBus = ctx.createGain();
      this.sfxBus.gain.value = 0.6;
      this.sfxBus.connect(this.master);
      this.sfxBus.connect(fxVerb);

      // Music: bus → warm low-pass (+ its own reverb) → fader → master.
      // The reverb sits before the fader, so muting cuts its tail too.
      this.warm = ctx.createBiquadFilter();
      this.warm.type = "lowpass";
      this.warm.frequency.value = 2400;
      this.warm.Q.value = 0.5;
      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = 0;
      var musicVerb = ctx.createConvolver();
      musicVerb.buffer = this.impulse(2.4, 2.4);
      var musicSend = ctx.createGain();
      musicSend.gain.value = 0.3;
      this.warm.connect(this.musicGain);
      this.warm.connect(musicSend);
      musicSend.connect(musicVerb);
      musicVerb.connect(this.musicGain);
      this.musicGain.connect(this.master);
      this.analyser = ctx.createAnalyser(); // drives the player's equalizer
      this.analyser.fftSize = 64;
      this.musicGain.connect(this.analyser);
      this.newMusicBus();
      return true;
    },

    /* Fresh input for the music. Replacing it silences every note that
       was already scheduled on the old one (used when music stops). */
    newMusicBus: function () {
      if (this.musicBus) { try { this.musicBus.disconnect(); } catch (e) { /* already */ } }
      this.musicBus = this.ctx.createGain();
      this.musicBus.connect(this.warm);
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

    noise: function () {
      if (this._noise) return this._noise;
      var len = this.ctx.sampleRate;
      var buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return (this._noise = buf);
    },

    /* Felt-piano voice: a few partials with their own decays, through a
       closing low-pass so notes bloom and then mellow. */
    piano: function (freq, when, vol, dest, dur) {
      var ctx = this.ctx;
      dur = dur || 2.6;
      var out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, when);
      out.gain.exponentialRampToValueAtTime(vol, when + 0.006);
      out.gain.exponentialRampToValueAtTime(vol * 0.35, when + 0.35);
      out.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      var lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(Math.min(freq * 7, 12000), when);
      lp.frequency.exponentialRampToValueAtTime(Math.max(freq * 2.2, 300), when + 1.2);
      lp.connect(out);
      out.connect(dest || this.sfxBus);
      [[1, "triangle", 1, dur], [2, "sine", 0.22, 0.7], [3.01, "sine", 0.07, 0.35]].forEach(function (p) {
        var o = ctx.createOscillator();
        o.type = p[1];
        o.frequency.value = freq * p[0];
        var g = ctx.createGain();
        g.gain.setValueAtTime(p[2], when);
        g.gain.exponentialRampToValueAtTime(0.0001, when + p[3]);
        o.connect(g);
        g.connect(lp);
        o.start(when);
        o.stop(when + dur + 0.05);
      });
    },

    /* Warm string pad: detuned saws, slow swell, dark filter. */
    pad: function (freqs, when, dur, vol, dest) {
      var ctx = this.ctx;
      var lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 850;
      lp.Q.value = 0.6;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(vol, when + 2.2);
      g.gain.setValueAtTime(vol, when + dur - 1.4);
      g.gain.linearRampToValueAtTime(0.0001, when + dur);
      lp.connect(g);
      g.connect(dest);
      freqs.forEach(function (f) {
        [-7, 7].forEach(function (cents) {
          var o = ctx.createOscillator();
          o.type = "sawtooth";
          o.frequency.value = f;
          o.detune.value = cents;
          o.connect(lp);
          o.start(when);
          o.stop(when + dur + 0.05);
        });
      });
    },

    /* Plucked string (for the guitar strum). */
    pluck: function (freq, when, vol) {
      var ctx = this.ctx;
      var o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = freq;
      var f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(freq * 8, when);
      f.frequency.exponentialRampToValueAtTime(freq * 1.2, when + 0.4);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol, when + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 1.2);
      o.connect(f);
      f.connect(g);
      g.connect(this.sfxBus);
      o.start(when);
      o.stop(when + 1.3);
    },

    /* Bubble pop: quick pitch drop + a small burst of air. */
    pop: function (volume) {
      if (!this.enabled || !this.ctx) return;
      var ctx = this.ctx, now = ctx.currentTime, v = volume || 1;
      var o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(1200, now);
      o.frequency.exponentialRampToValueAtTime(180, now + 0.09);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.45 * v, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.connect(g);
      g.connect(this.sfxBus);
      o.start(now);
      o.stop(now + 0.15);

      var n = ctx.createBufferSource();
      n.buffer = this.noise();
      var bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2500;
      bp.Q.value = 1.2;
      var ng = ctx.createGain();
      ng.gain.setValueAtTime(0.3 * v, now);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      n.connect(bp);
      bp.connect(ng);
      ng.connect(this.sfxBus);
      n.start(now);
      n.stop(now + 0.1);
    },

    /* Welcome chord: an open D major 9, rolled. */
    chime: function () {
      if (!this.enabled || !this.ctx) return;
      var now = this.ctx.currentTime + 0.04;
      [50, 57, 62, 66, 69, 76].forEach(function (n, i) {
        Sound.piano(hz(n), now + i * 0.05, i ? 0.13 : 0.18, null, 3.5);
      });
    },

    /* Guitar strum on the current chord of the music. */
    strum: function () {
      if (!this.enabled || !this.ctx) return;
      var now = this.ctx.currentTime;
      var chord = Music.currentChord();
      var voicing = [chord[0] / 2].concat(chord, [chord[1] * 2]);
      voicing.forEach(function (f, i) { Sound.pluck(f, now + i * 0.028, 0.2); });
    }
  });

  /* ------------------------------------------------------------------ */
  /* Background music: calm piano arpeggios over strings and bass        */
  /* ------------------------------------------------------------------ */
  var Music = (XP.Music = {
    playing: false,
    bpm: 68,
    step: 0,        // 8th-note counter; each chord lasts 2 bars (16 eighths)
    nextTime: 0,
    timer: null,
    volume: 0.55,
    listeners: [],  // notified when music starts or stops (the player UI)

    // Dmaj9 → Bm11 → Gmaj7 → A7sus4 (MIDI notes)
    progression: [
      { bass: 38, pad: [57, 61, 64, 66], arp: [62, 66, 69, 73, 76] },
      { bass: 35, pad: [57, 62, 64, 66], arp: [59, 62, 66, 69, 73] },
      { bass: 31, pad: [54, 59, 62, 66], arp: [55, 59, 62, 66, 69] },
      { bass: 33, pad: [55, 59, 62, 64], arp: [57, 62, 64, 67, 71] }
    ],
    patterns: [[0, 1, 2, 4, 3, 2, 1, 2], [0, 2, 4, 3, 1, 3, 2, 4]],

    onChange: function (fn) { this.listeners.push(fn); },
    notify: function () { this.listeners.forEach(function (fn) { fn(); }); },

    chordAt: function (step) { return this.progression[Math.floor(step / 16) % 4]; },
    currentChord: function () { return this.chordAt(this.step).arp.slice(0, 4).map(hz); },

    start: function () {
      if (!Sound.init()) return;
      var ctx = Sound.ctx, self = this;
      this.playing = true;
      this.step = 0;
      this.nextTime = ctx.currentTime + 0.15;
      clearInterval(this.timer);
      this.timer = setInterval(function () { self.schedule(); }, 25);
      this.fadeTo(this.volume, 3);
      this.notify();
    },

    stop: function () {
      if (!Sound.ctx) return;
      var self = this;
      this.playing = false;
      clearInterval(this.timer);
      this.fadeTo(0, 0.25); // off within a quarter of a second
      setTimeout(function () { if (!self.playing) Sound.newMusicBus(); }, 300);
      this.notify();
    },

    fadeTo: function (value, seconds) {
      var g = Sound.musicGain.gain, now = Sound.ctx.currentTime;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(value, now + seconds);
    },

    setVolume: function (v) {
      this.volume = v;
      if (this.playing && Sound.ctx) Sound.musicGain.gain.setTargetAtTime(v, Sound.ctx.currentTime, 0.1);
    },

    /* Lower the music while the voice message plays, then restore it. */
    duck: function (on) {
      if (!this.playing || !Sound.ctx) return;
      Sound.musicGain.gain.setTargetAtTime(on ? this.volume * 0.3 : this.volume, Sound.ctx.currentTime, on ? 0.3 : 0.6);
    },

    schedule: function () {
      var eighth = 60 / this.bpm / 2;
      while (this.nextTime < Sound.ctx.currentTime + 0.25) {
        this.playStep(this.step, this.nextTime, eighth);
        this.nextTime += eighth;
        this.step++;
      }
    },

    playStep: function (step, when, eighth) {
      var s = step % 16, cycle = Math.floor(step / 64);
      var ch = this.chordAt(step), dest = Sound.musicBus;

      if (s === 0) {
        Sound.pad(ch.pad.map(hz), when, 16 * eighth + 1.4, 0.022, dest);
        this.bass(hz(ch.bass), when, 16 * eighth + 0.5);
      }
      // Piano arpeggio: quarter notes on the first pass, flowing eighths after.
      if (cycle > 0 || s % 2 === 0) {
        var vel = (s % 4 === 0 ? 0.075 : 0.05) * (0.9 + Math.random() * 0.2);
        Sound.piano(hz(ch.arp[this.patterns[cycle % 2][s % 8]]), when, vel, dest, 2.4);
      }
      // A sparse top line from the second pass on.
      if (cycle > 0 && (s === 0 || (s === 12 && Math.random() < 0.5))) {
        Sound.piano(hz(ch.arp[s === 0 ? 4 : 3] + 12), when + 0.012, 0.06, dest, 4);
      }
      // A very soft pulse from the third pass on.
      if (cycle > 1 && s % 4 === 0) this.kick(when, s % 8 === 0 ? 0.16 : 0.09);
    },

    bass: function (f, when, dur) {
      var ctx = Sound.ctx;
      var o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(0.2, when + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(g);
      g.connect(Sound.musicBus);
      o.start(when);
      o.stop(when + dur + 0.05);
    },

    kick: function (when, vol) {
      var ctx = Sound.ctx;
      var o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(95, when);
      o.frequency.exponentialRampToValueAtTime(40, when + 0.14);
      var g = ctx.createGain();
      g.gain.setValueAtTime(vol, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.4);
      o.connect(g);
      g.connect(Sound.musicBus);
      o.start(when);
      o.stop(when + 0.45);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Voice clips (assets/audio/<name>-<en|es>.mp3)                       */
  /* ------------------------------------------------------------------ */
  XP.Voice = {
    VERSION: 3,   // bump when a recording is replaced, so browsers reload it
    VOLUME: 0.7,
    clip: null,

    /* Plays a clip in the current language. Callbacks (all optional):
         onStart(audio)  the clip has started
         onEnd()         finished, or could not be played */
    play: function (name, callbacks) {
      var self = this, cb = callbacks || {};
      var url = "assets/audio/" + name + "-" + XP.lang() + ".mp3?v=" + this.VERSION;
      this.stop();
      var a = (this.clip = new window.Audio(url));
      a.volume = this.VOLUME;
      var finish = function () {
        if (self.clip !== a) return;
        self.clip = null;
        Music.duck(false);
        if (cb.onEnd) cb.onEnd();
      };
      a.addEventListener("ended", finish);
      a.addEventListener("error", finish);
      a.play().then(function () {
        Music.duck(true);
        if (cb.onStart) cb.onStart(a);
      }).catch(finish);
    },

    stop: function () {
      if (!this.clip) return;
      this.clip.pause();
      this.clip = null;
      Music.duck(false);
    }
  };
})();
