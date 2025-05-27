# Template Sito Progetto BIM

Questo è un template di base per creare rapidamente siti web per la visualizzazione e condivisione di progetti BIM. Il template è progettato per essere facilmente duplicabile e personalizzabile per ogni nuovo progetto.

## 🚀 Caratteristiche Principali

### 📊 Dashboard e Visualizzazioni
- **Modelli 3D**: Integrazione con Speckle, BIMPlus e altri viewer
- **Dashboard**: Supporto per PowerBI, Tableau e altre piattaforme
- **Documenti**: Gestione centralizzata di documenti di progetto
- **Notebook ML**: Integrazione con NotebookLM per analisi AI

### 🏗️ IFC Viewer Avanzato
- **Visualizzatore nativo**: Supporto completo per file IFC e Fragment
- **Gestione multimodello**: Carica e gestisci più modelli contemporaneamente
- **Strumenti di sezione**: Sezioni interattive su assi X, Y, Z con controlli precisi
- **Selezione elementi**: Click per visualizzare proprietà dettagliate
- **Classificazione BIM**: Albero di classificazione per categorie di elementi
- **Gestione visibilità**: Controllo granulare della visibilità per categoria
- **Dark/Light mode**: Interfaccia adattiva con supporto temi

## Come utilizzare questo template

1. **Duplica il repository** per creare un nuovo progetto
2. **Personalizza la configurazione** modificando il file `config/project-config.ts`
3. **Aggiungi le immagini** nella cartella `public/images/`
4. **Pubblica** il sito su Vercel, Netlify o altra piattaforma

## Guida completa alla configurazione

Il template utilizza un sistema di configurazione centralizzato che permette di personalizzare completamente il sito modificando un unico file: `config/project-config.ts`.

### Struttura delle cartelle per le immagini

Per organizzare le immagini in modo coerente, utilizza questa struttura di cartelle nella directory `public`:

\`\`\`
public/
├── images/
│   ├── logo.png                    # Logo del progetto
│   ├── progetto-principale.jpg     # Immagine principale
│   ├── gallery/                    # Immagini della galleria
│   │   ├── vista-frontale.jpg
│   │   ├── vista-laterale.jpg
│   │   └── interni.jpg
│   ├── thumbnails/                 # Miniature per modelli e dashboard
│   │   ├── modello-architettonico.jpg
│   │   ├── modello-strutturale.jpg
│   │   ├── dashboard-costi.jpg
│   │   └── dashboard-cronoprogramma.jpg
│   └── team/                       # Foto del team
│       ├── mario-rossi.jpg
│       ├── laura-bianchi.jpg
│       └── giovanni-verdi.jpg
├── favicon.ico                     # Favicon del sito
└── models/                         # File IFC/Fragment del progetto
    ├── architectural-model.ifc
    ├── structural-model.frag
    └── mep-model.ifc
\`\`\`

### Struttura del Progetto

\`\`\`
├── app/
│   ├── ifc-viewer/          # Visualizzatore IFC dedicato
│   ├── models/              # Modelli 3D esterni (Speckle, etc.)
│   ├── dashboards/          # Dashboard analitiche
│   ├── documents/           # Documenti di progetto
│   ├── notebooks/           # Notebook ML
│   └── ...
├── components/
│   ├── ifc/                 # Componenti IFC viewer
│   │   ├── ifc-viewer.tsx   # Componente principale
│   │   ├── section-gizmo.tsx # Strumenti di sezione
│   │   ├── model-manager.tsx # Gestione modelli
│   │   └── ...
│   └── ...
├── config/
│   └── project-config.ts    # Configurazione centralizzata
└── public/
    └── models/              # File IFC/Fragment del progetto
\`\`\`

### Guida alla configurazione per sezione

#### 1. Informazioni generali del progetto

\`\`\`typescript
general: {
  name: "Nome Progetto",                // Nome del progetto (visualizzato nell'header)
  description: "Descrizione...",        // Descrizione del progetto (visualizzata nella homepage)
  client: "Nome Cliente",               // Nome del cliente (visualizzato nel footer)
  location: "Località del Progetto",    // Località del progetto
  startDate: "2023-01-01",              // Data di inizio (formato YYYY-MM-DD)
  endDate: "2024-12-31",                // Data di fine prevista (formato YYYY-MM-DD)
  status: "In corso",                   // Stato del progetto
  
  // Immagine o video principale del progetto (mostrato nella homepage)
  mainMedia: {
    type: "image",                      // "image" o "video"
    image: "/images/progetto-principale.jpg", // Percorso all'immagine
    video: "",                          // URL di un video (es. YouTube embed URL)
    alt: "Vista principale del progetto", // Testo alternativo per l'immagine
  },
},
\`\`\`

#### 2. Branding e UI

\`\`\`typescript
branding: {
  logo: "/images/logo.png",             // Logo del progetto
  favicon: "/favicon.ico",              // Favicon del sito
  primaryColor: "#0f766e",              // Colore principale (usato per accenti)
  secondaryColor: "#0284c7",            // Colore secondario
  accentColor: "#f59e0b",               // Colore di accento
  darkMode: true,                       // Abilita/disabilita la modalità scura
},
\`\`\`

#### 3. Navigazione

\`\`\`typescript
navigation: [
  { name: "Home", href: "/" },          // Voci di menu nella navbar
  { name: "Modelli 3D", href: "/models" },
  { name: "Dashboard", href: "/dashboards" },
  { name: "Documenti", href: "/documents" },
  { name: "Galleria", href: "/gallery" },
  { name: "Team", href: "/team" },
  { name: "IFC Viewer", href: "/ifc-viewer" }, // Visualizzatore IFC dedicato
  // Aggiungi altre pagine personalizzate qui
],
\`\`\`

#### 4. Galleria di immagini

\`\`\`typescript
gallery: {
  title: "Galleria del Progetto",       // Titolo della pagina galleria
  description: "Immagini e rendering...", // Descrizione della galleria
  images: [
    {
      id: "img-1",                      // ID univoco dell'immagine
      title: "Vista frontale",          // Titolo dell'immagine
      description: "Vista frontale...", // Descrizione dettagliata
      path: "/images/gallery/vista-frontale.jpg", // Percorso all'immagine
      alt: "Vista frontale dell'edificio", // Testo alternativo
      featured: true,                   // Immagine in evidenza (mostrata per prima)
    },
    // Aggiungi altre immagini qui
  ],
},
\`\`\`

#### 5. Modelli 3D

\`\`\`typescript
models: [
  {
    id: "model-1",                      // ID univoco del modello
    name: "Modello Architettonico",     // Nome del modello
    description: "Modello 3D completo...", // Descrizione dettagliata
    url: "https://speckle.xyz/embed?stream=...", // URL di embed
    type: "speckle",                    // Tipo di modello (speckle, bimplus, altro)
    thumbnail: "/images/thumbnails/modello-architettonico.jpg", // Miniatura
    category: "Architettura",           // Categoria per il filtraggio
    tags: ["architettura", "3D", "BIM"], // Tag per il filtraggio
    createdAt: "2023-10-15",            // Data di creazione
    updatedAt: "2023-11-20",            // Data di ultimo aggiornamento
  },
  // Aggiungi altri modelli qui
],
\`\`\`

#### 6. Dashboard

\`\`\`typescript
dashboards: [
  {
    id: "dashboard-1",                  // ID univoco della dashboard
    name: "Analisi Costi",              // Nome della dashboard
    description: "Dashboard interattiva...", // Descrizione dettagliata
    url: "https://app.powerbi.com/view?r=...", // URL di embed
    type: "powerbi",                    // Tipo di dashboard (powerbi, tableau, altro)
    thumbnail: "/images/thumbnails/dashboard-costi.jpg", // Miniatura
    category: "Costi",                  // Categoria per il filtraggio
    tags: ["costi", "analisi", "budget"], // Tag per il filtraggio
    createdAt: "2023-09-10",            // Data di creazione
    updatedAt: "2023-11-15",            // Data di ultimo aggiornamento
  },
  // Aggiungi altre dashboard qui
],
\`\`\`

#### 7. Documenti

\`\`\`typescript
documents: [
  {
    id: "doc-1",                        // ID univoco del documento
    name: "Capitolato Tecnico",         // Nome del documento
    description: "Specifiche tecniche...", // Descrizione dettagliata
    url: "https://docs.example.com/doc1", // URL al documento
    type: "pdf",                        // Tipo di file (pdf, xlsx, docx, ecc.)
    icon: "file-text",                  // Nome dell'icona Lucide
    category: "Documentazione Tecnica", // Categoria per il filtraggio
    tags: ["specifiche", "tecnico"],    // Tag per il filtraggio
    createdAt: "2023-08-05",            // Data di creazione
    updatedAt: "2023-10-10",            // Data di ultimo aggiornamento
    size: "2.5 MB",                     // Dimensione del file
  },
  // Aggiungi altri documenti qui
],
\`\`\`

#### 8. Team

\`\`\`typescript
team: [
  {
    id: "team-1",                       // ID univoco del membro
    name: "Mario Rossi",                // Nome completo
    role: "Project Manager",            // Ruolo nel progetto
    email: "mario.rossi@esempio.it",    // Email di contatto
    phone: "+39 123 456 7890",          // Telefono di contatto
    avatar: "/images/team/mario-rossi.jpg", // Foto del membro
    bio: "Project Manager con 10 anni...", // Biografia dettagliata
    company: "Studio Tecnico Associato", // Azienda di appartenenza
    order: 1,                           // Ordine di visualizzazione
  },
  // Aggiungi altri membri del team qui
],
\`\`\`

#### 9. Configurazione IFC Viewer

\`\`\`typescript
ifcModels: [
  {
    id: "ifc-model-1",
    name: "Modello Architettonico",
    description: "Modello 3D completo dell'edificio",
    url: "/models/architectural-model.ifc",
    type: "ifc",
    category: "Architettura",
    visible: true, // Caricato automaticamente
    author: "Studio Tecnico",
    version: "1.2",
    tags: ["architettura", "3D", "BIM"]
  },
  // ... altri modelli
]
\`\`\`

### Consigli per la formattazione dei testi

#### Titoli e nomi

- Mantieni i titoli concisi e descrittivi
- Usa la maiuscola per la prima lettera di ogni parola importante
- Esempio: "Modello Architettonico", "Analisi Costi"

#### Descrizioni brevi

- Usa 1-2 frasi che riassumono l'elemento
- Mantieni sotto i 150 caratteri
- Esempio: "Modello 3D completo dell'edificio che include tutti gli elementi architettonici."

#### Descrizioni dettagliate

- Fornisci informazioni complete e dettagliate
- Usa 2-4 frasi per spiegare l'elemento in modo esaustivo
- Includi dettagli tecnici rilevanti
- Esempio: "Modello 3D completo dell'edificio che include tutti gli elementi architettonici, come muri, pavimenti, soffitti, porte, finestre e scale. Questo modello è stato creato utilizzando Revit e poi esportato in Speckle per la visualizzazione online."

### Consigli per le immagini

#### Immagine principale

- Dimensioni consigliate: 1200x675px (rapporto 16:9)
- Usa un'immagine di alta qualità che rappresenti bene il progetto
- Preferibilmente un rendering o una foto dell'edificio completo

#### Miniature

- Dimensioni consigliate: 400x225px (rapporto 16:9)
- Usa immagini chiare e rappresentative
- Mantieni uno stile coerente tra tutte le miniature

#### Foto del team

- Dimensioni consigliate: 600x800px (rapporto 3:4)
- Usa foto professionali con sfondo neutro
- Mantieni uno stile coerente per tutte le foto del team

#### Formati supportati

- Usa preferibilmente il formato JPG per fotografie e PNG per immagini con trasparenza
- Ottimizza le immagini per il web per ridurre i tempi di caricamento

## Autenticazione

Il template include un sistema di autenticazione di base:

- Pagina di login per controllare l'accesso al progetto
- Protezione delle rotte per utenti non autenticati
- Gestione delle sessioni tramite localStorage

**Nota**: Questa è un'implementazione simulata per scopi dimostrativi. In un ambiente di produzione, dovresti integrare un sistema di autenticazione reale come Auth0, NextAuth.js o un backend personalizzato.

### Credenziali di test

Per la demo, puoi accedere con le credenziali specificate nel file di configurazione:

\`\`\`typescript
auth: {
  demoCredentials: {
    email: "demo@esempio.it",
    password: "password",
  },
}
\`\`\`

## Licenza

MIT
