"use client"

import { useState } from "react"
import { Maximize2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotebookViewerProps {
  url: string
  title: string
  type?: "colab" | "jupyter" | "other"
}

export function NotebookViewer({ url, title, type = "colab" }: NotebookViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

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
        <iframe src={embedUrl} className="w-full h-full" title={title} allowFullScreen />
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
