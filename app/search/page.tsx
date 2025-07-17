"use client"

import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { SearchBar } from "@/components/search/search-bar"
import { SearchResults } from "@/components/search/search-results"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto w-full py-8 px-8 md:px-12">
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-6">Ricerca</h1>
            <SearchBar autoFocus placeholder="Cerca modelli, documenti, dashboard..." defaultValue={query} />
          </div>

          <SearchResults query={query} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
