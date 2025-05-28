"use client"

import { useState } from "react"
import { Maximize2, ArrowLeft, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getNavigation } from "@/utils/config-utils"

interface ModelViewerProps {
  url: string
  title: string
  type?: "speckle" | "bimplus" | "other"
}

export function ModelViewer({ url, title, type = "speckle" }: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [navigation, setNavigation] = useState<any[]>([])
  const { user, logout } = useAuth()

  // Carica la navigazione
  useState(() => {
    setNavigation(getNavigation())
  })

  // Modifica l'URL per nascondere i controlli di Speckle
  const getCleanUrl = (originalUrl: string) => {
    if (type === "speckle" && originalUrl.includes("speckle.xyz")) {
      // Aggiungi parametri per nascondere i controlli
      const separator = originalUrl.includes("?") ? "&" : "?"
      return `${originalUrl}${separator}hidecontrols=true&transparent=true&autoload=true`
    }
    return originalUrl
  }

  const cleanUrl = getCleanUrl(url)

  return (
    <div className="border rounded-md overflow-hidden relative">
      {/* Barra di navigazione per fullscreen */}
      {isFullscreen && (
        <div className="absolute top-0 left-0 right-0 h-12 bg-white/95 backdrop-blur-md border-b shadow-sm z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Torna al sito</span>
            </Button>
            <span className="text-sm font-medium text-gray-700">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Menu Navigation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white/98 backdrop-blur-md border border-gray-200 shadow-xl"
                align="end"
                forceMount
                sideOffset={5}
              >
                <DropdownMenuLabel className="font-normal bg-gray-50/80">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900">Navigazione</p>
                    <p className="text-xs leading-none text-gray-600">Sezioni del progetto</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {navigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="bg-white/90 hover:bg-gray-50/90">
                    <Link href={item.href} className="w-full cursor-pointer">
                      <span className="uppercase tracking-wider text-sm font-normal text-gray-800">{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}

                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 focus:text-red-600 bg-white/90 hover:bg-red-50/90"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span className="uppercase tracking-wider text-sm font-normal">Logout</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Controlli personalizzati - solo quando NON in fullscreen */}
      {!isFullscreen && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 h-8 w-8 shadow-sm"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Viewer */}
      <div className={`${isFullscreen ? "fixed inset-0 z-40 bg-white" : "aspect-video"}`}>
        <iframe
          src={cleanUrl}
          className={`w-full h-full ${isFullscreen ? "pt-12" : ""}`}
          title={title}
          allowFullScreen
          style={{
            border: "none",
            background: "transparent",
          }}
        />
      </div>
    </div>
  )
}
