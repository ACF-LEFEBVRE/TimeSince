<template>
  <VDialog v-model="dialogVisible" max-width="500px">
    <VCard>
      <VCardTitle class="text-h5">{{ text.newCounter }}</VCardTitle>
      <VCardText>
        <VForm @submit.prevent="submit" ref="form">
          <VTextField
            v-model="counterData.name"
            :label="text.name"
            required
            :rules="[(v: string) => !!v || text.nameRequired]"
          />

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
        </VForm>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="grey-darken-1" text @click="closeDialog">{{ text.cancel }}</VBtn>
        <VBtn color="primary" @click="submit" :disabled="!isFormValid">{{ text.create }}</VBtn>
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
  name: t('counters.name'),
  nameRequired: 'El nombre es obligatorio',
  startDate: t('counters.startDate'),
  dateRequired: 'La fecha es obligatoria',
  color: t('counters.color'),
  icon: t('counters.icon'),
  cancel: t('common.cancel'),
  create: 'Crear',
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
})

// DATA
const dialogVisible = ref(props.modelValue)
const form = ref<any>(null)

// Datos del formulario
const counterData = ref({
  name: '',
  date: new Date().toISOString().split('T')[0],
  color: 'primary',
  icon: 'mdi-calendar-clock',
  favorite: false,
})

// EMITS
const emit = defineEmits(['update:modelValue', 'submit'])

// CONSTS
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

  emit('submit', { ...counterData.value })
  resetForm()
  closeDialog()
}

const resetForm = () => {
  counterData.value = {
    name: '',
    date: new Date().toISOString().split('T')[0],
    color: 'primary',
    icon: 'mdi-calendar-clock',
    favorite: false,
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
  }
)

watch(dialogVisible, newVal => {
  emit('update:modelValue', newVal)
})
</script>
