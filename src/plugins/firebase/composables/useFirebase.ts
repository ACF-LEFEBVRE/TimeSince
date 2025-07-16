import '@/plugins/firebase/firebase'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

/**
 * Composable para acceder a las instancias de Firebase
 * Centraliza el acceso a Auth y Firestore en un solo lugar
 */
export function useFirebase() {
  // Obtener instancias de Firebase
  const auth: Auth = getAuth()
  const db: Firestore = getFirestore()

  return {
    auth,
    db,
  }
}
