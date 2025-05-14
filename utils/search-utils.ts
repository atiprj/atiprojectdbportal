import { projectConfig } from "@/config/project-config"

// Funzione per normalizzare il testo per la ricerca
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Rimuove gli accenti
    .trim()
}

// Funzione per verificare se un testo contiene una query di ricerca
function textContains(text: string | undefined | null, query: string): boolean {
  if (!text) return false
  return normalizeText(text).includes(normalizeText(query))
}

// Funzione per cercare nei modelli 3D
function searchModels(query: string): any[] {
  const models = projectConfig.externalLinks?.models || []
  return models
    .filter(
      (model) =>
        textContains(model.name, query) ||
        textContains(model.description, query) ||
        (model.tags && model.tags.some((tag: string) => textContains(tag, query))) ||
        textContains(model.category, query),
    )
    .map((model) => ({
      ...model,
      type: "model",
      url: `/models?id=${model.id}`,
    }))
}

// Funzione per cercare nelle dashboard
function searchDashboards(query: string): any[] {
  const dashboards = projectConfig.externalLinks?.dashboards || []
  return dashboards
    .filter(
      (dashboard) =>
        textContains(dashboard.name, query) ||
        textContains(dashboard.description, query) ||
        (dashboard.tags && dashboard.tags.some((tag: string) => textContains(tag, query))) ||
        textContains(dashboard.category, query),
    )
    .map((dashboard) => ({
      ...dashboard,
      type: "dashboard",
      url: `/dashboards?id=${dashboard.id}`,
    }))
}

// Funzione per cercare nei documenti
function searchDocuments(query: string): any[] {
  const documents = projectConfig.externalLinks?.documents || []
  return documents
    .filter(
      (document) =>
        textContains(document.name, query) ||
        textContains(document.description, query) ||
        (document.tags && document.tags.some((tag: string) => textContains(tag, query))) ||
        textContains(document.category, query) ||
        textContains(document.type, query),
    )
    .map((document) => ({
      ...document,
      type: "document",
      url: `/documents?id=${document.id}`,
      originalUrl: document.url, // Aggiungiamo l'URL originale del documento
    }))
}

// Funzione per cercare nei notebook
function searchNotebooks(query: string): any[] {
  const notebooks = projectConfig.externalLinks?.notebooks || []
  return notebooks
    .filter(
      (notebook) =>
        textContains(notebook.name, query) ||
        textContains(notebook.description, query) ||
        (notebook.tags && notebook.tags.some((tag: string) => textContains(tag, query))) ||
        textContains(notebook.category, query) ||
        textContains(notebook.author, query),
    )
    .map((notebook) => ({
      ...notebook,
      type: "notebook",
      url: `/notebooks?id=${notebook.id}`,
    }))
}

// Funzione principale per cercare in tutte le risorse
export function searchResources(query: string): any[] {
  if (!query.trim()) return []

  const results = [
    ...searchModels(query),
    ...searchDashboards(query),
    ...searchDocuments(query),
    ...searchNotebooks(query),
  ]

  // Ordina i risultati per rilevanza (per ora, semplice ordinamento alfabetico)
  return results.sort((a, b) => a.name.localeCompare(b.name))
}

// Funzione per cercare in una specifica sezione
export function searchResourcesByType(query: string, type: "models" | "dashboards" | "documents" | "notebooks"): any[] {
  switch (type) {
    case "models":
      return searchModels(query)
    case "dashboards":
      return searchDashboards(query)
    case "documents":
      return searchDocuments(query)
    case "notebooks":
      return searchNotebooks(query)
    default:
      return []
  }
}
