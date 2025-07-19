import { useI18n } from 'vue-i18n'

interface FormRulesComposable {
  email: (value: string) => string | boolean
  password: (value: string) => string | boolean
  required: (value: string) => string | boolean
}

export function useFormRules(): FormRulesComposable {
  // TRANSLATIONS
  const { t } = useI18n()

  const text = {
    required: t('form.required'),
    passwordMinChars: t('form.passwordMinChars'),
    invalidEmail: t('form.invalidEmail'),
  }

  return {
    required: (value: string) => !!value || text.required,
    password: (value: string) => value.length >= 6 || text.passwordMinChars,
    email: (value: string) => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || text.invalidEmail
    },
  }
}
