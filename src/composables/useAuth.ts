import { ref, onMounted } from 'vue'
import { ROUTES } from '@/router/routes'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const currentUser = ref<User | null>(null)
  const userId = ref<string | null>(null)
  
  // Datos de registro
  const daysRegistered = ref<number | null>(null)
  const registrationDate = ref<string>('')

  // METHODS
  // Calcular días desde registro
  const calculateDaysSinceRegistration = (creationTime: number) => {
    const creationDate = new Date(creationTime)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - creationDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Formatear fecha para mostrar
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  
  const logout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      router.push(ROUTES.LOGIN)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // HOOKS
  onMounted(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, user => {
      isAuthenticated.value = !!user
      currentUser.value = user
      userId.value = user ? user.uid : null
      
      // Obtener metadata de creación de cuenta
      if (user && user.metadata && user.metadata.creationTime) {
        const creationTime = Date.parse(user.metadata.creationTime)
        daysRegistered.value = calculateDaysSinceRegistration(creationTime)
        registrationDate.value = formatDate(creationTime)
      } else {
        daysRegistered.value = null
        registrationDate.value = ''
      }
    })
  })

  return {
    isAuthenticated,
    currentUser,
    userId,
    daysRegistered,
    registrationDate,
    logout,
  }
}
