"use client"

import { IfcViewerComponent } from "@/components/ifc/ifc-viewer"
import { Toaster } from "@/components/ui/toaster"

export default function IfcViewerPage() {
  return (
    // Rimuoviamo completamente il ThemeProvider
    <div className="h-screen w-full">
      <IfcViewerComponent />
      <Toaster />
    </div>
  )
}
