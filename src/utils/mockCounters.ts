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

// Categorías para los contadores
const categories = [
  'Personal',
  'Trabajo',
  'Salud',
  'Educación',
  'Viajes',
  'Finanzas',
  'Hobbies',
  'Familia',
  'Tecnología',
  'Hábitos'
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

// Descripciones aleatorias para los contadores
const descriptions = [
  'Un momento importante que marcó un antes y un después',
  'No olvidar esta fecha clave para mi desarrollo personal',
  'Un acontecimiento que cambió mi perspectiva sobre las cosas',
  'Un recuerdo muy especial que quiero mantener presente',
  'Una fecha importante para medir mi progreso',
  'Fue un día que empezó como cualquier otro pero terminó siendo especial',
  'Momento decisivo en mi vida que quiero recordar siempre',
  'Un punto de inflexión en mi trayectoria personal',
  'Una experiencia que me hizo crecer como persona',
  'Quiero ver cuánto tiempo ha pasado desde este momento importante',
  'Una fecha para no olvidar y celebrar cada año',
  'Un evento que me trae buenos recuerdos',
  'Un objetivo alcanzado después de mucho esfuerzo',
  'Una decisión importante que tomé y de la que no me arrepiento',
  'Un evento que me ayuda a mantenerme motivado/a'
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
    category: categories[Math.floor(Math.random() * categories.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)]
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
