"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2,
  LayoutDashboard,
  CuboidIcon as Cube,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Dati di esempio per i progetti
const exampleProjects = [
  {
    id: 1,
    name: "Edificio Residenziale Milano",
    resources: {
      models: ["Modello Architettonico", "Modello Strutturale"],
      dashboards: ["Analisi Costi"],
      documents: ["Capitolato Tecnico", "Cronoprogramma", "Relazione Tecnica"],
    },
  },
  {
    id: 2,
    name: "Centro Commerciale Roma",
    resources: {
      models: ["Modello Completo"],
      dashboards: ["Analisi Vendite", "Previsioni Traffico"],
      documents: ["Piano Marketing", "Specifiche Tecniche", "Contratti", "Autorizzazioni", "Planimetrie"],
    },
  },
  {
    id: 3,
    name: "Ristrutturazione Uffici Torino",
    resources: {
      models: ["Piano Terra", "Primo Piano", "Secondo Piano"],
      dashboards: [],
      documents: ["Preventivo", "Cronoprogramma"],
    },
  },
]

export function ProjectSidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openProjects, setOpenProjects] = useState<number[]>([1]) // ID del progetto aperto di default

  // Filtra i progetti in base alla ricerca
  const filteredProjects = exampleProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Gestisce l'apertura/chiusura di un progetto nel menu
  const toggleProject = (projectId: number) => {
    setOpenProjects((prev) => (prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]))
  }

  return (
    <div className="w-64 border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-6 w-6" />
          <span className="text-xl font-bold">BIMShare</span>
        </div>
        <div className="relative">
          <Input
            type="search"
            placeholder="Cerca progetti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <nav className="space-y-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </nav>

          <div className="mt-6">
            <h3 className="px-3 text-sm font-medium mb-2">Progetti</h3>
            <div className="space-y-1">
              {filteredProjects.map((project) => (
                <Collapsible
                  key={project.id}
                  open={openProjects.includes(project.id)}
                  onOpenChange={() => toggleProject(project.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      <span className="flex-1 text-left truncate">{project.name}</span>
                      {openProjects.includes(project.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-6 pr-2 py-1 space-y-1">
                      {project.resources.models.length > 0 && (
                        <Link href={`/projects/${project.id}?tab=models`}>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <Cube className="h-4 w-4 mr-2" />
                            Modelli 3D
                          </Button>
                        </Link>
                      )}
                      {project.resources.dashboards.length > 0 && (
                        <Link href={`/projects/${project.id}?tab=dashboards`}>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      {project.resources.documents.length > 0 && (
                        <Link href={`/projects/${project.id}?tab=documents`}>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            Documenti
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Impostazioni
          </Button>
        </div>
      </div>
    </div>
  )
}
