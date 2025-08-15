<template>
  <VCard>
    <VCardTitle>
      {{ t(text.syncOperations) }}
    </VCardTitle>
    <VCardText>
      <p>{{ t(text.description) }}</p>
      <VRow>
        <VCol cols="12" md="6">
          <VBtn color="primary" block @click="loadDataSequentially">
            {{ t(text.sequentialOperation) }}
          </VBtn>
        </VCol>
        <VCol cols="12" md="6">
          <VBtn color="info" block @click="loadDataInParallel">
            {{ t(text.parallelOperation) }}
          </VBtn>
        </VCol>
      </VRow>
      <VRow class="mt-4">
        <VCol cols="12">
          <VBtn color="warning" block @click="loadWithCustomControl">
            {{ t(text.customLoading) }}
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>

    <VDivider class="mt-2" />

    <VCardText>
      <VAlert v-if="status" :color="status.type" variant="tonal">
        {{ status.message }}
      </VAlert>
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalLoading } from '@/composables/useGlobalLoading'

// TRANSLATIONS
const { t } = useI18n()

const text = {
  customLoading: 'demo.customLoading',
  description: 'demo.loadingDescription',
  parallelOperation: 'demo.parallelOperation',
  sequentialOperation: 'demo.sequentialOperation',
  syncOperations: 'demo.syncOperations',
}

// COMPOSABLES
const { startLoading, stopLoading, withGlobalLoading } = useGlobalLoading()

// DATA
const status = ref<{ message: string; type: string } | null>(null)

// Simulate async operation with delay
const simulateOperation = async (name: string, delay: number = 1000): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`Operación "${name}" completada después de ${delay}ms`)
    }, delay)
  })
}

// METHODS
// Example 1: Sequential operations with global loading
const loadDataSequentially = async () => {
  status.value = null

  try {
    // This will show the spinner for the entire sequence
    const results = await withGlobalLoading(async () => {
      // First operation
      const result1 = await simulateOperation('Primera', 1500)
      console.log(result1)

      // Second operation
      const result2 = await simulateOperation('Segunda', 2000)
      console.log(result2)

      return [result1, result2]
    }, 'Ejecutando operaciones secuenciales...')

    status.value = {
      message: `Completado: ${results.join(' | ')}`,
      type: 'success',
    }
  } catch (error) {
    status.value = {
      message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
      type: 'error',
    }
  }
}

// Example 2: Parallel operations with global loading
const loadDataInParallel = async () => {
  status.value = null

  try {
    const results = await withGlobalLoading(async () => {
      // Run all operations in parallel with Promise.all
      const operations = [
        simulateOperation('Paralelo 1', 3000),
        simulateOperation('Paralelo 2', 1500),
        simulateOperation('Paralelo 3', 2500),
      ]

      return Promise.all(operations)
    }, 'Ejecutando operaciones en paralelo...')

    status.value = {
      message: `Completado: ${results.join(' | ')}`,
      type: 'success',
    }
  } catch (error) {
    status.value = {
      message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
      type: 'error',
    }
  }
}

// Example 3: Custom loading control
const loadWithCustomControl = async () => {
  status.value = null

  // Start with custom ID for manual tracking
  const operationId = 'demo-custom-loading'

  try {
    // Start loading manually with custom message
    startLoading('Iniciando operación personalizada...', operationId)

    // First step
    await simulateOperation('Paso 1', 1500)

    // Update loading message for next step
    stopLoading(operationId)
    startLoading('Ejecutando paso intermedio...', operationId)

    // Middle step
    await simulateOperation('Paso 2', 1000)

    // Update loading message for final step
    stopLoading(operationId)
    startLoading('Completando operación...', operationId)

    // Final step
    const finalResult = await simulateOperation('Paso 3', 2000)

    status.value = {
      message: `Operación personalizada completada: ${finalResult}`,
      type: 'success',
    }
  } catch (error) {
    status.value = {
      message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
      type: 'error',
    }
  } finally {
    // Always stop loading when finished or on error
    stopLoading(operationId)
  }
}
</script>

<style scoped>
/* Component styles if needed */
</style>
