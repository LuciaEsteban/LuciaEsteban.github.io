# Guía completa del código del portfolio

> **Para quién es esta guía.** Para alguien que sabe programar (Java y AL a nivel básico o medio) pero no conoce HTML, CSS ni JavaScript. No se explica qué es un bucle, una variable o un `if`: eso ya lo sabes. Sí se explica todo lo que es propio de la web, con comparaciones con Java y AL cuando ayudan.
>
> **Objetivo.** Que después de estudiarla entiendas cada archivo de la web, sepas explicar por qué está hecho así y puedas reconstruirla desde cero.
>
> Versión en inglés: [code-guide-en.md](code-guide-en.md)

---

## Índice

1. [Visión general: qué es esta web y cómo está organizada](#1-visión-general-qué-es-esta-web-y-cómo-está-organizada)
2. [Los tres lenguajes de la web, explicados desde Java y AL](#2-los-tres-lenguajes-de-la-web-explicados-desde-java-y-al)
3. [index.html: la estructura de la página](#3-indexhtml-la-estructura-de-la-página)
4. [styles.css: el diseño base](#4-stylescss-el-diseño-base)
5. [config.js: la configuración](#5-configjs-la-configuración)
6. [i18n.js: los textos en dos idiomas](#6-i18njs-los-textos-en-dos-idiomas)
7. [main.js: el comportamiento base](#7-mainjs-el-comportamiento-base)
8. [La capa "experience" y core.js](#8-la-capa-experience-y-corejs)
9. [sound.js: efectos, música generativa y voz](#9-soundjs-efectos-música-generativa-y-voz)
10. [visuals.js: la onda y las animaciones de temporada](#10-visualsjs-la-onda-y-las-animaciones-de-temporada)
11. [controls.js y controls.css: los controles flotantes](#11-controlsjs-y-controlscss-los-controles-flotantes)
12. [intro.js e intro.css: la pantalla de la burbuja](#12-introjs-e-introcss-la-pantalla-de-la-burbuja)
13. [voice.js y voice.css: el mensaje de voz y la visita guiada](#13-voicejs-y-voicecss-el-mensaje-de-voz-y-la-visita-guiada)
14. [page.js, contact.css y page.css: interacciones, formulario y arranque](#14-pagejs-contactcss-y-pagecss-interacciones-formulario-y-arranque)
15. [Los audios: cómo se procesaron y cómo se sincronizan](#15-los-audios-cómo-se-procesaron-y-cómo-se-sincronizan)
16. [Publicación: Git, GitHub Pages y caché](#16-publicación-git-github-pages-y-caché)
17. [Cómo construir esta web desde cero, paso a paso](#17-cómo-construir-esta-web-desde-cero-paso-a-paso)
18. [Glosario](#18-glosario)
19. [Preguntas de repaso](#19-preguntas-de-repaso)

---

## 1. Visión general: qué es esta web y cómo está organizada

### 1.1 Una web estática

La web es **estática**: no hay servidor con lógica propia (no hay Java en un servidor, ni base de datos, ni nada que se ejecute "detrás"). Solo hay archivos que el navegador descarga y ejecuta:

- **HTML** (`index.html`): el *contenido y la estructura*. Qué hay en la página: títulos, párrafos, botones, el formulario…
- **CSS** (`.css`): el *aspecto*. Colores, tamaños, posiciones, animaciones.
- **JavaScript** (`.js`): el *comportamiento*. Lo que pasa cuando haces clic, cambiar de idioma, la música, la voz…

Todo lo "dinámico" (calcular tu tiempo de experiencia, cambiar el idioma, generar la música) ocurre **en el navegador del visitante**, no en un servidor. Por eso puede alojarse gratis en **GitHub Pages**, que lo único que hace es servir archivos tal cual.

Una comparación con Business Central: es como si toda la aplicación fuera la parte cliente. No hay "service tier" que ejecute codeunits; el navegador es a la vez la interfaz y el motor que ejecuta el código.

La única excepción es el formulario de contacto, que envía los datos a un servicio externo (FormSubmit) para que te lleguen por email. Eso se explica en el capítulo 14.

### 1.2 Sin frameworks ni compilación

No se usa React, Angular, Vue ni ningún *bundler* (herramientas que "compilan" el código web). El código que escribes es exactamente el que ejecuta el navegador. Ventajas:

- No hay nada que instalar ni compilar: editas un archivo, lo subes, y ya está.
- Es más fácil de entender y de mantener años después.
- GitHub Pages lo sirve directamente.

A este JavaScript sin librerías se le llama **"vanilla JavaScript"**.

### 1.3 Mapa de archivos

```
.
├── index.html                    La única página: todo el contenido
├── README.md                     Descripción del proyecto
├── docs/                         Esta guía (español e inglés)
└── assets/
    ├── audio/
    │   ├── opening-en.mp3        Tu mensaje de voz en inglés
    │   └── opening-es.mp3        Tu mensaje de voz en español
    ├── img/                      Foto de perfil, iconos (favicon), imagen para redes
    ├── css/
    │   ├── styles.css            Diseño base de toda la web
    │   └── experience/           Estilos de la "capa de experiencia"
    │       ├── intro.css         Pantalla inicial de la burbuja
    │       ├── controls.css      Reproductor de música y botón de animación
    │       ├── voice.css         Viñeta "Escúchame" y subtítulos
    │       ├── contact.css       Sección de contacto y formulario
    │       └── page.css          Lienzos (canvas), inclinación de tarjetas, chips
    └── js/
        ├── config.js             Configuración (fechas, email, enlaces…)
        ├── i18n.js               Todos los textos de la web en inglés y español
        ├── main.js               Comportamiento base: idioma, tema, menú…
        └── experience/           La "capa de experiencia" (todo lo interactivo extra)
            ├── core.js           Base compartida: textos, idioma, utilidades
            ├── sound.js          Efectos de sonido, música generativa, voz
            ├── visuals.js        Onda al explotar burbujas y partículas de temporada
            ├── controls.js       Reproductor de música y botón de animación
            ├── intro.js          Pantalla inicial de la burbuja
            ├── voice.js          Mensaje de voz, subtítulos y visita guiada
            └── page.js           Interacciones, formulario de contacto y arranque
```

### 1.4 Dos capas: base y "experience"

El código está dividido a propósito en dos capas:

1. **La web base** (`styles.css`, `config.js`, `i18n.js`, `main.js`): el portfolio en sí. Funciona por sí sola: textos, idiomas, modo oscuro, menú, animaciones al hacer scroll, enlaces de contacto.
2. **La capa de experiencia** (todo lo que está en las carpetas `experience/`): lo que se añade encima para hacerla más llamativa: la burbuja inicial, la música, la voz, las partículas de temporada, el formulario, etc.

Separarlas así tiene una ventaja clara: si algún día quisieras quitar la capa de experiencia, bastaría con no cargar esos archivos y la web seguiría funcionando. Es la misma idea que en AL separar una extensión de la aplicación base: la base no depende de la extensión.

### 1.5 Qué pasa cuando alguien abre la web (el flujo completo)

Este es el recorrido completo, de principio a fin. Merece la pena entenderlo antes de entrar en detalle:

1. El navegador descarga `index.html` y empieza a leerlo de arriba abajo.
2. En la cabecera (`<head>`) encuentra los CSS y los descarga. También ejecuta dos pequeños scripts:
   - uno que pone el **tema** (oscuro por defecto, o el que eligió el visitante la última vez);
   - otro que añade la clase `intro-open`, que **difumina** la página mientras se ve la burbuja.
3. Lee el cuerpo (`<body>`): la pantalla de la burbuja, la cabecera, las secciones, el pie.
4. Al final del `<body>` encuentra los `<script>` y los ejecuta en orden: `config.js`, `i18n.js`, `main.js` y luego los de `experience/`.
5. Cuando todo el HTML está leído, se dispara el evento `DOMContentLoaded`. En ese momento:
   - `main.js` aplica los textos del idioma, el tema, el menú, las animaciones de scroll, etc.
   - `page.js` arranca la capa de experiencia: crea los lienzos de partículas, los controles, la viñeta de voz y la pantalla de la burbuja.
6. El visitante ve la burbuja emergiendo, el código AL cayendo de fondo, y un texto de bienvenida que se escribe solo.
7. Al tocar la burbuja: suena un "pop" y un acorde, la burbuja explota, la página se desenfoca hacia nítida y empieza la música.
8. Ya en la web: puede cambiar idioma, tema, parar la música, desactivar las partículas, tocar la viñeta "Escúchame" para oír tu mensaje (con subtítulos y visita guiada), y escribirte con el formulario.

---

## 2. Los tres lenguajes de la web, explicados desde Java y AL

Este capítulo es la base de todo lo demás. No explica lo común a todos los lenguajes, sino **lo que es propio de la web** y lo que más choca viniendo de Java o AL.

### 2.1 HTML: la estructura

#### Etiquetas, elementos y atributos

HTML no es un lenguaje de programación: no tiene variables ni lógica. Es un lenguaje de **marcado**: describe qué es cada cosa. Se escribe con **etiquetas**:

```html
<p class="hero-role" data-i18n="hero.role">Microsoft Dynamics 365 Business Central / AL Developer</p>
```

- `<p>` abre un **elemento** de tipo párrafo; `</p>` lo cierra. Lo de dentro es su contenido.
- `class="hero-role"` y `data-i18n="hero.role"` son **atributos**: datos extra sobre el elemento, en formato `nombre="valor"`.
- Algunos elementos no tienen contenido y no se cierran: `<img ... />`, `<input ... />`, `<meta ... />`.

Los elementos se anidan unos dentro de otros, formando un **árbol**:

```html
<section id="about">
  <div class="container">
    <h2>About me</h2>
    <p>Texto…</p>
  </div>
</section>
```

#### El DOM: el HTML convertido en objetos

Cuando el navegador lee el HTML, construye en memoria un árbol de objetos llamado **DOM** (*Document Object Model*). Cada etiqueta se convierte en un objeto con propiedades y métodos. JavaScript no modifica el archivo HTML; modifica **el DOM**, y el navegador redibuja la pantalla al momento.

Una analogía con AL: el HTML es como la definición de una página en AL (el `layout` con sus `group` y `field`), y el DOM sería la página ya abierta en memoria, sobre la que el código puede actuar en tiempo de ejecución (mostrar u ocultar campos, cambiar valores…).

#### Los atributos que más vas a ver en esta web

| Atributo | Para qué sirve |
|---|---|
| `id="contact"` | Identificador único en toda la página. Sirve para encontrar el elemento desde JS (`getElementById`) y para enlaces internos (`href="#contact"` salta a ese elemento). |
| `class="section section-alt"` | Una o varias "etiquetas" separadas por espacios. El CSS las usa para dar estilo y JS para encontrar elementos. Un elemento puede tener muchas clases. |
| `data-algo="valor"` | Atributos inventados por ti. Todo lo que empieza por `data-` es libre. Aquí se usan, por ejemplo, `data-i18n` (qué texto traducido va dentro) y `data-lang` (qué idioma activa un botón). |
| `aria-*` y `role` | **Accesibilidad**: información para lectores de pantalla (personas ciegas). Por ejemplo, `aria-hidden="true"` indica "esto es decorativo, ignóralo"; `aria-pressed="true"` indica que un botón de tipo interruptor está activado; `aria-label` da un nombre a un botón que solo tiene un icono. |
| `href` | Destino de un enlace `<a>`. |
| `src` | Archivo que carga una imagen `<img>` o un `<script>`. |

#### HTML semántico

Hay etiquetas que no cambian el aspecto, pero sí el **significado**: `<header>` (cabecera), `<nav>` (menú de navegación), `<main>` (contenido principal), `<section>` (sección), `<article>` (bloque independiente, como cada tarjeta), `<footer>` (pie). Sirven para accesibilidad y para buscadores (SEO). `<div>` y `<span>` son contenedores genéricos sin significado: `<div>` ocupa una línea entera (elemento de **bloque**) y `<span>` va dentro de una línea de texto (elemento **en línea**).

#### SVG: dibujos hechos con código

Los iconos de la web no son imágenes: son **SVG**, dibujos vectoriales escritos dentro del HTML:

```html
<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
```

- `viewBox="0 0 24 24"` define un lienzo de coordenadas de 24×24.
- `<path d="...">` es un trazo. `M8 5` significa "mueve el lápiz a (8,5)", `v14` "línea vertical de 14", `l11-7` "línea relativa de (+11,−7)", `z` "cierra la figura". Ese path concreto dibuja el triángulo de "play".
- `fill="currentColor"` hace que el icono tome el color de texto del elemento que lo contiene, así se puede recolorear desde CSS.

Otras figuras: `<circle cx cy r>` (círculo), `<rect x y width height rx>` (rectángulo, `rx` redondea las esquinas).

### 2.2 CSS: el aspecto

#### Reglas, selectores y propiedades

Una regla CSS dice "a estos elementos, aplícales estas propiedades":

```css
.hero-role {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary-soft);
}
```

- `.hero-role` es el **selector**: qué elementos se ven afectados.
- Dentro de las llaves, pares `propiedad: valor;`.

Tipos de selectores usados en la web:

| Selector | Significado |
|---|---|
| `p` | Todos los elementos `<p>`. |
| `.btn` | Elementos con la clase `btn`. |
| `#main` | El elemento con `id="main"`. |
| `.hero .btn` | Elementos `.btn` que estén **dentro** (a cualquier profundidad) de un `.hero`. |
| `body > main` | `<main>` que sea **hijo directo** de `<body>`. |
| `.btn.btn-primary` | Elementos que tienen **las dos** clases a la vez. |
| `a, button` | Varios selectores con las mismas reglas. |
| `[aria-pressed="true"]` | Elementos con ese atributo y valor. |
| `:hover`, `:focus-visible` | **Pseudoclases**: estados. `:hover` es "con el ratón encima"; `:focus-visible`, "seleccionado con el teclado". |
| `:nth-child(2)` | El segundo hijo de su padre. Se usa para dar un color distinto a cada tarjeta. |
| `:not(.intro)` | Todo lo que **no** tiene la clase `intro`. |
| `::before`, `::after` | **Pseudoelementos**: dos "cajas fantasma" que CSS puede crear dentro de cualquier elemento sin tocar el HTML. Se usan muchísimo para adornos: la cola de la viñeta, el anillo de la burbuja, etc. Necesitan `content: ""` para existir. |

#### La cascada y la especificidad

Si varias reglas afectan al mismo elemento y se contradicen, gana:

1. La más **específica**: un `#id` pesa más que una `.clase`, y una `.clase` más que una etiqueta `p`. `.a.b` pesa más que `.a`.
2. Si pesan igual, **la última** que aparece en el código.
3. `!important` fuerza una propiedad por encima de todo (se usa poco, solo en casos concretos).

Por eso el orden en que se cargan los CSS importa: primero `styles.css` (la base) y después los de `experience/`, que pueden sobrescribir cosas.

#### Variables CSS (custom properties)

```css
:root {
  --color-accent: #2f6fed;
}
.btn-primary { background: var(--color-accent); }
```

- `--color-accent` es una variable. Se define una vez y se usa con `var(--color-accent)`.
- `:root` es el elemento raíz (`<html>`): lo que se define ahí vale para toda la página.
- La gran ventaja: **el modo oscuro solo redefine las variables**, y todo lo que las usa cambia de color automáticamente (capítulo 4).
- Una variable también puede tener un valor por defecto: `var(--rx, 0deg)` usa `0deg` si `--rx` no está definida. JavaScript puede cambiar variables en cualquier elemento, y así se comunica con el CSS (por ejemplo, para inclinar las tarjetas en 3D).

#### Unidades

| Unidad | Significado |
|---|---|
| `px` | Píxeles. |
| `rem` | Múltiplos del tamaño de letra base (normalmente 16 px). `1.5rem` = 24 px. Se usa para que todo escale si el usuario agranda la letra. |
| `em` | Múltiplos del tamaño de letra del propio elemento. |
| `%` | Porcentaje del elemento padre. |
| `vw` / `vh` | 1 % del ancho / alto de la ventana. |
| `vmin` | 1 % del lado más pequeño de la ventana (sirve para que la burbuja quepa tanto en horizontal como en vertical). |
| `ch` | Ancho del carácter "0". `max-width: 62ch` limita un párrafo a unas 62 letras por línea, que es cómodo de leer. |
| `ms` / `s` | Milisegundos / segundos (animaciones). |
| `deg` | Grados (rotaciones). |
| `fr` | "Fracción" del espacio libre, en las rejillas (*grid*). |

Y tres funciones muy útiles:

- `min(320px, 100%)`: el más pequeño de los dos. "Mide 320 px, pero nunca más que el hueco disponible."
- `clamp(2.2rem, 4.5vw, 3.4rem)`: "4.5vw, pero nunca menos de 2.2rem ni más de 3.4rem". Hace que los títulos crezcan con la pantalla sin pasarse.
- `calc(100vw - 2.4rem)`: operaciones mezclando unidades.

#### El modelo de caja

Cada elemento es una caja con, de dentro a fuera: contenido, `padding` (relleno interior), `border` (borde) y `margin` (margen exterior). La regla `box-sizing: border-box` (al principio de `styles.css`) hace que `width` incluya el relleno y el borde, lo que simplifica mucho los cálculos.

#### Colocar cosas: flex y grid

- **Flexbox** (`display: flex`): coloca los hijos **en fila** (o en columna con `flex-direction: column`). `gap` es el espacio entre hijos; `align-items: center` los centra en vertical; `justify-content: space-between` los separa al máximo. Ejemplo: la cabecera (logo a la izquierda, menú a la derecha).
- **Grid** (`display: grid`): coloca los hijos en una **rejilla** de filas y columnas. `grid-template-columns: 1fr 1fr` son dos columnas iguales. Ejemplo: la sección de contacto (texto a la izquierda, formulario a la derecha) y las tarjetas de Business Central.

#### Posicionamiento y capas (z-index)

| `position` | Comportamiento |
|---|---|
| `static` | Normal, en el flujo de la página (valor por defecto). |
| `relative` | Normal, pero sirve de **referencia** para los hijos `absolute`. |
| `absolute` | Sale del flujo y se coloca con `top/left/right/bottom` respecto al antepasado `relative` más cercano. Ejemplo: la viñeta "Escúchame" sobre la esquina de tu foto. |
| `fixed` | Se coloca respecto a la **ventana**: no se mueve al hacer scroll. Ejemplo: el reproductor de música. |
| `sticky` | Normal hasta que llega al borde al hacer scroll, y ahí se queda pegado. Ejemplo: la cabecera. |

`inset: 0` es la forma corta de `top: 0; right: 0; bottom: 0; left: 0` (ocupar todo el padre).

`z-index` decide qué capa queda encima cuando dos elementos se solapan: mayor número, más arriba. **Pero** hay una trampa importante que aparece en esta web: algunos estilos (por ejemplo, `transform`, `filter` u `opacity` menor que 1) crean un **contexto de apilamiento**, es decir, una "caja cerrada" de capas. Un hijo con `z-index: 9999` dentro de esa caja nunca podrá quedar por encima de algo que esté fuera de ella con más z-index que la caja entera. Además, `transform` hace que un hijo con `position: fixed` deje de fijarse a la ventana y se fije a ese padre. Por eso los subtítulos de la voz se crean directamente en `<body>` y no dentro de tu foto (capítulo 13).

Capas de la web, de abajo arriba:

| z-index | Elemento |
|---|---|
| 0 – 1 | Fondos decorativos y contenido de las secciones |
| 50 | Lienzo de partículas de temporada |
| 100 | Cabecera fija |
| 900 | Reproductor de música y botón de animación |
| 1000 | Pantalla de la burbuja inicial |
| 1001 | Lienzo de la onda (explosión de burbujas) |
| 1100 | Subtítulos del mensaje de voz (siempre por encima de todo) |

#### Transiciones y animaciones

- **Transición**: cuando una propiedad cambia (por ejemplo, porque JS añade una clase), en lugar de cambiar de golpe cambia poco a poco.
  ```css
  .reveal { opacity: 0; transition: opacity 0.7s ease; }
  .reveal.is-visible { opacity: 1; }
  ```
  Al añadir `is-visible`, la opacidad pasa de 0 a 1 en 0,7 segundos.
- **Animación con `@keyframes`**: una secuencia definida por fotogramas clave que se reproduce sola:
  ```css
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }
  .scroll-hint svg { animation: bob 2.2s ease-in-out infinite; }
  ```
  Formato de `animation`: nombre, duración, curva, (retardo), repeticiones.
- **Curvas de velocidad (*easing*)**: `linear` (constante), `ease`, `ease-in-out` (arranca y frena suave), o una curva a medida `cubic-bezier(0.22, 1, 0.36, 1)` (arranca rápido y frena muy suave). Si el segundo número es mayor que 1, la animación "se pasa" un poco y vuelve, lo que da efecto de rebote.
- **`transform`**: mueve (`translate`), escala (`scale`) o gira (`rotate`) un elemento **sin afectar al resto** de la página, y el navegador lo hace con la tarjeta gráfica, así que es muy fluido. Por eso casi todas las animaciones usan `transform` y `opacity`.

#### Media queries: adaptar a cada pantalla y preferencia

```css
@media (max-width: 900px) { /* reglas solo para pantallas de 900 px o menos */ }
@media (prefers-reduced-motion: reduce) { /* el usuario pidió menos animaciones */ }
@media (pointer: coarse) { /* pantalla táctil */ }
```

La web tiene tres "saltos" (*breakpoints*): **900 px** (tablet: la foto pasa encima del texto), **760 px** (aparece el menú hamburguesa) y **600 px** (móvil).

`prefers-reduced-motion` es una opción de accesibilidad del sistema operativo para personas a las que las animaciones marean. La web la respeta en todas partes: si está activada, casi todo aparece sin movimiento.

### 2.3 JavaScript: el comportamiento

#### Lo que más cambia respecto a Java

| Java | JavaScript |
|---|---|
| Tipado estático: `int n = 5;` | Tipado dinámico: `var n = 5;` y luego `n = "hola"` es válido. |
| Hay que compilar | Lo interpreta el navegador directamente. |
| Clases obligatorias | Se puede escribir todo con funciones y objetos sueltos. |
| `String`, `int`, `boolean`, `double` | `string`, `number` (todos los números son decimales), `boolean`, y además `null` y `undefined` ("no tiene valor"). |
| `==` compara referencias en objetos | Usa siempre `===` (igualdad estricta, sin conversiones raras). |

Esta web usa `var` para declarar variables (la forma clásica, compatible con todos los navegadores). Las funciones se declaran con `function nombre(parametros) { ... }`.

#### Objetos literales: como un JSON vivo

```js
var CONFIG = {
  professionalEmail: "luciaes.dev@gmail.com",
  cvPdfUrl: null,
  education: { damCompletedYear: null }
};
CONFIG.professionalEmail;      // "luciaes.dev@gmail.com"
CONFIG["professionalEmail"];   // lo mismo, con el nombre como texto
```

Un objeto es un conjunto de pares clave-valor, parecido a un `HashMap<String, Object>` de Java o a un `JsonObject` de AL. Los valores pueden ser cualquier cosa: textos, números, otros objetos, listas... **o funciones**:

```js
var Music = {
  playing: false,
  start: function () { this.playing = true; }
};
Music.start();
```

Dentro de una función que pertenece a un objeto, `this` es ese objeto (como en Java). Así se organizan los "módulos" de esta web: `XP.Sound`, `XP.Music`, `XP.Seasons`… son objetos con datos y funciones, que hacen el papel de una clase con una sola instancia.

Las **listas** (arrays) se escriben con corchetes: `[1, 2, 3]`. Tienen métodos muy usados en la web:

- `lista.forEach(function (x) { ... })`: ejecuta la función para cada elemento.
- `lista.map(function (x) { return ...; })`: crea una lista nueva transformando cada elemento.
- `lista.filter(function (x) { return condicion; })`: crea una lista con los elementos que cumplen la condición.
- `lista.push(x)`: añade al final. `lista.length`: número de elementos.

#### Las funciones son valores (callbacks)

En JavaScript una función se puede guardar en una variable, pasarse como parámetro o devolverse, como cualquier otro valor. A una función que pasas para que "te llamen luego" se le llama **callback**:

```js
setTimeout(function () { console.log("han pasado 2 segundos"); }, 2000);
```

Aquí se le pasa a `setTimeout` una función sin nombre (**función anónima**) que se ejecutará dentro de 2000 ms. En Java lo más parecido son las lambdas: `() -> System.out.println(...)`.

#### Closures: funciones que recuerdan

Una función definida dentro de otra **recuerda las variables de la de fuera**, incluso cuando la de fuera ya terminó:

```js
function Captions(frame) {
  var current = -1;              // variable "privada"
  function showCue(i) { current = i; }
  return { open: function () { /* puede usar current y showCue */ } };
}
```

Quien llama a `Captions(...)` recibe un objeto con `open`, pero no puede tocar `current` directamente. Es la forma de tener **atributos privados** sin clases: el equivalente a `private` de Java o a las variables globales de un codeunit en AL, que solo sus procedimientos pueden usar.

#### IIFE y "use strict": cada archivo en su propia burbuja

Todos los archivos JS de la web empiezan y acaban igual:

```js
(function () {
  "use strict";
  // … todo el código del archivo …
})();
```

- `(function () { ... })();` define una función y **la ejecuta en el acto**. Se llama **IIFE** (*Immediately Invoked Function Expression*). Sirve para que las variables del archivo sean locales a esa función y no se mezclen con las de otros archivos. Sin esto, todas las variables de todos los archivos compartirían un mismo espacio global y podrían pisarse.
- `"use strict";` activa el **modo estricto**: el navegador da error ante descuidos que normalmente dejaría pasar (por ejemplo, usar una variable sin declararla). Es como activar más avisos del compilador.

Lo que un archivo **sí** quiere compartir lo cuelga a propósito de `window` (el objeto global del navegador): `window.SITE_CONFIG`, `window.TRANSLATIONS`, `window.XP`.

#### Eventos: el equivalente a los suscriptores de AL

La web entera funciona con **eventos**. El navegador lanza eventos cuando pasan cosas (clic, tecla, scroll, redimensionar la ventana, fin de un audio…) y tu código se **suscribe** a ellos:

```js
boton.addEventListener("click", function (e) {
  // se ejecuta cada vez que alguien hace clic en el botón
});
```

La comparación con AL es muy directa:

| AL | JavaScript |
|---|---|
| `[EventSubscriber(ObjectType::Table, Database::Customer, 'OnAfterInsertEvent', ...)]` | `elemento.addEventListener("click", ...)` |
| El publicador (la tabla) | El elemento del DOM (el botón) |
| El evento (`OnAfterInsertEvent`) | El tipo de evento (`"click"`) |
| El procedimiento suscriptor | La función que pasas |
| Parámetros del evento (`var Rec`) | El objeto `e` (*event*) con los datos: qué tecla, dónde se hizo clic… |

Dentro del suscriptor, el objeto `e` tiene métodos importantes:

- `e.preventDefault()`: **cancela la acción por defecto** del navegador (por ejemplo, que la rueda del ratón haga scroll, o que un formulario recargue la página). La visita guiada lo usa para bloquear el scroll.
- `e.stopPropagation()`: impide que el evento "suba" a los elementos padre. En el DOM los eventos **se propagan hacia arriba** (*bubbling*): un clic en un botón también es un clic en su `<div>`, en `<body>`, etc.
- `e.target`: el elemento exacto donde ocurrió.

Eventos usados en la web: `click`, `keydown` (tecla pulsada), `input` (cambió un campo), `submit` (se envía un formulario), `wheel` (rueda del ratón), `touchmove` (arrastrar el dedo), `pointermove` (mover el ratón), `resize` (cambió el tamaño de la ventana), `visibilitychange` (cambiaste de pestaña), `ended` (terminó un audio), `DOMContentLoaded` (el HTML está listo).

#### Buscar y modificar elementos del DOM

```js
document.getElementById("contactForm");        // por id
document.querySelector(".hero-photo-frame");   // el primero que cumpla un selector CSS
document.querySelectorAll(".reveal");          // todos los que lo cumplan (lista)
el.closest(".lang-btn");                       // el antepasado más cercano (o él mismo) que cumpla el selector
```

Y para cambiarlos:

```js
el.textContent = "Hola";                 // cambia el texto
el.innerHTML = "Hola <strong>tú</strong>"; // cambia el contenido interpretando HTML
el.setAttribute("aria-pressed", "true"); // cambia un atributo
el.classList.add("is-visible");          // añade una clase (y el CSS hace el resto)
el.classList.remove("is-open");
el.classList.toggle("is-off", condicion);
el.style.left = "20px";                  // estilo directo
document.createElement("div");           // crea un elemento nuevo
padre.appendChild(el);                   // lo añade dentro de otro
el.remove();                             // lo elimina
```

Este es **el patrón central de toda la web**: JavaScript casi nunca "dibuja" nada; se limita a **añadir o quitar clases**, y el CSS decide cómo se ve cada estado (`is-open`, `is-visible`, `is-popping`, `is-playing`…). Así la lógica y el aspecto quedan separados.

#### Temporizadores

- `setTimeout(fn, ms)`: ejecuta `fn` una vez, dentro de `ms` milisegundos. Devuelve un identificador para cancelarlo con `clearTimeout(id)`.
- `setInterval(fn, ms)`: ejecuta `fn` cada `ms` milisegundos, hasta `clearInterval(id)`.
- `requestAnimationFrame(fn)`: ejecuta `fn` **justo antes del siguiente fotograma** de la pantalla (normalmente 60 veces por segundo). Es la forma correcta de hacer animaciones con código: va sincronizado con el refresco de la pantalla y se pausa sola si la pestaña no está visible. Para una animación continua, la función se vuelve a pedir a sí misma al final:
  ```js
  function frame() { dibujar(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
  ```

JavaScript en el navegador tiene **un solo hilo**: no hay `Thread` como en Java. Nada se ejecuta "a la vez"; los temporizadores y eventos se ponen en una cola y se atienden de uno en uno cuando el código actual termina. Por eso nunca hay que "esperar" con un bucle: se programa un callback y se sigue.

#### Promesas: operaciones que terminan más tarde

Algunas operaciones tardan (enviar el formulario por internet, empezar a reproducir un audio). En lugar de bloquear, devuelven una **promesa** (*Promise*): un objeto que "promete" un resultado futuro. Se le encadenan callbacks:

```js
audio.play()
  .then(function () { /* empezó a sonar */ })
  .catch(function () { /* falló (por ejemplo, el navegador lo bloqueó) */ });
```

Es parecido a un `CompletableFuture` de Java con `thenRun` y `exceptionally`.

#### try/catch y localStorage

`try { ... } catch (e) { ... }` funciona como en Java. Se usa sobre todo alrededor de **`localStorage`**, un pequeño almacén de texto clave-valor que el navegador guarda **por web y por visitante**, y que sobrevive a cerrar el navegador:

```js
localStorage.setItem("lucia-portfolio-lang", "es");
localStorage.getItem("lucia-portfolio-lang");   // "es" (o null si no existe)
```

Así la web recuerda el idioma, el tema y si las partículas estaban desactivadas. Se envuelve en `try/catch` porque en navegación privada o con ciertas configuraciones acceder a él lanza un error, y la web debe seguir funcionando igual.

#### El operador ternario y los "valores por defecto"

Muy usados en el código:

```js
var etiqueta = on ? "Música: on" : "Música: off";   // si on, lo primero; si no, lo segundo
var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;   // si lo primero no existe, usa lo segundo
if (!intro) return;                                 // "si no existe, sal"
```

`||` devuelve el primer valor que "existe" (que no sea `null`, `undefined`, `0`, `""` ni `false`). `!!x` convierte cualquier valor a booleano.

Con esto ya tienes todo lo necesario para leer el resto de la guía.

---

## 3. index.html: la estructura de la página

`index.html` es la única página de la web. Contiene **todo el contenido** (en inglés, como texto por defecto) y las referencias a los CSS y JS. Vamos por bloques, de arriba abajo.

### 3.1 El esqueleto

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  … configuración, CSS, scripts iniciales …
</head>
<body>
  … todo lo visible …
  … scripts JS al final …
</body>
</html>
```

- `<!DOCTYPE html>` le dice al navegador que es HTML moderno.
- `<html lang="en" data-theme="dark">`: el elemento raíz. `lang` indica el idioma (lo cambia JS al traducir). `data-theme="dark"` es el **modo oscuro por defecto**: el CSS mira este atributo para elegir los colores.
- `<head>`: información *sobre* la página, que no se ve directamente.
- `<body>`: lo que se ve.

### 3.2 El `<head>`

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title data-i18n="meta.title">Lucía Esteban | Microsoft Dynamics 365 Business Central / AL Developer</title>
<meta name="description" content="Portfolio of …" data-i18n-attr="content:meta.description" />
<meta name="theme-color" content="#0b2545" />
```

- `charset="UTF-8"`: codificación de caracteres (para que "Lucía" y "ñ" se vean bien).
- `viewport`: **imprescindible para móviles**. Sin esto, el móvil mostraría la web como si fuera un ordenador en miniatura. Con `width=device-width` la web se adapta al ancho real del teléfono.
- `<title>`: el título de la pestaña del navegador. Tiene `data-i18n` para traducirse.
- `description`: el resumen que muestra Google en los resultados.
- `theme-color`: color de la barra del navegador en algunos móviles.

**Open Graph** (la vista previa al compartir el enlace en LinkedIn, WhatsApp…):

```html
<meta property="og:title" content="…" />
<meta property="og:image" content="assets/img/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
```

**Iconos y fuentes:**

```html
<link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg" />
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png" />
<link rel="canonical" href="https://luciaesteban.github.io/" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

- `favicon`: el icono "LE" de la pestaña; `apple-touch-icon`, el que se usa si alguien añade la web a la pantalla de inicio del iPhone.
- `canonical`: la dirección "oficial" de la web, para buscadores.
- Las fuentes vienen de **Google Fonts**: *Inter* (texto normal) y *JetBrains Mono* (texto "de código", como las etiquetas pequeñas en mayúsculas). `preconnect` abre la conexión con Google antes de tiempo para que carguen más rápido. `display=swap` muestra el texto con una fuente del sistema mientras la buena se descarga, en lugar de dejarlo invisible.

**Los CSS, con número de versión:**

```html
<link rel="stylesheet" href="assets/css/styles.css?v=202609231334" />
<link rel="stylesheet" href="assets/css/experience/intro.css?v=202609231334" />
…
```

El `?v=202609231334` no forma parte del nombre del archivo: es un **parámetro para romper la caché**. Los navegadores guardan una copia de los archivos para no volver a descargarlos. Si cambias `styles.css` pero el enlace es idéntico, un visitante podría seguir viendo la versión vieja. Al cambiar el número en cada publicación, para el navegador es "otra dirección" y la descarga de nuevo. Se explica más en el capítulo 16.

**Script del tema, antes de pintar nada:**

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

Está dentro del `<head>` y no en `main.js` a propósito. Los scripts del final del `<body>` se ejecutan **después** de que el navegador ya haya empezado a pintar. Si el tema se pusiera ahí, alguien que eligió modo claro vería un parpadeo oscuro→claro. Al ejecutarse en el `<head>`, el atributo `data-theme` ya está bien puesto antes del primer fotograma. `document.documentElement` es el elemento `<html>`.

**Script de la intro y `<noscript>`:**

```html
<script>document.documentElement.classList.add("intro-open");</script>
<noscript><style>.intro{display:none!important} …</style></noscript>
```

- Añade la clase `intro-open` a `<html>`. El CSS (`intro.css`) usa esa clase para **difuminar la página** y bloquear el scroll mientras se ve la burbuja.
- `<noscript>` solo se usa si el visitante tiene JavaScript desactivado. En ese caso oculta la intro (que sin JS nunca se podría cerrar) y quita el difuminado, así la web sigue siendo legible. Es un buen ejemplo de **degradación elegante**: la web funciona aunque falle lo "extra".

### 3.3 La pantalla de la burbuja (intro)

```html
<div class="intro" id="intro" role="dialog" aria-modal="true" aria-labelledby="introName">
  <span class="intro-orb" aria-hidden="true"></span>   (×4: manchas de color difuminadas)
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

- Es una capa que cubre toda la pantalla. `role="dialog"` y `aria-modal="true"` indican a los lectores de pantalla que es una ventana que tapa el resto.
- **La burbuja es un `<button>`**, no un `<div>`. Así se puede activar con teclado (Tab + Enter) y los lectores de pantalla la anuncian como botón. Esta es una regla general de la web: todo lo que se pulsa es un `<button>` o un `<a>`.
- Los `data-intro-text="…"` indican qué texto va dentro; `intro.js` los rellena en el idioma elegido.
- `alt=""` en la foto: texto alternativo vacío porque es decorativa (el nombre ya está escrito al lado).
- Lo que no está en el HTML (el código AL que cae, el selector de idioma, el texto de bienvenida, las burbujitas) lo **crea `intro.js`** con código, porque depende del idioma y del tamaño de la pantalla.

### 3.4 Enlace para saltar al contenido

```html
<a class="skip-link" href="#main" data-i18n="skipLink">Skip to main content</a>
```

Es invisible (está fuera de la pantalla) hasta que alguien navega con el teclado y pulsa Tab: entonces aparece arriba a la izquierda. Permite saltarse el menú. Es una práctica de accesibilidad estándar.

### 3.5 Cabecera y menú

```html
<header class="site-header" id="top">
  <div class="container header-inner">
    <a class="logo" href="#top" aria-label="Lucía Esteban, home">
      <span class="logo-mark" aria-hidden="true">LE</span>
      <span class="logo-text">Lucía Esteban</span>
    </a>

    <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="primaryNav">
      <span class="nav-toggle-bar" aria-hidden="true"></span>  (×3: las rayas del menú hamburguesa)
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

Puntos clave:

- **Enlaces internos**: `href="#expertise"` salta al elemento con `id="expertise"`. No hace falta JavaScript para esto; el CSS `scroll-behavior: smooth` hace que el salto sea suave.
- `.container` es una caja de ancho máximo 1120 px centrada; se repite en todas las secciones para que el contenido esté alineado.
- **Botón hamburguesa** (`nav-toggle`): solo se ve en pantallas estrechas. `aria-expanded` indica si el menú está abierto; `main.js` lo cambia y el CSS lo usa para transformar las tres rayas en una "X". `sr-only` es texto solo para lectores de pantalla (*screen reader only*).
- **Idioma**: dos botones con `data-lang`. `aria-pressed` marca el activo, y el CSS lo subraya.
- **Tema**: un botón con dos iconos SVG (sol y luna). El CSS muestra uno u otro según `data-theme`.

### 3.6 El hero (la presentación)

"Hero" es el nombre que se da en diseño web al bloque principal de arriba del todo.

```html
<section class="hero" aria-labelledby="hero-heading">
  <div class="bubble-field bubble-field-hero" aria-hidden="true">
    <span class="bubble bubble-a"></span> … (manchas de color de fondo)
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

- `aria-labelledby="hero-heading"` enlaza la sección con su título para los lectores de pantalla.
- Solo hay **un `<h1>`** en la página (tu nombre). Los títulos de sección son `<h2>` y los de tarjetas `<h3>`. Esta jerarquía es importante para buscadores y accesibilidad.
- `&amp;` es cómo se escribe el carácter `&` dentro de HTML (porque `&` tiene un significado especial).
- **`reveal`**: los elementos con esta clase empiezan invisibles y aparecen con un pequeño desplazamiento cuando entran en pantalla (lo hace `main.js`).
- **`hero-mockup-card`**: el dibujo SVG de una "ventana de aplicación" que asoma inclinado detrás de tu foto. Usa las variables de color (`fill="var(--color-primary)"`), así que cambia con el tema.
- `data-i18n-attr="alt:hero.photoAlt"`: traduce el **atributo** `alt` (texto alternativo), no el contenido.
- `width` y `height` en las imágenes: aunque luego el CSS cambie el tamaño, así el navegador reserva el hueco antes de descargar la imagen y la página no "salta".
- `.hero-photo-frame` es el contenedor de tu foto. `voice.js` le añade la viñeta "Escúchame".

### 3.7 Secciones de contenido

Todas siguen el mismo patrón:

```html
<section class="section section-expertise" id="expertise" aria-labelledby="expertise-heading">
  <div class="bubble-field" aria-hidden="true">…</div>
  <div class="container">
    <p class="eyebrow reveal" data-i18n="expertise.eyebrow">What I do</p>
    <h2 id="expertise-heading" class="reveal" data-i18n="expertise.title">Business Central expertise</h2>
    <p class="section-intro reveal">…</p>
    … contenido propio de la sección …
  </div>
</section>
```

- **eyebrow**: la etiqueta pequeña en mayúsculas encima del título.
- **Business Central (`#expertise`)**: la introducción incluye `<strong id="expertiseDuration"></strong>`, un hueco vacío que `main.js` rellena con tu tiempo de experiencia calculado ("1 year and 6 months"). Después, `.expertise-grid` con seis `<article class="expertise-card reveal">`, cada uno con un icono SVG, un `<h3>` y un párrafo.
- **Ecosistema (`#ecosystem`)**: tres grupos (`ring-core`, `ring-professional`, `ring-additional`), cada uno con una lista `<ul class="chip-list">` de "chips" `<li class="chip">`. Las claves de traducción terminan en números (`ecosystem.core.items.0`) porque en `i18n.js` son listas y se accede por posición.
- **IA (`#ai`)**: solo título y un párrafo.
- **Trayectoria (`#journey`)**: una lista ordenada `<ol class="timeline">` de `<li class="timeline-item">`. Cada uno tiene un punto (`timeline-dot`), una etiqueta (Education/Professional), título y texto. En el profesional hay `<p id="timelineStartLabel">` ("Since 2025") y `<p id="timelineCompany">`, que rellena `main.js`. El último punto tiene `timeline-dot-pulse` (late, porque está en curso).
- **Sobre mí (`#about`)**: cuatro párrafos con claves `about.paragraphs.0` a `3`.
- **Más allá del código (`.section-beyond`)**: la foto del paisaje y un texto. La imagen está enlazada directamente desde Unsplash (un banco de fotos gratuito), con `srcset` para dar una versión más grande a pantallas de alta densidad (*retina*) y `loading="lazy"` para que no se descargue hasta que el visitante se acerque a esa zona.

  ```html
  <img src="https://images.unsplash.com/…?w=320&amp;h=320…"
       srcset="…w=320… 1x, …w=480… 2x"
       alt="Mountain lake at sunset" data-i18n-attr="alt:beyond.photoAlt"
       width="160" height="160" loading="lazy" />
  ```

### 3.8 Contacto y formulario

```html
<section class="section section-contact" id="contact" …>
  <div class="container contact-inner contact-grid">
    <div class="contact-copy reveal">
      … eyebrow, título, texto …
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

- Los enlaces tienen `href="#"` como relleno: `main.js` pone la dirección real desde `config.js`. `target="_blank"` abre en otra pestaña; `rel="noopener"` es una medida de seguridad para esos casos.
- **`<label for="cfName">`**: une el texto con su campo (`id="cfName"`). Al hacer clic en la etiqueta se activa el campo, y los lectores de pantalla leen la etiqueta al entrar en él.
- `name="name"`: el nombre con el que se envía el dato y con el que JS lo lee (`form.elements.name`).
- `type="email"`: en el móvil muestra un teclado con "@".
- `autocomplete="name"` / `"email"` / `"organization"`: permite al navegador autorrellenar.
- `required` y `maxlength`: validaciones del navegador. Pero el formulario tiene `novalidate`, que **desactiva** los mensajes automáticos del navegador, porque `page.js` valida por su cuenta con mensajes propios y traducidos.
- **Honeypot** (`form-hp`, "tarro de miel"): un campo invisible para personas pero que los robots de spam, que rellenan todos los campos que encuentran, sí completan. Si llega relleno, el mensaje se descarta. `tabindex="-1"` evita que se llegue a él con Tab.
- `form-status` con `role="status"` y `aria-live="polite"`: cuando JS escribe ahí ("Enviando…", "Gracias…"), el lector de pantalla lo anuncia en voz alta.

### 3.9 Pie y scripts

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

- `footerYear` lo rellena `main.js` con "© " y el año actual, así nunca hay que actualizarlo.
- **Los scripts van al final del `<body>`** para que, cuando se ejecuten, todo el HTML de arriba ya exista.
- **El orden importa**: cada archivo usa cosas definidas por los anteriores. `main.js` necesita `SITE_CONFIG` (de `config.js`) y `TRANSLATIONS` (de `i18n.js`); todos los de `experience/` necesitan `XP` (de `core.js`); y `page.js`, el último, arranca todo lo demás. Es como el orden de dependencias entre apps en el `app.json` de AL.

---

## 4. styles.css: el diseño base

`styles.css` define el aspecto de toda la web base. Está ordenado por bloques con comentarios `/* === … === */`.

### 4.1 Los "design tokens": variables de diseño

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

A estas variables se les llama *design tokens*: todas las decisiones de diseño (colores, fuentes, radios de esquina, sombras, velocidades) están en un solo sitio. Si quisieras cambiar el azul de acento de toda la web, cambiarías una línea.

Los colores se escriben en hexadecimal (`#2f6fed`: rojo 2f, verde 6f, azul ed) o con `rgba(r, g, b, alfa)`, donde alfa es la opacidad (0 transparente, 1 opaco).

Significado de cada color:

- `bg` / `bg-alt`: fondo de la página y fondo alternativo (las secciones grises).
- `surface`: fondo de las tarjetas.
- `ink`: títulos (el color más contrastado). `text`: texto normal. `text-muted`: texto secundario.
- `primary`: azul marino fijo para paneles que son oscuros en los dos temas (sección de contacto, logo). **No cambia con el tema**, a diferencia de `ink`.
- `accent`: el azul de los enlaces, botones y detalles.

Las fuentes tienen **alternativas**: si "Inter" no carga, se usa la del sistema (`-apple-system` en Mac, `Segoe UI` en Windows…).

Las sombras (`box-shadow`) tienen el formato "desplazamiento X, desplazamiento Y, difuminado, color".

### 4.2 El modo oscuro

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

Este es el truco central del tema: el selector `:root[data-theme="dark"]` significa "el elemento raíz cuando tiene `data-theme="dark"`". Como es más específico que `:root`, **sus valores sustituyen a los claros**. Ninguna otra regla de la web sabe si está en modo claro u oscuro: todas usan `var(--color-…)` y reciben el valor correcto. Cambiar de tema es solo cambiar un atributo del `<html>`.

`body` tiene `transition: background-color …, color …` para que el cambio de tema sea un fundido suave y no un salto.

### 4.3 Reset y estilos base

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

Los navegadores traen estilos por defecto (márgenes, viñetas en las listas, fuentes distintas en los botones…). Este bloque los "resetea" para partir de una base limpia:

- `*` significa "todos los elementos". `box-sizing: border-box` en todos (explicado en 2.2).
- `scroll-behavior: smooth`: los saltos a `#seccion` son suaves.
- `-webkit-text-size-adjust`: evita que el iPhone agrande el texto por su cuenta al girar la pantalla. El prefijo `-webkit-` indica una propiedad específica de ciertos navegadores (Safari, Chrome).
- `line-height: 1.6`: interlineado cómodo.
- `img { max-width: 100% }`: ninguna imagen puede salirse de su contenedor.
- `strong` con el color `ink`: en esta web el texto normal es gris suave, así que las frases en negrita se pintan del color más oscuro para que destaquen de verdad.
- `button { font: inherit }`: los botones usan la misma fuente que el resto (por defecto usarían otra).

**Accesibilidad:**

```css
a:focus-visible, button:focus-visible, [tabindex]:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); … }
.skip-link { position: absolute; top: -3rem; … }
.skip-link:focus { top: 1rem; }
```

- `:focus-visible` dibuja un contorno azul alrededor del elemento seleccionado **con el teclado** (no con el ratón), para que quien navega con Tab sepa dónde está.
- `.sr-only` hace un elemento invisible en pantalla pero legible por lectores de pantalla.
- `.skip-link` está fuera de la pantalla (`top: -3rem`) y baja a la vista al recibir el foco.

### 4.4 Utilidades comunes

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

- `margin-inline: auto` centra la caja horizontalmente (margen izquierdo y derecho automáticos). `padding-inline` es el relleno izquierdo y derecho.
- `z-index: 1` y `position: relative` en el contenedor hacen que el contenido quede siempre por encima de las manchas de color de fondo (`bubble-field`, con `z-index: 0`).
- Las secciones alternan fondo blanco y gris (`section-alt`) para separarse visualmente.

**Botones:**

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

`border-radius: 999px` es un truco para hacer "pastillas" (bordes totalmente redondos) sea cual sea el tamaño. Al pasar el ratón, el botón sube 2 px con una transición.

### 4.5 Cabecera

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

- `sticky` + `top: 0`: la cabecera se queda pegada arriba al hacer scroll.
- El fondo es semitransparente, y `backdrop-filter: blur(10px)` **difumina lo que pasa por detrás**: el efecto "cristal esmerilado".
- `is-active` lo pone `main.js` en el enlace de la sección que estás leyendo (*scrollspy*).

**Iconos del tema:**

```css
.theme-toggle svg { display: none; }
.theme-toggle .icon-moon { display: block; }
:root[data-theme="dark"] .theme-toggle .icon-sun { display: block; }
:root[data-theme="dark"] .theme-toggle .icon-moon { display: none; }
```

Por defecto se ve la luna ("pasar a oscuro"); en modo oscuro se ve el sol ("pasar a claro"). Todo con CSS, sin JavaScript.

**El menú hamburguesa convertido en X:**

```css
.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(2) { opacity: 0; }
.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
```

Cuando `aria-expanded` pasa a `true`, la raya de arriba baja y gira 45°, la del medio desaparece y la de abajo sube y gira −45°: forman una X. Fíjate en que el CSS reacciona a un atributo de accesibilidad: el mismo dato sirve para el lector de pantalla y para el dibujo.

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

- **Degradados**: `linear-gradient` (en línea recta), `radial-gradient` (en círculo desde un punto) y `conic-gradient` (girando alrededor de un punto, como una rueda de colores). Se pueden apilar varios fondos separados por comas; el primero queda encima.
- `::before` crea una capa decorativa con un degradado cónico azul, verde azulado y violeta, muy difuminada (`blur(70px)`), que se mueve lentamente (`alternate` hace que la animación vaya y vuelva).
- `inset: -25% -15%` la hace más grande que la sección, para que al moverse nunca se vean sus bordes. `overflow: hidden` en `.hero` recorta lo que sobra.
- `pointer-events: none`: la capa no captura clics (se puede hacer clic "a través" de ella).
- El grid de dos columnas: texto (1.2 partes) y foto (0.8 partes).

**La foto y la tarjeta de detrás:**

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

- `aspect-ratio: 1 / 1` fuerza un cuadrado; `object-fit: cover` recorta la foto para llenarlo sin deformarla.
- La tarjeta SVG está en posición absoluta, girada −9°, asomando por la esquina inferior izquierda.

### 4.7 Tarjetas de Business Central

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

La línea del grid es de las más potentes de la web:

- `repeat(auto-fit, …)`: "crea tantas columnas como quepan".
- `minmax(A, 1fr)`: cada columna mide como mínimo A y como máximo una parte igual del espacio.
- `min(380px, 100%)`: A es 380 px, salvo que la pantalla sea más estrecha, en cuyo caso es el 100 %.

Resultado: en PC salen 2 columnas, y en un móvil estrecho 1, **sin ninguna media query**. El `min(…, 100%)` evita que en móviles de menos de 380 px la tarjeta se salga de la pantalla.

Cada tarjeta tiene su propio color (borde superior e icono) usando `:nth-child(n)`.

### 4.8 Las manchas de color de fondo (bubble field)

```css
.bubble-field { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.bubble { position: absolute; border-radius: 50%; filter: blur(50px); opacity: 0.16; }
.bubble-a { width: 220px; height: 220px; background: #2f6fed; top: -50px; left: 6%; animation: bubbleDriftA 17s ease-in-out infinite; }
@keyframes bubbleDriftA {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(26px, 34px); }
}
```

Círculos de color (`border-radius: 50%`) muy difuminados y casi transparentes, que se mueven despacio. Cada uno con una duración distinta (15, 17, 19, 21 s) para que nunca se sincronicen y el movimiento parezca natural. Las secciones que los usan tienen `position: relative; overflow: hidden` para que sirvan de marco y recorten lo que se sale.

### 4.9 Ecosistema, trayectoria, sobre mí, más allá del código

**Rejilla animada del grupo "Core":**

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

Dos degradados de 1 px (uno horizontal y otro vertical) repetidos cada 28 px dibujan una **cuadrícula**, como una hoja de cálculo o una tabla de Business Central. La animación la desplaza exactamente 28 px, así que el final coincide con el principio y el bucle es perfecto.

**Línea de tiempo:**

```css
.timeline { position: relative; padding-left: 2rem; border-left: 2px solid var(--color-border); }
.timeline-dot { position: absolute; left: -2.45rem; top: 0.3rem; width: 14px; height: 14px; border-radius: 50%; … }
.timeline-dot-pulse::before { …; animation: pulse 1.8s ease-in-out infinite; }
```

La línea vertical es simplemente el borde izquierdo de la lista. Cada punto está en posición absoluta, desplazado hacia la izquierda para quedar encima de esa línea. El punto "en curso" tiene un halo que late (`box-shadow` que crece y se desvanece).

**Más allá del código:** `display: flex; flex-wrap: wrap` pone la foto y el texto en fila, y si no caben pasan a dos líneas. La foto es redonda (`border-radius: 50%`).

### 4.10 Contacto y pie

```css
.section-contact { background: var(--color-primary); color: #fff; text-align: center; }
.contact-link[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.site-footer { background: #071a33; color: rgba(255, 255, 255, 0.6); }
```

La sección de contacto usa `--color-primary` (azul marino que no cambia con el tema), así que es oscura siempre. Si un enlace no está configurado (por ejemplo, el CV), `main.js` le pone `aria-disabled="true"` y el CSS lo atenúa y lo hace no clicable.

### 4.11 Aparición al hacer scroll

```css
.reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
```

Todo lo marcado con `reveal` empieza invisible y 18 px más abajo. Cuando `main.js` detecta que entra en pantalla, le añade `is-visible` y la transición lo sube y lo hace aparecer.

### 4.12 Menos movimiento y adaptación a pantallas

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

- Con movimiento reducido, **todas** las animaciones duran prácticamente cero (`!important` para ganar a cualquier otra regla).
- Por debajo de 900 px, el hero pasa a una columna y `order: -1` pone la foto **antes** que el texto (sin cambiar el HTML).
- Por debajo de 760 px, aparece el botón hamburguesa y el menú se convierte en un panel desplegable debajo de la cabecera (`top: 100%` = justo debajo), oculto hasta que tiene la clase `is-open`.
- Por debajo de 600 px, menos espacio vertical y títulos más pequeños.

Este enfoque se llama **diseño adaptable** (*responsive design*): un solo HTML que se reorganiza según el tamaño de la pantalla.

---

## 5. config.js: la configuración

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

Es un objeto con los **datos que no son texto traducible**, todos en un único sitio. Equivale a una tabla de configuración ("Setup") en Business Central: el resto del código lee de aquí en lugar de tener valores escritos a mano en varios sitios.

- `businessCentralStartDate`: la fecha en que empezaste con Business Central. A partir de ella se calcula automáticamente tu experiencia ("1 año y 6 meses") y el año de "Desde 2025". **Por eso la web nunca hay que actualizarla a mano con el paso del tiempo.**
- `professionalEmail`, `linkedInUrl`, `githubUrl`, `cvPdfUrl`: los enlaces de contacto. Si un valor es `null`, el botón correspondiente se muestra desactivado ("CV coming soon") en lugar de llevar a un enlace roto. Para publicar tu CV bastaría con subir el PDF y poner aquí su ruta.
- `contactFormEndpoint`: la dirección de FormSubmit a la que se envía el formulario (capítulo 14). Si fuera `null`, el formulario abriría el programa de correo del visitante.
- `currentCompanyDisplayName`: si algún día quieres mostrar el nombre de tu empresa en la trayectoria, se pone aquí.

Se asigna a `window.SITE_CONFIG` para que sea accesible desde los demás archivos.

---

## 6. i18n.js: los textos en dos idiomas

"i18n" es la abreviatura habitual de *internationalization* (una i, 18 letras, una n).

### 6.1 Estructura

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
    … exactamente la misma estructura, con los textos en español …
  },
};
```

Es un objeto enorme con dos ramas, `en` y `es`, que tienen **la misma forma**. Cada texto se identifica por su "ruta": `hero.tagline`, `expertise.items.al.title`, `ecosystem.core.items.0` (el primer elemento de la lista).

Es la misma idea que las `Caption` y los archivos de traducción `.xlf` de AL: el código no contiene textos, solo **claves**, y los textos viven aparte por idioma.

### 6.2 Cómo se conecta con el HTML

En el HTML:

```html
<h2 data-i18n="expertise.title">Business Central expertise</h2>
<img data-i18n-attr="alt:hero.photoAlt" …>
```

- `data-i18n="ruta"`: el **contenido** del elemento se sustituye por el texto de esa ruta.
- `data-i18n-attr="atributo:ruta"`: se sustituye el **atributo** indicado. Admite varios separados por `;`.

El texto en inglés que hay escrito en el HTML es solo un valor inicial (lo que se vería si JavaScript fallara). `main.js` lo reemplaza al cargar.

### 6.3 Detalles

- Algunos textos contienen `<strong>…</strong>` para resaltar frases. Por eso se insertan con `innerHTML` (que interpreta etiquetas) y no con `textContent`. Es seguro porque los textos vienen de este archivo, nunca de lo que escribe un visitante.
- **Plurales**: `years_one` / `years_other`. El código elige `_one` si el número es 1 y `_other` en otro caso, y sustituye `{n}` por el número. Así se escribe "1 year" pero "2 years".
- **Marcadores**: `since: "Since {year}"` / `"Desde {year}"`. El código sustituye `{year}` por el año calculado.
- Los textos de la capa de experiencia (burbuja, música, subtítulos) no están aquí sino en `core.js` (capítulo 8), para que esa capa sea independiente.

---

## 7. main.js: el comportamiento base

Todo el archivo está dentro de una IIFE con `"use strict"` (explicado en 2.3). Empieza leyendo lo que necesita:

```js
var CONFIG = window.SITE_CONFIG || {};
var TRANSLATIONS = window.TRANSLATIONS || {};
var LANG_STORAGE_KEY = "lucia-portfolio-lang";
var THEME_STORAGE_KEY = "lucia-portfolio-theme";
var prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

- `|| {}` evita errores si por algún motivo el archivo de configuración no cargara.
- `matchMedia("…").matches` permite preguntar desde JavaScript lo mismo que una media query de CSS; aquí, si el usuario prefiere menos movimiento.

### 7.1 Leer una ruta dentro de un objeto

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

Convierte `"expertise.items.al.title"` en `["expertise", "items", "al", "title"]` y va bajando nivel a nivel: `obj["expertise"]["items"]["al"]["title"]`. Si algún nivel no existe, devuelve `undefined` en vez de dar error. Funciona también con listas: `"ecosystem.core.items.0"` accede a la posición 0.

### 7.2 Idioma

```js
function getLang() {
  var stored = null;
  try { stored = window.localStorage.getItem(LANG_STORAGE_KEY); } catch (e) { }
  if (stored === "en" || stored === "es") return stored;
  return "en";
}
```

Lee el idioma guardado; si no hay (primera visita) o el valor no es válido, inglés.

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

1. Elige el diccionario del idioma.
2. Busca **todos** los elementos con `data-i18n`, lee su clave, busca el texto y lo pone dentro.
3. Busca todos los que tienen `data-i18n-attr`, separa cada par `"alt:hero.photoAlt"` en atributo y clave, y cambia el atributo.
4. Cambia el título de la pestaña.

`typeof value === "string"` comprueba que se encontró un texto (si la clave no existe, se deja el texto que hubiera).

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

`setLang` guarda la elección, traduce, marca el botón activo, actualiza `lang` del `<html>` y vuelve a generar los textos calculados (experiencia y "Desde {año}"), que dependen del idioma.

### 7.3 Menú del móvil

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

- `classList.toggle` pone la clase si no está y la quita si está, y **devuelve** cómo ha quedado (`true` si ahora está). Con eso se actualiza `aria-expanded`.
- Al pulsar cualquier enlace del menú, este se cierra (si no, en el móvil se quedaría abierto tapando la sección a la que saltas).

### 7.4 Aparición al hacer scroll (IntersectionObserver)

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

**`IntersectionObserver`** es una herramienta del navegador que avisa cuando un elemento **entra o sale de la pantalla**. Es mucho más eficiente que comprobar posiciones en cada movimiento del scroll.

- Se crea con una función que recibe `entries` (los cambios) y unas opciones:
  - `threshold: 0.15`: avisar cuando al menos el 15 % del elemento sea visible.
  - `rootMargin: "0px 0px -40px 0px"`: encoge el área de detección 40 px por abajo, para que la animación empiece un poco después de asomar.
- `observer.observe(el)` empieza a vigilar un elemento. Cuando entra, se le añade `is-visible` y se deja de vigilar (`unobserve`): la animación solo ocurre una vez.
- Si el usuario prefiere menos movimiento o el navegador es muy antiguo (`"IntersectionObserver" in window` comprueba si existe), todo se muestra directamente.

### 7.5 Resaltar la sección actual en el menú (scrollspy)

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

- `a[href^="#"]`: enlaces cuyo `href` **empieza por** `#`.
- `.slice(1)` quita el `#` ("#about" → "about").
- Se construye un mapa `{ "about": <enlace About>, … }` (como un `Dictionary` en AL) y la lista de secciones. `Object.keys` da las claves del objeto; `.filter(Boolean)` descarta las secciones que no existan.
- El truco está en `rootMargin: "-35% 0px -55% 0px"`: reduce la zona de detección a una **franja estrecha** entre el 35 % y el 45 % de la altura de la pantalla. La sección que cruza esa franja es "la que estás leyendo", y su enlace se marca con `is-active`.

### 7.6 Calcular la experiencia automáticamente

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

- `new Date("2025-03-01")` crea una fecha; `new Date()` sin nada es **ahora**.
- Si la fecha no es válida, `getTime()` da `NaN` (*Not a Number*) y se devuelve `null`.
- Meses totales = diferencia de años × 12 + diferencia de meses. Si aún no se ha llegado al día del mes de inicio, se resta uno (el mes no está completo).
- Se devuelve un objeto con años y meses: 18 meses → `{ years: 1, months: 6 }`.

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

Para `{ years: 1, months: 6 }` en español: `pluralKey` da `experience.years_one` → "{n} año" → "1 año", y `experience.months_other` → "{n} meses" → "6 meses". Luego se unen con la conjunción: "1 año y 6 meses". Si solo hay una parte (por ejemplo, justo 2 años), no se pone "y".

`renderTimelineMeta` hace lo mismo con el año de inicio (`"Since {year}"` → "Since 2025") y, si en `config.js` hay un nombre de empresa, lo pone en la trayectoria.

### 7.7 Tema claro/oscuro

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

Al hacer clic, calcula el tema contrario al actual, lo guarda y lo aplica cambiando `data-theme`. Todo lo demás lo hace el CSS (4.2).

### 7.8 Enlaces de contacto desde la configuración

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

- `hrefBuilder` es una **función que se pasa como parámetro** y construye el enlace a partir del valor. Para el email añade `mailto:` (un enlace `mailto:` abre el programa de correo); para LinkedIn o GitHub devuelve la URL tal cual.
- Si el valor es `null`, el enlace se desactiva, se saca del recorrido con Tab (`tabindex="-1"`) y se cambia el texto a "… coming soon". Se quita `data-i18n` para que al cambiar de idioma no se sobrescriba ese texto (por eso, al cambiar de idioma, se vuelve a llamar a `initContactLinks`).

### 7.9 El arranque

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

`DOMContentLoaded` se dispara cuando el HTML entero está leído y el DOM construido. Es el equivalente a un `OnOpenPage` de AL: el punto de entrada donde se inicializa todo. Aquí se pone el año del pie, se traduce, y se activan una a una todas las funciones anteriores. Por último, se suscribe a los clics de los botones de idioma.

---

## 8. La capa "experience" y core.js

### 8.1 Un espacio de nombres compartido: `window.XP`

Los siete archivos de `assets/js/experience/` necesitan compartir cosas entre sí (por ejemplo, la intro tiene que arrancar la música, y la voz tiene que bajar el volumen de la música). En vez de crear muchas variables globales sueltas, todos cuelgan lo que comparten de **un único objeto**: `window.XP` (de *experience*).

```js
var XP = (window.XP = window.XP || {});
```

Esta línea hace dos cosas: si `window.XP` no existe, lo crea vacío (`{}`); y guarda una referencia en la variable local `XP`. Los demás archivos simplemente hacen `var XP = window.XP;` y añaden sus módulos: `XP.Sound`, `XP.Music`, `XP.Voice`, `XP.Ripple`, `XP.Seasons`, `XP.Controls`, `XP.Intro`, `XP.Listen`.

Es parecido a un *namespace* o paquete: en Java agruparías clases en `com.lucia.experience`; aquí se agrupan objetos dentro de `XP`.

### 8.2 Preferencias del dispositivo

```js
XP.reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
XP.finePointer = !!(window.matchMedia && matchMedia("(pointer: fine)").matches);
```

Se calculan una vez y las usan todos los módulos:

- `reduceMotion`: el usuario pidió menos animaciones.
- `finePointer`: hay ratón (puntero preciso). En pantallas táctiles es `false`, y los efectos que dependen de pasar el ratón por encima (inclinación de tarjetas) no se activan.

### 8.3 Los textos de la capa de experiencia

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
  es: { … lo mismo en español, con sus propios tiempos … }
};
```

Funciona igual que `i18n.js`, pero para la capa de experiencia. Dos datos son especiales:

- **`openingCues`** (subtítulos): cada elemento es `[segundo de inicio, segundo de fin, frase]`. Los tiempos se sacaron analizando las pausas de tu grabación (capítulo 15). Por eso los tiempos en inglés y en español son distintos: son grabaciones distintas.
- **`openingTour`** (visita guiada): cada elemento es `[segundo, selector CSS]`. Cuando la voz llega a ese segundo, la página se desplaza hasta ese elemento. Por ejemplo, cuando dices "cómo abordo cada proyecto", baja hasta la última tarjeta (`.expertise-card:last-child`), que es la de tu forma de trabajar.

### 8.4 Utilidades

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

- `XP.lang()` devuelve el idioma actual (el guardado o, si no, el del `<html>`).
- `XP.t("listen")` devuelve el texto "listen" en el idioma actual. "t" viene de *translate*. Como se llama cada vez, siempre da el idioma vigente.

```js
var langListeners = [];
XP.onLanguageChange = function (fn) { langListeners.push(fn); };
document.addEventListener("click", function (e) {
  if (!e.target.closest || !e.target.closest(".lang-btn")) return;
  setTimeout(function () { langListeners.forEach(function (fn) { fn(); }); }, 0);
});
```

Este es un pequeño **sistema de eventos propio**, al estilo de un publicador de AL:

- Cualquier módulo puede suscribirse con `XP.onLanguageChange(función)`: la función se guarda en una lista.
- Hay un único listener de clic en todo el documento (gracias a que los eventos suben por el árbol, un clic en un botón llega también a `document`). Si el clic fue en un `.lang-btn` (o dentro de uno), se avisa a todos los suscriptores.
- `setTimeout(…, 0)` retrasa el aviso "hasta que termine lo que se está ejecutando". Es necesario porque `main.js` también escucha ese clic para cambiar el idioma, y los suscriptores deben ejecutarse **después**, cuando el idioma ya está cambiado.

A esta técnica de poner un solo listener en un elemento padre en lugar de uno en cada hijo se le llama **delegación de eventos**.

```js
XP.hz = function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); };
```

Convierte una nota musical en formato **MIDI** a frecuencia en hercios. En MIDI cada nota es un número: 60 es el Do central, 69 es el La de 440 Hz, y cada +1 es un semitono. Como en música cada octava (12 semitonos) duplica la frecuencia, la fórmula es 440 × 2^((nota − 69) / 12). Se usa en `sound.js` para escribir la música con números de nota en lugar de frecuencias.

---

## 9. sound.js: efectos, música generativa y voz

Este es el archivo más técnico. La idea clave: **no hay archivos de música**. Todos los sonidos (el "pop", el acorde de bienvenida, la guitarra y la música de fondo entera) se **sintetizan en tiempo real** con código. Ventajas: no hay derechos de autor, no hay nada que descargar, y la música nunca se repite exactamente igual.

### 9.1 La Web Audio API: un circuito de nodos

El navegador trae un "estudio de sonido" llamado **Web Audio API**. Funciona como una **cadena de pedales de guitarra**: creas módulos (*nodos*) y los conectas unos con otros con `a.connect(b)`. El sonido fluye de un nodo al siguiente hasta los altavoces.

Nodos usados en la web:

| Nodo | Qué hace | Analogía |
|---|---|---|
| `AudioContext` | El estudio entero. Tiene su propio reloj (`ctx.currentTime`, en segundos) y la salida a los altavoces (`ctx.destination`). | La mesa de mezclas |
| `OscillatorNode` | Genera una onda periódica: `sine` (senoidal, suave, "flauta"), `triangle` (algo más brillante), `sawtooth` (diente de sierra, rica en armónicos, "cuerdas"). | Una cuerda vibrando |
| `GainNode` | Controla el volumen (`gain`). | Un fader o potenciómetro |
| `BiquadFilterNode` | Filtro. `lowpass` deja pasar los graves y corta los agudos (suena más apagado/cálido); `bandpass` deja pasar una banda. | El control de tono |
| `ConvolverNode` | Reverberación: simula el eco de una sala. | Tocar en una iglesia |
| `DynamicsCompressorNode` | Compresor: iguala los volúmenes para que nada sature. | Un limitador |
| `AnalyserNode` | No modifica el sonido; permite leer su espectro de frecuencias. | Un ecualizador visual |
| `AudioBufferSourceNode` | Reproduce un trozo de audio en memoria (aquí, ruido). | Un sampler |

**Los parámetros se pueden programar en el tiempo.** Esta es la base de toda la síntesis:

```js
g.gain.setValueAtTime(0.0001, when);                       // en el instante "when", volumen casi 0
g.gain.exponentialRampToValueAtTime(vol, when + 0.006);    // sube hasta "vol" en 6 ms
g.gain.exponentialRampToValueAtTime(0.0001, when + 2.6);   // y se apaga hasta casi 0 en 2,6 s
```

A esta forma del volumen a lo largo del tiempo se le llama **envolvente** (*envelope*): el "ataque" (lo rápido que arranca la nota) y el "decaimiento" (cómo se apaga). Un piano tiene ataque instantáneo y decaimiento largo; unas cuerdas, ataque lento. La curva exponencial suena más natural que la lineal, pero no puede llegar a 0 exacto (por eso se usa 0.0001).

Todo se programa **por adelantado** con el reloj del contexto (`when`), y el navegador lo ejecuta con precisión de muestra (1/44100 s), independientemente de lo que esté haciendo JavaScript.

### 9.2 Los navegadores y el sonido

Los navegadores **no permiten reproducir sonido hasta que el usuario interactúa** con la página (un clic, una tecla). Es una protección contra webs que suenan solas. Por eso:

- El `AudioContext` no se crea al cargar, sino al hacer clic en la burbuja (`Sound.init()`).
- La bienvenida de la burbuja es texto escrito y no voz: la voz no podría sonar sola.
- Tu mensaje de voz se reproduce al tocar la viñeta "Escúchame".

### 9.3 El motor de sonido: `XP.Sound.init`

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

- Si ya existe el contexto, solo lo reanuda (puede estar "suspendido" si se creó antes de una interacción) y sale. Así `init()` se puede llamar muchas veces sin problema.
- `webkitAudioContext` es el nombre antiguo en Safari.

A continuación monta el **circuito** completo, una sola vez:

```
Efectos (pop, acorde, guitarra)
   sfxBus ──────────────────────────────┐
     └──► reverb de efectos ──► 0.35 ──►│
                                        ├──► master (0.9) ──► compresor ──► altavoces
Música                                  │
   musicBus ──► warm (lowpass 2400 Hz) ─┤
                 ├──► musicGain ────────┘   (el "fader" de la música)
                 └──► send 0.3 ──► reverb de música ──► musicGain
                                              musicGain ──► analyser (para el ecualizador)
```

En código:

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
this.musicGain.gain.value = 0;      // empieza en silencio; la música sube con un fundido
…
this.analyser = ctx.createAnalyser();
this.analyser.fftSize = 64;
this.musicGain.connect(this.analyser);
this.newMusicBus();
```

Detalles importantes:

- Un **bus** es un punto de reunión: todos los efectos van a `sfxBus` y todas las notas de la música a `musicBus`. Así se puede controlar cada grupo de golpe.
- **La reverb de la música está antes del fader** (`musicGain`). Esto se hizo así para que, al apagar la música, se corte también la cola de la reverb. Si la reverb estuviera después, seguiría sonando unos segundos tras pulsar "off".

```js
newMusicBus: function () {
  if (this.musicBus) { try { this.musicBus.disconnect(); } catch (e) { } }
  this.musicBus = this.ctx.createGain();
  this.musicBus.connect(this.warm);
},
```

Al parar la música quedan notas **ya programadas** para el futuro próximo. En lugar de rastrearlas una a una, se desconecta el bus entero y se crea uno nuevo: las notas antiguas siguen "sonando" hacia un cable desconectado, es decir, en silencio.

### 9.4 Reverb y ruido generados con matemáticas

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

Un `ConvolverNode` necesita una "respuesta al impulso": una grabación de cómo suena una sala al dar una palmada. En lugar de usar una grabación, se **fabrica**: ruido aleatorio (`Math.random() * 2 - 1`, valores entre −1 y 1) que se va apagando (`(1 − i/len)^decay`). Eso suena como una sala genérica y agradable. `sampleRate` es el número de muestras por segundo (normalmente 44100 o 48000); dos canales = estéreo.

`noise()` crea un segundo de ruido blanco y lo guarda (`this._noise`) para reutilizarlo; se usa para el "soplido" del pop.

### 9.5 Instrumentos sintetizados

**Piano ("felt piano", piano con fieltro):**

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

Un sonido real está formado por una frecuencia principal y sus **armónicos** (múltiplos: ×2, ×3…). Este piano suma tres osciladores:

- la nota (×1) con onda triangular, que dura toda la nota;
- el doble (×2), más flojo (0.22), que se apaga en 0,7 s;
- el triple (×3.01, ligeramente desafinado para que suene menos "electrónico"), aún más flojo, que se apaga en 0,35 s.

Cada lista `[multiplicador, tipo, volumen, duración]` describe un armónico, y `forEach` crea sus nodos.

Después, un filtro paso bajo que empieza abierto (brillante) y se va cerrando en 1,2 s (se apaga el brillo): así la nota "florece" y luego se vuelve suave, como un piano real. La envolvente general tiene ataque de 6 ms, baja rápido al 35 % y se extingue en `dur` segundos.

`o.start(when)` y `o.stop(…)` programan cuándo suena y cuándo se destruye cada oscilador. `dest || this.sfxBus`: si no se indica destino, va al bus de efectos (la música pasa su propio bus).

**Cuerdas (pad):**

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

Un acorde de fondo tipo "cuerdas": para cada nota se crean **dos** ondas de sierra, una desafinada 7 *cents* hacia abajo y otra 7 hacia arriba (un *cent* es la centésima parte de un semitono). Esa pequeña diferencia produce un batido suave que suena "ancho", como una sección de violines. Un filtro a 850 Hz lo oscurece, y la envolvente sube en 2,2 s y baja en 1,4 s: entra y sale sin notarse.

**Guitarra (pluck)**: una onda triangular con un filtro que se cierra rápido (de ×8 a ×1.2 la frecuencia en 0,4 s) y un volumen que cae en 1,2 s: el sonido de una cuerda pulsada.

### 9.6 Los efectos de sonido

**Pop** (al explotar una burbuja):

```js
pop: function (volume) {
  if (!this.enabled || !this.ctx) return;
  var ctx = this.ctx, now = ctx.currentTime, v = volume || 1;
  var o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(1200, now);
  o.frequency.exponentialRampToValueAtTime(180, now + 0.09);
  … volumen de 0.45 a casi 0 en 0,12 s …
  var n = ctx.createBufferSource();
  n.buffer = this.noise();
  var bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2500;
  … ruido filtrado de 0,08 s …
},
```

Dos capas: un tono que **cae** de 1200 a 180 Hz en 90 ms (el "plop") y una ráfaga cortísima de ruido filtrado (el "aire" que sale). `enabled` es `false` si se entró con Escape (sin sonido), y entonces no suena nada.

**Acorde de bienvenida (chime):**

```js
chime: function () {
  if (!this.enabled || !this.ctx) return;
  var now = this.ctx.currentTime + 0.04;
  [50, 57, 62, 66, 69, 76].forEach(function (n, i) {
    Sound.piano(hz(n), now + i * 0.05, i ? 0.13 : 0.18, null, 3.5);
  });
},
```

Seis notas de piano (en MIDI: Re, La, Re, Fa#, La, Mi: un **Re mayor con novena**) separadas 50 ms entre sí, como un arpegio rápido ("acorde arpegiado"). La primera (`i` = 0) suena algo más fuerte.

**Rasgueo de guitarra (strum)**: toca las notas del acorde que esté sonando en la música en ese momento, cada una 28 ms después de la anterior, como un rasgueo. Se usa al hacer clic en la foto de "Más allá del código" (por tu afición a la guitarra), y siempre encaja con la música porque usa su acorde actual.

### 9.7 La música generativa: `XP.Music`

La música se **compone mientras suena**, siguiendo unas reglas.

**La armonía:**

```js
bpm: 68,
progression: [
  { bass: 38, pad: [57, 61, 64, 66], arp: [62, 66, 69, 73, 76] },   // Re maj9
  { bass: 35, pad: [57, 62, 64, 66], arp: [59, 62, 66, 69, 73] },   // Si m11
  { bass: 31, pad: [54, 59, 62, 66], arp: [55, 59, 62, 66, 69] },   // Sol maj7
  { bass: 33, pad: [55, 59, 62, 64], arp: [57, 62, 64, 67, 71] }    // La 7sus4
],
patterns: [[0, 1, 2, 4, 3, 2, 1, 2], [0, 2, 4, 3, 1, 3, 2, 4]],
```

- Tempo: 68 pulsos por minuto (tranquilo).
- Una **progresión de cuatro acordes** que se repite. Cada acorde tiene su nota de bajo, las notas de las cuerdas (`pad`) y cinco notas disponibles para el piano (`arp`, de arpegio). Todo en números MIDI.
- `patterns`: dos patrones de arpegio. Cada número es la posición de la nota dentro de `arp`. `[0, 1, 2, 4, 3, 2, 1, 2]` significa: nota 0, nota 1, nota 2, nota 4…

**El programador de notas (scheduler):**

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

Este patrón se llama **lookahead scheduling** (programar con antelación) y es la forma correcta de hacer música en el navegador:

- Los temporizadores de JavaScript (`setInterval`) **no son precisos**: pueden retrasarse varios milisegundos, lo que se notaría como un ritmo irregular.
- El reloj de audio (`ctx.currentTime`) sí es preciso.
- Solución: cada 25 ms, un `setInterval` mira qué notas tocan en los **próximos 250 ms** y las deja programadas con su hora exacta en el reloj de audio. Aunque el temporizador llegue tarde, las notas ya están programadas con precisión.

`eighth` es la duración de una corchea: 60 / 68 / 2 ≈ 0,44 s. `step` cuenta corcheas desde el inicio.

`self` guarda `this` porque dentro de la función anónima de `setInterval`, `this` ya no sería el objeto `Music`.

**Qué suena en cada paso:**

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

- Cada acorde dura **16 corcheas** (dos compases). `s` es la posición dentro del acorde (0–15). Cuatro acordes = 64 corcheas = un **ciclo**; `cycle` cuenta los ciclos.
- En la corchea 0 de cada acorde: empiezan las cuerdas y el bajo, que duran todo el acorde.
- **Piano**: en el primer ciclo, solo en las corcheas pares (negras: más calmado); desde el segundo, en todas (más fluido). La nota sale del patrón (alternando patrón en cada ciclo). El volumen varía aleatoriamente ±10 % y es mayor en los tiempos fuertes (`s % 4 === 0`), como haría un pianista humano.
- Desde el segundo ciclo, una **melodía aguda** ocasional (una octava más alta, +12), a veces sí y a veces no (`Math.random() < 0.5`).
- Desde el tercer ciclo, un **pulso** muy suave de bombo.

Así la música **va creciendo** poco a poco y nunca se repite exactamente igual.

**Bajo y bombo**: el bajo es una onda senoidal grave; el bombo (`kick`) es una senoidal que cae de 95 a 40 Hz en 0,14 s (ese descenso rápido es lo que el oído reconoce como "bombo").

**Parar, volumen y fundidos:**

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

- `stop` detiene el programador, baja el volumen a 0 en un cuarto de segundo y, pasados 300 ms, cambia el bus (silenciando las notas pendientes). La comprobación `if (!self.playing)` evita romper la música si alguien la vuelve a encender en esos 300 ms.
- `fadeTo`: cancela cualquier fundido en curso, fija el valor actual como punto de partida y hace una rampa lineal hasta el nuevo valor.
- `duck` (*ducking*, "agacharse"): mientras suena tu voz, la música baja al 30 % y luego vuelve. `setTargetAtTime` hace una curva suave hacia el objetivo. Es lo que hacen las radios cuando habla el locutor.

**Aviso de cambios:** `onChange(fn)` y `notify()` forman otro pequeño sistema de eventos: el reproductor se suscribe para actualizar su icono (play/pausa) cada vez que la música empieza o para, venga de donde venga la orden.

### 9.8 La voz: `XP.Voice`

Tu mensaje no se sintetiza: es un archivo MP3 que se reproduce con el reproductor de audio normal del navegador (`Audio`), más sencillo que Web Audio para este caso.

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

- El archivo se elige por idioma: `play("opening")` en español carga `assets/audio/opening-es.mp3?v=3`. `VERSION` es para romper la caché si algún día cambias la grabación.
- `VOLUME: 0.7`: volumen de reproducción (además del volumen ya reducido al procesar el audio).
- `callbacks` es un objeto con dos funciones opcionales que pasa quien llama: `onStart(audio)` (empezó) y `onEnd()` (terminó o falló). Es el mismo concepto que pasar un "listener" a un método en Java.
- `a.play()` devuelve una **promesa**: si el navegador permite reproducir, se ejecuta el `then` (se baja la música y se avisa con `onStart`); si no (por ejemplo, error de red), el `catch` llama a `finish`.
- `finish` se ejecuta al terminar (`ended`), si hay error (`error`) o si falla el `play`. La comprobación `self.clip !== a` evita avisar dos veces o avisar de un audio antiguo que ya fue sustituido.

---

## 10. visuals.js: la onda y las animaciones de temporada

### 10.1 El `<canvas>`: dibujar con código

Hasta ahora todo lo visual eran elementos HTML con estilos. Para cosas con muchas piezas en movimiento (copos de nieve, hojas) eso sería lento. Para eso existe **`<canvas>`**: un rectángulo de píxeles en el que se dibuja con instrucciones, como en un programa de dibujo. No hay elementos: si quieres mover un copo, borras y vuelves a dibujar todo en la nueva posición, 60 veces por segundo.

```js
function makeCanvas(className) {
  var cv = document.createElement("canvas");
  cv.className = className;
  cv.setAttribute("aria-hidden", "true");
  document.body.appendChild(cv);
  return cv;
}
```

Crea un lienzo, le pone una clase (para colocarlo con CSS) y lo añade al `<body>`. En `page.css`:

```css
.season-canvas, .fx-canvas { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.season-canvas { z-index: 50; }
.fx-canvas { z-index: 1001; }
```

Los dos lienzos cubren toda la ventana, fijos, y **no capturan clics** (`pointer-events: none`): todo lo de debajo sigue funcionando. El de temporada queda por debajo de la cabecera; el de la onda, por encima de todo (para que se vea la onda al explotar la burbuja de la intro).

Para dibujar se pide un **contexto 2D**, el objeto con las herramientas de dibujo:

```js
var c = canvas.getContext("2d");
c.clearRect(0, 0, ancho, alto);   // borrar
c.beginPath();                    // empezar una figura
c.arc(x, y, radio, 0, Math.PI*2); // un círculo completo (ángulos en radianes)
c.fill();                         // rellenarla (con c.fillStyle)
c.stroke();                       // o dibujar solo el contorno (con c.strokeStyle y c.lineWidth)
c.globalAlpha = 0.5;              // transparencia de lo que se dibuje después
```

### 10.2 Pantallas de alta densidad (DPR)

```js
resize: function () {
  this.dpr = Math.min(window.devicePixelRatio || 1, 2);
  this.canvas.width = innerWidth * this.dpr;
  this.canvas.height = innerHeight * this.dpr;
},
…
c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
```

Los móviles y portátiles modernos tienen pantallas "retina": 2 o 3 píxeles físicos por cada píxel CSS (`devicePixelRatio`). Si el lienzo tuviera tantos píxeles como la ventana en CSS, se vería borroso. Por eso:

- se le da un tamaño interno multiplicado por el DPR (limitado a 2 para no gastar de más);
- `setTransform(dpr, …)` escala todos los dibujos, así el código puede seguir usando coordenadas normales;
- `resize` se vuelve a ejecutar cada vez que cambia el tamaño de la ventana (evento `resize`).

### 10.3 La onda: `XP.Ripple`

Cuando explota una burbuja, sale un anillo que se expande y se desvanece.

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

- `at(x, y, …)` añade un anillo a la lista con su hora de nacimiento. `performance.now()` da la hora en milisegundos con alta precisión.
- El bucle de animación **solo corre mientras hay anillos**: cuando la lista queda vacía, se detiene. No se gasta batería cuando no hay nada que dibujar.
- En cada fotograma, `k` es el progreso de 0 a 1 (la animación dura 700 ms). El radio crece con la curva `1 − (1−k)³` (rápido al principio, frenando al final), mientras la opacidad y el grosor bajan con `life = 1 − k`.
- La lista se recorre **al revés** (`i--`) porque se van eliminando elementos (`splice`) durante el recorrido; al revés, borrar uno no descoloca los que faltan por visitar.
- La animación va por **tiempo**, no por fotogramas: dura 700 ms en cualquier pantalla, sea de 60 o de 120 Hz.

Las coordenadas `x, y` son de la ventana; quien llama las calcula con `getBoundingClientRect()`, que devuelve la posición y el tamaño de un elemento en pantalla (`left`, `top`, `width`, `height`, `right`, `bottom`).

### 10.4 Las partículas de temporada: `XP.Seasons`

**Qué estación es:**

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

- Primero mira si la dirección tiene `?season=winter` (o otra). Esto sirve para **probar** cada estación sin esperar meses: `https://luciaesteban.github.io/?season=winter`. `location.search` es la parte de la URL desde `?`. `/…/` es una **expresión regular** (un patrón de búsqueda de texto, como en Java `Pattern`); `exec` devuelve lo encontrado y `q[1]` es lo que hay dentro del paréntesis.
- Si no, decide por el mes. En JavaScript `getMonth()` va de **0 (enero) a 11 (diciembre)**. Invierno: diciembre a febrero (hemisferio norte), primavera: marzo–mayo, verano: junio–agosto, otoño: septiembre–noviembre.

**Arranque y bucle:**

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

- Si el usuario pidió menos movimiento, **no se crea nada** (ni lienzo, ni botón).
- Recupera si el visitante las había apagado (`localStorage`).
- Bucle infinito con `requestAnimationFrame`, que solo dibuja si la pestaña está visible y la animación activada.

**Cuántas partículas:**

```js
var count = Math.max(7, Math.min(17, Math.round(this.w / 105)));
while (this.parts.length < count) this.parts.push(this.spawn(true));
this.parts.length = count;
```

Una por cada 105 px de ancho, entre 7 y 17. Pocas a propósito, para que sea sutil. Asignar `length` a una lista la recorta.

**Crear una partícula con parámetros al azar:**

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

- Al principio (`anywhere = true`) las partículas se reparten por toda la pantalla; después, las nuevas nacen arriba (o abajo en verano, porque las luciérnagas **suben**: su velocidad `vy` es negativa).
- La tabla `cfg` guarda, por estación, pares "mínimo, variación extra" de tamaño, velocidad, balanceo y opacidad. Cada partícula recibe valores al azar dentro de ese rango, así ninguna es igual. Escribir la configuración como tabla de datos en vez de con muchos `if` hace fácil ajustarla (así se hizo cuando pediste que fueran "un poquito menos cargadas").

**Mover y dibujar (cada fotograma):**

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

- `dt` (*delta time*) es cuánto tiempo pasó desde el fotograma anterior, en unidades de "un fotograma a 60 Hz" (16,67 ms). Multiplicar todo movimiento por `dt` hace que la velocidad sea la misma en pantallas de 60 o 144 Hz. Se limita a 3 para que, al volver a una pestaña tras un rato, las partículas no den un salto enorme.
- El balanceo lateral es un **seno**: `Math.sin(phase)` oscila suavemente entre −1 y 1, y `phase` avanza poco a poco. Así los copos y hojas se mecen de lado a lado.
- Cuando una partícula sale de la pantalla, se sustituye por una nueva (**reciclaje**): el número de partículas es constante.

**Las formas:**

- Invierno y verano: círculos (`arc`). En verano, además, un halo grande y muy transparente (brillo de luciérnaga) y un parpadeo de la opacidad con otro seno.
- Primavera (pétalos): una forma de lágrima con dos **curvas de Bézier** (`bezierCurveTo`, curvas suaves definidas por puntos de control), que se estira y encoge (`scale`) para parecer que gira en el aire.
- Otoño (hojas): un óvalo en punta con dos curvas cuadráticas (`quadraticCurveTo`) y una línea central (el nervio), que se aplana y ensancha como una hoja dando vueltas.

`c.save()` / `c.restore()` guardan y recuperan el estado del contexto: entre medias se traslada el origen a la partícula (`translate`) y se gira (`rotate`), y después se vuelve a la normalidad para la siguiente.

Los colores cambian según el tema (`palettes[estación][light|dark]`): en modo oscuro, por ejemplo, la nieve es blanca; en modo claro, azul grisácea para que se vea sobre fondo blanco.

**Encender y apagar:**

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

Oculta o muestra el lienzo y guarda la elección (salvo cuando se está restaurando la elección guardada, para no volver a escribirla).

---

## 11. controls.js y controls.css: los controles flotantes

Abajo a la derecha hay dos controles fijos: el **reproductor de música** y el **interruptor de la animación de temporada**. Aparecen cuando se cierra la intro.

### 11.1 Iconos como texto

```js
var ICONS = {
  play: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
  pause: '<svg …><rect x="6" y="5" width="4" height="14" rx="1" …/><rect x="14" …/></svg>',
  winter: '<path d="M12 3v18M4.2 7.5l15.6 9…"/>',
  …
};
```

Los iconos se guardan como texto HTML y se insertan con `innerHTML`. El del interruptor de animación depende de la estación: un copo, una flor, un sol o una hoja.

### 11.2 El reproductor

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

- Se construye con código: botón play/pausa, ecualizador (cinco barritas), etiqueta ("Music: on") y un deslizador de volumen (`<input type="range">`, de 0 a 1).
- Al pulsar el botón se activa el sonido (por si se entró sin él) y se alterna la música.
- El evento `input` del deslizador se dispara continuamente mientras se arrastra; `parseFloat` convierte su valor (que es texto) en número.
- Se suscribe a los cambios de la música y del idioma para repintarse.

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

`paint` refleja el estado actual: icono, textos de accesibilidad y etiqueta (se le quita el símbolo "♪ " que sí lleva el botón de la intro).

**El ecualizador que sigue a la música:**

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

- El `AnalyserNode` (de 9.3) descompone el sonido en 32 bandas de frecuencia (de graves a agudos). `getByteFrequencyData` rellena la lista `data` con la intensidad de cada banda (0–255). `Uint8Array` es una lista de números enteros de 0 a 255, más eficiente que una lista normal.
- Cada 60 ms, cada barra toma una banda (la 1, 4, 7, 10, 13) y su altura va de 4 a 18 px según la intensidad. Así las barras **bailan de verdad** con la música, no con una animación falsa.
- `toFixed(1)` redondea a un decimal.

### 11.3 El interruptor de animación

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

Si no existe el lienzo (movimiento reducido), no se crea el botón. `ICONS[seasons.season]` elige el icono por el nombre de la estación. `classList.toggle("is-off", !on)` con un segundo parámetro pone o quita la clase según la condición.

### 11.4 Mostrar los controles

```js
XP.Controls = {
  init: function () { Player.init(); SeasonSwitch.init(); },
  show: function () {
    Player.el.classList.add("is-visible");
    if (SeasonSwitch.btn) SeasonSwitch.btn.classList.add("is-visible");
  }
};
```

`Player` y `SeasonSwitch` son privados del archivo (variables locales de la IIFE); hacia fuera solo se publica `XP.Controls` con dos funciones. Es **encapsulación**: el resto del código no necesita saber cómo están hechos por dentro.

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

- Fijo abajo a la derecha, con efecto cristal.
- Empieza **escondido debajo de la pantalla** (`translateY(140%)`) y transparente; al recibir `is-visible` sube con una curva suave.
- Las barras del ecualizador tienen `transition: height`, así los saltos de altura que pone JS cada 60 ms se ven fluidos.

```css
.season-toggle { position: fixed; right: 1.1rem; bottom: calc(1.1rem + 64px); … transition: … 120ms; }
@media (max-width: 600px) {
  .music-label, .music-vol { display: none; }
  .season-toggle { right: calc(0.8rem + 98px); bottom: calc(0.8rem + 7px); padding: 0.3rem; }
  .season-toggle-label { display: none; }
}
```

- En PC, el interruptor va justo encima del reproductor (`calc(1.1rem + 64px)`) y aparece 120 ms después (un pequeño escalonado queda más elegante).
- En móvil, el reproductor se reduce a botón + ecualizador, y el interruptor se coloca **a su izquierda** como icono solo, para ocupar menos pantalla.

---

## 12. intro.js e intro.css: la pantalla de la burbuja

### 12.1 El código AL que cae de fondo

```js
var AL_SNIPPETS = [
  "[EventSubscriber(ObjectType::Codeunit, Codeunit::\"Sales-Post\",\n    'OnAfterPostSalesDoc', '', false, false)]\nlocal procedure …",
  "page 50120 \"Customer API\"\n{\n    PageType = API;\n …",
  …
];
```

Ocho fragmentos de código AL reales en estilo (suscriptores a eventos, una página API, un codeunit que envía webhooks con `HttpClient`, una tableextension, un XMLport…). Dentro de un texto JavaScript, `\n` es un salto de línea y `\"` una comilla doble literal.

**Coloreado de sintaxis:**

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

1. **Escapar** `&`, `<` y `>`: como el código se va a insertar como HTML, hay que convertir esos caracteres para que no se interpreten como etiquetas.
2. **Partir** el texto con una expresión regular que captura: textos entre comillas simples, entre comillas dobles, y atributos `[EventSubscriber…]`. Cuando `split` usa una expresión con paréntesis de captura, el resultado alterna "texto normal, trozo capturado, texto normal, trozo capturado…". Por eso las posiciones impares (`i % 2`) son las capturadas.
3. Las capturadas se envuelven en `<span class="c-a">` (atributo) o `c-s` (texto); en las normales, las **palabras clave** se envuelven en `c-k`. `\b` en la expresión significa "límite de palabra" (para no colorear `end` dentro de `Send`); la `g` final, "todas las apariciones"; `$1` es "lo que se encontró".
4. `intro.css` da un color a cada clase: lila para palabras clave, verde para textos, dorado para atributos.

**Las columnas en bucle infinito:**

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

- 4, 3 o 2 columnas según el ancho de pantalla.
- Cada columna **rota** el orden de los fragmentos (`(i + c*3) % 8`) para que no se vean los mismos a la misma altura.
- `<pre>` es un elemento que respeta espacios y saltos de línea tal cual (ideal para código).
- **El truco del bucle perfecto**: dentro de cada columna se pone el bloque de código **dos veces seguidas**. La animación CSS mueve la columna desde −50 % (se ve la primera copia… o sea, la mitad de arriba) hasta 0. Como las dos mitades son idénticas, cuando la animación vuelve a empezar el salto es invisible:

  ```css
  @keyframes codeFall {
    from { transform: translateY(-50%); }
    to   { transform: translateY(0); }
  }
  ```

- Cada columna tiene distinta velocidad (70, 83, 96… s) y un **retardo negativo** (`animation-delay: -17s`), que hace que la animación empiece "ya avanzada", así no arrancan todas desde el mismo punto.
- `insertBefore` inserta la capa antes de la burbuja, para que quede detrás.

Y en CSS, lo que la hace casi invisible:

```css
.intro-code {
  position: absolute; inset: 0;
  display: flex; justify-content: space-around;
  opacity: 0.075;
  mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%);
}
.intro-code-col:nth-child(even) { filter: blur(0.6px); opacity: 0.75; }
```

- Opacidad 7,5 %: solo se aprecia si te fijas.
- `mask-image` con un degradado hace que el código **aparezca y desaparezca gradualmente** arriba y abajo, sin cortes (donde la máscara es transparente, el contenido no se ve).
- Las columnas pares, ligeramente desenfocadas: sensación de profundidad.

### 12.2 `XP.Intro.init`: la lógica de la pantalla

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

- `onDone` es un callback: lo que hay que hacer cuando la intro termine (mostrar los controles). Lo pasa `page.js`.
- `entered` impide entrar dos veces (por ejemplo, doble clic).
- `timers` guarda los identificadores de los temporizadores para poder cancelarlos.

**El selector de idioma de la intro:**

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

- La etiqueta está en los dos idiomas a la vez ("Language · Idioma") porque aún no se sabe cuál entiende el visitante.
- **No duplica la lógica de idioma**: al elegir, simula un clic en el botón EN/ES correspondiente de la cabecera (`siteBtn.click()`). Así `main.js` hace la traducción de siempre, y todos los suscriptores de `XP.onLanguageChange` se enteran. Después traduce la propia intro (`localise`) y vuelve a escribir la bienvenida en el nuevo idioma.

**La pista del idioma** (`hintLanguage`): cuando termina de escribirse la bienvenida, muestra durante 5 s un pequeño globo "Puedes cambiar el idioma aquí" y hace latir un anillo alrededor del selector:

```js
langBox.classList.remove("is-hinting");
void langBox.offsetWidth; // restart the animation
langBox.classList.add("is-hinting");
```

Una animación CSS no se repite si la clase ya estaba puesta. El truco es quitarla, **forzar al navegador a recalcular** el diseño (leer `offsetWidth` lo obliga) y volver a ponerla. `void` indica que se lee el valor solo por ese efecto.

**Traducir la intro:**

```js
function localise() {
  intro.querySelectorAll("[data-intro-text]").forEach(function (el) {
    el.textContent = t(el.getAttribute("data-intro-text"));
  });
  bubble.setAttribute("aria-label", t("bubbleLabel"));
  …
}
```

Igual que `applyTranslations` de `main.js`, pero con los textos de `XP.TEXT`.

**La bienvenida escrita letra a letra:**

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

- `step` es una función que se llama a sí misma con `setTimeout`: cada vez muestra una letra más (`slice(0, i)` = los primeros `i` caracteres).
- 32 ms por letra, pero **380 ms tras un punto**, como una pausa natural al leer.
- `clearTimeout` al principio: si se cambia de idioma a mitad, se cancela la escritura anterior antes de empezar la nueva.
- Mientras escribe, la clase `is-typing` muestra un cursor parpadeante (`::after` en CSS con `animation: caretBlink 0.9s steps(1) infinite`; `steps(1)` hace que salte de visible a invisible sin fundido, como un cursor real).
- Empieza a los 2,5 s (`setTimeout(typeWelcome, 2500)`), cuando la burbuja ya ha aparecido.

**Las burbujitas que suben:**

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

Cada 380 ms nace una burbuja de tamaño, posición, deriva lateral y velocidad aleatorias. `setProperty("--drift", …)` le da un valor a una **variable CSS** solo para ese elemento, que la animación usa:

```css
@keyframes fizzUp {
  0%   { transform: translate(0, 0); opacity: 0; }
  10%  { opacity: 0.9; }
  100% { transform: translate(var(--drift, 20px), -110vh); opacity: 0; }
}
```

A los 13,5 s cada burbuja se elimina del DOM, para no acumular elementos.

### 12.3 Entrar: explotar la burbuja

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

La secuencia, coreografiada con temporizadores:

| Momento | Qué pasa |
|---|---|
| 0 ms | Se activa el sonido (este clic es la interacción que permite crear el `AudioContext`). Suena el pop y el acorde. La burbuja recibe `is-popping` (animación de explotar). Sale la onda desde su centro. |
| 380 ms | La intro recibe `is-leaving` (se desvanece y se desenfoca). Se quita `intro-open` de `<html>`: la página de detrás pasa de borrosa a nítida. |
| 880 ms | Empieza la música (si no se desactivó), con un fundido de 3 s. |
| 1400 ms | La intro se oculta del todo (`is-gone`), se paran las burbujitas, se mueve el foco del teclado al contenido principal y se llama a `onDone` (aparecen los controles). |

El foco se mueve a `<main>` para que alguien que navega con teclado no se quede "perdido" en un elemento que ya no existe. `tabindex="-1"` permite dar el foco a un elemento que normalmente no lo recibe; `preventScroll` evita que el navegador haga scroll al hacerlo.

**Teclado:**

```js
bubble.addEventListener("click", function () { enter(true); });
document.addEventListener("keydown", function onKey(e) {
  if (entered) { document.removeEventListener("keydown", onKey); return; }
  var onOtherButton = e.target !== bubble && e.target.tagName === "BUTTON";
  if ((e.key === "Enter" || e.key === " ") && !onOtherButton) { e.preventDefault(); enter(true); }
  if (e.key === "Escape") enter(false);
});
```

- Enter o Espacio entran con sonido; Escape entra **sin sonido**.
- Si el foco está en otro botón (por ejemplo, "Español"), Enter debe pulsar ese botón y no entrar, por eso se comprueba `onOtherButton`.
- La función del listener tiene nombre (`onKey`) para poder quitarse a sí misma con `removeEventListener` cuando ya se ha entrado.

### 12.4 intro.css: la burbuja

**La capa y el desenfoque de la página:**

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

- `display: grid; place-items: center` es la forma más corta de **centrar** algo en horizontal y vertical.
- `visibility 0s linear 900ms`: la visibilidad cambia de golpe, pero **después** de 900 ms (cuando ya terminó el fundido).
- Mientras `<html>` tiene `intro-open`: no se puede hacer scroll (`overflow: hidden`) y todo lo que hay en `<body>` excepto la intro y algunas capas está desenfocado y un 3 % más grande. Al quitar la clase, la transición de 1,1 s lo vuelve nítido y a su tamaño: el efecto de "enfocar un objetivo de cámara".

**La burbuja:**

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

- Tamaño: el 78 % del lado más corto de la pantalla, máximo 440 px. Así cabe en cualquier pantalla.
- El aspecto de pompa de jabón se consigue **solo con degradados**: un brillo blanco arriba a la izquierda, un reflejo violeta abajo a la derecha, y un centro transparente que se oscurece hacia el borde. Las sombras `inset` (hacia dentro) añaden volumen.
- `clip-path: circle(…)` recorta todo lo que salga del círculo. Se añadió porque, al aplicar `filter: blur` durante la animación, algunas tarjetas gráficas pintaban el desenfoque como un **cuadrado**; el recorte lo mantiene redondo.
- **Dos animaciones a la vez**, separadas por coma:
  - `bubbleEmerge` (1,8 s, tras 250 ms): de pequeña, transparente y muy borrosa (`blur(40px)`) a nítida, con un pequeño rebote (la curva termina en 1.15, se pasa un poco). `both` mantiene el estado inicial antes de empezar y el final al acabar.
  - `bubbleWobble` (6 s, infinita, empieza cuando termina la otra): cambia ligeramente el `border-radius` de cada esquina y sube y baja unos píxeles. Hace que la burbuja parezca blanda y viva.

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

El **borde iridiscente** que gira: un degradado cónico de colores en un pseudoelemento del tamaño de la burbuja. El truco de las máscaras: se superponen dos máscaras, una del área de contenido (sin el `padding`) y otra del elemento entero, y se "restan" (`exclude`). Queda solo el anillo de 3 px del relleno. Luego gira sin parar.

`::after` es el **brillo** en forma de óvalo blanco inclinado arriba a la izquierda.

**El contenido aparece escalonado:**

```css
.intro-content > * { opacity: 0; animation: contentRise 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.intro-avatar { animation-delay: 1300ms !important; }
.intro-eyebrow { animation-delay: 1500ms !important; }
.intro-name { … animation: contentRise … 1650ms forwards, shimmer 5s linear 2600ms infinite !important; }
.intro-role { animation-delay: 1800ms !important; }
.intro-cta { … animation: contentRise … 2100ms forwards, ctaPulse 2.4s ease-in-out 3000ms infinite !important; }
```

Cada elemento dentro de la burbuja sube y se enfoca con 150–300 ms de diferencia (foto, "Portfolio", nombre, rol, llamada a la acción). `forwards` mantiene el estado final. El nombre tiene además un **brillo que lo recorre** (`shimmer`): un degradado del doble de ancho que el texto, aplicado solo a las letras (`background-clip: text; color: transparent`), que se desplaza. El botón "Toca la burbuja" late con una sombra que crece y se desvanece.

**Explosión:**

```css
.intro-bubble.is-popping { animation: bubblePop 520ms cubic-bezier(0.3, 0, 0.6, 1) forwards; }
@keyframes bubblePop {
  0%   { transform: scale(1); opacity: 1; filter: blur(0); }
  35%  { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1.7); opacity: 0; filter: blur(12px); }
}
```

Se hincha un poco, y luego se agranda, se desenfoca y desaparece.

**Ajustes finales:**

```css
@media (pointer: coarse) { .intro-hint { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .intro-bubble, .intro-content > *, … { animation: none !important; opacity: 1 !important; }
  html.intro-open body > * { filter: none !important; transform: none !important; }
}
```

En pantallas táctiles se oculta "Pulsa Enter" (no hay teclado). Con movimiento reducido, la burbuja aparece quieta y sin desenfoques.

---

## 13. voice.js y voice.css: el mensaje de voz y la visita guiada

Esta parte junta varias piezas: la viñeta de cómic sobre tu foto, la reproducción de tu voz, los subtítulos que se iluminan palabra a palabra, y la visita guiada que recorre la web mientras hablas.

### 13.1 Resumen del funcionamiento

1. `XP.Listen.init()` añade la viñeta "Escúchame" a la esquina de tu foto y prepara el panel de subtítulos.
2. Al tocar la viñeta (o la foto): la viñeta explota, se abre el panel de subtítulos y, 350 ms después, empieza tu audio.
3. Mientras suena, **en cada fotograma** se lee el segundo exacto del audio y:
   - se muestra la frase que toca y se iluminan las palabras ya dichas;
   - si toca un paso de la visita, la página se desplaza suavemente a esa sección.
4. En el primer paso de la visita, el panel se "suelta" de la foto y se queda fijo en una esquina de la pantalla.
5. Durante la visita, el scroll del visitante está **bloqueado** para que no se descoordine.
6. Al terminar: vuelve suavemente arriba, se desbloquea el scroll y el panel se cierra tras 2,5 s.
7. Solo se puede escuchar **una vez por visita**.

### 13.2 El panel de subtítulos: `Captions(frame)`

`Captions` es una función que construye el panel y devuelve un objeto con sus operaciones (`open`, `follow`, `float`, `close`). Es el patrón de closure explicado en 2.3: las variables internas (`cues`, `words`, `current`…) son privadas.

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

El panel tiene una cabecera (icono de altavoz, "Lucía · Mensaje de voz" y un pequeño ecualizador animado), la **frase anterior** en pequeño y gris, y la **frase actual** en grande.

**Por qué el panel se añade a `<body>` y no a la foto.** Es el detalle técnico más importante de esta parte. La foto está dentro de un elemento con la clase `reveal`, que usa `transform` para su animación de aparición. Como se explicó en 2.2, `transform` crea un **contexto de apilamiento** y además cambia la referencia de `position: fixed`. Si el panel estuviera dentro de la foto:

- nunca podría quedar por encima de la cabecera, por mucho `z-index` que tuviera, porque estaría "encerrado" en la capa de la foto;
- `position: fixed` no lo fijaría a la ventana sino a la foto.

Por eso vive directamente en `<body>`, con `z-index: 1100` (el más alto de la web), y se **coloca calculando la posición de la foto**.

### 13.3 Dividir cada frase en palabras con su momento

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

Cuando empieza una frase nueva:

- la frase anterior pasa a la línea pequeña;
- la actual se divide en palabras, y cada palabra se mete en su propio `<span>`;
- a cada palabra se le calcula **en qué fracción de la frase empieza** (`at`, de 0 a 1), **proporcional al número de letras** que hay antes. Una palabra larga tarda más en decirse que una corta, así que esta aproximación se parece bastante al ritmo real del habla.

Por ejemplo, en "Gracias por tu visita." (22 caracteres): "Gracias" empieza en 0/22 = 0; "por" en 8/22 ≈ 0,36; "tu" en 12/22 ≈ 0,55; "visita." en 15/22 ≈ 0,68.

### 13.4 La sincronización en cada fotograma

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

- `audio.currentTime` es el segundo exacto de reproducción del audio. **Todo se sincroniza con el audio**, no con un reloj propio: si el audio se retrasa (por ejemplo, porque tarda en cargar), los subtítulos y la visita esperan con él.
- Se avisa a la visita guiada del tiempo actual.
- Se busca la última frase cuyo inicio ya ha pasado. Si ha cambiado, se construye.
- `progress` es cuánto de la frase actual ha transcurrido (0 al empezar, 1 al acabar).
- Cada palabra cuyo `at` ya ha pasado recibe `is-said`, y el CSS la ilumina. El `- 0.03` es un pequeño **retraso** deliberado: así las palabras se iluminan un pelín después de decirlas y nunca por delante de la voz (se ajustó cuando notaste que en inglés iban algo adelantadas).
- `requestAnimationFrame` vuelve a llamar a `sync` en el siguiente fotograma: unas 60 comprobaciones por segundo.

En CSS:

```css
.voice-cc-now span { opacity: 0.12; transition: opacity 250ms ease; }
.voice-cc-now span.is-said { opacity: 1; }
```

Las palabras pendientes se ven muy tenues (12 %) y pasan a opacidad completa con un fundido de 250 ms: la frase se "va escribiendo" a la vez que la dices.

### 13.5 Dónde colocar el panel

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

Se elige entre tres posiciones para **no tapar nunca texto**:

| Situación | Posición | Por qué |
|---|---|---|
| Pantalla grande con hueco a la derecha de la foto (≥ 260 px) | `right`: a la derecha de la foto, centrado en vertical | Es la zona vacía del hero en PC. |
| PC más estrecho | `below`: debajo de la foto, mismo ancho | A la derecha no cabe. |
| Tablet o móvil (≤ 900 px) | `over`: sobre la parte baja de la foto | La foto está encima del texto; debajo taparía tu nombre. |

- `getBoundingClientRect()` da la posición de la foto **en la ventana**. Como el panel está en `<body>` con `position: absolute` (coordenadas de la página), se suma `scrollX`/`scrollY` (lo que se ha desplazado la página) para convertir coordenadas de ventana en coordenadas de página.
- Cada posición es una lista `[izquierda, arriba, ancho]`; la tabla `{ right: …, below: …, over: … }[where]` elige una por su nombre (otra forma de evitar una cadena de `if`).
- La clase `cc-right` / `cc-below` / `cc-over` le dice al CSS cómo **anclar** el panel en ese punto:

```css
.voice-cc.cc-right { transform: translate(-14px, -50%); }
.voice-cc.cc-right.is-open { transform: translate(0, -50%); }
.voice-cc.cc-over { transform: translateY(calc(-100% + 10px)); }
.voice-cc.cc-over.is-open { transform: translateY(-100%); }
```

  - En `right`, el punto calculado es el centro vertical de la foto, y `translateY(-50%)` sube el panel la mitad de su propia altura: queda centrado.
  - En `over`, el punto es el borde inferior de la foto, y `translateY(-100%)` sube el panel toda su altura: queda apoyado sobre ese borde, dentro de la foto.
  - Los porcentajes de `translate` son **del propio elemento**, por eso sirven para centrar sin saber su tamaño.
  - La diferencia entre el estado cerrado y `is-open` (unos píxeles) produce un pequeño deslizamiento al aparecer.
- `place()` se vuelve a ejecutar si cambia el tamaño de la ventana.

**Modo flotante** (durante la visita guiada):

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

Cuando empieza la visita, la página se va a mover, así que el panel ya no puede ir pegado a la foto. Se borran las posiciones calculadas y pasa a `position: fixed` abajo a la izquierda (a la derecha están los controles de música). En móvil ocupa todo el ancho, justo encima de los controles.

**Abrir y cerrar:**

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

- `open`: coloca el panel, carga los subtítulos del idioma actual y lo muestra.
- `follow`: se llama cuando el audio ya ha empezado; activa el ecualizador (`is-live`) y arranca la sincronización.
- `close`: detiene el bucle, ilumina todas las palabras que falten, espera `delay` ms (para que se pueda leer la última frase), desvanece el panel y lo elimina del DOM.

### 13.6 La visita guiada: `Tour`

**El desplazamiento suave: `Glide`**

El navegador tiene su propio scroll suave (`behavior: "smooth"`), pero es rápido y seco, y no se puede controlar su duración ni su curva. Por eso se programó uno propio:

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

- Guarda la posición inicial (`scrollY`), la distancia al destino y la hora de inicio.
- En cada fotograma calcula el progreso `k` (de 0 a 1 según el tiempo transcurrido) y lo pasa por una **curva de aceleración** llamada *easeInOutCubic*:
  - en la primera mitad, `4k³`: empieza muy despacio y acelera;
  - en la segunda, `1 − (−2k + 2)³ / 2`: frena poco a poco hasta pararse.

  Es la misma sensación que un coche que arranca y frena con suavidad, en vez de ir a velocidad constante.
- Mueve la página a `inicio + distancia × ease`.
- `behavior: "instant"` es necesario porque `styles.css` tiene `scroll-behavior: smooth` para toda la página: sin esto, cada pequeño paso se convertiría a su vez en un scroll suave del navegador, y los dos sistemas se pelearían (se notaría a tirones).
- `cancelAnimationFrame` al principio: si llega un destino nuevo mientras aún se está moviendo hacia el anterior, se cancela el viejo y se parte **desde donde está**, sin saltos.
- Con movimiento reducido, salta directamente.

**El recorrido:**

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

- `steps` es la lista `openingTour` de `core.js`: `[segundo, selector]`.
- `update(time)` se llama en cada fotograma desde `sync`. Si el audio ya ha pasado el segundo del siguiente paso, se desplaza a su elemento. Es un `while` y no un `if` por si en un solo fotograma se han pasado dos pasos.
- `targetFor` calcula a qué altura de la página desplazarse:
  - si el destino es una **sección**, se deja su parte de arriba justo debajo de la cabecera (restando su altura y 8 px de margen);
  - si es otro elemento (una tarjeta), se **centra** en la pantalla (dejando como mínimo 80 px arriba).
  - `offsetHeight` es la altura del elemento en píxeles.
- **Duración según la distancia**: 1,1 s más 0,35 ms por píxel, con un máximo de 2,2 s. Un salto corto es rápido, uno largo tarda algo más, pero siempre suave. La vuelta arriba al final es algo más lenta (hasta 2,6 s).
- `onFirstStep` es el callback que suelta el panel a la esquina (`captions.float()`).

**El bloqueo del scroll:**

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

Mientras dura la visita, se cancelan (`preventDefault`) **todas las formas de hacer scroll** del visitante:

- `wheel`: la rueda del ratón o el panel táctil del portátil;
- `touchmove`: arrastrar el dedo en el móvil;
- `keydown`: solo las teclas que desplazan (flechas, Re Pág/Av Pág, Inicio, Fin, espacio). El resto del teclado funciona. `SCROLL_KEYS` es un objeto usado como conjunto: `SCROLL_KEYS[e.key]` existe solo para esas teclas;
- `click`: solo en enlaces internos (`href` que empieza por `#`), que saltarían a otra sección. Los demás clics (música, tema…) siguen funcionando.

Dos opciones del listener son esenciales:

- `passive: false`: por rendimiento, los navegadores tratan `wheel` y `touchmove` como "pasivos" (asumen que no se van a cancelar) y **ignoran** `preventDefault()`. Con `passive: false` se les dice que sí se van a cancelar.
- `capture: true`: el listener se ejecuta en la fase de **captura**, es decir, cuando el evento baja desde `window` hacia el elemento, **antes** que cualquier otro listener de la página. Así ningún otro código llega a procesar el scroll.

`unlock()` quita los listeners al terminar (hay que pasar las mismas opciones `capture` para que el navegador identifique cuál quitar).

La visita se quiso **no cancelable** porque, si el visitante movía la página, los subtítulos seguían hablando de una sección que ya no estaba en pantalla.

### 13.7 La viñeta de cómic: `XP.Listen`

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

La viñeta es un `<button>` con: icono de altavoz, texto ("Escúchame"), un anillo que se expande (invita a pulsar) y tres rayitas de "movimiento" típicas del cómic. Se añade dentro del marco de la foto. `has-listen` hace que la foto también sea clicable (cursor de mano y un leve zoom al pasar el ratón).

**Explotar la viñeta:**

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

- `new Array(9).join("<i></i>")` es un truco para repetir un texto 8 veces (una lista de 9 huecos vacíos unidos por el texto). Son 8 rayitas que salen disparadas en círculo.
- `offsetLeft`/`offsetTop` dan la posición de la viñeta **dentro de su marco**, para colocar la explosión en su centro.
- Se combina la animación de explotar (CSS), la onda (canvas) y un pop más suave (volumen 0,5).

**Reproducir:**

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

- `stopPropagation()`: la viñeta está **dentro** de la foto, y ambas escuchan el clic. Sin esto, un clic en la viñeta llegaría también a la foto (por la propagación hacia arriba) y se ejecutaría `play` dos veces.
- `used` garantiza que solo se reproduce una vez por visita y que nunca se solapa consigo mismo.
- Se crea la visita guiada (que bloquea el scroll desde ese momento) y, tras 350 ms (lo que dura la explosión), se reproduce el audio con sus dos callbacks:
  - `onStart`: empieza la sincronización de subtítulos y visita;
  - `onEnd`: vuelve arriba, desbloquea y cierra el panel. Si el audio ni siquiera llegó a empezar (error), se cierra al instante.

### 13.8 voice.css: el estilo cómic

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

Variables propias de esta parte. En modo oscuro, la sombra de la viñeta es azul, porque una sombra oscura desaparecería sobre fondo oscuro.

**La viñeta:**

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

- Sale por la esquina superior derecha de la foto (posiciones negativas).
- Borde grueso oscuro, fondo blanco y **sombra dura sin difuminar** (`4px 4px 0`): el estilo clásico de cómic.
- Se usa `filter: drop-shadow` en lugar de `box-shadow` porque `drop-shadow` sigue la **forma real** del elemento, incluida la cola; `box-shadow` solo sombrearía el rectángulo.
- `transform-origin: 20% 130%`: el punto desde el que crece y gira es la punta de la cola, así parece que "sale" de la foto.
- Aparece con rebote a los 600 ms y cada 4,5 s hace un pequeño meneo (`speechNudge`) para llamar la atención.

**La cola de la viñeta**, hecha con los dos pseudoelementos y `clip-path`:

```css
.speech-bubble::before,
.speech-bubble::after { content: ""; position: absolute; clip-path: polygon(0 0, 100% 0, 0 100%); }
.speech-bubble::before { left: 20px; bottom: -16px; width: 22px; height: 16px; background: var(--comic-ink); }
.speech-bubble::after  { left: 22.5px; bottom: -9px; width: 14px; height: 11.5px; background: var(--comic-paper); }
```

`clip-path: polygon(…)` recorta un elemento a un polígono: aquí, un **triángulo** con vértices arriba-izquierda, arriba-derecha y abajo-izquierda. Hay dos triángulos superpuestos: uno oscuro (el contorno) y otro blanco más pequeño encima (el relleno), que además tapa el trozo de borde de la viñeta donde se une la cola. El resultado es una cola con contorno, apuntando hacia tu foto.

**Resto de animaciones:** `speechRing` (el anillo que se expande y desvanece), `speechWave` (las ondas del icono de altavoz se encienden una tras otra con retardos de 0,2 s), `speechPop` (explota) y `speechBurst` (las rayitas):

```css
.speech-burst i:nth-child(1) { --a: 0deg; }
.speech-burst i:nth-child(2) { --a: 45deg; }
…
@keyframes speechBurst {
  0%   { opacity: 1; transform: rotate(var(--a)) translateY(-26px) scaleY(1); }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(-62px) scaleY(0.3); }
}
```

Cada rayita tiene su ángulo en una variable `--a` (0°, 45°, 90°…). La animación la gira a ese ángulo y la desplaza hacia fuera: una sola animación sirve para las ocho direcciones. El orden de las transformaciones importa: primero gira, y después "hacia arriba" ya es en la dirección girada.

**El panel:** fondo semitransparente con `backdrop-filter: blur(10px)` (cristal), el ecualizador de la cabecera animado solo mientras `is-live`, y en `prefers-reduced-motion` se quitan todas las animaciones.

---

## 14. page.js, contact.css y page.css: interacciones, formulario y arranque

### 14.1 Pequeñas interacciones

**La foto de "Más allá del código" toca un acorde de guitarra:**

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

**Tarjetas que se inclinan en 3D siguiendo el ratón** (solo con ratón y sin movimiento reducido):

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
card.addEventListener("pointerleave", function () { /* todo a 0 */ });
```

- `e.clientX/Y` es la posición del ratón en la ventana. Restando la posición de la tarjeta y dividiendo por su tamaño, `px` y `py` quedan entre 0 y 1 (0 = borde izquierdo/superior, 1 = derecho/inferior).
- Se convierten en ángulos de −5° a 5° y se pasan al CSS como **variables**. JS no toca el `transform` directamente: solo da números, y el CSS decide qué hacer con ellos:

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

  - `perspective(900px)` da profundidad: sin ella, girar en X o Y solo aplastaría la tarjeta. `rotateX`/`rotateY` la giran como si fuera una tarjeta física que empujas por el lado del ratón.
  - Un brillo circular (`::after`) sigue al ratón por encima de la tarjeta usando `--mx` y `--my`.
  - Al salir el ratón (`pointerleave`), todo vuelve a 0 con la transición.

**Las manchas de color del hero siguen un poco al ratón:**

```js
document.addEventListener("pointermove", function (e) {
  var dx = (e.clientX / innerWidth - 0.5) * 40, dy = (e.clientY / innerHeight - 0.5) * 40;
  field.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
}, { passive: true });
```

Se desplazan hasta 20 px hacia donde está el ratón (efecto *parallax*). `passive: true` indica al navegador que este listener nunca cancelará el evento, lo que le permite optimizar.

**La música se pausa al cambiar de pestaña:**

```js
var pausedByHide = false;
document.addEventListener("visibilitychange", function () {
  if (document.hidden && XP.Music.playing) { pausedByHide = true; XP.Music.stop(); }
  else if (!document.hidden && pausedByHide) { pausedByHide = false; XP.Music.start(); }
});
```

Solo la reanuda si fue esta función la que la paró (si el visitante la había apagado a mano, no la vuelve a encender).

### 14.2 El formulario de contacto

**Cómo llega un mensaje a tu correo.** Una web estática no puede enviar emails por sí misma (no hay servidor). Se usa **FormSubmit**, un servicio gratuito: recibe los datos del formulario en `https://formsubmit.co/ajax/luciaes.dev@gmail.com` y te los reenvía por email. La primera vez que se usó, FormSubmit te envió un correo de activación que tuviste que confirmar; desde entonces, cada mensaje llega solo.

**Leer un texto traducido del formulario:**

```js
function formText(key) {
  var all = window.TRANSLATIONS || {};
  var dict = all[XP.lang()] || all.en || {};
  return ((dict.contact || {}).form || {})[key] || "";
}
```

Cada `|| {}` evita un error si falta algún nivel.

**Enviar:**

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

- **`fetch`** hace una petición HTTP desde JavaScript, como `HttpClient.Post` en AL (fíjate en que el código AL de la intro hace justo eso). Recibe la dirección y las opciones:
  - `method: "POST"`: enviar datos;
  - `headers`: que el cuerpo va en JSON y que se espera JSON de vuelta;
  - `body`: los datos, convertidos a texto JSON con `JSON.stringify` (como `JsonObject.WriteTo` en AL).
- Los campos que empiezan por `_` son opciones de FormSubmit: el asunto del email ("Contacto desde el portfolio: Nombre"), el formato en tabla y desactivar su captcha. El campo `email` lo usa FormSubmit como dirección de respuesta: al darle a "Responder" en tu correo, contestas directamente al visitante.
- Es una **cadena de promesas**:
  1. Cuando llega la respuesta, se intenta leer como JSON; si la respuesta no es correcta (`r.ok` es falso si el código HTTP no es 2xx) o FormSubmit no confirma `success`, se **lanza un error** (`throw`), que salta directamente al `catch`.
  2. Si todo fue bien: se vacía el formulario y se muestra el mensaje de éxito.
  3. Si algo falló en cualquier punto (sin conexión, error del servicio…): mensaje de error.
  4. El último `then` se ejecuta siempre: se vuelve a activar el botón.
- Mientras se envía, el botón está desactivado (`disabled`) para evitar envíos dobles.

**Alternativa sin servicio:** si `contactFormEndpoint` fuera `null`, `openEmailApp` construye un enlace `mailto:` con asunto y cuerpo (`encodeURIComponent` codifica los espacios y caracteres especiales para que sean válidos en una URL) y lo abre: se abre el programa de correo del visitante con el mensaje ya escrito.

**Validar al enviar:**

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

- `e.preventDefault()`: por defecto, enviar un formulario **recarga la página**. Se cancela para hacerlo con `fetch` sin salir de la web.
- `form.elements` da acceso a los campos por su `name`. Se usa `form.elements.name` y no `form.name` porque `form.name` es una propiedad propia del formulario (su nombre), no el campo: es una trampa habitual cuando un campo se llama `name`.
- Si el honeypot `_gotcha` tiene algo, es un robot: se ignora sin decir nada.
- `trim()` quita espacios al principio y al final.
- La expresión regular del email comprueba el formato básico "algo@algo.algo" sin espacios: `^` inicio, `[^\s@]+` uno o más caracteres que no sean espacio ni @, `\.` un punto literal, `$` final.

**La animación de invitación al final de la página:**

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

- Cuando el formulario está visible al 55 %, espera 0,9 s y hace un pequeño **meneo** (`is-nudging`, dos vaivenes amortiguados de pocos píxeles), y después pasa a un estado de **llamada** tranquilo (`is-calling`): flota suavemente arriba y abajo, tiene un halo que respira y un reflejo que recorre el botón de enviar.
- `disconnect()`: solo ocurre una vez.
- En cuanto el visitante entra en un campo (`focusin`), `is-engaged` detiene las animaciones para no molestar mientras escribe.

En `contact.css`:

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

El meneo crece hacia el centro y se apaga hacia los extremos (−1, 3, −5, 5, −5, 5, −5, 3, −1), como algo que vibra y se detiene. El reflejo del botón es una franja diagonal semitransparente que cruza de izquierda a derecha; como el botón tiene `overflow: hidden`, solo se ve dentro de él. El diseño es de dos columnas (`grid-template-columns: 1fr 1fr`) que pasan a una por debajo de 900 px.

### 14.3 El arranque de la capa de experiencia

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

`page.js` es el último archivo y el que **pone todo en marcha**, en orden: primero los lienzos (partículas y onda), luego los controles (aún ocultos), la viñeta de voz, las interacciones, el formulario y, por último, la intro, a la que se le pasa como callback "cuando termines, muestra los controles".

`document.readyState` indica si el HTML aún se está leyendo (`"loading"`) o ya está listo. Si aún se está leyendo, espera a `DOMContentLoaded`; si ya está listo, arranca directamente. Así funciona en cualquier caso.

---

## 15. Los audios: cómo se procesaron y cómo se sincronizan

### 15.1 Procesado de la voz

Grabaste el mensaje en dos archivos `.m4a` (inglés y español). Para que sonara limpio, sin ruido y a un volumen cómodo, se procesó con **ffmpeg**, una herramienta de línea de comandos para audio y vídeo. Este comando reproduce la cadena utilizada:

```bash
ffmpeg -i en.m4a -af "silenceremove=start_periods=1:start_threshold=-45dB,\
highpass=f=80,lowpass=f=12000,afftdn=nf=-25,\
equalizer=f=3000:t=q:w=1.2:g=2,\
acompressor=threshold=-20dB:ratio=3:attack=10:release=150,\
aecho=0.8:0.5:40:0.12,\
loudnorm=I=-28:TP=-2:LRA=7" \
-ar 44100 -ac 1 -b:a 96k opening-en.mp3
```

`-af` aplica una **cadena de filtros**, uno tras otro, separados por comas (igual que los nodos de Web Audio):

| Filtro | Qué hace |
|---|---|
| `silenceremove` | Quita el silencio del principio, para que la voz empiece enseguida. |
| `highpass=f=80` | Elimina frecuencias por debajo de 80 Hz: zumbidos, golpes en el micrófono. |
| `lowpass=f=12000` | Elimina por encima de 12 kHz: siseo. |
| `afftdn=nf=-25` | **Reducción de ruido** (analiza el ruido de fondo y lo resta). |
| `equalizer=f=3000…g=2` | Realza un poco (+2 dB) la zona de 3 kHz, donde está la claridad de la voz. |
| `acompressor` | Comprime: iguala las partes más fuertes y más suaves de la voz. |
| `aecho=0.8:0.5:40:0.12` | Un eco muy corto y suave (40 ms, 12 %) que da sensación de sala, más natural. |
| `loudnorm=I=-28…` | **Normaliza el volumen** a −28 LUFS (una medida estándar de volumen percibido). Las plataformas de música usan unos −14 LUFS; −28 es bastante más bajo, a propósito, porque la voz no debe sobresaltar al visitante (se bajó en dos ocasiones respecto a la primera versión). |

Después: `-ar 44100` (frecuencia de muestreo), `-ac 1` (mono, suficiente para voz y la mitad de tamaño) y `-b:a 96k` (calidad del MP3). El resultado mide unos −29 LUFS, y en la web se reproduce además al 70 % (`XP.Voice.VOLUME`).

### 15.2 Sacar los tiempos de los subtítulos

Los tiempos de `openingCues` no se pusieron a ojo. Se detectaron automáticamente las **pausas** de la grabación:

```bash
ffmpeg -i opening-en.mp3 -af silencedetect=noise=-38dB:d=0.18 -f null -
```

`silencedetect` informa de cada tramo en que el volumen baja de −38 dB durante al menos 0,18 s:

```
silence_start: 0        silence_end: 0.234
silence_start: 2.285    silence_end: 2.715
silence_start: 5.625    silence_end: 6.306
…
```

Cada final de silencio es el inicio de una frase y cada inicio de silencio el final de la anterior. De ahí salen, con pequeños ajustes a oído, `[0.21, 2.33, "Hello, and welcome to my portfolio."]`, `[2.71, 5.77, "I'm Lucía Esteban…"]`, `[6.29, …]`, etc. Dentro de cada frase, las palabras se reparten por número de letras (13.3). Los pasos de la visita guiada (`openingTour`) usan los mismos inicios de frase, para que la página se mueva justo cuando nombras cada sección.

Si algún día regrabas el mensaje: procesas el audio con el primer comando, sacas los silencios con el segundo, actualizas los tiempos en `core.js` y subes `VERSION` en `XP.Voice` (para que los navegadores no usen la grabación antigua guardada en caché).

---

## 16. Publicación: Git, GitHub Pages y caché

### 16.1 GitHub Pages

El repositorio `LuciaEsteban/LuciaEsteban.github.io` tiene un nombre especial: `<usuario>.github.io`. GitHub publica automáticamente su contenido en `https://luciaesteban.github.io/`. Cada vez que se sube un cambio a la rama `main`, GitHub Actions (el sistema de automatización de GitHub) vuelve a publicar la web; tarda entre unos segundos y un par de minutos.

No hay que configurar servidor, dominio ni base de datos. Como la web es estática, GitHub solo tiene que servir los archivos tal cual.

### 16.2 El flujo de trabajo con Git

Git funciona igual que en tus proyectos de AL con Azure DevOps:

```bash
git add assets/js/experience/voice.js      # preparar los archivos cambiados
git commit -m "Voice tour: locked and eased scrolling"   # guardar una versión con un mensaje
git push origin main                        # subir a GitHub → se publica
```

También se pueden subir archivos desde la propia web de GitHub ("Add file → Upload files"), que es lo que se ha hecho durante este proyecto.

### 16.3 La caché y el `?v=`

Los navegadores guardan copias de los CSS, JS e imágenes para no descargarlos en cada visita. El problema: tras publicar un cambio, un visitante podría seguir usando la copia vieja. La solución es cambiar la dirección de los archivos en cada publicación:

```html
<script src="assets/js/experience/voice.js?v=202609231334"></script>
```

Todo lo que va detrás de `?` son parámetros que GitHub Pages ignora (sirve el mismo archivo), pero para el navegador es una dirección distinta, así que lo descarga de nuevo. El número es la fecha y hora de la publicación (año, mes, día, hora, minuto). **Regla: cada vez que cambies un CSS o JS, cambia el número en todos los `?v=` de `index.html`.** El audio tiene su propio número (`XP.Voice.VERSION`).

### 16.4 Cómo se probó

Para comprobar la web en muchos tamaños de pantalla sin tener todos esos dispositivos, se usó **Playwright**, una herramienta que controla un navegador Chrome desde un programa (en Python): abre la web con un tamaño concreto (de 360 px de móvil a 1920 px de PC), en modo claro y oscuro, hace clic en la burbuja y en la viñeta, intenta hacer scroll durante la visita guiada, comprueba que nada se sale de la pantalla y que el panel de subtítulos queda por encima de todo, y hace capturas de pantalla. Para probarla tú a mano, basta con las herramientas de desarrollador del navegador (F12), que tienen un modo que simula móviles (Ctrl+Mayús+M).

---

## 17. Cómo construir esta web desde cero, paso a paso

Este es el orden recomendado si quisieras rehacerla tú sola. Cada paso añade una capa y deja la web funcionando.

**Paso 1. Estructura mínima.** Crea `index.html` con el esqueleto (`<!DOCTYPE html>`, `<html>`, `<head>` con `charset` y `viewport`, `<body>`). Escribe todo el contenido en inglés con HTML semántico: `<header>` con el menú, `<main>` con un `<section id="…">` por apartado, y `<footer>`. Ábrelo en el navegador: se verá feo, pero estará todo.

**Paso 2. Estilos base.** Crea `styles.css` y enlázalo. Empieza por las variables (`:root { --color-… }`), el reset y el `.container`. Después, sección por sección: cabecera (`flex`), hero (`grid` de dos columnas), tarjetas (`grid` con `auto-fit`), línea de tiempo, contacto. Usa siempre `var(--…)` para los colores.

**Paso 3. Adaptación a móvil.** Añade las media queries (900, 760, 600 px). Prueba con el modo móvil de las herramientas de desarrollador. Añade el botón hamburguesa.

**Paso 4. Modo oscuro.** Añade el bloque `:root[data-theme="dark"]` con los colores oscuros y el script del `<head>` que pone `data-theme`. Añade el botón y su lógica en `main.js`.

**Paso 5. Idiomas.** Crea `i18n.js` con el objeto `TRANSLATIONS` (en/es). Marca los elementos con `data-i18n` y escribe `resolvePath` y `applyTranslations` en `main.js`. Añade los botones EN/ES y `localStorage`.

**Paso 6. Configuración y datos calculados.** Crea `config.js`. Programa `computeDuration` y los textos de experiencia, el año del pie y los enlaces de contacto.

**Paso 7. Animaciones de aparición y scrollspy.** Clase `.reveal` en CSS y los dos `IntersectionObserver` en `main.js`. Añade las reglas de `prefers-reduced-motion`.

**Paso 8. Publicar.** Crea el repositorio `<usuario>.github.io`, sube los archivos y comprueba la web en línea. A partir de aquí, publica después de cada paso.

**Paso 9. Base de la capa de experiencia.** Crea `core.js` con `window.XP`, `XP.lang`, `XP.t` y `XP.onLanguageChange`, y `page.js` con la función `boot`. Enlázalos después de `main.js`.

**Paso 10. Sonido.** Empieza por `XP.Sound` con solo el `AudioContext`, un `GainNode` maestro y el `pop`. Pruébalo con un botón. Luego añade el piano y el acorde. Después, la música: primero un acorde que se repite con `setInterval`, y cuando funcione, el programador con antelación, la progresión y los patrones.

**Paso 11. Intro.** Añade el HTML de la intro, `intro.css` (primero la burbuja estática, luego las animaciones) e `intro.js` (primero solo `enter`, luego la escritura, el selector de idioma y el código que cae).

**Paso 12. Lienzos.** `visuals.js`: primero `makeCanvas` y la onda; luego las partículas de una sola estación; luego las demás.

**Paso 13. Controles.** `controls.js` y `controls.css`: reproductor y botón de animación.

**Paso 14. Formulario.** HTML del formulario, `contact.css`, y en `page.js` la validación y el envío con `fetch`. Da de alta el formulario en FormSubmit enviando un primer mensaje de prueba.

**Paso 15. Voz.** Graba y procesa el audio (capítulo 15), añade `XP.Voice`, la viñeta y el panel de subtítulos. Cuando funcionen los subtítulos, añade la visita guiada con `Glide` y el bloqueo.

**Paso 16. Pulido.** Prueba en claro y oscuro, en móvil y en PC, con teclado (Tab, Enter, Escape) y con movimiento reducido activado en el sistema.

---

## 18. Glosario

| Término | Significado |
|---|---|
| **API** | Conjunto de funciones que ofrece algo para ser usado desde código. La "Web Audio API" es lo que el navegador ofrece para sonido. |
| **Atributo** | Dato extra de una etiqueta HTML: `class="…"`, `id="…"`. |
| **Breakpoint** | Ancho de pantalla en el que el diseño cambia (900, 760, 600 px). |
| **Bus** | En audio, un punto donde se juntan varias señales para tratarlas juntas. |
| **Caché** | Copia local de archivos que guarda el navegador para no descargarlos otra vez. |
| **Callback** | Función que se pasa a otra para que la llame más tarde. |
| **Canvas** | Elemento HTML en el que se dibuja píxel a píxel con código. |
| **Closure** | Función que recuerda las variables del lugar donde se creó. |
| **Contexto de apilamiento** | Grupo de capas cerrado: sus elementos no pueden mezclarse en profundidad con los de fuera. |
| **CSS** | Lenguaje de estilos: el aspecto de la web. |
| **Degradación elegante** | Que la web siga funcionando si falla algo "extra" (JS desactivado, navegador antiguo). |
| **DOM** | Árbol de objetos que el navegador construye a partir del HTML y que JS puede modificar. |
| **DPR** | *Device Pixel Ratio*: píxeles físicos por cada píxel CSS. |
| **Easing** | Curva de aceleración de una animación. |
| **Envolvente** | Cómo cambia el volumen de una nota con el tiempo (ataque y caída). |
| **Evento** | Algo que ocurre (clic, tecla, fin de audio) y a lo que el código se puede suscribir. |
| **fetch** | Función para hacer peticiones HTTP desde JavaScript. |
| **Hero** | Bloque principal al principio de una web. |
| **Honeypot** | Campo invisible que solo rellenan los robots, para detectar spam. |
| **HTML** | Lenguaje de marcado: el contenido y la estructura de la web. |
| **i18n** | Internacionalización: preparar la web para varios idiomas. |
| **IIFE** | Función que se define y se ejecuta al momento, para aislar variables. |
| **IntersectionObserver** | Herramienta del navegador que avisa cuando un elemento entra o sale de la pantalla. |
| **localStorage** | Almacén clave-valor del navegador que persiste entre visitas. |
| **LUFS** | Unidad estándar de volumen percibido de un audio. |
| **Media query** | Regla CSS que solo se aplica en ciertas condiciones (ancho, preferencias). |
| **MIDI** | Sistema que numera las notas musicales (60 = Do central, 69 = La 440 Hz). |
| **Namespace** | Objeto o paquete que agrupa nombres para que no choquen con otros. |
| **Nodo (audio)** | Módulo de Web Audio (oscilador, filtro, volumen…) que se conecta a otros. |
| **Promesa** | Objeto que representa un resultado que llegará más tarde. |
| **Pseudoelemento** | `::before` / `::after`: cajas extra que CSS crea sin tocar el HTML. |
| **requestAnimationFrame** | Pide ejecutar una función antes del siguiente fotograma de la pantalla. |
| **Responsive** | Diseño que se adapta a cualquier tamaño de pantalla. |
| **Scrollspy** | Resaltar en el menú la sección que se está viendo. |
| **Selector** | Parte de una regla CSS que indica a qué elementos se aplica. |
| **SVG** | Formato de dibujo vectorial escrito como código. |
| **Token de diseño** | Variable que guarda una decisión de diseño (un color, un radio…). |
| **Vanilla JS** | JavaScript sin librerías ni frameworks. |
| **Viewport** | La zona visible de la página en la ventana del navegador. |
| **z-index** | Orden de las capas: más alto, más encima. |

---

## 19. Preguntas de repaso

Si sabes responder a estas preguntas sin mirar, entiendes la web. Entre paréntesis, el capítulo donde está la respuesta.

1. ¿Por qué esta web puede alojarse gratis en GitHub Pages? ¿Qué parte sí depende de un servicio externo? (1.1, 14.2)
2. ¿Qué diferencia hay entre el HTML y el DOM? (2.1)
3. ¿Para qué sirven los atributos `data-*` y `aria-*`? Pon un ejemplo de cada uno usado en la web. (2.1)
4. ¿Cómo funciona el modo oscuro sin que ninguna regla de la web sepa en qué modo está? (4.2)
5. ¿Por qué el script que pone el tema está en el `<head>` y no en `main.js`? (3.2)
6. Explica qué hace `repeat(auto-fit, minmax(min(380px, 100%), 1fr))`. (4.7)
7. ¿Qué es una IIFE y por qué todos los archivos JS empiezan con una? (2.3)
8. ¿Cómo sabe el HTML qué texto traducido poner en cada sitio? Describe el recorrido desde el clic en "ES" hasta que cambia un título. (6.2, 7.2)
9. ¿Cómo se calcula tu tiempo de experiencia y por qué nunca hay que actualizarlo? (5, 7.6)
10. ¿Qué es un `IntersectionObserver` y para qué dos cosas se usa en `main.js`? (7.4, 7.5)
11. Compara `addEventListener` con un `EventSubscriber` de AL. (2.3)
12. ¿Por qué la música no puede empezar sola al abrir la web? (9.2)
13. Explica con tus palabras el circuito de audio: qué es un nodo, un bus y una envolvente. (9.1, 9.3)
14. ¿Por qué la música se programa con 250 ms de antelación en lugar de tocar cada nota con `setTimeout`? (9.7)
15. ¿Qué hace que la música vaya creciendo y no se repita exactamente? (9.7)
16. ¿Qué es el *ducking* y cuándo ocurre? (9.7)
17. ¿Por qué el lienzo se dibuja con un tamaño multiplicado por el DPR? (10.2)
18. ¿Por qué las partículas multiplican su movimiento por `dt`? (10.4)
19. ¿Cómo se consigue que el código AL caiga en un bucle sin saltos? (12.1)
20. Describe lo que pasa en los 1,4 segundos después de tocar la burbuja. (12.3)
21. ¿Por qué el panel de subtítulos está en `<body>` y no dentro de tu foto? (13.2)
22. ¿Cómo se decide cuándo se ilumina cada palabra de los subtítulos? (13.3, 13.4)
23. ¿Por qué el scroll de la visita guiada es propio y no el del navegador? ¿Qué es *easeInOutCubic*? (13.6)
24. ¿Cómo se bloquea el scroll durante la visita, y por qué hacen falta `passive: false` y `capture: true`? (13.6)
25. ¿Por qué se llama a `e.stopPropagation()` al tocar la viñeta? (13.7)
26. ¿Qué es el honeypot y cómo detecta el spam? (3.8, 14.2)
27. Describe la cadena de promesas del envío del formulario. ¿Qué pasa si no hay internet? (14.2)
28. ¿Para qué sirve el `?v=` en los enlaces a CSS y JS? (16.3)
29. ¿Cómo se sacaron los tiempos de los subtítulos? (15.2)
30. Si quisieras añadir una sección nueva "Certificaciones" con su enlace en el menú, ¿qué archivos tocarías y qué añadirías en cada uno? (3, 4, 6, y 8.3 si quisieras incluirla en la visita guiada)
