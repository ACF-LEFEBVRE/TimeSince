<template>
  <VAlert
    v-if="message"
    class="d-flex alert-container mt-4 pa-0"
    height="40"
    type="error"
    variant="tonal"
  >
    {{ message }}
  </VAlert>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.alert-container {
  :deep(.v-alert__prepend) i {
    font-size: 20px;
  }

  :deep(.v-alert__prepend),
  :deep(.v-alert__content) {
    height: 100%;
    margin: 0 0 0 8px;
  }

  :deep(.v-alert__content) {
    @include flex;
    font-family: $text-font;
    font-size: $font-size-xs;
    padding-bottom: 2px;
  }
}
</style>
