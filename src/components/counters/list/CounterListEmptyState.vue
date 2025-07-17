<template>
  <VCardText class="text-center pa-5">
    <p>{{ text.noCounters }}</p>
    <p>{{ text.addFirst }}</p>
  </VCardText>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  noCounters: t('counters.noCounters'),
  addFirst: t('counters.addYourFirst'),
}
</script>
