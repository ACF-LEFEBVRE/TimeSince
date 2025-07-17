<template>
  <VChipGroup v-model="selectedCategory" column class="category-filter mb-3" show-arrows>
    <VChip filter variant="elevated" :value="null">
      {{ text.allCategories }}
    </VChip>
    <VChip
      v-for="category in categories"
      :key="category"
      filter
      variant="elevated"
      :value="category"
    >
      {{ getCategoryLabel(category) }}
    </VChip>
  </VChipGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// COMPOSABLES
const { t } = useI18n()

const text = {
  allCategories: t('counters.allCategories'),
}

// PROPS
const props = defineProps<{
  categories: string[]
  modelValue: string | null
}>()

// EMITS
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

// COMPUTED
// Two-way binding for v-model
const selectedCategory = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// METHODS
// More type-safe implementation
const getCategoryLabel = (category: string): string => {
  const categoryKey = `counters.categories.${category.toLowerCase()}`
  return t(categoryKey) !== categoryKey ? t(categoryKey) : category
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
