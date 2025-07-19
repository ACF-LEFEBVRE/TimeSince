<template>
  <div class="locale-switcher">
    <VBtn
      v-for="locale in availableLocales"
      :key="locale.code"
      :color="currentLocale === locale.code ? 'white' : 'default'"
      :title="locale.name"
      :aria-label="'Cambiar idioma a ' + locale.name"
      density="comfortable"
      icon
      size="small"
      class="locale-btn"
      @click="changeLocale(locale.code)"
    >
      <div :class="['flag-icon', currentLocale === locale.code ? 'active' : '']">
        <span :class="'fi fi-' + getFlagCode(locale.code)"></span>
      </div>
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/plugins/i18n'
import { supportedLocales } from '@/plugins/i18n/locales'

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

// Helper para obtener el código de bandera desde supportedLocales
const getFlagCode = (locale: string): string => {
  const localeObj = availableLocales.value.find(l => l.code === locale)
  return localeObj?.flag || locale
}
</script>

<style scoped>
.locale-switcher {
  display: flex;
  gap: 4px;
  align-items: center;
}

.locale-btn {
  margin: 0 2px;
}

.flag-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.flag-icon.active {
  border-color: white;
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

/* Usa la clase fi para banderas */
.fi {
  width: 100%;
  height: 100%;
  display: inline-block;
  background-size: cover;
  background-position: center;
  vertical-align: middle;
}

/* Banderas específicas */
.fi-es {
  background-image: url('https://flagcdn.com/w40/es.png');
}

.fi-gb {
  background-image: url('https://flagcdn.com/w40/gb.png');
}
</style>
