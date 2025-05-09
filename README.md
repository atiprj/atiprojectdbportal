# Template Sito Progetto BIM

Questo è un template di base per creare rapidamente siti web per la visualizzazione e condivisione di progetti BIM. Il template è progettato per essere facilmente duplicabile e personalizzabile per ogni nuovo progetto.

## Come utilizzare questo template

1. **Duplica il repository** per creare un nuovo progetto
2. **Personalizza la configurazione** modificando il file `config/project-config.ts`
3. **Aggiorna i contenuti** specifici del progetto
4. **Pubblica** il sito su Vercel, Netlify o altra piattaforma

## Personalizzazione

### Configurazione del progetto

Il file principale da modificare è `config/project-config.ts`. Questo file contiene tutte le informazioni specifiche del progetto:

- Nome e descrizione del progetto
- Informazioni sul cliente
- Collegamenti ai modelli 3D (Speckle, BIMPlus, ecc.)
- Collegamenti alle dashboard (PowerBI, Tableau, ecc.)
- Collegamenti ai documenti condivisi
- Informazioni sul team di progetto
- Voci di navigazione

### Personalizzazione visiva

Per personalizzare l'aspetto del sito:

1. Modifica il colore primario in `config/project-config.ts`
2. Sostituisci il logo del progetto
3. Personalizza il file `tailwind.config.js` per modificare ulteriormente i colori e lo stile

## Autenticazione

Il template include un sistema di autenticazione di base:

- Pagina di login per controllare l'accesso al progetto
- Protezione delle rotte per utenti non autenticati
- Gestione delle sessioni tramite localStorage

**Nota**: Questa è un'implementazione simulata per scopi dimostrativi. In un ambiente di produzione, dovresti integrare un sistema di autenticazione reale come Auth0, NextAuth.js o un backend personalizzato.

### Credenziali di test

Per la demo, puoi accedere con qualsiasi email e la password: `password`

### Personalizzazione dell'autenticazione

Per implementare un sistema di autenticazione reale:

1. Modifica il file `hooks/use-auth.tsx` per connetterti al tuo backend
2. Aggiorna la logica di login/logout secondo le tue esigenze
3. Considera l'aggiunta di funzionalità come la registrazione, il recupero password, ecc.

## Struttura del progetto

- `/app` - Pagine principali del sito
- `/components` - Componenti riutilizzabili
- `/config` - File di configurazione
- `/hooks` - Hook personalizzati (incluso l'autenticazione)
- `/public` - File statici (immagini, favicon, ecc.)

## Tecnologie utilizzate

- Next.js
- React
- Tailwind CSS
- shadcn/ui

## Licenza

MIT
