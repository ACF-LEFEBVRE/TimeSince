<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard class="mt-5">
          <VCardTitle class="text-h4 mb-2"> ¡Bienvenido a TimeSince! </VCardTitle>
          <VCardText>
            <p class="text-h6 mb-3" v-if="user">Hola, {{ user.email }}</p>
            <p>
              Aquí podrás crear y gestionar contadores para recordar cuánto tiempo ha pasado desde
              momentos importantes.
            </p>
          </VCardText>
          <VCardActions>
            <VBtn color="primary" variant="elevated" to="/counters"> Ver mis contadores </VBtn>
            <VBtn color="secondary" variant="outlined" @click="logout"> Cerrar sesión </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>

    <VRow class="mt-5" v-if="user && daysRegistered !== null">
      <VCol cols="12" md="6">
        <VCard class="registration-counter">
          <VCardTitle class="text-h5"> Días como usuario de TimeSince </VCardTitle>
          <div class="counter-display">
            <div class="counter-value">{{ daysRegistered }}</div>
            <div class="counter-label">días</div>
          </div>
          <VCardText> Te registraste el {{ registrationDate }} </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Contadores favoritos -->
    <VRow class="mt-5">
      <VCol cols="12">
        <VCard v-if="favoriteCounters.length > 0">
          <VCardTitle class="d-flex align-center">
            <h2 class="text-h5">
              <VIcon color="amber-darken-2" class="mr-2">mdi-star</VIcon>
              Mis Favoritos
            </h2>
          </VCardTitle>

          <VDivider />

          <VList>
            <VListItem v-for="counter in favoriteCounters" :key="counter.id">
              <template v-slot:prepend>
                <VIcon :color="counter.color || 'primary'" size="large" class="mr-3">
                  {{ counter.icon || 'mdi-calendar-clock' }}
                </VIcon>
              </template>

              <VListItemTitle class="text-h6">
                {{ counter.name }}
              </VListItemTitle>

              <VListItemSubtitle>
                {{ formatCounterDate(counter.startDate) }}
              </VListItemSubtitle>

              <template v-slot:append>
                <VChip color="primary" size="large" class="days-chip">
                  {{ calculateDays(counter.startDate) }}
                </VChip>
              </template>
            </VListItem>
          </VList>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
const db = getFirestore()
const user = ref<any>(null)
const daysRegistered = ref<number | null>(null)
const registrationDate = ref<string>('')
const favoriteCounters = ref<any[]>([])
const userId = ref<string | null>(null)

// Calcular días desde registro
const calculateDaysSinceRegistration = (creationTime: number) => {
  const creationDate = new Date(creationTime)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - creationDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Formatear fecha para mostrar
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Alias para formatDate para evitar confusión
const formatCounterDate = formatDate

// Calcular días para contadores favoritos - Igual que en CountersView
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

// Cargar contadores favoritos
const loadFavoriteCounters = async () => {
  if (!userId.value) return

  try {
    const countersRef = collection(db, 'counters')
    const q = query(countersRef, where('userId', '==', userId.value), where('favorite', '==', true))
    const querySnapshot = await getDocs(q)

    favoriteCounters.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error al cargar contadores favoritos:', error)
  }
}

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, currentUser => {
    if (currentUser) {
      user.value = currentUser
      userId.value = currentUser.uid

      // Obtener metadata de creación de cuenta
      if (currentUser.metadata && currentUser.metadata.creationTime) {
        const creationTime = Date.parse(currentUser.metadata.creationTime)
        daysRegistered.value = calculateDaysSinceRegistration(creationTime)
        registrationDate.value = formatDate(creationTime)
      }

      // Cargar contadores favoritos
      loadFavoriteCounters()
    } else {
      router.push('/login')
    }
  })
})

const logout = async () => {
  try {
    const auth = getAuth()
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<style scoped>
.registration-counter {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(to bottom right, #e6f7ff, #ffffff);
  border-left: 4px solid #1976d2;
}

.counter-display {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counter-value {
  font-size: 3.5rem;
  font-weight: 700;
  color: #1976d2;
}

.counter-label {
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.5rem;
  color: #666;
}

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
