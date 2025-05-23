"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { ModelViewer } from "@/components/models/model-viewer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getResources } from "@/utils/config-utils"
import { ResourceSearch } from "@/components/search/resource-search"
import { searchResourcesByType } from "@/utils/search-utils"

export default function ModelsPage() {
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("id")

  const [models, setModels] = useState<any[]>([])
  const [filteredModels, setFilteredModels] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const modelsList = getResources("models")
    setModels(modelsList)
    setFilteredModels(modelsList)

    // Se c'è un ID nei parametri di ricerca, seleziona quel modello
    if (selectedId) {
      const model = modelsList.find((m) => m.id === selectedId)
      if (model) {
        setSelectedModel(model)
        return
      }
    }

    // Altrimenti seleziona il primo modello
    if (modelsList.length > 0) {
      setSelectedModel(modelsList[0])
    }
  }, [selectedId])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query) {
      setFilteredModels(models)
    } else {
      const results = searchResourcesByType(query, "models")
      setFilteredModels(results)
    }
  }

  if (!selectedModel) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
            <h1 className="text-3xl font-bold mb-6">Modelli 3D</h1>
            <p>Nessun modello disponibile.</p>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
          <h1 className="text-3xl font-bold mb-6">Modelli 3D</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Modelli disponibili</h2>

                <ResourceSearch onSearch={handleSearch} placeholder="Cerca modelli..." className="mb-4" />

                {filteredModels.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nessun modello trovato per "{searchQuery}"</p>
                ) : (
                  <div className="space-y-2">
                    {filteredModels.map((model) => (
                      <Card
                        key={model.id}
                        className={`cursor-pointer transition-all ${selectedModel.id === model.id ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setSelectedModel(model)}
                      >
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">{model.name}</CardTitle>
                          <CardDescription className="text-xs">{model.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-3">
              <ModelViewer
                url={selectedModel.url}
                title={selectedModel.name}
                type={selectedModel.type as "speckle" | "bimplus" | "other"}
              />
              <div className="p-4 bg-white border border-t-0 rounded-b-md">
                <h3 className="text-lg font-medium mb-1">{selectedModel.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{selectedModel.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedModel.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apri in {selectedModel.type === "speckle" ? "Speckle" : "Visualizzatore"}
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Condividi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
