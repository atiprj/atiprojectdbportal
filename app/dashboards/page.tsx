"use client"

import { useState } from "react"
import { projectConfig } from "@/config/project-config"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardViewer } from "@/components/dashboards/dashboard-viewer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardsPage() {
  const [selectedDashboard, setSelectedDashboard] = useState(projectConfig.externalLinks.dashboards[0])

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Dashboard disponibili</h2>
                <div className="space-y-2">
                  {projectConfig.externalLinks.dashboards.map((dashboard) => (
                    <Card
                      key={dashboard.id}
                      className={`cursor-pointer transition-all ${selectedDashboard.id === dashboard.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedDashboard(dashboard)}
                    >
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">{dashboard.name}</CardTitle>
                        <CardDescription className="text-xs">{dashboard.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <DashboardViewer
                url={selectedDashboard.url}
                title={selectedDashboard.name}
                type={selectedDashboard.type as "powerbi" | "tableau" | "other"}
              />
              <div className="p-4 bg-white border border-t-0 rounded-b-md">
                <h3 className="text-lg font-medium mb-1">{selectedDashboard.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{selectedDashboard.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedDashboard.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apri in {selectedDashboard.type === "powerbi" ? "PowerBI" : "Visualizzatore"}
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Condividi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
