<template>
  <VBtn
    color="secondary"
    @click="loadMockData"
    prepend-icon="mdi-database-import"
    variant="outlined"
  >
    Cargar Mock Data
  </VBtn>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { loadMockCountersForUser } from '@/utils/mockData'

const emit = defineEmits(['mock-loaded'])
const { userId } = useAuth()

const loadMockData = async () => {
  if (!userId.value) return

  const confirmed = confirm(
    '¿Estás seguro de que quieres cargar 20 contadores aleatorios? Esta acción no se puede deshacer.'
  )
  if (!confirmed) return

  try {
    await loadMockCountersForUser(userId.value)
    emit('mock-loaded')
  } catch (error) {
    console.error('Error al cargar los datos mock:', error)
  }
}
</script>
