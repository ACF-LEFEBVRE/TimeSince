<template>
  <VApp>
    <div v-if="isAuthReady">
      <AppNavBar :isAuthenticated="isAuthenticated" @logout="logout" />
      <VMain class="fill-height">
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
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAuth } from '@/composables/useAuth.ts'
import AppNavBar from '@/components/navigation/AppNavBar.vue'

// REF
const isAuthReady = ref(false)

// COMPOSABLES
const { isAuthenticated, logout } = useAuth()

// Verificar el estado de autenticación antes de mostrar contenido
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, () => {
    isAuthReady.value = true
  })
})
</script>

<style scoped>
.v-application {
  width: 100%;
  height: 100%;
}

.v-main {
  width: 100%;
  min-height: calc(100vh - 64px);
}
</style>
