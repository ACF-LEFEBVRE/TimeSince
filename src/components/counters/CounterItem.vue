<template>
  <VExpansionPanel :value="counter.id">
    <!-- Panel header - Visible siempre -->
    <VExpansionPanelTitle>
      <div class="d-flex align-center w-100">
        <!-- Icono y color del contador -->
        <VIcon :color="counter.color || 'primary'" size="large" class="mr-3">
          {{ counter.icon || 'mdi-calendar-clock' }}
        </VIcon>

        <!-- Información principal -->
        <div class="flex-grow-1">
          <!-- Categoría como badge pequeño -->
          <VChip
            v-if="counter.category"
            size="x-small"
            class="mb-1 category-chip"
            :color="counter.color || 'primary'"
            variant="outlined"
          >
            {{ counter.category }}
          </VChip>

          <!-- Nombre del contador -->
          <div class="text-h6">{{ counter.name }}</div>
        </div>

        <!-- Días transcurridos - Siempre visible -->
        <VChip :color="counter.color || 'primary'" size="large" class="days-chip ml-auto">
          {{ calculateDays(counter.startDate) }}
        </VChip>
      </div>
    </VExpansionPanelTitle>

    <!-- Panel de contenido - Visible al expandir -->
    <VExpansionPanelText>
      <div class="pa-2">
        <!-- Fecha de inicio -->
        <div class="text-subtitle-2 mb-2">
          <VIcon size="small" class="mr-1">mdi-calendar</VIcon>
          Iniciado el {{ formatDate(counter.startDate) }}
          <!-- Acciones -->
          <div v-if="!hideActions" class="d-flex justify-end">
            <VBtn
              icon
              variant="text"
              :color="counter.favorite ? 'amber-darken-2' : 'grey'"
              @click.stop="$emit('toggle-favorite', counter)"
              class="mr-2"
            >
              <VIcon>{{ counter.favorite ? 'mdi-star' : 'mdi-star-outline' }}</VIcon>
              <VTooltip activator="parent" location="top">
                {{ counter.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </VTooltip>
            </VBtn>
            <VBtn
              icon
              variant="text"
              color="primary"
              @click.stop="handleEdit"
              class="mr-2"
            >
              <VIcon>mdi-pencil</VIcon>
              <VTooltip activator="parent" location="top">Editar contador</VTooltip>
            </VBtn>
            <VBtn icon variant="text" color="error" @click.stop="handleDelete">
              <VIcon>mdi-delete</VIcon>
              <VTooltip activator="parent" location="top">Eliminar contador</VTooltip>
            </VBtn>
          </div>
        </div>

        <!-- Descripción -->
        <div v-if="counter.description" class="description mb-4">
          <p>{{ counter.description }}</p>
        </div>
      </div>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<script setup lang="ts">
import type { Counter } from '@/components/counters/types/counters'
import { useDateCalculation } from '@/composables/useDateCalculation'

// PROPS
const props = defineProps({
  counter: {
    type: Object as () => Counter,
    required: true,
  },
  hideActions: {
    type: Boolean,
    default: false,
  },
})

// EMITS
const emit = defineEmits(['toggle-favorite', 'delete', 'edit'])

// COMPOSABLES
const { formatDate, calculateDays } = useDateCalculation()

// METHODS
const handleDelete = (event: Event) => {
  event.stopPropagation()
  if (confirm('¿Estás seguro de que quieres eliminar este contador?')) {
    emit('delete', props.counter.id)
  }
}

const handleEdit = (event: Event) => {
  event.stopPropagation()
  emit('edit', props.counter)
}
</script>

<style scoped>
.days-chip {
  font-weight: bold;
  min-width: 100px;
  max-width: 180px;
  justify-content: center;
  text-align: center;
  line-height: 1.3;
  white-space: normal;
  height: auto;
  padding: 8px 12px;
  font-size: 0.875rem;
}

.category-chip {
  font-size: 0.7rem;
  height: 20px;
  font-weight: 500;
}

.description {
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}
</style>
