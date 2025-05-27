"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Trash, Download, Loader2, FileText, Package } from "lucide-react"
import { CollapsiblePanel } from "./ui/collapsible-panel"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

interface ModelInfo {
  id: string
  name: string
  type: "ifc" | "frag"
  visible: boolean
  elementCount: number
  model: any
  fragmentBytes: ArrayBuffer
}

interface ModelManagerProps {
  models: Map<string, ModelInfo>
  onToggleVisibility: (modelId: string) => void
  onRemoveModel: (modelId: string) => void
  onDownloadModel: (modelId: string) => void
  loading: boolean
}

export function ModelManager({
  models,
  onToggleVisibility,
  onRemoveModel,
  onDownloadModel,
  loading,
}: ModelManagerProps) {
  const { resolvedTheme } = useTheme()
  const { toast } = useToast()
  const isDarkTheme = resolvedTheme === "dark"
  const [modelList, setModelList] = useState<ModelInfo[]>([])

  // Aggiorna la lista dei modelli quando cambia la mappa
  useEffect(() => {
    setModelList(Array.from(models.values()))
  }, [models])

  // Funzione per ottenere l'icona del tipo di file
  const getFileIcon = (type: "ifc" | "frag") => {
    return type === "ifc" ? <FileText className="h-4 w-4" /> : <Package className="h-4 w-4" />
  }

  // Funzione per ottenere il colore del badge del tipo
  const getTypeColor = (type: "ifc" | "frag") => {
    return type === "ifc" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  if (modelList.length === 0) {
    return null
  }

  return (
    <CollapsiblePanel
      title={`Modelli Caricati (${modelList.length})`}
      icon={<Package className="h-4 w-4" />}
      defaultOpen={true}
      className="w-full"
    >
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {modelList.map((modelInfo) => (
          <Card
            key={modelInfo.id}
            className={`shadow-sm border ${
              isDarkTheme ? "bg-gray-800/95 border-gray-700/80" : "bg-gray-50/95 border-gray-200/80"
            } backdrop-blur-sm`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {getFileIcon(modelInfo.type)}
                  <span className="truncate">{modelInfo.name}</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${getTypeColor(modelInfo.type)} ${isDarkTheme ? "border-gray-600" : ""}`}
                >
                  {modelInfo.type.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>
                  Elementi: {modelInfo.elementCount}
                </span>
                <span className={`${modelInfo.visible ? "text-green-600" : "text-red-600"}`}>
                  {modelInfo.visible ? "Visibile" : "Nascosto"}
                </span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleVisibility(modelInfo.id)}
                  disabled={loading}
                  className={`flex-1 ${isDarkTheme ? "border-gray-600 hover:bg-gray-700" : ""}`}
                  title={modelInfo.visible ? "Nascondi modello" : "Mostra modello"}
                >
                  {modelInfo.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadModel(modelInfo.id)}
                  disabled={loading}
                  className={isDarkTheme ? "border-gray-600 hover:bg-gray-700" : ""}
                  title="Scarica modello"
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveModel(modelInfo.id)}
                  disabled={loading}
                  className={`${isDarkTheme ? "border-gray-600 hover:bg-gray-700" : ""} text-red-600 hover:text-red-700`}
                  title="Rimuovi modello"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CollapsiblePanel>
  )
}
