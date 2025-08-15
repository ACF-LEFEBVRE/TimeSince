<template>
  <div class="d-flex justify-end">
    <VBtn
      v-for="(button, index) in buttons"
      :key="index"
      icon
      variant="text"
      :color="button.color"
      :class="button.class"
      @click.stop="button.action"
    >
      <VIcon>{{ button.icon }}</VIcon>
      <VTooltip
        content-class="custom-tooltip"
        :close-on-content-click="true"
        activator="parent"
        location="top"
        >{{ button.tooltip }}</VTooltip
      >
    </VBtn>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Counter } from '@/modules/counters/types/counters'
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const texts = {
  addFavorite: t('counters.addFavorite'),
  removeFavorite: t('counters.removeFavorite'),
  removeCounter: t('counters.removeCounter'),
  editCounter: t('counters.editCounter'),
}

// PROPS
const props = defineProps<{ counter: Counter }>()

// COMPUTED
const buttons = computed(() => [
  {
    icon: props.counter.favorite ? 'mdi-star' : 'mdi-star-outline',
    color: props.counter.favorite ? 'amber-darken-2' : 'grey',
    tooltip: props.counter.favorite ? texts.removeFavorite : texts.addFavorite,
    action: () => onToggleFavorite(),
    class: 'ml-4',
  },
  {
    icon: 'mdi-pencil',
    tooltip: texts.editCounter,
    action: () => onEdit(),
    class: 'edit-button',
  },
  {
    icon: 'mdi-delete',
    tooltip: texts.removeCounter,
    action: () => onDelete(),
    class: 'delete-button',
  },
])

// EMITS
const emit = defineEmits(['toggle-favorite', 'edit', 'delete'])

// METHODS
const onEdit = () => {
  emit('edit', props.counter)
}

const onDelete = () => {
  if (confirm('¿Estás seguro de que quieres eliminar este contador?')) {
    emit('delete', props.counter.id)
  }
}

const onToggleFavorite = () => {
  emit('toggle-favorite', props.counter)
}
</script>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as *;

.v-btn {
  &:focus {
    outline: none;
  }
}

.edit-button {
  color: $tertiary-seaGreen-200 !important;
}

.delete-button {
  color: $highlight-200 !important;
}
</style>

<style lang="scss">
.custom-tooltip {
  font-family: $text-font;
  font-size: $font-size-xxs !important;
  color: $main-color !important;
  background-color: $main-100 !important;
}
</style>
