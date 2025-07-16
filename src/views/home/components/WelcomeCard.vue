<template>
  <VCard class="mt-5">
    <VCardTitle class="text-h4 mb-2">¡Bienvenido a TimeSince!</VCardTitle>
    <VCardText>
      <p class="text-h6 mb-3" v-if="email">Hola, {{ email }}</p>
      <p>
        Aquí podrás crear y gestionar contadores para recordar cuánto tiempo ha pasado desde
        momentos importantes.
      </p>
    </VCardText>
    <VCardActions>
      <VBtn color="primary" variant="elevated" :to="ROUTES.COUNTERS">Ver mis contadores</VBtn>
      <VBtn color="secondary" variant="outlined" @click="onLogout">Cerrar sesión</VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { ROUTES } from '@/router/routes'

// PROPS
const { email } = defineProps({
  email: {
    type: String,
    default: undefined,
  },
})

// EMITS
const emit = defineEmits<{
  (e: 'logout'): void
}>()

const onLogout = () => {
  emit('logout')
}
</script>
