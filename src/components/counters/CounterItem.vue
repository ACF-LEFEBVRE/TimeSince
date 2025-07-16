<template>
  <VListItem>
    <template v-slot:prepend>
      <VIcon :color="counter.color || 'primary'" size="large" class="mr-3">
        {{ counter.icon || 'mdi-calendar-clock' }}
      </VIcon>
    </template>

    <VListItemTitle class="text-h6">
      {{ counter.name }}
    </VListItemTitle>

    <VListItemSubtitle>
      {{ formatDate(counter.startDate) }}
    </VListItemSubtitle>

    <template v-slot:append>
      <VChip color="primary" size="large" class="days-chip">
        {{ calculateDays(counter.startDate) }}
      </VChip>
      <div class="d-flex align-center">
        <VBtn
          icon
          variant="text"
          :color="counter.favorite ? 'amber-darken-2' : 'grey'"
          @click="$emit('toggle-favorite', counter)"
          class="ml-3"
        >
          <VIcon>{{ counter.favorite ? 'mdi-star' : 'mdi-star-outline' }}</VIcon>
        </VBtn>
        <VBtn icon variant="text" color="error" @click="$emit('delete', counter.id)" class="ml-1">
          <VIcon>mdi-delete</VIcon>
        </VBtn>
      </div>
    </template>
  </VListItem>
</template>

<script setup lang="ts">
import type { Counter } from '@/components/counters/types/counters'
import { useDateCalculation } from '@/composables/useDateCalculation'

// PROPS
defineProps({
  counter: {
    type: Object as () => Counter,
    required: true,
  },
})

// EMITS
defineEmits(['toggle-favorite', 'delete'])

// COMPOSABLES
const { formatDate, calculateDays } = useDateCalculation()
</script>

<style scoped>
.days-chip {
  font-weight: bold;
  min-width: 120px;
  max-width: 200px;
  justify-content: center;
  text-align: center;
  line-height: 1.3;
  white-space: normal;
  height: auto;
  padding: 8px 12px;
  font-size: 0.875rem;
}
</style>
