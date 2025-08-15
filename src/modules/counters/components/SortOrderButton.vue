<template>
  <section class="search-order-button-container">
    <SearchLabel :text="'Orden'" />
    <VChip class="sort-chip" clickable @click="handleToggle" size="small" density="compact">
      <VIcon start>{{ props.sortDirection ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</VIcon>
      {{ props.sortDirection ? 'Ascendente' : 'Descendente' }}
    </VChip>
  </section>
</template>

<script setup lang="ts">
import SearchLabel from '@/components/common/SearchLabel.vue'

// PROPS
const props = defineProps({
  sortDirection: {
    type: Boolean,
    default: true, // true for ascending, false for descending
  },
})

// EMITS
const emit = defineEmits(['toggle'])

// EVENTS
function handleToggle() {
  emit('toggle')
}
</script>

<style scoped lang="scss">
.search-order-button-container {
  .search-label {
    font-family: $text-font;
    color: $text-color;
    font-weight: bold;
    font-size: $font-size-xs;
  }

  .sort-chip {
    background-color: $main-900;
    color: $white;
    height: 24px;

    :deep(.v-chip__content) {
      padding-bottom: 2px;
    }
  }
}
</style>
