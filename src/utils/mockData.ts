import { collection, addDoc } from 'firebase/firestore'
import { mockCounters } from './mockCounters'
import { Collection } from '@/plugins/firebase/collections'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'

/**
 * Función que carga los contadores mock en Firestore para un usuario específico
 * @param userId - El ID del usuario al que se le cargarán los contadores
 * @returns Promise<void>
 */
export const loadMockCountersForUser = async (userId: string): Promise<void> => {
  if (!userId) {
    console.error('Se requiere un ID de usuario para cargar los contadores mock')
    return
  }

  const { db } = useFirebase()
  const userCountersRef = collection(db, Collection.USER_COUNTERS(userId))

  // Añadir cada contador a Firestore
  const promises = mockCounters.map(counter => {
    // Eliminamos el ID generado localmente para que Firestore genere uno nuevo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...counterData } = counter

    // Añadimos la fecha de creación
    return addDoc(userCountersRef, {
      ...counterData,
      createdAt: Date.now(),
    })
  })

  try {
    await Promise.all(promises)
    console.log(`Se han cargado ${mockCounters.length} contadores mock para el usuario ${userId}`)
  } catch (error) {
    console.error('Error al cargar los contadores mock:', error)
  }
}
