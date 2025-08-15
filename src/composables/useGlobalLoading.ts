import { useLoadingStore } from '@/stores/useLoadingStore'
import { storeToRefs } from 'pinia'

export function useGlobalLoading() {
  const loadingStore = useLoadingStore()
  const { isLoading, loadingMessage } = storeToRefs(loadingStore)

  /**
   * Ejecuta una operación asíncrona mostrando el spinner global durante la ejecución
   * @param operation Función asíncrona a ejecutar
   * @param message Mensaje opcional a mostrar durante la carga
   * @param id Identificador opcional para gestionar múltiples operaciones de carga
   * @returns El resultado de la operación
   */
  const withGlobalLoading = async <T>(
    operation: () => Promise<T>,
    message?: string,
    id?: string
  ): Promise<T> => {
    return loadingStore.withLoading(operation(), message, id)
  }

  return {
    // Estado
    isLoading,
    loadingMessage,

    // Acciones
    startLoading: loadingStore.startLoading,
    stopLoading: loadingStore.stopLoading,
    withGlobalLoading,
  }
}
