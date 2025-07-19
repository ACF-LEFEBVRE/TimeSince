<template>
  <div class="auth-form-container">
    <div class="clock-logo mb-4">
      <ClockLogo :size="56" />
    </div>
    <p class="text-center mb-4">
      {{ isLogin ? text.noAccount : text.alreadyAccount }}
      <a @click="switchTab" class="auth-text-link">
        {{ isLogin ? text.signUp : text.login }}
      </a>
    </p>
    <VForm ref="formRef" @submit.prevent="onSubmit">
      <CustomTextField
        v-model="email"
        :label="text.email"
        type="email"
        :disabled="loading"
        :rules="[rules.required, rules.email]"
      />
      <CustomTextField
        v-model="password"
        :label="text.password"
        :type="showPassword ? 'text' : 'password'"
        :hint="!isLogin ? text.minChars : undefined"
        :disabled="loading"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        :rules="[rules.required, rules.password]"
        :onAppendInnerClick="() => (showPassword = !showPassword)"
      >
        <template #label-append>
          <div v-if="isLogin">
            <a class="forgot-password-link">{{ text.forgotPassword }}</a>
          </div>
        </template>
      </CustomTextField>

      <AuthButton
        :loading="loading"
        :disabled="!isFormValid || !email || !password"
        :text="authBtnText"
      />
    </VForm>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Form as VFormType } from 'vuetify/components'
import { useFormRules } from '@/composables/useFormRules'
import { useI18n } from 'vue-i18n'
import AuthButton from '@/components/form/AuthButton.vue'
import ClockLogo from '@/components/common/ClockLogo.vue'
import CustomTextField from '@/components/form/CustomTextField.vue'

// PROPS
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  isLogin: {
    type: Boolean,
    default: true,
  },
})

// TRANSLATION
const { t } = useI18n()

const text = {
  login: t('auth.login'),
  register: t('auth.register'),
  email: t('auth.email'),
  password: t('auth.password'),
  minChars: t('auth.passwordMinChars'),
  loggingIn: t('auth.loginSuccess'),
  registering: t('auth.registering'),
  noAccount: t('auth.noAccount'),
  alreadyAccount: t('auth.alreadyAccount'),
  signUp: t('auth.register'),
  forgotPassword: t('auth.forgotPassword'),
}

// DATA
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const formRef = ref<InstanceType<typeof VFormType> | null>(null)
const isFormValid = ref(false)

// COMPUTED
const authBtnText = computed(() => (props.isLogin ? text.login : text.register))

// COMPOSABLES
const rules = useFormRules()

// EMITS
const emit = defineEmits(['submit', 'switchTab'])

// WATCHERS
watch(
  () => formRef.value?.errors,
  errors => {
    if (!errors.length) {
      isFormValid.value = true
    }
  }
)

// METHODS
const onSubmit = () => {
  emit('submit', { email: email.value, password: password.value })
}

function switchTab() {
  emit('switchTab')
}
</script>

<style lang="scss" scoped>
.auth-form-container {
  font-family: $text-font;
  font-size: 16px;
  color: $text-color;

  .clock-logo {
    @include flex;
  }

  .auth-text-link {
    color: $main-1000;
    margin-left: $spacing-xxxs;
    cursor: pointer;
  }

  .forgot-password-link {
    font-size: $font-size-xxs;
    color: $main-color;
    margin-left: $spacing-xxxs;
    cursor: pointer;
  }
}
</style>
