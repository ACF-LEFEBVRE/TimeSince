// Import JSON locale files
import es from './es.json'
import en from './en.json'

export const messages = {
  es,
  en,
}

export const supportedLocales = [
  {
    code: 'es',
    name: 'Español',
    flag: 'es',
  },
  {
    code: 'en',
    name: 'English',
    flag: 'gb',
  },
]

export const defaultLocale = 'es'
