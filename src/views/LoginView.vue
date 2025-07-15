<template>
  <VCard elevation="8" class="pa-6 rounded-xl">
    <VTabs v-model="activeTab" grow>
      <VTab value="login">Iniciar sesión</VTab>
      <VTab value="register">Registrarse</VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-4">
      <VWindowItem value="login">
        <VForm @submit.prevent="login">
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
      </VWindowItem>

      <VWindowItem value="register">
        <VForm @submit.prevent="register">
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
            hint="Mínimo 6 caracteres"
          />
          <VBtn type="submit" color="success" block size="large">Registrarse</VBtn>
        </VForm>
      </VWindowItem>
    </VWindow>

    <VAlert v-if="error" type="error" class="mt-4" variant="tonal">
      {{ error }}
    </VAlert>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import '../firebase'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('login')
const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  error.value = ''
  try {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (e: any) {
    error.value = e.message
  }
}

const register = async () => {
  error.value = ''
  try {
    const auth = getAuth()
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<style scoped></style>
