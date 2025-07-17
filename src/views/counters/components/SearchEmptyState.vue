<template>
  <div class="d-flex flex-column align-center pa-8">
    <VIcon icon="mdi-magnify-close" size="64" class="mb-4 text-grey" />
    <h3 class="text-h6 text-grey-darken-1 text-center">
      {{ text.searchNoResults }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  searchNoResults: t('counters.searchNoResults'),
}
</script>
