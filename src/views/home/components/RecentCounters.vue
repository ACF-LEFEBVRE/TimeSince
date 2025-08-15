<template>
  <VCard class="card-container pa-2 pb-4">
    <VCardTitle class="d-flex align-center">
      <h2 class="counters-title">
        <VIcon color="primary" class="mr-2">mdi-clock-time-four</VIcon>
        <span>{{ text.recentCounters }}</span>
      </h2>
    </VCardTitle>

    <div>
      <CountersList :counters="recentCounters" :hide-actions="true" :loading="props.loading" />

      <VCardText v-if="props.counters.length === 0" class="text-center pa-5">
        {{ text.noCounters }}
      </VCardText>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CountersList from '@/modules/counters/components/list/CountersList.vue'
import type { Counter } from '@/modules/counters/types/counters'

// TRANSLATION
const { t } = useI18n()

const text = {
  noCounters: t('counters.noCounters'),
  recentCounters: t('home.recentCounters'),
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
  limit: {
    type: Number,
    default: 10,
  },
})

// COMPUTED
const recentCounters = computed(() => {
  if (!props.counters.length) return []

  // Ordenar por fecha de inicio (startDate) descendente
  return [...props.counters].sort((a, b) => b.startDate - a.startDate).slice(0, props.limit)
})
</script>

<style lang="scss" scoped>
@use '@/styles/shared/counters-container.scss';
</style>
