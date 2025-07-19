<template>
  <div class="custom-text-field-container mb-1">
    <div class="custom-text-field-label mb-1">
      <div class="textfield-label">{{ label }}</div>
      <slot class="label-append" name="label-append"></slot>
    </div>
    <VTextField
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :type="type"
      :required="required"
      :variant="variant"
      :class="inputClass"
      :disabled="disabled"
      :rules="rules"
      :density="density"
      :placeholder="placeholder"
      :append-inner-icon="appendInnerIcon"
      @click:append-inner="onAppendInnerClick"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: String,
  label: String,
  type: {
    type: String,
    default: 'text',
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
.custom-text-field-container {
  .custom-text-field-label {
    @include flex($justify: space-between);
    font-family: $text-font;
    color: $text-color;
    font-size: $font-size-xs;
  }

  :deep(.v-input__details) {
    padding-left: 0;
  }
}
</style>
