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
      title: "Lucía Esteban | Microsoft Dynamics 365 Business Central / AL Developer",
      description:
        "Portfolio of Lucía Esteban Peña, Microsoft Dynamics 365 Business Central / AL Developer: AL development, RDLC reporting, implementations, migrations and integrations.",
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
        "I build and maintain <strong>AL extensions, business reports and integrations</strong> for Microsoft Dynamics 365 Business Central, across SaaS and On-Premise environments.",
      badgeRemote: "100% remote",
      badgeLanguages: "English & Spanish",
      availability:
        "Open to fully remote opportunities. For me, remote work means staying <strong>closely involved with the team</strong> and moving projects forward together with the people I work with.",
      ctaPrimary: "Explore my Business Central work",
      ctaSecondary: "Get in touch",
      photoAlt: "Portrait photo of Lucía Esteban Peña",
      scrollHint: "Scroll to explore",
    },
    expertise: {
      eyebrow: "Core capability",
      title: "Business Central expertise",
      introBeforeDuration: "I have been working professionally with Business Central / AL in a consultancy environment since March 2025, which adds up to ",
      introAfterDuration:
        " so far. In that time I've covered new implementations, migrations and upgrades, reporting, and integrations, across SaaS and On-Premise environments.",
      items: {
        al: {
          title: "AL Development & Extensions",
          body:
            "This is <strong>the core of my day-to-day work</strong>: building and maintaining AL extensions for Business Central: tables, pages, page extensions, codeunits, events and subscribers. It's where business requirements become working functionality.",
        },
        reports: {
          title: "Reporting (AL + RDLC)",
          body:
            "I build business reports combining AL datasets with RDLC layouts: the multipage commercial documents a company sends to its customers and suppliers. Getting them right takes more than a template: conditional logic, totals, taxes and layout details that <strong>have to hold up in production</strong>. I have also developed multi-sheet Excel reports for cases where the client needed a working document rather than a commercial one.",
        },
        implementations: {
          title: "New Implementations & Upgrades",
          body:
            "I've <strong>worked on both sides of a Business Central rollout</strong>: new implementations built from scratch, and migrations and upgrades between versions, with exposure to NAV/BC14, BC21, BC25 and BC28. Each one poses different challenges, from configuring a solution from zero to keeping existing customizations working after an upgrade.",
        },
        integrations: {
          title: "Integrations & APIs",
          body:
            "Business Central rarely works in isolation. I build the connections that let it exchange data with other systems (APIs, Web Services, XML, JSON and XMLPorts), so information <strong>moves reliably between Business Central and the systems it needs to talk to</strong>.",
        },
        saas: {
          title: "SaaS & On-Premise",
          body:
            "I've <strong>worked hands-on with both deployment models</strong> and know how their constraints differ in practice, from what SaaS does and doesn't allow, to the particulars of keeping an On-Premise environment running. That includes working across different Business Central versions, updating code to the target version as part of each migration.",
        },
        tooling: {
          title: "Development Environment & Way of Working",
          body:
            "I work in VS Code with the AL Language extension, across multi-project workspaces, but what I care about most is how I get there. I start by <strong>understanding the idea or requirement</strong> and defining the structure before writing any code, then <strong>validating it against the functional specification</strong>, or directly with the client when needed, before moving into development. I track each piece of work as an issue and manage it through <strong>Git with pull requests</strong>, which keeps me aligned with the rest of the team and leaves a clear record, useful both for future improvements and for later troubleshooting.",
        },
      },
    },
    ecosystem: {
      eyebrow: "Technology map",
      title: "Technology ecosystem",
      intro:
        "<strong>Business Central and AL are at the center of what I do.</strong> Everything else here is a supporting technology I use around them, not a separate specialization. I am always open to learning new languages and tools as each project requires.",
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
      // Display copy for this now lives under `journey` below; these four
      // are kept here because durationParts() in main.js builds its key
      // from "experience.years"/"experience.months" at runtime.
      years_one: "{n} year",
      years_other: "{n} years",
      months_one: "{n} month",
      months_other: "{n} months",
      lessThanAMonth: "less than a month",
      conjunction: "and",
    },
    ai: {
      eyebrow: "Looking ahead",
      title: "AI in my work",
      intro:
        "I use AI and keep exploring it in my work. I see it as a tool and as part of the future of our field: it is changing the way we work, but <strong>it is not a substitute for the work itself</strong>. That is why I make the most of it without setting aside my studies, my foundations or my own judgement.",
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
          meta: "2 years completed, Universidad Politécnica de Alcalá",
          body: "From here I moved into software development, a path I continued through the DAM qualification and further technical training.",
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
          since: "Since {year}",
        },
        unir: {
          tag: "Education (in progress)",
          title: "Computer Engineering, UNIR",
          body:
            "An online degree, chosen specifically to fit alongside full-time work, with part of it recognized from previous studies. I follow it at a steady, sustainable pace that works around the job.",
        },
      },
    },
    about: {
      eyebrow: "Get to know me",
      title: "About me",
      paragraphs: [
        "I enjoy working with people and sharing ideas with other developers and consultants, and I am equally comfortable working through problems independently when the situation calls for it. What motivates me most is <strong>a real challenge</strong>: a problem worth understanding in depth, rather than simply patching.",
        "I am organized and open-minded, while also being decisive. I like to keep work clear and on track, remain open to better ways of doing things, and make decisions with confidence when they are needed.",
        "I enjoy learning and contributing beyond what is strictly expected: <strong>going a step further than a task requires</strong> whenever I can. I value constructive feedback as an essential part of professional growth, while always aiming to deliver every task to the highest standard. I see my development as continuous, and I aim to bring a little more to each project.",
        "Alongside my job, I'm studying Computer Engineering online. I chose an online program precisely so I could combine it with full-time work: I take it at a steady pace that fits around my projects, which lets me keep strengthening my foundations without stepping back from real, day-to-day work.",
      ],
    },
    beyond: {
      eyebrow: "Beyond the code",
      title: "Beyond the code",
      body:
        "Outside of Business Central, I enjoy music and play the guitar, and I make time for reading and drawing. It is a creative side I continue to develop, and it is reflected in how I approach problems when I code. I also value time with the people around me: supporting them in difficult moments and celebrating achievements together.",
      guitarAlt: "Placeholder for a photo of Lucía with her guitar",
    },
    contact: {
      eyebrow: "Let's talk",
      title: "Contact",
      intro:
        "I value my current role, and I am open to new opportunities that are a <strong>strong fit for my professional goals</strong> and beneficial for both sides. If my profile could be a good fit for your team or project, I would be glad to hear from you.",
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
        success: "Thank you, your message has been sent. I will get back to you shortly.",
        mailto: "Your email app should open with the message ready to send.",
        error: "The message could not be sent. Please try again or contact me directly by email.",
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
      title: "Lucía Esteban | Desarrolladora Microsoft Dynamics 365 Business Central / AL",
      description:
        "Portfolio de Lucía Esteban Peña, desarrolladora de Microsoft Dynamics 365 Business Central / AL: desarrollo AL, informes RDLC, implantaciones, migraciones e integraciones.",
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
        "Abierta a oportunidades 100% en remoto. Para mí, trabajar en remoto significa mantenerme <strong>muy implicada con el equipo</strong> y sacar adelante los proyectos junto a las personas con las que trabajo.",
      ctaPrimary: "Ver mi trabajo en Business Central",
      ctaSecondary: "Contactar",
      photoAlt: "Fotografía de retrato de Lucía Esteban Peña",
      scrollHint: "Desplázate para explorar",
    },
    expertise: {
      eyebrow: "Capacidad principal",
      title: "Experiencia en Business Central",
      introBeforeDuration: "Trabajo profesionalmente con Business Central / AL, en el ámbito de la consultoría, desde marzo de 2025, lo que suma ",
      introAfterDuration:
        " hasta ahora. En este tiempo he trabajado en implantaciones nuevas, migraciones y actualizaciones, informes e integraciones, tanto en entornos SaaS como On-Premise.",
      items: {
        al: {
          title: "Desarrollo AL y extensiones",
          body:
            "Es <strong>el núcleo de mi trabajo diario</strong>: desarrollar y mantener extensiones AL para Business Central: tablas, páginas, page extensions, codeunits, eventos y subscribers. Aquí es donde los requisitos de negocio se convierten en funcionalidad real.",
        },
        reports: {
          title: "Informes (AL + RDLC)",
          body:
            "Construyo informes de negocio combinando datasets AL con layouts RDLC: los documentos comerciales multipágina que una empresa envía a sus clientes y proveedores. Hacerlo bien exige más que una plantilla: lógica condicional, totales, impuestos y detalles de maquetación que <strong>deben funcionar en producción</strong>. También he desarrollado informes en Excel con varias hojas para casos en los que el cliente necesitaba un documento de trabajo en lugar de un documento comercial.",
        },
        implementations: {
          title: "Implantaciones nuevas y upgrades",
          body:
            "He <strong>trabajado en las dos caras de un proyecto de Business Central</strong>: implantaciones nuevas desde cero y migraciones o actualizaciones entre versiones, con exposición a NAV/BC14, BC21, BC25 y BC28. Cada una plantea retos distintos, desde configurar una solución desde cero hasta mantener las personalizaciones existentes tras un upgrade.",
        },
        integrations: {
          title: "Integraciones y APIs",
          body:
            "Business Central rara vez trabaja aislado. Construyo las conexiones que le permiten intercambiar datos con otros sistemas (APIs, Web Services, XML, JSON y XMLPorts) para que la información <strong>se mueva de forma fiable entre Business Central y los sistemas con los que necesita comunicarse</strong>.",
        },
        saas: {
          title: "SaaS y On-Premise",
          body:
            "He <strong>trabajado de forma práctica con ambos modelos de despliegue</strong> y conozco cómo difieren sus restricciones: desde lo que SaaS permite y lo que no, hasta las particularidades de mantener en marcha un entorno On-Premise. Esto incluye haber trabajado sobre distintas versiones de Business Central, actualizando código a la versión correspondiente en cada migración.",
        },
        tooling: {
          title: "Entorno de desarrollo y forma de trabajar",
          body:
            "Trabajo en VS Code con la extensión AL Language, en workspaces multiproyecto, pero lo que más cuido es cómo llego hasta ahí. Empiezo <strong>analizando la idea o el requisito</strong> y definiendo la estructura antes de escribir código, y después la <strong>valido con el análisis funcional</strong>, o directamente con el cliente cuando es necesario, antes de pasar a desarrollo. Registro cada tarea como incidencia y la gestiono con <strong>Git y pull requests</strong>, lo que me mantiene coordinada con el resto del equipo y deja un registro claro, útil tanto para futuras mejoras como para resolver incidencias más adelante.",
        },
      },
    },
    ecosystem: {
      eyebrow: "Mapa tecnológico",
      title: "Ecosistema tecnológico",
      intro:
        "<strong>Business Central y AL están en el centro de lo que hago.</strong> Todo lo demás aquí es una tecnología de apoyo que uso a su alrededor, no una especialización aparte. Siempre estoy abierta a aprender nuevos lenguajes y herramientas según lo requiera cada proyecto.",
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
      lessThanAMonth: "menos de un mes",
      conjunction: "y",
    },
    ai: {
      eyebrow: "Mirando al futuro",
      title: "La IA en mi trabajo",
      intro:
        "Aprovecho la IA y la sigo investigando en mi trabajo. La veo como una herramienta y como parte del futuro de nuestro sector: está cambiando la forma de trabajar, pero <strong>no sustituye al trabajo en sí</strong>. Por eso la utilizo sin dejar de lado mis estudios, mis bases ni mi propio criterio.",
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
          meta: "2 años completados, Universidad Politécnica de Alcalá",
          body: "A partir de aquí orienté mi formación hacia el desarrollo de software, que continué con el DAM y formación técnica adicional.",
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
          since: "Desde {year}",
        },
        unir: {
          tag: "Formación (en curso)",
          title: "Ingeniería Informática, UNIR",
          body:
            "Una carrera online, elegida precisamente para compatibilizarla con el trabajo a tiempo completo, con parte ya reconocida de estudios previos. La sigo a un ritmo constante y sostenible, que encaja con el trabajo.",
        },
      },
    },
    about: {
      eyebrow: "Conóceme",
      title: "Sobre mí",
      paragraphs: [
        "Me gusta trabajar en equipo y compartir ideas con otros desarrolladores y consultores, y me desenvuelvo igual de bien resolviendo problemas de forma autónoma cuando la situación lo requiere. Lo que más me motiva es <strong>un reto real</strong>: un problema que merece entenderse a fondo, no solo parchearse.",
        "Soy organizada y de mente abierta, sin que eso me reste capacidad de decisión. Me gusta mantener el trabajo claro y bien encaminado, estar abierta a mejores formas de hacer las cosas y tomar decisiones con seguridad cuando es necesario.",
        "Disfruto aprendiendo y aportando más allá de lo estrictamente necesario: <strong>ir un paso más allá de lo que pide la tarea</strong> siempre que puedo. Valoro el feedback constructivo como parte esencial del crecimiento profesional, sin dejar de buscar la máxima calidad en cada entrega. Entiendo mi desarrollo como algo continuo, y procuro aportar un poco más en cada proyecto.",
        "Compagino mi trabajo con el Grado en Ingeniería Informática, que estudio online. Elegí una carrera online precisamente para poder compatibilizarla con el trabajo a tiempo completo: la llevo a un ritmo constante que encaja con mis proyectos, y eso me permite seguir reforzando mis bases sin apartarme del trabajo real del día a día.",
      ],
    },
    beyond: {
      eyebrow: "Más allá del código",
      title: "Más allá del código",
      body:
        "Fuera de Business Central, disfruto de la música y toco la guitarra, y reservo tiempo para la lectura y el dibujo. Es una faceta creativa que sigo cultivando y que se refleja en cómo planteo las soluciones cuando programo. También valoro mucho el tiempo con las personas de mi entorno: acompañar en los momentos difíciles y celebrar juntos los logros.",
      guitarAlt: "Marcador de posición para una fotografía de Lucía con su guitarra",
    },
    contact: {
      eyebrow: "Hablemos",
      title: "Contacto",
      intro:
        "Valoro mi puesto actual y estoy abierta a nuevas oportunidades que encajen con <strong>mis objetivos profesionales</strong> y resulten beneficiosas para ambas partes. Si mi perfil puede encajar en tu equipo o proyecto, estaré encantada de hablar contigo.",
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
        success: "Gracias, tu mensaje se ha enviado correctamente. Te responderé lo antes posible.",
        mailto: "Se abrirá tu aplicación de correo con el mensaje listo para enviar.",
        error: "No se ha podido enviar el mensaje. Inténtalo de nuevo o contáctame directamente por email.",
        missing: "Por favor, rellena tu nombre, email y mensaje.",
        invalidEmail: "Por favor, introduce un email válido.",
        subject: "Contacto desde el portfolio",
      },
      backToTop: "Volver arriba",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      builtWith: "Diseñada y desarrollada por Lucía Esteban.",
    },
  },
};
