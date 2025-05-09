"use client"

import Link from "next/link"
import { projectConfig } from "@/config/project-config"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto w-full px-8 md:px-12">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{projectConfig.name}</h1>
              <p className="text-xl text-muted-foreground">{projectConfig.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Informazioni Progetto</h2>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Cliente:</span>
                    <span>{projectConfig.client}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Località:</span>
                    <span>{projectConfig.location}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Data inizio:</span>
                    <span>{new Date(projectConfig.startDate).toLocaleDateString("it-IT")}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Data fine prevista:</span>
                    <span>{new Date(projectConfig.endDate).toLocaleDateString("it-IT")}</span>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <p className="text-muted-foreground">Immagine o video del progetto</p>
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
                  <p className="text-sm text-muted-foreground mb-4">
                    {projectConfig.externalLinks.models.length} modelli disponibili
                  </p>
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
                  <p className="text-sm text-muted-foreground mb-4">
                    {projectConfig.externalLinks.dashboards.length} dashboard disponibili
                  </p>
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
                  <p className="text-sm text-muted-foreground mb-4">
                    {projectConfig.externalLinks.documents.length} documenti disponibili
                  </p>
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
