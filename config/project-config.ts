// config/project-config.ts
// File di configurazione centralizzato per il progetto BIM
// Modifica solo questo file per personalizzare il sito per ogni nuovo progetto

export const projectConfig = {
  // Informazioni generali del progetto
  general: {
    name: "2560.24 PPP FTE NEW Turin Hospital (TO)",
    description:
      "Il progetto riguarda la redazione del Progetto di Fattibilità Tecnica ed Economica (PFTE) per la realizzazione del nuovo Ospedale dell’ASL Città di Torino, localizzato nell’area urbana di Torino (NUTS ITC11). L’obiettivo è concepire una struttura sanitaria moderna, flessibile e sostenibile, in grado di ospitare 600 posti letto complessivi (di cui 50 in terapia intensiva), suddivisi in reparti per acuti, day hospital e servizi ambulatoriali polifunzionali.",
    client: "ASL Città di Torino",
    location: "Torino (IT)",
    startDate: "2023-01-01",
    endDate: "2024-12-31",
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
    logo: "/images/logo.png", // Logo del progetto (percorso relativo alla cartella public)
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
    { name: "Dashboard", href: "/dashboards" },
    { name: "Documenti", href: "/documents" },
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
    // Modelli 3D (Speckle, BIMPlus, ecc.)
    models: [
      {
        id: "model-1",
        name: "Modello Architettonico",
        description:
          "Modello 3D completo dell'edificio che include tutti gli elementi architettonici, come muri, pavimenti, soffitti, porte, finestre e scale. Questo modello è stato creato utilizzando Revit e poi esportato in Speckle per la visualizzazione online.",
        url: "https://speckle.xyz/embed?stream=8a0f2c5be8&commit=9bd8171f4c",
        type: "speckle", // speckle, bimplus, altro
        thumbnail: "/images/thumbnails/modello-architettonico.jpg", // Percorso relativo alla cartella public
        category: "Architettura",
        tags: ["architettura", "3D", "BIM"],
        createdAt: "2023-10-15",
        updatedAt: "2023-11-20",
      },
      {
        id: "model-2",
        name: "Modello Strutturale",
        description:
          "Struttura portante dell'edificio che include fondazioni, pilastri, travi e solai. Questo modello è stato creato da ingegneri strutturali per analizzare la stabilità e la resistenza dell'edificio.",
        url: "https://speckle.xyz/embed?stream=8a0f2c5be8&commit=9bd8171f4c",
        type: "speckle",
        thumbnail: "/images/thumbnails/modello-strutturale.jpg",
        category: "Strutture",
        tags: ["strutture", "3D", "BIM"],
        createdAt: "2023-10-20",
        updatedAt: "2023-11-25",
      },
      // Aggiungi altri modelli qui
    ],

    // Dashboard (PowerBI, Tableau, ecc.)
    dashboards: [
      {
        id: "dashboard-1",
        name: "Analisi Costi",
        description:
          "Dashboard interattiva che mostra l'analisi dettagliata dei costi di costruzione, suddivisi per categorie, fasi e materiali. Include grafici e tabelle per una facile comprensione e analisi dei dati finanziari del progetto.",
        url: "https://app.powerbi.com/view?r=example1",
        type: "powerbi", // powerbi, tableau, altro
        thumbnail: "/images/thumbnails/dashboard-costi.jpg",
        category: "Costi",
        tags: ["costi", "analisi", "budget"],
        createdAt: "2023-09-10",
        updatedAt: "2023-11-15",
      },
      {
        id: "dashboard-2",
        name: "Cronoprogramma",
        description:
          "Visualizzazione interattiva dell'avanzamento dei lavori e della timeline del progetto. Mostra le attività completate, in corso e future, con indicatori di progresso e date chiave.",
        url: "https://app.powerbi.com/view?r=example2",
        type: "powerbi",
        thumbnail: "/images/thumbnails/dashboard-cronoprogramma.jpg",
        category: "Pianificazione",
        tags: ["timeline", "pianificazione", "avanzamento"],
        createdAt: "2023-09-15",
        updatedAt: "2023-11-18",
      },
      // Aggiungi altre dashboard qui
    ],

    // Documenti (SharePoint, Google Drive, ecc.)
    documents: [
      {
        id: "doc-1",
        name: "Capitolato Tecnico",
        description:
          "Specifiche tecniche dettagliate del progetto che includono requisiti, materiali, standard di qualità e metodi di costruzione. Questo documento è essenziale per appaltatori e fornitori.",
        url: "https://docs.example.com/doc1",
        type: "pdf",
        icon: "file-text", // Nome dell'icona Lucide (opzionale)
        category: "Documentazione Tecnica",
        tags: ["specifiche", "tecnico", "capitolato"],
        createdAt: "2023-08-05",
        updatedAt: "2023-10-10",
        size: "2.5 MB",
      },
      {
        id: "doc-2",
        name: "Cronoprogramma",
        description:
          "Pianificazione temporale dettagliata dei lavori con date di inizio e fine per ogni fase del progetto, dipendenze tra attività e allocazione delle risorse.",
        url: "https://docs.example.com/doc2",
        type: "xlsx",
        icon: "file-spreadsheet", // Nome dell'icona Lucide (opzionale)
        category: "Pianificazione",
        tags: ["timeline", "pianificazione", "gantt"],
        createdAt: "2023-08-10",
        updatedAt: "2023-10-15",
        size: "1.8 MB",
      },
      {
        id: "doc-3",
        name: "Relazione Tecnica",
        description:
          "Relazione tecnica completa del progetto che include analisi, calcoli, metodologie e risultati. Questo documento fornisce una spiegazione dettagliata degli aspetti tecnici del progetto.",
        url: "https://docs.example.com/doc3",
        type: "docx",
        icon: "file-text", // Nome dell'icona Lucide (opzionale)
        category: "Documentazione Tecnica",
        tags: ["relazione", "tecnico"],
        createdAt: "2023-08-15",
        updatedAt: "2023-10-20",
        size: "3.2 MB",
      },
      // Aggiungi altri documenti qui
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
    requireLogin: true, // Se true, richiede l'autenticazione per accedere al sito
    allowRegistration: false, // Se true, consente agli utenti di registrarsi
    demoCredentials: {
      email: "demo@esempio.it",
      password: "password",
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
export const modelsConfig = projectConfig.externalLinks.models
export const dashboardsConfig = projectConfig.externalLinks.dashboards
export const documentsConfig = projectConfig.externalLinks.documents
export const teamConfig = projectConfig.team
export const contactConfig = projectConfig.contact
export const authConfig = projectConfig.auth
export const featuresConfig = projectConfig.features
