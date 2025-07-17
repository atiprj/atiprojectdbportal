"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Building2,
  ArrowLeft,
  Share2,
  Download,
  Eye,
  Users,
  Clock,
  Calendar,
  FileText,
  FileIcon,
  ExternalLink,
  PanelLeft,
  PanelRight,
  Maximize2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dati di esempio per il progetto
const exampleProject = {
  id: 1,
  name: "Edificio Residenziale Milano",
  description: "Progetto di un complesso residenziale di 5 piani con 20 appartamenti e aree comuni.",
  createdAt: "2023-10-01T09:00:00",
  updatedAt: "2023-11-15T10:30:00",
  owner: {
    name: "Mario Rossi",
    email: "mario.rossi@esempio.it",
    avatar: "/placeholder.svg",
  },
  sharedWith: [
    {
      id: 1,
      name: "Laura Bianchi",
      email: "laura.bianchi@esempio.it",
      avatar: "/placeholder.svg",
      role: "editor",
    },
    {
      id: 2,
      name: "Giovanni Verdi",
      email: "giovanni.verdi@esempio.it",
      avatar: "/placeholder.svg",
      role: "viewer",
    },
    {
      id: 3,
      name: "Anna Neri",
      email: "anna.neri@esempio.it",
      avatar: "/placeholder.svg",
      role: "viewer",
    },
  ],
  files: [
    {
      id: 1,
      name: "Modello_Architettonico.ifc",
      size: "45.2 MB",
      updatedAt: "2023-11-15T10:30:00",
      type: "ifc",
    },
    {
      id: 2,
      name: "Modello_Strutturale.ifc",
      size: "32.8 MB",
      updatedAt: "2023-11-10T14:20:00",
      type: "ifc",
    },
    {
      id: 3,
      name: "Impianti_MEP.ifc",
      size: "28.5 MB",
      updatedAt: "2023-11-05T09:45:00",
      type: "ifc",
    },
    {
      id: 4,
      name: "Documentazione_Tecnica.pdf",
      size: "12.3 MB",
      updatedAt: "2023-10-28T16:15:00",
      type: "pdf",
    },
  ],
  activities: [
    {
      id: 1,
      user: "Mario Rossi",
      action: "ha caricato un nuovo file",
      target: "Modello_Architettonico.ifc",
      timestamp: "2023-11-15T10:30:00",
    },
    {
      id: 2,
      user: "Laura Bianchi",
      action: "ha modificato",
      target: "Modello_Strutturale.ifc",
      timestamp: "2023-11-10T14:20:00",
    },
    {
      id: 3,
      user: "Giovanni Verdi",
      action: "ha visualizzato",
      target: "Impianti_MEP.ifc",
      timestamp: "2023-11-05T09:45:00",
    },
    {
      id: 4,
      user: "Anna Neri",
      action: "ha scaricato",
      target: "Documentazione_Tecnica.pdf",
      timestamp: "2023-10-28T16:15:00",
    },
  ],
  // Nuove risorse esterne
  externalResources: {
    speckleModels: [
      {
        id: 1,
        name: "Modello Architettonico",
        description: "Modello 3D completo dell'edificio",
        url: "https://speckle.xyz/streams/0c6ad366c4",
        thumbnail: "/placeholder.svg?height=200&width=400",
        updatedAt: "2023-11-15T10:30:00",
      },
      {
        id: 2,
        name: "Modello Strutturale",
        description: "Struttura portante dell'edificio",
        url: "https://speckle.xyz/streams/7b8c9d0e1f",
        thumbnail: "/placeholder.svg?height=200&width=400",
        updatedAt: "2023-11-10T14:20:00",
      },
    ],
    powerbiDashboards: [
      {
        id: 1,
        name: "Analisi Costi",
        description: "Dashboard dei costi di costruzione",
        url: "https://app.powerbi.com/view?r=example1",
        thumbnail: "/placeholder.svg?height=200&width=400",
        updatedAt: "2023-11-12T11:25:00",
      },
    ],
    sharedDocuments: [
      {
        id: 1,
        name: "Capitolato Tecnico",
        description: "Specifiche tecniche del progetto",
        url: "https://docs.example.com/doc1",
        type: "pdf",
        updatedAt: "2023-11-14T09:45:00",
      },
      {
        id: 2,
        name: "Cronoprogramma",
        description: "Pianificazione temporale dei lavori",
        url: "https://docs.example.com/doc2",
        type: "xlsx",
        updatedAt: "2023-11-08T16:30:00",
      },
      {
        id: 3,
        name: "Relazione Tecnica",
        description: "Relazione tecnica del progetto",
        url: "https://docs.example.com/doc3",
        type: "docx",
        updatedAt: "2023-10-25T14:15:00",
      },
    ],
  },
}

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("viewer")
  const [selectedSpeckleModel, setSelectedSpeckleModel] = useState(exampleProject.externalResources.speckleModels[0])
  const [selectedPowerBI, setSelectedPowerBI] = useState(exampleProject.externalResources.powerbiDashboards[0])
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  // Simula la condivisione con un nuovo utente
  const handleShare = () => {
    // In un'applicazione reale, qui si invierebbe una richiesta al backend
    console.log(`Condividi con ${newUserEmail} come ${newUserRole}`)
    setNewUserEmail("")
    setIsShareDialogOpen(false)
  }

  // Restituisce l'icona appropriata per il tipo di file
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "xlsx":
        return <FileText className="h-4 w-4 text-green-500" />
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />
      default:
        return <FileIcon className="h-4 w-4 text-muted-foreground" />
    }
  }

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
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={exampleProject.owner.avatar || "/placeholder.svg"} alt="Avatar" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
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

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{exampleProject.name}</h1>
            <p className="text-muted-foreground mb-4">{exampleProject.description}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Creato il {formatDate(exampleProject.createdAt)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Ultimo aggiornamento {formatDate(exampleProject.updatedAt)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                Condiviso con {exampleProject.sharedWith.length} utenti
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  Condividi
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Condividi progetto</DialogTitle>
                  <DialogDescription>Invita altri utenti a collaborare a questo progetto.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="nome@esempio.it"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Ruolo</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Seleziona un ruolo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">Editor (può modificare)</SelectItem>
                        <SelectItem value="viewer">Visualizzatore (sola lettura)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Utenti con accesso</Label>
                    <div className="border rounded-md divide-y">
                      {exampleProject.sharedWith.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Select defaultValue={user.role}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Visualizzatore</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                    Annulla
                  </Button>
                  <Button onClick={handleShare} disabled={!newUserEmail}>
                    Condividi
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Scarica
            </Button>
          </div>
        </div>

        <Tabs defaultValue="models">
          <TabsList className="mb-6">
            <TabsTrigger value="models">Modelli 3D</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboard</TabsTrigger>
            <TabsTrigger value="documents">Documenti</TabsTrigger>
            <TabsTrigger value="files">File</TabsTrigger>
            <TabsTrigger value="activity">Attività</TabsTrigger>
          </TabsList>

          {/* Modelli 3D (Speckle) */}
          <TabsContent value="models" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Modelli 3D</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Aggiungi
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {exampleProject.externalResources.speckleModels.map((model) => (
                      <Card
                        key={model.id}
                        className={`cursor-pointer transition-all ${selectedSpeckleModel.id === model.id ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setSelectedSpeckleModel(model)}
                      >
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">{model.name}</CardTitle>
                          <CardDescription className="text-xs">{formatDate(model.updatedAt)}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 border rounded-md overflow-hidden relative">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  <Button variant="outline" size="icon" className="bg-white/90 h-8 w-8">
                    <PanelLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/90 h-8 w-8">
                    <PanelRight className="h-4 w-4" />
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
                <div className={`bg-muted aspect-video ${isFullscreen ? "fixed inset-0 z-50 aspect-auto" : ""}`}>
                  <iframe
                    src={selectedSpeckleModel.url}
                    className="w-full h-full"
                    title={selectedSpeckleModel.name}
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-medium mb-1">{selectedSpeckleModel.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedSpeckleModel.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apri in Speckle
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Condividi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Dashboard PowerBI */}
          <TabsContent value="dashboards" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Dashboard</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Aggiungi
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {exampleProject.externalResources.powerbiDashboards.map((dashboard) => (
                      <Card
                        key={dashboard.id}
                        className={`cursor-pointer transition-all ${selectedPowerBI.id === dashboard.id ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setSelectedPowerBI(dashboard)}
                      >
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">{dashboard.name}</CardTitle>
                          <CardDescription className="text-xs">{formatDate(dashboard.updatedAt)}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 border rounded-md overflow-hidden relative">
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
                <div className={`bg-muted aspect-video ${isFullscreen ? "fixed inset-0 z-50 aspect-auto" : ""}`}>
                  <iframe
                    src={selectedPowerBI.url}
                    className="w-full h-full"
                    title={selectedPowerBI.name}
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-medium mb-1">{selectedPowerBI.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedPowerBI.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apri in PowerBI
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Condividi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Documenti condivisi */}
          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Documenti condivisi</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi documento
              </Button>
            </div>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium text-sm">
                <div className="col-span-6">Nome</div>
                <div className="col-span-3">Ultimo aggiornamento</div>
                <div className="col-span-3"></div>
              </div>
              <div className="divide-y">
                {exampleProject.externalResources.sharedDocuments.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm">
                    <div className="col-span-6 flex items-center gap-2">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                    <div className="col-span-3 text-muted-foreground">{formatDate(doc.updatedAt)}</div>
                    <div className="col-span-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apri
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* File */}
          <TabsContent value="files" className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium text-sm">
                <div className="col-span-6">Nome</div>
                <div className="col-span-2">Dimensione</div>
                <div className="col-span-3">Ultimo aggiornamento</div>
                <div className="col-span-1"></div>
              </div>
              <div className="divide-y">
                {exampleProject.files.map((file) => (
                  <div key={file.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm">
                    <div className="col-span-6 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {file.name}
                    </div>
                    <div className="col-span-2 text-muted-foreground">{file.size}</div>
                    <div className="col-span-3 text-muted-foreground">{formatDate(file.updatedAt)}</div>
                    <div className="col-span-1 flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Attività */}
          <TabsContent value="activity">
            <div className="border rounded-md divide-y">
              {exampleProject.activities.map((activity) => (
                <div key={activity.id} className="p-4 flex items-start gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
