<template>
  <div class="btn-container">
    <VBtn :disabled="disabled" type="submit" class="login-btn" :loading="loading" rounded="xl">
      {{ text }}
    </VBtn>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.btn-container {
  @include flex($justify: flex-end);
  margin-top: $spacing-md;

  .login-btn {
    background-color: $secondary-pumpkin-100;
    font-family: $title-font;
    font-size: $font-size-sm;
    color: $neutral-white-000;
    text-transform: inherit;
    box-shadow: none;
    width: 45%;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }
}
</style>
