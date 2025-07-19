<template>
  <VAppBar class="app-bar" height="64">
    <VToolbarTitle class="title-container" @click="navigateToHome">
      <ClockLogo :size="32" />
      <span class="app-name" v-if="!smAndDown">{{ text.appNName }}</span>
    </VToolbarTitle>
    <VSpacer></VSpacer>
    <div v-if="props.isAuthenticated" class="d-flex align-center">
      <VBtn :to="ROUTES.HOME" variant="text">{{ text.home }}</VBtn>
      <VBtn :to="ROUTES.COUNTERS" variant="text">{{ text.counters }}</VBtn>
      <VBtn @click="onLogout" variant="text" prepend-icon="mdi-logout">{{ text.logout }}</VBtn>
      <VDivider vertical class="mx-2 my-auto" />
      <LocaleSwitcher />
    </div>
  </VAppBar>
</template>

<script setup lang="ts">
import { ROUTES } from '@/router/routes'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import ClockLogo from '@/components/common/ClockLogo.vue'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'

// PROPS
const props = defineProps<{
  isAuthenticated: boolean
}>()

// TRANSLATION
const { t } = useI18n()

// TRANSITION
const text = {
  appNName: t('common.appName'),
  home: t('navigation.home'),
  counters: t('navigation.counters'),
  settings: t('navigation.settings'),
  logout: t('auth.logout'),
}

// COMPOSABLES
const router = useRouter()
const { smAndDown } = useDisplay()

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

<style lang="scss" scoped>
.app-bar {
  box-shadow: $shadow-md !important;

  .title-container {
    @include flex($justify: flex-start);
    cursor: pointer;

    :deep(.v-toolbar-title__placeholder) {
      @include flex;

      .app-name {
        font-family: $inter-font;
        font-size: $font-size-xl;
        color: $main-color;
        font-weight: bold;
        padding-left: $spacing-xs;
      }
    }
  }
}
</style>
