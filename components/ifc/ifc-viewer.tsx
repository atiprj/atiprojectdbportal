"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, RefreshCw, Info, Grid3X3, Sun, Moon, Menu, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Importiamo le librerie necessarie
import * as OBC from "@thatopen/components"
import * as FRAGS from "@thatopen/fragments"
import * as THREE from "three"
import Stats from "stats.js"
import { SectionGizmo } from "./section-gizmo"
import { CollapsiblePanel } from "./ui/collapsible-panel"
import { ClassificationTree } from "./classification-tree"
import { ModelManager } from "./model-manager"
import { ThemeWrapper } from "./theme-wrapper"

// Importiamo la configurazione
import { ifcModelsConfig } from "@/config/project-config"
import { getNavigation } from "@/utils/config-utils"

// Importiamo il ModelStore
import { modelStore } from "@/lib/model-store"

// Definiamo un tipo per le proprietà degli elementi
interface ElementProperty {
  name: string
  value: any
}

interface PropertySet {
  name: string
  properties: ElementProperty[]
}

// Tipo per i modelli configurati
interface ConfiguredModel {
  id: string
  name: string
  description: string
  url: string
  type: "ifc" | "frag"
  category: string
  visible: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  author: string
  version: string
}

export function IfcViewerComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [components, setComponents] = useState<OBC.Components | null>(null)
  const [world, setWorld] = useState<any>(null)
  const [fragments, setFragmentsState] = useState<FRAGS.FragmentsModels | null>(null)
  const [loading, setLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [selectedElement, setSelectedElement] = useState<number | null>(null)
  const [elementName, setElementName] = useState<string | null>(null)
  const [elementProperties, setElementProperties] = useState<PropertySet[]>([])
  const [gridVisible, setGridVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [navigation, setNavigation] = useState<any[]>([])

  // Tema locale solo per l'IFC viewer - NON usa next-themes
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const { toast } = useToast()
  const { user, logout } = useAuth()
  const selectedElementRef = useRef<number | null>(null)
  const selectedModelRef = useRef<string | null>(null)
  const clickListenerRef = useRef<((event: MouseEvent) => void) | null>(null)
  const gridRef = useRef<any>(null)
  const worldRef = useRef<any>(null)

  // Stati per modelli configurati
  const [models, setModels] = useState<Map<string, any>>(new Map())
  const [configuredModels, setConfiguredModels] = useState<ConfiguredModel[]>([])
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map())

  // Evita hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Carica le configurazioni di navigazione
  useEffect(() => {
    setNavigation(getNavigation())
  }, [])

  // Carica i modelli configurati
  useEffect(() => {
    if (ifcModelsConfig && ifcModelsConfig.length > 0) {
      setConfiguredModels(ifcModelsConfig)
    }
  }, [])

  // Helper per sincronizzare ref e state
  const getSelected = () => selectedElementRef.current
  const setSelected = (id: number | null) => {
    selectedElementRef.current = id
    setSelectedElement(id)
    modelStore.selectedElementId = id
  }

  const getSelectedModel = () => selectedModelRef.current
  const setSelectedModel = (id: string | null) => {
    selectedModelRef.current = id
    modelStore.selectedModelId = id
  }

  // Inizializzazione della scena
  useEffect(() => {
    if (!containerRef.current || !mounted) return

    // Creiamo i componenti
    const newComponents = new OBC.Components()

    // Creiamo il mondo
    const worlds = newComponents.get(OBC.Worlds)
    const newWorld = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>()
    worldRef.current = newWorld

    // Configuriamo la scena
    newWorld.scene = new OBC.SimpleScene(newComponents)
    newWorld.scene.setup()

    // Impostiamo lo sfondo in base al tema locale
    newWorld.scene.three.background = isDarkTheme ? new THREE.Color(0x1e1e1e) : new THREE.Color(0xf8fafc)

    // Configuriamo il renderer
    newWorld.renderer = new OBC.SimpleRenderer(newComponents, containerRef.current)

    // Configuriamo la camera
    newWorld.camera = new OBC.SimpleCamera(newComponents)
    newWorld.camera.controls.setLookAt(74, 16, 0.2, 30, -4, 27)

    // Inizializziamo i componenti
    newComponents.init()

    // Aggiungiamo la griglia
    const grids = newComponents.get(OBC.Grids)
    const grid = grids.create(newWorld)
    gridRef.current = grid

    // Configuriamo il worker per i frammenti
    const setupFragments = async () => {
      try {
        const workerUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs"
        const fetchedWorker = await fetch(workerUrl)
        const workerText = await fetchedWorker.text()
        const workerFile = new File([new Blob([workerText])], "worker.mjs", {
          type: "text/javascript",
        })
        const url = URL.createObjectURL(workerFile)

        const newFragments = new FRAGS.FragmentsModels(url)

        newWorld.camera.controls.addEventListener("rest", () => newFragments.update(true))
        newWorld.camera.controls.addEventListener("update", () => newFragments.update())

        setFragmentsState(newFragments)
        modelStore.fragments = newFragments
      } catch (error) {
        console.error("Error setting up fragments:", error)
        toast({
          title: "Errore",
          description: "Impossibile configurare il sistema di frammenti",
          variant: "destructive",
        })
      }
    }

    setupFragments()

    // Stats.js
    const stats = new Stats()
    stats.showPanel(0)
    stats.dom.style.display = "none"
    containerRef.current.appendChild(stats.dom)
    stats.dom.style.position = "absolute"
    stats.dom.style.left = "0px"
    stats.dom.style.top = "0px"
    newWorld.renderer.onBeforeUpdate.add(() => stats.begin())
    newWorld.renderer.onAfterUpdate.add(() => stats.end())

    setComponents(newComponents)
    setWorld(newWorld)

    return () => {
      URL.revokeObjectURL(fragments?.workerURL || "")
      newComponents.dispose()
      stats.dom.remove()

      if (clickListenerRef.current && containerRef.current) {
        containerRef.current.removeEventListener("click", clickListenerRef.current)
      }

      modelStore.reset()
    }
  }, [toast, mounted, isDarkTheme]) // Aggiungiamo isDarkTheme come dipendenza

  // Aggiorna lo sfondo quando cambia il tema locale
  useEffect(() => {
    if (!mounted) return

    const currentWorld = worldRef.current || world
    if (currentWorld && currentWorld.scene && currentWorld.scene.three) {
      currentWorld.scene.three.background = isDarkTheme ? new THREE.Color(0x1e1e1e) : new THREE.Color(0xf8fafc)

      // Forza il rendering per aggiornare immediatamente lo sfondo
      if (currentWorld.renderer && currentWorld.renderer.three) {
        currentWorld.renderer.three.render(currentWorld.scene.three, currentWorld.camera.three)
      }
    }
  }, [isDarkTheme, world, mounted])

  // Carica tutti i modelli configurati
  const loadConfiguredModels = async () => {
    if (!fragments || !world) return

    setLoading(true)

    for (const configModel of configuredModels) {
      if (configModel.visible) {
        try {
          await loadConfiguredModel(configModel)
        } catch (error) {
          console.error(`Error loading model ${configModel.id}:`, error)
          toast({
            title: "Errore",
            description: `Impossibile caricare il modello "${configModel.name}"`,
            variant: "destructive",
          })
        }
      }
    }

    setLoading(false)
  }

  // Carica un singolo modello configurato
  const loadConfiguredModel = async (configModel: ConfiguredModel) => {
    if (!fragments || !world) return

    try {
      console.log(`Caricamento modello: ${configModel.name}`)

      // Imposta lo stato di caricamento per questo modello
      const newLoadingStates = new Map(loadingStates)
      newLoadingStates.set(configModel.id, true)
      setLoadingStates(newLoadingStates)

      // Fetch del file
      const response = await fetch(configModel.url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let fragmentBytes: ArrayBuffer

      if (configModel.type === "ifc") {
        // Converti IFC in Fragment
        const ifcBuffer = await response.arrayBuffer()
        const serializer = new FRAGS.IfcImporter()
        serializer.wasm = { absolute: true, path: "https://unpkg.com/web-ifc@0.0.68/" }

        const ifcBytes = new Uint8Array(ifcBuffer)
        fragmentBytes = await serializer.process({ bytes: ifcBytes })
      } else {
        // File Fragment già processato
        fragmentBytes = await response.arrayBuffer()
      }

      // Carica il modello
      const model = await fragments.load(fragmentBytes.slice(0), { modelId: configModel.id })

      // Conta gli elementi del modello
      let elementCount = 0
      try {
        const categories = await model.getCategories()
        for (const category of categories) {
          const items = await model.getItemsOfCategory(category)
          elementCount += items.length
        }
      } catch (error) {
        console.warn("Error counting elements:", error)
      }

      // Crea le informazioni del modello
      const modelInfo = {
        id: configModel.id,
        name: configModel.name,
        description: configModel.description,
        type: configModel.type,
        category: configModel.category,
        visible: true,
        elementCount,
        model,
        fragmentBytes,
        author: configModel.author,
        version: configModel.version,
        tags: configModel.tags,
        object: model.object, // Salva il riferimento all'oggetto 3D
      }

      // Aggiorna la mappa dei modelli
      const newModels = new Map(models)
      newModels.set(configModel.id, modelInfo)
      setModels(newModels)

      // Aggiorna il model store
      modelStore.addModel(configModel.id, modelInfo)

      // Aggiungi alla scena
      world.scene.three.add(model.object)
      await fragments.update(true)

      // Configura la selezione
      setTimeout(() => {
        setupGlobalElementSelectionWithModels(newModels)
      }, 100)

      setModelLoaded(true)

      toast({
        title: "Successo",
        description: `Modello "${configModel.name}" caricato con successo (${elementCount} elementi)`,
      })

      console.log(`Modello ${configModel.name} caricato e aggiunto alla scena`)
    } catch (error) {
      console.error(`Error loading configured model ${configModel.id}:`, error)
      toast({
        title: "Errore",
        description: `Impossibile caricare il modello "${configModel.name}". Verifica che il file esista nel percorso specificato.`,
        variant: "destructive",
      })
    } finally {
      // Rimuovi lo stato di caricamento
      const newLoadingStates = new Map(loadingStates)
      newLoadingStates.delete(configModel.id)
      setLoadingStates(newLoadingStates)
    }
  }

  // Configurazione del raycaster per la selezione degli elementi - GLOBALE con parametri
  const setupGlobalElementSelectionWithModels = (modelsMap: Map<string, any>) => {
    if (!containerRef.current || !world) return

    const highlightMaterial: FRAGS.MaterialDefinition = {
      color: new THREE.Color("gold"),
      renderedFaces: FRAGS.RenderedFaces.TWO,
      opacity: 1,
      transparent: false,
    }

    // Rimuovi il listener precedente se esiste
    if (clickListenerRef.current && containerRef.current) {
      containerRef.current.removeEventListener("click", clickListenerRef.current)
    }

    const clickHandler = async (event: MouseEvent) => {
      try {
        const mouse = new THREE.Vector2()
        mouse.x = event.clientX
        mouse.y = event.clientY

        // Prova il raycast su tutti i modelli caricati e visibili
        let foundResult = null
        let foundModelId = null
        let foundModel = null

        // Usa la mappa dei modelli passata come parametro
        for (const [currentModelId, modelInfo] of modelsMap) {
          if (!modelInfo.visible) continue // Salta i modelli nascosti

          const currentModel = modelInfo.model || modelInfo
          try {
            const result = await currentModel.raycast({
              camera: world.camera.three,
              mouse,
              dom: world.renderer.three.domElement,
            })

            if (result) {
              foundResult = result
              foundModelId = currentModelId
              foundModel = currentModel
              break // Prendi il primo risultato trovato
            }
          } catch (error) {
            console.warn(`Error raycasting model ${currentModelId}:`, error)
          }
        }
        // Reset highlight precedente
        const oldId = getSelected()
        const oldModelId = getSelectedModel()
        if (oldId !== null && oldModelId) {
          const oldModelInfo = modelsMap.get(oldModelId)
          if (oldModelInfo) {
            const oldModel = oldModelInfo.model || oldModelInfo
            try {
              await oldModel.resetHighlight([oldId])
            } catch (error) {
              console.warn("Error resetting highlight:", error)
            }
          }
        }

        if (foundResult && foundModelId && foundModel) {
          const localId = foundResult.localId
          await foundModel.highlight([localId], highlightMaterial)
          setSelected(localId)
          setSelectedModel(foundModelId)
          await getElementInfo(foundModel, localId)
        } else {
          setSelected(null)
          setSelectedModel(null)
          setElementName(null)
          setElementProperties([])
        }

        await fragments.update(true)
      } catch (error) {
        console.error("Error during raycast:", error)
      }
    }

    clickListenerRef.current = clickHandler
    if (containerRef.current) {
      containerRef.current.addEventListener("click", clickHandler)
    }
  }

  // Configurazione del raycaster per la selezione degli elementi - GLOBALE
  const setupGlobalElementSelection = () => {
    setupGlobalElementSelectionWithModels(models)
  }

  // Aggiorna il sistema di selezione quando cambiano i modelli
  useEffect(() => {
    if (models.size > 0 && world && containerRef.current) {
      setupGlobalElementSelection()
    }
  }, [models, world])

  // Funzione per ottenere le informazioni su un elemento
  const getElementInfo = async (model: any, localId: number) => {
    try {
      const [data] = await model.getItemsData([localId], {
        attributesDefault: true,
      })

      let name = "Elemento sconosciuto"
      if (data.Name && "value" in data.Name) {
        name = data.Name.value as string
      }
      setElementName(name)

      const [psetData] = await model.getItemsData([localId], {
        attributesDefault: false,
        attributes: ["Name", "NominalValue"],
        relations: {
          IsDefinedBy: { attributes: true, relations: true },
          DefinesOcurrence: { attributes: false, relations: false },
        },
      })

      const propertySets: PropertySet[] = []
      const rawPsets = (psetData.IsDefinedBy as any[]) || []

      for (const pset of rawPsets) {
        const { Name: psetName, HasProperties } = pset
        if (!("value" in psetName && Array.isArray(HasProperties))) continue

        const properties: ElementProperty[] = []
        for (const prop of HasProperties) {
          const { Name, NominalValue } = prop
          if (!("value" in Name && "value" in NominalValue)) continue
          const name = Name.value
          const value = NominalValue.value
          if (!(name && value !== undefined)) continue
          properties.push({ name, value })
        }

        if (properties.length > 0) {
          propertySets.push({
            name: psetName.value,
            properties,
          })
        }
      }

      setElementProperties(propertySets)
    } catch (error) {
      console.error("Error getting element info:", error)
    }
  }

  // Funzioni per gestire i modelli - CORRETTE
  const toggleModelVisibility = async (modelId: string) => {
    const modelInfo = models.get(modelId)
    if (!modelInfo || !world) return

    try {
      console.log(`Toggling visibility for model ${modelId}, current visibility: ${modelInfo.visible}`)

      const model = modelInfo.model
      const modelObject = model.object
      const newVisibility = !modelInfo.visible

      if (newVisibility) {
        // Mostra il modello - aggiungilo alla scena se non c'è già
        if (!world.scene.three.children.includes(modelObject)) {
          world.scene.three.add(modelObject)
          console.log(`Added model ${modelId} to scene`)
        }
        modelObject.visible = true
      } else {
        // Nascondi il modello - rendilo invisibile ma non rimuoverlo dalla scena
        modelObject.visible = false
        console.log(`Hidden model ${modelId}`)
      }

      // Aggiorna lo stato
      const newModels = new Map(models)
      const updatedModelInfo = { ...modelInfo, visible: newVisibility }
      newModels.set(modelId, updatedModelInfo)
      setModels(newModels)

      // Aggiorna il model store
      modelStore.addModel(modelId, updatedModelInfo)

      await fragments.update(true)

      console.log(`Model ${modelId} visibility toggled to: ${newVisibility}`)
    } catch (error) {
      console.error("Error toggling model visibility:", error)
    }
  }

  const removeModel = async (modelId: string) => {
    const modelInfo = models.get(modelId)
    if (!modelInfo || !world) return

    try {
      console.log(`Removing model ${modelId}`)

      const model = modelInfo.model
      const modelObject = model.object

      // Rimuovi completamente dalla scena
      if (world.scene.three.children.includes(modelObject)) {
        world.scene.three.remove(modelObject)
        console.log(`Removed model ${modelId} from scene`)
      }

      // Rimuovi dal fragments manager
      try {
        await fragments.disposeModel(modelId)
        console.log(`Disposed model ${modelId} from fragments`)
      } catch (error) {
        console.warn("Error disposing model:", error)
      }

      // Aggiorna gli stati
      const newModels = new Map(models)
      newModels.delete(modelId)
      setModels(newModels)

      // Aggiorna il model store
      modelStore.removeModel(modelId)

      // Reset selezione se era su questo modello
      if (getSelectedModel() === modelId) {
        setSelected(null)
        setSelectedModel(null)
        setElementName(null)
        setElementProperties([])
      }

      // Aggiorna modelLoaded
      setModelLoaded(newModels.size > 0)

      await fragments.update(true)

      toast({
        title: "Successo",
        description: `Modello "${modelInfo.name}" rimosso con successo`,
      })

      console.log(`Model ${modelId} completely removed`)
    } catch (error) {
      console.error("Error removing model:", error)
      toast({
        title: "Errore",
        description: "Impossibile rimuovere il modello",
        variant: "destructive",
      })
    }
  }

  const downloadModel = (modelId: string) => {
    const modelInfo = models.get(modelId)
    if (!modelInfo) return

    const fileName = modelInfo.type === "ifc" ? modelInfo.name.replace(".ifc", ".frag") : modelInfo.name

    const file = new File([modelInfo.fragmentBytes], fileName)
    const a = document.createElement("a")
    a.href = URL.createObjectURL(file)
    a.download = file.name
    a.click()
    URL.revokeObjectURL(a.href)

    toast({
      title: "Successo",
      description: `File "${fileName}" scaricato con successo`,
    })
  }

  // Carica un modello configurato specifico
  const loadSpecificModel = async (configModel: ConfiguredModel) => {
    if (models.has(configModel.id)) {
      toast({
        title: "Informazione",
        description: `Il modello "${configModel.name}" è già caricato`,
      })
      return
    }

    await loadConfiguredModel(configModel)
  }

  // Funzione per pulire completamente la scena
  const clearAllModels = async () => {
    if (!world || !fragments) return

    try {
      console.log("Clearing all models from scene")

      // Rimuovi tutti i modelli dalla scena
      for (const [modelId, modelInfo] of models) {
        const model = modelInfo.model
        const modelObject = model.object

        if (world.scene.three.children.includes(modelObject)) {
          world.scene.three.remove(modelObject)
        }

        try {
          await fragments.disposeModel(modelId)
        } catch (error) {
          console.warn(`Error disposing model ${modelId}:`, error)
        }
      }

      // Reset di tutti gli stati
      setModels(new Map())
      setModelLoaded(false)
      setSelected(null)
      setSelectedModel(null)
      setElementName(null)
      setElementProperties([])

      // Reset del model store
      modelStore.reset()

      await fragments.update(true)

      toast({
        title: "Successo",
        description: "Tutti i modelli sono stati rimossi",
      })

      console.log("All models cleared from scene")
    } catch (error) {
      console.error("Error clearing all models:", error)
    }
  }

  // Funzione per attivare/disattivare la griglia
  const toggleGrid = () => {
    if (gridRef.current) {
      if (gridVisible) {
        gridRef.current.visible = false
      } else {
        gridRef.current.visible = true
      }
      setGridVisible(!gridVisible)
    }
  }

  // Funzione per cambiare il tema (solo locale per l'IFC viewer)
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    // Applichiamo le classi CSS direttamente in base al tema locale
    <div className={`relative w-full h-full ${isDarkTheme ? "dark" : ""}`}>
      {/* Container del visualizzatore */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Barra superiore con logo e controlli */}
      <div
        className={`absolute top-0 left-0 right-0 h-16 ${
          isDarkTheme ? "bg-slate-800/95 border-slate-600/50" : "bg-white/95 border-gray-200"
        } backdrop-blur-md border-b shadow-sm z-50 flex items-center justify-between px-4`}
      >
        {/* Logo e controlli a sinistra */}
        <div className="flex items-center gap-4">
          <div className={`${isDarkTheme ? "bg-slate-700/50" : "bg-white"} p-2 rounded-md shadow-sm`}>
            <Image src="/images/ATI.png" alt="ATI Logo" width={40} height={40} className="h-auto" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleGrid}
              title={gridVisible ? "Nascondi griglia" : "Mostra griglia"}
              className={
                isDarkTheme
                  ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={isDarkTheme ? "Tema chiaro" : "Tema scuro"}
              className={
                isDarkTheme
                  ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            >
              {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Controlli a destra */}
        <div className="flex items-center gap-2">
          {models.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllModels}
              disabled={loading}
              className={`${
                isDarkTheme
                  ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  : "text-red-600 hover:text-red-700 hover:bg-red-50"
              }`}
            >
              Rimuovi Tutti
            </Button>
          )}

          <Button
            variant={isDarkTheme ? "secondary" : "default"}
            size="sm"
            onClick={loadConfiguredModels}
            disabled={loading}
            className={isDarkTheme ? "bg-slate-700 text-slate-200 hover:bg-slate-600 border-slate-600" : ""}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Caricamento...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Carica Tutti
              </>
            )}
          </Button>

          {/* Menu Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={
                  isDarkTheme
                    ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-56 ${
                isDarkTheme
                  ? "bg-slate-800/98 backdrop-blur-md border-slate-700 shadow-xl"
                  : "bg-white/98 backdrop-blur-md border-gray-200 shadow-xl"
              }`}
              align="end"
              forceMount
              sideOffset={5}
            >
              <DropdownMenuLabel className={`font-normal ${isDarkTheme ? "bg-slate-700/50" : "bg-gray-50/80"}`}>
                <div className="flex flex-col space-y-1">
                  <p className={`text-sm font-medium leading-none ${isDarkTheme ? "text-slate-200" : "text-gray-900"}`}>
                    Navigazione
                  </p>
                  <p className={`text-xs leading-none ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}>
                    Sezioni del progetto
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className={isDarkTheme ? "border-slate-700" : ""} />

              {navigation.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  asChild
                  className={`${
                    isDarkTheme
                      ? "bg-slate-800/90 hover:bg-slate-700/90 text-slate-200"
                      : "bg-white/90 hover:bg-gray-50/90"
                  }`}
                >
                  <Link href={item.href} className="w-full cursor-pointer">
                    <span
                      className={`uppercase tracking-wider text-sm font-normal ${
                        isDarkTheme ? "text-slate-300" : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}

              {user && (
                <>
                  <DropdownMenuSeparator className={isDarkTheme ? "border-slate-700" : ""} />
                  <DropdownMenuItem
                    onClick={logout}
                    className={`${
                      isDarkTheme
                        ? "text-red-400 focus:text-red-300 bg-slate-800/90 hover:bg-red-900/20"
                        : "text-red-600 focus:text-red-600 bg-white/90 hover:bg-red-50/90"
                    }`}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="uppercase tracking-wider text-sm font-normal">Logout</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pannello sinistro - Proprietà elemento */}
      {selectedElement !== null && (
        <div className="absolute top-16 left-4 bottom-4 w-80 z-40">
          <ThemeWrapper isDark={isDarkTheme} className="w-full h-full shadow-lg">
            <CollapsiblePanel
              title="Proprietà Elemento"
              icon={<Info className="h-4 w-4" />}
              defaultOpen={true}
              className="w-full h-full"
            >
              <div className="h-full overflow-auto">
                {/* Informazioni sul modello */}
                {getSelectedModel() && (
                  <div
                    className={`mb-4 p-3 rounded-md border ${
                      isDarkTheme ? "bg-blue-900/20 border-blue-800/50" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <h3 className={`text-sm font-medium mb-1 ${isDarkTheme ? "text-blue-300" : "text-blue-800"}`}>
                      Modello
                    </h3>
                    <p className={`text-sm ${isDarkTheme ? "text-blue-200" : "text-blue-600"}`}>
                      {models.get(getSelectedModel())?.name || "Sconosciuto"}
                    </p>
                    <p className={`text-xs ${isDarkTheme ? "text-blue-400" : "text-blue-500"}`}>
                      {models.get(getSelectedModel())?.category} - v{models.get(getSelectedModel())?.version}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className={`text-sm font-medium mb-1 ${isDarkTheme ? "text-slate-200" : "text-gray-900"}`}>
                    Nome Elemento
                  </h3>
                  <p className={`text-sm ${isDarkTheme ? "text-slate-300" : "text-gray-600"}`}>
                    {elementName || "Sconosciuto"}
                  </p>
                </div>

                {elementProperties.length > 0 ? (
                  elementProperties.map((pset, index) => (
                    <div key={index} className="mb-4">
                      <h3 className={`text-sm font-medium mb-1 ${isDarkTheme ? "text-slate-200" : "text-gray-900"}`}>
                        {pset.name}
                      </h3>
                      <div className="space-y-1">
                        {pset.properties.map((prop, propIndex) => (
                          <div key={propIndex} className="text-xs">
                            <span className={`font-medium ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}>
                              {prop.name}:
                            </span>{" "}
                            <span className={isDarkTheme ? "text-slate-400" : "text-gray-600"}>
                              {String(prop.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`text-sm ${isDarkTheme ? "text-slate-400" : "text-gray-500"}`}>
                    Nessuna proprietà disponibile
                  </p>
                )}
              </div>
            </CollapsiblePanel>
          </ThemeWrapper>
        </div>
      )}

      {/* Pannello destro - Controlli modello */}
      <div className="absolute top-16 right-4 bottom-4 w-80 z-40 flex flex-col gap-4 overflow-auto">
        {/* Pannello modelli configurati disponibili */}
        {configuredModels.length > 0 && (
          <ThemeWrapper isDark={isDarkTheme}>
            <CollapsiblePanel
              title="Modelli Configurati"
              icon={<Upload className="h-4 w-4" />}
              defaultOpen={true}
              className="w-full"
            >
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {configuredModels.map((configModel) => {
                  const isLoaded = models.has(configModel.id)
                  const isLoading = loadingStates.get(configModel.id) || false

                  return (
                    <div
                      key={configModel.id}
                      className={`p-3 rounded-lg border ${
                        isDarkTheme ? "bg-slate-800/50 border-slate-700/50" : "bg-gray-50 border-gray-200"
                      } transition-colors`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`text-sm font-medium truncate ${isDarkTheme ? "text-slate-200" : "text-gray-900"}`}
                        >
                          {configModel.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-md font-medium ${
                              configModel.type === "ifc"
                                ? isDarkTheme
                                  ? "bg-blue-900/50 text-blue-300 border border-blue-800/50"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                                : isDarkTheme
                                  ? "bg-green-900/50 text-green-300 border border-green-800/50"
                                  : "bg-green-100 text-green-800 border border-green-200"
                            }`}
                          >
                            {configModel.type.toUpperCase()}
                          </span>
                          {isLoaded && (
                            <span
                              className={`text-xs px-2 py-1 rounded-md font-medium ${
                                isDarkTheme
                                  ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/50"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              }`}
                            >
                              Caricato
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-xs mb-3 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}>
                        {configModel.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDarkTheme ? "text-slate-500" : "text-gray-500"}`}>
                          {configModel.category} - v{configModel.version}
                        </span>
                        <Button
                          variant={isDarkTheme ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => loadSpecificModel(configModel)}
                          disabled={isLoaded || isLoading}
                          className={`text-xs ${
                            isDarkTheme ? "bg-slate-700 text-slate-200 hover:bg-slate-600 border-slate-600" : ""
                          }`}
                        >
                          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : isLoaded ? "Caricato" : "Carica"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CollapsiblePanel>
          </ThemeWrapper>
        )}

        {/* Pannello di gestione modelli caricati */}
        {models.size > 0 && (
          <ThemeWrapper isDark={isDarkTheme}>
            <ModelManager
              models={models}
              onToggleVisibility={toggleModelVisibility}
              onRemoveModel={removeModel}
              onDownloadModel={downloadModel}
              loading={loading}
            />
          </ThemeWrapper>
        )}

        {/* Pannello di classificazione */}
        {modelLoaded && fragments && models.size > 0 && (
          <ThemeWrapper isDark={isDarkTheme}>
            <ClassificationTree models={models} fragments={fragments} isModelLoaded={modelLoaded} />
          </ThemeWrapper>
        )}

        {/* Pannello del gizmo di sezione */}
        {modelLoaded &&
          fragments &&
          models.size > 0 &&
          world &&
          (() => {
            const firstVisibleModel = Array.from(models.values()).find((m) => m.visible)
            return firstVisibleModel ? (
              <ThemeWrapper isDark={isDarkTheme}>
                <SectionGizmo
                  model={firstVisibleModel.model || firstVisibleModel}
                  fragments={fragments}
                  isModelLoaded={modelLoaded}
                  world={world}
                />
              </ThemeWrapper>
            ) : null
          })()}
      </div>

      {/* Informazioni progetto */}
      {models.size > 0 && (
        <div
          className={`absolute bottom-4 left-4 ${
            isDarkTheme ? "bg-slate-800/90 border-slate-700/50 text-slate-200" : "bg-white/95 border-gray-200"
          } backdrop-blur-md p-3 rounded-lg text-xs border shadow-lg z-30`}
        >
          <p className="font-medium mb-1">Statistiche Modelli</p>
          <p>
            Modelli caricati: {models.size}/{configuredModels.length}
          </p>
          <p>Elementi totali: {Array.from(models.values()).reduce((sum, model) => sum + model.elementCount, 0)}</p>
          <p>Modelli visibili: {Array.from(models.values()).filter((m) => m.visible).length}</p>
        </div>
      )}

      {/* Istruzioni */}
      <div
        className={`absolute bottom-4 right-4 ${
          isDarkTheme ? "bg-slate-800/90 border-slate-700/50 text-slate-200" : "bg-white/95 border-gray-200"
        } backdrop-blur-md p-3 rounded-lg text-xs border shadow-lg z-30 max-w-xs`}
      >
        <p className="font-medium mb-1">Istruzioni</p>
        <p className="mb-1">• Clicca su un elemento per selezionarlo</p>
        <p>• Usa i pannelli laterali per gestire modelli e strumenti</p>
      </div>
    </div>
  )
}
