import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  // Estado
  const isLoading = ref(false)
  const loadingMessage = ref<string | null>(null)
  const loadingStack = ref<string[]>([])

  // Acciones
  const startLoading = (message?: string, id?: string) => {
    isLoading.value = true

    if (message) {
      loadingMessage.value = message
    }

    // Si se proporciona un ID, lo guardamos en el stack
    if (id) {
      loadingStack.value.push(id)
    }
  }

  const stopLoading = (id?: string) => {
    // Si se proporciona un ID, lo eliminamos del stack
    if (id) {
      loadingStack.value = loadingStack.value.filter(item => item !== id)
    }

    // Solo detenemos la carga si no hay más operaciones pendientes
    if (!id || loadingStack.value.length === 0) {
      isLoading.value = false
      loadingMessage.value = null
    }
  }

  // Método útil para envolver promesas con el estado de carga
  const withLoading = async <T>(promise: Promise<T>, message?: string, id?: string): Promise<T> => {
    try {
      startLoading(message, id)
      return await promise
    } finally {
      stopLoading(id)
    }
  }

  return {
    // Estado
    isLoading,
    loadingMessage,
    loadingStack,

    // Acciones
    startLoading,
    stopLoading,
    withLoading,
  }
})
