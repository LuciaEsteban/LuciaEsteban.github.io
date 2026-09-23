# Complete guide to the portfolio code

> **Who this guide is for.** For someone who can program (Java and AL at a basic or intermediate level) but does not know HTML, CSS or JavaScript. It does not explain what a loop, a variable or an `if` is: you already know that. It does explain everything that is specific to the web, with comparisons to Java and AL where they help.
>
> **Goal.** After studying it, you should understand every file of the site, be able to explain why it is built the way it is, and be able to rebuild it from scratch.
>
> Spanish version: [guia-codigo-es.md](guia-codigo-es.md)

---

## Table of contents

1. [Overview: what this site is and how it is organized](#1-overview-what-this-site-is-and-how-it-is-organized)
2. [The three languages of the web, explained from Java and AL](#2-the-three-languages-of-the-web-explained-from-java-and-al)
3. [index.html: the page structure](#3-indexhtml-the-page-structure)
4. [styles.css: the base design](#4-stylescss-the-base-design)
5. [config.js: the configuration](#5-configjs-the-configuration)
6. [i18n.js: the texts in two languages](#6-i18njs-the-texts-in-two-languages)
7. [main.js: the base behavior](#7-mainjs-the-base-behavior)
8. [The "experience" layer and core.js](#8-the-experience-layer-and-corejs)
9. [sound.js: effects, generative music and voice](#9-soundjs-effects-generative-music-and-voice)
10. [visuals.js: the wave and the seasonal animations](#10-visualsjs-the-wave-and-the-seasonal-animations)
11. [controls.js and controls.css: the floating controls](#11-controlsjs-and-controlscss-the-floating-controls)
12. [intro.js and intro.css: the bubble screen](#12-introjs-and-introcss-the-bubble-screen)
13. [voice.js and voice.css: the voice message and the guided tour](#13-voicejs-and-voicecss-the-voice-message-and-the-guided-tour)
14. [page.js, contact.css and page.css: interactions, form and startup](#14-pagejs-contactcss-and-pagecss-interactions-form-and-startup)
15. [The audio files: how they were processed and how they are synchronized](#15-the-audio-files-how-they-were-processed-and-how-they-are-synchronized)
16. [Publishing: Git, GitHub Pages and caching](#16-publishing-git-github-pages-and-caching)
17. [How to build this site from scratch, step by step](#17-how-to-build-this-site-from-scratch-step-by-step)
18. [Glossary](#18-glossary)
19. [Review questions](#19-review-questions)

---

## 1. Overview: what this site is and how it is organized

### 1.1 A static site

The site is **static**: there is no server with its own logic (no Java running on a server, no database, nothing that runs "behind the scenes"). There are only files that the browser downloads and executes:

- **HTML** (`index.html`): the *content and structure*. What is on the page: headings, paragraphs, buttons, the form…
- **CSS** (`.css`): the *appearance*. Colors, sizes, positions, animations.
- **JavaScript** (`.js`): the *behavior*. What happens when you click, switching languages, the music, the voice…

Everything "dynamic" (calculating your length of experience, switching the language, generating the music) happens **in the visitor's browser**, not on a server. That is why it can be hosted for free on **GitHub Pages**, whose only job is to serve files exactly as they are.

A comparison with Business Central: it is as if the whole application were the client side. There is no "service tier" running codeunits; the browser is both the interface and the engine that executes the code.

The only exception is the contact form, which sends the data to an external service (FormSubmit) so that it reaches you by email. That is explained in chapter 14.

### 1.2 No frameworks, no build step

The site uses no React, Angular or Vue, and no *bundler* (tools that "compile" web code). The code you write is exactly the code the browser runs. Advantages:

- There is nothing to install or compile: you edit a file, upload it, and you are done.
- It is easier to understand and to maintain years later.
- GitHub Pages serves it directly.

JavaScript written without libraries like this is called **"vanilla JavaScript"**.

### 1.3 File map

```
.
├── index.html                    The only page: all the content
├── README.md                     Project description
├── docs/                         This guide (Spanish and English)
└── assets/
    ├── audio/
    │   ├── opening-en.mp3        Your voice message in English
    │   └── opening-es.mp3        Your voice message in Spanish
    ├── img/                      Profile photo, icons (favicon), social preview image
    ├── css/
    │   ├── styles.css            Base design of the whole site
    │   └── experience/           Styles of the "experience layer"
    │       ├── intro.css         Bubble intro screen
    │       ├── controls.css      Music player and animation switch
    │       ├── voice.css         "Listen to me" speech bubble and captions
    │       ├── contact.css       Contact section and form
    │       └── page.css          Canvases, card tilt, chips
    └── js/
        ├── config.js             Configuration (dates, email, links…)
        ├── i18n.js               All the site's text in English and Spanish
        ├── main.js               Base behaviour: language, theme, menu…
        └── experience/           The "experience layer" (all the extra interactivity)
            ├── core.js           Shared base: text, language, helpers
            ├── sound.js          Sound effects, generative music, voice
            ├── visuals.js        Pop ripple and seasonal particles
            ├── controls.js       Music player and animation switch
            ├── intro.js          Bubble intro screen
            ├── voice.js          Voice message, captions and guided tour
            └── page.js           Interactions, contact form and start-up
```

### 1.4 Two layers: base and "experience"

The code is deliberately split into two layers:

1. **The base site** (`styles.css`, `config.js`, `i18n.js`, `main.js`): the portfolio itself. It works on its own: texts, languages, dark mode, menu, scroll animations, contact links.
2. **The experience layer** (everything inside the `experience/` folders): what is added on top to make it more eye-catching: the opening bubble, the music, the voice, the seasonal particles, the form, and so on.

Separating them like this has a clear advantage: if one day you wanted to remove the experience layer, you would only need to stop loading those files and the site would keep working. It is the same idea as separating an extension from the base application in AL: the base does not depend on the extension.

### 1.5 What happens when someone opens the site (the complete flow)

This is the complete journey, from start to finish. It is worth understanding before going into detail:

1. The browser downloads `index.html` and starts reading it from top to bottom.
2. In the head (`<head>`) it finds the CSS files and downloads them. It also runs two small scripts:
   - one that sets the **theme** (dark by default, or whichever the visitor chose last time);
   - another that adds the `intro-open` class, which **blurs** the page while the bubble is on screen.
3. It reads the body (`<body>`): the bubble screen, the header, the sections, the footer.
4. At the end of the `<body>` it finds the `<script>` tags and runs them in order: `config.js`, `i18n.js`, `main.js` and then the ones in `experience/`.
5. Once all the HTML has been read, the `DOMContentLoaded` event fires. At that moment:
   - `main.js` applies the texts for the language, the theme, the menu, the scroll animations, etc.
   - `page.js` starts the experience layer: it creates the particle canvases, the controls, the voice bubble and the bubble screen.
6. The visitor sees the bubble emerging, the AL code falling in the background, and a welcome text that types itself out.
7. When the bubble is tapped: a "pop" and a chord sound, the bubble bursts, the page goes from blurred to sharp and the music starts.
8. Once on the site, the visitor can switch language or theme, stop the music, turn off the particles, tap the "Listen to me" speech bubble to hear your message (with captions and a guided tour), and write to you through the form.

---

## 2. The three languages of the web, explained from Java and AL

This chapter is the foundation for everything else. It does not explain what all languages have in common, but rather **what is specific to the web** and what is most surprising when you come from Java or AL.

### 2.1 HTML: the structure

#### Tags, elements and attributes

HTML is not a programming language: it has no variables and no logic. It is a **markup** language: it describes what each thing is. It is written with **tags**:

```html
<p class="hero-role" data-i18n="hero.role">Microsoft Dynamics 365 Business Central / AL Developer</p>
```

- `<p>` opens an **element** of type paragraph; `</p>` closes it. Whatever is inside is its content.
- `class="hero-role"` and `data-i18n="hero.role"` are **attributes**: extra data about the element, in the format `name="value"`.
- Some elements have no content and are not closed: `<img ... />`, `<input ... />`, `<meta ... />`.

Elements are nested inside one another, forming a **tree**:

```html
<section id="about">
  <div class="container">
    <h2>About me</h2>
    <p>Text…</p>
  </div>
</section>
```

#### The DOM: HTML turned into objects

When the browser reads the HTML, it builds a tree of objects in memory called the **DOM** (*Document Object Model*). Each tag becomes an object with properties and methods. JavaScript does not modify the HTML file; it modifies **the DOM**, and the browser redraws the screen immediately.

An analogy with AL: the HTML is like the definition of a page in AL (the `layout` with its `group` and `field` entries), and the DOM would be that page already open in memory, which code can act on at runtime (showing or hiding fields, changing values…).

#### The attributes you will see most on this site

| Attribute | What it is for |
|---|---|
| `id="contact"` | Unique identifier across the whole page. It is used to find the element from JS (`getElementById`) and for internal links (`href="#contact"` jumps to that element). |
| `class="section section-alt"` | One or more "labels" separated by spaces. CSS uses them to apply styles and JS uses them to find elements. An element can have many classes. |
| `data-algo="valor"` | Attributes you invent yourself. Anything starting with `data-` is free to use. Here, for example, `data-i18n` (which translated text goes inside) and `data-lang` (which language a button activates) are used. |
| `aria-*` and `role` | **Accessibility**: information for screen readers (used by blind people). For example, `aria-hidden="true"` means "this is decorative, ignore it"; `aria-pressed="true"` indicates that a toggle-type button is switched on; `aria-label` gives a name to a button that only contains an icon. |
| `href` | Destination of an `<a>` link. |
| `src` | File loaded by an `<img>` image or a `<script>`. |

#### Semantic HTML

Some tags do not change the appearance, but they do change the **meaning**: `<header>` (header), `<nav>` (navigation menu), `<main>` (main content), `<section>` (section), `<article>` (self-contained block, such as each card), `<footer>` (footer). They matter for accessibility and for search engines (SEO). `<div>` and `<span>` are generic containers with no meaning: `<div>` takes up a whole line (a **block** element) and `<span>` sits inside a line of text (an **inline** element).

#### SVG: drawings made with code

The site's icons are not images: they are **SVG**, vector drawings written inside the HTML:

```html
<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
```

- `viewBox="0 0 24 24"` defines a 24×24 coordinate canvas.
- `<path d="...">` is a stroke. `M8 5` means "move the pen to (8,5)", `v14` "vertical line of 14", `l11-7` "relative line of (+11,−7)", `z` "close the shape". That particular path draws the "play" triangle.
- `fill="currentColor"` makes the icon take the text color of the element that contains it, so it can be recolored from CSS.

Other shapes: `<circle cx cy r>` (circle), `<rect x y width height rx>` (rectangle; `rx` rounds the corners).

### 2.2 CSS: the appearance

#### Rules, selectors and properties

A CSS rule says "apply these properties to these elements":

```css
.hero-role {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary-soft);
}
```

- `.hero-role` is the **selector**: which elements are affected.
- Inside the braces, `property: value;` pairs.

Types of selectors used on the site:

| Selector | Meaning |
|---|---|
| `p` | All `<p>` elements. |
| `.btn` | Elements with the class `btn`. |
| `#main` | The element with `id="main"`. |
| `.hero .btn` | `.btn` elements that are **inside** (at any depth) a `.hero`. |
| `body > main` | A `<main>` that is a **direct child** of `<body>`. |
| `.btn.btn-primary` | Elements that have **both** classes at once. |
| `a, button` | Several selectors sharing the same rules. |
| `[aria-pressed="true"]` | Elements with that attribute and value. |
| `:hover`, `:focus-visible` | **Pseudo-classes**: states. `:hover` means "with the mouse over it"; `:focus-visible`, "selected with the keyboard". |
| `:nth-child(2)` | The second child of its parent. Used to give each card a different color. |
| `:not(.intro)` | Everything that does **not** have the `intro` class. |
| `::before`, `::after` | **Pseudo-elements**: two "ghost boxes" that CSS can create inside any element without touching the HTML. They are used constantly for decoration: the tail of the speech bubble, the ring around the bubble, etc. They need `content: ""` to exist. |

#### The cascade and specificity

If several rules affect the same element and contradict each other, the winner is:

1. The most **specific** one: an `#id` weighs more than a `.class`, and a `.class` more than a `p` tag. `.a.b` weighs more than `.a`.
2. If they weigh the same, **the last one** to appear in the code.
3. `!important` forces a property above everything else (it is used sparingly, only in specific cases).

That is why the order in which the CSS files are loaded matters: first `styles.css` (the base) and then the ones in `experience/`, which can override things.

#### CSS variables (custom properties)

```css
:root {
  --color-accent: #2f6fed;
}
.btn-primary { background: var(--color-accent); }
```

- `--color-accent` is a variable. It is defined once and used with `var(--color-accent)`.
- `:root` is the root element (`<html>`): whatever is defined there applies to the whole page.
- The big advantage: **dark mode only redefines the variables**, and everything that uses them changes color automatically (chapter 4).
- A variable can also have a default value: `var(--rx, 0deg)` uses `0deg` if `--rx` is not defined. JavaScript can change variables on any element, and that is how it communicates with the CSS (for example, to tilt the cards in 3D).

#### Units

| Unit | Meaning |
|---|---|
| `px` | Pixels. |
| `rem` | Multiples of the base font size (normally 16 px). `1.5rem` = 24 px. Used so that everything scales if the user enlarges the text. |
| `em` | Multiples of the element's own font size. |
| `%` | Percentage of the parent element. |
| `vw` / `vh` | 1% of the window's width / height. |
| `vmin` | 1% of the window's shorter side (used so that the bubble fits in both landscape and portrait). |
| `ch` | Width of the "0" character. `max-width: 62ch` limits a paragraph to about 62 letters per line, which is comfortable to read. |
| `ms` / `s` | Milliseconds / seconds (animations). |
| `deg` | Degrees (rotations). |
| `fr` | A "fraction" of the free space, in grids. |

And three very useful functions:

- `min(320px, 100%)`: the smaller of the two. "Be 320 px wide, but never wider than the available space."
- `clamp(2.2rem, 4.5vw, 3.4rem)`: "4.5vw, but never less than 2.2rem or more than 3.4rem". It makes headings grow with the screen without overdoing it.
- `calc(100vw - 2.4rem)`: arithmetic that mixes units.

#### The box model

Every element is a box made of, from the inside out: content, `padding` (inner spacing), `border` and `margin` (outer spacing). The rule `box-sizing: border-box` (at the start of `styles.css`) makes `width` include the padding and the border, which greatly simplifies the calculations.

#### Placing things: flex and grid

- **Flexbox** (`display: flex`): places the children **in a row** (or in a column with `flex-direction: column`). `gap` is the space between children; `align-items: center` centers them vertically; `justify-content: space-between` spreads them as far apart as possible. Example: the header (logo on the left, menu on the right).
- **Grid** (`display: grid`): places the children in a **grid** of rows and columns. `grid-template-columns: 1fr 1fr` means two equal columns. Example: the contact section (text on the left, form on the right) and the Business Central cards.

#### Positioning and layers (z-index)

| `position` | Behavior |
|---|---|
| `static` | Normal, in the page flow (the default value). |
| `relative` | Normal, but serves as the **reference** for `absolute` children. |
| `absolute` | Leaves the flow and is placed with `top/left/right/bottom` relative to the nearest `relative` ancestor. Example: the "Listen to me" speech bubble on the corner of your photo. |
| `fixed` | Placed relative to the **window**: it does not move when you scroll. Example: the music player. |
| `sticky` | Normal until it reaches the edge while scrolling, and then it stays stuck there. Example: the header. |

`inset: 0` is the shorthand for `top: 0; right: 0; bottom: 0; left: 0` (fill the whole parent).

`z-index` decides which layer ends up on top when two elements overlap: the higher the number, the higher the layer. **But** there is an important trap that shows up on this site: some styles (for example, `transform`, `filter` or an `opacity` below 1) create a **stacking context**, that is, a "closed box" of layers. A child with `z-index: 9999` inside that box can never end up above something outside it that has a higher z-index than the box as a whole. On top of that, `transform` makes a child with `position: fixed` stop being fixed to the window and become fixed to that parent instead. That is why the voice captions are created directly in `<body>` and not inside your photo (chapter 13).

The site's layers, from bottom to top:

| z-index | Element |
|---|---|
| 0 – 1 | Decorative backgrounds and section content |
| 50 | Seasonal particle canvas |
| 100 | Fixed header |
| 900 | Music player and animation button |
| 1000 | Opening bubble screen |
| 1001 | Wave canvas (bubble bursts) |
| 1100 | Voice message captions (always above everything) |

#### Transitions and animations

- **Transition**: when a property changes (for example, because JS adds a class), instead of changing all at once it changes gradually.
  ```css
  .reveal { opacity: 0; transition: opacity 0.7s ease; }
  .reveal.is-visible { opacity: 1; }
  ```
  When `is-visible` is added, the opacity goes from 0 to 1 over 0.7 seconds.
- **Animation with `@keyframes`**: a sequence defined by keyframes that plays by itself:
  ```css
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }
  .scroll-hint svg { animation: bob 2.2s ease-in-out infinite; }
  ```
  Format of `animation`: name, duration, curve, (delay), iteration count.
- **Speed curves (*easing*)**: `linear` (constant), `ease`, `ease-in-out` (starts and stops smoothly), or a custom curve such as `cubic-bezier(0.22, 1, 0.36, 1)` (starts fast and slows down very gently). If the second number is greater than 1, the animation "overshoots" slightly and comes back, which gives a bounce effect.
- **`transform`**: moves (`translate`), scales (`scale`) or rotates (`rotate`) an element **without affecting the rest** of the page, and the browser does it on the graphics card, so it is very smooth. That is why almost every animation uses `transform` and `opacity`.

#### Media queries: adapting to each screen and preference

```css
@media (max-width: 900px) { /* rules only for screens 900 px wide or less */ }
@media (prefers-reduced-motion: reduce) { /* the user asked for less motion */ }
@media (pointer: coarse) { /* touch screen */ }
```

The site has three *breakpoints*: **900 px** (tablet: the photo moves above the text), **760 px** (the hamburger menu appears) and **600 px** (mobile).

`prefers-reduced-motion` is an operating-system accessibility option for people who get dizzy from animations. The site respects it everywhere: if it is turned on, almost everything appears without movement.

### 2.3 JavaScript: the behavior

#### What changes most compared with Java

| Java | JavaScript |
|---|---|
| Static typing: `int n = 5;` | Dynamic typing: `var n = 5;` and then `n = "hola"` is valid. |
| Must be compiled | Interpreted directly by the browser. |
| Classes are mandatory | You can write everything with standalone functions and objects. |
| `String`, `int`, `boolean`, `double` | `string`, `number` (every number is a floating-point number), `boolean`, plus `null` and `undefined` ("has no value"). |
| `==` compares references for objects | Always use `===` (strict equality, with no strange conversions). |

This site uses `var` to declare variables (the classic way, compatible with every browser). Functions are declared with `function name(parameters) { ... }`.

#### Object literals: like living JSON

```js
var CONFIG = {
  professionalEmail: "luciaes.dev@gmail.com",
  cvPdfUrl: null,
  education: { damCompletedYear: null }
};
CONFIG.professionalEmail;      // "luciaes.dev@gmail.com"
CONFIG["professionalEmail"];   // the same, with the name as a string
```

An object is a set of key-value pairs, similar to a Java `HashMap<String, Object>` or an AL `JsonObject`. The values can be anything: texts, numbers, other objects, lists... **or functions**:

```js
var Music = {
  playing: false,
  start: function () { this.playing = true; }
};
Music.start();
```

Inside a function that belongs to an object, `this` is that object (as in Java). This is how the "modules" of this site are organized: `XP.Sound`, `XP.Music`, `XP.Seasons`… are objects with data and functions, playing the role of a class with a single instance.

**Lists** (arrays) are written with square brackets: `[1, 2, 3]`. They have methods that are used a lot on the site:

- `lista.forEach(function (x) { ... })`: runs the function for each element.
- `lista.map(function (x) { return ...; })`: creates a new list by transforming each element.
- `lista.filter(function (x) { return condicion; })`: creates a list with the elements that meet the condition.
- `lista.push(x)`: adds to the end. `lista.length`: number of elements.

#### Functions are values (callbacks)

In JavaScript a function can be stored in a variable, passed as a parameter or returned, just like any other value. A function you pass so that it "gets called back later" is called a **callback**:

```js
setTimeout(function () { console.log("han pasado 2 segundos"); }, 2000);
```

Here `setTimeout` is given a function without a name (an **anonymous function**) that will run in 2000 ms. The closest thing in Java is a lambda: `() -> System.out.println(...)`.

#### Closures: functions that remember

A function defined inside another one **remembers the outer function's variables**, even after the outer function has finished:

```js
function Captions(frame) {
  var current = -1;              // variable "privada"
  function showCue(i) { current = i; }
  return { open: function () { /* can use current and showCue */ } };
}
```

Whoever calls `Captions(...)` receives an object with `open`, but cannot touch `current` directly. This is how you get **private attributes** without classes: the equivalent of Java's `private`, or of the global variables of an AL codeunit, which only its own procedures can use.

#### IIFE and "use strict": each file in its own bubble

Every JS file on the site starts and ends the same way:

```js
(function () {
  "use strict";
  // … all the code of the file …
})();
```

- `(function () { ... })();` defines a function and **runs it on the spot**. It is called an **IIFE** (*Immediately Invoked Function Expression*). Its purpose is to make the file's variables local to that function so they do not mix with those of other files. Without it, all the variables of all the files would share a single global space and could overwrite one another.
- `"use strict";` turns on **strict mode**: the browser raises an error for slips it would normally let through (for example, using a variable without declaring it). It is like turning on more compiler warnings.

Whatever a file **does** want to share, it deliberately attaches to `window` (the browser's global object): `window.SITE_CONFIG`, `window.TRANSLATIONS`, `window.XP`.

#### Events: the equivalent of AL subscribers

The whole site runs on **events**. The browser fires events when things happen (a click, a key press, scrolling, resizing the window, the end of an audio clip…) and your code **subscribes** to them:

```js
boton.addEventListener("click", function (e) {
  // runs every time someone clicks the button
});
```

The comparison with AL is very direct:

| AL | JavaScript |
|---|---|
| `[EventSubscriber(ObjectType::Table, Database::Customer, 'OnAfterInsertEvent', ...)]` | `elemento.addEventListener("click", ...)` |
| The publisher (the table) | The DOM element (the button) |
| The event (`OnAfterInsertEvent`) | The event type (`"click"`) |
| The subscriber procedure | The function you pass in |
| Event parameters (`var Rec`) | The `e` (*event*) object with the data: which key, where the click happened… |

Inside the subscriber, the `e` object has some important methods:

- `e.preventDefault()`: **cancels the browser's default action** (for example, the mouse wheel scrolling the page, or a form reloading the page). The guided tour uses it to block scrolling.
- `e.stopPropagation()`: stops the event from "bubbling up" to parent elements. In the DOM, events **propagate upward** (*bubbling*): a click on a button is also a click on its `<div>`, on `<body>`, and so on.
- `e.target`: the exact element where it happened.

Events used on the site: `click`, `keydown` (a key was pressed), `input` (a field changed), `submit` (a form is submitted), `wheel` (mouse wheel), `touchmove` (dragging a finger), `pointermove` (moving the mouse), `resize` (the window size changed), `visibilitychange` (you switched tabs), `ended` (an audio clip finished), `DOMContentLoaded` (the HTML is ready).

#### Finding and modifying DOM elements

```js
document.getElementById("contactForm");        // por id
document.querySelector(".hero-photo-frame");   // the first one matching a CSS selector
document.querySelectorAll(".reveal");          // all the ones matching it (a list)
el.closest(".lang-btn");                       // the closest ancestor (or itself) matching the selector
```

And to change them:

```js
el.textContent = "Hello";                // changes the text
el.innerHTML = "Hello <strong>you</strong>"; // changes the content, parsing HTML
el.setAttribute("aria-pressed", "true"); // changes an attribute
el.classList.add("is-visible");          // adds a class (and the CSS does the rest)
el.classList.remove("is-open");
el.classList.toggle("is-off", condition);
el.style.left = "20px";                  // inline style
document.createElement("div");           // creates a new element
parent.appendChild(el);                  // adds it inside another one
el.remove();                             // removes it
```

This is **the central pattern of the whole site**: JavaScript almost never "draws" anything; it simply **adds or removes classes**, and the CSS decides what each state looks like (`is-open`, `is-visible`, `is-popping`, `is-playing`…). That keeps logic and appearance separate.

#### Timers

- `setTimeout(fn, ms)`: runs `fn` once, after `ms` milliseconds. It returns an identifier so you can cancel it with `clearTimeout(id)`.
- `setInterval(fn, ms)`: runs `fn` every `ms` milliseconds, until `clearInterval(id)`.
- `requestAnimationFrame(fn)`: runs `fn` **just before the next frame** is drawn on screen (normally 60 times per second). It is the correct way to animate with code: it is synchronized with the screen refresh and pauses by itself if the tab is not visible. For a continuous animation, the function requests itself again at the end:
  ```js
  function frame() { dibujar(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
  ```

JavaScript in the browser has **a single thread**: there is no `Thread` as in Java. Nothing runs "at the same time"; timers and events are put in a queue and handled one at a time once the current code finishes. That is why you never "wait" with a loop: you schedule a callback and carry on.

#### Promises: operations that finish later

Some operations take time (sending the form over the internet, starting to play an audio clip). Instead of blocking, they return a **promise** (*Promise*): an object that "promises" a future result. You chain callbacks onto it:

```js
audio.play()
  .then(function () { /* it started playing */ })
  .catch(function () { /* it failed (for example, the browser blocked it) */ });
```

It is similar to a Java `CompletableFuture` with `thenRun` and `exceptionally`.

#### try/catch and localStorage

`try { ... } catch (e) { ... }` works just as in Java. It is used above all around **`localStorage`**, a small key-value text store that the browser keeps **per site and per visitor**, and that survives closing the browser:

```js
localStorage.setItem("lucia-portfolio-lang", "es");
localStorage.getItem("lucia-portfolio-lang");   // "es" (or null if it does not exist)
```

This is how the site remembers the language, the theme and whether the particles were turned off. It is wrapped in `try/catch` because in private browsing, or with certain settings, accessing it throws an error, and the site must keep working just the same.

#### The ternary operator and "default values"

Used a lot in the code:

```js
var label = on ? "Music: on" : "Music: off";   // if on, the first; otherwise, the second
var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;   // if the first does not exist, use the second
if (!intro) return;                                 // "if it does not exist, leave"
```

`||` returns the first value that "exists" (that is not `null`, `undefined`, `0`, `""` or `false`). `!!x` converts any value to a boolean.

With this you now have everything you need to read the rest of the guide.

---

## 3. index.html: the page structure

`index.html` is the site's only page. It contains **all the content** (in English, as the default text) and the references to the CSS and JS files. Let us go block by block, from top to bottom.

### 3.1 The skeleton

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  … configuration, CSS, early scripts …
</head>
<body>
  … everything visible …
  … JS scripts at the end …
</body>
</html>
```

- `<!DOCTYPE html>` tells the browser that this is modern HTML.
- `<html lang="en" data-theme="dark">`: the root element. `lang` indicates the language (JS changes it when translating). `data-theme="dark"` is the **default dark mode**: the CSS looks at this attribute to choose the colors.
- `<head>`: information *about* the page, which is not directly visible.
- `<body>`: what you see.

### 3.2 The `<head>`

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title data-i18n="meta.title">Lucía Esteban | Microsoft Dynamics 365 Business Central / AL Developer</title>
<meta name="description" content="Portfolio of …" data-i18n-attr="content:meta.description" />
<meta name="theme-color" content="#0b2545" />
```

- `charset="UTF-8"`: the character encoding (so that "Lucía" and "ñ" display correctly).
- `viewport`: **essential for mobile devices**. Without it, a phone would display the site as if it were a miniature desktop computer. With `width=device-width` the site adapts to the phone's real width.
- `<title>`: the title of the browser tab. It has `data-i18n` so that it gets translated.
- `description`: the summary Google shows in its results.
- `theme-color`: the color of the browser bar on some phones.

**Open Graph** (the preview shown when the link is shared on LinkedIn, WhatsApp…):

```html
<meta property="og:title" content="…" />
<meta property="og:image" content="assets/img/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
```

**Icons and fonts:**

```html
<link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg" />
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png" />
<link rel="canonical" href="https://luciaesteban.github.io/" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

- `favicon`: the "LE" icon in the tab; `apple-touch-icon` is the one used if someone adds the site to their iPhone home screen.
- `canonical`: the "official" address of the site, for search engines.
- The fonts come from **Google Fonts**: *Inter* (normal text) and *JetBrains Mono* ("code-style" text, such as the small uppercase labels). `preconnect` opens the connection to Google ahead of time so that they load faster. `display=swap` shows the text in a system font while the proper one downloads, instead of leaving it invisible.

**The CSS files, with a version number:**

```html
<link rel="stylesheet" href="assets/css/styles.css?v=202609231334" />
<link rel="stylesheet" href="assets/css/experience/intro.css?v=202609231334" />
…
```

The `?v=202609231334` is not part of the file name: it is a **cache-busting parameter**. Browsers keep a copy of files so they do not have to download them again. If you change `styles.css` but the link stays identical, a visitor might keep seeing the old version. By changing the number with every release, the browser sees "a different address" and downloads it again. This is explained further in chapter 16.

**Theme script, before anything is painted:**

```html
<script>
  (function () {
    try {
      var saved = localStorage.getItem("lucia-portfolio-theme");
      var theme = saved === "light" || saved === "dark"
        ? saved
        : "dark"; // first visit: always dark, whatever the OS setting
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {
      // Storage blocked (private browsing, strict settings): the dark default on <html> stays.
    }
  })();
</script>
```

It lives inside the `<head>`, and not in `main.js`, on purpose. Scripts at the end of the `<body>` run **after** the browser has already started painting. If the theme were set there, someone who had chosen light mode would see a dark→light flicker. Because it runs in the `<head>`, the `data-theme` attribute is already correct before the first frame. `document.documentElement` is the `<html>` element.

**Intro script and `<noscript>`:**

```html
<script>document.documentElement.classList.add("intro-open");</script>
<noscript><style>.intro{display:none!important} …</style></noscript>
```

- It adds the `intro-open` class to `<html>`. The CSS (`intro.css`) uses that class to **blur the page** and block scrolling while the bubble is on screen.
- `<noscript>` is only used if the visitor has JavaScript turned off. In that case it hides the intro (which could never be closed without JS) and removes the blur, so the site remains readable. It is a good example of **graceful degradation**: the site works even if the "extras" fail.

### 3.3 The bubble screen (intro)

```html
<div class="intro" id="intro" role="dialog" aria-modal="true" aria-labelledby="introName">
  <span class="intro-orb" aria-hidden="true"></span>   (×4: blurred colour spots)
  <div class="intro-stage">
    <button type="button" class="intro-bubble">
      <span class="intro-content">
        <img class="intro-avatar" src="assets/img/profile-image.jpg" alt="" width="120" height="120" />
        <span class="intro-eyebrow" data-intro-text="eyebrow">Portfolio</span>
        <span class="intro-name" id="introName">Lucía Esteban Peña</span>
        <span class="intro-role" data-intro-text="role">…</span>
        <span class="intro-cta"><span aria-hidden="true">✦</span> <span data-intro-text="cta">Tap the bubble</span></span>
      </span>
    </button>
    <div class="intro-options">
      <button type="button" data-intro-music aria-pressed="true">♪ Music: on</button>
    </div>
  </div>
  <p class="intro-hint" data-intro-text="hint">Press Enter to come in</p>
</div>
```

- It is a layer that covers the whole screen. `role="dialog"` and `aria-modal="true"` tell screen readers that it is a window covering everything else.
- **The bubble is a `<button>`**, not a `<div>`. That way it can be activated from the keyboard (Tab + Enter) and screen readers announce it as a button. This is a general rule across the site: anything that can be pressed is a `<button>` or an `<a>`.
- The `data-intro-text="…"` attributes indicate which text goes inside; `intro.js` fills them in the chosen language.
- `alt=""` on the photo: empty alternative text because it is decorative (the name is already written next to it).
- Whatever is not in the HTML (the falling AL code, the language selector, the welcome text, the little bubbles) is **created by `intro.js`** in code, because it depends on the language and the screen size.

### 3.4 Skip-to-content link

```html
<a class="skip-link" href="#main" data-i18n="skipLink">Skip to main content</a>
```

It is invisible (positioned off screen) until someone navigating with the keyboard presses Tab: then it appears in the top left corner. It lets them skip the menu. It is a standard accessibility practice.

### 3.5 Header and menu

```html
<header class="site-header" id="top">
  <div class="container header-inner">
    <a class="logo" href="#top" aria-label="Lucía Esteban, home">
      <span class="logo-mark" aria-hidden="true">LE</span>
      <span class="logo-text">Lucía Esteban</span>
    </a>

    <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="primaryNav">
      <span class="nav-toggle-bar" aria-hidden="true"></span>  (×3: the hamburger menu lines)
      <span class="sr-only">Menu</span>
    </button>

    <nav class="primary-nav" id="primaryNav" aria-label="Primary">
      <ul>
        <li><a href="#expertise" data-i18n="nav.expertise">Business Central</a></li>
        …
        <li><a href="#contact" class="nav-cta" data-i18n="nav.contact">Contact</a></li>
      </ul>
      <div class="lang-switch" role="group" aria-label="Language">
        <button type="button" class="lang-btn" data-lang="en" aria-pressed="true">EN</button>
        <span class="lang-divider" aria-hidden="true">|</span>
        <button type="button" class="lang-btn" data-lang="es" aria-pressed="false">ES</button>
      </div>
      <button type="button" id="themeToggle" class="theme-toggle" …>
        <svg class="icon-sun" …>…</svg>
        <svg class="icon-moon" …>…</svg>
      </button>
    </nav>
  </div>
</header>
```

Key points:

- **Internal links**: `href="#expertise"` jumps to the element with `id="expertise"`. No JavaScript is needed for this; the CSS `scroll-behavior: smooth` makes the jump smooth.
- `.container` is a centered box with a maximum width of 1120 px; it is repeated in every section so that the content lines up.
- **Hamburger button** (`nav-toggle`): only visible on narrow screens. `aria-expanded` indicates whether the menu is open; `main.js` changes it and the CSS uses it to turn the three bars into an "X". `sr-only` is text for screen readers only (*screen reader only*).
- **Language**: two buttons with `data-lang`. `aria-pressed` marks the active one, and the CSS underlines it.
- **Theme**: a button with two SVG icons (sun and moon). The CSS shows one or the other depending on `data-theme`.

### 3.6 The hero (the introduction)

"Hero" is the name web design gives to the main block at the very top of the page.

```html
<section class="hero" aria-labelledby="hero-heading">
  <div class="bubble-field bubble-field-hero" aria-hidden="true">
    <span class="bubble bubble-a"></span> … (background colour spots)
  </div>
  <div class="container hero-inner">
    <div class="hero-copy reveal">
      <p class="eyebrow" data-i18n="hero.eyebrow">Portfolio</p>
      <h1 id="hero-heading" data-i18n="hero.name">Lucía Esteban Peña</h1>
      <p class="hero-role" data-i18n="hero.role">…</p>
      <p class="hero-tagline" data-i18n="hero.tagline">I build and maintain <strong>AL extensions…</strong>…</p>
      <div class="hero-badges">
        <span class="hero-badge" data-i18n="hero.badgeRemote">100% remote</span>
        <span class="hero-badge" data-i18n="hero.badgeLanguages">English &amp; Spanish</span>
      </div>
      <p class="hero-availability" data-i18n="hero.availability">…</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="#expertise" …>Explore my Business Central work</a>
        <a class="btn btn-secondary" href="#contact" …>Get in touch</a>
      </div>
    </div>
    <div class="hero-photo reveal">
      <div class="hero-photo-frame">
        <svg class="hero-mockup-card" …>…</svg>
        <img src="assets/img/profile-image.jpg" alt="" data-i18n-attr="alt:hero.photoAlt" width="360" height="360" />
      </div>
    </div>
  </div>
  <a class="scroll-hint" href="#expertise" …><span>Scroll to explore</span><svg …/></a>
</section>
```

- `aria-labelledby="hero-heading"` links the section to its heading for screen readers.
- There is only **one `<h1>`** on the page (your name). Section headings are `<h2>` and card headings are `<h3>`. This hierarchy matters for search engines and accessibility.
- `&amp;` is how the `&` character is written inside HTML (because `&` has a special meaning).
- **`reveal`**: elements with this class start out invisible and appear with a slight shift when they come into view (`main.js` does this).
- **`hero-mockup-card`**: the SVG drawing of an "application window" that peeks out at an angle behind your photo. It uses the color variables (`fill="var(--color-primary)"`), so it changes with the theme.
- `data-i18n-attr="alt:hero.photoAlt"`: translates the `alt` **attribute** (alternative text), not the content.
- `width` and `height` on images: even if the CSS later changes the size, this lets the browser reserve the space before downloading the image, so the page does not "jump".
- `.hero-photo-frame` is the container for your photo. `voice.js` adds the "Listen to me" speech bubble to it.

### 3.7 Content sections

They all follow the same pattern:

```html
<section class="section section-expertise" id="expertise" aria-labelledby="expertise-heading">
  <div class="bubble-field" aria-hidden="true">…</div>
  <div class="container">
    <p class="eyebrow reveal" data-i18n="expertise.eyebrow">What I do</p>
    <h2 id="expertise-heading" class="reveal" data-i18n="expertise.title">Business Central expertise</h2>
    <p class="section-intro reveal">…</p>
    … the section's own content …
  </div>
</section>
```

- **eyebrow**: the small uppercase label above the heading.
- **Business Central (`#expertise`)**: the introduction includes `<strong id="expertiseDuration"></strong>`, an empty slot that `main.js` fills with your calculated length of experience ("1 year and 6 months"). After that comes `.expertise-grid` with six `<article class="expertise-card reveal">` elements, each with an SVG icon, an `<h3>` and a paragraph.
- **Ecosystem (`#ecosystem`)**: three groups (`ring-core`, `ring-professional`, `ring-additional`), each with a `<ul class="chip-list">` list of `<li class="chip">` "chips". The translation keys end in numbers (`ecosystem.core.items.0`) because in `i18n.js` they are lists and are accessed by position.
- **AI (`#ai`)**: just a heading and a paragraph.
- **Journey (`#journey`)**: an ordered list `<ol class="timeline">` of `<li class="timeline-item">` elements. Each one has a dot (`timeline-dot`), a label (Education/Professional), a title and a text. The professional one contains `<p id="timelineStartLabel">` ("Since 2025") and `<p id="timelineCompany">`, which `main.js` fills in. The last dot has `timeline-dot-pulse` (it pulses, because it is ongoing).
- **About me (`#about`)**: four paragraphs with keys `about.paragraphs.0` to `3`.
- **Beyond the code (`.section-beyond`)**: the landscape photo and a text. The image is linked directly from Unsplash (a free photo bank), with `srcset` to provide a larger version for high-density (*retina*) screens and `loading="lazy"` so that it is not downloaded until the visitor gets close to that area.

  ```html
  <img src="https://images.unsplash.com/…?w=320&amp;h=320…"
       srcset="…w=320… 1x, …w=480… 2x"
       alt="Mountain lake at sunset" data-i18n-attr="alt:beyond.photoAlt"
       width="160" height="160" loading="lazy" />
  ```

### 3.8 Contact and form

```html
<section class="section section-contact" id="contact" …>
  <div class="container contact-inner contact-grid">
    <div class="contact-copy reveal">
      … eyebrow, title, text …
      <div class="contact-links">
        <a id="contactEmail" class="contact-link" href="#" …>Email</a>
        <a id="contactLinkedIn" class="contact-link" href="#" target="_blank" rel="noopener" …>LinkedIn</a>
        <a id="contactGithub" …>GitHub</a>
        <a id="contactCv" …>Download CV</a>
      </div>
    </div>

    <form class="contact-form reveal" id="contactForm" novalidate aria-labelledby="contactFormTitle">
      <h3 id="contactFormTitle" data-i18n="contact.form.title">Send me a message</h3>
      <div class="form-row">
        <label for="cfName" data-i18n="contact.form.name">Name</label>
        <input id="cfName" name="name" type="text" autocomplete="name" required maxlength="100" />
      </div>
      … email, company, message (textarea) …
      <input class="form-hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <button type="submit" class="btn contact-submit">…Send message…</button>
      <p class="form-status" id="contactFormStatus" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
```

- The links have `href="#"` as a placeholder: `main.js` sets the real address from `config.js`. `target="_blank"` opens in a new tab; `rel="noopener"` is a security measure for those cases.
- **`<label for="cfName">`**: ties the text to its field (`id="cfName"`). Clicking the label activates the field, and screen readers read the label when the field gains focus.
- `name="name"`: the name under which the value is sent and by which JS reads it (`form.elements.name`).
- `type="email"`: on mobile it shows a keyboard with "@".
- `autocomplete="name"` / `"email"` / `"organization"`: lets the browser autofill.
- `required` and `maxlength`: browser validations. But the form has `novalidate`, which **turns off** the browser's automatic messages, because `page.js` does its own validation with custom, translated messages.
- **Honeypot** (`form-hp`): a field that is invisible to people but that spam bots, which fill in every field they find, do fill in. If it arrives filled in, the message is discarded. `tabindex="-1"` prevents it from being reached with Tab.
- `form-status` with `role="status"` and `aria-live="polite"`: when JS writes something there ("Sending…", "Thank you…"), the screen reader announces it aloud.

### 3.9 Footer and scripts

```html
<footer class="site-footer">
  <div class="container footer-inner">
    <a href="#top" class="back-to-top" data-i18n="contact.backToTop">Back to top</a>
    <p><span data-i18n="footer.builtWith">Designed and developed by Lucía Esteban.</span>
       <span id="footerYear"></span> <span data-i18n="footer.rights">All rights reserved.</span></p>
  </div>
</footer>

<script src="assets/js/config.js?v=…"></script>
<script src="assets/js/i18n.js?v=…"></script>
<script src="assets/js/main.js?v=…"></script>
<script src="assets/js/experience/core.js?v=…"></script>
<script src="assets/js/experience/sound.js?v=…"></script>
<script src="assets/js/experience/visuals.js?v=…"></script>
<script src="assets/js/experience/controls.js?v=…"></script>
<script src="assets/js/experience/intro.js?v=…"></script>
<script src="assets/js/experience/voice.js?v=…"></script>
<script src="assets/js/experience/page.js?v=…"></script>
```

- `main.js` fills `footerYear` with "© " and the current year, so it never needs updating.
- **The scripts go at the end of the `<body>`** so that, when they run, all the HTML above them already exists.
- **The order matters**: each file uses things defined by the previous ones. `main.js` needs `SITE_CONFIG` (from `config.js`) and `TRANSLATIONS` (from `i18n.js`); every file in `experience/` needs `XP` (from `core.js`); and `page.js`, the last one, starts everything else. It is like the order of dependencies between apps in AL's `app.json`.

---

## 4. styles.css: the base design

`styles.css` defines the appearance of the whole base site. It is organized into blocks marked with `/* === … === */` comments.

### 4.1 "Design tokens": design variables

```css
:root {
  /* Palette */
  --color-bg: #ffffff;
  --color-bg-alt: #f4f6fb;
  --color-surface: #ffffff;
  --color-border: #e2e7f1;
  --color-ink: #0b2545;
  --color-ink-soft: #17325c;
  --color-text: #2f3c56;
  --color-text-muted: #5c6b8a;
  --color-primary: #0b2545;
  --color-primary-soft: #12386b;
  --color-accent: #2f6fed;
  --color-accent-soft: #e8f0ff;
  --color-header-bg: rgba(255, 255, 255, 0.9);

  /* Type */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;

  /* Layout */
  --container-width: 1120px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --shadow-sm: 0 1px 3px rgba(11, 37, 69, 0.08);
  --shadow-md: 0 8px 24px rgba(11, 37, 69, 0.10);
  --shadow-lg: 0 20px 48px rgba(11, 37, 69, 0.14);

  --transition-fast: 160ms ease;
  --transition-base: 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

These variables are called *design tokens*: every design decision (colors, fonts, corner radii, shadows, speeds) lives in a single place. If you wanted to change the accent blue across the whole site, you would change one line.

Colors are written in hexadecimal (`#2f6fed`: red 2f, green 6f, blue ed) or with `rgba(r, g, b, alpha)`, where alpha is the opacity (0 transparent, 1 opaque).

What each color means:

- `bg` / `bg-alt`: the page background and the alternate background (the gray sections).
- `surface`: the background of the cards.
- `ink`: headings (the highest-contrast color). `text`: normal text. `text-muted`: secondary text.
- `primary`: a fixed navy blue for panels that are dark in both themes (the contact section, the logo). **It does not change with the theme**, unlike `ink`.
- `accent`: the blue used for links, buttons and details.

The fonts have **fallbacks**: if "Inter" does not load, the system font is used (`-apple-system` on Mac, `Segoe UI` on Windows…).

Shadows (`box-shadow`) follow the format "X offset, Y offset, blur, color".

### 4.2 Dark mode

```css
:root[data-theme="dark"] {
  --color-bg: #0a1526;
  --color-bg-alt: #0f1e36;
  --color-surface: #132239;
  --color-border: #263a5c;
  --color-ink: #eef3fc;
  --color-ink-soft: #c3d1ea;
  --color-text: #c7d2e8;
  --color-text-muted: #8ea0c4;
  --color-primary-soft: #9dc0f5;
  --color-accent: #5b93f5;
  --color-accent-soft: rgba(47, 111, 237, 0.18);
  --color-header-bg: rgba(10, 21, 38, 0.85);
}
```

This is the core trick behind the theme: the selector `:root[data-theme="dark"]` means "the root element when it has `data-theme="dark"`". Because it is more specific than `:root`, **its values replace the light ones**. No other rule on the site knows whether it is in light or dark mode: they all use `var(--color-…)` and receive the correct value. Switching theme is just a matter of changing one attribute on `<html>`.

`body` has `transition: background-color …, color …` so that the theme change is a smooth fade rather than a jump.

### 4.3 Reset and base styles

```css
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
h1 { font-size: clamp(2.2rem, 4.5vw, 3.4rem); }
h2 { font-size: clamp(1.7rem, 3vw, 2.4rem); }
strong { font-weight: 700; color: var(--color-ink); }
ul, ol { margin: 0; padding: 0; list-style: none; }
button { font: inherit; }
```

Browsers come with default styles (margins, bullets on lists, different fonts on buttons…). This block "resets" them to start from a clean base:

- `*` means "every element". `box-sizing: border-box` on all of them (explained in 2.2).
- `scroll-behavior: smooth`: jumps to `#section` are smooth.
- `-webkit-text-size-adjust`: stops the iPhone from enlarging the text on its own when the screen is rotated. The `-webkit-` prefix indicates a property specific to certain browsers (Safari, Chrome).
- `line-height: 1.6`: comfortable line spacing.
- `img { max-width: 100% }`: no image can overflow its container.
- `strong` with the `ink` color: on this site normal text is a soft gray, so bold phrases are painted in the darkest color so that they genuinely stand out.
- `button { font: inherit }`: buttons use the same font as everything else (by default they would use a different one).

**Accessibility:**

```css
a:focus-visible, button:focus-visible, [tabindex]:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); … }
.skip-link { position: absolute; top: -3rem; … }
.skip-link:focus { top: 1rem; }
```

- `:focus-visible` draws a blue outline around the element selected **with the keyboard** (not with the mouse), so that someone navigating with Tab knows where they are.
- `.sr-only` makes an element invisible on screen but readable by screen readers.
- `.skip-link` sits off screen (`top: -3rem`) and drops into view when it receives focus.

### 4.4 Common utilities

```css
.container {
  max-width: var(--container-width);
  margin-inline: auto;
  padding-inline: 1.5rem;
  position: relative;
  z-index: 1;
}
.section { padding: 5.5rem 0; }
.section-alt { background: var(--color-bg-alt); }
.section-intro { max-width: 62ch; color: var(--color-text-muted); font-size: 1.05rem; }
```

- `margin-inline: auto` centers the box horizontally (automatic left and right margins). `padding-inline` is the left and right padding.
- `z-index: 1` and `position: relative` on the container keep the content always above the background color blobs (`bubble-field`, with `z-index: 0`).
- The sections alternate between white and gray backgrounds (`section-alt`) to separate them visually.

**Buttons:**

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.85rem 1.6rem;
  border-radius: 999px;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
}
.btn:hover { transform: translateY(-2px); }
.btn-primary { background: var(--color-accent); color: #fff; }
.btn-secondary { background: transparent; color: var(--color-ink); border: 1.5px solid var(--color-border); }
```

`border-radius: 999px` is a trick for making "pills" (fully rounded edges) whatever the size. On hover, the button rises 2 px with a transition.

### 4.5 Header

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-header-bg);
  backdrop-filter: saturate(180%) blur(10px);
  border-bottom: 1px solid var(--color-border);
}
.header-inner { display: flex; align-items: center; justify-content: space-between; padding-block: 0.9rem; }
.primary-nav a.is-active { color: var(--color-accent); }
```

- `sticky` + `top: 0`: the header stays stuck to the top when you scroll.
- The background is semi-transparent, and `backdrop-filter: blur(10px)` **blurs whatever passes behind it**: the "frosted glass" effect.
- `main.js` sets `is-active` on the link of the section you are reading (*scrollspy*).

**Theme icons:**

```css
.theme-toggle svg { display: none; }
.theme-toggle .icon-moon { display: block; }
:root[data-theme="dark"] .theme-toggle .icon-sun { display: block; }
:root[data-theme="dark"] .theme-toggle .icon-moon { display: none; }
```

By default the moon is shown ("switch to dark"); in dark mode the sun is shown ("switch to light"). All with CSS, no JavaScript.

**The hamburger menu turning into an X:**

```css
.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(2) { opacity: 0; }
.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
```

When `aria-expanded` becomes `true`, the top bar moves down and rotates 45°, the middle one disappears and the bottom one moves up and rotates −45°: together they form an X. Notice that the CSS reacts to an accessibility attribute: the same piece of data serves both the screen reader and the drawing.

### 4.6 Hero

```css
.hero {
  position: relative;
  padding: 5rem 0 4rem;
  background:
    radial-gradient(1200px 500px at 80% -10%, var(--color-accent-soft), transparent 60%),
    linear-gradient(180deg, var(--color-bg), var(--color-bg-alt));
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: -25% -15%;
  background: conic-gradient(from 180deg at 72% 22%, rgba(47,111,237,0.16), rgba(22,163,148,0.13), rgba(124,58,237,0.11), rgba(47,111,237,0.16));
  filter: blur(70px);
  animation: heroGradientDrift 20s ease-in-out infinite alternate;
  z-index: 0;
  pointer-events: none;
}
.hero-inner { display: grid; grid-template-columns: 1.2fr 0.8fr; align-items: center; gap: 3rem; }
```

- **Gradients**: `linear-gradient` (along a straight line), `radial-gradient` (in a circle from a point) and `conic-gradient` (rotating around a point, like a color wheel). Several backgrounds can be stacked, separated by commas; the first one sits on top.
- `::before` creates a decorative layer with a conic gradient of blue, teal and violet, heavily blurred (`blur(70px)`), that moves slowly (`alternate` makes the animation go back and forth).
- `inset: -25% -15%` makes it larger than the section, so that its edges are never visible while it moves. `overflow: hidden` on `.hero` clips whatever sticks out.
- `pointer-events: none`: the layer does not capture clicks (you can click "through" it).
- The two-column grid: text (1.2 parts) and photo (0.8 parts).

**The photo and the card behind it:**

```css
.hero-photo-frame img {
  width: min(320px, 100%);
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 28px;
  box-shadow: var(--shadow-lg);
}
.hero-mockup-card { position: absolute; z-index: 0; bottom: -22px; left: -38px; width: 190px; transform: rotate(-9deg); }
```

- `aspect-ratio: 1 / 1` forces a square; `object-fit: cover` crops the photo to fill it without distorting it.
- The SVG card is absolutely positioned, rotated −9°, peeking out from the bottom-left corner.

### 4.7 Business Central cards

```css
.expertise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr));
  gap: 1.75rem;
}
.expertise-card:nth-child(1) { border-top: 3px solid #2f6fed; }
.expertise-card:nth-child(2) { border-top: 3px solid #7c3aed; }
…
.expertise-card:nth-child(1) .expertise-icon { color: #2f6fed; background: rgba(47, 111, 237, 0.12); }
```

The grid line is one of the most powerful on the site:

- `repeat(auto-fit, …)`: "create as many columns as will fit".
- `minmax(A, 1fr)`: each column is at least A wide and at most an equal share of the space.
- `min(380px, 100%)`: A is 380 px, unless the screen is narrower, in which case it is 100%.

Result: on a desktop you get 2 columns, and on a narrow phone 1, **without a single media query**. The `min(…, 100%)` prevents the card from overflowing the screen on phones narrower than 380 px.

Each card has its own color (top border and icon) using `:nth-child(n)`.

### 4.8 The background color blobs (bubble field)

```css
.bubble-field { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.bubble { position: absolute; border-radius: 50%; filter: blur(50px); opacity: 0.16; }
.bubble-a { width: 220px; height: 220px; background: #2f6fed; top: -50px; left: 6%; animation: bubbleDriftA 17s ease-in-out infinite; }
@keyframes bubbleDriftA {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(26px, 34px); }
}
```

Colored circles (`border-radius: 50%`), heavily blurred and almost transparent, that move slowly. Each one has a different duration (15, 17, 19, 21 s) so that they never fall into sync and the movement looks natural. The sections that use them have `position: relative; overflow: hidden` so that they act as a frame and clip whatever spills out.

### 4.9 Ecosystem, journey, about me, beyond the code

**Animated grid in the "Core" group:**

```css
.ring-core::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  animation: bcGridDrift 14s linear infinite;
}
@keyframes bcGridDrift { from { background-position: 0 0, 0 0; } to { background-position: 28px 28px, 28px 28px; } }
```

Two 1 px gradients (one horizontal and one vertical) repeated every 28 px draw a **grid**, like a spreadsheet or a Business Central table. The animation shifts it by exactly 28 px, so the end matches the start and the loop is seamless.

**Timeline:**

```css
.timeline { position: relative; padding-left: 2rem; border-left: 2px solid var(--color-border); }
.timeline-dot { position: absolute; left: -2.45rem; top: 0.3rem; width: 14px; height: 14px; border-radius: 50%; … }
.timeline-dot-pulse::before { …; animation: pulse 1.8s ease-in-out infinite; }
```

The vertical line is simply the left border of the list. Each dot is absolutely positioned, shifted to the left so that it sits on top of that line. The "ongoing" dot has a halo that pulses (a `box-shadow` that grows and fades).

**Beyond the code:** `display: flex; flex-wrap: wrap` places the photo and the text in a row, and if they do not fit they wrap onto two lines. The photo is round (`border-radius: 50%`).

### 4.10 Contact and footer

```css
.section-contact { background: var(--color-primary); color: #fff; text-align: center; }
.contact-link[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.site-footer { background: #071a33; color: rgba(255, 255, 255, 0.6); }
```

The contact section uses `--color-primary` (the navy blue that does not change with the theme), so it is always dark. If a link is not configured (for example, the CV), `main.js` gives it `aria-disabled="true"` and the CSS dims it and makes it unclickable.

### 4.11 Reveal on scroll

```css
.reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
```

Everything marked with `reveal` starts invisible and 18 px lower. When `main.js` detects that it comes into view, it adds `is-visible` and the transition moves it up and fades it in.

### 4.12 Reduced motion and adapting to screens

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}

@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; text-align: center; }
  .hero-photo { order: -1; }
  …
}
@media (max-width: 760px) {
  .nav-toggle { display: flex; }
  .primary-nav { position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; display: none; … }
  .primary-nav.is-open { display: flex; }
  …
}
@media (max-width: 600px) {
  .section { padding: 3.5rem 0; }
  h1 { font-size: 2rem; }
}
```

- With reduced motion, **every** animation lasts practically zero time (`!important` to beat any other rule).
- Below 900 px, the hero switches to a single column and `order: -1` puts the photo **before** the text (without changing the HTML).
- Below 760 px, the hamburger button appears and the menu becomes a drop-down panel below the header (`top: 100%` = just below), hidden until it has the `is-open` class.
- Below 600 px, less vertical space and smaller headings.

This approach is called **responsive design**: a single HTML document that rearranges itself according to the screen size.

---

## 5. config.js: the configuration

```js
window.SITE_CONFIG = {
  businessCentralStartDate: "2025-03-01",

  professionalEmail: "luciaes.dev@gmail.com",
  linkedInUrl: "https://www.linkedin.com/in/luciaes-dev/",
  githubUrl: "https://github.com/LuciaEsteban",
  cvPdfUrl: null, // e.g. "assets/files/lucia-esteban-cv.pdf"

  contactFormEndpoint: "https://formsubmit.co/ajax/luciaes.dev@gmail.com",

  currentCompanyDisplayName: null,

  education: {
    damCompletedYear: null,
    computerEngineeringStartYear: null,
  },
};
```

It is an object holding the **data that is not translatable text**, all in one place. It is the equivalent of a setup table ("Setup") in Business Central: the rest of the code reads from here instead of having values hard-coded in several places.

- `businessCentralStartDate`: the date you started working with Business Central. Your experience ("1 year and 6 months") and the year in "Since 2025" are calculated automatically from it. **That is why the site never needs to be updated by hand as time goes by.**
- `professionalEmail`, `linkedInUrl`, `githubUrl`, `cvPdfUrl`: the contact links. If a value is `null`, the corresponding button is shown disabled ("CV coming soon") instead of leading to a broken link. To publish your CV, you would only need to upload the PDF and put its path here.
- `contactFormEndpoint`: the FormSubmit address the form is sent to (chapter 14). If it were `null`, the form would open the visitor's email program.
- `currentCompanyDisplayName`: if one day you want to show your company's name in the journey section, it goes here.

It is assigned to `window.SITE_CONFIG` so that it can be accessed from the other files.

---

## 6. i18n.js: the texts in two languages

"i18n" is the usual abbreviation of *internationalization* (an i, 18 letters, an n).

### 6.1 Structure

```js
window.TRANSLATIONS = {
  en: {
    meta: { title: "…", description: "…" },
    nav: { expertise: "Business Central", ecosystem: "Ecosystem", … },
    hero: {
      name: "Lucía Esteban Peña",
      tagline: "I build and maintain <strong>AL extensions, business reports and integrations</strong> for …",
      …
    },
    expertise: { items: { al: { title: "…", body: "…" }, … } },
    ecosystem: { core: { title: "Core", items: ["Business Central", "AL", …] }, … },
    experience: {
      years_one: "{n} year",
      years_other: "{n} years",
      months_one: "{n} month",
      months_other: "{n} months",
      lessThanAMonth: "less than a month",
      conjunction: "and",
    },
    …
  },
  es: {
    … exactly the same structure, with the text in Spanish …
  },
};
```

It is a huge object with two branches, `en` and `es`, that have **the same shape**. Each text is identified by its "path": `hero.tagline`, `expertise.items.al.title`, `ecosystem.core.items.0` (the first element of the list).

It is the same idea as AL's `Caption` properties and `.xlf` translation files: the code contains no texts, only **keys**, and the texts live separately, per language.

### 6.2 How it connects to the HTML

In the HTML:

```html
<h2 data-i18n="expertise.title">Business Central expertise</h2>
<img data-i18n-attr="alt:hero.photoAlt" …>
```

- `data-i18n="path"`: the element's **content** is replaced with the text at that path.
- `data-i18n-attr="attribute:path"`: the specified **attribute** is replaced. Several can be given, separated by `;`.

The English text written in the HTML is only an initial value (what you would see if JavaScript failed). `main.js` replaces it on load.

### 6.3 Details

- Some texts contain `<strong>…</strong>` to highlight phrases. That is why they are inserted with `innerHTML` (which interprets tags) rather than `textContent`. It is safe because the texts come from this file, never from anything a visitor types.
- **Plurals**: `years_one` / `years_other`. The code picks `_one` if the number is 1 and `_other` otherwise, and replaces `{n}` with the number. That way it writes "1 year" but "2 years".
- **Placeholders**: `since: "Since {year}"` / `"Desde {year}"`. The code replaces `{year}` with the calculated year.
- The texts for the experience layer (bubble, music, captions) are not here but in `core.js` (chapter 8), so that this layer is self-contained.

---

## 7. main.js: the base behavior

The whole file is inside an IIFE with `"use strict"` (explained in 2.3). It starts by reading what it needs:

```js
var CONFIG = window.SITE_CONFIG || {};
var TRANSLATIONS = window.TRANSLATIONS || {};
var LANG_STORAGE_KEY = "lucia-portfolio-lang";
var THEME_STORAGE_KEY = "lucia-portfolio-theme";
var prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

- `|| {}` avoids errors if, for whatever reason, the configuration file failed to load.
- `matchMedia("…").matches` lets JavaScript ask the same question as a CSS media query; here, whether the user prefers less motion.

### 7.1 Reading a path inside an object

```js
function resolvePath(obj, path) {
  var parts = path.split(".");
  var current = obj;
  for (var i = 0; i < parts.length; i++) {
    if (current == null) return undefined;
    current = current[parts[i]];
  }
  return current;
}
```

It turns `"expertise.items.al.title"` into `["expertise", "items", "al", "title"]` and walks down level by level: `obj["expertise"]["items"]["al"]["title"]`. If any level does not exist, it returns `undefined` instead of throwing an error. It also works with lists: `"ecosystem.core.items.0"` accesses position 0.

### 7.2 Language

```js
function getLang() {
  var stored = null;
  try { stored = window.localStorage.getItem(LANG_STORAGE_KEY); } catch (e) { }
  if (stored === "en" || stored === "es") return stored;
  return "en";
}
```

It reads the saved language; if there is none (first visit) or the value is not valid, English.

```js
function applyTranslations(lang) {
  var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var key = el.getAttribute("data-i18n");
    var value = resolvePath(dict, key);
    if (typeof value === "string") {
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
```

1. It picks the dictionary for the language.
2. It finds **all** the elements with `data-i18n`, reads their key, looks up the text and puts it inside.
3. It finds all the elements with `data-i18n-attr`, splits each `"alt:hero.photoAlt"` pair into attribute and key, and changes the attribute.
4. It changes the tab title.

`typeof value === "string"` checks that a text was found (if the key does not exist, whatever text was there is left untouched).

```js
function setLang(lang) {
  try { window.localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) { }
  applyTranslations(lang);
  updateLangButtons(lang);
  document.documentElement.setAttribute("lang", lang);
  renderExpertiseIntro(lang);
  renderTimelineMeta(lang);
}

function updateLangButtons(lang) {
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    var isActive = btn.getAttribute("data-lang") === lang;
    btn.setAttribute("aria-pressed", String(isActive));
  });
}
```

`setLang` saves the choice, translates, marks the active button, updates the `lang` of `<html>` and regenerates the calculated texts (experience and "Since {year}"), which depend on the language.

### 7.3 Mobile menu

```js
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
```

- `classList.toggle` adds the class if it is not there and removes it if it is, and **returns** the resulting state (`true` if it is now present). That is used to update `aria-expanded`.
- Tapping any menu link closes the menu (otherwise, on a phone it would stay open, covering the section you jumped to).

### 7.4 Reveal on scroll (IntersectionObserver)

```js
function initScrollReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
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

  items.forEach(function (el) { observer.observe(el); });
}
```

**`IntersectionObserver`** is a browser tool that notifies you when an element **enters or leaves the screen**. It is far more efficient than checking positions on every scroll movement.

- It is created with a function that receives `entries` (the changes) and some options:
  - `threshold: 0.15`: notify when at least 15% of the element is visible.
  - `rootMargin: "0px 0px -40px 0px"`: shrinks the detection area by 40 px at the bottom, so that the animation starts a little after the element peeks in.
- `observer.observe(el)` starts watching an element. When it comes in, `is-visible` is added and it stops being watched (`unobserve`): the animation only happens once.
- If the user prefers less motion or the browser is very old (`"IntersectionObserver" in window` checks whether it exists), everything is shown straight away.

### 7.5 Highlighting the current section in the menu (scrollspy)

```js
function initScrollSpy() {
  var navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
  var linksBySectionId = {};
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    if (id) linksBySectionId[id] = link;
  });
  var sections = Object.keys(linksBySectionId)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

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
```

- `a[href^="#"]`: links whose `href` **starts with** `#`.
- `.slice(1)` removes the `#` ("#about" → "about").
- It builds a map `{ "about": <About link>, … }` (like a `Dictionary` in AL) and the list of sections. `Object.keys` gives the object's keys; `.filter(Boolean)` discards sections that do not exist.
- The trick lies in `rootMargin: "-35% 0px -55% 0px"`: it shrinks the detection zone to a **narrow band** between 35% and 45% of the screen height. The section crossing that band is "the one you are reading", and its link is marked with `is-active`.

### 7.6 Calculating the experience automatically

```js
function computeDuration(startDateString) {
  var start = new Date(startDateString);
  if (isNaN(start.getTime())) return null;

  var now = new Date();
  var totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) totalMonths -= 1;
  if (totalMonths < 0) totalMonths = 0;

  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
}
```

- `new Date("2025-03-01")` creates a date; `new Date()` with no arguments is **now**.
- If the date is not valid, `getTime()` returns `NaN` (*Not a Number*) and `null` is returned.
- Total months = difference in years × 12 + difference in months. If the day of the month of the start date has not yet been reached, one is subtracted (the month is not complete).
- It returns an object with years and months: 18 months → `{ years: 1, months: 6 }`.

```js
function pluralKey(base, count) {
  return count === 1 ? base + "_one" : base + "_other";
}

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

function renderExpertiseIntro(lang) {
  var el = document.getElementById("expertiseDuration");
  …
  var parts = durationParts(lang, duration);
  var conjunction = resolvePath(dict, "experience.conjunction") || "and";
  el.textContent = parts.length === 2 ? parts.join(" " + conjunction + " ") : parts.join(" ");
}
```

For `{ years: 1, months: 6 }` in English: `pluralKey` gives `experience.years_one` → "{n} year" → "1 year", and `experience.months_other` → "{n} months" → "6 months". They are then joined with the conjunction: "1 year and 6 months". If there is only one part (for example, exactly 2 years), no "and" is added.

`renderTimelineMeta` does the same with the start year (`"Since {year}"` → "Since 2025") and, if `config.js` contains a company name, puts it in the journey section.

### 7.7 Light/dark theme

```js
function effectiveTheme() {
  var stored = getStoredTheme();
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
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
    try { window.localStorage.setItem(THEME_STORAGE_KEY, next); } catch (e) { }
    applyTheme(next);
  });
}
```

On click, it works out the opposite of the current theme, saves it and applies it by changing `data-theme`. The CSS does everything else (4.2).

### 7.8 Contact links from the configuration

```js
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

wireLink("contactEmail", CONFIG.professionalEmail, function (value) {
  return "mailto:" + value;
}, resolvePath(dict, "contact.emailUnavailable"));
```

- `hrefBuilder` is a **function passed as a parameter** that builds the link from the value. For the email it adds `mailto:` (a `mailto:` link opens the email program); for LinkedIn or GitHub it returns the URL as is.
- If the value is `null`, the link is disabled, removed from the Tab order (`tabindex="-1"`) and its text is changed to "… coming soon". `data-i18n` is removed so that switching language does not overwrite that text (which is why `initContactLinks` is called again when the language changes).

### 7.9 Startup

```js
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
      initContactLinks();
    });
  });
});
```

`DOMContentLoaded` fires when the whole HTML has been read and the DOM has been built. It is the equivalent of an AL `OnOpenPage`: the entry point where everything is initialized. Here the footer year is set, the page is translated, and all the previous functions are activated one by one. Finally, it subscribes to clicks on the language buttons.

---

## 8. The "experience" layer and core.js

### 8.1 A shared namespace: `window.XP`

The seven files in `assets/js/experience/` need to share things with one another (for example, the intro has to start the music, and the voice has to lower the music's volume). Instead of creating lots of loose global variables, they all attach whatever they share to **a single object**: `window.XP` (from *experience*).

```js
var XP = (window.XP = window.XP || {});
```

This line does two things: if `window.XP` does not exist, it creates it empty (`{}`); and it stores a reference in the local variable `XP`. The other files simply do `var XP = window.XP;` and add their modules: `XP.Sound`, `XP.Music`, `XP.Voice`, `XP.Ripple`, `XP.Seasons`, `XP.Controls`, `XP.Intro`, `XP.Listen`.

It is similar to a *namespace* or package: in Java you would group classes in `com.lucia.experience`; here objects are grouped inside `XP`.

### 8.2 Device preferences

```js
XP.reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
XP.finePointer = !!(window.matchMedia && matchMedia("(pointer: fine)").matches);
```

They are calculated once and used by every module:

- `reduceMotion`: the user asked for fewer animations.
- `finePointer`: there is a mouse (a precise pointer). On touch screens it is `false`, and effects that depend on hovering the mouse (card tilting) are not activated.

### 8.3 The texts of the experience layer

```js
XP.TEXT = {
  en: {
    eyebrow: "Portfolio",
    cta: "Tap the bubble to enter",
    welcomeText: "Welcome to my portfolio. If you would like to get to know me a little better, tap the bubble on the screen. You can also change the language in the top right corner.",
    musicOn: "♪ Music: on",
    musicOff: "♪ Music: off",
    listen: "Listen to me",
    …
    openingCues: [
      [0.21, 2.33, "Hello, and welcome to my portfolio."],
      [2.71, 5.77, "I'm Lucía Esteban, a Business Central developer."],
      [6.29, 8.45, "Here you'll discover what I work on,"],
      …
    ],
    openingTour: [
      [6.29, "#expertise"],
      [8.74, ".expertise-card:last-child"],
      [10.73, "#journey"],
      [11.98, "#about"],
      [13.72, ".section-beyond"],
      [16.68, "#contact"]
    ]
  },
  es: { … the same in Spanish, with its own timings … }
};
```

It works just like `i18n.js`, but for the experience layer. Two pieces of data are special:

- **`openingCues`** (captions): each element is `[start second, end second, sentence]`. The timings were obtained by analyzing the pauses in your recording (chapter 15). That is why the English and Spanish timings differ: they are different recordings.
- **`openingTour`** (guided tour): each element is `[second, CSS selector]`. When the voice reaches that second, the page scrolls to that element. For example, when you say "how I approach each project", it scrolls down to the last card (`.expertise-card:last-child`), which is the one about the way you work.

### 8.4 Utilities

```js
XP.lang = function () {
  var l = document.documentElement.getAttribute("lang");
  try { l = localStorage.getItem("lucia-portfolio-lang") || l; } catch (e) { }
  return l === "es" ? "es" : "en";
};

XP.t = function (key) {
  return (XP.TEXT[XP.lang()] || XP.TEXT.en)[key];
};
```

- `XP.lang()` returns the current language (the saved one or, failing that, the one on `<html>`).
- `XP.t("listen")` returns the "listen" text in the current language. The "t" stands for *translate*. Because it is called every time, it always returns the language currently in effect.

```js
var langListeners = [];
XP.onLanguageChange = function (fn) { langListeners.push(fn); };
document.addEventListener("click", function (e) {
  if (!e.target.closest || !e.target.closest(".lang-btn")) return;
  setTimeout(function () { langListeners.forEach(function (fn) { fn(); }); }, 0);
});
```

This is a small **home-made event system**, in the style of an AL publisher:

- Any module can subscribe with `XP.onLanguageChange(function)`: the function is stored in a list.
- There is a single click listener on the whole document (because events bubble up the tree, a click on a button also reaches `document`). If the click was on a `.lang-btn` (or inside one), all the subscribers are notified.
- `setTimeout(…, 0)` delays the notification "until whatever is currently running has finished". This is necessary because `main.js` also listens for that click in order to change the language, and the subscribers must run **afterwards**, once the language has already changed.

This technique of putting a single listener on a parent element instead of one on each child is called **event delegation**.

```js
XP.hz = function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); };
```

It converts a musical note in **MIDI** format into a frequency in hertz. In MIDI each note is a number: 60 is middle C, 69 is the A at 440 Hz, and each +1 is a semitone. Since in music every octave (12 semitones) doubles the frequency, the formula is 440 × 2^((note − 69) / 12). It is used in `sound.js` so that the music can be written with note numbers rather than frequencies.

---

## 9. sound.js: effects, generative music and voice

This is the most technical file. The key idea: **there are no music files**. Every sound (the "pop", the welcome chord, the guitar and the entire background music) is **synthesized in real time** with code. Advantages: there are no copyright issues, there is nothing to download, and the music never repeats itself exactly.

### 9.1 The Web Audio API: a circuit of nodes

The browser comes with a "sound studio" called the **Web Audio API**. It works like a **chain of guitar pedals**: you create modules (*nodes*) and connect them to one another with `a.connect(b)`. The sound flows from one node to the next until it reaches the speakers.

Nodes used on the site:

| Node | What it does | Analogy |
|---|---|---|
| `AudioContext` | The whole studio. It has its own clock (`ctx.currentTime`, in seconds) and the output to the speakers (`ctx.destination`). | The mixing desk |
| `OscillatorNode` | Generates a periodic wave: `sine` (smooth, "flute-like"), `triangle` (somewhat brighter), `sawtooth` (rich in harmonics, "strings"). | A vibrating string |
| `GainNode` | Controls the volume (`gain`). | A fader or knob |
| `BiquadFilterNode` | A filter. `lowpass` lets the lows through and cuts the highs (it sounds duller/warmer); `bandpass` lets a band through. | The tone control |
| `ConvolverNode` | Reverb: simulates the echo of a room. | Playing in a church |
| `DynamicsCompressorNode` | Compressor: evens out volumes so that nothing clips. | A limiter |
| `AnalyserNode` | Does not modify the sound; it lets you read its frequency spectrum. | A visual equalizer |
| `AudioBufferSourceNode` | Plays a chunk of audio held in memory (here, noise). | A sampler |

**Parameters can be scheduled over time.** This is the basis of all the synthesis:

```js
g.gain.setValueAtTime(0.0001, when);                       // at the instant "when", volume almost 0
g.gain.exponentialRampToValueAtTime(vol, when + 0.006);    // rises to "vol" in 6 ms
g.gain.exponentialRampToValueAtTime(0.0001, when + 2.6);   // and fades to almost 0 in 2.6 s
```

This shape of the volume over time is called an **envelope**: the "attack" (how quickly the note starts) and the "decay" (how it fades away). A piano has an instantaneous attack and a long decay; strings have a slow attack. An exponential curve sounds more natural than a linear one, but it cannot reach exactly 0 (which is why 0.0001 is used).

Everything is scheduled **in advance** using the context's clock (`when`), and the browser executes it with sample accuracy (1/44100 s), regardless of what JavaScript happens to be doing.

### 9.2 Browsers and sound

Browsers **do not allow sound to play until the user interacts** with the page (a click, a key press). It is a protection against sites that start making noise on their own. That is why:

- The `AudioContext` is not created on load, but when the bubble is clicked (`Sound.init()`).
- The welcome on the bubble screen is written text, not voice: the voice could not play on its own.
- Your voice message plays when the "Listen to me" speech bubble is tapped.

### 9.3 The sound engine: `XP.Sound.init`

```js
init: function () {
  if (this.ctx) {
    if (this.ctx.state === "suspended") this.ctx.resume();
    return true;
  }
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  var ctx = (this.ctx = new AC());
  …
```

- If the context already exists, it just resumes it (it may be "suspended" if it was created before an interaction) and exits. That way `init()` can be called many times without any problem.
- `webkitAudioContext` is the old name in Safari.

Next it builds the complete **circuit**, just once:

```
Effects (pop, chord, guitar)
   sfxBus ──────────────────────────────┐
     └──► effects reverb   ──► 0.35 ──►│
                                        ├──► master (0.9) ──► compressor ──► speakers
Music                                   │
   musicBus ──► warm (lowpass 2400 Hz) ─┤
                 ├──► musicGain ────────┘   (the music "fader")
                 └──► send 0.3 ──► music reverb     ──► musicGain
                                              musicGain ──► analyser (for the equalizer)
```

In code:

```js
this.master = ctx.createGain();
this.master.gain.value = 0.9;
var comp = ctx.createDynamicsCompressor();
comp.threshold.value = -14;
comp.ratio.value = 3;
this.master.connect(comp);
comp.connect(ctx.destination);

this.sfxBus = ctx.createGain();
this.sfxBus.gain.value = 0.6;
this.sfxBus.connect(this.master);
this.sfxBus.connect(fxVerb);        // un nodo puede conectarse a varios destinos

this.warm = ctx.createBiquadFilter();
this.warm.type = "lowpass";
this.warm.frequency.value = 2400;
this.musicGain = ctx.createGain();
this.musicGain.gain.value = 0;      // starts silent; the music comes in with a fade
…
this.analyser = ctx.createAnalyser();
this.analyser.fftSize = 64;
this.musicGain.connect(this.analyser);
this.newMusicBus();
```

Important details:

- A **bus** is a meeting point: all the effects go to `sfxBus` and all the music's notes go to `musicBus`. That way each group can be controlled in one go.
- **The music's reverb sits before the fader** (`musicGain`). It was done this way so that, when the music is turned off, the reverb tail is cut off too. If the reverb came after the fader, it would keep ringing for a few seconds after "off" was pressed.

```js
newMusicBus: function () {
  if (this.musicBus) { try { this.musicBus.disconnect(); } catch (e) { } }
  this.musicBus = this.ctx.createGain();
  this.musicBus.connect(this.warm);
},
```

When the music stops, there are notes **already scheduled** for the near future. Instead of tracking them down one by one, the whole bus is disconnected and a new one is created: the old notes keep "playing" into a disconnected cable, that is, in silence.

### 9.4 Reverb and noise generated with math

```js
impulse: function (seconds, decay) {
  var rate = this.ctx.sampleRate, len = rate * seconds;
  var buf = this.ctx.createBuffer(2, len, rate);
  for (var c = 0; c < 2; c++) {
    var d = buf.getChannelData(c);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
},
```

A `ConvolverNode` needs an "impulse response": a recording of how a room sounds when you clap your hands. Instead of using a recording, one is **manufactured**: random noise (`Math.random() * 2 - 1`, values between −1 and 1) that gradually fades out (`(1 − i/len)^decay`). That sounds like a pleasant, generic room. `sampleRate` is the number of samples per second (normally 44100 or 48000); two channels = stereo.

`noise()` creates one second of white noise and stores it (`this._noise`) for reuse; it is used for the "puff" of air in the pop.

### 9.5 Synthesized instruments

**Piano ("felt piano"):**

```js
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
```

A real sound is made up of a fundamental frequency and its **harmonics** (multiples: ×2, ×3…). This piano adds up three oscillators:

- the note itself (×1) with a triangle wave, lasting the whole note;
- double the frequency (×2), quieter (0.22), fading out in 0.7 s;
- triple the frequency (×3.01, slightly detuned so that it sounds less "electronic"), quieter still, fading out in 0.35 s.

Each `[multiplier, type, volume, duration]` list describes one harmonic, and `forEach` creates its nodes.

Then comes a low-pass filter that starts open (bright) and closes over 1.2 s (the brightness fades): so the note "blooms" and then turns soft, like a real piano. The overall envelope has a 6 ms attack, drops quickly to 35% and dies away over `dur` seconds.

`o.start(when)` and `o.stop(…)` schedule when each oscillator sounds and when it is destroyed. `dest || this.sfxBus`: if no destination is given, it goes to the effects bus (the music passes in its own bus).

**Strings (pad):**

```js
pad: function (freqs, when, dur, vol, dest) {
  …
  lp.frequency.value = 850;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.linearRampToValueAtTime(vol, when + 2.2);
  g.gain.setValueAtTime(vol, when + dur - 1.4);
  g.gain.linearRampToValueAtTime(0.0001, when + dur);
  freqs.forEach(function (f) {
    [-7, 7].forEach(function (cents) {
      var o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.detune.value = cents;
      …
    });
  });
},
```

A "strings"-style background chord: for each note, **two** sawtooth waves are created, one detuned 7 *cents* down and the other 7 up (a *cent* is one hundredth of a semitone). That small difference produces a gentle beating that sounds "wide", like a violin section. A filter at 850 Hz darkens it, and the envelope rises over 2.2 s and falls over 1.4 s: it fades in and out without being noticed.

**Guitar (pluck)**: a triangle wave with a filter that closes quickly (from ×8 to ×1.2 the frequency in 0.4 s) and a volume that drops over 1.2 s: the sound of a plucked string.

### 9.6 The sound effects

**Pop** (when a bubble bursts):

```js
pop: function (volume) {
  if (!this.enabled || !this.ctx) return;
  var ctx = this.ctx, now = ctx.currentTime, v = volume || 1;
  var o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(1200, now);
  o.frequency.exponentialRampToValueAtTime(180, now + 0.09);
  … volume from 0.45 to almost 0 in 0.12 s …
  var n = ctx.createBufferSource();
  n.buffer = this.noise();
  var bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2500;
  … 0.08 s of filtered noise …
},
```

Two layers: a tone that **drops** from 1200 to 180 Hz in 90 ms (the "plop") and a very short burst of filtered noise (the "air" escaping). `enabled` is `false` if the visitor entered with Escape (no sound), in which case nothing plays.

**Welcome chord (chime):**

```js
chime: function () {
  if (!this.enabled || !this.ctx) return;
  var now = this.ctx.currentTime + 0.04;
  [50, 57, 62, 66, 69, 76].forEach(function (n, i) {
    Sound.piano(hz(n), now + i * 0.05, i ? 0.13 : 0.18, null, 3.5);
  });
},
```

Six piano notes (in MIDI: D, A, D, F#, A, E: a **D major chord with an added ninth**) spaced 50 ms apart, like a quick arpeggio (a "rolled chord"). The first one (`i` = 0) is slightly louder.

**Guitar strum**: it plays the notes of whichever chord the music is on at that moment, each one 28 ms after the previous one, like a strum. It is used when the "Beyond the code" photo is clicked (because of your love of the guitar), and it always fits the music because it uses its current chord.

### 9.7 The generative music: `XP.Music`

The music is **composed while it plays**, following a set of rules.

**The harmony:**

```js
bpm: 68,
progression: [
  { bass: 38, pad: [57, 61, 64, 66], arp: [62, 66, 69, 73, 76] },   // D maj9
  { bass: 35, pad: [57, 62, 64, 66], arp: [59, 62, 66, 69, 73] },   // B m11
  { bass: 31, pad: [54, 59, 62, 66], arp: [55, 59, 62, 66, 69] },   // G maj7
  { bass: 33, pad: [55, 59, 62, 64], arp: [57, 62, 64, 67, 71] }    // A 7sus4
],
patterns: [[0, 1, 2, 4, 3, 2, 1, 2], [0, 2, 4, 3, 1, 3, 2, 4]],
```

- Tempo: 68 beats per minute (relaxed).
- A **four-chord progression** that repeats. Each chord has its bass note, the string notes (`pad`) and five notes available to the piano (`arp`, from arpeggio). Everything is in MIDI numbers.
- `patterns`: two arpeggio patterns. Each number is the position of the note within `arp`. `[0, 1, 2, 4, 3, 2, 1, 2]` means: note 0, note 1, note 2, note 4…

**The note scheduler:**

```js
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

schedule: function () {
  var eighth = 60 / this.bpm / 2;
  while (this.nextTime < Sound.ctx.currentTime + 0.25) {
    this.playStep(this.step, this.nextTime, eighth);
    this.nextTime += eighth;
    this.step++;
  }
},
```

This pattern is called **lookahead scheduling** and it is the correct way to make music in the browser:

- JavaScript timers (`setInterval`) **are not precise**: they can run several milliseconds late, which would be heard as an uneven rhythm.
- The audio clock (`ctx.currentTime`), on the other hand, is precise.
- Solution: every 25 ms, a `setInterval` checks which notes are due in the **next 250 ms** and schedules them at their exact time on the audio clock. Even if the timer runs late, the notes are already scheduled precisely.

`eighth` is the duration of an eighth note: 60 / 68 / 2 ≈ 0.44 s. `step` counts eighth notes from the start.

`self` stores `this` because inside the anonymous function passed to `setInterval`, `this` would no longer be the `Music` object.

**What plays at each step:**

```js
chordAt: function (step) { return this.progression[Math.floor(step / 16) % 4]; },

playStep: function (step, when, eighth) {
  var s = step % 16, cycle = Math.floor(step / 64);
  var ch = this.chordAt(step), dest = Sound.musicBus;

  if (s === 0) {
    Sound.pad(ch.pad.map(hz), when, 16 * eighth + 1.4, 0.022, dest);
    this.bass(hz(ch.bass), when, 16 * eighth + 0.5);
  }
  if (cycle > 0 || s % 2 === 0) {
    var vel = (s % 4 === 0 ? 0.075 : 0.05) * (0.9 + Math.random() * 0.2);
    Sound.piano(hz(ch.arp[this.patterns[cycle % 2][s % 8]]), when, vel, dest, 2.4);
  }
  if (cycle > 0 && (s === 0 || (s === 12 && Math.random() < 0.5))) {
    Sound.piano(hz(ch.arp[s === 0 ? 4 : 3] + 12), when + 0.012, 0.06, dest, 4);
  }
  if (cycle > 1 && s % 4 === 0) this.kick(when, s % 8 === 0 ? 0.16 : 0.09);
},
```

- Each chord lasts **16 eighth notes** (two bars). `s` is the position within the chord (0–15). Four chords = 64 eighth notes = one **cycle**; `cycle` counts the cycles.
- On eighth note 0 of each chord: the strings and the bass start, and they last for the whole chord.
- **Piano**: in the first cycle, only on the even eighth notes (quarter notes: calmer); from the second cycle on, on all of them (more flowing). The note comes from the pattern (the pattern alternates each cycle). The volume varies randomly by ±10% and is higher on the strong beats (`s % 4 === 0`), as a human pianist would play.
- From the second cycle on, an occasional **high melody** (an octave higher, +12), sometimes there and sometimes not (`Math.random() < 0.5`).
- From the third cycle on, a very soft bass-drum **pulse**.

So the music **builds up** little by little and never repeats itself exactly.

**Bass and kick**: the bass is a low sine wave; the kick drum (`kick`) is a sine wave that drops from 95 to 40 Hz in 0.14 s (that rapid drop is what the ear recognizes as a "kick drum").

**Stopping, volume and fades:**

```js
stop: function () {
  if (!Sound.ctx) return;
  var self = this;
  this.playing = false;
  clearInterval(this.timer);
  this.fadeTo(0, 0.25);
  setTimeout(function () { if (!self.playing) Sound.newMusicBus(); }, 300);
  this.notify();
},

fadeTo: function (value, seconds) {
  var g = Sound.musicGain.gain, now = Sound.ctx.currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(value, now + seconds);
},

duck: function (on) {
  if (!this.playing || !Sound.ctx) return;
  Sound.musicGain.gain.setTargetAtTime(on ? this.volume * 0.3 : this.volume, Sound.ctx.currentTime, on ? 0.3 : 0.6);
},
```

- `stop` halts the scheduler, brings the volume down to 0 in a quarter of a second and, after 300 ms, swaps the bus (silencing the pending notes). The `if (!self.playing)` check avoids breaking the music if someone turns it back on within those 300 ms.
- `fadeTo`: cancels any fade in progress, fixes the current value as the starting point and makes a linear ramp to the new value.
- `duck` (*ducking*): while your voice is playing, the music drops to 30% and then comes back. `setTargetAtTime` makes a smooth curve toward the target. It is what radio stations do when the presenter speaks.

**Change notifications:** `onChange(fn)` and `notify()` form another small event system: the player subscribes in order to update its icon (play/pause) every time the music starts or stops, wherever the command came from.

### 9.8 The voice: `XP.Voice`

Your message is not synthesized: it is an MP3 file played with the browser's normal audio player (`Audio`), which is simpler than Web Audio for this case.

```js
XP.Voice = {
  VERSION: 3,
  VOLUME: 0.7,
  clip: null,

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
  …
};
```

- The file is chosen by language: `play("opening")` in Spanish loads `assets/audio/opening-es.mp3?v=3`. `VERSION` is there to bust the cache if you ever change the recording.
- `VOLUME: 0.7`: the playback volume (on top of the volume already reduced when the audio was processed).
- `callbacks` is an object with two optional functions supplied by the caller: `onStart(audio)` (it started) and `onEnd()` (it finished or failed). It is the same concept as passing a "listener" to a method in Java.
- `a.play()` returns a **promise**: if the browser allows playback, the `then` runs (the music is lowered and `onStart` is notified); if not (for example, a network error), the `catch` calls `finish`.
- `finish` runs when playback ends (`ended`), if there is an error (`error`) or if `play` fails. The `self.clip !== a` check avoids notifying twice, or notifying about an old audio clip that has already been replaced.

---

## 10. visuals.js: the wave and the seasonal animations

### 10.1 The `<canvas>`: drawing with code

Up to this point, everything visual has been HTML elements with styles. For things with many moving pieces (snowflakes, leaves) that would be slow. This is what **`<canvas>`** is for: a rectangle of pixels that you draw on with instructions, as in a paint program. There are no elements: if you want to move a snowflake, you erase and redraw everything in the new position, 60 times per second.

```js
function makeCanvas(className) {
  var cv = document.createElement("canvas");
  cv.className = className;
  cv.setAttribute("aria-hidden", "true");
  document.body.appendChild(cv);
  return cv;
}
```

It creates a canvas, gives it a class (so that CSS can position it) and adds it to the `<body>`. In `page.css`:

```css
.season-canvas, .fx-canvas { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.season-canvas { z-index: 50; }
.fx-canvas { z-index: 1001; }
```

Both canvases cover the whole window, fixed in place, and **do not capture clicks** (`pointer-events: none`): everything underneath keeps working. The seasonal one sits below the header; the wave canvas sits above everything (so that the wave can be seen when the intro bubble bursts).

To draw, you request a **2D context**, the object that holds the drawing tools:

```js
var c = canvas.getContext("2d");
c.clearRect(0, 0, width, height); // clear
c.beginPath();                    // start a shape
c.arc(x, y, radius, 0, Math.PI*2); // a full circle (angles in radians)
c.fill();                         // fill it (with c.fillStyle)
c.stroke();                       // or draw only the outline (with c.strokeStyle and c.lineWidth)
c.globalAlpha = 0.5;              // transparency of whatever is drawn next
```

### 10.2 High-density screens (DPR)

```js
resize: function () {
  this.dpr = Math.min(window.devicePixelRatio || 1, 2);
  this.canvas.width = innerWidth * this.dpr;
  this.canvas.height = innerHeight * this.dpr;
},
…
c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
```

Modern phones and laptops have "retina" screens: 2 or 3 physical pixels for every CSS pixel (`devicePixelRatio`). If the canvas had as many pixels as the window has in CSS, it would look blurry. That is why:

- it is given an internal size multiplied by the DPR (capped at 2 so as not to waste resources);
- `setTransform(dpr, …)` scales every drawing, so the code can keep using normal coordinates;
- `resize` runs again every time the window size changes (the `resize` event).

### 10.3 The wave: `XP.Ripple`

When a bubble bursts, a ring comes out, expands and fades away.

```js
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
    var k = Math.min((now - p.born) / 700, 1);
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
```

- `at(x, y, …)` adds a ring to the list together with its time of birth. `performance.now()` gives the time in milliseconds with high precision.
- The animation loop **only runs while there are rings**: once the list is empty, it stops. No battery is wasted when there is nothing to draw.
- On each frame, `k` is the progress from 0 to 1 (the animation lasts 700 ms). The radius grows following the curve `1 − (1−k)³` (fast at first, slowing down at the end), while the opacity and thickness decrease with `life = 1 − k`.
- The list is traversed **backwards** (`i--`) because elements are removed (`splice`) during the loop; going backwards, deleting one does not shift the ones still to be visited.
- The animation is driven by **time**, not by frames: it lasts 700 ms on any screen, whether 60 or 120 Hz.

The `x, y` coordinates are window coordinates; the caller calculates them with `getBoundingClientRect()`, which returns an element's position and size on screen (`left`, `top`, `width`, `height`, `right`, `bottom`).

### 10.4 The seasonal particles: `XP.Seasons`

**Which season it is:**

```js
current: function () {
  var q = /[?&]season=(winter|spring|summer|autumn)/.exec(location.search);
  if (q) return q[1];
  var m = new Date().getMonth();
  if (m === 11 || m <= 1) return "winter";
  if (m <= 4) return "spring";
  if (m <= 7) return "summer";
  return "autumn";
},
```

- First it checks whether the address contains `?season=winter` (or another season). This lets you **test** each season without waiting months: `https://luciaesteban.github.io/?season=winter`. `location.search` is the part of the URL from the `?` onward. `/…/` is a **regular expression** (a text search pattern, like Java's `Pattern`); `exec` returns what it found and `q[1]` is whatever is inside the parentheses.
- Otherwise, it decides by month. In JavaScript `getMonth()` goes from **0 (January) to 11 (December)**. Winter: December to February (northern hemisphere), spring: March–May, summer: June–August, autumn: September–November.

**Startup and loop:**

```js
init: function () {
  if (XP.reduceMotion) return;
  this.season = this.current();
  this.canvas = makeCanvas("season-canvas");
  this.c = this.canvas.getContext("2d");
  this.parts = [];
  this.resize();
  this.last = performance.now();
  try { if (localStorage.getItem(this.STORAGE_KEY) === "off") this.setEnabled(false, true); } catch (e) { }

  var self = this;
  window.addEventListener("resize", function () { self.resize(); });
  requestAnimationFrame(function loop(now) {
    if (!document.hidden && self.enabled) self.frame(now);
    requestAnimationFrame(loop);
  });
},
```

- If the user asked for less motion, **nothing is created** (neither the canvas nor the button).
- It restores whether the visitor had turned them off (`localStorage`).
- An infinite loop with `requestAnimationFrame`, which only draws if the tab is visible and the animation is turned on.

**How many particles:**

```js
var count = Math.max(7, Math.min(17, Math.round(this.w / 105)));
while (this.parts.length < count) this.parts.push(this.spawn(true));
this.parts.length = count;
```

One for every 105 px of width, between 7 and 17. Deliberately few, so that the effect stays subtle. Assigning `length` on a list truncates it.

**Creating a particle with random parameters:**

```js
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
```

- At the start (`anywhere = true`) the particles are spread across the whole screen; after that, new ones are born at the top (or at the bottom in summer, because fireflies **rise**: their `vy` speed is negative).
- The `cfg` table stores, per season, "minimum, extra variation" pairs for size, speed, sway and opacity. Each particle gets random values within that range, so no two are alike. Writing the configuration as a data table instead of with lots of `if` statements makes it easy to adjust (that is how it was done when you asked for them to be "a tiny bit less busy").

**Moving and drawing (every frame):**

```js
frame: function (now) {
  var dt = Math.min((now - this.last) / 16.67, 3);
  this.last = now;
  …
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
    …
    this.draw(c, p, s);
  }
},
```

- `dt` (*delta time*) is how much time has passed since the previous frame, in units of "one frame at 60 Hz" (16.67 ms). Multiplying every movement by `dt` makes the speed the same on 60 Hz and 144 Hz screens. It is capped at 3 so that, when you come back to a tab after a while, the particles do not take a huge leap.
- The sideways sway is a **sine**: `Math.sin(phase)` oscillates smoothly between −1 and 1, and `phase` advances little by little. That is how the snowflakes and leaves rock from side to side.
- When a particle leaves the screen, it is replaced by a new one (**recycling**): the number of particles stays constant.

**The shapes:**

- Winter and summer: circles (`arc`). In summer, there is also a large, very transparent halo (the firefly's glow) and a flickering of the opacity driven by another sine.
- Spring (petals): a teardrop shape made from two **Bézier curves** (`bezierCurveTo`, smooth curves defined by control points), which stretches and shrinks (`scale`) so that it looks as if it is spinning in the air.
- Autumn (leaves): a pointed oval made from two quadratic curves (`quadraticCurveTo`) and a central line (the midrib), which flattens and widens like a leaf tumbling.

`c.save()` / `c.restore()` save and restore the context's state: in between, the origin is moved to the particle (`translate`) and rotated (`rotate`), and afterwards everything goes back to normal for the next one.

The colors change with the theme (`palettes[season][light|dark]`): in dark mode, for example, the snow is white; in light mode, a grayish blue so that it shows up against a white background.

**Turning them on and off:**

```js
setEnabled: function (on, fromStorage) {
  this.enabled = on;
  if (!this.canvas) return;
  this.canvas.style.display = on ? "" : "none";
  this.last = performance.now();
  if (!fromStorage) {
    try { localStorage.setItem(this.STORAGE_KEY, on ? "on" : "off"); } catch (e) { }
  }
},
```

It hides or shows the canvas and saves the choice (except when the saved choice is being restored, so as not to write it again).

---

## 11. controls.js and controls.css: the floating controls

In the bottom right corner there are two fixed controls: the **music player** and the **seasonal animation switch**. They appear when the intro closes.

### 11.1 Icons as text

```js
var ICONS = {
  play: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
  pause: '<svg …><rect x="6" y="5" width="4" height="14" rx="1" …/><rect x="14" …/></svg>',
  winter: '<path d="M12 3v18M4.2 7.5l15.6 9…"/>',
  …
};
```

The icons are stored as HTML text and inserted with `innerHTML`. The one on the animation switch depends on the season: a snowflake, a flower, a sun or a leaf.

### 11.2 The player

```js
init: function () {
  var el = (this.el = document.createElement("div"));
  el.className = "music-dock";
  el.innerHTML =
    '<button type="button" class="music-btn"></button>' +
    '<div class="music-eq" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>' +
    '<span class="music-label"></span>' +
    '<input class="music-vol" type="range" min="0" max="1" step="0.01" />';
  document.body.appendChild(el);
  …
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
```

- It is built in code: a play/pause button, an equalizer (five little bars), a label ("Music: on") and a volume slider (`<input type="range">`, from 0 to 1).
- Pressing the button enables sound (in case the visitor came in without it) and toggles the music.
- The slider's `input` event fires continuously while it is being dragged; `parseFloat` converts its value (which is text) into a number.
- It subscribes to changes in the music and the language in order to repaint itself.

```js
paint: function () {
  var on = XP.Music.playing;
  this.btn.innerHTML = on ? ICONS.pause : ICONS.play;
  this.btn.setAttribute("aria-label", on ? t("pause") : t("play"));
  this.btn.setAttribute("aria-pressed", on ? "true" : "false");
  this.label.textContent = (on ? t("musicOn") : t("musicOff")).replace("♪ ", "");
  this.vol.setAttribute("aria-label", t("volume"));
},
```

`paint` reflects the current state: the icon, the accessibility texts and the label (with the "♪ " symbol stripped off, which the intro button does keep).

**The equalizer that follows the music:**

```js
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
```

- The `AnalyserNode` (from 9.3) breaks the sound down into 32 frequency bands (from lows to highs). `getByteFrequencyData` fills the `data` list with the intensity of each band (0–255). A `Uint8Array` is a list of integers from 0 to 255, more efficient than a normal list.
- Every 60 ms, each bar takes one band (bands 1, 4, 7, 10, 13) and its height goes from 4 to 18 px depending on the intensity. So the bars **genuinely dance** to the music, rather than following a fake animation.
- `toFixed(1)` rounds to one decimal place.

### 11.3 The animation switch

```js
var SeasonSwitch = {
  init: function () {
    var seasons = XP.Seasons;
    if (!seasons.canvas) return;
    var btn = (this.btn = document.createElement("button"));
    btn.className = "season-toggle";
    btn.innerHTML = '<span class="season-toggle-icon" aria-hidden="true"><svg …>' +
      ICONS[seasons.season] + '</svg></span><span class="season-toggle-label"></span>';
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      seasons.setEnabled(!seasons.enabled);
      self.paint();
    });
    …
  },
  paint: function () {
    var on = XP.Seasons.enabled;
    this.btn.querySelector(".season-toggle-label").textContent = on ? t("animOn") : t("animOff");
    this.btn.setAttribute("aria-pressed", on ? "true" : "false");
    this.btn.classList.toggle("is-off", !on);
  }
};
```

If the canvas does not exist (reduced motion), the button is not created. `ICONS[seasons.season]` picks the icon by the season's name. `classList.toggle("is-off", !on)` with a second parameter adds or removes the class depending on the condition.

### 11.4 Showing the controls

```js
XP.Controls = {
  init: function () { Player.init(); SeasonSwitch.init(); },
  show: function () {
    Player.el.classList.add("is-visible");
    if (SeasonSwitch.btn) SeasonSwitch.btn.classList.add("is-visible");
  }
};
```

`Player` and `SeasonSwitch` are private to the file (local variables of the IIFE); only `XP.Controls`, with two functions, is exposed to the outside. This is **encapsulation**: the rest of the code does not need to know how they work internally.

### 11.5 controls.css

```css
.music-dock {
  position: fixed;
  right: 1.1rem;
  bottom: 1.1rem;
  z-index: 900;
  display: flex;
  border-radius: 999px;
  background: var(--color-header-bg);
  backdrop-filter: blur(10px);
  transform: translateY(140%);
  opacity: 0;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease;
}
.music-dock.is-visible { transform: none; opacity: 1; }
.music-eq span { width: 3px; height: 4px; background: var(--color-accent); transition: height 120ms ease; }
```

- Fixed in the bottom right corner, with a glass effect.
- It starts **hidden below the screen** (`translateY(140%)`) and transparent; when it receives `is-visible` it slides up along a smooth curve.
- The equalizer bars have `transition: height`, so the height jumps that JS applies every 60 ms look fluid.

```css
.season-toggle { position: fixed; right: 1.1rem; bottom: calc(1.1rem + 64px); … transition: … 120ms; }
@media (max-width: 600px) {
  .music-label, .music-vol { display: none; }
  .season-toggle { right: calc(0.8rem + 98px); bottom: calc(0.8rem + 7px); padding: 0.3rem; }
  .season-toggle-label { display: none; }
}
```

- On desktop, the switch sits just above the player (`calc(1.1rem + 64px)`) and appears 120 ms later (a small stagger looks more elegant).
- On mobile, the player shrinks to button + equalizer, and the switch is placed **to its left** as an icon only, to take up less of the screen.

---

## 12. intro.js and intro.css: the bubble screen

### 12.1 The AL code falling in the background

```js
var AL_SNIPPETS = [
  "[EventSubscriber(ObjectType::Codeunit, Codeunit::\"Sales-Post\",\n    'OnAfterPostSalesDoc', '', false, false)]\nlocal procedure …",
  "page 50120 \"Customer API\"\n{\n    PageType = API;\n …",
  …
];
```

Eight AL code fragments written in a realistic style (event subscribers, an API page, a codeunit that sends webhooks with `HttpClient`, a tableextension, an XMLport…). Inside a JavaScript string, `\n` is a line break and `\"` is a literal double quote.

**Syntax highlighting:**

```js
var AL_KEYWORDS = /\b(procedure|local|var|begin|end|if|then|exit|…|Error)\b/g;

function highlightAL(src) {
  var esc = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.split(/('(?:[^'])*'|"(?:[^"])*"|\[EventSubscriber[^\]]*\])/g).map(function (part, i) {
    if (i % 2) return '<span class="' + (part.charAt(0) === "[" ? "c-a" : "c-s") + '">' + part + "</span>";
    return part.replace(AL_KEYWORDS, '<span class="c-k">$1</span>');
  }).join("");
}
```

1. **Escape** `&`, `<` and `>`: since the code is going to be inserted as HTML, those characters must be converted so that they are not interpreted as tags.
2. **Split** the text with a regular expression that captures: strings in single quotes, strings in double quotes, and `[EventSubscriber…]` attributes. When `split` uses an expression with capturing parentheses, the result alternates "normal text, captured chunk, normal text, captured chunk…". That is why the odd positions (`i % 2`) are the captured ones.
3. The captured chunks are wrapped in `<span class="c-a">` (attribute) or `c-s` (string); in the normal ones, the **keywords** are wrapped in `c-k`. `\b` in the expression means "word boundary" (so that `end` is not colored inside `Send`); the final `g` means "every occurrence"; `$1` means "whatever was found".
4. `intro.css` gives each class a color: lilac for keywords, green for strings, gold for attributes.

**The infinitely looping columns:**

```js
function addCodeRain(intro) {
  var layer = document.createElement("div");
  layer.className = "intro-code";
  var cols = innerWidth >= 1100 ? 4 : innerWidth >= 700 ? 3 : 2;
  for (var c = 0; c < cols; c++) {
    var order = AL_SNIPPETS.map(function (_, i) { return AL_SNIPPETS[(i + c * 3) % AL_SNIPPETS.length]; });
    var block = order.map(highlightAL).join("\n\n\n");
    var col = document.createElement("div");
    col.className = "intro-code-col";
    col.innerHTML = '<pre class="intro-code-track" style="animation-duration:' + (70 + c * 13) +
      "s;animation-delay:-" + c * 17 + 's">' + block + "\n\n\n" + block + "\n\n\n</pre>";
    layer.appendChild(col);
  }
  intro.insertBefore(layer, intro.querySelector(".intro-stage"));
}
```

- 4, 3 or 2 columns depending on the screen width.
- Each column **rotates** the order of the fragments (`(i + c*3) % 8`) so that the same ones do not appear at the same height.
- `<pre>` is an element that preserves spaces and line breaks exactly as written (ideal for code).
- **The seamless-loop trick**: inside each column the block of code is placed **twice in a row**. The CSS animation moves the column from −50% (the first copy is visible… that is, the top half) to 0. Since the two halves are identical, when the animation starts over the jump is invisible:

  ```css
  @keyframes codeFall {
    from { transform: translateY(-50%); }
    to   { transform: translateY(0); }
  }
  ```

- Each column has a different speed (70, 83, 96… s) and a **negative delay** (`animation-delay: -17s`), which makes the animation start "already under way", so they do not all begin from the same point.
- `insertBefore` inserts the layer before the bubble, so that it sits behind it.

And in CSS, what makes it almost invisible:

```css
.intro-code {
  position: absolute; inset: 0;
  display: flex; justify-content: space-around;
  opacity: 0.075;
  mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%);
}
.intro-code-col:nth-child(even) { filter: blur(0.6px); opacity: 0.75; }
```

- 7.5% opacity: you only notice it if you look closely.
- `mask-image` with a gradient makes the code **fade in and out gradually** at the top and bottom, with no hard edges (wherever the mask is transparent, the content is not visible).
- The even columns are slightly blurred: a sense of depth.

### 12.2 `XP.Intro.init`: the screen's logic

```js
init: function (onDone) {
  var intro = document.getElementById("intro");
  if (!intro) { onDone(); return; }
  var bubble = intro.querySelector(".intro-bubble");
  var musicToggle = intro.querySelector("[data-intro-music]");
  var wantMusic = true;
  var entered = false;
  var timers = {};
  addCodeRain(intro);
  …
```

- `onDone` is a callback: what needs to happen when the intro finishes (showing the controls). `page.js` passes it in.
- `entered` prevents entering twice (for example, with a double click).
- `timers` stores the timer identifiers so that they can be cancelled.

**The intro's language selector:**

```js
var langBox = document.createElement("div");
langBox.className = "intro-lang";
langBox.innerHTML = '<span class="intro-lang-label">…Language · Idioma</span>' +
  '<div class="intro-lang-buttons" role="group" aria-label="Language / Idioma">' +
  '<button type="button" data-lang="en" lang="en">English</button>' +
  '<button type="button" data-lang="es" lang="es">Español</button></div>' +
  '<span class="intro-lang-tip" aria-hidden="true"></span>';
intro.appendChild(langBox);

langBox.addEventListener("click", function (e) {
  var b = e.target.closest("button[data-lang]");
  if (!b) return;
  …
  var siteBtn = document.querySelector('.lang-btn[data-lang="' + b.getAttribute("data-lang") + '"]');
  if (siteBtn) siteBtn.click();
  localise();
  typeWelcome();
});
```

- The label is in both languages at once ("Language · Idioma") because it is not yet known which one the visitor understands.
- **It does not duplicate the language logic**: when a language is chosen, it simulates a click on the corresponding EN/ES button in the header (`siteBtn.click()`). That way `main.js` performs its usual translation, and every subscriber to `XP.onLanguageChange` finds out. Then it translates the intro itself (`localise`) and types the welcome again in the new language.

**The language hint** (`hintLanguage`): once the welcome has finished typing, it shows a small bubble saying "You can change the language here" for 5 s and makes a ring pulse around the selector:

```js
langBox.classList.remove("is-hinting");
void langBox.offsetWidth; // restart the animation
langBox.classList.add("is-hinting");
```

A CSS animation does not replay if the class was already set. The trick is to remove it, **force the browser to recalculate** the layout (reading `offsetWidth` forces it) and add it again. `void` indicates that the value is read only for that side effect.

**Translating the intro:**

```js
function localise() {
  intro.querySelectorAll("[data-intro-text]").forEach(function (el) {
    el.textContent = t(el.getAttribute("data-intro-text"));
  });
  bubble.setAttribute("aria-label", t("bubbleLabel"));
  …
}
```

Just like `applyTranslations` in `main.js`, but with the texts from `XP.TEXT`.

**The welcome typed letter by letter:**

```js
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
```

- `step` is a function that calls itself with `setTimeout`: each time it shows one more letter (`slice(0, i)` = the first `i` characters).
- 32 ms per letter, but **380 ms after a full stop**, like a natural pause when reading.
- `clearTimeout` at the start: if the language is changed halfway through, the previous typing is cancelled before the new one begins.
- While it is typing, the `is-typing` class shows a blinking cursor (`::after` in CSS with `animation: caretBlink 0.9s steps(1) infinite`; `steps(1)` makes it jump from visible to invisible with no fade, like a real cursor).
- It starts at 2.5 s (`setTimeout(typeWelcome, 2500)`), once the bubble has already appeared.

**The little rising bubbles:**

```js
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
```

Every 380 ms a bubble is born with a random size, position, sideways drift and speed. `setProperty("--drift", …)` gives a value to a **CSS variable** for that element alone, which the animation uses:

```css
@keyframes fizzUp {
  0%   { transform: translate(0, 0); opacity: 0; }
  10%  { opacity: 0.9; }
  100% { transform: translate(var(--drift, 20px), -110vh); opacity: 0; }
}
```

After 13.5 s each bubble is removed from the DOM, so that elements do not pile up.

### 12.3 Entering: bursting the bubble

```js
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
```

The sequence, choreographed with timers:

| Moment | What happens |
|---|---|
| 0 ms | Sound is enabled (this click is the interaction that allows the `AudioContext` to be created). The pop and the chord play. The bubble receives `is-popping` (the bursting animation). The wave spreads out from its center. |
| 380 ms | The intro receives `is-leaving` (it fades out and blurs). `intro-open` is removed from `<html>`: the page behind goes from blurred to sharp. |
| 880 ms | The music starts (unless it was turned off), with a 3 s fade-in. |
| 1400 ms | The intro is hidden completely (`is-gone`), the little bubbles stop, keyboard focus moves to the main content and `onDone` is called (the controls appear). |

Focus is moved to `<main>` so that someone navigating with the keyboard is not left "lost" on an element that no longer exists. `tabindex="-1"` makes it possible to give focus to an element that would not normally receive it; `preventScroll` stops the browser from scrolling when it does so.

**Keyboard:**

```js
bubble.addEventListener("click", function () { enter(true); });
document.addEventListener("keydown", function onKey(e) {
  if (entered) { document.removeEventListener("keydown", onKey); return; }
  var onOtherButton = e.target !== bubble && e.target.tagName === "BUTTON";
  if ((e.key === "Enter" || e.key === " ") && !onOtherButton) { e.preventDefault(); enter(true); }
  if (e.key === "Escape") enter(false);
});
```

- Enter or Space enter with sound; Escape enters **without sound**.
- If focus is on another button (for example, "Español"), Enter must press that button rather than enter, which is why `onOtherButton` is checked.
- The listener function has a name (`onKey`) so that it can remove itself with `removeEventListener` once the visitor has entered.

### 12.4 intro.css: the bubble

**The layer and the page blur:**

```css
.intro {
  position: fixed; inset: 0; z-index: 1000;
  display: grid; place-items: center;
  background: radial-gradient(…), radial-gradient(…), #070f1d;
  transition: opacity 900ms ease, filter 900ms ease, visibility 0s linear 900ms;
}
.intro.is-leaving { opacity: 0; filter: blur(18px); visibility: hidden; pointer-events: none; }
.intro.is-gone { display: none; }

html.intro-open { overflow: hidden; }
html.intro-open body > :not(.intro):not(.fx-canvas):not(.music-dock):not(.season-toggle) {
  filter: blur(14px);
  transform: scale(1.03);
}
body > .site-header, body > main, body > .site-footer {
  transition: filter 1100ms ease, transform 1100ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

- `display: grid; place-items: center` is the shortest way to **center** something horizontally and vertically.
- `visibility 0s linear 900ms`: the visibility changes instantly, but only **after** 900 ms (once the fade has finished).
- While `<html>` has `intro-open`: scrolling is not possible (`overflow: hidden`) and everything in `<body>` except the intro and a few layers is blurred and 3% larger. When the class is removed, the 1.1 s transition brings it back into focus and to its normal size: the effect of "focusing a camera lens".

**The bubble:**

```css
.intro-bubble {
  --size: min(78vmin, 440px);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.06) 22%, transparent 40%),
    radial-gradient(circle at 70% 80%, rgba(124,58,237,0.28) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(47,111,237,0.10) 0%, rgba(11,37,69,0.55) 70%, rgba(255,255,255,0.18) 100%);
  box-shadow:
    inset 0 0 40px rgba(255,255,255,0.12),
    inset -18px -26px 60px rgba(124,58,237,0.25),
    inset 20px 18px 50px rgba(47,111,237,0.25);
  clip-path: circle(50% at 50% 50%);
  animation:
    bubbleEmerge 1800ms cubic-bezier(0.2, 0.9, 0.25, 1.15) 250ms both,
    bubbleWobble 6s ease-in-out 2100ms infinite;
}
```

- Size: 78% of the screen's shorter side, at most 440 px. That way it fits on any screen.
- The soap-bubble look is achieved **with gradients alone**: a white highlight at the top left, a violet reflection at the bottom right, and a transparent center that darkens toward the edge. The `inset` shadows (pointing inward) add volume.
- `clip-path: circle(…)` clips anything that falls outside the circle. It was added because, when `filter: blur` was applied during the animation, some graphics cards painted the blur as a **square**; the clipping keeps it round.
- **Two animations at once**, separated by a comma:
  - `bubbleEmerge` (1.8 s, after 250 ms): from small, transparent and very blurry (`blur(40px)`) to sharp, with a slight bounce (the curve ends at 1.15, so it overshoots a little). `both` keeps the initial state before it starts and the final state when it ends.
  - `bubbleWobble` (6 s, infinite, starting when the other one ends): slightly changes the `border-radius` of each corner and moves up and down by a few pixels. It makes the bubble look soft and alive.

```css
.intro-bubble::before {
  content: ""; position: absolute; inset: 0; border-radius: 50%; padding: 3px;
  background: conic-gradient(from 0deg, #5b93f5, #16a394, #f5d06b, #e879f9, #7c3aed, #5b93f5);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  animation: rimSpin 8s linear infinite;
}
```

The rotating **iridescent rim**: a conic color gradient on a pseudo-element the size of the bubble. The mask trick: two masks are stacked, one covering the content area (without the `padding`) and another covering the whole element, and they are "subtracted" (`exclude`). Only the 3 px ring of padding remains. Then it spins endlessly.

`::after` is the **highlight**, in the form of a tilted white oval at the top left.

**The content appears in stages:**

```css
.intro-content > * { opacity: 0; animation: contentRise 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.intro-avatar { animation-delay: 1300ms !important; }
.intro-eyebrow { animation-delay: 1500ms !important; }
.intro-name { … animation: contentRise … 1650ms forwards, shimmer 5s linear 2600ms infinite !important; }
.intro-role { animation-delay: 1800ms !important; }
.intro-cta { … animation: contentRise … 2100ms forwards, ctaPulse 2.4s ease-in-out 3000ms infinite !important; }
```

Each element inside the bubble rises and comes into focus 150–300 ms apart (photo, "Portfolio", name, role, call to action). `forwards` keeps the final state. The name also has a **shimmer that sweeps across it** (`shimmer`): a gradient twice as wide as the text, applied only to the letters (`background-clip: text; color: transparent`), which slides along. The "Tap the bubble" button pulses with a shadow that grows and fades.

**Bursting:**

```css
.intro-bubble.is-popping { animation: bubblePop 520ms cubic-bezier(0.3, 0, 0.6, 1) forwards; }
@keyframes bubblePop {
  0%   { transform: scale(1); opacity: 1; filter: blur(0); }
  35%  { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1.7); opacity: 0; filter: blur(12px); }
}
```

It swells slightly, and then grows larger, blurs and disappears.

**Final adjustments:**

```css
@media (pointer: coarse) { .intro-hint { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .intro-bubble, .intro-content > *, … { animation: none !important; opacity: 1 !important; }
  html.intro-open body > * { filter: none !important; transform: none !important; }
}
```

On touch screens, "Press Enter" is hidden (there is no keyboard). With reduced motion, the bubble appears still and without any blur.

---

## 13. voice.js and voice.css: the voice message and the guided tour

This part brings several pieces together: the comic-style speech bubble on your photo, the playback of your voice, the captions that light up word by word, and the guided tour that moves through the site while you speak.

### 13.1 How it works, in brief

1. `XP.Listen.init()` adds the "Listen to me" speech bubble to the corner of your photo and prepares the captions panel.
2. When the speech bubble (or the photo) is tapped: the speech bubble bursts, the captions panel opens and, 350 ms later, your audio starts.
3. While it plays, **on every frame** the exact second of the audio is read and:
   - the current sentence is shown and the words already spoken light up;
   - if a tour step is due, the page scrolls smoothly to that section.
4. On the first step of the tour, the panel "detaches" from the photo and stays fixed in a corner of the screen.
5. During the tour, the visitor's scrolling is **blocked** so that things do not fall out of sync.
6. When it ends: the page glides smoothly back to the top, scrolling is unblocked and the panel closes after 2.5 s.
7. It can only be listened to **once per visit**.

### 13.2 The captions panel: `Captions(frame)`

`Captions` is a function that builds the panel and returns an object with its operations (`open`, `follow`, `float`, `close`). It is the closure pattern explained in 2.3: the internal variables (`cues`, `words`, `current`…) are private.

```js
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
  document.body.appendChild(box);
  var prevEl = box.querySelector(".voice-cc-prev");
  var nowEl = box.querySelector(".voice-cc-now");
  var cues = [], words = [], current = -1, raf = 0;
  …
```

The panel has a header (a speaker icon, "Lucía · Voice message" and a small animated equalizer), the **previous sentence** in small gray text, and the **current sentence** in large text.

**Why the panel is added to `<body>` and not to the photo.** This is the most important technical detail in this part. The photo is inside an element with the `reveal` class, which uses `transform` for its entrance animation. As explained in 2.2, `transform` creates a **stacking context** and also changes the reference for `position: fixed`. If the panel were inside the photo:

- it could never sit above the header, however high its `z-index`, because it would be "locked inside" the photo's layer;
- `position: fixed` would not fix it to the window but to the photo.

That is why it lives directly in `<body>`, with `z-index: 1100` (the highest on the site), and is **positioned by calculating where the photo is**.

### 13.3 Splitting each sentence into words with their timing

```js
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
```

When a new sentence begins:

- the previous sentence moves to the small line;
- the current one is split into words, and each word is placed in its own `<span>`;
- for each word, the code calculates **at what fraction of the sentence it starts** (`at`, from 0 to 1), **in proportion to the number of letters** that come before it. A long word takes longer to say than a short one, so this approximation is quite close to the real rhythm of speech.

For example, in "Thank you for stopping by." (26 characters): "Thank" starts at 0/26 = 0; "you" at 6/26 ≈ 0.23; "for" at 10/26 ≈ 0.38; "stopping" at 14/26 ≈ 0.54; "by." at 23/26 ≈ 0.88.

### 13.4 Synchronization on every frame

```js
function sync(audio, tour) {
  var time = audio.currentTime, i = -1;
  tour.update(time);
  for (var k = 0; k < cues.length; k++) if (time >= cues[k][0]) i = k;
  if (i >= 0) {
    if (i !== current) showCue(i);
    var cue = cues[i];
    var progress = (time - cue[0]) / Math.max(cue[1] - cue[0], 0.1);
    words.forEach(function (w) { if (w.at <= progress - 0.03) w.el.classList.add("is-said"); });
  }
  raf = requestAnimationFrame(function () { sync(audio, tour); });
}
```

- `audio.currentTime` is the exact playback second of the audio. **Everything is synchronized with the audio**, not with a clock of its own: if the audio is delayed (for example, because it takes a while to load), the captions and the tour wait along with it.
- The guided tour is told the current time.
- It looks for the last sentence whose start has already passed. If it has changed, it is built.
- `progress` is how much of the current sentence has elapsed (0 at the start, 1 at the end).
- Every word whose `at` has already passed receives `is-said`, and the CSS lights it up. The `- 0.03` is a small deliberate **delay**: that way the words light up a fraction after they are spoken and never ahead of the voice (it was adjusted when you noticed that in English they were running slightly early).
- `requestAnimationFrame` calls `sync` again on the next frame: about 60 checks per second.

In CSS:

```css
.voice-cc-now span { opacity: 0.12; transition: opacity 250ms ease; }
.voice-cc-now span.is-said { opacity: 1; }
```

Pending words are very faint (12%) and switch to full opacity with a 250 ms fade: the sentence "writes itself out" as you say it.

### 13.5 Where to place the panel

```js
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
```

It chooses between three positions so as **never to cover any text**:

| Situation | Position | Why |
|---|---|---|
| Large screen with space to the right of the photo (≥ 260 px) | `right`: to the right of the photo, vertically centered | That is the empty area of the hero on desktop. |
| Narrower desktop | `below`: under the photo, same width | It does not fit on the right. |
| Tablet or phone (≤ 900 px) | `over`: over the lower part of the photo | The photo sits above the text; placing it below would cover your name. |

- `getBoundingClientRect()` gives the photo's position **in the window**. Since the panel is in `<body>` with `position: absolute` (page coordinates), `scrollX`/`scrollY` (how far the page has been scrolled) are added to convert window coordinates into page coordinates.
- Each position is a `[left, top, width]` list; the table `{ right: …, below: …, over: … }[where]` picks one by name (another way of avoiding a chain of `if` statements).
- The `cc-right` / `cc-below` / `cc-over` class tells the CSS how to **anchor** the panel at that point:

```css
.voice-cc.cc-right { transform: translate(-14px, -50%); }
.voice-cc.cc-right.is-open { transform: translate(0, -50%); }
.voice-cc.cc-over { transform: translateY(calc(-100% + 10px)); }
.voice-cc.cc-over.is-open { transform: translateY(-100%); }
```

  - In `right`, the calculated point is the vertical center of the photo, and `translateY(-50%)` moves the panel up by half its own height: it ends up centered.
  - In `over`, the point is the bottom edge of the photo, and `translateY(-100%)` moves the panel up by its full height: it ends up resting on that edge, inside the photo.
  - The percentages in `translate` refer to **the element itself**, which is why they can center it without knowing its size.
  - The difference between the closed state and `is-open` (a few pixels) produces a small slide when it appears.
- `place()` runs again if the window size changes.

**Floating mode** (during the guided tour):

```js
float: function () {
  if (floating) return;
  floating = true;
  box.classList.remove("cc-right", "cc-below", "cc-over");
  box.style.left = box.style.top = box.style.width = "";
  box.classList.add("cc-float");
},
```

```css
.voice-cc.cc-float {
  position: fixed;
  left: 1.2rem;
  bottom: 1.2rem;
  width: min(340px, calc(100vw - 2.4rem));
}
@media (max-width: 600px) {
  .voice-cc.cc-float { left: 0.8rem; right: 0.8rem; width: auto; bottom: calc(0.8rem + 64px); }
}
```

When the tour begins, the page is about to move, so the panel can no longer stay attached to the photo. The calculated positions are cleared and it switches to `position: fixed` in the bottom left corner (the music controls are on the right). On mobile it takes up the full width, just above the controls.

**Opening and closing:**

```js
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
close: function (delay) {
  cancelAnimationFrame(raf);
  words.forEach(function (w) { w.el.classList.add("is-said"); });
  box.classList.remove("is-live");
  setTimeout(function () {
    box.classList.add("is-closing");
    setTimeout(function () { box.remove(); }, 600);
  }, delay);
}
```

- `open`: positions the panel, loads the captions for the current language and shows it.
- `follow`: called once the audio has started; it activates the equalizer (`is-live`) and starts the synchronization.
- `close`: stops the loop, lights up any remaining words, waits `delay` ms (so the last sentence can be read), fades the panel out and removes it from the DOM.

### 13.6 The guided tour: `Tour`

**Smooth scrolling: `Glide`**

The browser has its own smooth scrolling (`behavior: "smooth"`), but it is quick and abrupt, and you cannot control its duration or its curve. That is why a custom one was written:

```js
var Glide = {
  raf: 0,
  to: function (target, duration) {
    cancelAnimationFrame(this.raf);
    var start = scrollY, dist = target - start, t0 = performance.now(), self = this;
    function jump(y) { window.scrollTo({ top: y, behavior: "instant" }); }
    if (XP.reduceMotion || Math.abs(dist) < 2) { jump(target); return; }
    (function step(now) {
      var k = Math.min((now - t0) / duration, 1);
      var ease = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      jump(start + dist * ease);
      if (k < 1) self.raf = requestAnimationFrame(step);
    })(t0);
  }
};
```

- It stores the starting position (`scrollY`), the distance to the destination and the start time.
- On each frame it calculates the progress `k` (from 0 to 1 according to the elapsed time) and passes it through an **easing curve** called *easeInOutCubic*:
  - in the first half, `4k³`: it starts very slowly and accelerates;
  - in the second half, `1 − (−2k + 2)³ / 2`: it slows down gradually until it stops.

  It is the same feeling as a car that pulls away and brakes smoothly, instead of traveling at a constant speed.
- It moves the page to `start + distance × ease`.
- `behavior: "instant"` is necessary because `styles.css` has `scroll-behavior: smooth` for the whole page: without it, each small step would in turn become a smooth browser scroll, and the two systems would fight each other (it would feel jerky).
- `cancelAnimationFrame` at the start: if a new destination arrives while it is still moving toward the previous one, the old movement is cancelled and it sets off **from wherever it is**, without jumps.
- With reduced motion, it jumps straight there.

**The tour itself:**

```js
function Tour(steps, onFirstStep) {
  var next = 0, locked = true;
  …
  function targetFor(selector) {
    var el = document.querySelector(selector);
    if (!el) return null;
    var r = el.getBoundingClientRect();
    var header = document.querySelector(".site-header");
    var top = el.tagName === "SECTION"
      ? r.top + scrollY - (header ? header.offsetHeight : 0) - 8
      : r.top + scrollY - Math.max((innerHeight - r.height) / 2, 80);
    return Math.max(top, 0);
  }

  function glideTo(top) {
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
      if (next > 0) Glide.to(0, Math.min(1400 + scrollY * 0.2, 2600));
      unlock();
    }
  };
}
```

- `steps` is the `openingTour` list from `core.js`: `[second, selector]`.
- `update(time)` is called on every frame from `sync`. If the audio has already passed the second of the next step, it scrolls to that step's element. It is a `while` and not an `if` in case two steps have been passed within a single frame.
- `targetFor` calculates what height on the page to scroll to:
  - if the destination is a **section**, its top is placed just below the header (subtracting the header's height and an 8 px margin);
  - if it is another element (a card), it is **centered** on the screen (leaving at least 80 px above it).
  - `offsetHeight` is the element's height in pixels.
- **Duration depends on distance**: 1.1 s plus 0.35 ms per pixel, up to a maximum of 2.2 s. A short jump is quick, a long one takes a little longer, but it is always smooth. The return to the top at the end is somewhat slower (up to 2.6 s).
- `onFirstStep` is the callback that detaches the panel to the corner (`captions.float()`).

**Blocking the scroll:**

```js
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
```

For as long as the tour lasts, **every way the visitor has of scrolling** is cancelled (`preventDefault`):

- `wheel`: the mouse wheel or the laptop's touchpad;
- `touchmove`: dragging a finger on a phone;
- `keydown`: only the keys that scroll (arrows, Page Up/Page Down, Home, End, space). The rest of the keyboard works. `SCROLL_KEYS` is an object used as a set: `SCROLL_KEYS[e.key]` exists only for those keys;
- `click`: only on internal links (an `href` starting with `#`), which would jump to another section. Other clicks (music, theme…) keep working.

Two of the listener's options are essential:

- `passive: false`: for performance reasons, browsers treat `wheel` and `touchmove` as "passive" (they assume they will not be cancelled) and **ignore** `preventDefault()`. With `passive: false` you tell them that they will indeed be cancelled.
- `capture: true`: the listener runs in the **capture** phase, that is, while the event travels down from `window` toward the element, **before** any other listener on the page. That way no other code gets to process the scroll.

`unlock()` removes the listeners at the end (you have to pass the same `capture` option so that the browser can identify which one to remove).

The tour was deliberately made **non-cancellable** because, if the visitor moved the page, the captions would go on talking about a section that was no longer on screen.

### 13.7 The comic speech bubble: `XP.Listen`

```js
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
    …
```

The speech bubble is a `<button>` with: a speaker icon, the text ("Listen to me"), a ring that expands (inviting a tap) and three little comic-style "motion" lines. It is added inside the photo frame. `has-listen` makes the photo clickable too (a hand cursor and a slight zoom on hover).

**Bursting the speech bubble:**

```js
function popBubble() {
  var r = bubble.getBoundingClientRect();
  var burst = document.createElement("span");
  burst.className = "speech-burst";
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
```

- `new Array(9).join("<i></i>")` is a trick for repeating a piece of text 8 times (a list of 9 empty slots joined by the text). These are 8 little lines that shoot out in a circle.
- `offsetLeft`/`offsetTop` give the speech bubble's position **inside its frame**, so that the burst can be placed at its center.
- It combines the bursting animation (CSS), the wave (canvas) and a softer pop (volume 0.5).

**Playing:**

```js
function play(e) {
  e.stopPropagation();
  if (used) return;
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
        tour.finish();
        captions.close(started ? 2500 : 0);
      }
    });
  }, 350);
}

bubble.addEventListener("click", play);
frame.addEventListener("click", play);
```

- `stopPropagation()`: the speech bubble is **inside** the photo, and both listen for the click. Without this, a click on the speech bubble would also reach the photo (because of upward propagation) and `play` would run twice.
- `used` guarantees that it plays only once per visit and never overlaps with itself.
- The guided tour is created (which blocks scrolling from that moment on) and, after 350 ms (the length of the burst), the audio plays with its two callbacks:
  - `onStart`: the synchronization of captions and tour begins;
  - `onEnd`: it goes back to the top, unblocks scrolling and closes the panel. If the audio never even started (an error), it closes instantly.

### 13.8 voice.css: the comic style

```css
:root {
  --comic-ink: #0b2545;
  --comic-paper: #ffffff;
  --comic-shadow: #0b2545;
  --cc-bg: rgba(255, 255, 255, 0.86);
}
:root[data-theme="dark"] {
  --comic-shadow: #5b93f5;
  --cc-bg: rgba(19, 34, 57, 0.86);
}
```

Variables specific to this part. In dark mode, the speech bubble's shadow is blue, because a dark shadow would disappear against a dark background.

**The speech bubble:**

```css
.speech-bubble {
  position: absolute;
  top: -30px;
  right: -34px;
  z-index: 3;
  border: 2.5px solid var(--comic-ink);
  border-radius: 22px;
  background: var(--comic-paper);
  font: 800 0.9rem var(--font-sans);
  filter: drop-shadow(4px 4px 0 var(--comic-shadow));
  transform-origin: 20% 130%;
  animation:
    speechAppear 700ms cubic-bezier(0.34, 1.56, 0.64, 1) 600ms both,
    speechNudge 4.5s ease-in-out 2.5s infinite;
}
```

- It sticks out from the top right corner of the photo (negative positions).
- A thick dark border, a white background and a **hard, unblurred shadow** (`4px 4px 0`): the classic comic style.
- `filter: drop-shadow` is used instead of `box-shadow` because `drop-shadow` follows the element's **actual shape**, including the tail; `box-shadow` would only shade the rectangle.
- `transform-origin: 20% 130%`: the point it grows and rotates from is the tip of the tail, so it looks as if it "comes out" of the photo.
- It appears with a bounce at 600 ms and every 4.5 s gives a little wiggle (`speechNudge`) to attract attention.

**The speech bubble's tail**, made with the two pseudo-elements and `clip-path`:

```css
.speech-bubble::before,
.speech-bubble::after { content: ""; position: absolute; clip-path: polygon(0 0, 100% 0, 0 100%); }
.speech-bubble::before { left: 20px; bottom: -16px; width: 22px; height: 16px; background: var(--comic-ink); }
.speech-bubble::after  { left: 22.5px; bottom: -9px; width: 14px; height: 11.5px; background: var(--comic-paper); }
```

`clip-path: polygon(…)` clips an element to a polygon: here, a **triangle** with vertices at the top left, top right and bottom left. There are two overlapping triangles: a dark one (the outline) and a smaller white one on top (the fill), which also covers the piece of the speech bubble's border where the tail joins it. The result is an outlined tail pointing toward your photo.

**The remaining animations:** `speechRing` (the ring that expands and fades), `speechWave` (the waves of the speaker icon light up one after another with 0.2 s delays), `speechPop` (it bursts) and `speechBurst` (the little lines):

```css
.speech-burst i:nth-child(1) { --a: 0deg; }
.speech-burst i:nth-child(2) { --a: 45deg; }
…
@keyframes speechBurst {
  0%   { opacity: 1; transform: rotate(var(--a)) translateY(-26px) scaleY(1); }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(-62px) scaleY(0.3); }
}
```

Each little line has its angle in a `--a` variable (0°, 45°, 90°…). The animation rotates it to that angle and pushes it outward: a single animation serves all eight directions. The order of the transformations matters: first it rotates, and after that "upward" means the rotated direction.

**The panel:** a semi-transparent background with `backdrop-filter: blur(10px)` (glass), the header equalizer animated only while `is-live`, and under `prefers-reduced-motion` all the animations are removed.

---

## 14. page.js, contact.css and page.css: interactions, form and startup

### 14.1 Small interactions

**The "Beyond the code" photo plays a guitar chord:**

```js
var beyond = document.querySelector(".beyond-photo");
if (beyond) {
  beyond.style.cursor = "pointer";
  beyond.addEventListener("click", function () {
    var r = beyond.getBoundingClientRect();
    XP.Ripple.at(r.left + r.width / 2, r.top + r.height / 2, Math.min(r.width, r.height) / 2);
    XP.Sound.strum();
  });
}
```

**Cards that tilt in 3D following the mouse** (only with a mouse and without reduced motion):

```js
card.addEventListener("pointermove", function (e) {
  var r = card.getBoundingClientRect();
  var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  card.style.setProperty("--ry", ((px - 0.5) * 10).toFixed(2) + "deg");
  card.style.setProperty("--rx", ((0.5 - py) * 10).toFixed(2) + "deg");
  card.style.setProperty("--lift", "-4px");
  card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
  card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
});
card.addEventListener("pointerleave", function () { /* everything back to 0 */ });
```

- `e.clientX/Y` is the mouse position in the window. By subtracting the card's position and dividing by its size, `px` and `py` end up between 0 and 1 (0 = left/top edge, 1 = right/bottom edge).
- They are converted into angles from −5° to 5° and passed to the CSS as **variables**. JS does not touch the `transform` directly: it only supplies numbers, and the CSS decides what to do with them:

```css
.expertise-card.tilt.is-visible {
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0));
  transition: transform 200ms ease-out, …;
}
.expertise-card.tilt::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(91,147,245,0.14), transparent 60%);
  opacity: 0;
}
.expertise-card.tilt:hover::after { opacity: 1; }
```

  - `perspective(900px)` adds depth: without it, rotating on X or Y would merely squash the card. `rotateX`/`rotateY` turn it as if it were a physical card being pushed on the side where the mouse is.
  - A circular glow (`::after`) follows the mouse across the card using `--mx` and `--my`.
  - When the mouse leaves (`pointerleave`), everything returns to 0 with the transition.

**The hero's color blobs follow the mouse slightly:**

```js
document.addEventListener("pointermove", function (e) {
  var dx = (e.clientX / innerWidth - 0.5) * 40, dy = (e.clientY / innerHeight - 0.5) * 40;
  field.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
}, { passive: true });
```

They shift up to 20 px toward wherever the mouse is (a *parallax* effect). `passive: true` tells the browser that this listener will never cancel the event, which lets it optimize.

**The music pauses when you switch tabs:**

```js
var pausedByHide = false;
document.addEventListener("visibilitychange", function () {
  if (document.hidden && XP.Music.playing) { pausedByHide = true; XP.Music.stop(); }
  else if (!document.hidden && pausedByHide) { pausedByHide = false; XP.Music.start(); }
});
```

It only resumes the music if it was this function that stopped it (if the visitor had turned it off by hand, it does not turn it back on).

### 14.2 The contact form

**How a message reaches your inbox.** A static site cannot send emails by itself (there is no server). **FormSubmit**, a free service, is used instead: it receives the form data at `https://formsubmit.co/ajax/luciaes.dev@gmail.com` and forwards it to you by email. The first time it was used, FormSubmit sent you an activation email that you had to confirm; since then, every message arrives automatically.

**Reading a translated text for the form:**

```js
function formText(key) {
  var all = window.TRANSLATIONS || {};
  var dict = all[XP.lang()] || all.en || {};
  return ((dict.contact || {}).form || {})[key] || "";
}
```

Each `|| {}` avoids an error if a level is missing.

**Sending:**

```js
function sendToEndpoint(data) {
  button.disabled = true;
  say("sending");
  fetch(config.contactFormEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
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
```

- **`fetch`** makes an HTTP request from JavaScript, like `HttpClient.Post` in AL (notice that the AL code in the intro does exactly that). It takes the address and the options:
  - `method: "POST"`: send data;
  - `headers`: the body is in JSON and JSON is expected back;
  - `body`: the data, converted into JSON text with `JSON.stringify` (like `JsonObject.WriteTo` in AL).
- The fields that start with `_` are FormSubmit options: the email subject ("Portfolio contact: Name"), the table format and turning off its captcha. FormSubmit uses the `email` field as the reply-to address: when you hit "Reply" in your inbox, you answer the visitor directly.
- It is a **promise chain**:
  1. When the response arrives, it tries to read it as JSON; if the response is not successful (`r.ok` is false if the HTTP status code is not 2xx) or FormSubmit does not confirm `success`, an **error is thrown** (`throw`), which jumps straight to the `catch`.
  2. If everything went well: the form is cleared and the success message is shown.
  3. If something failed at any point (no connection, a service error…): error message.
  4. The last `then` always runs: the button is re-enabled.
- While it is sending, the button is disabled (`disabled`) to prevent double submissions.

**Fallback without the service:** if `contactFormEndpoint` were `null`, `openEmailApp` builds a `mailto:` link with a subject and body (`encodeURIComponent` encodes spaces and special characters so that they are valid in a URL) and opens it: the visitor's email program opens with the message already written.

**Validating on submit:**

```js
form.addEventListener("submit", function (e) {
  e.preventDefault();
  var f = form.elements;
  if (f._gotcha.value) return;
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
```

- `e.preventDefault()`: by default, submitting a form **reloads the page**. It is cancelled so that the work can be done with `fetch` without leaving the site.
- `form.elements` gives access to the fields by their `name`. `form.elements.name` is used rather than `form.name` because `form.name` is a property of the form itself (its name), not the field: it is a common trap when a field is called `name`.
- If the `_gotcha` honeypot contains anything, it is a bot: it is silently ignored.
- `trim()` removes spaces at the beginning and the end.
- The email regular expression checks the basic "something@something.something" format with no spaces: `^` start, `[^\s@]+` one or more characters that are neither a space nor @, `\.` a literal dot, `$` end.

**The invitation animation at the end of the page:**

```js
form.addEventListener("focusin", function () { form.classList.add("is-engaged"); });

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
```

- When 55% of the form is visible, it waits 0.9 s and gives a small **wiggle** (`is-nudging`, two damped back-and-forth movements of a few pixels), and then switches to a calm **calling** state (`is-calling`): it floats gently up and down, has a halo that breathes and a sheen that sweeps across the submit button.
- `disconnect()`: it only happens once.
- As soon as the visitor enters a field (`focusin`), `is-engaged` stops the animations so as not to distract them while they type.

In `contact.css`:

```css
@keyframes formNudge {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(3px); }
  30%, 50%, 70% { transform: translateX(-5px); }
  40%, 60% { transform: translateX(5px); }
}
.contact-form.is-calling { animation: formFloat 5s ease-in-out infinite; }
.contact-form.is-calling .contact-submit::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%;
  background: linear-gradient(100deg, transparent, rgba(47, 111, 237, 0.25), transparent);
  animation: btnSweep 4.5s ease-in-out 0.5s infinite;
}
```

The wiggle grows toward the middle and dies away toward the ends (−1, 3, −5, 5, −5, 5, −5, 3, −1), like something that vibrates and comes to rest. The button's sheen is a semi-transparent diagonal stripe that crosses from left to right; since the button has `overflow: hidden`, it is only visible inside it. The layout has two columns (`grid-template-columns: 1fr 1fr`) that become one below 900 px.

### 14.3 Starting up the experience layer

```js
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
```

`page.js` is the last file and the one that **sets everything in motion**, in order: first the canvases (particles and wave), then the controls (still hidden), the voice speech bubble, the interactions, the form and, finally, the intro, which is given the callback "when you finish, show the controls".

`document.readyState` indicates whether the HTML is still being read (`"loading"`) or is already ready. If it is still being read, it waits for `DOMContentLoaded`; if it is ready, it starts straight away. That way it works in either case.

---

## 15. The audio files: how they were processed and how they are synchronized

### 15.1 Processing the voice

You recorded the message in two `.m4a` files (English and Spanish). To make it sound clean, noise-free and at a comfortable volume, it was processed with **ffmpeg**, a command-line tool for audio and video. This command reproduces the chain that was used:

```bash
ffmpeg -i en.m4a -af "silenceremove=start_periods=1:start_threshold=-45dB,\
highpass=f=80,lowpass=f=12000,afftdn=nf=-25,\
equalizer=f=3000:t=q:w=1.2:g=2,\
acompressor=threshold=-20dB:ratio=3:attack=10:release=150,\
aecho=0.8:0.5:40:0.12,\
loudnorm=I=-28:TP=-2:LRA=7" \
-ar 44100 -ac 1 -b:a 96k opening-en.mp3
```

`-af` applies a **filter chain**, one filter after another, separated by commas (just like Web Audio nodes):

| Filter | What it does |
|---|---|
| `silenceremove` | Removes the silence at the beginning, so that the voice starts right away. |
| `highpass=f=80` | Removes frequencies below 80 Hz: hum, knocks on the microphone. |
| `lowpass=f=12000` | Removes frequencies above 12 kHz: hiss. |
| `afftdn=nf=-25` | **Noise reduction** (it analyzes the background noise and subtracts it). |
| `equalizer=f=3000…g=2` | Slightly boosts (+2 dB) the 3 kHz region, where the clarity of the voice lies. |
| `acompressor` | Compresses: evens out the loudest and softest parts of the voice. |
| `aecho=0.8:0.5:40:0.12` | A very short, soft echo (40 ms, 12%) that gives a sense of a room, which sounds more natural. |
| `loudnorm=I=-28…` | **Normalizes the loudness** to −28 LUFS (a standard measure of perceived loudness). Music platforms use around −14 LUFS; −28 is considerably lower, on purpose, because the voice should not startle the visitor (it was lowered on two occasions compared with the first version). |

After that: `-ar 44100` (sample rate), `-ac 1` (mono, enough for a voice and half the size) and `-b:a 96k` (MP3 quality). The result measures about −29 LUFS, and on the site it is also played back at 70% (`XP.Voice.VOLUME`).

### 15.2 Extracting the caption timings

The timings in `openingCues` were not set by eye. The **pauses** in the recording were detected automatically:

```bash
ffmpeg -i opening-en.mp3 -af silencedetect=noise=-38dB:d=0.18 -f null -
```

`silencedetect` reports every stretch where the volume drops below −38 dB for at least 0.18 s:

```
silence_start: 0        silence_end: 0.234
silence_start: 2.285    silence_end: 2.715
silence_start: 5.625    silence_end: 6.306
…
```

Each end of a silence is the start of a sentence and each start of a silence is the end of the previous one. From there, with small adjustments by ear, come `[0.21, 2.33, "Hello, and welcome to my portfolio."]`, `[2.71, 5.77, "I'm Lucía Esteban…"]`, `[6.29, …]`, and so on. Within each sentence, the words are distributed by number of letters (13.3). The guided tour steps (`openingTour`) use the same sentence starts, so that the page moves exactly when you mention each section.

If you ever re-record the message: process the audio with the first command, extract the silences with the second, update the timings in `core.js` and bump `VERSION` in `XP.Voice` (so that browsers do not use the old recording stored in their cache).

---

## 16. Publishing: Git, GitHub Pages and caching

### 16.1 GitHub Pages

The repository `LuciaEsteban/LuciaEsteban.github.io` has a special name: `<username>.github.io`. GitHub automatically publishes its contents at `https://luciaesteban.github.io/`. Every time a change is pushed to the `main` branch, GitHub Actions (GitHub's automation system) republishes the site; it takes anywhere from a few seconds to a couple of minutes.

There is no server, domain or database to configure. Since the site is static, GitHub only has to serve the files exactly as they are.

### 16.2 The Git workflow

Git works just as it does in your AL projects with Azure DevOps:

```bash
git add assets/js/experience/voice.js      # stage the changed files
git commit -m "Voice tour: locked and eased scrolling"   # save a version with a message
git push origin main                        # push to GitHub → it goes live
```

Files can also be uploaded from the GitHub website itself ("Add file → Upload files"), which is what was done during this project.

### 16.3 The cache and `?v=`

Browsers keep copies of CSS, JS and image files so that they do not have to download them on every visit. The problem: after a change is published, a visitor might keep using the old copy. The solution is to change the files' address with every release:

```html
<script src="assets/js/experience/voice.js?v=202609231334"></script>
```

Everything after the `?` consists of parameters that GitHub Pages ignores (it serves the same file), but to the browser it is a different address, so it downloads the file again. The number is the date and time of the release (year, month, day, hour, minute). **Rule: every time you change a CSS or JS file, change the number in every `?v=` in `index.html`.** The audio has its own number (`XP.Voice.VERSION`).

### 16.4 How it was tested

To check the site at many screen sizes without owning all those devices, **Playwright** was used: a tool that controls a Chrome browser from a program (written in Python). It opens the site at a specific size (from a 360 px phone to a 1920 px desktop), in light and dark mode, clicks the bubble and the speech bubble, tries to scroll during the guided tour, checks that nothing overflows the screen and that the captions panel stays above everything, and takes screenshots. To test it yourself by hand, the browser's developer tools (F12) are enough: they have a mode that simulates phones (Ctrl+Shift+M).

---

## 17. How to build this site from scratch, step by step

This is the recommended order if you wanted to rebuild it on your own. Each step adds a layer and leaves the site working.

**Step 1. Minimal structure.** Create `index.html` with the skeleton (`<!DOCTYPE html>`, `<html>`, `<head>` with `charset` and `viewport`, `<body>`). Write all the content in English using semantic HTML: a `<header>` with the menu, a `<main>` with one `<section id="…">` per part, and a `<footer>`. Open it in the browser: it will look ugly, but everything will be there.

**Step 2. Base styles.** Create `styles.css` and link it. Start with the variables (`:root { --color-… }`), the reset and `.container`. Then go section by section: header (`flex`), hero (two-column `grid`), cards (`grid` with `auto-fit`), timeline, contact. Always use `var(--…)` for colors.

**Step 3. Mobile adaptation.** Add the media queries (900, 760, 600 px). Test with the mobile mode of the developer tools. Add the hamburger button.

**Step 4. Dark mode.** Add the `:root[data-theme="dark"]` block with the dark colors and the `<head>` script that sets `data-theme`. Add the button and its logic in `main.js`.

**Step 5. Languages.** Create `i18n.js` with the `TRANSLATIONS` object (en/es). Mark the elements with `data-i18n` and write `resolvePath` and `applyTranslations` in `main.js`. Add the EN/ES buttons and `localStorage`.

**Step 6. Configuration and calculated data.** Create `config.js`. Program `computeDuration` and the experience texts, the footer year and the contact links.

**Step 7. Reveal animations and scrollspy.** The `.reveal` class in CSS and the two `IntersectionObserver`s in `main.js`. Add the `prefers-reduced-motion` rules.

**Step 8. Publish.** Create the `<username>.github.io` repository, upload the files and check the site online. From here on, publish after every step.

**Step 9. Foundation of the experience layer.** Create `core.js` with `window.XP`, `XP.lang`, `XP.t` and `XP.onLanguageChange`, and `page.js` with the `boot` function. Link them after `main.js`.

**Step 10. Sound.** Start with `XP.Sound` containing only the `AudioContext`, a master `GainNode` and the `pop`. Test it with a button. Then add the piano and the chord. After that, the music: first a chord that repeats with `setInterval`, and once that works, the lookahead scheduler, the progression and the patterns.

**Step 11. Intro.** Add the intro's HTML, `intro.css` (first the static bubble, then the animations) and `intro.js` (first just `enter`, then the typing, the language selector and the falling code).

**Step 12. Canvases.** `visuals.js`: first `makeCanvas` and the wave; then the particles for a single season; then the rest.

**Step 13. Controls.** `controls.js` and `controls.css`: the player and the animation button.

**Step 14. Form.** The form's HTML, `contact.css`, and in `page.js` the validation and the sending with `fetch`. Register the form with FormSubmit by sending a first test message.

**Step 15. Voice.** Record and process the audio (chapter 15), add `XP.Voice`, the speech bubble and the captions panel. Once the captions work, add the guided tour with `Glide` and the scroll lock.

**Step 16. Polish.** Test in light and dark mode, on mobile and on desktop, with the keyboard (Tab, Enter, Escape) and with reduced motion turned on in the operating system.

---

## 18. Glossary

| Term | Meaning |
|---|---|
| **API** | A set of functions that something offers for use from code. The "Web Audio API" is what the browser offers for sound. |
| **Attribute** | Extra data on an HTML tag: `class="…"`, `id="…"`. |
| **Breakpoint** | A screen width at which the design changes (900, 760, 600 px). |
| **Bus** | In audio, a point where several signals are gathered so they can be processed together. |
| **Cache** | A local copy of files that the browser keeps so as not to download them again. |
| **Callback** | A function passed to another one so that it can call it later. |
| **Canvas** | An HTML element on which you draw pixel by pixel with code. |
| **Closure** | A function that remembers the variables of the place where it was created. |
| **CSS** | The style language: the appearance of the site. |
| **Design token** | A variable that stores a design decision (a color, a radius…). |
| **DOM** | The tree of objects that the browser builds from the HTML and that JS can modify. |
| **DPR** | *Device Pixel Ratio*: physical pixels per CSS pixel. |
| **Easing** | The acceleration curve of an animation. |
| **Envelope** | How the volume of a note changes over time (attack and decay). |
| **Event** | Something that happens (a click, a key press, the end of an audio clip) and that code can subscribe to. |
| **fetch** | A function for making HTTP requests from JavaScript. |
| **Graceful degradation** | The site keeps working if something "extra" fails (JS turned off, an old browser). |
| **Hero** | The main block at the top of a website. |
| **Honeypot** | An invisible field that only bots fill in, used to detect spam. |
| **HTML** | The markup language: the content and structure of the site. |
| **i18n** | Internationalization: preparing the site for several languages. |
| **IIFE** | A function that is defined and executed immediately, to isolate variables. |
| **IntersectionObserver** | A browser tool that notifies you when an element enters or leaves the screen. |
| **localStorage** | The browser's key-value store, which persists between visits. |
| **LUFS** | The standard unit of perceived loudness of an audio file. |
| **Media query** | A CSS rule that only applies under certain conditions (width, preferences). |
| **MIDI** | A system that numbers musical notes (60 = middle C, 69 = A at 440 Hz). |
| **Namespace** | An object or package that groups names so that they do not clash with others. |
| **Node (audio)** | A Web Audio module (oscillator, filter, volume…) that connects to others. |
| **Promise** | An object that represents a result that will arrive later. |
| **Pseudo-element** | `::before` / `::after`: extra boxes that CSS creates without touching the HTML. |
| **requestAnimationFrame** | Asks for a function to be run before the next frame is drawn on screen. |
| **Responsive** | A design that adapts to any screen size. |
| **Scrollspy** | Highlighting in the menu the section currently being viewed. |
| **Selector** | The part of a CSS rule that states which elements it applies to. |
| **Stacking context** | A closed group of layers: its elements cannot interleave in depth with those outside it. |
| **SVG** | A vector drawing format written as code. |
| **Vanilla JS** | JavaScript without libraries or frameworks. |
| **Viewport** | The visible area of the page in the browser window. |
| **z-index** | The order of the layers: the higher it is, the further on top. |

---

## 19. Review questions

If you can answer these questions without looking, you understand the site. The chapter containing the answer is given in parentheses.

1. Why can this site be hosted for free on GitHub Pages? Which part does depend on an external service? (1.1, 14.2)
2. What is the difference between the HTML and the DOM? (2.1)
3. What are the `data-*` and `aria-*` attributes for? Give an example of each as used on the site. (2.1)
4. How does dark mode work without any rule on the site knowing which mode it is in? (4.2)
5. Why is the script that sets the theme in the `<head>` and not in `main.js`? (3.2)
6. Explain what `repeat(auto-fit, minmax(min(380px, 100%), 1fr))` does. (4.7)
7. What is an IIFE and why does every JS file start with one? (2.3)
8. How does the HTML know which translated text to put in each place? Describe the path from the click on "ES" to the moment a heading changes. (6.2, 7.2)
9. How is your length of experience calculated, and why does it never need updating? (5, 7.6)
10. What is an `IntersectionObserver`, and what two things is it used for in `main.js`? (7.4, 7.5)
11. Compare `addEventListener` with an AL `EventSubscriber`. (2.3)
12. Why can the music not start on its own when the site opens? (9.2)
13. Explain the audio circuit in your own words: what a node, a bus and an envelope are. (9.1, 9.3)
14. Why is the music scheduled 250 ms ahead instead of playing each note with `setTimeout`? (9.7)
15. What makes the music build up and never repeat itself exactly? (9.7)
16. What is *ducking* and when does it happen? (9.7)
17. Why is the canvas drawn at a size multiplied by the DPR? (10.2)
18. Why do the particles multiply their movement by `dt`? (10.4)
19. How is the falling AL code made to loop without any jumps? (12.1)
20. Describe what happens in the 1.4 seconds after the bubble is tapped. (12.3)
21. Why is the captions panel in `<body>` and not inside your photo? (13.2)
22. How is it decided when each word of the captions lights up? (13.3, 13.4)
23. Why does the guided tour use its own scrolling rather than the browser's? What is *easeInOutCubic*? (13.6)
24. How is scrolling blocked during the tour, and why are `passive: false` and `capture: true` needed? (13.6)
25. Why is `e.stopPropagation()` called when the speech bubble is tapped? (13.7)
26. What is the honeypot and how does it detect spam? (3.8, 14.2)
27. Describe the promise chain used to send the form. What happens if there is no internet connection? (14.2)
28. What is the `?v=` in the links to CSS and JS files for? (16.3)
29. How were the caption timings obtained? (15.2)
30. If you wanted to add a new "Certifications" section with its own link in the menu, which files would you touch and what would you add to each one? (3, 4, 6, and 8.3 if you wanted to include it in the guided tour)
