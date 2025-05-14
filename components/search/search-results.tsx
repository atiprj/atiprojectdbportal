"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { File, CuboidIcon as Cube, BarChart3, BookOpen, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { searchResources } from "@/utils/search-utils"

interface SearchResultsProps {
  query: string
  className?: string
}

export function SearchResults({ query, className }: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (query) {
      setIsLoading(true)
      // Simuliamo un breve ritardo per mostrare lo stato di caricamento
      const timer = setTimeout(() => {
        const searchResults = searchResources(query)
        setResults(searchResults)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [query])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-md w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium mb-2">Nessun risultato trovato</p>
        <p className="text-muted-foreground">
          La ricerca di &quot;{query}&quot; non ha prodotto risultati. Prova con termini diversi.
        </p>
      </div>
    )
  }

  // Raggruppa i risultati per tipo
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = []
      }
      acc[result.type].push(result)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const getIcon = (type: string) => {
    switch (type) {
      case "model":
        return <Cube className="h-5 w-5 text-blue-500" />
      case "dashboard":
        return <BarChart3 className="h-5 w-5 text-yellow-500" />
      case "document":
        return <FileText className="h-5 w-5 text-green-500" />
      case "notebook":
        return <BookOpen className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "model":
        return "Modello 3D"
      case "dashboard":
        return "Dashboard"
      case "document":
        return "Documento"
      case "notebook":
        return "Notebook"
      default:
        return "Risorsa"
    }
  }

  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground mb-6">
        {results.length} risultati per &quot;{query}&quot;
      </p>

      {Object.entries(groupedResults).map(([type, items]) => (
        <div key={type} className="mb-8">
          <h2 className="text-lg font-medium mb-4">{getTypeLabel(type)}s</h2>
          <div className="space-y-4">
            {items.map((result) => (
              <Link
                key={result.id}
                href={result.type === "document" ? result.originalUrl || result.url : result.url}
                target={result.type === "document" ? "_blank" : "_self"}
                rel={result.type === "document" ? "noopener noreferrer" : ""}
              >
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getIcon(result.type)}</div>
                      <div>
                        <CardTitle className="text-base">{result.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{result.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getTypeLabel(result.type)}</span>
                      {result.category && (
                        <>
                          <span>•</span>
                          <span>{result.category}</span>
                        </>
                      )}
                      {result.updatedAt && (
                        <>
                          <span>•</span>
                          <span>Aggiornato: {new Date(result.updatedAt).toLocaleDateString("it-IT")}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
