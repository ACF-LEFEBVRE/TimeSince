<template>
  <VApp class="app-container">
    <div v-if="isAuthReady">
      <AppNavBar v-if="!isLoginView" :isAuthenticated="isAuthenticated" @logout="logout" />
      <VMain :class="['fill-height', 'd-flex', 'justify-center']">
        <router-view />
      </VMain>
    </div>
    <div v-else class="d-flex justify-center align-center fill-height">
      <VProgressCircular indeterminate color="primary" size="64" />
    </div>
  </VApp>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth.ts'
import AppNavBar from '@/components/navigation/AppNavBar.vue'
import { useViews } from './composables/useViews'

// REF
const isAuthReady = ref(false)

// COMPOSABLES
const { isAuthenticated, logout, subscribeToAuthChanges } = useAuth()
const { isLoginView } = useViews()

// Verificar el estado de autenticación antes de mostrar contenido
onMounted(() => {
  subscribeToAuthChanges(() => {
    isAuthReady.value = true
  })
})
</script>

<style lang="scss" scoped>
.app-container {
  width: 100vw;
  height: 100vh;

  div {
    height: 100%;
    background-color: #e4ecfc;
  }

  .v-main {
    min-height: calc(100vh - 64px);
  }
}
</style>
