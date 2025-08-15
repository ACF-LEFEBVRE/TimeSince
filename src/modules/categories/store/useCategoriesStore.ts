import { defineStore } from 'pinia'
import { computed, ref, type ComputedRef } from 'vue'
import { i18n } from '@/plugins/i18n'
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { Collection } from '@/plugins/firebase/collections'

// Category color map with direct hex values (para mayor compatibilidad)
export const colorMap = {
  // Azules
  'blue-deep': '#001978', // $blue-deep
  'blue-bright': '#0054ff', // $blue-bright
  'blue-cyan': '#00c8ff', // $blue-cyan

  // Verdes
  'green-turquoise': '#00ffd1', // $green-turquoise
  'green-emerald': '#00c77f', // $green-emerald
  'green-lime': '#a3ff00', // $green-lime

  // Amarillos y Naranjas
  'yellow-gold': '#ffd000', // $yellow-gold
  'yellow-warm': '#ffb400', // $yellow-warm
  'orange-bright': '#ff7800', // $orange-bright

  // Rojos
  'red-coral': '#ff4f3e', // $red-coral
  'red-intense': '#e60026', // $red-intense

  // Rosas y Morados
  'pink-magenta': '#ff1f6a', // $pink-magenta
  'pink-fuchsia': '#ff3df5', // $pink-fuchsia
  'purple-deep': '#8a00ff', // $purple-deep
  'purple-lavender': '#b26bff', // $purple-lavender
  'pink-soft': '#ff9ad5', // $pink-soft

  // Colores adicionales
  'teal-deep': '#008080', // $teal-deep
  'cyan-light': '#7fffd4', // $cyan-light
  'gold-rose': '#ffd8a8', // $gold-rose
  'berry-deep': '#800020', // $berry-deep
  'mint-bright': '#98ff98', // $mint-bright
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
  updateCategory: (
    userId: string,
    oldName: string,
    updatedCategory: CategoryOption
  ) => Promise<boolean>
}

export const useCategoriesStore = defineStore('categories', (): CategoriesStoreResult => {
  // COMPOSABLES
  const { db } = useFirebase()

  // STATE
  const defaultCategoryOptions = ref([
    {
      name: i18n.global.t('counters.categories.education'),
      color: 'blue-bright', // Azul brillante - tradicional para educación y conocimiento
      icon: 'mdi-school',
    },
    {
      name: i18n.global.t('counters.categories.family'),
      color: 'pink-soft', // Rosa suave - calidez, amor familiar
      icon: 'mdi-account-group',
    },
    {
      name: i18n.global.t('counters.categories.finance'),
      color: 'green-emerald', // Verde - asociado con dinero y prosperidad
      icon: 'mdi-currency-usd',
    },
    {
      name: i18n.global.t('counters.categories.habits'),
      color: 'purple-deep', // Púrpura - disciplina, transformación
      icon: 'mdi-repeat',
    },
    {
      name: i18n.global.t('counters.categories.health'),
      color: 'red-coral', // Rojo coral - vitalidad, salud, corazón
      icon: 'mdi-heart-pulse',
    },
    {
      name: i18n.global.t('counters.categories.hobbies'),
      color: 'cyan-light', // Cian - creatividad, diversión
      icon: 'mdi-palette',
    },
    {
      name: i18n.global.t('counters.categories.personal'),
      color: 'teal-deep', // Verde azulado - introspección, crecimiento personal
      icon: 'mdi-account',
    },
    {
      name: i18n.global.t('counters.categories.technology'),
      color: 'blue-cyan', // Azul cian - digital, tecnológico
      icon: 'mdi-laptop',
    },
    {
      name: i18n.global.t('counters.categories.travel'),
      color: 'orange-bright', // Naranja brillante - aventura, exploración
      icon: 'mdi-airplane',
    },
    {
      name: i18n.global.t('counters.categories.work'),
      color: 'berry-deep', // Burdeos - profesionalismo, seriedad
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

  // Método para actualizar una categoría existente
  const updateCategory = async (
    userId: string,
    oldName: string,
    updatedCategory: CategoryOption
  ) => {
    try {
      const categoriesPath = `${Collection.USERS}/${userId}/categories`

      // Si el nombre ha cambiado, eliminamos la categoría anterior y creamos una nueva
      if (oldName !== updatedCategory.name) {
        // Eliminamos el documento anterior
        await deleteDoc(doc(db, categoriesPath, oldName))

        // Creamos el nuevo documento
        await setDoc(doc(db, categoriesPath, updatedCategory.name), {
          name: updatedCategory.name,
          color: updatedCategory.color,
          icon: updatedCategory.icon,
          createdAt: Date.now(), // Actualizamos la fecha de creación
        })
      } else {
        // Si el nombre no ha cambiado, solo actualizamos los campos
        await setDoc(
          doc(db, categoriesPath, updatedCategory.name),
          {
            name: updatedCategory.name,
            color: updatedCategory.color,
            icon: updatedCategory.icon,
            // Mantenemos la fecha de creación original
            // Podríamos añadir un campo updatedAt si quisiéramos controlar la fecha de actualización
          },
          { merge: true }
        ) // Usamos merge para actualizar solo los campos proporcionados
      }

      // Actualizamos el array local para mantener la reactividad
      const index = userCategories.value.findIndex(cat => cat.name === oldName)
      if (index !== -1) {
        // Si encontramos la categoría, la reemplazamos
        userCategories.value.splice(index, 1, updatedCategory)
      } else {
        // Si no la encontramos (debería ser raro), la añadimos
        userCategories.value.push(updatedCategory)
      }

      console.log('Category updated successfully')
      return true
    } catch (error) {
      console.error('Error updating category:', error)
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
    updateCategory,
  }
})
