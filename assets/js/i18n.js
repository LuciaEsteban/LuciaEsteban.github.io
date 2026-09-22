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
        "Portfolio of Lucía Esteban Peña, Microsoft Dynamics 365 Business Central / AL Developer — AL development, RDLC reporting, migrations and integrations.",
    },
    skipLink: "Skip to main content",
    nav: {
      expertise: "Business Central",
      caseStudies: "Case Studies",
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
      intro:
        "This is where most of my professional experience lives. Everything below is capability I have applied in real Business Central projects — not a list of buzzwords.",
      items: {
        al: {
          title: "AL Development & Extensions",
          body:
            "Building and maintaining AL extensions: tables, pages, page extensions, codeunits, business logic, events and subscribers.",
        },
        reports: {
          title: "Reports & RDLC",
          body:
            "AL datasets combined with RDLC layouts to produce multipage business documents, with conditional logic, calculations and alignment that hold up in production.",
        },
        migrations: {
          title: "Migrations & Upgrades",
          body:
            "Version migrations and upgrades between Business Central releases: extension/app compatibility, environment preparation and validation.",
        },
        integrations: {
          title: "Integrations & Data",
          body:
            "Working with APIs, Web Services, XML, JSON and XMLPorts inside Business Central solutions to exchange data with the outside world.",
        },
        saas: {
          title: "SaaS & On-Premise",
          body:
            "Hands-on experience with both deployment models, and a practical understanding of how their constraints differ — from Server Tier to what SaaS does and doesn't allow.",
        },
        tooling: {
          title: "Development Environment & Tooling",
          body:
            "AL Language in VS Code, symbols and .app/.alpackages, multi-project workspaces, Go to Definition, and diagnosing dependency and compilation issues.",
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
    caseStudies: {
      eyebrow: "Applied experience",
      title: "Technical case studies",
      intro:
        "Anonymized examples based on real project work. No client names, internal systems or confidential details are included — just the technical substance, which I'm happy to go deeper on in an interview.",
      labels: {
        challenge: "Challenge",
        work: "What I worked on",
        technologies: "Technologies",
        demonstrates: "What this demonstrates",
      },
      items: {
        upgrade: {
          title: "Business Central Upgrade",
          challenge:
            "An On-Premise environment needed to move from one Business Central version to a newer one without breaking existing customizations.",
          work:
            "Assessed extension and app compatibility ahead of the upgrade, prepared and cloned the environment for migration, worked with Business Central Server / Server Tier and the Business Central Administration Shell, and troubleshot SQL Server issues — including Full-Text related problems — that surfaced during the process.",
          technologies: "Business Central On-Premise, AL, PowerShell, SQL Server",
          demonstrates:
            "Comfort owning an upgrade end-to-end: technical assessment, environment work and troubleshooting under real constraints.",
        },
        reporting: {
          title: "Commercial Reporting System",
          challenge:
            "A family of commercial documents — quotes, order confirmations, delivery notes, invoices, credit memos and purchase orders — needed layouts that were accurate, configurable and consistent across all of them.",
          work:
            "Built and maintained the underlying AL datasets and RDLC layouts, implemented configurable corporate backgrounds sourced from Company Information, kept multipage layouts stable with correct header/footer handling, added configurable general/legal conditions laid out in two columns, and implemented conditional logic to show extra codes or data on order lines based on multiple business rules. Also handled the totals and tax breakdown: gross base, discounts, net base, VAT, VAT amount and equivalence surcharge — and fixed the usual RDLC pitfalls along the way: blank values, empty rows, premature page breaks and page duplication.",
          technologies: "AL, RDLC, Business Central",
          demonstrates:
            "Real fluency in AL + RDLC reporting beyond cosmetic changes — including the fiscal and layout edge cases that make business documents genuinely production-ready.",
        },
        legalConditions: {
          title: "Configurable Legal Conditions",
          challenge:
            "Long legal/general conditions text needed to live outside hardcoded report layouts, so it could be edited without a code deployment.",
          work:
            "Extended the Company Information page to edit long condition text stored in a BLOB field, and implemented the read/write logic — including working with streams and page lifecycle events — to load and save that content correctly.",
          technologies: "AL, Business Central page extensions, BLOB fields",
          demonstrates:
            "Understanding of Business Central's data persistence model beyond simple fields, applied to a genuinely useful configuration feature.",
        },
        integration: {
          title: "Integration & Data Exchange",
          challenge:
            "Business Central needed to exchange structured data with an external system as part of a broader business process.",
          work:
            "Worked with APIs / Web Services and XML, JSON and XMLPorts to move data in and out of Business Central in the format the integration required.",
          technologies: "AL, APIs / Web Services, XML, JSON, XMLPorts",
          demonstrates:
            "Practical, honest integration experience — the kind of building block most Business Central projects eventually need.",
        },
        troubleshooting: {
          title: "BC Environment Troubleshooting",
          challenge:
            "A Business Central environment was showing configuration and compilation issues that needed a systematic diagnosis rather than guesswork.",
          work:
            "Diagnosed Server Tier and SQL/configuration issues, traced symbol and dependency problems back to their source, and used the standard development tooling to confirm and resolve each one.",
          technologies: "Business Central Server, SQL Server, AL Language tooling",
          demonstrates:
            "A methodical approach to troubleshooting — narrowing down a problem rather than working around it.",
        },
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
          title: "Electronic Engineering",
          status: "Previous studies",
          body: "University studies prior to DAM, roughly two years, later built on through further technical education.",
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
        "I'm a Business Central / AL developer who enjoys the parts of the job most people find tedious — chasing down why an RDLC report duplicates a page, or making sense of a migration that doesn't go quite to plan.",
        "I've worked both independently and as part of a team with other developers and consultants, across new development, maintenance, troubleshooting and evolving existing solutions — and I'm equally comfortable in either mode.",
        "I'm currently completing a Computer Engineering degree alongside full-time work, because I'd rather keep building a solid foundation than stop learning once a job title changes. I'm curious by default, and genuinely enjoy picking up new tools and problems.",
      ],
    },
    beyond: {
      eyebrow: "Beyond the code",
      title: "Beyond the code",
      body:
        "Outside of Business Central, I play guitar — mostly for myself, occasionally badly, always happily.",
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
        "Portfolio de Lucía Esteban Peña, desarrolladora de Microsoft Dynamics 365 Business Central / AL — desarrollo AL, informes RDLC, migraciones e integraciones.",
    },
    skipLink: "Ir al contenido principal",
    nav: {
      expertise: "Business Central",
      caseStudies: "Casos técnicos",
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
      intro:
        "Aquí está la mayor parte de mi experiencia profesional. Todo lo que aparece a continuación es algo que he aplicado en proyectos reales de Business Central, no una lista de palabras de moda.",
      items: {
        al: {
          title: "Desarrollo AL y extensiones",
          body:
            "Desarrollo y mantenimiento de extensiones AL: tablas, páginas, page extensions, codeunits, lógica de negocio, eventos y subscribers.",
        },
        reports: {
          title: "Informes y RDLC",
          body:
            "Datasets AL combinados con layouts RDLC para generar documentos comerciales multipágina, con lógica condicional, cálculos y una alineación que aguanta bien en producción.",
        },
        migrations: {
          title: "Migraciones y upgrades",
          body:
            "Migraciones y upgrades entre versiones de Business Central: compatibilidad de extensiones y apps, preparación del entorno y validación.",
        },
        integrations: {
          title: "Integraciones y datos",
          body:
            "Trabajo con APIs, Web Services, XML, JSON y XMLPorts dentro de soluciones Business Central para intercambiar datos con el exterior.",
        },
        saas: {
          title: "SaaS y On-Premise",
          body:
            "Experiencia práctica con ambos modelos de despliegue, y una comprensión real de cómo difieren sus restricciones, desde el Server Tier hasta lo que SaaS permite y lo que no.",
        },
        tooling: {
          title: "Entorno de desarrollo y herramientas",
          body:
            "AL Language en VS Code, símbolos y .app/.alpackages, workspaces multiproyecto, Go to Definition, y diagnóstico de problemas de dependencias y compilación.",
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
    caseStudies: {
      eyebrow: "Experiencia aplicada",
      title: "Casos técnicos",
      intro:
        "Ejemplos anonimizados basados en trabajo real de proyectos. No se incluyen nombres de clientes, sistemas internos ni detalles confidenciales, solo el contenido técnico, del que puedo hablar con más profundidad en una entrevista.",
      labels: {
        challenge: "Reto",
        work: "En qué trabajé",
        technologies: "Tecnologías",
        demonstrates: "Qué demuestra",
      },
      items: {
        upgrade: {
          title: "Upgrade de Business Central",
          challenge:
            "Un entorno On-Premise necesitaba pasar de una versión de Business Central a otra más reciente sin romper las personalizaciones existentes.",
          work:
            "Evalué la compatibilidad de extensiones y apps antes del upgrade, preparé y cloné el entorno para la migración, trabajé con Business Central Server / Server Tier y la Business Central Administration Shell, y resolví problemas de SQL Server —incluidos algunos relacionados con Full-Text— que surgieron durante el proceso.",
          technologies: "Business Central On-Premise, AL, PowerShell, SQL Server",
          demonstrates:
            "Capacidad de asumir un upgrade de principio a fin: evaluación técnica, trabajo de entorno y resolución de problemas bajo restricciones reales.",
        },
        reporting: {
          title: "Sistema de informes comerciales",
          challenge:
            "Una familia de documentos comerciales —ofertas, confirmaciones de pedido, albaranes, facturas, abonos y pedidos de compra— necesitaba layouts precisos, configurables y coherentes entre sí.",
          work:
            "Construí y mantuve los datasets AL y layouts RDLC subyacentes, implementé fondos corporativos configurables procedentes de Company Information, mantuve layouts multipágina estables con una gestión correcta de header/footer, añadí condiciones generales/legales configurables en dos columnas, e implementé lógica condicional para mostrar códigos o datos adicionales en las líneas de pedido según múltiples reglas de negocio. También me encargué de los totales y el desglose fiscal: base bruta, descuentos, base neta, IVA, importe de IVA y recargo de equivalencia, corrigiendo por el camino los problemas típicos de RDLC: valores vacíos, filas vacías, saltos de página prematuros y duplicación de páginas.",
          technologies: "AL, RDLC, Business Central",
          demonstrates:
            "Dominio real de informes AL + RDLC más allá de cambios cosméticos, incluyendo los casos fiscales y de layout que hacen que un documento comercial esté realmente listo para producción.",
        },
        legalConditions: {
          title: "Condiciones legales configurables",
          challenge:
            "Un texto largo de condiciones generales/legales necesitaba vivir fuera de los layouts de informe con contenido fijo, para poder editarse sin desplegar código.",
          work:
            "Extendí la página de Company Information para editar el texto largo de condiciones almacenado en un campo BLOB, e implementé la lógica de lectura/escritura —incluyendo trabajo con streams y eventos del ciclo de vida de la página— para cargar y guardar ese contenido correctamente.",
          technologies: "AL, page extensions de Business Central, campos BLOB",
          demonstrates:
            "Comprensión del modelo de persistencia de datos de Business Central más allá de los campos simples, aplicada a una funcionalidad de configuración realmente útil.",
        },
        integration: {
          title: "Integración e intercambio de datos",
          challenge:
            "Business Central necesitaba intercambiar datos estructurados con un sistema externo como parte de un proceso de negocio más amplio.",
          work:
            "Trabajé con APIs / Web Services y XML, JSON y XMLPorts para mover datos dentro y fuera de Business Central en el formato que requería la integración.",
          technologies: "AL, APIs / Web Services, XML, JSON, XMLPorts",
          demonstrates:
            "Experiencia de integración práctica y honesta: el tipo de pieza que la mayoría de proyectos de Business Central acaba necesitando.",
        },
        troubleshooting: {
          title: "Resolución de problemas de entorno BC",
          challenge:
            "Un entorno de Business Central presentaba problemas de configuración y compilación que requerían un diagnóstico sistemático en lugar de prueba y error.",
          work:
            "Diagnostiqué problemas de Server Tier y de configuración/SQL, rastreé problemas de símbolos y dependencias hasta su origen, y utilicé las herramientas de desarrollo estándar para confirmar y resolver cada uno.",
          technologies: "Business Central Server, SQL Server, herramientas de AL Language",
          demonstrates:
            "Un enfoque metódico para la resolución de problemas: acotar la causa en lugar de rodearla.",
        },
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
          title: "Ingeniería Electrónica",
          status: "Estudios previos",
          body: "Estudios universitarios previos al DAM, de aproximadamente dos años, sobre los que después continué con más formación técnica.",
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
        "Soy desarrolladora Business Central / AL y disfruto con las partes del trabajo que a mucha gente le resultan tediosas: averiguar por qué un informe RDLC duplica una página, o entender una migración que no ha ido exactamente según lo previsto.",
        "He trabajado tanto de forma autónoma como en equipo con otros desarrolladores y consultores, en desarrollo nuevo, mantenimiento, resolución de incidencias y evolución de soluciones existentes, y me siento igual de cómoda en cualquiera de los dos modos.",
        "Actualmente estoy terminando el Grado en Ingeniería Informática compatibilizándolo con el trabajo a tiempo completo, porque prefiero seguir construyendo una base sólida antes que dejar de aprender en cuanto cambia un título. Soy curiosa por naturaleza y disfruto de verdad aprendiendo herramientas y problemas nuevos.",
      ],
    },
    beyond: {
      eyebrow: "Más allá del código",
      title: "Más allá del código",
      body:
        "Fuera de Business Central, toco la guitarra, sobre todo para mí misma, a veces mal, siempre con gusto.",
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
