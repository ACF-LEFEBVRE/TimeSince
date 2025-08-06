<template>
  <div :class="['custom-field-container', { 'disabled-field': disabled }]">
    <div class="custom-text-label">
      <div class="textfield-label">{{ label }}</div>
      <slot class="label-append" name="label-append"></slot>
    </div>
    <VSelect
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :required="required"
      :variant="variant"
      :class="inputClass"
      :disabled="disabled"
      :rules="rules"
      :density="density"
      :placeholder="placeholder"
      :append-inner-icon="appendInnerIcon"
      :items="items"
      item-title="text"
      item-value="value"
      @click:append-inner="onAppendInnerClick"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
  },
  label: {
    type: String,
    required: false,
  },
  items: {
    type: Array,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'outlined',
  },
  inputClass: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  density: {
    type: String,
    default: 'compact',
  },
  placeholder: {
    type: String,
    default: '',
  },
  appendInnerIcon: {
    type: String,
    default: '',
  },
  onAppendInnerClick: {
    type: Function,
    default: () => {},
  },
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
@use '@/components/form/styles/custom-fields.scss';
</style>
