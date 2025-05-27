"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ArrowRight, CuboidIcon as Cube, BarChart3, FileText, BookOpen } from "lucide-react"
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
      icon: <Cube className="h-5 w-5" />,
    },
    {
      title: "Dashboard",
      description: "Analisi e dati del progetto PowerBI",
      count: dashboardsCount,
      countText: `${dashboardsCount} dashboard disponibili`,
      href: "/dashboards",
      buttonText: "Visualizza Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Documenti",
      description: "Documenti e file del progetto",
      count: documentsCount,
      countText: `${documentsCount} documenti disponibili`,
      href: "/documents",
      buttonText: "Visualizza Documenti",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "NotebookLM",
      description: "Analisi AI dei documenti di progetto",
      count: notebooksCount,
      countText: `${notebooksCount} notebook disponibili`,
      href: "/notebooks",
      buttonText: "Visualizza NotebookLM",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ]

  return (
    <ProtectedRoute>
      <MainLayout>
        {/* Hero Section - Stile BIG */}
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto text-center px-8">
            <h1 className="text-5xl md:text-7xl font-light tracking-wide mb-8 text-gray-900">{projectName}</h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-12">
              {projectDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg">
                <Link href="/ifc-viewer" className="flex items-center gap-2">
                  Visualizzatore IFC
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-300 px-8 py-6 text-lg">
                <Link href="/models">Esplora Modelli</Link>
              </Button>
            </div>
          </div>

          {/* Media principale */}
          {(mainImage || mainVideo) && (
            <div className="absolute inset-0 -z-10">
              <div className="relative w-full h-full">
                {mainMediaType === "video" && mainVideo ? (
                  <iframe
                    src={mainVideo}
                    className="w-full h-full object-cover opacity-20"
                    title={projectName}
                    allowFullScreen
                  />
                ) : mainImage ? (
                  <img
                    src={mainImage || "/placeholder.svg"}
                    alt={getConfigValue("general.mainMedia.alt", projectName)}
                    className="w-full h-full object-cover opacity-20"
                  />
                ) : null}
                <div className="absolute inset-0 bg-white/60" />
              </div>
            </div>
          )}
        </section>

        {/* Informazioni Progetto */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-light mb-8 text-gray-900">Informazioni Progetto</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-600 font-light">Cliente</span>
                    <span className="font-medium">{client}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-600 font-light">Località</span>
                    <span className="font-medium">{location}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-600 font-light">Data inizio</span>
                    <span className="font-medium">{startDate}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-600 font-light">Data fine prevista</span>
                    <span className="font-medium">{endDate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg aspect-video overflow-hidden">
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
                    <p className="text-gray-500 font-light">Immagine o video del progetto</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Risorse */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light mb-4 text-gray-900">Risorse Disponibili</h2>
              <p className="text-xl text-gray-600 font-light">Esplora i contenuti del progetto</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {resourceCards.map((card, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-all duration-300">
                      {card.icon}
                    </div>
                    <CardTitle className="text-xl font-light">{card.title}</CardTitle>
                    <CardDescription className="font-light">{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-600 font-light">{card.countText}</p>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300"
                    >
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
