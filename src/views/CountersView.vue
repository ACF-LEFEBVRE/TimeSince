<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard class="mb-5">
          <VCardTitle class="d-flex align-center">
            <h2 class="text-h5">{{ text.myCounters }}</h2>
            <VSpacer />
            <VBtn
              color="secondary"
              @click="toggleSortOrder"
              prepend-icon="mdi-sort"
              variant="outlined"
              class="mr-2"
              :title="sortOrderTooltip"
            >
              {{ sortOrderText }}
            </VBtn>
            <VBtn
              color="primary"
              @click="openNewCounterDialog"
              prepend-icon="mdi-plus"
              class="mr-2"
            >
              {{ text.newCounter }}
            </VBtn>
            <VBtn
              v-if="isDevelopment"
              color="secondary"
              @click="loadMockData"
              prepend-icon="mdi-database-import"
              variant="outlined"
            >
              Cargar Mock Data
            </VBtn>
          </VCardTitle>

          <VDivider />

          <CountersList
            :counters="sortedCounters"
            @toggle-favorite="toggleFavorite"
            @delete="deleteCounter"
            @edit="editCounter"
          />
        </VCard>
      </VCol>
    </VRow>

    <CounterForm 
      v-model="showCounterDialog" 
      :edit-counter="counterToEdit" 
      @submit="handleCounterSubmit" 
    />
  </VContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { useI18n } from 'vue-i18n'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { useAuth } from '@/composables/useAuth'
import { Collection } from '@/plugins/firebase/collections'
import CountersList from '@/components/counters/CountersList.vue'
import CounterForm from '@/components/counters/CounterForm.vue'
import type { Counter } from '@/components/counters/types/counters'
import { loadMockCountersForUser } from '@/utils/mockData'

// TRANSLATION
const { t } = useI18n()

const text = {
  createError: t('counters.createError'),
  deleteConfirmation: t('counters.deleteConfirmation'),
  deleteError: t('counters.deleteError'),
  loadError: t('counters.loadError'),
  myCounters: t('counters.myCounters'),
  newCounter: t('counters.newCounter'),
  updateError: t('counters.updateError'),
}

// COMPOSABLE
const { db } = useFirebase()
const { userId, checkAuth } = useAuth()

// DATA
const counters = ref<Counter[]>([])
const showCounterDialog = ref(false)
const isLoading = ref(false)
const counterToEdit = ref<Counter | null>(null)
const sortNewestFirst = ref(true) // Por defecto, ordenar de más recientes a más antiguos

// Verificar si estamos en entorno de desarrollo
const isDevelopment = computed(() => import.meta.env.MODE === 'development')

// Texto para el botón de ordenación
const sortOrderText = computed(() => sortNewestFirst.value ? t('counters.newestFirst') : t('counters.oldestFirst'))
const sortOrderTooltip = computed(() => sortNewestFirst.value 
  ? t('counters.sortByOldest') 
  : t('counters.sortByNewest'))

// Función para ordenar los contadores
const sortedCounters = computed(() => {
  if (!counters.value.length) return []
  
  // Crear una copia para no modificar el original
  const sorted = [...counters.value]
  
  return sorted.sort((a, b) => {
    // Ordenar según la preferencia del usuario usando solo startDate
    return sortNewestFirst.value
      ? b.startDate - a.startDate // Más recientes primero
      : a.startDate - b.startDate // Más antiguos primero
  })
})

// Función para cambiar el orden
const toggleSortOrder = () => {
  sortNewestFirst.value = !sortNewestFirst.value
}

// Función para cargar datos mock
const loadMockData = async () => {
  if (!userId.value) return

  const confirmed = confirm(
    '¿Estás seguro de que quieres cargar 20 contadores aleatorios? Esta acción no se puede deshacer.'
  )
  if (!confirmed) return

  isLoading.value = true
  try {
    await loadMockCountersForUser(userId.value)
    // Recargar los contadores después de añadir los mocks
    await loadCounters()
  } catch (error) {
    console.error('Error al cargar los datos mock:', error)
  } finally {
    isLoading.value = false
  }
}

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
    console.error(text.loadError, error)
  } finally {
    isLoading.value = false
  }
}

// Procesar los datos del formulario
const handleCounterSubmit = async (formData: any) => {
  if (!userId.value) return

  try {
    const startDate = new Date(formData.date).getTime()
    
    if (formData.isEditing) {
      // Actualizar contador existente
      const counterRef = doc(db, Collection.USER_COUNTERS(userId.value), formData.id)
      await updateDoc(counterRef, {
        name: formData.name,
        startDate: startDate,
        color: formData.color,
        icon: formData.icon,
        favorite: formData.favorite,
        category: formData.category || null,
        description: formData.description || null,
      })
    } else {
      // Crear nuevo contador
      const userCountersRef = collection(db, Collection.USER_COUNTERS(userId.value))
      await addDoc(userCountersRef, {
        name: formData.name,
        startDate: startDate,
        color: formData.color,
        icon: formData.icon,
        favorite: formData.favorite,
        category: formData.category || null,
        description: formData.description || null,
      })
    }

    loadCounters()
    counterToEdit.value = null
  } catch (error) {
    console.error(formData.isEditing ? text.updateError : text.createError, error)
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
    console.error(text.updateError, error)
  }
}

// Eliminar contador
const deleteCounter = async (counterId: string) => {
  if (!confirm(text.deleteConfirmation)) return
  if (!userId.value) return

  try {
    // Usar la ruta de la subcolección para eliminar el contador
    await deleteDoc(doc(db, Collection.USER_COUNTERS(userId.value), counterId))
    loadCounters()
  } catch (error) {
    console.error(text.deleteError, error)
  }
}

// Abrir diálogo para crear un nuevo contador
const openNewCounterDialog = () => {
  counterToEdit.value = null
  showCounterDialog.value = true
}

// Preparar edición de contador
const editCounter = (counter: Counter) => {
  counterToEdit.value = counter
  showCounterDialog.value = true
}
</script>
