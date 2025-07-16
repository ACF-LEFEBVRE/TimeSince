<template>
  <VCard>
    <VCardTitle class="d-flex align-center">
      <h2 class="text-h5">
        <VIcon color="amber-darken-2" class="mr-2">mdi-star</VIcon>
        {{ text.myFavorites }}
      </h2>
    </VCardTitle>

    <VDivider />

    <VProgressLinear v-if="props.loading" indeterminate color="primary"></VProgressLinear>

    <div v-else>
      <CountersList :counters="props.counters" :hide-actions="true" />

      <VCardText v-if="props.counters.length === 0" class="text-center pa-5">
        {{ text.noFavorites }}
      </VCardText>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Counter } from '@/components/counters/types/counters'
import CountersList from '@/components/counters/CountersList.vue'

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
