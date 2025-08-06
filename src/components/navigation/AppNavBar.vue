<template>
  <VAppBar class="app-bar" height="64">
    <VToolbarTitle class="title-container" @click="navigateToHome">
      <ClockLogo :size="32" />
      <span class="app-name" v-if="!smAndDown">{{ text.appNName }}</span>
    </VToolbarTitle>
    <VSpacer></VSpacer>
    <div v-if="props.isAuthenticated" class="d-flex align-center">
      <CustomButton :to="ROUTES.COUNTERS" :text="text.counters" />
      <CustomButton :to="ROUTES.CATEGORIES" :text="text.categories" />
      <VBtn :to="ROUTES.HOME" icon="mdi-home" size="large" class="round-btn"></VBtn>
      <VBtn @click="onLogout" size="large" icon="mdi-logout" class="mr-4 round-btn"></VBtn>
    </div>
  </VAppBar>
</template>

<script setup lang="ts">
import { ROUTES } from '@/router/routes'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import ClockLogo from '@/components/common/ClockLogo.vue'
import CustomButton from '@/components/form/CustomButton.vue'

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
  categories: t('navigation.categories'),
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
        font-family: $title-font;
        font-size: $font-size-xl;
        color: $main-color;
        font-weight: bold;
        padding-left: $spacing-xs;
      }
    }
  }

  .round-btn {
    color: $text-color;
    font-family: $text-font;

    &.v-btn--active {
      color: $main-color;
      border: 1px solid $main-color;

      :deep(.v-btn__overlay) {
        display: none;
      }
    }

    &:hover {
      color: $main-color;

      :deep(.v-btn__overlay) {
        display: none;
      }
    }

    &:focus {
      outline: none;
    }

    &.v-btn--icon {
      border: none;
      color: $main-color;
    }
  }
}
</style>
