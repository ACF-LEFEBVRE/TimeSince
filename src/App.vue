<template>
  <VApp>
    <AppNavBar :isAuthenticated="isAuthenticated" @logout="logout" />
    <VMain class="fill-height">
      <router-view />
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth.ts'
import AppNavBar from '@/components/navigation/AppNavBar.vue'

// COMPOSABLES
const { isAuthenticated, logout } = useAuth()
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
