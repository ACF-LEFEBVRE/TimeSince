<template>
  <section class="category-filter-bar-container">
    <SearchLabel :text="text.label" />
    <VChipGroup v-model="selectedCategory" column class="category-filter pa-0">
      <VChip class="category-chip" :value="null" density="compact">
        {{ text.allCategories }}
      </VChip>
      <VChip
        v-for="category in categories"
        :key="category"
        class="category-chip"
        :value="category"
        density="compact"
      >
        {{ getCategoryLabel(category) }}
      </VChip>
    </VChipGroup>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SearchLabel from '@/components/common/SearchLabel.vue'

// PROPS
const props = defineProps({
  modelValue: {
    type: String,
    default: null, // Default to null for all categories
  },
  categories: {
    type: Array as () => string[],
    required: true,
  },
})

// COMPOSABLES
const { t } = useI18n()

const text = {
  allCategories: t('counters.allCategories'),
  label: t('common.label.category'),
}

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
.category-filter-bar-container {
  @include flex;

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
      color: $main-color;

      &.v-chip--selected {
        background-color: $main-color;
        color: $white;
      }
    }
  }
}
</style>
