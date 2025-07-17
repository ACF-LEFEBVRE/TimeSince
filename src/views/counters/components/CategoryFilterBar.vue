<template>
  <VChipGroup
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    column
    class="category-filter mb-3"
    show-arrows
  >
    <VChip filter variant="elevated" :value="null" @click="$emit('update:modelValue', null)">
      {{ text.allCategories }}
    </VChip>
    <VChip
      v-for="category in categories"
      :key="category"
      filter
      variant="elevated"
      :value="category"
      @click="$emit('update:modelValue', category)"
    >
      {{ getCategoryLabel(category) }}
    </VChip>
  </VChipGroup>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// PROPS
defineProps<{
  categories: string[]
  modelValue: string | null
}>()

// EMITS
defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

// TRANSLATION
const { t } = useI18n()

const text = {
  allCategories: t('counters.allCategories'),
  categories: {
    education: t('counters.categories.education'),
    family: t('counters.categories.family'),
    finance: t('counters.categories.finance'),
    hobbies: t('counters.categories.hobbies'),
    habits: t('counters.categories.habits'),
    personal: t('counters.categories.personal'),
    health: t('counters.categories.health'),
    technology: t('counters.categories.technology'),
    work: t('counters.categories.work'),
    travel: t('counters.categories.travel'),
  },
}

// METHODS
// Función para obtener la etiqueta traducida de una categoría
const getCategoryLabel = (category: string): string => {
  // Cast to any to avoid TypeScript index signature error
  const categoriesDict = text.categories as any
  return categoriesDict[category] || category
}
</script>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 8px;
}
</style>
