import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteRecordName } from 'vue-router'
import { ROUTES } from '@/router/routes'

interface ViewsComposable {
  currentView: ComputedRef<RouteRecordName | undefined>
  isCountersView: ComputedRef<boolean>
  isHomeView: ComputedRef<boolean>
  isLoginView: ComputedRef<boolean>
}

export function useViews(): ViewsComposable {
  // COMPOSABLES
  const route = useRoute()

  // COMPUTED
  const currentView = computed(() => route.name)
  const isLoginView = computed(() => route.name === ROUTES.LOGIN)
  const isHomeView = computed(() => route.name === ROUTES.HOME)
  const isCountersView = computed(() => route.name === ROUTES.COUNTERS)

  return {
    currentView,
    isCountersView,
    isHomeView,
    isLoginView,
  }
}
