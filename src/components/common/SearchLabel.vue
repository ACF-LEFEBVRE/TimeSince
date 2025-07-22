<template>
  <span class="search-label mr-2">{{ props.text }}:</span>
</template>

<script setup lang="ts">
// PROPS
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.search-label {
  font-family: inherit;
  color: inherit;
  font-weight: bold;
  font-size: inherit;
}
</style>
