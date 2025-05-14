"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ResourceSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function ResourceSearch({ onSearch, placeholder = "Cerca...", className }: ResourceSearchProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, onSearch])

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cancella ricerca</span>
        </Button>
      )}
    </div>
  )
}
