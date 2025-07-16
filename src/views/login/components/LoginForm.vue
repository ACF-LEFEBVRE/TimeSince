<template>
  <VForm @submit.prevent="onSubmit">
    <VTextField
      v-model="email"
      label="Email"
      type="email"
      required
      prepend-inner-icon="mdi-email"
      class="mb-4"
    />
    <VTextField
      v-model="password"
      label="Contraseña"
      type="password"
      required
      prepend-inner-icon="mdi-lock"
      class="mb-4"
    />
    <VBtn type="submit" color="primary" block size="large">Entrar</VBtn>
  </VForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const emit = defineEmits(['submit'])

const onSubmit = () => {
  emit('submit', { email: email.value, password: password.value })
}
</script>
