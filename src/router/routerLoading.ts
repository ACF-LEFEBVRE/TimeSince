import { useLoadingStore } from '@/stores/useLoadingStore'
import { type Router } from 'vue-router'

export function setupRouterLoading(router: Router): void {
  const loadingStore = useLoadingStore()

  // Iniciar la carga al comenzar la navegación
  router.beforeEach((to, _, next) => {
    // Solo activamos el spinner para navegaciones que no sean la inicial
    // o si explícitamente se solicita en los metadatos de la ruta
    const showLoadingSpinner = to.meta.showLoader !== false

    if (showLoadingSpinner) {
      // Usar el nombre de la ruta como ID para poder cancelar específicamente esta carga
      const routeId = `route-${to.name?.toString() || 'unknown'}`
      loadingStore.startLoading(`Cargando ${to.meta.title || to.name?.toString() || ''}`, routeId)
    }
    next()
  })

  // Detener la carga al finalizar la navegación
  router.afterEach(to => {
    const routeId = `route-${to.name?.toString() || 'unknown'}`
    loadingStore.stopLoading(routeId)
  })

  // También detener la carga si hay un error en la navegación
  router.onError(() => {
    loadingStore.stopLoading()
  })
}
