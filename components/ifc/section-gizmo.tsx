"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Scissors, RotateCcw, ArrowUpDownIcon as ArrowsUpDown } from "lucide-react"
import * as THREE from "three"
import { MouseWheelHandler } from "./mouse-wheel-handler"
import { CollapsiblePanel } from "./ui/collapsible-panel"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface SectionGizmoProps {
  model: any
  fragments: any
  isModelLoaded: boolean
  world: any
}

export function SectionGizmo({ model, fragments, isModelLoaded, world }: SectionGizmoProps) {
  const [isActive, setIsActive] = useState(false)
  const [sectionPlane, setSectionPlane] = useState<THREE.Plane | null>(null)
  const [sectionValue, setSectionValue] = useState<number | null>(null)
  const [currentAxis, setCurrentAxis] = useState<"x" | "y" | "z">("y")
  const [modelBounds, setModelBounds] = useState<{
    min: THREE.Vector3
    max: THREE.Vector3
    center: THREE.Vector3
    size: THREE.Vector3
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const helperRef = useRef<THREE.Mesh | null>(null)

  // Calcola i limiti del modello quando viene caricato
  useEffect(() => {
    if (isModelLoaded && model && fragments) {
      calculateModelBounds()
    }
  }, [isModelLoaded, model, fragments])

  // Gestisce l'attivazione/disattivazione dello strumento di sezione
  useEffect(() => {
    if (isModelLoaded && world && modelBounds) {
      if (isActive) {
        // Attiva la modalità di sezione
        setupSectionMode()
      } else {
        // Disattiva la modalità di sezione
        clearSection()
      }
    }
  }, [isActive, isModelLoaded, world, modelBounds])

  // Aggiorna il piano di sezione quando cambia il valore o l'asse
  useEffect(() => {
    if (isActive && sectionValue !== null && modelBounds) {
      updateSectionPlane(sectionValue, currentAxis)
    }
  }, [sectionValue, currentAxis, isActive, modelBounds])

  // Cleanup quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (helperRef.current && world && world.scene && world.scene.three) {
        world.scene.three.remove(helperRef.current)
        helperRef.current = null
      }
    }
  }, [world])

  // Calcola i limiti del modello
  const calculateModelBounds = async () => {
    try {
      setLoading(true)

      // Ottieni la bounding box del modello
      const bbox = new THREE.Box3().setFromObject(model.object)
      const min = bbox.min
      const max = bbox.max
      const center = new THREE.Vector3()
      bbox.getCenter(center)
      const size = new THREE.Vector3()
      bbox.getSize(size)

      setModelBounds({
        min,
        max,
        center,
        size,
      })

      // Inizializza il valore di sezione in base all'asse corrente
      if (currentAxis === "x") {
        setSectionValue(center.x)
      } else if (currentAxis === "y") {
        setSectionValue(max.y) // Per l'asse Y, iniziamo dall'alto
      } else {
        setSectionValue(center.z)
      }

      setLoading(false)
    } catch (error) {
      console.error("Error calculating model bounds:", error)
      setLoading(false)
    }
  }

  // Configura la modalità di sezione
  const setupSectionMode = () => {
    if (!modelBounds) return

    // Inizializza il valore di sezione in base all'asse corrente
    let initialValue: number
    if (currentAxis === "x") {
      initialValue = modelBounds.center.x
    } else if (currentAxis === "y") {
      initialValue = modelBounds.max.y // Per l'asse Y, iniziamo dall'alto
    } else {
      initialValue = modelBounds.center.z
    }

    setSectionValue(initialValue)
    updateSectionPlane(initialValue, currentAxis)

    // Posiziona la camera per una vista appropriata
    if (world && world.camera) {
      const center = modelBounds.center.clone()
      const size = modelBounds.size.clone()

      if (currentAxis === "x") {
        // Vista laterale per sezione X
        world.camera.controls.setLookAt(center.x + size.x * 1.5, center.y, center.z, center.x, center.y, center.z, true)
      } else if (currentAxis === "y") {
        // Vista dall'alto per sezione Y
        world.camera.controls.setLookAt(center.x, center.y + size.y * 1.5, center.z, center.x, center.y, center.z, true)
      } else {
        // Vista frontale per sezione Z
        world.camera.controls.setLookAt(center.x, center.y, center.z + size.z * 1.5, center.x, center.y, center.z, true)
      }
    }
  }

  // Aggiorna il piano di sezione
  const updateSectionPlane = (value: number, axis: "x" | "y" | "z") => {
    if (!world || !modelBounds) return

    // Crea un nuovo piano di sezione con la normale appropriata
    let normal: THREE.Vector3
    if (axis === "x") {
      normal = new THREE.Vector3(-1, 0, 0)
    } else if (axis === "y") {
      normal = new THREE.Vector3(0, -1, 0)
    } else {
      normal = new THREE.Vector3(0, 0, -1)
    }

    const plane = new THREE.Plane(normal, value)

    // Aggiorna il piano di clipping nel renderer
    if (world.renderer && world.renderer.three) {
      world.renderer.three.clippingPlanes = [plane]
      world.renderer.three.localClippingEnabled = true
    }

    // Aggiorna i materiali del modello per utilizzare il piano di clipping
    if (model && model.object) {
      model.object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.Material
          if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
            material.clippingPlanes = [plane]
            material.needsUpdate = true
          }
        }
      })
    }

    setSectionPlane(plane)

    // Crea un helper visivo per il piano di sezione
    createSectionHelper(value, axis)

    // Aggiorna la visualizzazione
    if (fragments) {
      fragments.update(true)
    }
  }

  // Crea un helper visivo per il piano di sezione
  const createSectionHelper = (value: number, axis: "x" | "y" | "z") => {
    if (!modelBounds || !world || !world.scene || !world.scene.three) return

    // Rimuovi il helper esistente se presente
    if (helperRef.current) {
      world.scene.three.remove(helperRef.current)
      helperRef.current = null
    }

    // Calcola le dimensioni del piano in base all'asse
    let width: number, height: number, position: THREE.Vector3, rotation: THREE.Euler
    const center = modelBounds.center.clone()
    const size = modelBounds.size.clone()

    if (axis === "x") {
      // Piano YZ
      width = size.z * 1.5
      height = size.y * 1.5
      position = new THREE.Vector3(value + 0.01, center.y, center.z)
      rotation = new THREE.Euler(0, Math.PI / 2, 0)
    } else if (axis === "y") {
      // Piano XZ
      width = size.x * 1.5
      height = size.z * 1.5
      position = new THREE.Vector3(center.x, value + 0.01, center.z)
      rotation = new THREE.Euler(Math.PI / 2, 0, 0)
    } else {
      // Piano XY
      width = size.x * 1.5
      height = size.y * 1.5
      position = new THREE.Vector3(center.x, center.y, value + 0.01)
      rotation = new THREE.Euler(0, 0, 0)
    }

    // Crea un piano per visualizzare la sezione
    const geometry = new THREE.PlaneGeometry(width, height)

    // Usa un materiale con meno opacità e senza wireframe per evitare il flicker
    const material = new THREE.MeshBasicMaterial({
      color: 0x3b82f6, // Blu
      transparent: true,
      opacity: 0.1, // Ridotta opacità
      side: THREE.DoubleSide,
      depthWrite: false, // Importante per evitare artefatti z-fighting
    })

    const plane = new THREE.Mesh(geometry, material)
    plane.name = "sectionHelper"
    plane.position.copy(position)
    plane.setRotationFromEuler(rotation)

    // Aggiungi il piano alla scena
    world.scene.three.add(plane)
    helperRef.current = plane
  }

  // Rimuovi la sezione
  const clearSection = () => {
    // Rimuovi il piano di clipping dal renderer
    if (world && world.renderer && world.renderer.three) {
      world.renderer.three.clippingPlanes = []
      world.renderer.three.localClippingEnabled = false
    }

    // Rimuovi il piano di clipping dai materiali
    if (model && model.object) {
      model.object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.Material
          if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
            material.clippingPlanes = []
            material.needsUpdate = true
          }
        }
      })
    }

    // Rimuovi il helper visivo
    if (helperRef.current && world && world.scene && world.scene.three) {
      world.scene.three.remove(helperRef.current)
      helperRef.current = null
    }

    setSectionPlane(null)

    // Aggiorna la visualizzazione
    if (fragments) {
      fragments.update(true)
    }
  }

  // Gestisce il cambio di asse
  const handleAxisChange = (axis: "x" | "y" | "z") => {
    if (axis === currentAxis) return

    setCurrentAxis(axis)

    // Aggiorna il valore di sezione in base al nuovo asse
    if (modelBounds) {
      let newValue: number
      if (axis === "x") {
        newValue = modelBounds.center.x
      } else if (axis === "y") {
        newValue = modelBounds.max.y // Per l'asse Y, iniziamo dall'alto
      } else {
        newValue = modelBounds.center.z
      }

      setSectionValue(newValue)
    }
  }

  // Ottiene il valore minimo per l'asse corrente
  const getMinValue = () => {
    if (!modelBounds) return 0
    if (currentAxis === "x") return modelBounds.min.x
    if (currentAxis === "y") return modelBounds.min.y
    return modelBounds.min.z
  }

  // Ottiene il valore massimo per l'asse corrente
  const getMaxValue = () => {
    if (!modelBounds) return 0
    if (currentAxis === "x") return modelBounds.max.x
    if (currentAxis === "y") return modelBounds.max.y
    return modelBounds.max.z
  }

  // Ottiene il valore corrente per l'asse selezionato
  const getCurrentValue = () => {
    if (!modelBounds || sectionValue === null) return 0
    return sectionValue
  }

  if (!isModelLoaded) {
    return null
  }

  return (
    <CollapsiblePanel
      title="Sezione Interattiva"
      icon={<Scissors className="h-4 w-4" />}
      defaultOpen={false}
      className="w-full"
      rightElement={
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation() // Previene il toggle del pannello
            setIsActive(!isActive)
          }}
          className={isActive ? "bg-primary/20 h-6 w-6" : "h-6 w-6"}
          title={isActive ? "Disattiva sezione" : "Attiva sezione"}
        >
          {isActive ? <RotateCcw className="h-4 w-4" /> : <Scissors className="h-4 w-4" />}
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-sm">
          {isActive ? (
            <p>
              Seleziona l'asse lungo cui creare la sezione e usa lo slider o la rotellina del mouse per regolare la
              posizione.
            </p>
          ) : (
            <p>Attiva lo strumento di sezione per visualizzare l'interno del modello.</p>
          )}
        </div>

        {isActive && (
          <div className="space-y-4">
            <RadioGroup
              value={currentAxis}
              onValueChange={(value) => handleAxisChange(value as "x" | "y" | "z")}
              className="flex justify-between"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x" id="axis-x" />
                <Label htmlFor="axis-x">Asse X</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="y" id="axis-y" />
                <Label htmlFor="axis-y">Asse Y</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="z" id="axis-z" />
                <Label htmlFor="axis-z">Asse Z</Label>
              </div>
            </RadioGroup>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span>Posizione sezione:</span>
                <ArrowsUpDown className="h-3 w-3 text-muted-foreground" />
              </div>
              <input
                type="range"
                min={getMinValue()}
                max={getMaxValue()}
                step={(getMaxValue() - getMinValue()) / 100}
                value={getCurrentValue()}
                onChange={(e) => setSectionValue(Number.parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>Min: {getMinValue().toFixed(2)}</span>
                <span>Attuale: {getCurrentValue().toFixed(2)}</span>
                <span>Max: {getMaxValue().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              if (isActive) {
                setIsActive(false)
                clearSection()
              } else {
                setIsActive(true)
              }
            }}
          >
            {isActive ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Rimuovi Sezione
              </>
            ) : (
              <>
                <Scissors className="h-4 w-4 mr-2" />
                Crea Sezione
              </>
            )}
          </Button>
        </div>
      </div>
      {isActive && modelBounds && world && sectionValue !== null && (
        <MouseWheelHandler
          isActive={isActive}
          world={world}
          modelBounds={modelBounds}
          sectionHeight={sectionValue}
          onSectionHeightChange={setSectionValue}
          currentAxis={currentAxis}
        />
      )}
    </CollapsiblePanel>
  )
}
