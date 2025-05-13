"use client"

import { useState } from "react"
import { Maximize2, PanelLeft, PanelRight, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModelViewerProps {
  url: string
  title: string
  type?: "speckle" | "bimplus" | "other"
}

export function ModelViewer({ url, title, type = "speckle" }: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="border rounded-md overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button variant="outline" size="icon" className="bg-white/90 h-8 w-8">
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="bg-white/90 h-8 w-8">
          <PanelRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="bg-white/90 h-8 w-8">
          <Layers className="h-4 w-4" />
        </Button>
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
        <iframe src={url} className="w-full h-full" title={title} allowFullScreen />
      </div>
    </div>
  )
}
