<template>
  <VExpansionPanelTitle class="counter-title">
    <div class="d-flex align-center w-100">
      <div class="counter-name">{{ name }}</div>
      <span class="counter-data ml-auto mr-3">{{ calculateDays(startDate) }}</span>
    </div>
  </VExpansionPanelTitle>
</template>

<script lang="ts" setup>
import { useDateCalculation } from '@/composables/useDateCalculation'

// PROPS
const { name, startDate } = defineProps<{
  name: string
  startDate: number
}>()

// COMPOSABLES
const { calculateDays } = useDateCalculation()
</script>

<style lang="scss" scoped>
.counter-title {
  &:hover {
    background-color: $main-050;
  }
  &:focus {
    outline: none;
  }

  :deep(.v-expansion-panel-title__overlay) {
    display: none;
  }

  .counter-name {
    @include flex;
    font-family: $title-font;
    font-size: $font-size-md;
    font-weight: bold;
    color: $main-color;
  }

  .counter-data {
    font-family: $title-font;
    font-weight: bold;
    font-size: $font-size-md;
    color: $main-color;
  }
}
</style>
