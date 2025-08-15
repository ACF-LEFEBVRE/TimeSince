<template>
  <section class="categories-view pa-8">
    <VCard class="mb-5 pa-2 pb-4 card-container">
      <div class="title-container">
        <VCardTitle class="d-flex align-center">
          <h2 class="categories-title">{{ text.myCategories }}</h2>
        </VCardTitle>
        <CustomButton :text="text.newCategory" :click-action="openNewCategoryDialog" />
      </div>

      <VCardSubtitle class="px-4">
        {{ text.description }}
      </VCardSubtitle>

      <VCardText>
        <div v-if="storeLoading" class="d-flex justify-center align-center pa-4">
          <VProgressCircular indeterminate color="primary" />
        </div>
        <VRow v-else>
          <VCol
            v-for="(category, index) in getCategoryOptions"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <VCard class="category-card" :elevation="2" hover>
              <div
                class="category-icon-wrapper"
                :style="{ backgroundColor: colorMap[category.color as keyof typeof colorMap] }"
              >
                <VIcon :icon="category.icon" size="large" color="white" />
              </div>
              <VCardTitle>
                {{ category.name }}
              </VCardTitle>
              <VCardActions>
                <VBtn
                  variant="text"
                  color="error"
                  size="small"
                  @click="openDeleteCategoryDialog(category.name)"
                >
                  {{ text.delete }}
                </VBtn>
                <VSpacer />
                <VBtn
                  variant="text"
                  :style="{ color: colorMap[category.color as keyof typeof colorMap] }"
                  @click="handleCategoryClick(category.name)"
                >
                  {{ text.viewCounters }}
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Dialog para añadir nueva categoría -->
    <VDialog v-model="showNewCategoryDialog" max-width="600px">
      <VCard>
        <VCardTitle class="text-h5">{{ text.addNewCategory }}</VCardTitle>
        <VCardText>
          <VTextField
            v-model="newCategory.name"
            :label="text.categoryName"
            :rules="categoryNameRules"
            required
            autofocus
            @keyup.enter="addCategory"
          ></VTextField>

          <VCardTitle class="pt-4 pb-2">{{ text.selectColor }}</VCardTitle>
          <div class="color-selector">
            <div
              v-for="(color, index) in availableColors"
              :key="index"
              class="color-option"
              :class="{ selected: newCategory.color === color }"
              :style="{ backgroundColor: colorMap[color as keyof typeof colorMap] }"
              @click="newCategory.color = color"
            ></div>
          </div>

          <VCardTitle class="pt-4 pb-2">{{ text.selectIcon }}</VCardTitle>
          <div class="icon-selector">
            <div
              v-for="(icon, index) in availableIcons"
              :key="index"
              class="icon-option"
              :class="{ selected: newCategory.icon === icon }"
              @click="newCategory.icon = icon"
            >
              <VIcon
                :icon="icon"
                :style="{ color: colorMap[newCategory.color as keyof typeof colorMap] }"
              ></VIcon>
            </div>
          </div>

          <VCardSubtitle class="pt-4">{{ text.preview }}</VCardSubtitle>
          <div class="category-preview">
            <div
              class="category-icon-wrapper"
              :style="{ backgroundColor: colorMap[newCategory.color as keyof typeof colorMap] }"
            >
              <VIcon :icon="newCategory.icon" size="large" color="white" />
            </div>
            <span class="preview-text">{{ newCategory.name || text.categoryName }}</span>
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="primary" variant="text" @click="closeNewCategoryDialog">
            {{ text.cancel }}
          </VBtn>
          <VBtn
            color="primary"
            @click="addCategory"
            :disabled="!isValidCategory"
            :loading="formLoading"
          >
            {{ text.add }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog para confirmar eliminación de categoría -->
    <VDialog v-model="showDeleteCategoryDialog" max-width="500px">
      <VCard>
        <VCardTitle class="text-h5">{{ text.deleteCategory }}</VCardTitle>
        <VCardText>
          {{ text.deleteConfirmation }} <b>{{ categoryToDelete }}</b
          >?
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="primary" variant="text" @click="closeDeleteCategoryDialog">
            {{ text.cancel }}
          </VBtn>
          <VBtn color="error" @click="handleDeleteCategory" :loading="formLoading">
            {{ text.delete }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router/routes'
import { useCategoriesStore } from '@/components/categories/store/useCategoriesStore'
import type { CategoryOption } from '@/components/categories/store/useCategoriesStore'
import { useAuth } from '@/composables/useAuth'
import { storeToRefs } from 'pinia'
import CustomButton from '@/components/form/CustomButton.vue'

// COMPOSABLES
const router = useRouter()
const { userId } = useAuth()
const categoriesStore = useCategoriesStore()
const { getCategoryOptions, isLoading: storeLoading } = storeToRefs(categoriesStore)
const { addNewCategory, availableIcons, colorMap, deleteCategory, loadCategories } = categoriesStore
const { t } = useI18n()

// DATA
const categoryToDelete = ref('')
const formLoading = ref(false)
const showDeleteCategoryDialog = ref(false)
const showNewCategoryDialog = ref(false)

const newCategory = ref<CategoryOption>({
  name: '',
  color: 'tertiary-byzantineBlue-200',
  icon: 'mdi-shape',
})

const availableColors = [
  'tertiary-persianRed-200',
  'tertiary-persianRed-100',
  'tertiary-persianRed-050',
  'tertiary-princetonOrange-200',
  'tertiary-princetonOrange-100',
  'tertiary-princetonOrange-050',
  'tertiary-saffron-200',
  'tertiary-saffron-100',
  'tertiary-saffron-050',
  'tertiary-seaGreen-200',
  'tertiary-seaGreen-100',
  'tertiary-seaGreen-050',
  'tertiary-byzantineBlue-200',
  'tertiary-byzantineBlue-100',
  'tertiary-byzantineBlue-050',
  'tertiary-silver-100',
  'tertiary-silver-50',
  'tertiary-ecru-100',
  'tertiary-ecru-050',
  'tertiary-citron-100',
  'tertiary-citron-050',
  'tertiary-tiffanyBlue-100',
  'tertiary-tiffanyBlue-050',
  'tertiary-marianBlue-100',
  'tertiary-marianBlue-050',
]

// Usamos availableIcons del store

const categoryNameRules = [
  (v: string) => !!v || t('form.required'),
  (v: string) => (v && v.length >= 3) || t('categories.minLength'),
  (v: string) =>
    !getCategoryOptions.value.some(cat => cat.name === v) || t('categories.alreadyExists'),
]

// TRANSLATIONS
const text = {
  add: t('common.add'),
  addNewCategory: t('categories.addNewCategory'),
  cancel: t('common.cancel'),
  categoryName: t('categories.categoryName'),
  delete: t('common.delete'),
  deleteCategory: t('categories.deleteCategory'),
  deleteConfirmation: t('categories.deleteConfirmation'),
  description: t('categories.description'),
  minLength: t('categories.minLength'),
  myCategories: t('categories.myCategories'),
  newCategory: t('categories.newCategory'),
  preview: t('categories.preview'),
  selectColor: t('categories.selectColor'),
  selectIcon: t('categories.selectIcon'),
  viewCounters: t('categories.viewCounters'),
}

// COMPUTED
const isValidCategory = computed(() => {
  return (
    newCategory.value.name.length >= 3 &&
    !getCategoryOptions.value.some(cat => cat.name === newCategory.value.name)
  )
})

// WATCHES
// Actualizar las reglas de validación cuando cambian las categorías
watch(getCategoryOptions, (newCategories: CategoryOption[]) => {
  console.log('Categories updated:', newCategories)
  // El array de reglas es inmutable, así que creamos uno nuevo
  categoryNameRules.length = 0
  categoryNameRules.push(
    (v: string) => !!v || t('form.required'),
    (v: string) => (v && v.length >= 3) || t('categories.minLength'),
    (v: string) => !newCategories.some(cat => cat.name === v) || t('categories.alreadyExists')
  )
})

// METHODS

const handleCategoryClick = (category: string): void => {
  router.push({
    path: `/${ROUTES.COUNTERS}`,
    query: { category },
  })
}

const openNewCategoryDialog = () => {
  console.log('Opening new category dialog')
  showNewCategoryDialog.value = true
}

// WATCHES
watch(
  userId,
  async newUserId => {
    console.log('User ID changed:', newUserId)
    if (newUserId) {
      await loadCategories(newUserId)
    }
  },
  { immediate: true }
)

const closeNewCategoryDialog = () => {
  showNewCategoryDialog.value = false
  newCategory.value = {
    name: '',
    color: 'tertiary-byzantineBlue-200',
    icon: 'mdi-shape',
  }
}

const openDeleteCategoryDialog = (category: string) => {
  categoryToDelete.value = category
  showDeleteCategoryDialog.value = true
}

const closeDeleteCategoryDialog = () => {
  showDeleteCategoryDialog.value = false
  categoryToDelete.value = ''
}

const handleDeleteCategory = async () => {
  if (categoryToDelete.value && userId.value) {
    formLoading.value = true
    try {
      const success = await deleteCategory(userId.value, categoryToDelete.value)
      if (success) {
        // Si se elimina correctamente, cerramos el diálogo
        closeDeleteCategoryDialog()
      } else {
        console.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    } finally {
      formLoading.value = false
    }
  }
}

const addCategory = async () => {
  if (isValidCategory.value) {
    formLoading.value = true
    try {
      if (userId.value) {
        const success = await addNewCategory(userId.value, newCategory.value)
        if (success) {
          // Si se añade correctamente, cerramos el diálogo
          closeNewCategoryDialog()
        } else {
          console.error('Failed to add category')
        }
      } else {
        console.error('User not logged in')
      }
    } catch (error) {
      console.error('Error adding category:', error)
    } finally {
      formLoading.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

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

.color-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }

  &.selected {
    box-shadow:
      0 0 0 3px white,
      0 0 0 5px rgb(46, 83, 214); /* hardcoded tertiary-byzantineBlue-200 color */
    transform: scale(1.05);
  }
}

.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.icon-option {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.selected {
    background-color: rgba(46, 83, 214, 0.1); /* Using tertiary-byzantineBlue-200 with opacity */
    box-shadow: 0 0 0 2px rgb(46, 83, 214); /* hardcoded tertiary-byzantineBlue-200 color */
  }
}

.category-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  margin-top: 8px;

  .category-icon-wrapper {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .preview-text {
    font-size: 1.2rem;
    font-weight: 500;
  }
}
</style>
