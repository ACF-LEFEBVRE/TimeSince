<template>
  <VDialog v-model="dialog" max-width="600px">
    <VCard>
      <VCardTitle class="text-h5">{{
        props.isEditing ? text.editCategory : text.addNewCategory
      }}</VCardTitle>
      <VCardText>
        <VTextField
          v-model="categoryForm.name"
          :label="text.categoryName"
          :rules="categoryNameRules"
          :disabled="props.isEditing && categoryForm.name === props.originalCategoryName"
          required
          autofocus
          @keyup.enter="saveCategoryChanges"
        ></VTextField>

        <VCardTitle class="pt-4 pb-2">{{ text.selectColor }}</VCardTitle>
        <div class="color-selector">
          <div
            v-for="(color, index) in availableColors"
            :key="index"
            class="color-option"
            :class="{ selected: categoryForm.color === color }"
            :style="{ backgroundColor: props.colorMap[color as keyof typeof props.colorMap] }"
            @click="categoryForm.color = color"
          ></div>
        </div>

        <VCardTitle class="pt-4 pb-2">{{ text.selectIcon }}</VCardTitle>
        <div class="icon-selector">
          <div
            v-for="(icon, index) in props.availableIcons"
            :key="index"
            class="icon-option"
            :class="{ selected: categoryForm.icon === icon }"
            @click="categoryForm.icon = icon"
          >
            <VIcon
              :icon="icon"
              :style="{ color: props.colorMap[categoryForm.color as keyof typeof props.colorMap] }"
            ></VIcon>
          </div>
        </div>

        <VCardSubtitle class="pt-4">{{ text.preview }}</VCardSubtitle>
        <div class="category-preview">
          <div
            class="category-icon-wrapper"
            :style="{
              backgroundColor: props.colorMap[categoryForm.color as keyof typeof props.colorMap],
            }"
          >
            <VIcon :icon="categoryForm.icon" size="large" color="white" />
          </div>
          <span class="preview-text">{{ categoryForm.name || text.categoryName }}</span>
        </div>
      </VCardText>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="primary" variant="text" @click="onCancel">
          {{ text.cancel }}
        </VBtn>
        <VBtn
          color="primary"
          @click="saveCategoryChanges"
          :disabled="!isValidCategoryForm"
          :loading="props.loading"
        >
          {{ props.isEditing ? text.save : text.add }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CategoryOption } from '@/components/categories/store/useCategoriesStore'
import { availableColors } from '@/modules/categories/constants/categoryConstants'

// MODEL
const dialog = defineModel('modelValue')

// PROPS
const props = defineProps<{
  isEditing: boolean
  originalCategoryName: string
  initialCategory: CategoryOption
  existingCategories: CategoryOption[]
  availableIcons: string[]
  colorMap: Record<string, string>
  loading?: boolean
}>()

// TRANSLATIONS
const { t } = useI18n()

const text = {
  add: t('common.add'),
  addNewCategory: t('categories.addNewCategory'),
  cancel: t('common.cancel'),
  categoryName: t('categories.categoryName'),
  editCategory: t('categories.editCategory'),
  preview: t('categories.preview'),
  save: t('common.save'),
  selectColor: t('categories.selectColor'),
  selectIcon: t('categories.selectIcon'),
}

// DATA
const categoryForm = ref<CategoryOption>({ ...props.initialCategory })

// Reset form when initial category changes
watch(
  () => props.initialCategory,
  newValue => {
    categoryForm.value = { ...newValue }
  },
  { immediate: true }
)

// COMPUTED
// Reglas de validación que tienen en cuenta si estamos editando o creando una categoría
const categoryNameRules = computed(() => [
  (v: string) => !!v || t('form.required'),
  (v: string) => (v && v.length >= 3) || t('categories.minLength'),
  (v: string) =>
    // Si estamos editando y el nombre no ha cambiado, es válido
    (props.isEditing && v === props.originalCategoryName) ||
    // Si es un nombre nuevo, no debe existir ya
    !props.existingCategories.some(cat => cat.name === v) ||
    t('categories.alreadyExists'),
])

const isValidCategoryForm = computed(() => {
  // Si estamos editando y el nombre no ha cambiado, es válido
  if (props.isEditing && categoryForm.value.name === props.originalCategoryName) {
    return true
  }

  // Si el nombre es nuevo, debe tener al menos 3 caracteres y no existir ya
  return (
    categoryForm.value.name.length >= 3 &&
    !props.existingCategories.some(cat => cat.name === categoryForm.value.name)
  )
})

// EVENTS
const emit = defineEmits(['save', 'cancel'])

// METHODS
const onCancel = () => {
  emit('cancel')
}

const saveCategoryChanges = () => {
  if (!isValidCategoryForm.value) {
    return
  }

  emit('save', categoryForm.value)
}
</script>

<style lang="scss" scoped>
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
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .preview-text {
    font-size: 1.2rem;
    font-weight: 500;
  }
}
</style>
