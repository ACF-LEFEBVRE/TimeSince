import { defineStore } from 'pinia'
import { computed, ref, type ComputedRef } from 'vue'
import { i18n } from '@/plugins/i18n'
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { Collection } from '@/plugins/firebase/collections'

// Category color map for direct use without CSS variables
export const colorMap = {
  'tertiary-persianRed-200': '#d12d30',
  'tertiary-persianRed-100': '#e16668',
  'tertiary-persianRed-050': '#fcdedf',
  'tertiary-princetonOrange-200': '#ff9000',
  'tertiary-princetonOrange-100': '#ffb759',
  'tertiary-princetonOrange-050': '#ffd092',
  'tertiary-saffron-200': '#f0bc00',
  'tertiary-saffron-100': '#f5d359',
  'tertiary-saffron-050': '#fff2c2',
  'tertiary-seaGreen-200': '#128851',
  'tertiary-seaGreen-100': '#59ac85',
  'tertiary-seaGreen-050': '#c8f9e2',
  'tertiary-byzantineBlue-200': '#2e53d6',
  'tertiary-byzantineBlue-100': '#8298e6',
  'tertiary-byzantineBlue-050': '#d9e1fc',
  'tertiary-silver-100': '#b2b4b2',
  'tertiary-silver-50': '#c9cac9',
  'tertiary-ecru-100': '#d8b982',
  'tertiary-ecru-050': '#e5d6b8',
  'tertiary-citron-100': '#d9c756',
  'tertiary-citron-050': '#e8dd9a',
  'tertiary-tiffanyBlue-100': '#aae5d9',
  'tertiary-tiffanyBlue-050': '#c2f0e8',
  'tertiary-marianBlue-100': '#768fc2',
  'tertiary-marianBlue-050': '#d1daeb',
}

// Available icons for categories
export const availableIcons = [
  'mdi-school',
  'mdi-account-group',
  'mdi-currency-usd',
  'mdi-repeat',
  'mdi-heart-pulse',
  'mdi-palette',
  'mdi-account',
  'mdi-laptop',
  'mdi-airplane',
  'mdi-briefcase',
  'mdi-basketball',
  'mdi-book-open-page-variant',
  'mdi-cake-variant',
  'mdi-calendar',
  'mdi-camera',
  'mdi-car',
  'mdi-coffee',
  'mdi-food',
  'mdi-gamepad-variant',
  'mdi-gift',
  'mdi-guitar',
  'mdi-heart',
  'mdi-home',
  'mdi-medal',
  'mdi-music',
  'mdi-paw',
  'mdi-pencil',
  'mdi-puzzle',
  'mdi-shape',
  'mdi-soccer',
  'mdi-star',
  'mdi-swim',
  'mdi-trophy',
  'mdi-video',
  'mdi-water',
  'mdi-web',
]

export interface Category {
  name: string
  color?: string
  icon?: string
  createdAt: number
}

export interface CategoryOption {
  name: string
  color: string
  icon: string
}

interface CategoriesStoreResult {
  addNewCategory: (userId: string, category: CategoryOption) => Promise<boolean>
  colorMap: typeof colorMap
  availableIcons: typeof availableIcons
  createDefaultCategories: (userId: string) => Promise<boolean>
  deleteCategory: (userId: string, categoryName: string) => Promise<boolean>
  getCategoryOptions: ComputedRef<CategoryOption[]>
  isLoading: ComputedRef<boolean>
  loadCategories: (userId: string) => Promise<void>
}

export const useCategoriesStore = defineStore('categories', (): CategoriesStoreResult => {
  // COMPOSABLES
  const { db } = useFirebase()

  // STATE
  const defaultCategoryOptions = ref([
    {
      name: i18n.global.t('counters.categories.education'),
      color: 'tertiary-byzantineBlue-200',
      icon: 'mdi-school',
    },
    {
      name: i18n.global.t('counters.categories.family'),
      color: 'tertiary-persianRed-100',
      icon: 'mdi-account-group',
    },
    {
      name: i18n.global.t('counters.categories.finance'),
      color: 'tertiary-seaGreen-200',
      icon: 'mdi-currency-usd',
    },
    {
      name: i18n.global.t('counters.categories.habits'),
      color: 'tertiary-citron-100',
      icon: 'mdi-repeat',
    },
    {
      name: i18n.global.t('counters.categories.health'),
      color: 'tertiary-persianRed-200',
      icon: 'mdi-heart-pulse',
    },
    {
      name: i18n.global.t('counters.categories.hobbies'),
      color: 'tertiary-tiffanyBlue-100',
      icon: 'mdi-palette',
    },
    {
      name: i18n.global.t('counters.categories.personal'),
      color: 'tertiary-marianBlue-100',
      icon: 'mdi-account',
    },
    {
      name: i18n.global.t('counters.categories.technology'),
      color: 'tertiary-byzantineBlue-100',
      icon: 'mdi-laptop',
    },
    {
      name: i18n.global.t('counters.categories.travel'),
      color: 'tertiary-princetonOrange-100',
      icon: 'mdi-airplane',
    },
    {
      name: i18n.global.t('counters.categories.work'),
      color: 'tertiary-saffron-100',
      icon: 'mdi-briefcase',
    },
  ])
  const userCategories = ref<CategoryOption[]>([])
  const isLoading = ref(false)

  // GETTERS
  // Combinar categorías por defecto con categorías personalizadas del usuario
  const getCategoryOptions = computed(() => {
    // Ordenar todas las categorías alfabéticamente
    return [...userCategories.value].sort((a, b) => a.name.localeCompare(b.name))
  })

  // ACTIONS
  const createDefaultCategories = async (userId: string) => {
    try {
      // Create a categories collection for the user
      const categoriesPath = `${Collection.USERS}/${userId}/categories`

      // Create a document for each category
      for (const category of defaultCategoryOptions.value) {
        await setDoc(doc(db, categoriesPath, category.name), {
          name: category.name,
          color: category.color,
          icon: category.icon,
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

  const addNewCategory = async (userId: string, category: CategoryOption) => {
    try {
      // Asegurar que la categoría tiene color e icono
      const availableColors = Object.keys(colorMap)

      // Usar el nombre para crear un índice consistente si no hay color o icono
      const colorIndex = category.name.length % availableColors.length
      const iconIndex = (category.name.charCodeAt(0) || 0) % availableIcons.length

      // Asegurar que tiene color e icono, si no se proporcionan, asignar uno
      const finalCategory: CategoryOption = {
        name: category.name,
        color: category.color || availableColors[colorIndex],
        icon: category.icon || availableIcons[iconIndex],
      }

      const categoriesPath = `${Collection.USERS}/${userId}/categories`
      await setDoc(doc(db, categoriesPath, category.name), {
        name: finalCategory.name,
        color: finalCategory.color,
        icon: finalCategory.icon,
        createdAt: Date.now(),
      })
      console.log('New category added successfully')

      // Actualizar directamente el array local de categorías para mayor reactividad
      if (!userCategories.value.some(cat => cat.name === finalCategory.name)) {
        userCategories.value.push(finalCategory)
      }

      // Las categorías se actualizan directamente en el array local para mayor reactividad
      return true
    } catch (error) {
      console.error('Error adding new category:', error)
      return false
    }
  }

  // Método para cargar las categorías del usuario desde Firestore
  const deleteCategory = async (userId: string, categoryName: string) => {
    try {
      const categoriesPath = `${Collection.USERS}/${userId}/categories`
      await deleteDoc(doc(db, categoriesPath, categoryName))

      // Actualizar directamente el array local de categorías para mayor reactividad
      userCategories.value = userCategories.value.filter(cat => cat.name !== categoryName)

      console.log('Category deleted successfully')
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      return false
    }
  }

  const loadCategories = async (userId: string) => {
    if (!userId) {
      console.error('No user ID provided to load categories')
      return
    }

    isLoading.value = true
    try {
      const categoriesPath = `${Collection.USERS}/${userId}/categories`
      const categoriesSnapshot = await getDocs(
        query(collection(db, categoriesPath), orderBy('createdAt'))
      )

      // Si no hay categorías en Firestore, inicializar con las categorías por defecto
      if (categoriesSnapshot.empty) {
        console.log('No categories found, using defaults')
        // Si no hay categorías, crear las categorías por defecto
        await createDefaultCategories(userId)
        userCategories.value = [...defaultCategoryOptions.value]
      } else {
        // Cargar las categorías encontradas
        const loadedCategories: CategoryOption[] = []
        // Usar los arrays de colores e iconos disponibles
        const availableColors = Object.keys(colorMap)

        // Asignar colores e iconos de forma aleatoria pero consistente basado en el nombre de la categoría
        categoriesSnapshot.forEach(doc => {
          const data = doc.data() as Category
          const name = doc.id

          // Si la categoría no tiene color o icono, asignarle uno basado en su nombre
          // para asegurar que siempre tenga el mismo color e icono
          const colorIndex = name.length % availableColors.length
          const iconIndex = (name.charCodeAt(0) || 0) % availableIcons.length

          loadedCategories.push({
            name: name,
            color: data.color || availableColors[colorIndex],
            icon: data.icon || availableIcons[iconIndex],
          })
        })

        userCategories.value = loadedCategories
        console.log('Categories loaded successfully:', loadedCategories)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      // En caso de error, usar categorías por defecto
      userCategories.value = [...defaultCategoryOptions.value]
    } finally {
      isLoading.value = false
    }
  }

  return {
    addNewCategory,
    availableIcons,
    colorMap,
    createDefaultCategories,
    deleteCategory,
    getCategoryOptions,
    isLoading: computed(() => isLoading.value),
    loadCategories,
  }
})
