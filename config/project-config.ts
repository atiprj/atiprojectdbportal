// Configurazione del progetto - Modifica questo file per personalizzare il sito per ogni progetto
export const projectConfig = {
  // Informazioni generali del progetto
  name: "Nome Progetto",
  description: "Descrizione dettagliata del progetto",
  client: "Nome Cliente",
  location: "Località del Progetto",
  startDate: "2023-01-01",
  endDate: "2024-12-31",

  // Branding
  logo: "/placeholder.svg?height=40&width=40", // Sostituire con il logo del progetto
  primaryColor: "#0f766e", // Colore principale del progetto (teal-700)

  // Collegamenti esterni
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
      },
      {
        id: "model-2",
        name: "Modello Strutturale",
        description: "Struttura portante dell'edificio",
        url: "https://speckle.xyz/embed?stream=8a0f2c5be8&commit=9bd8171f4c",
        type: "speckle",
        thumbnail: "/placeholder.svg?height=200&width=400",
      },
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
      },
      {
        id: "dashboard-2",
        name: "Cronoprogramma",
        description: "Avanzamento lavori e timeline",
        url: "https://app.powerbi.com/view?r=example2",
        type: "powerbi",
        thumbnail: "/placeholder.svg?height=200&width=400",
      },
    ],

    // Documenti (SharePoint, Google Drive, ecc.)
    documents: [
      {
        id: "doc-1",
        name: "Capitolato Tecnico",
        description: "Specifiche tecniche del progetto",
        url: "https://docs.example.com/doc1",
        type: "pdf",
      },
      {
        id: "doc-2",
        name: "Cronoprogramma",
        description: "Pianificazione temporale dei lavori",
        url: "https://docs.example.com/doc2",
        type: "xlsx",
      },
      {
        id: "doc-3",
        name: "Relazione Tecnica",
        description: "Relazione tecnica del progetto",
        url: "https://docs.example.com/doc3",
        type: "docx",
      },
    ],
  },

  // Membri del team
  team: [
    {
      id: "team-1",
      name: "Mario Rossi",
      role: "Project Manager",
      email: "mario.rossi@esempio.it",
      avatar: "/placeholder.svg",
    },
    {
      id: "team-2",
      name: "Laura Bianchi",
      role: "Architetto",
      email: "laura.bianchi@esempio.it",
      avatar: "/placeholder.svg",
    },
    {
      id: "team-3",
      name: "Giovanni Verdi",
      role: "Ingegnere Strutturale",
      email: "giovanni.verdi@esempio.it",
      avatar: "/placeholder.svg",
    },
  ],

  // Navigazione personalizzata - Aggiungere o rimuovere voci di menu
  navigation: [
    { name: "Home", href: "/" },
    { name: "Modelli 3D", href: "/models" },
    { name: "Dashboard", href: "/dashboards" },
    { name: "Documenti", href: "/documents" },
    { name: "Team", href: "/team" },
  ],
}
