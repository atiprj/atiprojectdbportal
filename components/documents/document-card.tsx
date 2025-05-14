import {
  FileText,
  FileIcon,
  ExternalLink,
  Download,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FileImage,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentCardProps {
  name: string
  description: string
  url: string
  type: string
  updatedAt?: string
}

export function DocumentCard({ name, description, url, type, updatedAt }: DocumentCardProps) {
  // Restituisce l'icona appropriata per il tipo di file con dimensioni maggiori
  const getFileIcon = (fileType: string) => {
    const iconSize = "h-6 w-6" // Aumentiamo la dimensione delle icone

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

  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div className="flex items-center gap-4">
        {" "}
        {/* Aumentiamo lo spazio tra icona e testo */}
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
