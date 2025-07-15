<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard class="mb-5">
          <VCardTitle class="d-flex align-center">
            <h2 class="text-h5">Mis Contadores</h2>
            <VSpacer />
            <VBtn color="primary" @click="showNewCounterDialog = true" prepend-icon="mdi-plus">
              Nuevo contador
            </VBtn>
          </VCardTitle>

          <VDivider />

          <VCardText v-if="!counters.length" class="text-center pa-5">
            <p>No tienes contadores todavía.</p>
            <p>Crea tu primer contador para empezar a hacer seguimiento.</p>
          </VCardText>

          <VList v-else>
            <VListItem v-for="counter in counters" :key="counter.id">
              <template v-slot:prepend>
                <VIcon :color="counter.color || 'primary'" size="large" class="mr-3">{{
                  counter.icon || 'mdi-calendar-clock'
                }}</VIcon>
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
                <div class="d-flex align-center">
                  <VBtn
                    icon
                    variant="text"
                    :color="counter.favorite ? 'amber-darken-2' : 'grey'"
                    @click="toggleFavorite(counter)"
                    class="ml-3"
                  >
                    <VIcon>{{ counter.favorite ? 'mdi-star' : 'mdi-star-outline' }}</VIcon>
                  </VBtn>
                  <VBtn
                    icon
                    variant="text"
                    color="error"
                    @click="deleteCounter(counter.id)"
                    class="ml-1"
                  >
                    <VIcon>mdi-delete</VIcon>
                  </VBtn>
                </div>
              </template>
            </VListItem>
          </VList>
        </VCard>
      </VCol>
    </VRow>

    <!-- Diálogo para crear nuevo contador -->
    <VDialog v-model="showNewCounterDialog" max-width="500px">
      <VCard>
        <VCardTitle class="text-h5">Nuevo Contador</VCardTitle>
        <VCardText>
          <VForm @submit.prevent="createCounter" ref="form">
            <VTextField
              v-model="newCounter.name"
              label="Nombre del contador"
              required
              :rules="[v => !!v || 'El nombre es obligatorio']"
            />

            <VRow>
              <VCol cols="12" sm="6">
                <VTextField
                  v-model="newCounter.date"
                  label="Fecha de inicio"
                  type="date"
                  required
                  :rules="[v => !!v || 'La fecha es obligatoria']"
                />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect
                  v-model="newCounter.color"
                  label="Color"
                  :items="colorOptions"
                  item-title="text"
                  item-value="value"
                />
              </VCol>
            </VRow>

            <VSelect
              v-model="newCounter.icon"
              label="Icono"
              :items="iconOptions"
              item-title="text"
              item-value="value"
            />
          </VForm>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn color="grey-darken-1" text @click="showNewCounterDialog = false"> Cancelar </VBtn>
          <VBtn color="primary" @click="createCounter" :disabled="!isFormValid"> Crear </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const db = getFirestore()
const counters = ref<any[]>([])
const showNewCounterDialog = ref(false)
const form = ref<any>(null)
const userId = ref<string | null>(null)

// Nuevo contador
const newCounter = ref({
  name: '',
  date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  color: 'primary',
  icon: 'mdi-calendar-clock',
  favorite: false,
})

// Opciones
const colorOptions = [
  { text: 'Azul', value: 'primary' },
  { text: 'Verde', value: 'success' },
  { text: 'Rojo', value: 'error' },
  { text: 'Naranja', value: 'warning' },
  { text: 'Morado', value: 'purple' },
]

const iconOptions = [
  { text: 'Calendario', value: 'mdi-calendar-clock' },
  { text: 'Estrella', value: 'mdi-star' },
  { text: 'Corazón', value: 'mdi-heart' },
  { text: 'Trofeo', value: 'mdi-trophy' },
  { text: 'Regalo', value: 'mdi-gift' },
  { text: 'Deporte', value: 'mdi-run' },
]

// Validación
const isFormValid = computed(() => {
  return newCounter.value.name && newCounter.value.date
})

// Cargar datos del usuario
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, user => {
    if (user) {
      userId.value = user.uid
      loadCounters()
    } else {
      router.push('/login')
    }
  })
})

// Cargar contadores
const loadCounters = async () => {
  if (!userId.value) return

  try {
    const countersRef = collection(db, 'counters')
    const q = query(countersRef, where('userId', '==', userId.value))
    const querySnapshot = await getDocs(q)

    counters.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error al cargar contadores:', error)
  }
}

// Crear contador
const createCounter = async () => {
  if (!isFormValid.value || !userId.value) return

  try {
    const startDate = new Date(newCounter.value.date).getTime()

    await addDoc(collection(db, 'counters'), {
      name: newCounter.value.name,
      startDate: startDate,
      color: newCounter.value.color,
      icon: newCounter.value.icon,
      favorite: newCounter.value.favorite,
      userId: userId.value,
      createdAt: Date.now(),
    })

    // Resetear formulario y cerrar diálogo
    newCounter.value = {
      name: '',
      date: new Date().toISOString().split('T')[0],
      color: 'primary',
      icon: 'mdi-calendar-clock',
      favorite: false,
    }

    showNewCounterDialog.value = false
    loadCounters()
  } catch (error) {
    console.error('Error al crear contador:', error)
  }
}

// Marcar/desmarcar como favorito
const toggleFavorite = async (counter: any) => {
  try {
    // Actualizar en Firestore
    const counterRef = doc(db, 'counters', counter.id)
    await updateDoc(counterRef, {
      favorite: !counter.favorite,
    })

    // Actualizar en la vista local
    counter.favorite = !counter.favorite
  } catch (error) {
    console.error('Error al actualizar favorito:', error)
  }
}

// Eliminar contador
const deleteCounter = async (counterId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este contador?')) return

  try {
    await deleteDoc(doc(db, 'counters', counterId))
    loadCounters()
  } catch (error) {
    console.error('Error al eliminar contador:', error)
  }
}

// Formatear fecha
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Calcular días
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
