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
                Apri in NotebookLM
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

          {/* Informazioni sul notebook */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={notebook.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apri in NotebookLM
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? "URL copiato!" : "Copia URL"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Condividi
              </Button>
            </div>
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
                Questo notebook utilizza NotebookLM, uno strumento basato su modelli di linguaggio avanzati, per
                analizzare i documenti del progetto, estrarre informazioni chiave e generare insights.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Come utilizzare questo notebook</h4>
              <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                <li>Clicca su "Apri in NotebookLM" per aprire il notebook nel tuo browser</li>
                <li>Accedi con il tuo account Google se richiesto</li>
                <li>Interagisci con i documenti caricati utilizzando l'interfaccia di NotebookLM</li>
                <li>Utilizza le funzionalità di AI per analizzare e comprendere i documenti del progetto</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
