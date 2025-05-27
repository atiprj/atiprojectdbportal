"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, LogOut, SearchIcon, Menu } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SearchBar } from "@/components/search/search-bar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getProjectName, getLogo, getPrimaryColor, getNavigation, getConfigValue } from "@/utils/config-utils"

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [projectName, setProjectName] = useState<string>("")
  const [logo, setLogo] = useState<string>("")
  const [primaryColor, setPrimaryColor] = useState<string>("")
  const [navigation, setNavigation] = useState<any[]>([])
  const [clientName, setClientName] = useState<string>("")
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false)

  // Carica le configurazioni lato client per evitare errori di idratazione
  useEffect(() => {
    setProjectName(getProjectName())
    setLogo(getLogo())
    setPrimaryColor(getPrimaryColor())
    setNavigation(getNavigation())
    setClientName(getConfigValue("general.client", ""))
    setIsSearchEnabled(getConfigValue("features.enableSearch", true))
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header principale */}
      <header className="border-b border-gray-200/20 bg-white/95 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto w-full flex h-16 items-center justify-between py-4 px-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {logo ? (
              <img src={logo || "/placeholder.svg"} alt="" className="h-8 w-8" />
            ) : (
              <Building2 className="h-6 w-6" style={{ color: primaryColor }} />
            )}
            <span className="text-lg font-light tracking-wide">{projectName}</span>
          </Link>

          {/* Controlli destri */}
          <div className="flex items-center gap-4">
            {/* Search Bar Desktop */}
            {isSearchEnabled && (
              <div className="hidden lg:block w-[240px]">
                <SearchBar />
              </div>
            )}

            {/* Search Button Mobile */}
            {isSearchEnabled && (
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <SearchIcon className="h-5 w-5" />
                    <span className="sr-only">Cerca</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Cerca nel progetto</SheetTitle>
                    <SheetDescription>Cerca modelli, documenti, dashboard e altre risorse</SheetDescription>
                  </SheetHeader>
                  <SearchBar autoFocus />
                </SheetContent>
              </Sheet>
            )}

            {/* User Avatar */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">Utente: {user.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Menu Navigation - Usando DropdownMenu di shadcn/ui */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Navigazione</p>
                    <p className="text-xs leading-none text-muted-foreground">Sezioni del progetto</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {navigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="w-full cursor-pointer">
                      <span className="uppercase tracking-wider text-sm font-normal">{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}

                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span className="uppercase tracking-wider text-sm font-normal">Logout</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className={cn("flex-1", className)}>{children}</main>

      <footer className="border-t py-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 px-8 md:px-12">
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo || "/placeholder.svg"} alt={projectName} className="h-5 w-5" />
            ) : (
              <Building2 className="h-5 w-5" style={{ color: primaryColor }} />
            )}
            <span className="font-light">{projectName}</span>
          </div>
          <p className="text-sm text-muted-foreground font-light">
            © {new Date().getFullYear()} {clientName}. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  )
}
