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
  const [notebooksCount, setNotebooksCount] = useState<number>(0)
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
    setNotebooksCount(getResourceCount("notebooks"))
    setMainMediaType(getMainMediaType())
    setMainImage(getMainImage())
    setMainVideo(getMainVideo())
    setClient(getConfigValue("general.client", ""))
    setLocation(getConfigValue("general.location", ""))
    setStartDate(formatDate(getConfigValue("general.startDate", "")))
    setEndDate(formatDate(getConfigValue("general.endDate", "")))
  }, [])

  // Dati delle risorse disponibili
  const resourceCards = [
    {
      title: "Modelli 3D",
      description: "Visualizza i modelli 3D del progetto",
      count: modelsCount,
      countText: `${modelsCount} modelli disponibili`,
      href: "/models",
      buttonText: "Visualizza Modelli",
    },
    {
      title: "Dashboard",
      description: "Analisi e dati del progetto",
      count: dashboardsCount,
      countText: `${dashboardsCount} dashboard disponibili`,
      href: "/dashboards",
      buttonText: "Visualizza Dashboard",
    },
    {
      title: "Documenti",
      description: "Documenti e file del progetto",
      count: documentsCount,
      countText: `${documentsCount} documenti disponibili`,
      href: "/documents",
      buttonText: "Visualizza Documenti",
    },
    {
      title: "Notebook ML",
      description: "Analisi ML dei documenti di progetto",
      count: notebooksCount,
      countText: `${notebooksCount} notebook disponibili`,
      href: "/notebooks",
      buttonText: "Visualizza Notebook",
    },
  ]

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

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Risorse Disponibili</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resourceCards.map((card, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <CardHeader className="flex-none">
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{card.countText}</p>
                  </CardContent>
                  <CardFooter className="flex-none pt-6">
                    <Button asChild className="w-full">
                      <Link href={card.href}>{card.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  )
}
