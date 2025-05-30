"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      const success = await login(username, password)

      if (success) {
        router.push("/")
      } else {
        setError("Credenziali non valide. Riprova.")
      }
    } catch (err) {
      setError("Si è verificato un errore durante l'accesso. Riprova.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-8 py-8">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-1">
            <div className="flex flex-col items-center gap-2">
              <img src="/images/logo.png" alt="Nuovo Ospedale Torino" className="h-80" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Accedi al Progetto</CardTitle>
          <CardDescription className="text-center">
            Inserisci le tue credenziali per accedere alla piattaforma
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-6">
            {error && <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="username">Nome utente</Label>
              <Input id="username" name="username" placeholder="admin" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accesso in corso...
                </>
              ) : (
                "Accedi"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
