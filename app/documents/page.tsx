"use client"

import { projectConfig } from "@/config/project-config"
import { MainLayout } from "@/components/layout/main-layout"
import { DocumentCard } from "@/components/documents/document-card"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DocumentsPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
          <h1 className="text-3xl font-bold mb-6">Documenti</h1>

          <div className="space-y-4">
            {projectConfig.externalLinks.documents.map((document) => (
              <DocumentCard
                key={document.id}
                name={document.name}
                description={document.description}
                url={document.url}
                type={document.type}
              />
            ))}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
