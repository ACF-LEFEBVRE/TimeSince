import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { Collection } from '@/plugins/firebase/collections'
import type { Counter } from '@/components/counters/types/counters'

export function useCounters(userId: Ref<string | null>) {
  // COMPOSABLES
  const { db } = useFirebase()

  // DATA
  const favoriteCounters = ref<Counter[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // METHODS
  const loadFavoriteCounters = async () => {
    if (!userId.value) return

    isLoading.value = true
    error.value = null

    try {
      // Usar la subcolección de contadores para cada usuario
      const userCountersRef = collection(db, Collection.USER_COUNTERS(userId.value))
      const q = query(userCountersRef, where('favorite', '==', true))
      const querySnapshot = await getDocs(q)

      favoriteCounters.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Counter[]
    } catch (err) {
      console.error('Error al cargar contadores favoritos:', err)
      error.value = 'Error al cargar los contadores favoritos'
    } finally {
      isLoading.value = false
    }
  }

  // Cargar contadores cuando cambie el userId
  watch(
    userId,
    newUserId => {
      if (newUserId) {
        loadFavoriteCounters()
      } else {
        favoriteCounters.value = []
      }
    },
    { immediate: true }
  )

  return {
    favoriteCounters,
    isLoading,
    error,
    loadFavoriteCounters,
  }
}
