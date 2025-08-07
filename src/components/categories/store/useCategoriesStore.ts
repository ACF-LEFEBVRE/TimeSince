import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useCategoriesStore = defineStore('categories', () => {
  // TRANSLATION
  const { t } = useI18n()

  // STATE
  const categoryOptions = ref([
    t('counters.categories.education'),
    t('counters.categories.family'),
    t('counters.categories.finance'),
    t('counters.categories.hobbies'),
    t('counters.categories.habits'),
    t('counters.categories.personal'),
    t('counters.categories.health'),
    t('counters.categories.technology'),
    t('counters.categories.work'),
    t('counters.categories.travel'),
  ])

  // GETTERS
  const getCategoryOptions = computed(() => categoryOptions.value)

  // ACTIONS

  return {
    getCategoryOptions,
  }
})
