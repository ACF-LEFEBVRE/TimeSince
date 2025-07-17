<template>
  <div>
    <h1 class="text-h4 text-center font-weight-bold mb-4">{{ text.register }}</h1>
    <p class="text-center mb-6">{{ text.alreadyAccount }} <a @click="$emit('switchTab')" class="text-primary font-weight-medium">{{ text.login }}</a></p>
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
        class="mb-6"
        :hint="text.minChars"
        :disabled="loading"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      />
      <VBtn 
        type="submit" 
        color="success" 
        block 
        size="large" 
        :loading="loading"
        rounded="lg"
      >
        {{ loading ? text.registering : text.register }}
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
  email: t('auth.email'),
  password: t('auth.password'),
  minChars: t('auth.passwordMinChars'),
  registering: t('auth.registering'),
  register: t('auth.register'),
  login: t('auth.login'),
  alreadyAccount: t('auth.alreadyAccount'),
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
