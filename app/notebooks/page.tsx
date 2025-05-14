"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { NotebookViewer } from "@/components/notebooks/notebook-viewer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getResources } from "@/utils/config-utils"

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<any[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<any>(null)

  useEffect(() => {
    const notebooksList = getResources("notebooks")
    setNotebooks(notebooksList)
    if (notebooksList.length > 0) {
      setSelectedNotebook(notebooksList[0])
    }
  }, [])

  if (!selectedNotebook) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
            <h1 className="text-3xl font-bold mb-6">Notebook ML</h1>
            <p>Nessun notebook disponibile.</p>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
          <h1 className="text-3xl font-bold mb-6">Notebook ML</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Notebook disponibili</h2>
                <div className="space-y-2">
                  {notebooks.map((notebook) => (
                    <Card
                      key={notebook.id}
                      className={`cursor-pointer transition-all ${selectedNotebook.id === notebook.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedNotebook(notebook)}
                    >
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">{notebook.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {notebook.author} • {new Date(notebook.updatedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <NotebookViewer
                url={selectedNotebook.url}
                title={selectedNotebook.name}
                type={selectedNotebook.type as "colab" | "jupyter" | "other"}
              />
              <div className="p-4 bg-white border border-t-0 rounded-b-md">
                <h3 className="text-lg font-medium mb-1">{selectedNotebook.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{selectedNotebook.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedNotebook.tags &&
                    selectedNotebook.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedNotebook.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apri in {selectedNotebook.type === "colab" ? "Google Colab" : "Notebook"}
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
