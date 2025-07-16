export function useDateCalculation() {
  // Formatear fecha para mostrar
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Calcular días
  const calculateDays = (timestamp: number) => {
    const start = new Date(timestamp)
    const today = new Date()

    // Normalizar las fechas para quitar las horas, minutos, segundos y milisegundos
    start.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    // Asegurar que startDate no sea posterior a today
    if (start > today) {
      return '0 días'
    }

    // Clonar la fecha de inicio para no modificar la original
    const startYear = start.getFullYear()
    const startMonth = start.getMonth()
    const startDay = start.getDate()

    // Valores actuales
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()

    // Calcular diferencia inicial
    let years = currentYear - startYear
    let months = currentMonth - startMonth
    let days = currentDay - startDay

    // Ajustar si los días son negativos
    if (days < 0) {
      const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate()
      days += lastDayOfPrevMonth
      months -= 1
    }

    // Ajustar si los meses son negativos
    if (months < 0) {
      months += 12
      years -= 1
    }

    // Si la fecha original es mayor que la fecha después de los cálculos, ajustar
    const checkDate = new Date(startYear + years, startMonth + months, startDay)
    if (checkDate > today) {
      if (months > 0) {
        months -= 1
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
        days = daysInMonth - startDay + currentDay
      } else {
        years -= 1
        months = 11
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
        days = daysInMonth - startDay + currentDay
      }
    }

    // Asegurar que todas las cifras sean positivas
    years = Math.max(0, years)
    months = Math.max(0, months)
    days = Math.max(0, days)

    // Si no hay diferencia, devolver 0 días
    if (years === 0 && months === 0 && days === 0) {
      return '0 días'
    }

    // Construir el string de resultado
    let result = ''

    if (years > 0) {
      result += `${years} ${years === 1 ? 'año' : 'años'}`
    }

    if (months > 0) {
      if (result) result += ', '
      result += `${months} ${months === 1 ? 'mes' : 'meses'}`
    }

    if (days > 0 || (years === 0 && months === 0)) {
      if (result) result += ', '
      result += `${days} ${days === 1 ? 'día' : 'días'}`
    }

    return result
  }

  return {
    formatDate,
    calculateDays
  }
}
