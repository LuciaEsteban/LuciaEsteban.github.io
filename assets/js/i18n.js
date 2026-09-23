/**
 * Bilingual content (English / Spanish).
 *
 * Every user-facing string lives here so the whole site can be
 * translated from one place instead of duplicating pages. Elements in
 * index.html are tagged with `data-i18n="path.to.key"` (text content)
 * or `data-i18n-attr="attr:path.to.key"` (an attribute value). See
 * assets/js/main.js for how these are applied.
 */
window.TRANSLATIONS = {
  en: {
    meta: {
      title: "Lucía Esteban — Microsoft Dynamics 365 Business Central / AL Developer",
      description:
        "Portfolio of Lucía Esteban Peña, Microsoft Dynamics 365 Business Central / AL Developer — AL development, RDLC reporting, implementations, migrations and integrations.",
    },
    skipLink: "Skip to main content",
    nav: {
      expertise: "Business Central",
      ecosystem: "Ecosystem",
      ai: "AI",
      journey: "Journey",
      about: "About",
      contact: "Contact",
      langToggleLabel: "Switch language",
      themeToggleLabel: "Toggle dark mode",
    },
    hero: {
      eyebrow: "Portfolio",
      name: "Lucía Esteban Peña",
      role: "Microsoft Dynamics 365 Business Central / AL Developer",
      tagline:
        "I build and maintain <strong>AL extensions, business reports and integrations</strong> for Microsoft Dynamics 365 Business Central — across SaaS and On-Premise environments.",
      badgeRemote: "100% remote",
      badgeLanguages: "English & Spanish",
      availability:
        "Currently looking for a fully remote role — and for me that means staying <strong>closely involved with a team</strong>, not working off on my own: I want to keep driving projects forward together with the people I work with.",
      ctaPrimary: "Explore my Business Central work",
      ctaSecondary: "Get in touch",
      photoAlt: "Portrait photo of Lucía Esteban Peña",
      scrollHint: "Scroll to explore",
    },
    expertise: {
      eyebrow: "Core capability",
      title: "Business Central expertise",
      introBeforeDuration: "I've been working professionally with Business Central / AL, in a consultancy environment, since March 2025 — ",
      introAfterDuration:
        " so far. In that time I've covered new implementations, migrations and upgrades, reporting, and integrations, across SaaS and On-Premise environments.",
      items: {
        al: {
          title: "AL Development & Extensions",
          body:
            "This is <strong>the core of my day-to-day work</strong>: building and maintaining AL extensions for Business Central — tables, pages, page extensions, codeunits, events and subscribers. It's where business requirements become working functionality.",
        },
        reports: {
          title: "Reporting (AL + RDLC)",
          body:
            "I build business reports combining AL datasets with RDLC layouts: the multipage commercial documents a company sends to its customers and suppliers. Getting them right takes more than a template — conditional logic, totals, taxes and layout details that <strong>have to hold up in production</strong>. I've also put together multi-sheet Excel reports, for cases where the client needed a working document rather than a commercial one.",
        },
        implementations: {
          title: "New Implementations & Upgrades",
          body:
            "I've <strong>worked on both sides of a Business Central rollout</strong>: new implementations built from scratch, and migrations and upgrades between versions, with exposure to NAV/BC14, BC21, BC25 and BC28. Each one poses different challenges — from configuring a solution from zero to keeping existing customizations working after an upgrade.",
        },
        integrations: {
          title: "Integrations & APIs",
          body:
            "Business Central rarely works in isolation. I build the connections that let it exchange data with other systems — APIs, Web Services, XML, JSON and XMLPorts — so information <strong>moves reliably between Business Central and the systems it needs to talk to</strong>.",
        },
        saas: {
          title: "SaaS & On-Premise",
          body:
            "I've <strong>worked hands-on with both deployment models</strong> and know how their constraints differ in practice — from what SaaS does and doesn't allow, to the particulars of keeping an On-Premise environment running. That includes working across different Business Central versions, updating code to the target version as part of each migration.",
        },
        tooling: {
          title: "Development Environment & Way of Working",
          body:
            "I work in VS Code with the AL Language extension, across multi-project workspaces — but what I care about most is how I get there. I start by <strong>listening to the idea or requirement</strong> and sketching out the structure before writing a single line, then <strong>checking it against the functional specification</strong> — or directly with the client when needed — before moving into development. I track the work as an issue and run it through <strong>Git with pull requests</strong>, which keeps me in sync with the rest of the team and leaves a clear trail — useful both for future improvements and for troubleshooting down the line.",
        },
      },
    },
    ecosystem: {
      eyebrow: "Technology map",
      title: "Technology ecosystem",
      intro:
        "<strong>Business Central and AL are at the center of what I do.</strong> Everything else here is a supporting technology I use around them — not a separate specialization. I'm always open to picking up new languages and tools as a project needs them.",
      core: {
        title: "Core",
        items: [
          "Business Central",
          "AL",
          "Extensions",
          "Reports / RDLC",
          "VS Code",
          "SaaS / On-Premise",
          "Git / Azure DevOps",
        ],
      },
      professional: {
        title: "Professional exposure",
        items: [
          "SQL Server",
          "PowerShell",
          "Docker",
          "APIs / Web Services",
          "XML",
          "JSON",
          "XMLPorts",
          "Migrations / Upgrades",
        ],
      },
      additional: {
        title: "Additional / academic",
        items: ["Java", "HTML / CSS", "Introductory C", "Introductory Python"],
      },
    },
    experience: {
      // Display copy for this now lives under `journey` below — these four
      // are kept here because durationParts() in main.js builds its key
      // from "experience.years"/"experience.months" at runtime.
      years_one: "{n} year",
      years_other: "{n} years",
      months_one: "{n} month",
      months_other: "{n} months",
      lessThanAMonth: "just getting started",
      conjunction: "and",
    },
    ai: {
      eyebrow: "Looking ahead",
      title: "Exploring AI",
      intro:
        "AI is changing how software is built, and Business Central is no exception. I'd rather <strong>understand it and grow with it</strong> than watch from the sidelines — so I follow how it's evolving and look for ways to put it to good use in my work.",
      items: {
        judgement: {
          title: "My own judgement first",
          body: "AI is a tool, not a substitute for knowing what I'm doing. I rely on my own understanding of AL, Business Central and the business behind each requirement — and that's exactly what lets me tell a good suggestion from a bad one.",
        },
        adapting: {
          title: "Adapting as it grows",
          body: "I keep up with how AI tools evolve and try them where they add real value, so I can make the most of each step forward instead of falling behind it.",
        },
        learning: {
          title: "Still learning",
          body: "That's also why I keep studying: the stronger my foundations, the better I can use AI — and the more I have to offer beyond it.",
        },
      },
    },
    journey: {
      eyebrow: "Trajectory",
      title: "Experience & education",
      intro:
        "My professional path, together with the formal education that has run alongside it.",
      items: {
        electronics: {
          tag: "Education",
          title: "Electronics and Industrial Automation Engineering",
          meta: "2 years completed — Universidad Politécnica de Alcalá",
          body: "Switched tracks into software development from here, which continued through DAM and further technical education.",
        },
        dam: {
          tag: "Education",
          title: "Higher Technician in Multiplatform Application Development (DAM)",
          meta: "Completed",
          body: "Higher Vocational Training in software development.",
        },
        professional: {
          tag: "Professional",
          role: "Microsoft Dynamics 365 Business Central / AL Developer",
          companyFallback: "Currently working professionally with Business Central",
          versions: "Exposure to NAV/BC14, BC21, BC25 and BC28",
        },
        unir: {
          tag: "Education — in progress",
          title: "Computer Engineering — UNIR",
          body:
            "An online degree, chosen specifically to fit alongside full-time work, with part of it recognized from previous studies. I follow it at a steady, sustainable pace that works around the job.",
        },
      },
    },
    about: {
      eyebrow: "Get to know me",
      title: "About me",
      paragraphs: [
        "I like working with people, sharing ideas with other developers and consultants, and I'm just as happy figuring things out on my own sometimes. What really gets me going is <strong>a genuine challenge</strong>: a problem that makes me want to dig in and actually understand it, not just patch it.",
        "I'm organized and open-minded, and that doesn't make me any less decisive. I like keeping things clear and on track, while staying open to a better way of doing something, and I'm comfortable making a call when one is needed.",
        "I like learning, and I like contributing more than what's strictly expected of me: <strong>going a bit further than a task asks for</strong> when I can. I also value constructive feedback, because I know there's no growing without it, even though that doesn't stop me wanting to leave every task as well done as I can. I'm still growing as a developer, and I know that every day I can offer a little more than I did the day before.",
        "Alongside my job, I'm studying Computer Engineering online. I chose an online program precisely so I could combine it with full-time work: I take it at a steady pace that fits around my projects, which lets me keep strengthening my foundations without stepping back from real, day-to-day work.",
      ],
    },
    beyond: {
      eyebrow: "Beyond the code",
      title: "Beyond the code",
      body:
        "Outside of Business Central, I enjoy music and play guitar, and I like leaving room for reading and drawing. It's a creative side I keep working on, and one that shows up in how I approach problems when I code. I also love meeting up with people over coffee: being there for the hard moments and celebrating the good ones together.",
      guitarAlt: "Placeholder for a photo of Lucía with her guitar",
    },
    contact: {
      eyebrow: "Let's talk",
      title: "Contact",
      intro:
        "I'm currently in my role and I value it, but I'm open to a change if it's a genuinely <strong>good fit for where I want to go</strong> — not out of necessity, just because it works well for both sides. If my profile could be a good fit for your team or project, I'd be happy to hear from you.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      cv: "Download CV",
      emailUnavailable: "Email coming soon",
      linkedinUnavailable: "LinkedIn coming soon",
      cvUnavailable: "CV coming soon",
      form: {
        title: "Send me a message",
        name: "Name",
        email: "Email",
        company: "Company (optional)",
        message: "Message",
        send: "Send message",
        sending: "Sending…",
        success: "Thank you! Your message has been sent — I'll get back to you soon.",
        mailto: "Your email app should open with the message ready to send.",
        error: "Something went wrong. Please try again or write to me directly by email.",
        missing: "Please fill in your name, email and message.",
        invalidEmail: "Please enter a valid email address.",
        subject: "Portfolio contact",
      },
      backToTop: "Back to top",
    },
    footer: {
      rights: "All rights reserved.",
      builtWith: "Designed and built by Lucía Esteban.",
    },
  },

  es: {
    meta: {
      title: "Lucía Esteban — Desarrolladora Microsoft Dynamics 365 Business Central / AL",
      description:
        "Portfolio de Lucía Esteban Peña, desarrolladora de Microsoft Dynamics 365 Business Central / AL — desarrollo AL, informes RDLC, implantaciones, migraciones e integraciones.",
    },
    skipLink: "Ir al contenido principal",
    nav: {
      expertise: "Business Central",
      ecosystem: "Ecosistema",
      ai: "IA",
      journey: "Trayectoria",
      about: "Sobre mí",
      contact: "Contacto",
      langToggleLabel: "Cambiar idioma",
      themeToggleLabel: "Cambiar a modo oscuro",
    },
    hero: {
      eyebrow: "Portfolio",
      name: "Lucía Esteban Peña",
      role: "Desarrolladora Microsoft Dynamics 365 Business Central / AL",
      tagline:
        "Desarrollo y mantengo <strong>extensiones AL, informes de negocio e integraciones</strong> para Microsoft Dynamics 365 Business Central, en entornos SaaS y On-Premise.",
      badgeRemote: "100% remoto",
      badgeLanguages: "Inglés y español",
      availability:
        "Actualmente estoy interesada en un puesto 100% en remoto — y para mí eso significa seguir <strong>muy implicada con el equipo</strong>, no trabajar a mi aire: quiero seguir llevando los proyectos adelante junto a las personas con las que trabajo.",
      ctaPrimary: "Ver mi trabajo en Business Central",
      ctaSecondary: "Contactar",
      photoAlt: "Fotografía de retrato de Lucía Esteban Peña",
      scrollHint: "Desplázate para explorar",
    },
    expertise: {
      eyebrow: "Capacidad principal",
      title: "Experiencia en Business Central",
      introBeforeDuration: "Trabajo profesionalmente con Business Central / AL, en el ámbito de la consultoría, desde marzo de 2025 — ",
      introAfterDuration:
        " hasta ahora. En este tiempo he trabajado en implantaciones nuevas, migraciones y actualizaciones, informes e integraciones, tanto en entornos SaaS como On-Premise.",
      items: {
        al: {
          title: "Desarrollo AL y extensiones",
          body:
            "Es <strong>el núcleo de mi trabajo diario</strong>: desarrollar y mantener extensiones AL para Business Central —tablas, páginas, page extensions, codeunits, eventos y subscribers—. Aquí es donde los requisitos de negocio se convierten en funcionalidad real.",
        },
        reports: {
          title: "Informes (AL + RDLC)",
          body:
            "Construyo informes de negocio combinando datasets AL con layouts RDLC: los documentos comerciales multipágina que una empresa envía a sus clientes y proveedores. Hacerlo bien exige más que una plantilla: lógica condicional, totales, impuestos y detalles de maquetación que <strong>deben funcionar en producción</strong>. También he preparado informes en Excel con varias hojas, para casos en los que lo que necesitaba el cliente era un documento de trabajo y no un documento comercial.",
        },
        implementations: {
          title: "Implantaciones nuevas y upgrades",
          body:
            "He <strong>trabajado en las dos caras de un proyecto de Business Central</strong>: implantaciones nuevas desde cero y migraciones o actualizaciones entre versiones, con exposición a NAV/BC14, BC21, BC25 y BC28. Cada una plantea retos distintos, desde configurar una solución desde cero hasta mantener las personalizaciones existentes tras un upgrade.",
        },
        integrations: {
          title: "Integraciones y APIs",
          body:
            "Business Central rara vez trabaja aislado. Construyo las conexiones que le permiten intercambiar datos con otros sistemas —APIs, Web Services, XML, JSON y XMLPorts— para que la información <strong>se mueva de forma fiable entre Business Central y los sistemas con los que necesita comunicarse</strong>.",
        },
        saas: {
          title: "SaaS y On-Premise",
          body:
            "He <strong>trabajado de forma práctica con ambos modelos de despliegue</strong> y conozco cómo difieren sus restricciones: desde lo que SaaS permite y lo que no, hasta las particularidades de mantener en marcha un entorno On-Premise. Esto incluye haber trabajado sobre distintas versiones de Business Central, actualizando código a la versión correspondiente en cada migración.",
        },
        tooling: {
          title: "Entorno de desarrollo y forma de trabajar",
          body:
            "Trabajo en VS Code con la extensión AL Language, en workspaces multiproyecto — pero lo que más cuido es cómo llego hasta ahí. Empiezo <strong>escuchando la idea o el requisito</strong> y sacando la estructura antes de escribir una sola línea, y luego la <strong>contrasto con el funcional</strong> —o directamente con el cliente cuando hace falta— antes de pasar a desarrollo. Registro el trabajo como incidencia y lo llevo con <strong>Git y pull requests</strong>, lo que me mantiene compenetrada con el resto del equipo y deja un seguimiento claro de todo, útil tanto para futuras mejoras como para resolver incidencias más adelante.",
        },
      },
    },
    ecosystem: {
      eyebrow: "Mapa tecnológico",
      title: "Ecosistema tecnológico",
      intro:
        "<strong>Business Central y AL están en el centro de lo que hago.</strong> Todo lo demás aquí es una tecnología de apoyo que uso a su alrededor, no una especialización aparte. Siempre estoy abierta a aprender nuevos lenguajes y herramientas según lo pida el proyecto.",
      core: {
        title: "Núcleo",
        items: [
          "Business Central",
          "AL",
          "Extensiones",
          "Informes / RDLC",
          "VS Code",
          "SaaS / On-Premise",
          "Git / Azure DevOps",
        ],
      },
      professional: {
        title: "Exposición profesional",
        items: [
          "SQL Server",
          "PowerShell",
          "Docker",
          "APIs / Web Services",
          "XML",
          "JSON",
          "XMLPorts",
          "Migraciones / Upgrades",
        ],
      },
      additional: {
        title: "Adicional / académico",
        items: ["Java", "HTML / CSS", "Nociones de C", "Nociones de Python"],
      },
    },
    experience: {
      years_one: "{n} año",
      years_other: "{n} años",
      months_one: "{n} mes",
      months_other: "{n} meses",
      lessThanAMonth: "recién empezando",
      conjunction: "y",
    },
    ai: {
      eyebrow: "Mirando adelante",
      title: "Explorando la IA",
      intro:
        "La IA está cambiando la forma de desarrollar software, y Business Central no es una excepción. Prefiero <strong>entenderla y crecer con ella</strong> antes que verla desde fuera — por eso sigo de cerca cómo evoluciona y busco formas de aprovecharla bien en mi trabajo.",
      items: {
        judgement: {
          title: "Primero, mi propio criterio",
          body: "La IA es una herramienta, no un sustituto de saber lo que hago. Me apoyo en lo que conozco de AL, de Business Central y del negocio que hay detrás de cada requisito — y eso es justo lo que me permite distinguir una buena sugerencia de una mala.",
        },
        adapting: {
          title: "Adaptarme a su crecimiento",
          body: "Sigo cómo evolucionan las herramientas de IA y las pruebo allí donde aportan valor real, para sacar partido de cada avance en lugar de quedarme atrás.",
        },
        learning: {
          title: "Seguir aprendiendo",
          body: "Por eso también sigo estudiando: cuanto más sólidas son mis bases, mejor puedo aprovechar la IA — y más puedo aportar más allá de ella.",
        },
      },
    },
    journey: {
      eyebrow: "Trayectoria",
      title: "Experiencia y formación",
      intro:
        "Mi recorrido profesional, junto a la formación que lo ha acompañado.",
      items: {
        electronics: {
          tag: "Formación",
          title: "Ingeniería Electrónica Automática Industrial",
          meta: "2 años completados — Universidad Politécnica de Alcalá",
          body: "Desde aquí cambié de rama hacia el desarrollo de software, que continué después con el DAM y más formación técnica.",
        },
        dam: {
          tag: "Formación",
          title: "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
          meta: "Completado",
          body: "Ciclo Formativo de Grado Superior en desarrollo de software.",
        },
        professional: {
          tag: "Profesional",
          role: "Desarrolladora Microsoft Dynamics 365 Business Central / AL",
          companyFallback: "Actualmente trabajando profesionalmente con Business Central",
          versions: "Exposición a NAV/BC14, BC21, BC25 y BC28",
        },
        unir: {
          tag: "Formación — en curso",
          title: "Ingeniería Informática — UNIR",
          body:
            "Una carrera online, elegida precisamente para compatibilizarla con el trabajo a tiempo completo, con parte ya reconocida de estudios previos. La sigo a un ritmo constante y sostenible, que encaja con el trabajo.",
        },
      },
    },
    about: {
      eyebrow: "Conóceme",
      title: "Sobre mí",
      paragraphs: [
        "Me gusta trabajar con gente, compartir ideas con otros desarrolladores y consultores, y también disfruto resolviendo cosas por mi cuenta en ciertos momentos. Lo que de verdad me engancha es <strong>un reto real</strong>: un problema que me hace querer meterme a fondo y entenderlo bien, no solo parchearlo.",
        "Soy organizada y de mente abierta, y eso no me hace menos decidida. Me gusta tener las cosas claras y encaminadas, sin dejar de estar abierta a una forma mejor de hacer algo, y no me cuesta tomar una decisión cuando hace falta.",
        "Me gusta aprender, y me gusta aportar más de lo que se espera de mí: <strong>ir un poco más allá de lo que pide la tarea</strong> cuando puedo. También valoro las críticas constructivas, porque sé que sin ellas no se puede crecer, aunque eso no quita que me guste dejar cada tarea lo mejor hecha posible. Todavía estoy en desarrollo como profesional, y sé que cada día puedo ofrecer un poco más que el día anterior.",
        "Compagino mi trabajo con el Grado en Ingeniería Informática, que estudio online. Elegí una carrera online precisamente para poder compatibilizarla con el trabajo a tiempo completo: la llevo a un ritmo constante que encaja con mis proyectos, y eso me permite seguir reforzando mis bases sin apartarme del trabajo real del día a día.",
      ],
    },
    beyond: {
      eyebrow: "Más allá del código",
      title: "Más allá del código",
      body:
        "Fuera de Business Central, me gusta la música y toco la guitarra, y procuro dejar espacio para leer y dibujar. Es un lado creativo que sigo cultivando, y que también asoma en cómo planteo las soluciones cuando programo. También me encanta quedar con la gente a tomar un café: acompañar en los momentos difíciles y celebrar juntos los logros importantes.",
      guitarAlt: "Marcador de posición para una fotografía de Lucía con su guitarra",
    },
    contact: {
      eyebrow: "Hablemos",
      title: "Contacto",
      intro:
        "Actualmente sigo en mi puesto y lo valoro, pero estoy abierta a un cambio si encaja de verdad con <strong>lo que busco a futuro</strong> — no por necesidad, sino porque el encaje sea bueno para las dos partes. Si mi perfil pudiera encajar bien en tu equipo o proyecto, me encantaría saber de ti.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      cv: "Descargar CV",
      emailUnavailable: "Email próximamente",
      linkedinUnavailable: "LinkedIn próximamente",
      cvUnavailable: "CV próximamente",
      form: {
        title: "Envíame un mensaje",
        name: "Nombre",
        email: "Email",
        company: "Empresa (opcional)",
        message: "Mensaje",
        send: "Enviar mensaje",
        sending: "Enviando…",
        success: "¡Gracias! Tu mensaje se ha enviado — te responderé pronto.",
        mailto: "Se abrirá tu aplicación de correo con el mensaje listo para enviar.",
        error: "Algo ha fallado. Inténtalo de nuevo o escríbeme directamente por email.",
        missing: "Por favor, rellena tu nombre, email y mensaje.",
        invalidEmail: "Por favor, introduce un email válido.",
        subject: "Contacto desde el portfolio",
      },
      backToTop: "Volver arriba",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      builtWith: "Diseñada y construida por Lucía Esteban.",
    },
  },
};
