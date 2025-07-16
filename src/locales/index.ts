import es from './es'
import en from './en'

export const messages = {
  es,
  en,
}

export const supportedLocales = [
  {
    code: 'es',
    name: 'Español',
    flag: 'es', // Código ISO del país para la bandera
  },
  {
    code: 'en',
    name: 'English',
    flag: 'gb', // Usamos GB (Gran Bretaña) para inglés
  },
]

export const defaultLocale = 'es'
