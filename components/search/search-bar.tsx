"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  className?: string
  placeholder?: string
  onSearch?: (query: string) => void
  autoFocus?: boolean
  variant?: "default" | "minimal"
}

export function SearchBar({
  className,
  placeholder = "Cerca nel progetto...",
  onSearch,
  autoFocus = false,
  variant = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      className={cn(
        "relative flex items-center",
        variant === "default" ? "w-full max-w-md" : "w-full",
        isFocused && "ring-1 ring-primary rounded-md",
        className,
      )}
    >
      <Search
        className={cn(
          "absolute left-3 h-4 w-4",
          variant === "default" ? "text-muted-foreground" : "text-foreground opacity-50",
        )}
      />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "pl-9",
          variant === "minimal" && "border-none bg-transparent shadow-none focus-visible:ring-0 pl-8",
        )}
      />
      {query && (
        <Button type="button" variant="ghost" size="icon" className="absolute right-1 h-7 w-7" onClick={clearSearch}>
          <X className="h-4 w-4" />
          <span className="sr-only">Cancella ricerca</span>
        </Button>
      )}
    </div>
  )
}
