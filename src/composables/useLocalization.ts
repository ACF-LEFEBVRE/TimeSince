import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale as changeLocale } from '@/plugins/i18n'
import { supportedLocales } from '@/locales'

export function useLocalization() {
  const i18n = useI18n()

  // Devuelve el idioma actual
  const currentLocale = computed(() => i18n.locale.value)

  // Lista de idiomas disponibles
  const availableLocales = computed(() => supportedLocales)

  // Cambia el idioma
  const setLocale = (locale: 'es' | 'en') => {
    changeLocale(locale)
  }

  // Traduce una clave según el idioma actual
  const t = (key: string, params?: Record<string, unknown>) => {
    return i18n.t(key, params || {})
  }

  // Función para formato de fecha según idioma
  const formatDate = (date: Date | number): string => {
    return new Intl.DateTimeFormat(currentLocale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  // Función para formato de número según idioma
  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat(currentLocale.value).format(number)
  }

  return {
    currentLocale,
    availableLocales,
    setLocale,
    t,
    formatDate,
    formatNumber,
  }
}
