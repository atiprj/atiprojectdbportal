"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface NotebookThumbnailGeneratorProps {
  onThumbnailGenerated: (thumbnailUrl: string) => void
}

export function NotebookThumbnailGenerator({ onThumbnailGenerated }: NotebookThumbnailGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [notebookUrl, setNotebookUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Funzione per generare una miniatura basata sul titolo del notebook
  const generateThumbnail = () => {
    if (!canvasRef.current) return

    setIsGenerating(true)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Estrai il nome del notebook dall'URL o usa un nome predefinito
    let notebookName = "Notebook ML"
    try {
      const url = new URL(notebookUrl)
      const pathParts = url.pathname.split("/")
      if (pathParts.length > 2) {
        notebookName = decodeURIComponent(pathParts[pathParts.length - 1])
      }
    } catch (e) {
      // Usa il nome predefinito
    }

    // Imposta le dimensioni del canvas
    canvas.width = 1200
    canvas.height = 630

    // Disegna lo sfondo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#f0f4f8")
    gradient.addColorStop(1, "#d9e2ec")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Disegna un bordo
    ctx.strokeStyle = "#cbd5e0"
    ctx.lineWidth = 10
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // Disegna il titolo
    ctx.fillStyle = "#1a202c"
    ctx.font = "bold 60px 'IBM Plex Mono', monospace"
    ctx.textAlign = "center"

    // Tronca il titolo se è troppo lungo
    let title = notebookName
    if (title.length > 30) {
      title = title.substring(0, 27) + "..."
    }

    ctx.fillText(title, canvas.width / 2, 200)

    // Disegna il sottotitolo
    ctx.fillStyle = "#4a5568"
    ctx.font = "40px 'IBM Plex Mono', monospace"
    ctx.fillText("Google Colab Notebook", canvas.width / 2, 280)

    // Disegna una decorazione
    ctx.fillStyle = "#4299e1"
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 400, 100, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 120px 'IBM Plex Mono', monospace"
    ctx.fillText("ML", canvas.width / 2, 440)

    // Disegna il footer
    ctx.fillStyle = "#4a5568"
    ctx.font = "30px 'IBM Plex Mono', monospace"
    ctx.fillText("Generato per BIM Project", canvas.width / 2, 580)

    // Converti il canvas in URL
    setTimeout(() => {
      try {
        const thumbnailUrl = canvas.toDataURL("image/png")
        onThumbnailGenerated(thumbnailUrl)
      } catch (e) {
        console.error("Errore nella generazione della miniatura:", e)
      } finally {
        setIsGenerating(false)
      }
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notebook-url">URL del notebook Google Colab</Label>
        <Input
          id="notebook-url"
          value={notebookUrl}
          onChange={(e) => setNotebookUrl(e.target.value)}
          placeholder="https://colab.research.google.com/drive/..."
        />
      </div>

      <Button onClick={generateThumbnail} disabled={isGenerating || !notebookUrl}>
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generazione in corso...
          </>
        ) : (
          "Genera miniatura"
        )}
      </Button>

      <div className="mt-4">
        <canvas ref={canvasRef} className="hidden" width="1200" height="630" />
      </div>
    </div>
  )
}
