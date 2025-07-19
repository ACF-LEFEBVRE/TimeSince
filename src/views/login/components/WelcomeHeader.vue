<template>
  <div class="text-center mb-6 mt-6">
    <div class="welcome-container">{{ text.welcomeMessage }}</div>
    <p class="app-description">
      {{ text.appDescription }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// TRNASLATION
const { t } = useI18n()

const text = {
  welcomeMessage: t('auth.welcomeMessage'),
  appDescription: t('auth.appDescription'),
}
</script>

<style lang="scss" scoped>
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
