<template>
  <VDialog v-model="dialogVisible" max-width="500px">
    <VCard>
      <VCardTitle class="text-h5">{{ isEditing ? text.editCounter : text.newCounter }}</VCardTitle>
  })
  
  // Solo resetear el formulario si no estamos editando
  if (!isEditing.value) {
    resetForm()
  }
  
  closeDialog()
} <VCardText>
        <VForm @submit.prevent="submit" ref="form">
          <VRow>
            <VCol cols="12" sm="8">
              <VTextField
                v-model="counterData.name"
                :label="text.name"
                required
                :rules="[(v: string) => !!v || text.nameRequired]"
              />
            </VCol>
            <VCol cols="12" sm="4">
              <VSelect
                v-model="counterData.category"
                :label="text.category"
                :items="categoryOptions"
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
        <VBtn color="primary" @click="submit" :disabled="!isFormValid">{{ isEditing ? text.update : text.create }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  newCounter: t('counters.newCounter'),
  editCounter: 'Editar contador',
  name: t('counters.name'),
  nameRequired: 'El nombre es obligatorio',
  startDate: t('counters.startDate'),
  dateRequired: 'La fecha es obligatoria',
  color: t('counters.color'),
  icon: t('counters.icon'),
  cancel: t('common.cancel'),
  create: 'Crear',
  update: 'Actualizar',
  category: 'Categoría',
  description: 'Descripción',
  blue: 'Azul',
  green: 'Verde',
  red: 'Rojo',
  orange: 'Naranja',
  purple: 'Morado',
  calendar: 'Calendario',
  star: 'Estrella',
  heart: 'Corazón',
  trophy: 'Trofeo',
  gift: 'Regalo',
  sport: 'Deporte',
}

// PROPS
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  editCounter: {
    type: Object,
    default: null,
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

// EMITS
const emit = defineEmits(['update:modelValue', 'submit'])

// CONSTS
const categoryOptions = [
  'Personal',
  'Trabajo',
  'Salud',
  'Educación',
  'Viajes',
  'Finanzas',
  'Hobbies',
  'Familia',
  'Tecnología',
  'Hábitos'
]

const colorOptions = [
  { text: text.blue, value: 'primary' },
  { text: text.green, value: 'success' },
  { text: text.red, value: 'error' },
  { text: text.orange, value: 'warning' },
  { text: text.purple, value: 'purple' },
]

const iconOptions = [
  { text: text.calendar, value: 'mdi-calendar-clock' },
  { text: text.star, value: 'mdi-star' },
  { text: text.heart, value: 'mdi-heart' },
  { text: text.trophy, value: 'mdi-trophy' },
  { text: text.gift, value: 'mdi-gift' },
  { text: text.sport, value: 'mdi-run' },
]

// COMPUTED
const isFormValid = computed(() => {
  return counterData.value.name && counterData.value.date
})

// METHODS
const submit = () => {
  if (!isFormValid.value) return

  emit('submit', { 
    ...counterData.value, 
    isEditing: isEditing.value
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
        color: props.editCounter.color,
        icon: props.editCounter.icon,
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
