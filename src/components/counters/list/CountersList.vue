<template>
  <div>
    <CounterListEmptyState v-if="(!counters || counters.length === 0) && !isSearching" />
    <SearchEmptyState v-else-if="(!counters || counters.length === 0) && isSearching" />

    <VExpansionPanels v-else variant="accordion" class="px-4">
      <CounterItem
        v-for="counter in counters"
        :key="counter.id"
        :counter="counter"
        :hide-actions="hideActions"
        @toggle-favorite="toggleFavorite"
        @delete="deleteCounter"
        @edit="editCounter"
      />
    </VExpansionPanels>
  </div>
</template>

<script setup lang="ts">
import CounterItem from '@/components/counters/CounterItem.vue'
import CounterListEmptyState from '@/components/counters/list/CounterListEmptyState.vue'
import SearchEmptyState from '@/views/counters/components/SearchEmptyState.vue'
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
  isSearching: {
    type: Boolean,
    default: false,
  },
})

// EMITS
const emit = defineEmits<{
  (e: 'toggle-favorite', counter: Counter): void
  (e: 'delete', id: string): void
  (e: 'edit', counter: Counter): void
}>()

// METHODS
const toggleFavorite = (counter: Counter) => {
  emit('toggle-favorite', counter)
}

const deleteCounter = (id: string) => {
  emit('delete', id)
}

const editCounter = (counter: Counter) => {
  emit('edit', counter)
}
</script>
