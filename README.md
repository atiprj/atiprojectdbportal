# Template Sito Progetto BIM

Questo è un template di base per creare rapidamente siti web per la visualizzazione e condivisione di progetti BIM. Il template è progettato per essere facilmente duplicabile e personalizzabile per ogni nuovo progetto.

## Come utilizzare questo template

1. **Duplica il repository** per creare un nuovo progetto
2. **Personalizza la configurazione** modificando il file `config/project-config.ts`
3. **Pubblica** il sito su Vercel, Netlify o altra piattaforma

## Sistema di configurazione centralizzato

Il template utilizza un sistema di configurazione centralizzato che permette di personalizzare completamente il sito modificando un unico file: `config/project-config.ts`.

### Struttura del file di configurazione

Il file di configurazione è organizzato in sezioni:

- **general**: Informazioni generali del progetto (nome, descrizione, date, ecc.)
- **branding**: Personalizzazione visiva (logo, colori, ecc.)
- **seo**: Metadati per i motori di ricerca
- **auth**: Configurazione dell'autenticazione
- **navigation**: Voci di menu personalizzate
- **externalResources**: Collegamenti a modelli 3D, dashboard e documenti
- **team**: Informazioni sui membri del team
- **contact**: Informazioni di contatto
- **features**: Funzionalità opzionali da abilitare/disabilitare
- **advanced**: Personalizzazioni avanzate (CSS, JS, ecc.)

### Come modificare la configurazione

Per personalizzare il sito per un nuovo progetto:

1. Apri il file `config/project-config.ts`
2. Modifica i valori nelle varie sezioni secondo le tue esigenze
3. Salva il file e riavvia il server di sviluppo

### Utilizzo delle utilità di configurazione

Il template include un file di utilità `utils/config-utils.ts` che fornisce funzioni per accedere facilmente ai valori di configurazione:

\`\`\`typescript
import { getProjectName, getPrimaryColor, isFeatureEnabled } from "@/utils/config-utils"

// Ottieni il nome del progetto
const projectName = getProjectName()

// Ottieni il colore primario
const primaryColor = getPrimaryColor()

// Verifica se una funzionalità è abilitata
const commentsEnabled = isFeatureEnabled("enableComments")
\`\`\`

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

## Struttura del progetto

- `/app` - Pagine principali del sito
- `/components` - Componenti riutilizzabili
- `/config` - File di configurazione
- `/hooks` - Hook personalizzati (incluso l'autenticazione)
- `/utils` - Funzioni di utilità
- `/public` - File statici (immagini, favicon, ecc.)

## Tecnologie utilizzate

- Next.js
- React
- Tailwind CSS
- shadcn/ui

## Licenza

MIT
\`\`\`

Ora, per dimostrare come utilizzare questo sistema di configurazione, aggiorniamo il componente MainLayout:
