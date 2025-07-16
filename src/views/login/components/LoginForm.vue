<template>
  <VForm @submit.prevent="onSubmit">
    <VTextField
      v-model="email"
      label="Email"
      type="email"
      required
      prepend-inner-icon="mdi-email"
      class="mb-4"
      :disabled="loading"
    />
    <VTextField
      v-model="password"
      label="Contraseña"
      type="password"
      required
      prepend-inner-icon="mdi-lock"
      class="mb-4"
      :disabled="loading"
    />
    <VBtn type="submit" color="primary" block size="large" :loading="loading">
      {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
    </VBtn>
  </VForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// PROPS
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

// DATA
const email = ref('')
const password = ref('')

// EMITS
const emit = defineEmits(['submit'])

// METHODS
const onSubmit = () => {
  emit('submit', { email: email.value, password: password.value })
}
</script>
