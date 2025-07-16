<template>
  <VAppBar color="primary" dark flat>
    <VToolbarTitle class="cursor-pointer" @click="navigateToHome">TimeSince</VToolbarTitle>
    <VSpacer></VSpacer>
    <div v-if="props.isAuthenticated">
      <VBtn :to="ROUTES.HOME" variant="text">{{ $t('navigation.home') }}</VBtn>
      <VBtn :to="ROUTES.COUNTERS" variant="text">{{ $t('navigation.counters') }}</VBtn>
      <VBtn @click="onLogout" variant="text" prepend-icon="mdi-logout">{{ $t('auth.logout') }}</VBtn>
      <LocaleSwitcher class="ms-4" />
    </div>
    <LocaleSwitcher v-else class="ms-4" />
  </VAppBar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTES } from '@/router/routes'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'

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
