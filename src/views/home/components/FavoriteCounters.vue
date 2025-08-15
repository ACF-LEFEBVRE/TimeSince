<template>
  <VCard class="card-container pa-2 pb-4">
    <VCardTitle class="d-flex align-center">
      <h2 class="counters-title">
        <VIcon color="amber-darken-2" class="mr-2">mdi-star</VIcon>
        <span> {{ text.myFavorites }}</span>
      </h2>
    </VCardTitle>
    <div>
      <CountersList :counters="props.counters" :hide-actions="true" :loading="props.loading" />

      <VCardText v-if="props.counters.length === 0" class="text-center pa-5">
        {{ text.noFavorites }}
      </VCardText>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Counter } from '@/modules/counters/types/counters'
import CountersList from '@/modules/counters/components/list/CountersList.vue'

// TRANSLATION
const { t } = useI18n()

const text = {
  myFavorites: t('home.favoriteCounters'),
  noFavorites: t('home.noFavorites'),
}

// PROPS
const props = defineProps({
  counters: {
    type: Array as () => Counter[],
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
@use '@/styles/shared/counters-container.scss';
</style>
