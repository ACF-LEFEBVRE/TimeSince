<template>
  <div class="login-background">
    <div class="text-center mb-6 mt-6">
      <img src="@/assets/vue.svg" alt="Logo" height="40" class="mb-2" />
      <div class="text-h5 font-weight-bold">Logoipsum</div>
    </div>
    <div class="d-flex justify-center align-center login-container">
      <VCard elevation="0" class="pa-6 rounded-xl login-card" max-width="420px">
        <VWindow v-model="activeTab">
          <VWindowItem value="login">
            <LoginForm
              @submit="handleLogin"
              @switch-tab="activeTab = 'register'"
              :loading="isLoading"
            />
          </VWindowItem>

          <VWindowItem value="register">
            <RegisterForm
              @submit="handleRegister"
              @switch-tab="activeTab = 'login'"
              :loading="isLoading"
            />
          </VWindowItem>
        </VWindow>

        <AuthAlert :message="errorMessage" />
      </VCard>
    </div>
  </div>
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

<style scoped>
.login-background {
  background: linear-gradient(180deg, #4285f4 0%, #34a853 100%);
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}

.login-container {
  width: 100%;
  padding: 16px;
  min-height: 80%;
}

.login-card {
  width: 100%;
  background-color: white;
}

@media (min-width: 600px) {
  .login-card {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
}
</style>
