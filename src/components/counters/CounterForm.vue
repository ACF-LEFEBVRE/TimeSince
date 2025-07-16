<template>
  <VDialog v-model="dialogVisible" max-width="500px">
    <VCard>
      <VCardTitle class="text-h5">Nuevo Contador</VCardTitle>
      <VCardText>
        <VForm @submit.prevent="submit" ref="form">
          <VTextField
            v-model="counterData.name"
            label="Nombre del contador"
            required
            :rules="[(v: string) => !!v || 'El nombre es obligatorio']"
          />

          <VRow>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="counterData.date"
                label="Fecha de inicio"
                type="date"
                required
                :rules="[(v: string) => !!v || 'La fecha es obligatoria']"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VSelect
                v-model="counterData.color"
                label="Color"
                :items="colorOptions"
                item-title="text"
                item-value="value"
              />
            </VCol>
          </VRow>

          <VSelect
            v-model="counterData.icon"
            label="Icono"
            :items="iconOptions"
            item-title="text"
            item-value="value"
          />
        </VForm>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="grey-darken-1" text @click="closeDialog">Cancelar</VBtn>
        <VBtn color="primary" @click="submit" :disabled="!isFormValid">Crear</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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
  { text: 'Azul', value: 'primary' },
  { text: 'Verde', value: 'success' },
  { text: 'Rojo', value: 'error' },
  { text: 'Naranja', value: 'warning' },
  { text: 'Morado', value: 'purple' },
]

const iconOptions = [
  { text: 'Calendario', value: 'mdi-calendar-clock' },
  { text: 'Estrella', value: 'mdi-star' },
  { text: 'Corazón', value: 'mdi-heart' },
  { text: 'Trofeo', value: 'mdi-trophy' },
  { text: 'Regalo', value: 'mdi-gift' },
  { text: 'Deporte', value: 'mdi-run' },
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
