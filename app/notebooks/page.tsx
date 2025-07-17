"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { NotebookViewer } from "@/components/notebooks/notebook-viewer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getResources } from "@/utils/config-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NotebooksPage() {
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("id")

  const [notebooks, setNotebooks] = useState<any[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<any>(null)

  useEffect(() => {
    const notebooksList = getResources("notebooks")
    setNotebooks(notebooksList)

    // Se c'è un ID nei parametri di ricerca, seleziona quel notebook
    if (selectedId) {
      const notebook = notebooksList.find((n) => n.id === selectedId)
      if (notebook) {
        setSelectedNotebook(notebook)
        return
      }
    }

    // Altrimenti seleziona il primo notebook
    if (notebooksList.length > 0) {
      setSelectedNotebook(notebooksList[0])
    }
  }, [selectedId])

  if (!selectedNotebook) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
            <h1 className="text-3xl font-bold mb-6">NotebookLM</h1>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Nessun NotebookLM disponibile</AlertTitle>
              <AlertDescription>
                Non ci sono NotebookLM disponibili in questo momento. Controlla più tardi o contatta l'amministratore.
              </AlertDescription>
            </Alert>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
          <h1 className="text-3xl font-bold mb-6">NotebookLM</h1>

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
              <NotebookViewer notebook={selectedNotebook} />
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
