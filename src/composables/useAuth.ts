import { ref, readonly } from 'vue'
import { ROUTES } from '@/router/routes'
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { Collection } from '@/plugins/firebase/collections'
import { useFirebaseErrors } from '@/plugins/firebase/composables/useFirebaseErrors'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { useDateCalculation } from '@/composables/useDateCalculation'

export interface AuthCredentials {
  email: string
  password: string
}

export function useAuth() {
  // COMPOSABLES
  const router = useRouter()
  const { getErrorMessage } = useFirebaseErrors()
  const { auth, db } = useFirebase()
  const { formatDate, calculateDays } = useDateCalculation()

  // DATA
  const isAuthenticated = ref(false)
  const currentUser = ref<User | null>(null)
  const userId = ref<string | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  // Datos de registro
  const daysRegistered = ref<number | null>(null)
  const registrationDate = ref<string>('')

  const logout = async () => {
    try {
      await signOut(auth)
      router.push(`/${ROUTES.LOGIN}`)
    } catch (err) {
      error.value = getErrorMessage(err)
      console.error('Error al cerrar sesión:', err)
    }
  }

  // Método para iniciar sesión
  const login = async (credentials: AuthCredentials) => {
    error.value = null
    isLoading.value = true

    try {
      // Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      const user = userCredential.user

      // Actualizar la fecha de último acceso
      await setDoc(
        doc(db, Collection.USERS, user.uid),
        {
          lastLogin: Date.now(),
        },
        { merge: true }
      )

      router.push(`/${ROUTES.HOME}`)
      return true
    } catch (err) {
      error.value = getErrorMessage(err)
      console.error('Error al iniciar sesión:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Método para registrarse
  const register = async (credentials: AuthCredentials) => {
    error.value = null
    isLoading.value = true

    try {
      // Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      const user = userCredential.user

      // Crear el documento del usuario en Firestore
      await setDoc(doc(db, Collection.USERS, user.uid), {
        email: user.email,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      })

      router.push(`/${ROUTES.HOME}`)
      return true
    } catch (err) {
      error.value = getErrorMessage(err)
      console.error('Error al registrar usuario:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Método para verificar si el usuario está autenticado (útil para guards de rutas)
   * @returns Promise<boolean> - true si el usuario está autenticado, false en caso contrario
   */
  const checkAuth = async (): Promise<boolean> => {
    if (currentUser.value) return true

    return new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe()
        resolve(!!user)
      })
    })
  }

  /**
   * Método que permite suscribirse a cambios en el estado de autenticación
   * @param callback - Función a ejecutar cuando cambia el estado de autenticación
   * @returns Función para cancelar la suscripción
   */
  const subscribeToAuthChanges = (callback: (isAuthenticated: boolean) => void): () => void => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      callback(!!user)
    })
    return unsubscribe
  }

  // HOOKS
  // Inicialización - eliminar onMounted ya que queremos que se ejecute inmediatamente
  onAuthStateChanged(auth, user => {
    isAuthenticated.value = !!user
    currentUser.value = user
    userId.value = user ? user.uid : null
    isLoading.value = false

    // Obtener metadata de creación de cuenta
    if (user && user.metadata && user.metadata.creationTime) {
      const creationTime = Date.parse(user.metadata.creationTime)
      // Extraer solo el número de días del texto "X días"
      const daysText = calculateDays(creationTime)
      daysRegistered.value = parseInt(daysText.split(' ')[0], 10)
      registrationDate.value = formatDate(creationTime)
    } else {
      daysRegistered.value = null
      registrationDate.value = ''
    }
  })

  return {
    isAuthenticated: readonly(isAuthenticated),
    currentUser: readonly(currentUser),
    userId: readonly(userId),
    isLoading: readonly(isLoading),
    error: readonly(error),
    daysRegistered: readonly(daysRegistered),
    registrationDate: readonly(registrationDate),
    logout,
    login,
    register,
    checkAuth,
    subscribeToAuthChanges,
  }
}
