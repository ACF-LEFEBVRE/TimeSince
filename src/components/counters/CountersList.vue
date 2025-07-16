<template>
  <div>
    <EmptyState v-if="!counters || counters.length === 0" />

    <VList v-else>
      <CounterItem
        v-for="counter in counters"
        :key="counter.id"
        :counter="counter"
        :hide-actions="hideActions"
        @toggle-favorite="toggleFavorite"
        @delete="deleteCounter"
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
  hideActions: {
    type: Boolean,
    default: false,
  },
})

// EMITS
const emit = defineEmits<{
  (e: 'toggle-favorite', counter: Counter): void
  (e: 'delete', id: string): void
}>()

// METHODS
const toggleFavorite = (counter: Counter) => {
  emit('toggle-favorite', counter)
}

const deleteCounter = (id: string) => {
  emit('delete', id)
}
</script>
