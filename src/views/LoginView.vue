<template>
  <VCard elevation="8" class="pa-6 rounded-xl">
    <VTabs v-model="activeTab" grow>
      <VTab value="login">Iniciar sesión</VTab>
      <VTab value="register">Registrarse</VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-4">
      <VWindowItem value="login">
        <VForm @submit.prevent="login">
          <VTextField
            v-model="email"
            label="Email"
            type="email"
            required
            prepend-inner-icon="mdi-email"
            class="mb-4"
          />
          <VTextField
            v-model="password"
            label="Contraseña"
            type="password"
            required
            prepend-inner-icon="mdi-lock"
            class="mb-4"
          />
          <VBtn type="submit" color="primary" block size="large">Entrar</VBtn>
        </VForm>
      </VWindowItem>

      <VWindowItem value="register">
        <VForm @submit.prevent="register">
          <VTextField
            v-model="email"
            label="Email"
            type="email"
            required
            prepend-inner-icon="mdi-email"
            class="mb-4"
          />
          <VTextField
            v-model="password"
            label="Contraseña"
            type="password"
            required
            prepend-inner-icon="mdi-lock"
            class="mb-4"
            hint="Mínimo 6 caracteres"
          />
          <VBtn type="submit" color="success" block size="large">Registrarse</VBtn>
        </VForm>
      </VWindowItem>
    </VWindow>

    <VAlert v-if="error" type="error" class="mt-4" variant="tonal">
      {{ error }}
    </VAlert>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import '@/plugins/firebase'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('login')
const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  error.value = ''
  try {
    const auth = getAuth()
    const db = getFirestore()

    // Iniciar sesión con Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Actualizar la fecha de último acceso
    await setDoc(
      doc(db, 'users', user.uid),
      {
        lastLogin: Date.now(),
      },
      { merge: true }
    ) // El parámetro merge: true asegura que solo se actualice el campo lastLogin

    router.push('/home')
  } catch (e: any) {
    error.value = e.message
  }
}

const register = async () => {
  error.value = ''
  try {
    const auth = getAuth()
    const db = getFirestore()

    // Crear el usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Crear el documento del usuario en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: Date.now(),
      lastLogin: Date.now(),
    })

    router.push('/home')
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<style scoped></style>
