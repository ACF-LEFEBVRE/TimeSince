<template>
  <VChipGroup v-model="selectedCategory" column class="category-filter pa-0">
    <VChip class="category-chip" filter :value="null" density="compact">
      {{ text.allCategories }}
    </VChip>
    <VChip
      v-for="category in categories"
      :key="category"
      class="category-chip"
      filter
      :value="category"
      density="compact"
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
const emit = defineEmits<(e: 'update:modelValue', value: string | null) => void>()

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

<style lang="scss" scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  padding: 0 8px;

  :deep(.v-slide-group__content) {
    display: flex;
    justify-content: flex-end;
  }

  .category-chip {
    background-color: transparent;
    font-family: $text-font;
    font-size: $font-size-xxs;
    border: 1px solid $main-600;
    color: $main-color;

    :deep(.v-chip__underlay) {
      display: none;
    }

    &.v-chip--selected {
      background-color: $main-900;
      color: $white;

      :deep(i) {
        display: none;
      }
    }
  }
}
</style>
