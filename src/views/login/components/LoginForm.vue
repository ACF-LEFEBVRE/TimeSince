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
      :disabled="loading"
    />
    <VBtn type="submit" color="primary" block size="large" :loading="loading">
      {{ loading ? text.loggingIn : text.enter }}
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
  loading: t('common.loading'),
  enter: t('auth.login'),
  loggingIn: t('auth.loginSuccess'),
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
