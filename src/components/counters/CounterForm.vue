<template>
  <VDialog v-model="dialogVisible" max-width="500px" class="counter-form-dialog-container">
    <VCard>
      <VCardTitle class="text-title ml-2 mt-1">{{
        isEditing ? text.editCounter : text.newCounter
      }}</VCardTitle>
      <VCardText>
        <VForm @submit.prevent="submit" ref="form">
          <VRow>
            <VCol cols="12" sm="12">
              <CustomTextField
                v-model="counterData.name"
                :label="text.name"
                :rules="[(v: string) => !!v || text.nameRequired]"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" sm="12">
              <VSelect
                v-model="counterData.category"
                :label="text.category"
                :items="categoryOptions"
                item-title="text"
                item-value="value"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="counterData.date"
                :label="text.startDate"
                type="date"
                required
                :rules="[(v: string) => !!v || text.dateRequired]"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VSelect
                v-model="counterData.color"
                :label="text.color"
                :items="colorOptions"
                item-title="text"
                item-value="value"
              />
            </VCol>
          </VRow>

          <VSelect
            v-model="counterData.icon"
            :label="text.icon"
            :items="iconOptions"
            item-title="text"
            item-value="value"
          />

          <VTextarea
            v-model="counterData.description"
            :label="text.description"
            rows="3"
            auto-grow
            variant="outlined"
            class="mt-3"
            counter
            maxlength="200"
            hint="Añade una descripción para recordar detalles de este evento"
          />
        </VForm>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="grey-darken-1" text @click="closeDialog">{{ text.cancel }}</VBtn>
        <VBtn color="primary" @click="submit" :disabled="!isFormValid">{{
          isEditing ? text.update : text.create
        }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Counter } from '@/components/counters/types/counters'
import { useCounterForm } from '@/components/counters/composables/useCounterForm'
import CustomTextField from '@/components/form/CustomTextField.vue'

// TRANSLATION
const { t } = useI18n()

const text = {
  cancel: t('common.cancel'),
  category: t('counters.categoryLabel'),
  color: t('counters.color'),
  create: t('counters.create'),
  dateRequired: t('counters.dateRequired'),
  description: t('counters.description'),
  editCounter: t('counters.editCounter'),
  icon: t('counters.icon'),
  name: t('counters.name'),
  nameRequired: t('counters.nameRequired'),
  newCounter: t('counters.newCounter'),
  startDate: t('counters.startDate'),
  update: t('counters.update'),
}

// COMPOSABLES
const { categoryOptions, colorOptions, iconOptions } = useCounterForm()

// PROPS
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  editCounter: {
    type: Object as () => Counter | null | undefined,
    default: undefined,
  },
})

// DATA
const dialogVisible = ref(props.modelValue)
const form = ref<any>(null)
const isEditing = computed(() => !!props.editCounter)

// Datos del formulario
const counterData = ref({
  id: '',
  name: '',
  date: new Date().toISOString().split('T')[0],
  color: 'primary',
  icon: 'mdi-calendar-clock',
  favorite: false,
  category: '',
  description: '',
})

// COMPUTED
const isFormValid = computed(() => {
  return counterData.value.name && counterData.value.date
})

// EMITS
const emit = defineEmits(['update:modelValue', 'submit'])

// METHODS
const submit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    ...counterData.value,
    isEditing: isEditing.value,
  })

  // Solo resetear el formulario si no estamos editando
  if (!isEditing.value) {
    resetForm()
  }

  closeDialog()
}

const resetForm = () => {
  counterData.value = {
    id: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    color: 'primary',
    icon: 'mdi-calendar-clock',
    favorite: false,
    category: '',
    description: '',
  }
}

const closeDialog = () => {
  dialogVisible.value = false
  emit('update:modelValue', false)
}

// WATCHERS
// Sincronización de props y valores internos
watch(
  () => props.modelValue,
  newVal => {
    dialogVisible.value = newVal
    if (newVal && props.editCounter) {
      // Cargar los datos del contador que estamos editando
      const editDate = new Date(props.editCounter.startDate).toISOString().split('T')[0]
      counterData.value = {
        id: props.editCounter.id,
        name: props.editCounter.name,
        date: editDate,
        color: props.editCounter.color || 'primary',
        icon: props.editCounter.icon || 'mdi-calendar-clock',
        favorite: props.editCounter.favorite,
        category: props.editCounter.category || '',
        description: props.editCounter.description || '',
      }
    } else if (newVal) {
      // Reset form when opening for a new counter
      resetForm()
    }
  }
)

watch(dialogVisible, newVal => {
  emit('update:modelValue', newVal)
})
</script>

<style lang="scss" scoped>
.counter-form-dialog-container {
  .text-title {
    font-family: $title-font;
    font-weight: bold;
    color: $main-color;
  }
}
</style>
