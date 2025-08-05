<template>
  <VBtn
    :to="props.to"
    :disabled="disabled"
    class="custom-btn"
    :class="{ 'secondary-button': secondary }"
    @click="clickAction"
    elevation="0"
    min-width="100px"
    >{{ text }}</VBtn
  >
</template>

<script setup lang="ts">
// PROPS
const props = defineProps({
  to: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  clickAction: {
    type: Function,
    default: () => {},
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  secondary: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.custom-btn {
  color: $main-color;
  border: 1px solid $main-color;

  &.secondary-button {
    border: none;
    margin-right: $spacing-sm;
  }

  :deep(.v-btn__overlay) {
    display: none;
  }

  &:hover {
    color: $white;
    background-color: $main-900;

    :deep(.v-btn__overlay) {
      display: none;
    }
  }

  &:focus {
    outline: none;
  }

  &.v-btn--icon {
    border: none;
    color: $main-color;
  }
}
</style>
