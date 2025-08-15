<template>
  <VRow>
    <VCol v-for="(category, index) in categories" :key="index" cols="12" sm="6" md="4" lg="3">
      <VCard class="category-card" :elevation="2" hover>
        <div
          class="category-icon-wrapper"
          :style="{ backgroundColor: colorMap[category.color as keyof typeof colorMap] }"
        >
          <VIcon :icon="category.icon" size="large" color="white" />
          <div class="counter-badge" v-if="!countersLoading">
            {{ getCategoryCounterCount(category.name) }}
          </div>
        </div>
        <VCardTitle>
          {{ category.name }}
        </VCardTitle>
        <VCardSubtitle class="counter-count">
          {{ formatCounterText(getCategoryCounterCount(category.name)) }}
        </VCardSubtitle>
        <VCardActions>
          <VBtn variant="text" color="error" size="small" @click="handleDeleteClick(category.name)">
            {{ text.delete }}
          </VBtn>
          <VBtn variant="text" color="warning" size="small" @click="handleEditClick(category)">
            {{ text.edit }}
          </VBtn>
          <VSpacer />
          <VBtn
            variant="text"
            :style="{ color: colorMap[category.color as keyof typeof colorMap] }"
            @click="handleCategoryClick(category.name)"
            :disabled="getCategoryCounterCount(category.name) === 0"
            :title="getCategoryCounterCount(category.name) === 0 ? text.noCountersInCategory : ''"
          >
            {{ text.viewCounters }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VCol>
  </VRow>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router/routes'
import type { CategoryOption } from '@/components/categories/store/useCategoriesStore'
import { useCategorySelection } from '@/composables/useCategorySelection'
import type { PropType } from 'vue'

// PROPS
const props = defineProps({
  categories: {
    type: Array as PropType<CategoryOption[]>,
    required: true,
  },
  countersLoading: {
    type: Boolean,
    default: false,
  },
  colorMap: {
    type: Object as PropType<Record<string, string>>,
    required: true,
  },
  counters: {
    type: Array as PropType<{ category?: string }[]>,
    default: () => [],
  },
})

// COMPOSABLES
const router = useRouter()
const { setSelectedCategory } = useCategorySelection()

// TRANSLATIONS
const { t } = useI18n()

const text = {
  delete: t('common.delete'),
  edit: t('common.edit'),
  multipleCounters: t('categories.multipleCounters'),
  noCounters: t('categories.noCounters'),
  noCountersInCategory: t('categories.noCountersInCategory'),
  oneCounter: t('categories.oneCounter'),
  viewCounters: t('categories.viewCounters'),
}

// EVENTS
const emit = defineEmits(['delete', 'edit'])

// METHODS
const handleCategoryClick = (category: string): void => {
  // Establecer la categoría seleccionada en el store compartido
  setSelectedCategory(category)

  // Navegar a la vista de contadores sin pasar parámetros en la URL
  router.push({
    path: `/${ROUTES.COUNTERS}`,
  })
}

const handleDeleteClick = (categoryName: string): void => {
  emit('delete', categoryName)
}

const handleEditClick = (category: CategoryOption): void => {
  emit('edit', category)
}

// Método para contar cuántos contadores hay de una categoría específica
const getCategoryCounterCount = (categoryName: string): number => {
  if (!props.counters.length) return 0
  return props.counters.filter(counter => counter.category && counter.category === categoryName)
    .length
}

// Método para formatear el texto de contadores
const formatCounterText = (count: number): string => {
  if (count === 0) return text.noCounters
  if (count === 1) return text.oneCounter
  return text.multipleCounters
}
</script>

<style lang="scss" scoped>
.category-card {
  transition: transform 0.3s ease;
  border-radius: 8px;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
  }
}

.category-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;

  .counter-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    min-width: 22px;
    height: 22px;
    border-radius: 11px;
    background-color: white;
    color: $main-color;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
}

.counter-count {
  text-align: center;
  color: red;
  font-size: 12px;
  margin-top: -8px;
}
</style>
