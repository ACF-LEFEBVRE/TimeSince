<template>
  <VCard>
    <VCardTitle class="d-flex align-center">
      <h2 class="text-h5">
        <VIcon color="amber-darken-2" class="mr-2">mdi-star</VIcon>
        Mis Favoritos
      </h2>
    </VCardTitle>

    <VDivider />

    <VProgressLinear v-if="props.loading" indeterminate color="primary"></VProgressLinear>

    <div v-else>
      <VList v-if="props.counters.length > 0">
        <VListItem v-for="counter in props.counters" :key="counter.id">
          <template v-slot:prepend>
            <VIcon :color="counter.color || 'primary'" size="large" class="mr-3">
              {{ counter.icon || 'mdi-calendar-clock' }}
            </VIcon>
          </template>

          <VListItemTitle class="text-h6">
            {{ counter.name }}
          </VListItemTitle>

          <VListItemSubtitle>
            {{ formatDate(counter.startDate) }}
          </VListItemSubtitle>

          <template v-slot:append>
            <VChip color="primary" size="large" class="days-chip">
              {{ calculateDays(counter.startDate) }}
            </VChip>
          </template>
        </VListItem>
      </VList>

      <VCardText v-else class="text-center pa-5">
        No tienes contadores favoritos. Marca algunos contadores como favoritos para verlos aquí.
      </VCardText>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Counter } from '@/components/counters/types/counters'

// PROPS
const props = defineProps({
  counters: {
    type: Array as () => Counter[],
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// METHODS
// Formatear fecha para mostrar
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Calcular días para contadores favoritos
const calculateDays = (timestamp: number) => {
  const start = new Date(timestamp)
  const today = new Date()

  // Normalizar las fechas para quitar las horas, minutos, segundos y milisegundos
  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  // Asegurar que startDate no sea posterior a today
  if (start > today) {
    return '0 días'
  }

  // Clonar la fecha de inicio para no modificar la original
  const startYear = start.getFullYear()
  const startMonth = start.getMonth()
  const startDay = start.getDate()

  // Valores actuales
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentDay = today.getDate()

  // Calcular diferencia inicial
  let years = currentYear - startYear
  let months = currentMonth - startMonth
  let days = currentDay - startDay

  // Ajustar si los días son negativos
  if (days < 0) {
    // Obtener el último día del mes anterior
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate()
    days += lastDayOfPrevMonth
    months -= 1
  }

  // Ajustar si los meses son negativos
  if (months < 0) {
    months += 12
    years -= 1
  }

  // Si la fecha original es mayor que la fecha después de los cálculos, ajustar
  const checkDate = new Date(startYear + years, startMonth + months, startDay)
  if (checkDate > today) {
    if (months > 0) {
      months -= 1
      // Calcular días desde el día de inicio hasta el final del mes
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
      days = daysInMonth - startDay + currentDay
    } else {
      years -= 1
      months = 11
      // Calcular días desde el día de inicio hasta el final del mes
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
      days = daysInMonth - startDay + currentDay
    }
  }

  // Asegurar que todas las cifras sean positivas
  years = Math.max(0, years)
  months = Math.max(0, months)
  days = Math.max(0, days)

  // Si no hay diferencia, devolver 0 días
  if (years === 0 && months === 0 && days === 0) {
    return '0 días'
  }

  // Construir el string de resultado
  let result = ''

  if (years > 0) {
    result += `${years} ${years === 1 ? 'año' : 'años'}`
  }

  if (months > 0) {
    if (result) result += ', '
    result += `${months} ${months === 1 ? 'mes' : 'meses'}`
  }

  if (days > 0 || (years === 0 && months === 0)) {
    if (result) result += ', '
    result += `${days} ${days === 1 ? 'día' : 'días'}`
  }

  return result
}
</script>

<style scoped>
.days-chip {
  font-weight: bold;
  min-width: 120px;
  max-width: 200px;
  justify-content: center;
  text-align: center;
  line-height: 1.3;
  white-space: normal;
  height: auto;
  padding: 8px 12px;
  font-size: 0.875rem;
}
</style>
