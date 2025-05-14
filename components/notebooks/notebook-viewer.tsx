"use client"

import { useState } from "react"
import { ExternalLink, FileText, Code, BookOpen, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NotebookViewerProps {
  notebook: {
    id: string
    name: string
    description: string
    url: string
    type: string
    author?: string
    updatedAt?: string
    tags?: string[]
    thumbnail?: string
  }
}

export function NotebookViewer({ notebook }: NotebookViewerProps) {
  const [copied, setCopied] = useState(false)

  // Funzione per copiare l'URL negli appunti
  const copyToClipboard = () => {
    navigator.clipboard.writeText(notebook.url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Formatta la data
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
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

  return (
    <div className="space-y-6">
      {/* Intestazione del notebook */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-1">{notebook.name}</CardTitle>
              <CardDescription>
                {notebook.author && <span className="font-medium">{notebook.author}</span>}
                {notebook.author && notebook.updatedAt && <span> • </span>}
                {notebook.updatedAt && <span>Aggiornato il {formatDate(notebook.updatedAt)}</span>}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={notebook.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Apri in Google Colab
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{notebook.description}</p>

          {/* Tag del notebook */}
          {notebook.tags && notebook.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {notebook.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Anteprima statica o immagine */}
          <div className="mt-4 border rounded-md overflow-hidden">
            {notebook.thumbnail ? (
              <img
                src={notebook.thumbnail || "/placeholder.svg"}
                alt={`Anteprima di ${notebook.name}`}
                className="w-full object-cover"
              />
            ) : (
              <div className="bg-muted p-8 flex flex-col items-center justify-center text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Anteprima non disponibile</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Questo notebook richiede l'accesso a Google Colab. Clicca sul pulsante "Apri in Google Colab" per
                  visualizzare il contenuto completo.
                </p>
              </div>
            )}
          </div>

          {/* Azioni aggiuntive */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              {copied ? "URL copiato!" : "Copia URL"}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Condividi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informazioni sul notebook */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informazioni sul notebook</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Descrizione</h4>
              <p className="text-sm text-muted-foreground">{notebook.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Code className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Funzionalità</h4>
              <p className="text-sm text-muted-foreground">
                Questo notebook utilizza tecniche di NLP per analizzare i documenti del progetto, estrarre informazioni
                chiave e generare insights.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Come utilizzare questo notebook</h4>
              <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                <li>Clicca su "Apri in Google Colab" per aprire il notebook nel tuo browser</li>
                <li>Accedi con il tuo account Google se richiesto</li>
                <li>Utilizza il menu "Runtime" per eseguire le celle del notebook</li>
                <li>Segui le istruzioni all'interno del notebook per l'analisi dei documenti</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
