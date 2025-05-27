"use client"

import { IfcViewerComponent } from "@/components/ifc/ifc-viewer"
import { ThemeProvider } from "@/components/ifc/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export default function IfcViewerPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="h-screen w-full">
        <IfcViewerComponent />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
