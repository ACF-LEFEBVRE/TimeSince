<template>
  <VAlert v-if="message" type="error" variant="tonal" class="mt-4">
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
