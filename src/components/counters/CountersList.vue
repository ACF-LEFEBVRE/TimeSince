<template>
  <div>
    <EmptyState v-if="!counters || counters.length === 0" />

    <VList v-else>
      <CounterItem
        v-for="counter in counters"
        :key="counter.id"
        :counter="counter"
        @toggle-favorite="$emit('toggle-favorite', counter)"
        @delete="$emit('delete', $event)"
      />
    </VList>
  </div>
</template>

<script setup lang="ts">
import CounterItem from '@/components/counters/CounterItem.vue'
import EmptyState from '@/components/counters/EmptyState.vue'
import type { Counter } from '@/components/counters/types/counters'

// PROPS
defineProps({
  counters: {
    type: Array as () => Counter[],
    default: () => [],
  },
})

defineEmits(['toggle-favorite', 'delete'])
</script>
