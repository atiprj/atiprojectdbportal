// Store globale per gestire i modelli e la selezione
class ModelStore {
  public fragments: any = null
  public selectedElementId: number | null = null
  public selectedModelId: string | null = null
  private models: Map<string, any> = new Map()

  addModel(id: string, model: any) {
    this.models.set(id, model)
  }

  removeModel(id: string) {
    this.models.delete(id)
    if (this.selectedModelId === id) {
      this.selectedElementId = null
      this.selectedModelId = null
    }
  }

  getModel(id: string) {
    return this.models.get(id)
  }

  getAllModels() {
    return this.models
  }

  reset() {
    this.fragments = null
    this.selectedElementId = null
    this.selectedModelId = null
    this.models.clear()
  }
}

export const modelStore = new ModelStore()
