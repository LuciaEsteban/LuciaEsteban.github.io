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
      experience: "Experience",
      education: "Education",
      about: "About",
      contact: "Contact",
      langToggleLabel: "Switch language",
    },
    hero: {
      eyebrow: "Portfolio",
      name: "Lucía Esteban Peña",
      role: "Microsoft Dynamics 365 Business Central / AL Developer",
      tagline:
        "I build and maintain AL extensions, business reports and integrations for Microsoft Dynamics 365 Business Central — across SaaS and On-Premise environments.",
      availability: "Open to remote opportunities, in English or Spanish.",
      ctaPrimary: "Explore my Business Central work",
      ctaSecondary: "Get in touch",
      photoAlt: "Placeholder for Lucía Esteban's professional photo",
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
            "This is the core of my day-to-day work: building and maintaining AL extensions for Business Central — tables, pages, page extensions, codeunits, events and subscribers. It's where business requirements become working functionality.",
        },
        reports: {
          title: "Reporting (AL + RDLC)",
          body:
            "I build business reports combining AL datasets with RDLC layouts: the multipage commercial documents a company sends to its customers and suppliers. Getting them right takes more than a template — conditional logic, totals, taxes and layout details that have to hold up in production.",
        },
        implementations: {
          title: "New Implementations & Upgrades",
          body:
            "I've worked on both sides of a Business Central rollout: new implementations built from scratch, and migrations and upgrades between versions, with exposure to NAV/BC14, BC21, BC25 and BC28. Each one poses different challenges — from configuring a solution from zero to keeping existing customizations working after an upgrade.",
        },
        integrations: {
          title: "Integrations & APIs",
          body:
            "Business Central rarely works in isolation. I build the connections that let it exchange data with other systems — APIs, Web Services, XML, JSON and XMLPorts — so information moves reliably between Business Central and whatever it needs to talk to.",
        },
        saas: {
          title: "SaaS & On-Premise",
          body:
            "I've worked hands-on with both deployment models and know how their constraints differ in practice — from what SaaS does and doesn't allow, to managing Server Tier and infrastructure on an On-Premise environment.",
        },
        tooling: {
          title: "Development Environment & Way of Working",
          body:
            "Day to day, I work in VS Code with the AL Language extension, symbols and .app/.alpackages, across multi-project workspaces. I like to start from a clear functional specification and a short design outline before writing code, and to work through Git with pull requests — adapting to whatever process a team already has in place.",
        },
      },
    },
    diagrams: {
      migration: {
        title: "A typical upgrade path",
        from: "BC21",
        to: "BC25",
        steps: [
          "Check extension & app compatibility",
          "Prepare and validate the environment",
          "Run and verify the upgrade",
        ],
      },
      reporting: {
        title: "How a business document gets built",
        steps: ["AL Dataset", "RDLC Layout", "Business Document"],
      },
      integration: {
        title: "How Business Central talks to the outside world",
        steps: ["External System", "API / XML / JSON / Web Services", "Business Central"],
      },
    },
    ecosystem: {
      eyebrow: "Technology map",
      title: "Technology ecosystem",
      intro:
        "Business Central and AL are at the center of what I do. Everything else here is a supporting technology I use around them — not a separate specialization.",
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
        items: ["Java", "HTML / CSS / JavaScript (this site)", "Introductory C", "Introductory Python"],
      },
    },
    experience: {
      eyebrow: "Timeline",
      title: "Professional experience",
      intro: "Now that you've seen what I can do, here's the timeline behind it.",
      current: {
        role: "Microsoft Dynamics 365 Business Central / AL Developer",
        companyFallback: "Currently working professionally with Business Central",
        versions: "Exposure to NAV/BC14, BC21, BC25 and BC28",
      },
      durationPrefix: "Professional Business Central experience:",
      durationSuffix: "and counting",
      years_one: "{n} year",
      years_other: "{n} years",
      months_one: "{n} month",
      months_other: "{n} months",
      lessThanAMonth: "just getting started",
      conjunction: "and",
    },
    education: {
      eyebrow: "Continuous learning",
      title: "Education",
      intro:
        "Formal education has run alongside professional work, not instead of it — including right now.",
      items: {
        dam: {
          title: "Higher Technician in Multiplatform Application Development (DAM)",
          status: "Completed",
          body: "Higher Vocational Training in software development.",
        },
        electronics: {
          title: "Electronics and Industrial Automation Engineering",
          status: "2 years completed",
          body: "Completed 2 years of the degree at Universidad Politécnica de Alcalá before switching tracks into software development, which continued through DAM and further technical education.",
        },
        unir: {
          title: "Computer Engineering — UNIR",
          status: "In progress",
          body:
            "Studying part-time, online, alongside full-time professional work — a deliberate investment in deeper engineering foundations. Around 1.5 years already recognized from previous studies.",
        },
      },
    },
    about: {
      eyebrow: "Get to know me",
      title: "About me",
      paragraphs: [
        "I like working with people — sharing ideas with other developers and consultants — and I'm just as happy figuring things out on my own sometimes. What really gets me going is a genuine challenge: a problem that makes me want to dig in and actually understand it, not just patch it.",
        "I like learning, and I like contributing more than what's strictly expected of me — going a bit further than a task asks for when I can. I'm still growing as a developer, and I know that every day I can offer a little more than I did the day before.",
        "I'm currently finishing my degree in Computer Engineering alongside full-time work, because I'd rather keep building a solid foundation than stop learning once a job title changes.",
      ],
    },
    beyond: {
      eyebrow: "Beyond the code",
      title: "Beyond the code",
      body:
        "Outside of Business Central, I enjoy music and play guitar. I also like meeting up with people over coffee — being there for the hard moments and celebrating the good ones together.",
      guitarAlt: "Placeholder for a photo of Lucía with her guitar",
    },
    contact: {
      eyebrow: "Let's talk",
      title: "Contact",
      intro:
        "If my profile could be a good fit for your team or project, I'd be happy to hear from you.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      cv: "Download CV",
      emailUnavailable: "Email coming soon",
      linkedinUnavailable: "LinkedIn coming soon",
      cvUnavailable: "CV coming soon",
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
      experience: "Experiencia",
      education: "Formación",
      about: "Sobre mí",
      contact: "Contacto",
      langToggleLabel: "Cambiar idioma",
    },
    hero: {
      eyebrow: "Portfolio",
      name: "Lucía Esteban Peña",
      role: "Desarrolladora Microsoft Dynamics 365 Business Central / AL",
      tagline:
        "Desarrollo y mantengo extensiones AL, informes de negocio e integraciones para Microsoft Dynamics 365 Business Central, en entornos SaaS y On-Premise.",
      availability: "Abierta a oportunidades en remoto, en inglés o español.",
      ctaPrimary: "Ver mi trabajo en Business Central",
      ctaSecondary: "Contactar",
      photoAlt: "Marcador de posición para la fotografía profesional de Lucía Esteban",
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
            "Es el núcleo de mi trabajo diario: desarrollar y mantener extensiones AL para Business Central —tablas, páginas, page extensions, codeunits, eventos y subscribers—. Aquí es donde los requisitos de negocio se convierten en funcionalidad real.",
        },
        reports: {
          title: "Informes (AL + RDLC)",
          body:
            "Construyo informes de negocio combinando datasets AL con layouts RDLC: los documentos comerciales multipágina que una empresa envía a sus clientes y proveedores. Hacerlo bien exige más que una plantilla: lógica condicional, totales, impuestos y detalles de maquetación que deben funcionar en producción.",
        },
        implementations: {
          title: "Implantaciones nuevas y upgrades",
          body:
            "He trabajado en las dos caras de un proyecto de Business Central: implantaciones nuevas desde cero y migraciones o actualizaciones entre versiones, con exposición a NAV/BC14, BC21, BC25 y BC28. Cada una plantea retos distintos, desde configurar una solución desde cero hasta mantener las personalizaciones existentes tras un upgrade.",
        },
        integrations: {
          title: "Integraciones y APIs",
          body:
            "Business Central rara vez trabaja aislado. Construyo las conexiones que le permiten intercambiar datos con otros sistemas —APIs, Web Services, XML, JSON y XMLPorts— para que la información se mueva de forma fiable entre Business Central y aquello con lo que tenga que comunicarse.",
        },
        saas: {
          title: "SaaS y On-Premise",
          body:
            "He trabajado de forma práctica con ambos modelos de despliegue y conozco cómo difieren sus restricciones: desde lo que SaaS permite y lo que no, hasta la gestión del Server Tier y la infraestructura en un entorno On-Premise.",
        },
        tooling: {
          title: "Entorno de desarrollo y forma de trabajar",
          body:
            "En el día a día trabajo en VS Code con la extensión AL Language, símbolos y .app/.alpackages, en workspaces multiproyecto. Me gusta partir de una especificación funcional clara y un breve esquema de diseño antes de escribir código, y trabajar con Git mediante pull requests, adaptándome al proceso que ya tenga cada equipo.",
        },
      },
    },
    diagrams: {
      migration: {
        title: "Un flujo de upgrade típico",
        from: "BC21",
        to: "BC25",
        steps: [
          "Revisar compatibilidad de extensiones y apps",
          "Preparar y validar el entorno",
          "Ejecutar y verificar el upgrade",
        ],
      },
      reporting: {
        title: "Cómo se construye un documento comercial",
        steps: ["Dataset AL", "Layout RDLC", "Documento comercial"],
      },
      integration: {
        title: "Cómo se comunica Business Central con el exterior",
        steps: ["Sistema externo", "API / XML / JSON / Web Services", "Business Central"],
      },
    },
    ecosystem: {
      eyebrow: "Mapa tecnológico",
      title: "Ecosistema tecnológico",
      intro:
        "Business Central y AL están en el centro de lo que hago. Todo lo demás aquí es una tecnología de apoyo que uso a su alrededor, no una especialización aparte.",
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
        items: ["Java", "HTML / CSS / JavaScript (esta web)", "Nociones de C", "Nociones de Python"],
      },
    },
    experience: {
      eyebrow: "Trayectoria",
      title: "Experiencia profesional",
      intro: "Ahora que has visto lo que sé hacer, aquí está la trayectoria detrás de ello.",
      current: {
        role: "Desarrolladora Microsoft Dynamics 365 Business Central / AL",
        companyFallback: "Actualmente trabajando profesionalmente con Business Central",
        versions: "Exposición a NAV/BC14, BC21, BC25 y BC28",
      },
      durationPrefix: "Experiencia profesional en Business Central:",
      durationSuffix: "y sigue sumando",
      years_one: "{n} año",
      years_other: "{n} años",
      months_one: "{n} mes",
      months_other: "{n} meses",
      lessThanAMonth: "recién empezando",
      conjunction: "y",
    },
    education: {
      eyebrow: "Aprendizaje continuo",
      title: "Formación",
      intro:
        "La formación académica ha ido en paralelo al trabajo profesional, no en su lugar, incluido ahora mismo.",
      items: {
        dam: {
          title: "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
          status: "Completado",
          body: "Ciclo Formativo de Grado Superior en desarrollo de software.",
        },
        electronics: {
          title: "Ingeniería Electrónica Automática Industrial",
          status: "2 años completados",
          body: "Completé 2 años de la carrera en la Universidad Politécnica de Alcalá antes de cambiar de rama hacia el desarrollo de software, que continué después con el DAM y más formación técnica.",
        },
        unir: {
          title: "Ingeniería Informática — UNIR",
          status: "En curso",
          body:
            "Estudios a tiempo parcial, online, compatibles con el trabajo a tiempo completo: una inversión deliberada en profundidad de ingeniería. Cuenta ya con aproximadamente 1,5 años reconocidos de estudios previos.",
        },
      },
    },
    about: {
      eyebrow: "Conóceme",
      title: "Sobre mí",
      paragraphs: [
        "Me gusta trabajar con gente —compartir ideas con otros desarrolladores y consultores— y también disfruto resolviendo cosas por mi cuenta en ciertos momentos. Lo que de verdad me engancha es un reto real: un problema que me hace querer meterme a fondo y entenderlo bien, no solo parchearlo.",
        "Me gusta aprender, y me gusta aportar más de lo que se espera de mí: ir un poco más allá de lo que pide la tarea cuando puedo. Todavía estoy en desarrollo como profesional, y sé que cada día puedo ofrecer un poco más que el día anterior.",
        "Actualmente estoy terminando el Grado en Ingeniería Informática compatibilizándolo con el trabajo a tiempo completo, porque prefiero seguir construyendo una base sólida antes que dejar de aprender en cuanto cambia un título.",
      ],
    },
    beyond: {
      eyebrow: "Más allá del código",
      title: "Más allá del código",
      body:
        "Fuera de Business Central, me gusta la música y toco la guitarra. También me gusta quedar con la gente a tomar un café: acompañar en los momentos difíciles y celebrar juntos los logros importantes.",
      guitarAlt: "Marcador de posición para una fotografía de Lucía con su guitarra",
    },
    contact: {
      eyebrow: "Hablemos",
      title: "Contacto",
      intro:
        "Si mi perfil pudiera encajar bien en tu equipo o proyecto, me encantaría saber de ti.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      cv: "Descargar CV",
      emailUnavailable: "Email próximamente",
      linkedinUnavailable: "LinkedIn próximamente",
      cvUnavailable: "CV próximamente",
      backToTop: "Volver arriba",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      builtWith: "Diseñada y construida por Lucía Esteban.",
    },
  },
};
