<template>
  <VCard elevation="8" class="pa-6 rounded-xl">
    <VTabs v-model="activeTab" grow>
      <VTab value="login">Iniciar sesión</VTab>
      <VTab value="register">Registrarse</VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-4">
      <VWindowItem value="login">
        <LoginForm @submit="handleLogin" />
      </VWindowItem>

      <VWindowItem value="register">
        <RegisterForm @submit="handleRegister" />
      </VWindowItem>
    </VWindow>

    <AuthAlert :message="error" />
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import '@/plugins/firebase/firebase'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import LoginForm from '@/views/login/components/LoginForm.vue'
import RegisterForm from '@/views/login/components/RegisterForm.vue'
import AuthAlert from '@/views/login/components/AuthAlert.vue'
import type { Credentials } from '@/views/login/types/login'
import { ROUTES } from '@/router/routes'
import { Collection } from '@/plugins/firebase/collections'
import { useFirebaseErrors } from '@/plugins/firebase/composables/useFirebaseErrors.ts'

// DATA
const activeTab = ref('login')
const error = ref('')

// COMPOSABLES
const router = useRouter()
const { getErrorMessage } = useFirebaseErrors()

// METHODS
const handleLogin = async (credentials: Credentials) => {
  error.value = ''
  try {
    const auth = getAuth()
    const db = getFirestore()

    // Iniciar sesión con Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
    const user = userCredential.user

    // Actualizar la fecha de último acceso
    await setDoc(
      doc(db, Collection.USERS, user.uid),
      {
        lastLogin: Date.now(),
      },
      { merge: true }
    )

    router.push(ROUTES.HOME)
  } catch (e: unknown) {
    error.value = getErrorMessage(e)
  }
}

const handleRegister = async (credentials: Credentials) => {
  error.value = ''
  try {
    const auth = getAuth()
    const db = getFirestore()

    // Crear el usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
    const user = userCredential.user

    // Crear el documento del usuario en Firestore
    await setDoc(doc(db, Collection.USERS, user.uid), {
      email: user.email,
      createdAt: Date.now(),
      lastLogin: Date.now(),
    })

    router.push(ROUTES.HOME)
  } catch (e: unknown) {
    error.value = getErrorMessage(e)
  }
}
</script>
