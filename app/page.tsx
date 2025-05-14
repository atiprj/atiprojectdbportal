"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  getProjectName,
  getConfigValue,
  getResourceCount,
  getMainImage,
  getMainVideo,
  getMainMediaType,
  formatDate,
} from "@/utils/config-utils"

export default function HomePage() {
  const [projectName, setProjectName] = useState<string>("")
  const [projectDescription, setProjectDescription] = useState<string>("")
  const [modelsCount, setModelsCount] = useState<number>(0)
  const [dashboardsCount, setDashboardsCount] = useState<number>(0)
  const [documentsCount, setDocumentsCount] = useState<number>(0)
  const [mainMediaType, setMainMediaType] = useState<"image" | "video">("image")
  const [mainImage, setMainImage] = useState<string>("")
  const [mainVideo, setMainVideo] = useState<string>("")
  const [client, setClient] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  // Carica le configurazioni lato client per evitare errori di idratazione
  useEffect(() => {
    setProjectName(getProjectName())
    setProjectDescription(getConfigValue("general.description", ""))
    setModelsCount(getResourceCount("models"))
    setDashboardsCount(getResourceCount("dashboards"))
    setDocumentsCount(getResourceCount("documents"))
    setMainMediaType(getMainMediaType())
    setMainImage(getMainImage())
    setMainVideo(getMainVideo())
    setClient(getConfigValue("general.client", ""))
    setLocation(getConfigValue("general.location", ""))
    setStartDate(formatDate(getConfigValue("general.startDate", "")))
    setEndDate(formatDate(getConfigValue("general.endDate", "")))
  }, [])

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto w-full px-8 md:px-12">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{projectName}</h1>
              <p className="text-xl text-muted-foreground">{projectDescription}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Informazioni Progetto</h2>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Cliente:</span>
                    <span>{client}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Località:</span>
                    <span>{location}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Data inizio:</span>
                    <span>{startDate}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Data fine prevista:</span>
                    <span>{endDate}</span>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg aspect-video overflow-hidden">
                {mainMediaType === "video" && mainVideo ? (
                  <iframe src={mainVideo} className="w-full h-full" title={projectName} allowFullScreen />
                ) : mainImage ? (
                  <img
                    src={mainImage || "/placeholder.svg"}
                    alt={getConfigValue("general.mainMedia.alt", projectName)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Immagine o video del progetto</p>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center">Risorse Disponibili</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modelli 3D</CardTitle>
                  <CardDescription>Visualizza i modelli 3D del progetto</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{modelsCount} modelli disponibili</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/models">Visualizza Modelli</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>Analisi e dati del progetto</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{dashboardsCount} dashboard disponibili</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/dashboards">Visualizza Dashboard</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documenti</CardTitle>
                  <CardDescription>Documenti e file del progetto</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{documentsCount} documenti disponibili</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/documents">Visualizza Documenti</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  )
}
