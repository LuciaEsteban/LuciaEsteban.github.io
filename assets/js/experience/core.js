/**
 * Experience layer: shared core.
 *
 * The "experience" scripts add the intro screen, sound, music, voice
 * message, seasonal background and small interactions on top of the
 * base site (main.js). They share one namespace, window.XP, and are
 * loaded in this order from index.html:
 *
 *   core.js      namespace, copy (EN/ES), helpers
 *   sound.js     sound effects, background music, voice clips
 *   visuals.js   ripple effect, seasonal background
 *   controls.js  floating music player + seasonal animation switch
 *   intro.js     bubble intro screen
 *   voice.js     "Listen to me" speech bubble + synced captions
 *   page.js      page interactions, contact form, start-up
 */
(function () {
  "use strict";

  var XP = (window.XP = window.XP || {});

  XP.reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  XP.finePointer = !!(window.matchMedia && matchMedia("(pointer: fine)").matches);

  /* ------------------------------------------------------------------ */
  /* Copy used by the experience layer (the page copy lives in i18n.js) */
  /* ------------------------------------------------------------------ */
  XP.TEXT = {
    en: {
      // Intro
      eyebrow: "Portfolio",
      role: "Microsoft Dynamics 365 Business Central / AL Developer",
      cta: "Tap the bubble to enter",
      hint: "Or press Enter to continue",
      bubbleLabel: "Enter the portfolio",
      langTip: "You can change the language here",
      welcomeText: "Welcome to my portfolio. If you would like to get to know me a little better, tap the bubble on the screen. You can also change the language in the top right corner.",
      // Music + seasonal animation controls
      musicOn: "♪ Music: on",
      musicOff: "♪ Music: off",
      play: "Play background music",
      pause: "Pause background music",
      volume: "Music volume",
      animOn: "Animation: on",
      animOff: "Animation: off",
      animLabelOn: "Turn off the seasonal background animation",
      animLabelOff: "Turn on the seasonal background animation",
      // Voice message
      listen: "Listen to me",
      listenLabel: "Play a short spoken welcome message (about 20 seconds)",
      speaker: "Lucía",
      nowPlaying: "Voice message",
      // Captions, timed to the recording: [start s, end s, words]
      openingCues: [
        [0.2, 2.33, "Hello, and welcome to my portfolio."],
        [2.71, 5.77, "I'm Lucía Esteban, a Business Central developer."],
        [6.1, 10.59, "Here you'll discover what I work on, how I approach each project, my background,"],
        [10.59, 14.48, "and a little about who I am beyond the code. Thank you for stopping by."],
        [15.13, 20.53, "If you think I could be a good fit for your team, I'd be glad to talk."]
      ]
    },
    es: {
      eyebrow: "Portfolio",
      role: "Desarrolladora Microsoft Dynamics 365 Business Central / AL",
      cta: "Toca la burbuja para entrar",
      hint: "O pulsa Enter para continuar",
      bubbleLabel: "Entrar al portfolio",
      langTip: "Puedes cambiar el idioma aquí",
      welcomeText: "Bienvenidos a mi portfolio. Si quieres conocerme un poco más, toca la burbuja que aparece en pantalla. También puedes cambiar el idioma en la esquina superior derecha.",
      musicOn: "♪ Música: on",
      musicOff: "♪ Música: off",
      play: "Reproducir música de fondo",
      pause: "Pausar música de fondo",
      volume: "Volumen de la música",
      animOn: "Animación: on",
      animOff: "Animación: off",
      animLabelOn: "Desactivar la animación de fondo de temporada",
      animLabelOff: "Activar la animación de fondo de temporada",
      listen: "Escúchame",
      listenLabel: "Reproducir un breve mensaje de bienvenida (unos 20 segundos)",
      speaker: "Lucía",
      nowPlaying: "Mensaje de voz",
      openingCues: [
        [0.2, 2.39, "Hola, y bienvenidos a mi portfolio."],
        [2.89, 5.85, "Soy Lucía Esteban, desarrolladora de Business Central."],
        [6.26, 10.72, "Aquí descubrirás en qué trabajo, cómo abordo cada proyecto, mi formación"],
        [11.12, 13.56, "y también un poco de quién soy fuera del código."],
        [14.05, 15.29, "Gracias por tu visita."],
        [15.7, 19.88, "Si crees que puedo encajar en tu equipo, estaré encantada de hablar contigo."]
      ]
    }
  };

  /* Current language, as chosen with the site's EN/ES switch. */
  XP.lang = function () {
    var l = document.documentElement.getAttribute("lang");
    try { l = localStorage.getItem("lucia-portfolio-lang") || l; } catch (e) { /* storage blocked */ }
    return l === "es" ? "es" : "en";
  };

  XP.t = function (key) {
    return (XP.TEXT[XP.lang()] || XP.TEXT.en)[key];
  };

  /* Run a callback whenever the site language changes (EN/ES buttons). */
  var langListeners = [];
  XP.onLanguageChange = function (fn) { langListeners.push(fn); };
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".lang-btn")) return;
    // main.js updates the language in its own click handler; run after it.
    setTimeout(function () { langListeners.forEach(function (fn) { fn(); }); }, 0);
  });

  XP.hz = function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); };
})();
