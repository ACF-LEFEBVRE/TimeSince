<template>
  <div>
    <VSheet v-if="loading" class="pa-5 d-flex justify-center align-center">
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
        width="5"
        class="ma-5"
      ></VProgressCircular>
    </VSheet>
    <template v-else>
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
    </template>
  </div>
</template>

<script setup lang="ts">
import CounterItem from '@/modules/counters/components/CounterItem.vue'
import CounterListEmptyState from '@/modules/counters/components/list/CounterListEmptyState.vue'
import SearchEmptyState from '@/modules/counters/components/SearchEmptyState.vue'
import type { Counter } from '@/modules/counters/types/counters'

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
  loading: {
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
