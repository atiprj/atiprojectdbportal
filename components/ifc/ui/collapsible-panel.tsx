"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsiblePanelProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  rightElement?: React.ReactNode
}

export function CollapsiblePanel({
  title,
  icon,
  children,
  defaultOpen = false,
  className,
  rightElement,
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        "border rounded-lg shadow-lg backdrop-blur-md",
        // Sfondo più opaco per migliore leggibilità
        "bg-white/95 dark:bg-gray-900/95 text-card-foreground",
        // Bordi più definiti
        "border-gray-200/80 dark:border-gray-700/80",
        className,
      )}
    >
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        {rightElement}
      </div>
      {isOpen && <div className="p-3 pt-0">{children}</div>}
    </div>
  )
}
