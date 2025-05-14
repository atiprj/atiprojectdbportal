"use client"

import { useState, useEffect } from "react"
import { Maximize2, ExternalLink, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NotebookViewerProps {
  url: string
  title: string
  type?: "colab" | "jupyter" | "other"
}

export function NotebookViewer({ url, title, type = "colab" }: NotebookViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Assicuriamoci che l'URL sia formattato correttamente per l'embedding
  const getEmbedUrl = (url: string, type: string) => {
    if (type === "colab") {
      // Se l'URL è già un URL di embedding, lo restituiamo così com'è
      if (url.includes("outputonly=1") || url.includes("embedded=true")) {
        return url
      }

      // Altrimenti, aggiungiamo i parametri per l'embedding
      const separator = url.includes("?") ? "&" : "?"
      return `${url}${separator}outputonly=1&embedded=true`
    }

    return url
  }

  const embedUrl = getEmbedUrl(url, type)

  // Gestisce il caricamento e gli errori dell'iframe
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Resetta lo stato quando cambia l'URL
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [url])

  return (
    <div className="border rounded-md overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 h-8 w-8"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className={`aspect-video ${isFullscreen ? "fixed inset-0 z-50 aspect-auto" : ""}`}>
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="animate-pulse text-center">
              <div className="h-8 w-32 bg-muted-foreground/20 rounded-md mx-auto mb-4"></div>
              <div className="h-4 w-48 bg-muted-foreground/20 rounded-md mx-auto"></div>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="w-full h-full flex items-center justify-center bg-background p-6">
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Errore di accesso al notebook</AlertTitle>
              <AlertDescription>
                Non è possibile visualizzare questo notebook. Potrebbe essere necessaria l'autorizzazione o il notebook
                potrebbe non essere più disponibile.
              </AlertDescription>
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apri in {type === "colab" ? "Google Colab" : "Notebook"}
                  </a>
                </Button>
              </div>
            </Alert>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            className={`w-full h-full ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
            title={title}
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>

      <div className="p-4 bg-white">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Apri in {type === "colab" ? "Google Colab" : "Notebook"}
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
