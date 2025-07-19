<template>
  <div :class="['text-center', 'mb-6', 'mt-6', { desktop: !smAndDown }]">
    <div>
      <div class="welcome-container">{{ text.welcomeMessage }}</div>
      <p class="app-description">
        {{ text.appDescription }}
      </p>
    </div>
    <HelpInfo v-if="!smAndDown" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import HelpInfo from '@/views/login/components/HelpInfo.vue'

// TRNASLATION
const { t } = useI18n()

const text = {
  welcomeMessage: t('auth.welcomeMessage'),
  appDescription: t('auth.appDescription'),
}

// COMPOSABLES
const { smAndDown } = useDisplay()
</script>

<style lang="scss" scoped>
.welcome-header {
  &.desktop {
    @include flex($direction: column, $justify: space-between);
    margin: 0 !important;
    height: 390px;

    .welcome-container {
      font-size: $font-size-xxxl;
    }

    .app-description {
      margin-top: 20px;
    }
  }
}
.welcome-container {
  font-family: $title-font;
  font-size: $font-size-xxl;
  font-weight: bold;
  color: $main-color;
  margin-top: 10px;
}

.app-description {
  font-family: $text-font;
  font-size: $font-size-sm;
  color: $primary-text;
  margin-top: 8px;
  max-width: 450px;
  text-align: left;
}
</style>
