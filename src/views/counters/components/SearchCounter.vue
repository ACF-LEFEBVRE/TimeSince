<template>
  <div class="search-container mb-3">
    <VTextField
      v-model="searchQuery"
      :label="$t('counters.searchCounters')"
      prepend-inner-icon="mdi-magnify"
      clearable
      hide-details
      density="compact"
      variant="outlined"
      @update:model-value="emitSearch"
      @click:clear="clearSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// PRPOS
const props = defineProps({
  initialQuery: {
    type: String,
    default: '',
  },
})

// DATA
const searchQuery = ref(props.initialQuery)

// EMITS
const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

// METHODS
const emitSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

// WATCHERS
// Actualizar la búsqueda si cambia el prop initialQuery
watch(
  () => props.initialQuery,
  newValue => {
    searchQuery.value = newValue
  }
)
</script>

<style scoped>
.search-container {
  width: 100%;
}
</style>
