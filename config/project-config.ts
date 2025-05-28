// config/project-config.ts
// File di configurazione centralizzato per il progetto BIM
// Modifica solo questo file per personalizzare il sito per ogni nuovo progetto

export const projectConfig = {
  // Informazioni generali del progetto
  general: {
    name: "NEW Turin Hospital (TO)",
    description:
      "Il progetto riguarda la redazione del Progetto di Fattibilità Tecnica ed Economica (PFTE) per la realizzazione del nuovo Ospedale dell’ASL Città di Torino, localizzato nell’area urbana di Torino (NUTS ITC11). L’obiettivo è concepire una struttura sanitaria moderna, flessibile e sostenibile.",
    client: "ASL Città di Torino",
    location: "Torino (IT)",
    startDate: "2024-09-02",
    endDate: "2025-11-21",
    status: "In corso", // In corso, Completato, In fase di pianificazione, ecc.

    // Immagine o video principale del progetto (mostrato nella homepage)
    mainMedia: {
      type: "image", // "image" o "video"
      image: "/images/Progetto.jpg", // Percorso relativo alla cartella public
      video: "", // URL di un video (es. YouTube embed URL)
      alt: "Vista principale del progetto", // Testo alternativo per l'immagine
    },
  },

  // Branding e UI
  branding: {
    logo: "/images/ATI.png", // Logo del progetto (percorso relativo alla cartella public)
    favicon: "/favicon.ico", // Favicon del sito
    primaryColor: "#0f766e", // Colore principale del progetto (teal-700)
    secondaryColor: "#0284c7", // Colore secondario (sky-600)
    accentColor: "#f59e0b", // Colore di accento (amber-500)
    darkMode: true, // Abilita/disabilita la modalità scura
    font: "IBM Plex Mono", // Font principale del sito
    fontWeights: ["400", "500", "600", "700"], // Pesi del font da caricare
  },

  // Navigazione personalizzata - Aggiungere o rimuovere voci di menu
  navigation: [
    { name: "Home", href: "/" },
    { name: "Modelli 3D", href: "/models" },
    { name: "IFC Viewer", href: "/ifc-viewer" }, // Aggiungi questa riga
    { name: "Dashboard", href: "/dashboards" },
    { name: "Documenti", href: "/documents" },
    { name: "Notebook", href: "/notebooks" },
    { name: "Galleria", href: "/gallery" },
    { name: "Team", href: "/team" },
    // Aggiungi altre pagine personalizzate qui
  ],

  // Galleria di immagini del progetto
  gallery: {
    title: "Galleria del Progetto",
    description:
      "Immagini e rendering del progetto che mostrano vari aspetti dell'edificio, degli interni e degli esterni. Questa galleria fornisce una rappresentazione visiva completa del progetto.",
    images: [
      {
        id: "img-1",
        title: "Vista frontale",
        description:
          "Vista frontale dell'edificio che mostra la facciata principale e l'ingresso. L'architettura moderna si integra perfettamente con l'ambiente circostante.",
        path: "/images/gallery/vista-frontale.jpg", // Percorso relativo alla cartella public
        alt: "Vista frontale dell'edificio",
        featured: true, // Immagine in evidenza
      },
      {
        id: "img-2",
        title: "Vista laterale",
        description:
          "Vista laterale dell'edificio che mostra i dettagli della struttura e le finestre. Si può notare l'uso innovativo dei materiali e delle forme.",
        path: "/images/gallery/vista-laterale.jpg",
        alt: "Vista laterale dell'edificio",
        featured: false,
      },
      {
        id: "img-3",
        title: "Interni",
        description:
          "Gli interni dell'edificio sono caratterizzati da spazi aperti e luminosi, con un design moderno e funzionale che massimizza il comfort e l'efficienza.",
        path: "/images/gallery/interni.jpg",
        alt: "Interni dell'edificio",
        featured: false,
      },
      // Aggiungi altre immagini qui
    ],
  },

  // Risorse esterne
  externalLinks: {
    // Modelli IFC/Fragment configurati
    ifcModels: [
      {
        id: "ifc-model-1",
        name: "Modello Architettonico",
        description: "Modello 3D completo dell'edificio con tutti gli elementi architettonici",
        url: "/models/school_arq.frag", // Percorso relativo alla cartella public
        type: "frag", // "ifc" o "frag"
        category: "Architettura",
        visible: true, // Visibile di default
        tags: ["architettura", "3D", "BIM"],
        createdAt: "2023-10-15",
        updatedAt: "2023-11-20",
        author: "Studio Tecnico",
        version: "1.2",
      },
      {
        id: "ifc-model-2",
        name: "Modello Strutturale",
        description: "Struttura portante dell'edificio con fondazioni, pilastri, travi e solai",
        url: "/models/school_str.ifc", // File Fragment pre-processato
        type: "ifc",
        category: "Strutture",
        visible: true,
        tags: ["strutture", "3D", "BIM"],
        createdAt: "2023-10-20",
        updatedAt: "2023-11-25",
        author: "Ingegnere Strutturale",
        version: "2.1",
      },
      {
        id: "ifc-model-3",
        name: "Modello Impianti MEP",
        description: "Impianti meccanici, elettrici e idraulici dell'edificio",
        url: "/models/000001_FTE_00_000_ARC_PIM_000.frag",
        type: "ifc",
        category: "Impianti",
        visible: false, // Nascosto di default
        tags: ["MEP", "impianti", "3D"],
        createdAt: "2023-11-01",
        updatedAt: "2023-11-30",
        author: "Progettista Impianti",
        version: "1.0",
      },
      // Aggiungi altri modelli IFC qui
    ],

    // Modelli 3D (Speckle, BIMPlus, ecc.)
    models: [
      {
        id: "model-1",
        name: "Modello Architettonico",
        description:
          "Modello 3D Aree funzionali",
        url: "https://app.speckle.systems/projects/7b28ac5ea4/models/dbdbc612da",
        type: "speckle", // speckle, bimplus, altro
        thumbnail: "/images/thumbnails/modello-architettonico.jpg", // Percorso relativo alla cartella public
        category: "Architettura",
        tags: ["architettura", "3D", "BIM"],
        // createdAt: "2023-10-15",
        // updatedAt: "2023-11-20",
      },
      // {
      //   id: "model-2",
      //   name: "Modello Strutturale",
      //   description:
      //     "Struttura portante dell'edificio che include fondazioni, pilastri, travi e solai. Questo modello è stato creato da ingegneri strutturali per analizzare la stabilità e la resistenza dell'edificio.",
      //   url: "https://speckle.xyz/embed?stream=8a0f2c5be8&commit=9bd8171f4c",
      //   type: "speckle",
      //   thumbnail: "/images/thumbnails/modello-strutturale.jpg",
      //   category: "Strutture",
      //   tags: ["strutture", "3D", "BIM"],
      //   // createdAt: "2023-10-20",
      //   // updatedAt: "2023-11-25",
      // },
      // Aggiungi altri modelli qui
    ],

    // Dashboard (PowerBI, Tableau, ecc.)
    dashboards: [
      {
        id: "dashboard-1",
        name: "HLT Funzionale",
        description:
          "Dashboard interattiva dedicata all’organizzazione funzionale dell’ospedale. Consente di esplorare la distribuzione degli spazi per reparti, percorsi pulito/sporco, flussi di pazienti, personale e materiali. Integra mappe planimetriche dinamiche, indicatori di efficienza operativa e analisi delle superfici per destinazione d’uso, supportando scelte progettuali e verifiche di conformità normativa.",
        url: "https://app.powerbi.com/view?r=eyJrIjoiNGJiYjEwZTktODhkYS00ZDg0LWEwYjEtNTVlNzhlMDkxMWYxIiwidCI6IjZlY2FkODZiLWUwYjktNDFjNi1iMjcyLTU1MmZlMDJkMmUxMSIsImMiOjl9",
        type: "powerbi", // powerbi, tableau, altro
        thumbnail: "/images/thumbnails/dashboard-costi.jpg",
        category: "Costi",
        tags: ["costi", "analisi", "budget"],
        // createdAt: "2023-09-10",
        // updatedAt: "2023-11-15",
      },
      // {
      //   id: "dashboard-2",
      //   name: "Cronoprogramma",
      //   description:
      //     "Visualizzazione interattiva dell'avanzamento dei lavori e della timeline del progetto. Mostra le attività completate, in corso e future, con indicatori di progresso e date chiave.",
      //   url: "https://app.powerbi.com/view?r=example2",
      //   type: "powerbi",
      //   thumbnail: "/images/thumbnails/dashboard-cronoprogramma.jpg",
      //   category: "Pianificazione",
      //   tags: ["timeline", "pianificazione", "avanzamento"],
      //   createdAt: "2023-09-15",
      //   updatedAt: "2023-11-18",
      // },
      // Aggiungi altre dashboard qui
    ],

    // Documenti (SharePoint, Google Drive, ecc.)
    documents: [
      {
        id: "doc-1",
        name: "PGI",
        description:
          "Piano di Gestione dell’Informazione (Information Management Plan, secondo UNI 11337-5 e ISO 19650)",
        url: "https://acc.autodesk.com/docs/files/projects/e3063097-a00a-48ee-9573-ffad106463ae?folderUrn=urn%3Aadsk.wipprod%3Afs.folder%3Aco.knFad_oGSVK6vC66Hkvepw&entityId=urn%3Aadsk.wipprod%3Adm.lineage%3AuNwZZqCpRByi3XZrs_kHhA&viewModel=detail&moduleId=folders&viewableGuid=493c760d-9e61-45e6-82d5-79f99174c57e",
        type: "pdf",
        icon: "file-text", // Nome dell'icona Lucide (opzionale)
        category: "Documentazione Tecnica",
        tags: ["specifiche", "tecnico", "capitolato"],
        // createdAt: "2023-08-05",
        // updatedAt: "2023-10-10",
      },
      {
        id: "doc-2",
        name: "2560.24 - MSS_ModelSharedSettings",
        description:
          "File di configurazione centralizzato contenente le impostazioni condivise per tutti i modelli BIM del progetto 2560.24. Include parametri comuni, convenzioni di nomenclatura, coordinate di riferimento, impostazioni di visualizzazione, workset e template di vista. Costituisce la base operativa per garantire coerenza tra le discipline e interoperabilità tra i software utilizzati nel CDE.",
        url: "https://docs.google.com/spreadsheets/d/1ondUE54mD1l9iP1x9OJlttkacPoL9DIsWbn0cc-HFxE/edit?gid=0#gid=0",
        type: "xlsx",
        icon: "file-spreadsheet", // Nome dell'icona Lucide (opzionale)
        category: "Pianificazione",
        tags: ["timeline", "pianificazione", "gantt"],
        // createdAt: "2023-08-10",
        // updatedAt: "2023-10-15",
      },
      {
        id: "doc-3",
        name: "Nomenclature",
        description:
          "Documento di riferimento che definisce le convenzioni di nomenclatura adottate nel progetto 2560.24. Include le regole per la denominazione di file, viste, famiglie, workset, parametri condivisi e codici di classificazione. Garantisce uniformità nella modellazione e facilita il coordinamento tra le discipline, la gestione del CDE e l’interoperabilità tra software BIM.",
        url: "https://acc.autodesk.com/docs/files/projects/e3063097-a00a-48ee-9573-ffad106463ae?folderUrn=urn%3Aadsk.wipprod%3Afs.folder%3Aco.knFad_oGSVK6vC66Hkvepw&entityId=urn%3Aadsk.wipprod%3Adm.lineage%3APF35vi8ERrSZn0hJQK7eog&viewModel=detail&moduleId=folders",
        type: "xlsx",
        icon: "file-spreadsheet", // Nome dell'icona Lucide (opzionale)
        category: "Documentazione Tecnica",
        tags: ["relazione", "tecnico"],
        // createdAt: "2023-08-15",
        // updatedAt: "2023-10-20",
      },
      {
        id: "doc-4",
        name: "2560.24 - MoM (Minutes of Meeting)",
        description:
          "Documento centralizzato contenente i verbali ufficiali delle riunioni tecniche e operative del progetto 2560.24 FTE Torino. Ogni foglio rappresenta un MoM con data, partecipanti, argomenti discussi, decisioni prese, azioni da intraprendere e responsabilità assegnate. Il file consente il tracciamento puntuale dello stato di avanzamento, delle criticità affrontate e del coordinamento tra i team di lavoro multidisciplinari.",
        url: "https://docs.google.com/spreadsheets/d/1LLL0DN2_G6fyDoryfdUaixSP2W05FcsMUF2kqDnpVU8/edit?usp=sharing", // link diretto al file condiviso (es. SharePoint, Drive, CDE)
        type: "xlsx",
        icon: "file-spreadsheet", // Nome dell'icona Lucide (opzionale)
        category: "Project Management",
        tags: ["verbali", "riunioni", "MoM", "project management", "coordinamento"],
        // createdAt: "2023-01-10",
        // updatedAt: "2025-04-23",
      },
      {
        id: "doc-5",
        name: "2560.24 - Presentazione Direzione Sanitaria (23.04.2025)",
        description:
          "Presentazione ufficiale dello stato di avanzamento progettuale per il nuovo Ospedale dell’ASL Città di Torino, condivisa con la Direzione Sanitaria il 23 aprile 2025. Il documento illustra le scelte progettuali aggiornate, gli obiettivi funzionali (alta intensità di cura, flessibilità, accessibilità), la struttura dei reparti, la logica dei percorsi differenziati e il confronto tra quadro esigenziale e superfici previste. Include inoltre la rappresentazione dettagliata dei piani tipo e delle configurazioni di degenza.",
        url: "https://drive.google.com/file/d/1M-ts8uSrrpE2fAxfbQUZAZ4GaGLKjbZS/view?usp=drive_link", // link diretto al file condiviso (es. SharePoint, Drive, CDE)
        type: "pdf",
        icon: "file-text", // Nome dell'icona Lucide (opzionale)
        category: "Project Management",
        tags: ["schema funzionale", "direzione sanitaria", "layout", "ospedale", "presentazione"],
        // createdAt: "2023-01-10",
        // updatedAt: "2025-04-23",
      },
      {
        id: "doc-6",
        name: "000001_FTE_00_000_GEN_ELE_000-Nuovo Ospedale Torino-Elenco Elaborati",
        description:
          "Documento completo, condiviso con SA e Regione, contenente l’elenco ufficiale di tutti gli elaborati progettuali prodotti per il PFTE del nuovo Ospedale dell’ASL Città di Torino. Include codici, descrizioni, scale e riferimenti prestazionali per tavole architettoniche, relazioni tecniche, impianti, layout funzionali, cronoprogrammi e computi metrici. Fondamentale per il coordinamento disciplinare e il controllo documentale all’interno del CDE.",
        url: "https://drive.google.com/file/d/1nN26lDCs4Xnfp53h-vN8PEOy3KBDHqfT/view?usp=drive_link", // link diretto al file condiviso (es. SharePoint, Drive, CDE)
        type: "pdf",
        icon: "file-text", // Nome dell'icona Lucide (opzionale)
        category: "Project Management",
        tags: ["PFTE", "elaborati", "documentazione", "ospedale", "coordinamento"],
        // createdAt: "2023-01-10",
        // updatedAt: "2025-04-23",
      },
      {
        id: "doc-7",
        name: "CRONO TORINO _ REV01",
        description:
          "Cronoprogramma ufficiale aggiornato alla REV01 del progetto 2560.24 Nuovo Ospedale ASL Città di Torino, comprensivo di tutte le fasi progettuali, autorizzative e procedurali. Il documento dettaglia attività in capo alla Stazione Appaltante, Enti e RTP, con scadenze chiave dalla firma del contratto fino alla validazione finale del PFTE. Include milestone strategiche come la consegna del PFTE Autorizzatorio, l’avvio indagini e la Conferenza dei Servizi.",
        url: "https://drive.google.com/file/d/1qCULC1yQ-yEPOcWWPidv63lznuNYNdm8/view?usp=drive_link", // Inserire link diretto al documento condiviso (CDE, drive, ecc.)
        type: "pdf",
        icon: "file-text", // icona Lucide consigliata per cronoprogrammi
        category: "Project Management",
        tags: ["cronoprogramma", "PFTE", "ospedale", "timeline", "scadenze"],
        // createdAt: "2025-04-23",
        // updatedAt: "2025-04-23",
      },
      // Aggiungi altri documenti qui
    ],

    // Notebook ML (Google Colab, Jupyter, ecc.)
    notebooks: [
      {
        id: "notebook-1",
        name: "DATI FORNITI_2333.23 BD MST NEW Turin Hospital (TO)",
        description:
          "Notebook di machine learning che analizza i documenti base del progetto per estrarre informazioni chiave, identificare pattern e generare insights. Utilizza tecniche di NLP per l'elaborazione del testo.",
        url: "https://notebooklm.google.com/notebook/2166a37d-f962-46e8-8f9c-9dc72b6ce096?_gl=1*1el985l*_ga*MTczMzgxODQ1OS4xNzQyNDc5MzY0*_ga_W0LDH41ZCB*czE3NDcyMjI5NzIkbzE2JGcxJHQxNzQ3MjIyOTc1JGowJGwwJGgw",
        type: "colab", // colab, jupyter, altro
        thumbnail: "/images/thumbnails/notebook-analisi-documenti.jpg",
        category: "Analisi Documenti",
        tags: ["ML", "NLP", "analisi", "documenti"],
        // createdAt: "2023-10-05",
        // updatedAt: "2023-11-10",
        author: "R&D Team",
      },
      // {
      //   id: "notebook-2",
      //   name: "Previsione Costi e Timeline",
      //   description:
      //     "Modello predittivo che utilizza dati storici di progetti simili per prevedere costi e tempistiche. Include visualizzazioni interattive e analisi di scenario per supportare le decisioni di progetto.",
      //   url: "https://colab.research.google.com/drive/1HxzMXEfkV2j5i9-i9j9Z9wFmVU9Y5HCN?usp=sharing",
      //   type: "colab",
      //   thumbnail: "/images/thumbnails/notebook-previsione-costi.jpg",
      //   category: "Previsione",
      //   tags: ["ML", "previsione", "costi", "timeline"],
      //   createdAt: "2023-10-10",
      //   updatedAt: "2023-11-15",
      //   author: "Data Science Team",
      // },
      // {
      //   id: "notebook-3",
      //   name: "Classificazione Automatica Documenti",
      //   description:
      //     "Sistema di classificazione automatica dei documenti di progetto basato su machine learning. Categorizza automaticamente i documenti in base al contenuto e estrae metadati rilevanti.",
      //   url: "https://colab.research.google.com/drive/1HxzMXEfkV2j5i9-i9j9Z9wFmVU9Y5HCN?usp=sharing",
      //   type: "colab",
      //   thumbnail: "/images/thumbnails/notebook-classificazione.jpg",
      //   category: "Classificazione",
      //   tags: ["ML", "classificazione", "documenti", "automazione"],
      //   createdAt: "2023-10-15",
      //   updatedAt: "2023-11-20",
      //   author: "Data Science Team",
      // },
    ],
  },

  // Membri del team
  team: [
    {
      id: "team-1",
      name: "Mario Rossi",
      role: "Project Manager",
      email: "mario.rossi@esempio.it",
      phone: "+39 123 456 7890",
      avatar: "/images/team/mario-rossi.jpg", // Percorso relativo alla cartella public
      bio: "Project Manager con 10 anni di esperienza in progetti BIM. Mario ha gestito con successo numerosi progetti di edifici commerciali e residenziali, coordinando team multidisciplinari e garantendo il rispetto di tempi e budget.",
      company: "Studio Tecnico Associato",
      order: 1, // Per ordinare i membri del team
    },
    {
      id: "team-2",
      name: "Laura Bianchi",
      role: "Architetto",
      email: "laura.bianchi@esempio.it",
      phone: "+39 123 456 7891",
      avatar: "/images/team/laura-bianchi.jpg",
      bio: "Architetto specializzato in progettazione BIM con particolare attenzione alla sostenibilità e all'efficienza energetica. Laura ha lavorato su progetti innovativi che combinano estetica e funzionalità.",
      company: "Studio Tecnico Associato",
      order: 2,
    },
    {
      id: "team-3",
      name: "Giovanni Verdi",
      role: "Ingegnere Strutturale",
      email: "giovanni.verdi@esempio.it",
      phone: "+39 123 456 7892",
      avatar: "/images/team/giovanni-verdi.jpg",
      bio: "Ingegnere strutturale con esperienza in progetti complessi e strutture innovative. Giovanni si occupa di analisi strutturali, calcoli e verifiche per garantire la sicurezza e la stabilità degli edifici.",
      company: "Studio Tecnico Associato",
      order: 3,
    },
    // Aggiungi altri membri del team qui
  ],

  // Contatti e informazioni aziendali
  contact: {
    company: "ATI Project s.r.l.",
    address: "Via G.B. Picotti, 12/14",
    email: "info@atiproject.com",
    phone: "+39 050578460",
    website: "https://atiproject.com/",
    socialMedia: {
      linkedin: "https://www.linkedin.com/company/atiproject/posts/?feedView=all",
      twitter: "https://atiproject.com/contatti/#",
      facebook: "https://www.facebook.com/atiproject/?locale=it_IT",
      instagram: "https://www.instagram.com/atiproject/?hl=it",
    },
  },

  // Autenticazione e sicurezza
  auth: {
    requireLogin: false, // Se true, richiede l'autenticazione per accedere al sito
    allowRegistration: false, // Se true, consente agli utenti di registrarsi
    demoCredentials: {
      username: "bimuser",
      password: "2560",
    },
  },

  // Funzionalità opzionali
  features: {
    enableComments: true, // Abilita/disabilita i commenti sui modelli e documenti
    enableSharing: true, // Abilita/disabilita la condivisione di risorse
    enableNotifications: true, // Abilita/disabilita le notifiche
    enableVersioning: true, // Abilita/disabilita il versionamento dei documenti
    enableSearch: true, // Abilita/disabilita la ricerca globale
    enableFiltering: true, // Abilita/disabilita il filtro avanzato
  },
}

// Esporta anche singole sezioni per un accesso più facile
export const generalConfig = projectConfig.general
export const brandingConfig = projectConfig.branding
export const navigationConfig = projectConfig.navigation
export const galleryConfig = projectConfig.gallery
export const ifcModelsConfig = projectConfig.externalLinks.ifcModels
export const modelsConfig = projectConfig.externalLinks.models
export const dashboardsConfig = projectConfig.externalLinks.dashboards
export const documentsConfig = projectConfig.externalLinks.documents
export const notebooksConfig = projectConfig.externalLinks.notebooks
export const teamConfig = projectConfig.team
export const contactConfig = projectConfig.contact
export const authConfig = projectConfig.auth
export const featuresConfig = projectConfig.features
