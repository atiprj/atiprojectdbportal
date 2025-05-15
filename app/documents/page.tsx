"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getResources } from "@/utils/config-utils"
import { ResourceSearch } from "@/components/search/resource-search"
import { searchResourcesByType } from "@/utils/search-utils"
import {
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileText,
  FileCode,
  FileArchive,
  FileImage,
  FileIcon,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const documentsList = getResources("documents")
    setDocuments(documentsList)
    setFilteredDocuments(documentsList)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query) {
      setFilteredDocuments(documents)
    } else {
      const results = searchResourcesByType(query, "documents")
      setFilteredDocuments(results)
    }
  }

  // Restituisce l'icona appropriata per il tipo di file con dimensioni maggiori
  const getFileIcon = (fileType: string) => {
    const iconSize = "h-10 w-10" // Icone ancora più grandi per la visualizzazione principale

    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FilePdf className={`${iconSize} text-red-500`} />
      case "xlsx":
      case "xls":
      case "csv":
        return <FileSpreadsheet className={`${iconSize} text-green-500`} />
      case "docx":
      case "doc":
        return <FileText className={`${iconSize} text-blue-500`} />
      case "ppt":
      case "pptx":
        return <FileText className={`${iconSize} text-orange-500`} />
      case "zip":
      case "rar":
        return <FileArchive className={`${iconSize} text-purple-500`} />
      case "jpg":
      case "png":
      case "gif":
        return <FileImage className={`${iconSize} text-pink-500`} />
      case "js":
      case "ts":
      case "py":
      case "json":
        return <FileCode className={`${iconSize} text-yellow-500`} />
      default:
        return <FileIcon className={`${iconSize} text-gray-500`} />
    }
  }

  // Formatta la data
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
          <h1 className="text-3xl font-bold mb-6">Documenti</h1>

          <div className="mb-6">
            <ResourceSearch onSearch={handleSearch} placeholder="Cerca documenti..." />
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">Nessun documento trovato</p>
              <p className="text-muted-foreground">
                {searchQuery
                  ? `Nessun documento corrisponde alla ricerca "${searchQuery}"`
                  : "Non ci sono documenti disponibili in questo momento."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col md:flex-row gap-4 p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center md:w-20">{getFileIcon(document.type)}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-medium mb-1">{document.name}</h2>
                    <p className="text-muted-foreground mb-3">{document.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {document.tags &&
                        document.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      {document.category && <Badge variant="outline">{document.category}</Badge>}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      {document.updatedAt && <span>Aggiornato: {formatDate(document.updatedAt)}</span>}
                      {document.size && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{document.size}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 justify-end">
                    <Button variant="default" size="sm" asChild>
                      <a href={document.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apri
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
