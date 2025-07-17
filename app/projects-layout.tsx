"use client"

import type React from "react"

import { ProjectSidebar } from "@/components/project-sidebar"

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <ProjectSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
