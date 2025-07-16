<template>
  <VCard elevation="8" class="pa-6 rounded-xl">
    <VTabs v-model="activeTab" grow>
      <VTab value="login">Iniciar sesión</VTab>
      <VTab value="register">Registrarse</VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-4">
      <VWindowItem value="login">
        <LoginForm @submit="handleLogin" :loading="isLoading" />
      </VWindowItem>

      <VWindowItem value="register">
        <RegisterForm @submit="handleRegister" :loading="isLoading" />
      </VWindowItem>
    </VWindow>

    <AuthAlert :message="errorMessage" />
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LoginForm from '@/views/login/components/LoginForm.vue'
import RegisterForm from '@/views/login/components/RegisterForm.vue'
import AuthAlert from '@/views/login/components/AuthAlert.vue'
import { useAuth, type AuthCredentials } from '@/composables/useAuth'

// DATA
const activeTab = ref('login')

// COMPOSABLES
const { login, register, error, isLoading } = useAuth()

// Convertir error a un string para el componente AuthAlert
const errorMessage = computed(() => error.value || '')

// METHODS
const handleLogin = async (credentials: AuthCredentials) => {
  await login(credentials)
}

const handleRegister = async (credentials: AuthCredentials) => {
  await register(credentials)
}
</script>
