import { FileText, FileIcon, ExternalLink, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentCardProps {
  name: string
  description: string
  url: string
  type: string
  updatedAt?: string
}

export function DocumentCard({ name, description, url, type, updatedAt }: DocumentCardProps) {
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
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div className="flex items-center gap-3">
        {getFileIcon(type)}
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {updatedAt && <p className="text-xs text-muted-foreground mt-1">Aggiornato: {updatedAt}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Apri
          </a>
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
