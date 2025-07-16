<template>
  <div class="locale-switcher">
    <VBtn
      v-for="locale in availableLocales"
      :key="locale.code"
      :color="currentLocale === locale.code ? 'primary' : ''"
      size="small"
      variant="text"
      @click="changeLocale(locale.code)"
    >
      {{ locale.name }}
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/plugins/i18n'
import { supportedLocales } from '@/locales'

// Composables
const i18n = useI18n()

// Computed
const currentLocale = computed(() => i18n.locale.value)
const availableLocales = computed(() => supportedLocales)

// Methods
const changeLocale = (locale: string) => {
  // Solo ejecutar si es un cambio de idioma
  if (locale !== currentLocale.value) {
    setLocale(locale as 'es' | 'en')
  }
}
</script>

<style scoped>
.locale-switcher {
  display: flex;
  gap: 8px;
}
</style>
