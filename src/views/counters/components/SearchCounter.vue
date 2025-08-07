<template>
  <div class="search-container mt-3">
    <VTextField
      :placeholder="text.searchCounters"
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
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  searchCounters: t('counters.searchCounters'),
}

// PROPS
const props = defineProps({
  initialQuery: {
    type: String,
    default: '',
  },
})

// DATA
const searchQuery = ref(props.initialQuery)

// EMITS
const emit = defineEmits<(e: 'search', query: string) => void>()

// METHODS
const emitSearch = (newValue: string) => {
  searchQuery.value = newValue
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

<style lang="scss" scoped>
.search-container {
  width: 100%;
  color: $text-color;
  font-family: $text-font;

  :deep(.v-icon--clickable) {
    color: $text-color;
  }
}
</style>
