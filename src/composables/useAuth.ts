import { ref, onMounted } from 'vue'
import { ROUTES } from '@/router/routes'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const currentUser = ref<User | null>(null)

  // HOOKS
  onMounted(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, user => {
      isAuthenticated.value = !!user
      currentUser.value = user
    })
  })

  // METHODS
  const logout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      router.push(ROUTES.LOGIN)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return {
    isAuthenticated,
    currentUser,
    logout,
  }
}
