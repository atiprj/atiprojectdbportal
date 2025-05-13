// Configurazione centralizzata del progetto BIM
// Modifica questo file per personalizzare il sito per ogni nuovo progetto

export const projectConfig = {
  // Informazioni generali del progetto
  general: {
    name: "Nome Progetto",
    description: "Descrizione dettagliata del progetto",
    client: "Nome Cliente",
    location: "Località del Progetto",
    startDate: "2023-01-01",
    endDate: "2024-12-31",
    status: "In corso", // In corso, Completato, In fase di pianificazione, ecc.
  },

  // Branding e UI
  branding: {
    logo: "/placeholder.svg?height=40&width=40", // Sostituire con il logo del progetto
    favicon: "/favicon.ico", // Favicon del sito
    primaryColor: "#0f766e", // Colore principale del progetto (teal-700)
    secondaryColor: "#0284c7", // Colore secondario (sky-600)
    accentColor: "#f59e0b", // Colore di accento (amber-500)
    darkMode: true, // Abilita/disabilita la modalità scura
  },

  // SEO e metadati
  seo: {
    title: "Progetto BIM - Nome Progetto",
    description: "Piattaforma di condivisione per il progetto BIM Nome Progetto",
    keywords: "BIM, progetto, costruzione, architettura, ingegneria",
    ogImage: "/og-image.jpg", // Immagine per social media
    twitterHandle: "@azienda",
  },

  // Autenticazione e sicurezza
  auth: {
    requireLogin: true, // Se true, richiede l'autenticazione per accedere al sito
    allowRegistration: false, // Se true, consente agli utenti di registrarsi
    demoCredentials: {
      email: "demo@esempio.it",
      password: "password",
    },
    // In un'implementazione reale, qui si configurerebbero provider come Auth0, NextAuth, ecc.
  },

  // Navigazione personalizzata - Aggiungere o rimuovere voci di menu
  navigation: [
    { name: "Home", href: "/" },
    { name: "Modelli 3D", href: "/models" },
    { name: "Dashboard", href: "/dashboards" },
    { name: "Documenti", href: "/documents" },
    { name: "Team", href: "/team" },
    // Aggiungi altre pagine personalizzate qui
  ],

  // Risorse esterne
  externalLinks: {
    // Modelli 3D (Speckle, BIMPlus, ecc.)
    models: [
      {
        id: "model-1",
        name: "Modello Architettonico",
        description: "Modello 3D completo dell'edificio",
        url: "https://speckle.xyz/embed?stream=8a0f2c5be8&commit=9bd8171f4c",
        type: "speckle", // speckle, bimplus, altro
        thumbnail: "/placeholder.svg?height=200&width=400",
        category: "Architettura",
        tags: ["architettura", "3D", "BIM"],
        createdAt: "2023-10-15",
        updatedAt: "2023-11-20",
      },
      {
        id: "model-2",
        name: "Modello Strutturale",
        description: "Struttura portante dell'edificio",
        url: "https://speckle.xyz/embed?stream=8a0f2c5be8&commit=9bd8171f4c",
        type: "speckle",
        thumbnail: "/placeholder.svg?height=200&width=400",
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
        description: "Dashboard dei costi di costruzione",
        url: "https://app.powerbi.com/view?r=example1",
        type: "powerbi", // powerbi, tableau, altro
        thumbnail: "/placeholder.svg?height=200&width=400",
        category: "Costi",
        tags: ["costi", "analisi", "budget"],
        createdAt: "2023-09-10",
        updatedAt: "2023-11-15",
      },
      {
        id: "dashboard-2",
        name: "Cronoprogramma",
        description: "Avanzamento lavori e timeline",
        url: "https://app.powerbi.com/view?r=example2",
        type: "powerbi",
        thumbnail: "/placeholder.svg?height=200&width=400",
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
        description: "Specifiche tecniche del progetto",
        url: "https://docs.example.com/doc1",
        type: "pdf",
        category: "Documentazione Tecnica",
        tags: ["specifiche", "tecnico", "capitolato"],
        createdAt: "2023-08-05",
        updatedAt: "2023-10-10",
        size: "2.5 MB",
      },
      {
        id: "doc-2",
        name: "Cronoprogramma",
        description: "Pianificazione temporale dei lavori",
        url: "https://docs.example.com/doc2",
        type: "xlsx",
        category: "Pianificazione",
        tags: ["timeline", "pianificazione", "gantt"],
        createdAt: "2023-08-10",
        updatedAt: "2023-10-15",
        size: "1.8 MB",
      },
      {
        id: "doc-3",
        name: "Relazione Tecnica",
        description: "Relazione tecnica del progetto",
        url: "https://docs.example.com/doc3",
        type: "docx",
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
      avatar: "/placeholder.svg",
      bio: "Project Manager con 10 anni di esperienza in progetti BIM",
      company: "Studio Tecnico Associato",
      order: 1, // Per ordinare i membri del team
    },
    {
      id: "team-2",
      name: "Laura Bianchi",
      role: "Architetto",
      email: "laura.bianchi@esempio.it",
      phone: "+39 123 456 7891",
      avatar: "/placeholder.svg",
      bio: "Architetto specializzato in progettazione BIM",
      company: "Studio Tecnico Associato",
      order: 2,
    },
    {
      id: "team-3",
      name: "Giovanni Verdi",
      role: "Ingegnere Strutturale",
      email: "giovanni.verdi@esempio.it",
      phone: "+39 123 456 7892",
      avatar: "/placeholder.svg",
      bio: "Ingegnere strutturale con esperienza in progetti complessi",
      company: "Studio Tecnico Associato",
      order: 3,
    },
    // Aggiungi altri membri del team qui
  ],

  // Contatti e informazioni aziendali
  contact: {
    company: "Studio Tecnico Associato",
    address: "Via Roma 123, 00100 Roma, Italia",
    email: "info@studiotecnico.it",
    phone: "+39 06 1234567",
    website: "https://www.studiotecnico.it",
    socialMedia: {
      linkedin: "https://www.linkedin.com/company/studiotecnico",
      twitter: "https://twitter.com/studiotecnico",
      facebook: "https://www.facebook.com/studiotecnico",
      instagram: "https://www.instagram.com/studiotecnico",
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

  // Personalizzazioni avanzate
  advanced: {
    customCSS: "", // CSS personalizzato aggiuntivo
    customJS: "", // JavaScript personalizzato aggiuntivo
    customFonts: ["Inter", "Roboto"], // Font personalizzati
    customComponents: {}, // Componenti React personalizzati
  },
}

// Esporta anche singole sezioni per un accesso più facile
export const generalConfig = projectConfig.general
export const brandingConfig = projectConfig.branding
export const seoConfig = projectConfig.seo
export const authConfig = projectConfig.auth
export const navigationConfig = projectConfig.navigation
export const modelsConfig = projectConfig.externalLinks.models
export const dashboardsConfig = projectConfig.externalLinks.dashboards
export const documentsConfig = projectConfig.externalLinks.documents
export const teamConfig = projectConfig.team
export const contactConfig = projectConfig.contact
export const featuresConfig = projectConfig.features
