"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, RefreshCw, Info, Grid3X3, Sun, Moon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import Image from "next/image"

// Importiamo le librerie necessarie
import * as OBC from "@thatopen/components"
import * as FRAGS from "@thatopen/fragments"
import * as THREE from "three"
import Stats from "stats.js"
import { SectionGizmo } from "./section-gizmo"
import { CollapsiblePanel } from "./ui/collapsible-panel"
import { ClassificationTree } from "./classification-tree"
import { ModelManager } from "./model-manager"

// Importiamo la configurazione
import { ifcModelsConfig } from "@/config/project-config"

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
  const { toast } = useToast()
  const { theme, setTheme, resolvedTheme } = useTheme()
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

    // Impostiamo lo sfondo in base al tema
    const isDark = resolvedTheme === "dark"
    newWorld.scene.three.background = isDark ? new THREE.Color(0x1a1a1a) : new THREE.Color(0xf5f5f5)

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
  }, [toast, mounted])

  // Carica automaticamente i modelli configurati quando il sistema è pronto
  useEffect(() => {
    if (fragments && world && configuredModels.length > 0 && models.size === 0) {
      loadConfiguredModels()
    }
  }, [fragments, world, configuredModels])

  // Aggiorna lo sfondo quando cambia il tema
  useEffect(() => {
    if (!mounted) return

    const currentWorld = worldRef.current || world
    if (currentWorld && currentWorld.scene && currentWorld.scene.three) {
      const isDark = resolvedTheme === "dark"
      currentWorld.scene.three.background = isDark ? new THREE.Color(0x1a1a1a) : new THREE.Color(0xf5f5f5)

      // Forza il rendering per aggiornare immediatamente lo sfondo
      if (currentWorld.renderer && currentWorld.renderer.three) {
        currentWorld.renderer.three.render(currentWorld.scene.three, currentWorld.camera.three)
      }
    }
  }, [resolvedTheme, world, mounted])

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
        description: `Modello "${configModel.name}" caricato con successo`,
      })
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

  // Funzioni per gestire i modelli
  const toggleModelVisibility = async (modelId: string) => {
    const modelInfo = models.get(modelId)
    if (!modelInfo || !world) return

    try {
      setLoading(true)
      const model = modelInfo.model || modelInfo
      const newVisibility = !modelInfo.visible

      if (newVisibility) {
        // Mostra il modello
        world.scene.three.add(model.object)
      } else {
        // Nascondi il modello
        world.scene.three.remove(model.object)
      }

      // Aggiorna lo stato
      const newModels = new Map(models)
      const updatedModelInfo = { ...modelInfo, visible: newVisibility }
      newModels.set(modelId, updatedModelInfo)
      setModels(newModels)

      // Aggiorna il model store
      modelStore.addModel(modelId, updatedModelInfo)

      await fragments.update(true)
      setLoading(false)
    } catch (error) {
      console.error("Error toggling model visibility:", error)
      setLoading(false)
    }
  }

  const removeModel = async (modelId: string) => {
    const modelInfo = models.get(modelId)
    if (!modelInfo || !world) return

    try {
      setLoading(true)

      // Rimuovi dalla scena
      const model = modelInfo.model || modelInfo
      world.scene.three.remove(model.object)

      // Rimuovi dal fragments manager
      try {
        await fragments.disposeModel(modelId)
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
    } catch (error) {
      console.error("Error removing model:", error)
      toast({
        title: "Errore",
        description: "Impossibile rimuovere il modello",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  // Funzione per cambiare il tema
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const currentTheme = resolvedTheme || "light"
  const isDarkTheme = currentTheme === "dark"

  if (!mounted) {
    return null
  }

  return (
    <div className="relative w-full h-full">
      {/* Container del visualizzatore */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Barra superiore con logo e controlli */}
      <div
        className={`absolute top-0 left-0 right-0 h-16 ${isDarkTheme ? "bg-gray-900/90" : "bg-white/90"} backdrop-blur-sm border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"} z-50 flex items-center justify-between px-4`}
      >
        {/* Logo e controlli a sinistra */}
        <div className="flex items-center gap-4">
          <div className={`${isDarkTheme ? "bg-gray-800" : "bg-white"} p-2 rounded-md shadow-sm`}>
            <Image src="/images/logo.png" alt="BIM Project Logo" width={40} height={40} className="h-auto" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleGrid}
              title={gridVisible ? "Nascondi griglia" : "Mostra griglia"}
              className={isDarkTheme ? "border-gray-700 hover:bg-gray-800" : ""}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              title={isDarkTheme ? "Tema chiaro" : "Tema scuro"}
              className={isDarkTheme ? "border-gray-700 hover:bg-gray-800" : ""}
            >
              {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Controlli a destra */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadConfiguredModels}
            disabled={loading}
            className={isDarkTheme ? "border-gray-700 hover:bg-gray-800" : ""}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Caricamento...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Ricarica Modelli
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Pannello sinistro - Proprietà elemento */}
      {selectedElement !== null && (
        <div className="absolute top-16 left-4 bottom-4 w-80 z-40">
          <CollapsiblePanel
            title="Proprietà Elemento"
            icon={<Info className="h-4 w-4" />}
            defaultOpen={true}
            className={`w-full h-full ${isDarkTheme ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="h-full overflow-auto">
              {/* Informazioni sul modello */}
              {getSelectedModel() && (
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-200">Modello</h3>
                  <p className={`text-sm ${isDarkTheme ? "text-blue-300" : "text-blue-600"}`}>
                    {models.get(getSelectedModel())?.name || "Sconosciuto"}
                  </p>
                  <p className={`text-xs ${isDarkTheme ? "text-blue-400" : "text-blue-500"}`}>
                    {models.get(getSelectedModel())?.category} - v{models.get(getSelectedModel())?.version}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Nome Elemento</h3>
                <p className={`text-sm ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
                  {elementName || "Sconosciuto"}
                </p>
              </div>

              {elementProperties.length > 0 ? (
                elementProperties.map((pset, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-sm font-medium mb-1">{pset.name}</h3>
                    <div className="space-y-1">
                      {pset.properties.map((prop, propIndex) => (
                        <div key={propIndex} className="text-xs">
                          <span className="font-medium">{prop.name}:</span>{" "}
                          <span className={isDarkTheme ? "text-gray-400" : "text-gray-600"}>{String(prop.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}>
                  Nessuna proprietà disponibile
                </p>
              )}
            </div>
          </CollapsiblePanel>
        </div>
      )}

      {/* Pannello destro - Controlli modello */}
      <div className="absolute top-16 right-4 bottom-4 w-80 z-40 flex flex-col gap-4 overflow-auto">
        {/* Pannello modelli configurati disponibili */}
        {configuredModels.length > 0 && (
          <CollapsiblePanel
            title="Modelli Configurati"
            icon={<Upload className="h-4 w-4" />}
            defaultOpen={true}
            className="w-full"
          >
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {configuredModels.map((configModel) => {
                const isLoaded = models.has(configModel.id)
                const isLoading = loadingStates.get(configModel.id) || false

                return (
                  <div
                    key={configModel.id}
                    className={`p-3 rounded-md border ${isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium truncate">{configModel.name}</h4>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            configModel.type === "ifc" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {configModel.type.toUpperCase()}
                        </span>
                        {isLoaded && (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Caricato</span>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs mb-2 ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
                      {configModel.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkTheme ? "text-gray-500" : "text-gray-500"}`}>
                        {configModel.category} - v{configModel.version}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadSpecificModel(configModel)}
                        disabled={isLoaded || isLoading}
                        className="text-xs"
                      >
                        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : isLoaded ? "Caricato" : "Carica"}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CollapsiblePanel>
        )}

        {/* Pannello di gestione modelli caricati */}
        {models.size > 0 && (
          <ModelManager
            models={models}
            onToggleVisibility={toggleModelVisibility}
            onRemoveModel={removeModel}
            onDownloadModel={downloadModel}
            loading={loading}
          />
        )}

        {/* Pannello di classificazione */}
        {modelLoaded && fragments && models.size > 0 && (
          <ClassificationTree models={models} fragments={fragments} isModelLoaded={modelLoaded} />
        )}

        {/* Pannello del gizmo di sezione */}
        {modelLoaded &&
          fragments &&
          models.size > 0 &&
          world &&
          (() => {
            const firstVisibleModel = Array.from(models.values()).find((m) => m.visible)
            return firstVisibleModel ? (
              <SectionGizmo
                model={firstVisibleModel.model || firstVisibleModel}
                fragments={fragments}
                isModelLoaded={modelLoaded}
                world={world}
              />
            ) : null
          })()}
      </div>

      {/* Informazioni progetto */}
      {models.size > 0 && (
        <div
          className={`absolute bottom-4 left-4 ${isDarkTheme ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-sm p-2 rounded-md text-xs ${isDarkTheme ? "border-gray-700" : "border-gray-200"} border z-30`}
        >
          <p>
            Modelli caricati: {models.size}/{configuredModels.length}
          </p>
          <p>Elementi totali: {Array.from(models.values()).reduce((sum, model) => sum + model.elementCount, 0)}</p>
        </div>
      )}

      {/* Istruzioni */}
      <div
        className={`absolute bottom-4 right-4 ${isDarkTheme ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-sm p-2 rounded-md text-xs ${isDarkTheme ? "border-gray-700" : "border-gray-200"} border z-30`}
      >
        <p>Clicca su un elemento per selezionarlo e visualizzarne le proprietà</p>
        <p>Usa i pannelli laterali per gestire modelli e strumenti</p>
      </div>
    </div>
  )
}
