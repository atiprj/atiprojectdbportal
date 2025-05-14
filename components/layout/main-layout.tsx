"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
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
  const [projectName, setProjectName] = useState<string>("")
  const [logo, setLogo] = useState<string>("")
  const [primaryColor, setPrimaryColor] = useState<string>("")
  const [navigation, setNavigation] = useState<any[]>([])
  const [clientName, setClientName] = useState<string>("")
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      <header className="border-b">
        <div className="max-w-7xl mx-auto w-full flex h-16 items-center justify-between py-4 px-4 md:px-8">
          {/* Logo e titolo del progetto */}
          <div className="flex items-center gap-2 min-w-0 max-w-[40%] lg:max-w-xs">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              {logo ? (
                <img src={logo || "/placeholder.svg"} alt="" className="h-8 w-8 flex-shrink-0" />
              ) : (
                <Building2 className="h-6 w-6 flex-shrink-0" style={{ color: primaryColor }} />
              )}
              <span className="text-base md:text-lg font-bold truncate">{projectName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center gap-4 xl:gap-6 overflow-x-auto no-scrollbar">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium whitespace-nowrap hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Button (Mobile) */}
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

            {/* Search Bar (Desktop) */}
            {isSearchEnabled && (
              <div className="hidden lg:block w-[180px] xl:w-[240px]">
                <SearchBar />
              </div>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
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
          </div>
        </div>
      </header>
      <main className={cn("flex-1", className)}>{children}</main>
      <footer className="border-t py-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 px-8 md:px-12">
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo || "/placeholder.svg"} alt={projectName} className="h-5 w-5" />
            ) : (
              <Building2 className="h-5 w-5" style={{ color: primaryColor }} />
            )}
            <span className="font-medium">{projectName}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {clientName}. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  )
}
