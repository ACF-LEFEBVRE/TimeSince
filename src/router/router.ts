import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import LoginView from '@/views/login/LoginView.vue'
import HomeView from '@/views/home/HomeView.vue'
import { ROUTES } from '@/router/routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: `/${ROUTES.LOGIN}`,
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: `/${ROUTES.HOME}`,
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: `/${ROUTES.COUNTERS}`,
    name: 'Counters',
    component: () => import('@/views/CountersView.vue'),
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
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  try {
    // Convertir onAuthStateChanged en una promesa para usar async/await
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        user => {
          unsubscribe()
          resolve(user)
        },
        error => {
          unsubscribe()
          reject(error)
        }
      )
    })

    // Lógica de navegación simplificada
    if (requiresAuth && !user) {
      return next(ROUTES.LOGIN)
    } else if (to.path === `/${ROUTES.LOGIN}` && user) {
      return next(ROUTES.HOME)
    }

    return next()
  } catch (error) {
    console.error('Error al verificar estado de autenticación:', error)
    return requiresAuth ? next(ROUTES.LOGIN) : next()
  }
})

export default router
