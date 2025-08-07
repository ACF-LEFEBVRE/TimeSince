<template>
  <section class="categories-view pa-8">
    <VCard class="mb-5 pa-2 pb-4 card-container">
      <VCardTitle class="d-flex align-center">
        <h2 class="categories-title">{{ text.myCategories }}</h2>
      </VCardTitle>
      
      <VCardSubtitle class="px-4">
        {{ text.description }}
      </VCardSubtitle>

      <VCardText>
        <VRow>
          <VCol 
            v-for="(category, index) in categories" 
            :key="index" 
            cols="12" 
            sm="6" 
            md="4" 
            lg="3"
          >
            <VCard 
              class="category-card" 
              :elevation="2" 
              hover
            >
              <div class="category-icon-wrapper" :class="`bg-${getCategoryColor(index)}`">
                <VIcon 
                  :icon="getCategoryIcon(category)" 
                  size="large"
                  color="white"
                />
              </div>
              <VCardTitle>
                {{ category }}
              </VCardTitle>
              <VCardActions>
                <VSpacer />
                <VBtn 
                  variant="text" 
                  :color="getCategoryColor(index)"
                  @click="handleCategoryClick(category)"
                >
                  {{ text.viewCounters }}
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router/routes'
import { useCategoriesStore } from '@/components/categories/store/useCategoriesStore'

// COMPOSABLES
const router = useRouter()
const categoriesStore = useCategoriesStore()
const { t } = useI18n()

// TRANSLATIONS
const text = {
  description: t('categories.description'),
  myCategories: t('categories.myCategories'),
  viewCounters: t('categories.viewCounters')
}

// COMPUTED
const categories = computed(() => categoriesStore.getCategoryOptions)

// METHODS
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    [t('counters.categories.education')]: 'mdi-school',
    [t('counters.categories.family')]: 'mdi-account-group',
    [t('counters.categories.finance')]: 'mdi-currency-usd',
    [t('counters.categories.habits')]: 'mdi-repeat',
    [t('counters.categories.health')]: 'mdi-heart-pulse',
    [t('counters.categories.hobbies')]: 'mdi-palette',
    [t('counters.categories.personal')]: 'mdi-account',
    [t('counters.categories.technology')]: 'mdi-laptop',
    [t('counters.categories.travel')]: 'mdi-airplane',
    [t('counters.categories.work')]: 'mdi-briefcase',
  }
  
  return icons[category] || 'mdi-shape'
}

const getCategoryColor = (index: number): string => {
  const colors = ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'purple', 'indigo', 'cyan', 'teal']
  return colors[index % colors.length]
}

const handleCategoryClick = (category: string): void => {
  router.push({
    path: `/${ROUTES.COUNTERS}`,
    query: { category }
  })
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

.categories-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.category-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  transition: all 0.3s ease;
}
</style>
