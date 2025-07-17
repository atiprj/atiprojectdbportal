"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Plus, Upload, FolderOpen, Users, Settings, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dati di esempio per i progetti
const exampleProjects = [
  {
    id: 1,
    name: "Edificio Residenziale Milano",
    updatedAt: "2023-11-15T10:30:00",
    sharedWith: 5,
    thumbnail: "/placeholder.svg?height=100&width=200",
    resources: {
      speckleModels: 2,
      powerbiDashboards: 1,
      sharedDocuments: 3,
    },
  },
  {
    id: 2,
    name: "Centro Commerciale Roma",
    updatedAt: "2023-11-10T14:45:00",
    sharedWith: 8,
    thumbnail: "/placeholder.svg?height=100&width=200",
    resources: {
      speckleModels: 1,
      powerbiDashboards: 2,
      sharedDocuments: 5,
    },
  },
  {
    id: 3,
    name: "Ristrutturazione Uffici Torino",
    updatedAt: "2023-11-05T09:15:00",
    sharedWith: 3,
    thumbnail: "/placeholder.svg?height=100&width=200",
    resources: {
      speckleModels: 3,
      powerbiDashboards: 0,
      sharedDocuments: 2,
    },
  },
  {
    id: 4,
    name: "Complesso Industriale Napoli",
    updatedAt: "2023-10-28T16:20:00",
    sharedWith: 12,
    thumbnail: "/placeholder.svg?height=100&width=200",
    resources: {
      speckleModels: 2,
      powerbiDashboards: 3,
      sharedDocuments: 7,
    },
  },
]

export default function DashboardPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Filtra i progetti in base alla ricerca
  const filteredProjects = exampleProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Simula il caricamento di un file
  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            setIsUploadDialogOpen(false)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // Formatta la data in un formato leggibile
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">BIMShare</span>
          </div>
          <div className="flex-1 mx-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cerca progetti..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Mario Rossi</p>
                    <p className="text-xs leading-none text-muted-foreground">mario.rossi@esempio.it</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Impostazioni</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Team</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Esci</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">I tuoi progetti BIM</h1>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Carica progetto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Carica un nuovo progetto BIM</DialogTitle>
                <DialogDescription>
                  Seleziona il file del tuo progetto BIM da caricare sulla piattaforma.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Trascina qui il tuo file o</p>
                  <Button variant="secondary" size="sm">
                    Seleziona file
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Supporta file .ifc, .rvt, .nwd fino a 500MB</p>
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Caricamento in corso...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? "Caricamento..." : "Carica"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Nessun progetto trovato</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Nessun progetto corrisponde alla tua ricerca"
                : "Inizia caricando il tuo primo progetto BIM"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuovo progetto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>Aggiornato il {formatDate(project.updatedAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.resources.speckleModels > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project.resources.speckleModels} Modelli 3D
                        </span>
                      )}
                      {project.resources.powerbiDashboards > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {project.resources.powerbiDashboards} Dashboard
                        </span>
                      )}
                      {project.resources.sharedDocuments > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {project.resources.sharedDocuments} Documenti
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Condiviso con {project.sharedWith} utenti</p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Visualizza progetto
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="font-medium">BIMShare</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BIMShare. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  )
}
