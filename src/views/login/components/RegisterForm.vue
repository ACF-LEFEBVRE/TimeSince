<template>
  <VForm @submit.prevent="onSubmit">
    <VTextField
      v-model="email"
      :label="text.email"
      type="email"
      required
      prepend-inner-icon="mdi-email"
      class="mb-4"
      :disabled="loading"
    />
    <VTextField
      v-model="password"
      :label="text.password"
      type="password"
      required
      prepend-inner-icon="mdi-lock"
      class="mb-4"
      :hint="text.minChars"
      :disabled="loading"
    />
    <VBtn type="submit" color="success" block size="large" :loading="loading">
      {{ loading ? text.registering : text.register }}
    </VBtn>
  </VForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  email: t('auth.email'),
  password: t('auth.password'),
  minChars: 'Mínimo 6 caracteres', // Agregamos esta traducción
  registering: 'Registrando...', // Agregamos esta traducción
  register: t('auth.register'),
}

// PROPS
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

// DATA
const email = ref('')
const password = ref('')

// EMITS
const emit = defineEmits(['submit'])

// METHODS
const onSubmit = () => {
  emit('submit', { email: email.value, password: password.value })
}
</script>
