"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { projectConfig } from "@/config/project-config"

interface User {
  id: string
  name: string
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Controlla se l'utente è già autenticato all'avvio
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Funzione di login
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simula una richiesta di rete
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In un'applicazione reale, qui si connetterebbe a un backend
      // Verifica le credenziali demo dal file di configurazione
      const demoUsername = projectConfig.auth?.demoCredentials?.username || "admin"
      const demoPassword = projectConfig.auth?.demoCredentials?.password || "password"

      if (username === demoUsername && password === demoPassword) {
        const user = {
          id: "1",
          name: username,
          username,
          role: "user",
        }

        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        return true
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Funzione di logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve essere usato all'interno di un AuthProvider")
  }
  return context
}
