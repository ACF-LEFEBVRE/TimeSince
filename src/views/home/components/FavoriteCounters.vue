<template>
  <VCard>
    <VCardTitle class="d-flex align-center">
      <h2 class="text-h5">
        <VIcon color="amber-darken-2" class="mr-2">mdi-star</VIcon>
        Mis Favoritos
      </h2>
    </VCardTitle>

    <VDivider />

    <VProgressLinear v-if="props.loading" indeterminate color="primary"></VProgressLinear>

    <div v-else>
      <CountersList :counters="props.counters" :hide-actions="true" />

      <VCardText v-if="props.counters.length === 0" class="text-center pa-5">
        No tienes contadores favoritos. Marca algunos contadores como favoritos para verlos aquí.
      </VCardText>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Counter } from '@/components/counters/types/counters'
import CountersList from '@/components/counters/CountersList.vue'

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
