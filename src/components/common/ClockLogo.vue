<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :height="size"
    :width="size"
    viewBox="0 0 40 40"
    fill="none"
  >
    <circle
      cx="20"
      cy="20"
      r="18"
      :stroke="primaryColor"
      stroke-width="4"
      :fill="backgroundColor"
    />
    <rect x="19" y="10" width="2" height="11" rx="1" :fill="primaryColor" />
    <rect
      x="20"
      y="20"
      width="8"
      height="2"
      rx="1"
      :fill="primaryColor"
      transform="rotate(30 20 20)"
    />
    <circle cx="20" cy="20" r="2" :fill="primaryColor" />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: { type: Number, default: 40 },
  primaryColor: { type: String, default: '#001978' },
  backgroundColor: { type: String, default: '#fff' },
})
</script>
