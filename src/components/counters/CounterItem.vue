<template>
  <VExpansionPanel :value="counter.id" class="my-1 counter-item" height="70">
    <CounterTitle :name="counter.name" :start-date="counter.startDate" />

    <VExpansionPanelText class="pa-2">
      <section class="row-1">
        <!-- Start Date -->
        <CustomTextField
          :placeholder="formatDate(counter.startDate)"
          :label="texts.startDate"
          class="w-100"
        />

        <!-- Category -->
        <CustomTextField
          :placeholder="counter.category"
          :label="texts.category"
          class="w-100 ml-4 mr-2"
        />

        <!-- Actions -->
        <CounterItemActionButtons
          v-if="!hideActions"
          :counter="counter"
          @toggle-favorite="onToggleFavorite"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </section>

      <!-- Descriptio -->
      <CustomTextField
        :placeholder="counter.description"
        :label="texts.description"
        class="w-100"
      />
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<script setup lang="ts">
import type { Counter } from '@/components/counters/types/counters'
import { useDateCalculation } from '@/composables/useDateCalculation'
import { useI18n } from 'vue-i18n'
import CustomTextField from '@/components/form/CustomTextField.vue'
import CounterItemActionButtons from '@/components/counters/CounterItemActionButtons.vue'
import CounterTitle from '@/components/counters/CounterTitle.vue'

// PROPS
const props = defineProps({
  counter: {
    type: Object as () => Counter,
    required: true,
  },
  hideActions: {
    type: Boolean,
    default: false,
  },
})

// TRANSLATIONS

const { t } = useI18n()

const texts = {
  startDate: t('counters.startDate'),
  category: t('counters.category'),
  description: t('counters.description'),
}

// EMITS
const emit = defineEmits(['toggle-favorite', 'delete', 'edit'])

// COMPOSABLES
const { formatDate } = useDateCalculation()

// METHODS
const handleDelete = () => {
  emit('delete', props.counter.id)
}

const handleEdit = () => {
  emit('edit', props.counter)
}

const onToggleFavorite = () => {
  emit('toggle-favorite', props.counter)
}
</script>

<style lang="scss" scoped>
.counter-item {
  &.v-expansion-panel--active {
    .v-expansion-panel-title {
      background-color: $main-050;
      border: $highlight-border;
      border-bottom: none;
    }

    .v-expansion-panel-text {
      border: $highlight-border;
      border-top: none;
    }
  }

  .row-1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :deep(.v-field) {
    pointer-events: none !important;
  }
}
</style>
