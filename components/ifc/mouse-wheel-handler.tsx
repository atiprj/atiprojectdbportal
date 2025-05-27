"use client"

import { useEffect } from "react"
import type * as THREE from "three"

interface MouseWheelHandlerProps {
  isActive: boolean
  world: any
  modelBounds: {
    min: THREE.Vector3
    max: THREE.Vector3
    center: THREE.Vector3
    size: THREE.Vector3
  } | null
  sectionHeight: number | null
  onSectionHeightChange: (height: number) => void
  currentAxis: "x" | "y" | "z"
}

export function MouseWheelHandler({
  isActive,
  world,
  modelBounds,
  sectionHeight,
  onSectionHeightChange,
  currentAxis,
}: MouseWheelHandlerProps) {
  useEffect(() => {
    if (!isActive || !world || !modelBounds || sectionHeight === null) return

    const handleWheel = (event: WheelEvent) => {
      // Previeni lo scroll della pagina
      event.preventDefault()

      // Calcola il passo in base alla dimensione del modello
      let step: number
      if (currentAxis === "x") {
        step = modelBounds.size.x * 0.01 * (event.deltaY > 0 ? -1 : 1)
      } else if (currentAxis === "y") {
        step = modelBounds.size.y * 0.01 * (event.deltaY > 0 ? -1 : 1)
      } else {
        step = modelBounds.size.z * 0.01 * (event.deltaY > 0 ? -1 : 1)
      }

      // Calcola la nuova posizione
      let newValue = sectionHeight + step

      // Limita il valore ai limiti del modello
      let min: number, max: number
      if (currentAxis === "x") {
        min = modelBounds.min.x
        max = modelBounds.max.x
      } else if (currentAxis === "y") {
        min = modelBounds.min.y
        max = modelBounds.max.y
      } else {
        min = modelBounds.min.z
        max = modelBounds.max.z
      }

      newValue = Math.max(min, Math.min(max, newValue))

      // Aggiorna la posizione della sezione
      onSectionHeightChange(newValue)
    }

    // Aggiungi l'event listener
    const renderer = world.renderer.three.domElement
    renderer.addEventListener("wheel", handleWheel, { passive: false })

    // Cleanup
    return () => {
      renderer.removeEventListener("wheel", handleWheel)
    }
  }, [isActive, world, modelBounds, sectionHeight, onSectionHeightChange, currentAxis])

  return null
}
