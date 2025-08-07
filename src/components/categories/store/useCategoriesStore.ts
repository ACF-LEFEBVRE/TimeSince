import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { i18n } from '@/plugins/i18n'
import { doc, setDoc } from 'firebase/firestore'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { Collection } from '@/plugins/firebase/collections'

export const useCategoriesStore = defineStore('categories', () => {
  // COMPOSABLES
  const { db } = useFirebase()

  // STATE
  const defaultCategoryOptions = ref([
    i18n.global.t('counters.categories.education'),
    i18n.global.t('counters.categories.family'),
    i18n.global.t('counters.categories.finance'),
    i18n.global.t('counters.categories.habits'),
    i18n.global.t('counters.categories.health'),
    i18n.global.t('counters.categories.hobbies'),
    i18n.global.t('counters.categories.personal'),
    i18n.global.t('counters.categories.technology'),
    i18n.global.t('counters.categories.travel'),
    i18n.global.t('counters.categories.work'),
  ])

  // GETTERS
  const getCategoryOptions = computed(() => defaultCategoryOptions.value)

  // ACTIONS
  const createDefaultCategories = async (userId: string) => {
    try {
      // Create a categories collection for the user
      const categoriesPath = `${Collection.USERS}/${userId}/categories`

      // Create a document for each category
      for (const category of defaultCategoryOptions.value) {
        await setDoc(doc(db, categoriesPath, category), {
          name: category,
          createdAt: Date.now(),
        })
      }

      console.log('Default categories created successfully')
      return true
    } catch (error) {
      console.error('Error creating default categories:', error)
      return false
    }
  }

  return {
    getCategoryOptions,
    createDefaultCategories,
  }
})
