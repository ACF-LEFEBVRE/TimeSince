<template>
  <div v-if="isLoading" class="loading-overlay" :class="{ 'with-message': loadingMessage }">
    <VProgressCircular indeterminate color="primary" size="60" width="5" class="spinner" />
    <div v-if="loadingMessage" class="loading-message">
      {{ loadingMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoadingStore } from '@/stores/useLoadingStore'
import { storeToRefs } from 'pinia'

// STORE
const loadingStore = useLoadingStore()
const { isLoading, loadingMessage } = storeToRefs(loadingStore)
</script>

<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  flex-direction: column;
  transition: opacity 0.3s ease;

  &.with-message {
    .spinner {
      margin-bottom: 16px;
    }
  }

  .loading-message {
    color: white;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    max-width: 80%;
    margin-top: 16px;
  }
}
</style>
