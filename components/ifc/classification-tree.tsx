"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { CollapsiblePanel } from "./ui/collapsible-panel"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"

// Aggiorna il componente per supportare più modelli
interface ClassificationTreeProps {
  models: Map<string, any> // Cambiato da model singolo a models multipli
  fragments: any
  isModelLoaded: boolean
}

// Aggiorna l'interfaccia ClassificationItem per includere modelId
interface ClassificationItem {
  name: string
  count: number
  visible: boolean
  children: ClassificationItem[]
  ids: number[]
  expanded?: boolean
  modelId?: string // Aggiungi questo campo
}

interface ClassificationGroup {
  name: string
  label: string
  items: ClassificationItem[]
  expanded: boolean
}

export function ClassificationTree({ models, fragments, isModelLoaded }: ClassificationTreeProps) {
  const [classifications, setClassifications] = useState<ClassificationGroup[]>([])
  const [loading, setLoading] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  // Carica le classificazioni quando il modello è caricato
  useEffect(() => {
    if (isModelLoaded && models) {
      loadClassifications()
    }
  }, [isModelLoaded, models])

  // Funzione helper per ottenere l'ID locale di un elemento
  const getElementLocalId = async (item: any): Promise<number | null> => {
    try {
      if (typeof item === "number") {
        return item
      }
      if (item && typeof item.getLocalId === "function") {
        return await item.getLocalId()
      }
      if (item && item.localId !== undefined) {
        return item.localId
      }
      if (item && item.id !== undefined) {
        return item.id
      }
      return null
    } catch (error) {
      console.warn("Error getting local ID:", error)
      return null
    }
  }

  // Aggiorna la funzione loadClassifications per gestire più modelli
  const loadClassifications = async () => {
    try {
      setLoading(true)

      // Crea i gruppi di classificazione per tutti i modelli
      const groups: ClassificationGroup[] = []

      // Per ogni modello caricato
      for (const [modelId, modelInfo] of models) {
        const model = modelInfo.model || modelInfo // Supporta entrambi i formati

        try {
          // Ottieni tutte le categorie del modello
          const categories = await model.getCategories()

          // Crea un gruppo per questo modello
          const modelGroup: ClassificationGroup = {
            name: `model_${modelId}`,
            label: `${modelInfo.name || modelId}`,
            items: [],
            expanded: true,
          }

          // Per ogni categoria, crea un elemento
          for (const category of categories) {
            try {
              // Ottieni gli elementi della categoria
              const items = await model.getItemsOfCategory(category)

              // Ottieni gli ID locali
              const localIds: number[] = []
              for (const item of items) {
                const localId = await getElementLocalId(item)
                if (localId !== null) {
                  localIds.push(localId)
                }
              }

              // Aggiungi l'elemento al gruppo
              if (localIds.length > 0) {
                modelGroup.items.push({
                  name: category,
                  count: localIds.length,
                  visible: true,
                  children: [],
                  ids: localIds,
                  modelId: modelId, // Aggiungi l'ID del modello
                })
              }
            } catch (error) {
              console.warn(`Error processing category ${category} for model ${modelId}:`, error)
            }
          }

          // Ordina gli elementi per nome
          modelGroup.items.sort((a, b) => a.name.localeCompare(b.name))

          // Aggiungi il gruppo se ha elementi
          if (modelGroup.items.length > 0) {
            groups.push(modelGroup)
          }
        } catch (error) {
          console.warn(`Error processing model ${modelId}:`, error)
        }
      }

      setClassifications(groups)
      setLoading(false)
    } catch (error) {
      console.error("Error loading classifications:", error)
      setLoading(false)
    }
  }

  // Aggiorna la funzione toggleItemVisibility per gestire il modello specifico
  const toggleItemVisibility = async (groupIndex: number, itemIndex: number) => {
    if (!models || !fragments) return

    try {
      setLoading(true)
      const group = classifications[groupIndex]
      const item = group.items[itemIndex]

      if (item.ids.length === 0) {
        setLoading(false)
        return
      }

      // Trova il modello corretto
      const modelInfo = models.get(item.modelId)
      const model = modelInfo?.model || modelInfo

      if (!model) {
        console.error(`Model not found: ${item.modelId}`)
        setLoading(false)
        return
      }

      // Inverti la visibilità
      const newVisibility = !item.visible

      // Aggiorna la visibilità nel modello
      await model.setVisible(item.ids, newVisibility)

      // Aggiorna la visualizzazione
      await fragments.update(true)

      // Aggiorna lo stato
      const newClassifications = [...classifications]
      newClassifications[groupIndex].items[itemIndex].visible = newVisibility
      setClassifications(newClassifications)

      setLoading(false)
    } catch (error) {
      console.error("Error toggling visibility:", error)
      setLoading(false)
    }
  }

  // Funzione per espandere/comprimere un gruppo
  const toggleGroupExpansion = (groupIndex: number) => {
    const newClassifications = [...classifications]
    newClassifications[groupIndex].expanded = !newClassifications[groupIndex].expanded
    setClassifications(newClassifications)
  }

  // Aggiorna la funzione showAll per gestire tutti i modelli
  const showAll = async () => {
    if (!models || !fragments) return

    try {
      setLoading(true)

      // Per ogni modello, mostra tutti gli elementi
      for (const [modelId, modelInfo] of models) {
        const model = modelInfo?.model || modelInfo
        if (!model) continue

        // Ottieni tutti gli elementi del modello
        const allIds: number[] = []
        const group = classifications.find((g) => g.name === `model_${modelId}`)
        if (group) {
          for (const item of group.items) {
            allIds.push(...item.ids)
          }

          // Mostra tutti gli elementi
          if (allIds.length > 0) {
            await model.setVisible(allIds, true)
          }
        }
      }

      // Aggiorna la visualizzazione
      await fragments.update(true)

      // Aggiorna lo stato
      const newClassifications = classifications.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          visible: true,
        })),
      }))

      setClassifications(newClassifications)
      setLoading(false)
    } catch (error) {
      console.error("Error showing all elements:", error)
      setLoading(false)
    }
  }

  if (!isModelLoaded) {
    return null
  }

  return (
    <div className="w-80">
      <CollapsiblePanel
        title="Selezione elemento"
        defaultOpen={true}
        className="w-full"
        rightElement={
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              loadClassifications()
            }}
            disabled={loading}
            title="Aggiorna classificazioni"
            className="h-6 w-6"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        }
      >
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Caricamento...</span>
            </div>
          ) : classifications.length > 0 ? (
            <>
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-1 pr-2">
                  {classifications.map((group, groupIndex) => (
                    <div key={group.name}>
                      {/* Group Header */}
                      <div
                        className={`flex items-center py-2 cursor-pointer rounded px-2 font-medium ${
                          isDarkTheme ? "hover:bg-gray-700/50 text-gray-100" : "hover:bg-gray-100/50 text-gray-900"
                        }`}
                        onClick={() => toggleGroupExpansion(groupIndex)}
                      >
                        {group.expanded ? (
                          <ChevronDown className={`h-4 w-4 mr-2 ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`} />
                        ) : (
                          <ChevronRight className={`h-4 w-4 mr-2 ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`} />
                        )}
                        <span className="text-sm">{group.label}</span>
                      </div>

                      {/* Group Items */}
                      {group.expanded && (
                        <div className="ml-2 space-y-1">
                          {group.items.map((item, itemIndex) => (
                            <div
                              key={item.name}
                              className={`flex items-center justify-between py-2 rounded px-3 min-h-[32px] ${
                                isDarkTheme
                                  ? "hover:bg-gray-700/30 text-gray-200"
                                  : "hover:bg-gray-100/30 text-gray-800"
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                  <div className={`w-px h-3 ${isDarkTheme ? "bg-gray-500" : "bg-gray-400"}`} />
                                </div>
                                <span
                                  className={`text-sm font-mono truncate ${
                                    isDarkTheme ? "text-gray-200" : "text-gray-700"
                                  }}`}
                                >
                                  {item.name}
                                </span>
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleItemVisibility(groupIndex, itemIndex)
                                }}
                                className="cursor-pointer flex-shrink-0 ml-2"
                              >
                                <div
                                  className={`w-5 h-5 rounded-sm border-2 ${
                                    item.visible
                                      ? "bg-blue-600 border-blue-600"
                                      : isDarkTheme
                                        ? "border-gray-600 bg-gray-800"
                                        : "border-gray-300 bg-white"
                                  } flex items-center justify-center transition-colors`}
                                >
                                  {item.visible && (
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10 3L4.5 8.5L2 6"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className={`pt-2 border-t ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
                <Button
                  variant="outline"
                  className={`w-full text-sm ${isDarkTheme ? "border-gray-700 hover:bg-gray-800" : ""}`}
                  onClick={showAll}
                  disabled={loading}
                >
                  Show All
                </Button>
              </div>
            </>
          ) : (
            <div className={`text-center py-4 ${isDarkTheme ? "text-gray-400" : "text-gray-500"} text-sm`}>
              Nessuna classificazione disponibile
            </div>
          )}
        </div>
      </CollapsiblePanel>
    </div>
  )
}
