<template>
  <VAppBar color="primary" dark flat>
    <VToolbarTitle class="cursor-pointer" @click="navigateToHome">TimeSince</VToolbarTitle>
    <VSpacer></VSpacer>
    <div v-if="props.isAuthenticated">
      <VBtn :to="ROUTES.HOME" variant="text">Home</VBtn>
      <VBtn :to="ROUTES.COUNTERS" variant="text">Contadores</VBtn>
      <VBtn @click="onLogout" variant="text" prepend-icon="mdi-logout">Cerrar sesión</VBtn>
    </div>
  </VAppBar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router/routes'

// PROPS
const props = defineProps<{
  isAuthenticated: boolean
}>()

// COMPOSABLES
const router = useRouter()

// EMITS
const emit = defineEmits<{
  logout: []
}>()

// METHODS
const navigateToHome = () => {
  router.push(ROUTES.HOME)
}

const onLogout = () => {
  emit('logout')
}
</script>
