// Ejemplo de uso en un componente
import { useGlobalLoading } from '@/composables/useGlobalLoading'

// En una función de un componente:
const { withGlobalLoading } = useGlobalLoading()

// Ejemplo 1: Usar directamente las acciones
const loadData = async () => {
  try {
    const result = await withGlobalLoading(
      async () => {
        // Aquí va tu lógica de carga de datos
        const response = await api.fetchData()
        return response.data
      },
      'Cargando datos...' // Mensaje opcional
    )

    // Hacer algo con el resultado
    processData(result)
  } catch (error) {
    // Manejar el error
    console.error(error)
  }
}

// Ejemplo 2: Usar en el cambio de vista (esto ya está configurado automáticamente)
// El spinner se mostrará automáticamente al navegar entre rutas

// Ejemplo 3: Control manual
const { startLoading, stopLoading } = useGlobalLoading()

const handleProcess = async () => {
  try {
    // Iniciar manualmente
    startLoading('Procesando información...', 'proceso-especial')

    // Hacer operaciones largas
    await operacion1()
    await operacion2()

    // Finalizar manualmente
    stopLoading('proceso-especial')
  } catch (error) {
    stopLoading('proceso-especial') // Asegurarse de detener la carga incluso en caso de error
    console.error(error)
  }
}
