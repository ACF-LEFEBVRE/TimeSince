<template>
  <div>
    <h1 class="text-h4 text-center font-weight-bold mb-4">{{ text.login }}</h1>
    <p class="text-center mb-6">{{ text.noAccount }} <a @click="$emit('switchTab')" class="text-primary font-weight-medium">{{ text.signUp }}</a></p>
    <VForm @submit.prevent="onSubmit">
      <VTextField
        v-model="email"
        :label="text.email"
        type="email"
        required
        variant="outlined"
        class="mb-4"
        :disabled="loading"
      />
      <VTextField
        v-model="password"
        :label="text.password"
        :type="showPassword ? 'text' : 'password'"
        required
        variant="outlined"
        class="mb-4"
        :disabled="loading"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      />
      <div class="d-flex justify-end align-center mb-6">
        <a class="text-primary text-decoration-none text-caption">{{ text.forgotPassword }}</a>
      </div>
      <VBtn 
        type="submit" 
        color="primary" 
        block 
        size="large" 
        :loading="loading"
        rounded="lg"
      >
        {{ loading ? text.loggingIn : text.login }}
      </VBtn>
    </VForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  login: t('auth.login'),
  email: t('auth.email'),
  password: t('auth.password'),
  loading: t('common.loading'),
  enter: t('auth.login'),
  loggingIn: t('auth.loginSuccess'),
  noAccount: t('auth.noAccount'),
  signUp: t('auth.register'),
  forgotPassword: t('auth.forgotPassword'),
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
const showPassword = ref(false)

// EMITS
const emit = defineEmits(['submit', 'switchTab'])

// METHODS
const onSubmit = () => {
  emit('submit', { email: email.value, password: password.value })
}
</script>
