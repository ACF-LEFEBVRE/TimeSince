import type { Counter } from '@/components/counters/types/counters'

// Colores predefinidos para los contadores
const colors = [
  '#F44336', // Rojo
  '#E91E63', // Rosa
  '#9C27B0', // Púrpura
  '#673AB7', // Púrpura oscuro
  '#3F51B5', // Índigo
  '#2196F3', // Azul
  '#03A9F4', // Azul claro
  '#00BCD4', // Cian
  '#009688', // Verde azulado
  '#4CAF50', // Verde
  '#8BC34A', // Verde claro
  '#CDDC39', // Lima
  '#FFEB3B', // Amarillo
  '#FFC107', // Ámbar
  '#FF9800', // Naranja
  '#FF5722', // Naranja oscuro
]

// Iconos relacionados con tiempo y eventos
const icons = [
  'mdi-calendar',
  'mdi-calendar-check',
  'mdi-calendar-clock',
  'mdi-calendar-heart',
  'mdi-calendar-star',
  'mdi-alarm',
  'mdi-alarm-plus',
  'mdi-av-timer',
  'mdi-clock',
  'mdi-clock-outline',
  'mdi-trophy',
  'mdi-medal',
  'mdi-heart',
  'mdi-cake',
  'mdi-gift',
  'mdi-school',
  'mdi-briefcase',
  'mdi-home',
  'mdi-baby-carriage',
  'mdi-nature',
  'mdi-beer',
  'mdi-run',
  'mdi-walk',
  'mdi-bike',
]

// Nombres de eventos para los contadores
const eventNames = [
  'Graduación',
  'Inicio del nuevo trabajo',
  'Mudanza',
  'Última visita al dentista',
  'Compra de la casa',
  'Viaje a París',
  'Inicio del proyecto personal',
  'Comienzo de la dieta',
  'Primer día en el gimnasio',
  'Adopción de la mascota',
  'Aniversario',
  'Cumpleaños de Ana',
  'Compra del coche',
  'Primera cita',
  'Inicio del blog',
  'Último examen médico',
  'Primer día sin fumar',
  'Último concierto',
  'Inicio del curso de idiomas',
  'Renovación del apartamento',
  'Primer día en la universidad',
  'Última maratón',
  'Último día de vacaciones',
  'Compra del móvil',
  'Primera clase de yoga',
  'Última visita a la familia',
  'Instalación de la app',
  'Cambio de look',
]

// Función para generar una fecha aleatoria en los últimos 2 años
const randomDate = (): number => {
  // Entre ahora y hace 2 años
  const now = Date.now()
  const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000
  return Math.floor(Math.random() * (now - twoYearsAgo) + twoYearsAgo)
}

// Función para generar un ID aleatorio
const randomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Función para generar un contador aleatorio
const generateRandomCounter = (): Counter => {
  return {
    id: randomId(),
    name: eventNames[Math.floor(Math.random() * eventNames.length)],
    startDate: randomDate(),
    color: colors[Math.floor(Math.random() * colors.length)],
    icon: icons[Math.floor(Math.random() * icons.length)],
    favorite: Math.random() > 0.7, // 30% de probabilidad de ser favorito
  }
}

// Función para generar un array de contadores aleatorios
export const generateMockCounters = (count: number = 20): Counter[] => {
  const counters: Counter[] = []
  for (let i = 0; i < count; i++) {
    counters.push(generateRandomCounter())
  }
  return counters
}

// Exportar directamente un array con 20 contadores aleatorios
export const mockCounters: Counter[] = generateMockCounters(20)
