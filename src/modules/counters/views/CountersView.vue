<template>
  <section class="counters-view pa-8">
    <VCard class="mb-5 pa-2 pb-4 card-container">
      <VCardTitle class="d-flex align-center">
        <h2 class="counters-title">{{ text.myCounters }}</h2>
        <VSpacer />
        <CustomButton :text="text.newCounter" :click-action="openNewCounterDialog" />
        <CreateMockButton v-if="!allCounters.length" @mock-loaded="loadAllCounters" />
      </VCardTitle>

      <VCardText class="pb-0">
        <SearchCounter :initial-query="searchQuery" @search="handleSearch" />
      </VCardText>

      <VCardText class="d-flex align-center justify-space-between">
        <SortOrderButton :sortDirection="sortNewestFirst" @toggle="toggleSortOrder" />
        <CategoryFilterBar v-model="selectedCategoryLocal" :categories="uniqueCategories" />
      </VCardText>

      <CountersList
        :counters="sortedCounters"
        :is-searching="!!searchQuery.trim() || !!selectedCategory"
        :loading="isLoading"
        @toggle-favorite="toggleFavorite"
        @delete="deleteCounter"
        @edit="editCounter"
      />
    </VCard>

    <CounterForm
      v-model="showCounterDialog"
      :edit-counter="counterToEdit"
      @submit="handleCounterSubmitAndClear"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useCounters } from '@/modules/counters/composables/useCounters'
import { useCountersCRUD } from '@/modules/counters/composables/useCountersCRUD'
import { useCategorySelection } from '@/modules/categories/composables/useCategorySelection'
import CountersList from '@/modules/counters/components/list/CountersList.vue'
import CounterForm from '@/modules/counters/components/CounterForm.vue'
import SearchCounter from '@/modules/counters/components/SearchCounter.vue'
import CategoryFilterBar from '@/modules/counters/components/CategoryFilterBar.vue'
import type { Counter } from '@/modules/types/counters'
import CreateMockButton from '@/modules/counters/components/CreateMockButton.vue'
import SortOrderButton from '@/modules/counters/components/SortOrderButton.vue'
import CustomButton from '@/components/form/CustomButton.vue'

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

// COMPOSABLES
const { userId, checkAuth } = useAuth()
const { allCounters, loadAllCounters, isLoading } = useCounters(userId)
const { handleCounterSubmit, toggleFavorite, deleteCounter } = useCountersCRUD(userId, allCounters)
const { selectedCategory, setSelectedCategory } = useCategorySelection()

// Crear un computed para el v-model del CategoryFilterBar
const selectedCategoryLocal = computed({
  get: () => selectedCategory.value,
  set: value => setSelectedCategory(value),
})

// DATA
const showCounterDialog = ref(false)
const counterToEdit = ref<Counter | undefined>(undefined)
const sortNewestFirst = ref(true) // Por defecto, ordenar de más recientes a más antiguos
const searchQuery = ref('')

// No necesitamos obtener la categoría de la URL, ya usamos el composable

// Obtener todas las categorías únicas
const uniqueCategories = computed(() => {
  if (!allCounters.value.length) return []

  // Extraer todas las categorías y filtrar las únicas
  const categories = allCounters.value.map(counter => counter.category).filter(Boolean) as string[] // Filtrar null/undefined y convertir a string[]

  // Eliminar duplicados
  return [...new Set(categories)]
})

// Función para filtrar contadores según la búsqueda y la categoría
const filteredCounters = computed(() => {
  if (!allCounters.value.length) return []

  // Primero aplicamos el filtro de categoría
  let filtered = [...allCounters.value]

  // Si hay una categoría seleccionada, filtrar por ella
  if (selectedCategoryLocal.value) {
    filtered = filtered.filter(counter => counter.category === selectedCategoryLocal.value)
  }

  // Si no hay búsqueda, devolvemos los contadores filtrados por categoría
  if (!searchQuery.value.trim()) {
    return filtered
  }

  // Aplicar filtro de búsqueda
  const query = searchQuery.value.toLowerCase().trim()
  return filtered.filter((counter: Counter) => {
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

// HOOKS
onMounted(async () => {
  // Comprobar autenticación sin redirigir (el router guard se encargará de esto)
  await checkAuth()
})

// Limpiar la categoría seleccionada al salir de la vista
onUnmounted(() => {
  setSelectedCategory(undefined)
})

// METHODS
// Al enviar el formulario, actualizar la referencia al contador que se está editando
const handleCounterSubmitAndClear = async (formData: any) => {
  const result = await handleCounterSubmit(formData)
  if (result) {
    counterToEdit.value = undefined
  }
  return result
}

// Abrir diálogo para crear un nuevo contador
const openNewCounterDialog = () => {
  counterToEdit.value = undefined
  showCounterDialog.value = true
}

// Preparar edición de contadores
const editCounter = (counter: Counter) => {
  counterToEdit.value = counter
  showCounterDialog.value = true
}
</script>

<style lang="scss" scoped>
@use '@/styles/shared/counters-container.scss';

.counters-view {
  width: 80%;
}
</style>
