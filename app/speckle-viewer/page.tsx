"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, ArrowLeft, Maximize2, Layers, PanelLeft, PanelRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SpeckleViewerPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // URL di esempio di un modello Speckle
  const speckleUrl = "https://speckle.xyz/embed?stream=8a0f2c5be8&commit=9bd8171f4c"

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Building2 className="h-6 w-6" />
            </Link>
            <span className="text-xl font-bold">BIMShare</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla dashboard
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Visualizzatore Speckle</h1>

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
            <iframe src={speckleUrl} className="w-full h-full" title="Speckle Viewer" allowFullScreen />
          </div>
        </div>
      </main>
    </div>
  )
}
