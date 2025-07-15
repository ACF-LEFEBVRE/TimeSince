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
  </VContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref<any>(null)
const daysRegistered = ref<number | null>(null)
const registrationDate = ref<string>('')

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

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, currentUser => {
    if (currentUser) {
      user.value = currentUser

      // Obtener metadata de creación de cuenta
      if (currentUser.metadata && currentUser.metadata.creationTime) {
        const creationTime = Date.parse(currentUser.metadata.creationTime)
        daysRegistered.value = calculateDaysSinceRegistration(creationTime)
        registrationDate.value = formatDate(creationTime)
      }
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
</style>
