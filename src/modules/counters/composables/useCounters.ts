import { ref, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { Collection } from '@/plugins/firebase/collections'
import type { Counter } from '@/modules/counters/types/counters'

export function useCounters(userId: Ref<string | null>) {
  // COMPOSABLES
  const { db } = useFirebase()

  // DATA
  const allCounters = ref<Counter[]>([])
  const favoriteCounters = computed(() => allCounters.value.filter(counter => counter.favorite))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // METHODS
  const loadAllCounters = async () => {
    if (!userId.value) return

    isLoading.value = true
    error.value = null

    try {
      // Usar la subcolección de contadores para cada usuario
      const userCountersRef = collection(db, Collection.USER_COUNTERS(userId.value))
      const querySnapshot = await getDocs(userCountersRef)

      allCounters.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Counter[]
    } catch (err) {
      console.error('Error al cargar contadores:', err)
      error.value = 'Error al cargar los contadores'
    } finally {
      isLoading.value = false
    }
  }

  // Cargar contadores cuando cambie el userId
  watch(
    userId,
    newUserId => {
      if (newUserId) {
        loadAllCounters()
      } else {
        allCounters.value = []
      }
    },
    { immediate: true }
  )

  return {
    allCounters,
    favoriteCounters,
    isLoading,
    error,
    loadAllCounters,
  }
}
