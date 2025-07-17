"use client"

import type { ReactNode } from "react"

interface ThemeWrapperProps {
  isDark: boolean
  children: ReactNode
  className?: string
}

export function ThemeWrapper({ isDark, children, className = "" }: ThemeWrapperProps) {
  return <div className={`${isDark ? "dark" : ""} ${className}`}>{children}</div>
}
