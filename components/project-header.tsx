"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { getProjectName, getLogo, getPrimaryColor, getNavigation } from "@/utils/config-utils"

export function ProjectHeader() {
  const [projectName, setProjectName] = useState<string>("")
  const [logo, setLogo] = useState<string>("")
  const [primaryColor, setPrimaryColor] = useState<string>("")
  const [navigation, setNavigation] = useState<any[]>([])

  // Carica le configurazioni lato client per evitare errori di idratazione
  useEffect(() => {
    setProjectName(getProjectName())
    setLogo(getLogo())
    setPrimaryColor(getPrimaryColor())
    setNavigation(getNavigation())
  }, [])

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto w-full flex h-16 items-center justify-between py-4 px-8 md:px-12">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <img src={logo || "/placeholder.svg"} alt={projectName} className="h-8 w-8" />
            ) : (
              <Building2 className="h-6 w-6" style={{ color: primaryColor }} />
            )}
            <span className="text-xl font-bold">{projectName}</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium hover:text-primary">
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
