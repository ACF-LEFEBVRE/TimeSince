<template>
  <VContainer class="fill-height" fluid>
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="4">
        <div class="text-center mb-8">
          <span class="app-title">TimeSince</span>
        </div>
        <VCard elevation="8" class="pa-6 rounded-xl">
          <VCardTitle class="text-h5 text-center mb-4">Iniciar sesión</VCardTitle>
          <VForm @submit.prevent="login" validate-on="submit">
            <VTextField
              v-model="email"
              label="Correo electrónico"
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
          <VAlert v-if="error" type="error" class="mt-4" dense>{{ error }}</VAlert>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import '../plugins/firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  error.value = ''
  try {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // Redirigir o actualizar estado tras login exitoso
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<style scoped>
.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #1976d2;
  font-family: 'Montserrat', 'Roboto', sans-serif;
  text-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}
</style>
