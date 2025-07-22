<template>
  <section class="counters-view pa-8">
    <VCard class="mb-5 pa-2 card-container">
      <VCardTitle class="d-flex align-center">
        <h2 class="counters-title">{{ text.myCounters }}</h2>
        <VSpacer />
        <VBtn class="add-btn" @click="openNewCounterDialog" variant="outlined">
          {{ text.newCounter }}
        </VBtn>
        <CreateMockButton v-if="!allCounters.length" @mock-loaded="loadAllCounters" />
      </VCardTitle>

      <VCardText class="pb-0">
        <SearchCounter :initial-query="searchQuery" @search="handleSearch" />
      </VCardText>

      <VCardText class="d-flex align-center justify-space-between">
        <SortOrderButton :sortDirection="sortNewestFirst" @toggle="toggleSortOrder" />
        <CategoryFilterBar v-model="selectedCategory" :categories="uniqueCategories" />
      </VCardText>

      <CountersList
        :counters="sortedCounters"
        :is-searching="!!searchQuery.trim() || !!selectedCategory"
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
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useCounters } from '@/components/counters/composables/useCounters'
import { useCountersCRUD } from '@/components/counters/composables/useCountersCRUD'
import CountersList from '@/components/counters/list/CountersList.vue'
import CounterForm from '@/components/counters/CounterForm.vue'
import SearchCounter from '@/views/counters/components/SearchCounter.vue'
import CategoryFilterBar from '@/views/counters/components/CategoryFilterBar.vue'
import type { Counter } from '@/components/counters/types/counters'
import CreateMockButton from './components/CreateMockButton.vue'
import SortOrderButton from './components/SortOrderButton.vue'

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
const { allCounters, loadAllCounters } = useCounters(userId)
const { handleCounterSubmit, toggleFavorite, deleteCounter } = useCountersCRUD(userId, allCounters)

// DATA
const showCounterDialog = ref(false)
const counterToEdit = ref<Counter | null>(null)
const sortNewestFirst = ref(true) // Por defecto, ordenar de más recientes a más antiguos
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)

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
  if (selectedCategory.value) {
    filtered = filtered.filter(counter => counter.category === selectedCategory.value)
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

// METHODS
// Al enviar el formulario, actualizar la referencia al contador que se está editando
const handleCounterSubmitAndClear = async (formData: any) => {
  const result = await handleCounterSubmit(formData)
  if (result) {
    counterToEdit.value = null
  }
  return result
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

<style lang="scss" scoped>
.counters-view {
  width: 80%;

  .counters-title {
    font-family: $title-font;
    color: $main-color;
    font-size: 18px;
    text-transform: uppercase;
  }

  .card-container {
    border: 1px solid $main-1000;
  }

  .add-btn {
    font-size: 14px;
    font-family: $text-font;
    text-transform: uppercase;
    color: $main-color;
    font-weight: bold;

    &:hover {
      color: $white;
      background-color: $main-700;
      border-color: $main-700;
    }
  }
}
</style>
