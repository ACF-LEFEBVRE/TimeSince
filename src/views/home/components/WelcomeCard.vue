<template>
  <VCard class="mt-5">
    <VCardTitle class="text-h4 mb-2">{{ text.welcome }} TimeSince!</VCardTitle>
    <VCardText>
      <p class="text-h6 mb-3" v-if="email">{{ text.hello }}, {{ email }}</p>
      <p>
        {{ text.description }}
      </p>
    </VCardText>
    <VCardActions>
      <VBtn color="primary" variant="elevated" :to="ROUTES.COUNTERS">{{ text.viewCounters }}</VBtn>
      <VBtn color="secondary" variant="outlined" @click="onLogout">{{ text.logout }}</VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { ROUTES } from '@/router/routes'
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  welcome: t('home.welcome'),
  hello: 'Hola', // Añadimos esta traducción
  description: 'Aquí podrás crear y gestionar contadores para recordar cuánto tiempo ha pasado desde momentos importantes.',
  viewCounters: 'Ver mis contadores',
  logout: t('auth.logout'),
}

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
