"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
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
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simula una richiesta di rete
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In un'applicazione reale, qui si connetterebbe a un backend
      // Per ora, accettiamo qualsiasi email con password "password"
      if (password === "password") {
        const user = {
          id: "1",
          name: email.split("@")[0],
          email,
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
