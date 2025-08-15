import { ref } from 'vue'

// Singleton pattern para compartir estado entre componentes
const selectedCategoryRef = ref<string | undefined>(undefined)

/**
 * Composable para gestionar la selección de categoría entre vistas
 */
export function useCategorySelection() {
  /**
   * Establece la categoría seleccionada
   */
  const setSelectedCategory = (category: string | undefined) => {
    selectedCategoryRef.value = category
  }

  /**
   * Obtiene la categoría seleccionada actualmente
   */
  const getSelectedCategory = () => {
    return selectedCategoryRef.value
  }

  /**
   * Limpia la categoría seleccionada
   */
  const clearSelectedCategory = () => {
    selectedCategoryRef.value = undefined
  }

  return {
    selectedCategory: selectedCategoryRef,
    setSelectedCategory,
    getSelectedCategory,
    clearSelectedCategory,
  }
}
