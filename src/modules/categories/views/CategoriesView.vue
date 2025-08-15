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
        <CategoryCardsContainerComponent
          v-else
          :categories="getCategoryOptions"
          :counters-loading="countersLoading"
          :color-map="colorMap"
          :counters="allCounters"
          @delete="openDeleteCategoryDialog"
          @edit="openEditCategoryDialog"
        />
      </VCardText>
    </VCard>

    <AddOrEditCategoryDialog
      v-model="showCategoryDialog"
      :is-editing="isEditing"
      :original-category-name="originalCategoryName"
      :initial-category="categoryForm"
      :existing-categories="getCategoryOptions"
      :available-icons="availableIcons"
      :color-map="colorMap"
      :loading="formLoading"
      @save="handleSaveCategoryChanges"
      @cancel="closeCategoryDialog"
    />

    <RemoveCategoryDialog
      v-model="showDeleteCategoryDialog"
      :category-name="categoryToDelete"
      :loading="formLoading"
      @confirm="handleDeleteCategory"
      @cancel="closeDeleteCategoryDialog"
    />
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoriesStore } from '@/components/categories/store/useCategoriesStore'
import type { CategoryOption } from '@/components/categories/store/useCategoriesStore'
import { useAuth } from '@/composables/useAuth'
import { useCounters } from '@/components/counters/composables/useCounters'
import { storeToRefs } from 'pinia'
import AddOrEditCategoryDialog from '@/modules/categories/components/dialogs/AddOrEditCategoryDialog.vue'
import CategoryCardsContainerComponent from '@/modules/categories/components/CategoryCardsContainerComponent.vue'
import CustomButton from '@/components/form/CustomButton.vue'
import RemoveCategoryDialog from '@/modules/categories/components/dialogs/RemoveCategoryDialog.vue'

// TRANSLATIONS
const { t } = useI18n()

const text = {
  addNewCategory: t('categories.addNewCategory'),
  cancel: t('common.cancel'),
  categoryName: t('categories.categoryName'),
  delete: t('common.delete'),
  deleteCategory: t('categories.deleteCategory'),
  deleteConfirmation: t('categories.deleteConfirmation'),
  description: t('categories.description'),
  editCategory: t('categories.editCategory'),
  minLength: t('categories.minLength'),
  myCategories: t('categories.myCategories'),
  newCategory: t('categories.newCategory'),
  preview: t('categories.preview'),
  save: t('common.save'),
  selectColor: t('categories.selectColor'),
  selectIcon: t('categories.selectIcon'),
}

// COMPOSABLES
const { userId } = useAuth()
const { allCounters, isLoading: countersLoading } = useCounters(userId)

// STORE
const categoriesStore = useCategoriesStore()
const { getCategoryOptions, isLoading: storeLoading } = storeToRefs(categoriesStore)
const { addNewCategory, availableIcons, colorMap, deleteCategory, loadCategories, updateCategory } =
  categoriesStore

// DATA
const categoryToDelete = ref('')
const formLoading = ref(false)
const showDeleteCategoryDialog = ref(false)
const showCategoryDialog = ref(false)
const isEditing = ref(false)
const originalCategoryName = ref('')

// Formulario para añadir o editar categorías
const categoryForm = ref<CategoryOption>({
  name: '',
  color: 'tertiary-byzantineBlue-200',
  icon: 'mdi-shape',
})

// WATCHERS
watch(
  userId,
  async newUserId => {
    if (newUserId) {
      await loadCategories(newUserId)
    }
  },
  { immediate: true }
)

// METHODS
const openNewCategoryDialog = () => {
  isEditing.value = false
  originalCategoryName.value = ''
  // Reiniciar el formulario con valores por defecto
  categoryForm.value = {
    name: '',
    color: 'tertiary-byzantineBlue-200',
    icon: 'mdi-shape',
  }
  showCategoryDialog.value = true
}

const openEditCategoryDialog = (category: CategoryOption) => {
  isEditing.value = true
  originalCategoryName.value = category.name
  // Copiar los valores de la categoría al formulario
  categoryForm.value = { ...category }
  showCategoryDialog.value = true
}

const closeCategoryDialog = () => {
  showCategoryDialog.value = false
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

// Maneja el guardado de una categoría desde el diálogo
const handleSaveCategoryChanges = async (updatedCategory: CategoryOption) => {
  if (!userId.value) {
    console.error('User not logged in')
    return
  }

  formLoading.value = true
  try {
    let success = false
    const action = isEditing.value ? 'update' : 'add'

    // Ejecutar la acción correspondiente
    if (isEditing.value) {
      success = await updateCategory(userId.value, originalCategoryName.value, updatedCategory)
    } else {
      success = await addNewCategory(userId.value, updatedCategory)
    }

    // Manejar resultado
    if (success) {
      closeCategoryDialog()
    } else {
      console.error(`Failed to ${action} category`)
    }
  } catch (error) {
    const action = isEditing.value ? 'updating' : 'adding'
    console.error(`Error ${action} category:`, error)
  } finally {
    formLoading.value = false
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
</style>
