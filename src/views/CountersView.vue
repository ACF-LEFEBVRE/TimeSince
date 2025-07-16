<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard class="mb-5">
          <VCardTitle class="d-flex align-center">
            <h2 class="text-h5">Mis Contadores</h2>
            <VSpacer />
            <VBtn color="primary" @click="showNewCounterDialog = true" prepend-icon="mdi-plus">
              Nuevo contador
            </VBtn>
          </VCardTitle>

          <VDivider />

          <CountersList
            :counters="counters"
            @toggle-favorite="toggleFavorite"
            @delete="deleteCounter"
          />
        </VCard>
      </VCol>
    </VRow>

    <CounterForm v-model="showNewCounterDialog" @submit="handleCounterSubmit" />
  </VContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { useAuth } from '@/composables/useAuth'
import { Collection } from '@/plugins/firebase/collections'
import CountersList from '@/components/counters/CountersList.vue'
import CounterForm from '@/components/counters/CounterForm.vue'
import type { Counter } from '@/components/counters/types/counters'

// COMPOSABLE
const { db } = useFirebase()
const { userId, checkAuth } = useAuth()

// DATA
const counters = ref<Counter[]>([])
const showNewCounterDialog = ref(false)
const isLoading = ref(false)

// HOOKS
onMounted(async () => {
  // Comprobar autenticación sin redirigir (el router guard se encargará de esto)
  await checkAuth()
  
  // Si hay un userId, cargar los contadores
  if (userId.value) {
    loadCounters()
  }
})

// METHODS
// Cargar contadores
const loadCounters = async () => {
  if (!userId.value) return
  isLoading.value = true

  try {
    // Usar la subcolección de contadores para cada usuario
    const userCountersRef = collection(db, Collection.USER_COUNTERS(userId.value))
    const querySnapshot = await getDocs(userCountersRef)

    counters.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Counter[]
  } catch (error) {
    console.error('Error al cargar contadores:', error)
  } finally {
    isLoading.value = false
  }
}

// Procesar los datos del formulario
const handleCounterSubmit = async (formData: any) => {
  if (!userId.value) return

  try {
    const startDate = new Date(formData.date).getTime()

    // Usar la subcolección de contadores para cada usuario
    const userCountersRef = collection(db, Collection.USER_COUNTERS(userId.value))

    await addDoc(userCountersRef, {
      name: formData.name,
      startDate: startDate,
      color: formData.color,
      icon: formData.icon,
      favorite: formData.favorite,
      createdAt: Date.now(),
    })

    loadCounters()
  } catch (error) {
    console.error('Error al crear contador:', error)
  }
}

// Marcar/desmarcar como favorito
const toggleFavorite = async (counter: Counter) => {
  try {
    if (!userId.value) return

    // Actualizar en Firestore usando la ruta de la subcolección
    const counterRef = doc(db, Collection.USER_COUNTERS(userId.value), counter.id)
    await updateDoc(counterRef, {
      favorite: !counter.favorite,
    })

    // Actualizar en la vista local
    counter.favorite = !counter.favorite
  } catch (error) {
    console.error('Error al actualizar favorito:', error)
  }
}

// Eliminar contador
const deleteCounter = async (counterId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este contador?')) return
  if (!userId.value) return

  try {
    // Usar la ruta de la subcolección para eliminar el contador
    await deleteDoc(doc(db, Collection.USER_COUNTERS(userId.value), counterId))
    loadCounters()
  } catch (error) {
    console.error('Error al eliminar contador:', error)
  }
}
</script>
