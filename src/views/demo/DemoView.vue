<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="text-h4 d-flex align-center">
            <v-icon icon="mdi-test-tube" class="mr-2" />
            Demo de Componentes
          </VCardTitle>
        </VCard>
      </VCol>
    </VRow>

    <VRow class="mt-4">
      <VCol cols="12">
        <LoadingDemo />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts" setup>
import LoadingDemo from '@/components/demo/LoadingDemo.vue'
</script>
