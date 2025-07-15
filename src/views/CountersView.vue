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
                <VBtn
                  icon
                  variant="text"
                  color="error"
                  @click="deleteCounter(counter.id)"
                  class="ml-3"
                >
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
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
import { ref, computed, onMounted } from 'vue';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const db = getFirestore();
const counters = ref<any[]>([]);
const showNewCounterDialog = ref(false);
const form = ref<any>(null);
const userId = ref<string | null>(null);

// Nuevo contador
const newCounter = ref({
  name: '',
  date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  color: 'primary',
  icon: 'mdi-calendar-clock',
});

// Opciones
const colorOptions = [
  { text: 'Azul', value: 'primary' },
  { text: 'Verde', value: 'success' },
  { text: 'Rojo', value: 'error' },
  { text: 'Naranja', value: 'warning' },
  { text: 'Morado', value: 'purple' },
];

const iconOptions = [
  { text: 'Calendario', value: 'mdi-calendar-clock' },
  { text: 'Estrella', value: 'mdi-star' },
  { text: 'Corazón', value: 'mdi-heart' },
  { text: 'Trofeo', value: 'mdi-trophy' },
  { text: 'Regalo', value: 'mdi-gift' },
  { text: 'Deporte', value: 'mdi-run' },
];

// Validación
const isFormValid = computed(() => {
  return newCounter.value.name && newCounter.value.date;
});

// Cargar datos del usuario
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, user => {
    if (user) {
      userId.value = user.uid;
      loadCounters();
    } else {
      router.push('/login');
    }
  });
});

// Cargar contadores
const loadCounters = async () => {
  if (!userId.value) return;

  try {
    const countersRef = collection(db, 'counters');
    const q = query(countersRef, where('userId', '==', userId.value));
    const querySnapshot = await getDocs(q);

    counters.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error al cargar contadores:', error);
  }
};

// Crear contador
const createCounter = async () => {
  if (!isFormValid.value || !userId.value) return;

  try {
    const startDate = new Date(newCounter.value.date).getTime();

    await addDoc(collection(db, 'counters'), {
      name: newCounter.value.name,
      startDate: startDate,
      color: newCounter.value.color,
      icon: newCounter.value.icon,
      userId: userId.value,
      createdAt: Date.now(),
    });

    // Resetear formulario y cerrar diálogo
    newCounter.value = {
      name: '',
      date: new Date().toISOString().split('T')[0],
      color: 'primary',
      icon: 'mdi-calendar-clock',
    };

    showNewCounterDialog.value = false;
    loadCounters();
  } catch (error) {
    console.error('Error al crear contador:', error);
  }
};

// Eliminar contador
const deleteCounter = async (counterId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este contador?')) return;

  try {
    await deleteDoc(doc(db, 'counters', counterId));
    loadCounters();
  } catch (error) {
    console.error('Error al eliminar contador:', error);
  }
};

// Formatear fecha
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Calcular días
const calculateDays = (timestamp: number) => {
  const startDate = new Date(timestamp);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Si es más de un año, mostrar años y días
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    return `${years} ${years === 1 ? 'año' : 'años'}, ${remainingDays} ${
      remainingDays === 1 ? 'día' : 'días'
    }`;
  }

  return `${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
};
</script>

<style scoped>
.days-chip {
  font-weight: bold;
  min-width: 120px;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
  white-space: normal;
  height: auto;
  padding: 8px 12px;
}
</style>
