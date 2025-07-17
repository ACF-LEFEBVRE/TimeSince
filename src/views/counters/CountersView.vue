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

          <VCardText>
            <SearchCounter :initial-query="searchQuery" @search="handleSearch" />
          </VCardText>

          <VDivider />

          <CountersList
            :counters="sortedCounters"
            :is-searching="!!searchQuery.trim()"
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
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { useI18n } from 'vue-i18n'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { useAuth } from '@/composables/useAuth'
import { useCounters } from '@/components/counters/composables/useCounters'
import { Collection } from '@/plugins/firebase/collections'
import CountersList from '@/components/counters/list/CountersList.vue'
import CounterForm from '@/components/counters/CounterForm.vue'
import SearchCounter from '@/views/counters/components/SearchCounter.vue'
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
  searchNoResults: t('counters.searchNoResults'),
  updateError: t('counters.updateError'),
}

// COMPOSABLE
const { db } = useFirebase()
const { userId, checkAuth } = useAuth()
const { allCounters, isLoading, loadAllCounters } = useCounters(userId)

// DATA
const showCounterDialog = ref(false)
const counterToEdit = ref<Counter | null>(null)
const sortNewestFirst = ref(true) // Por defecto, ordenar de más recientes a más antiguos
const searchQuery = ref('')

// Verificar si estamos en entorno de desarrollo
const isDevelopment = computed(() => import.meta.env.MODE === 'development')

// Texto para el botón de ordenación
const sortOrderText = computed(() =>
  sortNewestFirst.value ? t('counters.newestFirst') : t('counters.oldestFirst')
)
const sortOrderTooltip = computed(() =>
  sortNewestFirst.value ? t('counters.sortByOldest') : t('counters.sortByNewest')
)

// Función para filtrar contadores según la búsqueda
const filteredCounters = computed(() => {
  if (!allCounters.value.length) return []

  // Si no hay búsqueda, devolver todos los contadores
  if (!searchQuery.value.trim()) {
    return [...allCounters.value]
  }

  // Filtrar por nombre, categoría o descripción
  const query = searchQuery.value.toLowerCase().trim()
  return allCounters.value.filter((counter: Counter) => {
    return (
      counter.name.toLowerCase().includes(query) ||
      (counter.category && counter.category.toLowerCase().includes(query)) ||
      (counter.description && counter.description.toLowerCase().includes(query))
    )
  })
})

// Función para ordenar los contadores después de filtrar
const sortedCounters = computed(() => {
  if (!filteredCounters.value.length) return []

  // Crear una copia para no modificar el original
  const sorted = [...filteredCounters.value]

  return sorted.sort((a, b) => {
    // Ordenar según la preferencia del usuario usando solo startDate
    return sortNewestFirst.value
      ? b.startDate - a.startDate // Más recientes primero
      : a.startDate - b.startDate // Más antiguos primero
  })
})

// Función para manejar la búsqueda
const handleSearch = (query: string) => {
  searchQuery.value = query
}

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

  try {
    await loadMockCountersForUser(userId.value)
    // Recargar los contadores después de añadir los mocks
    await loadAllCounters()
  } catch (error) {
    console.error('Error al cargar los datos mock:', error)
  }
}

// HOOKS
onMounted(async () => {
  // Comprobar autenticación sin redirigir (el router guard se encargará de esto)
  await checkAuth()
})

// METHODS
// Procesar los datos del formulario
const handleCounterSubmit = async (formData: any) => {
  if (!userId.value) return

  try {
    const startDate = new Date(formData.date).getTime()
    
    // Crear el objeto de datos del contador
    const counterData = {
      name: formData.name,
      startDate: startDate,
      color: formData.color,
      icon: formData.icon,
      favorite: formData.favorite,
      category: formData.category || null,
      description: formData.description || null,
    }

    if (formData.isEditing) {
      // Para edición: actualizar optimistamente en la UI primero
      const counterIndex = allCounters.value.findIndex(c => c.id === formData.id)
      if (counterIndex !== -1) {
        // Guardar backup por si acaso
        const counterBackup = { ...allCounters.value[counterIndex] }
        
        // Actualizar en la UI
        allCounters.value[counterIndex] = { 
          ...allCounters.value[counterIndex], 
          ...counterData 
        }
        
        try {
          // Actualizar contador existente en Firestore
          const counterRef = doc(db, Collection.USER_COUNTERS(userId.value), formData.id)
          await updateDoc(counterRef, counterData)
        } catch (error) {
          // Restaurar el backup si falla
          allCounters.value[counterIndex] = counterBackup
          throw error; // Propagar el error para el catch externo
        }
      }
    } else {
      // Para nuevo contador: crear en Firestore primero
      const userCountersRef = collection(db, Collection.USER_COUNTERS(userId.value))
      const docRef = await addDoc(userCountersRef, counterData)
      
      // Luego añadir a la UI con el ID generado
      allCounters.value.push({
        id: docRef.id,
        ...counterData
      } as Counter)
    }

    counterToEdit.value = null
  } catch (error) {
    console.error(formData.isEditing ? text.updateError : text.createError, error)
  }
}

// Marcar/desmarcar como favorito
const toggleFavorite = async (counter: Counter) => {
  if (!userId.value) return
  
  // Guardar el estado original en caso de que necesitemos revertir
  const originalValue = counter.favorite
  
  // Actualizar en la vista local inmediatamente (optimista)
  counter.favorite = !originalValue
  
  try {
    // Actualizar en Firestore usando la ruta de la subcolección
    const counterRef = doc(db, Collection.USER_COUNTERS(userId.value), counter.id)
    await updateDoc(counterRef, {
      favorite: counter.favorite,
    })
  } catch (error) {
    // Si hay un error, revertir a su estado original
    counter.favorite = originalValue
    console.error(text.updateError, error)
  }
}

// Eliminar contador
const deleteCounter = async (counterId: string) => {
  if (!confirm(text.deleteConfirmation)) return
  if (!userId.value) return

  // Encontrar el contador a eliminar para actualización optimista
  const counterIndex = allCounters.value.findIndex(counter => counter.id === counterId)
  
  if (counterIndex === -1) return
  
  // Guardar una copia del contador para restaurar en caso de error
  const counterBackup = { ...allCounters.value[counterIndex] }
  
  // Eliminar optimistamente de la UI
  allCounters.value.splice(counterIndex, 1)
  
  try {
    // Eliminar en Firestore
    await deleteDoc(doc(db, Collection.USER_COUNTERS(userId.value), counterId))
  } catch (error) {
    // Si falla, restaurar el contador a la lista
    allCounters.value.splice(counterIndex, 0, counterBackup)
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
