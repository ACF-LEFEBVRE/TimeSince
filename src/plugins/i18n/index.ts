import { createI18n } from 'vue-i18n'
import { messages, defaultLocale } from '@/locales'

// Tipo para los idiomas soportados
type SupportedLocale = keyof typeof messages

// Detectar el idioma del navegador
const getBrowserLocale = (): SupportedLocale => {
  const browserLocale = navigator.language.split('-')[0] as SupportedLocale
  // Comprobar si el idioma del navegador está soportado
  return messages[browserLocale] ? browserLocale : defaultLocale as SupportedLocale
}

// Obtener el idioma guardado en localStorage o usar el del navegador
const getSavedLocale = (): SupportedLocale => {
  const savedLocale = localStorage.getItem('locale') as SupportedLocale
  return savedLocale && messages[savedLocale] ? savedLocale : getBrowserLocale()
}

const currentLocale = getSavedLocale()

const i18n = createI18n({
  legacy: false, // Usar la API de Composition para Vue 3
  globalInjection: true, // Inyectar globalmente las propiedades $t y $tc
  locale: currentLocale,
  fallbackLocale: defaultLocale as SupportedLocale,
  messages,
})

// Función para cambiar de idioma
export const setLocale = (locale: SupportedLocale) => {
  if (messages[locale]) {
    localStorage.setItem('locale', locale)
    i18n.global.locale.value = locale
  }
}

export default i18n
