import { projectConfig } from "@/config/project-config"

// Funzione per ottenere un valore di configurazione con percorso a punti
// Esempio: getConfigValue("general.name") restituisce projectConfig.general.name
export function getConfigValue(path: string, defaultValue: any = null): any {
  const keys = path.split(".")
  let result = projectConfig as any

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key]
    } else {
      return defaultValue
    }
  }

  return result !== undefined ? result : defaultValue
}

// Funzione per ottenere il colore primario con fallback
export function getPrimaryColor(): string {
  return projectConfig.branding?.primaryColor || "#0f766e"
}

// Funzione per ottenere il logo con fallback
export function getLogo(): string {
  return projectConfig.branding?.logo || "/placeholder.svg"
}

// Funzione per ottenere il nome del progetto con fallback
export function getProjectName(): string {
  return projectConfig.general?.name || "Progetto BIM"
}

// Funzione per verificare se una funzionalità è abilitata
export function isFeatureEnabled(featureName: string): boolean {
  return !!getConfigValue(`features.${featureName}`, false)
}

// Funzione per ottenere le risorse filtrate per categoria o tag
export function getResourcesByCategory(resourceType: "models" | "dashboards" | "documents", category: string): any[] {
  const resources = projectConfig.externalLinks?.[resourceType] || []
  return resources.filter((resource) => resource.category === category)
}

export function getResourcesByTag(resourceType: "models" | "dashboards" | "documents", tag: string): any[] {
  const resources = projectConfig.externalLinks?.[resourceType] || []
  return resources.filter((resource) => resource.tags && resource.tags.includes(tag))
}

// Funzione per ottenere i membri del team ordinati
export function getOrderedTeam(): any[] {
  return [...(projectConfig.team || [])].sort((a, b) => (a.order || 999) - (b.order || 999))
}

// Funzione per ottenere le voci di navigazione
export function getNavigation(): any[] {
  return projectConfig.navigation || []
}

// Funzione per ottenere il conteggio delle risorse
export function getResourceCount(resourceType: "models" | "dashboards" | "documents"): number {
  return projectConfig.externalLinks?.[resourceType]?.length || 0
}

// Funzione per ottenere tutte le risorse di un tipo
export function getResources(resourceType: "models" | "dashboards" | "documents"): any[] {
  return projectConfig.externalLinks?.[resourceType] || []
}

// Funzione per ottenere le immagini della galleria
export function getGalleryImages(onlyFeatured = false): any[] {
  const images = projectConfig.gallery?.images || []
  return onlyFeatured ? images.filter((img) => img.featured) : images
}

// Funzione per ottenere l'immagine principale del progetto
export function getMainImage(): string {
  return projectConfig.general?.mainMedia?.type === "image"
    ? projectConfig.general?.mainMedia?.image || "/placeholder.svg"
    : "/placeholder.svg"
}

// Funzione per ottenere il video principale del progetto
export function getMainVideo(): string {
  return projectConfig.general?.mainMedia?.type === "video" ? projectConfig.general?.mainMedia?.video || "" : ""
}

// Funzione per ottenere il tipo di media principale
export function getMainMediaType(): "image" | "video" {
  return projectConfig.general?.mainMedia?.type === "video" ? "video" : "image"
}

// Funzione per formattare una data
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch (e) {
    return dateString
  }
}
