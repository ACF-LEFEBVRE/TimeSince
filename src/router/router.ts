import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import LoginView from '@/views/login/LoginView.vue'
import HomeView from '@/views/home/HomeView.vue'
import { ROUTES } from '@/router/routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: `/${ROUTES.LOGIN}`,
    name: ROUTES.LOGIN,
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: `/${ROUTES.HOME}`,
    name: ROUTES.HOME,
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: `/${ROUTES.COUNTERS}`,
    name: ROUTES.COUNTERS,
    component: () => import('@/views/counters/CountersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: `/${ROUTES.CATEGORIES}`,
    name: ROUTES.CATEGORIES,
    component: () => import('@/views/categories/CategoriesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: ROUTES.HOME,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navegación protegida - versión simplificada
router.beforeEach(async (to, _from, next) => {
  const { checkAuth } = useAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  try {
    const isAuthenticated = await checkAuth()
    const user = isAuthenticated ? true : null

    // Si va a login y está autenticado, redirigir a home
    if (to.path === `/${ROUTES.LOGIN}` && user) {
      return next(`/${ROUTES.HOME}`)
    }

    // Si requiere auth y no está autenticado
    if (requiresAuth && !user) {
      return next(`/${ROUTES.LOGIN}`)
    }

    // Permitir navegación normal en todos los demás casos
    return next()
  } catch (error) {
    console.error('Error al verificar estado de autenticación:', error)
    return requiresAuth ? next(`/${ROUTES.LOGIN}`) : next()
  }
})

export default router
