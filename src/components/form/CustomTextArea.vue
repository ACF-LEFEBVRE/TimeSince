<template>
  <div :class="['custom-field-container', { 'disabled-field': disabled }]">
    <div class="custom-text-label">
      <div class="textfield-label">{{ label }}</div>
      <slot class="label-append" name="label-append"></slot>
    </div>
    <VTextarea
      :model-value="modelValue"
      :required="required"
      :variant="variant"
      :class="inputClass"
      :disabled="disabled"
      :rules="rules"
      :hint="hint"
      rows="3"
      auto-grow
      counter
      maxlength="200"
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
  placeholder: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
@import '@/components/form/styles/custom-fields.scss';
</style>
