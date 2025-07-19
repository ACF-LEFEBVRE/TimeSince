<template>
  <div class="login-background">
    <WelcomeHeader />
    <div class="d-flex justify-center align-center login-container">
      <VCard elevation="0" class="pa-6 rounded-xl login-card" max-width="420px">
        <AuthForm
          @submit="handleSubmit"
          @switch-tab="switchTab"
          :loading="isLoading"
          :isLogin="isLoginMode"
        />

        <AuthAlert :message="errorMessage" />
      </VCard>
    </div>
    <HelpInfo />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AuthForm from '@/views/login/components/AuthForm.vue'
import AuthAlert from '@/views/login/components/AuthAlert.vue'
import WelcomeHeader from '@/views/login/components/WelcomeHeader.vue'
import { useAuth, type AuthCredentials } from '@/composables/useAuth'
import HelpInfo from '@/views/login/components/HelpInfo.vue'

// DATA
const isLoginMode = ref(true)

// COMPOSABLES
const { login, register, error, isLoading } = useAuth()

// Convertir error a un string para el componente AuthAlert
const errorMessage = computed(() => error.value || '')

// METHODS
const handleSubmit = async (credentials: AuthCredentials) => {
  if (isLoginMode.value) {
    await login(credentials)
  } else {
    await register(credentials)
  }
}

const switchTab = () => {
  isLoginMode.value = !isLoginMode.value
}
</script>

<style lang="scss" scoped>
.login-background {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  max-width: 420px;
}

.login-container {
  width: 100%;
  min-height: 80%;
}

.login-card {
  width: 490px;
  border-radius: $cornerRadius-md;
  box-shadow: $shadow-md !important;
}
</style>
