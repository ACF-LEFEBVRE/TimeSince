import type { Ref } from 'vue'
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { useFirebase } from '@/plugins/firebase/composables/useFirebase'
import { Collection } from '@/plugins/firebase/collections'
import { useI18n } from 'vue-i18n'
import type { Counter } from '@/modules/types/counters'

export interface CounterFormData {
  id?: string
  name: string
  date: string | number
  color: string
  icon: string
  favorite: boolean
  category?: string | null
  description?: string | null
  isEditing?: boolean
}

export function useCountersCRUD(userId: Ref<string | null>, allCounters: Ref<Counter[]>) {
  const { db } = useFirebase()
  const { t } = useI18n()

  const text = {
    createError: t('counters.createError'),
    deleteConfirmation: t('counters.deleteConfirmation'),
    deleteError: t('counters.deleteError'),
    updateError: t('counters.updateError'),
  }

  // Create or update counter
  const handleCounterSubmit = async (formData: CounterFormData) => {
    if (!userId.value) return

    try {
      const startDate =
        typeof formData.date === 'string' ? new Date(formData.date).getTime() : formData.date

      // Crear el objeto de datos del contador
      // Create counterData object matching Counter type
      const counterData = {
        name: formData.name,
        startDate: startDate,
        color: formData.color,
        icon: formData.icon,
        favorite: formData.favorite,
        category: formData.category || '',
        description: formData.description || '',
      }

      if (formData.isEditing && formData.id) {
        // Para edición: actualizar optimistamente en la UI primero
        const counterIndex = allCounters.value.findIndex(c => c.id === formData.id)
        if (counterIndex !== -1) {
          // Guardar backup por si acaso
          const counterBackup = { ...allCounters.value[counterIndex] }

          // Actualizar en la UI
          allCounters.value[counterIndex] = {
            ...allCounters.value[counterIndex],
            ...counterData,
          }

          try {
            // Actualizar contador existente en Firestore
            const counterRef = doc(db, Collection.USER_COUNTERS(userId.value), formData.id)
            await updateDoc(counterRef, counterData)
          } catch (error) {
            // Restaurar el backup si falla
            allCounters.value[counterIndex] = counterBackup
            throw error // Propagar el error para el catch externo
          }
        }
      } else {
        // Para nuevo contador: crear en Firestore primero
        const userCountersRef = collection(db, Collection.USER_COUNTERS(userId.value))
        const docRef = await addDoc(userCountersRef, counterData)

        // Luego añadir a la UI con el ID generado
        allCounters.value.push({
          id: docRef.id,
          ...counterData,
        } as Counter)
      }

      return true
    } catch (error) {
      console.error(formData.isEditing ? text.updateError : text.createError, error)
      return false
    }
  }

  // Toggle favorite status
  const toggleFavorite = async (counter: Counter) => {
    if (!userId.value) return false

    // Guardar el estado original en caso de que necesitemos revertir
    const originalValue = counter.favorite

    // Actualizar en la vista local inmediatamente (optimista)
    counter.favorite = !originalValue

    try {
      // Actualizar en Firestore usando la ruta de la subcolección
      const counterRef = doc(db, Collection.USER_COUNTERS(userId.value), counter.id)
      await updateDoc(counterRef, {
        favorite: counter.favorite,
      })
      return true
    } catch (error) {
      // Si hay un error, revertir a su estado original
      counter.favorite = originalValue
      console.error(text.updateError, error)
      return false
    }
  }

  // Delete counter
  const deleteCounter = async (counterId: string) => {
    if (!confirm(text.deleteConfirmation)) return false
    if (!userId.value) return false

    // Encontrar el contador a eliminar para actualización optimista
    const counterIndex = allCounters.value.findIndex(counter => counter.id === counterId)

    if (counterIndex === -1) return false

    // Guardar una copia del contador para restaurar en caso de error
    const counterBackup = { ...allCounters.value[counterIndex] }

    // Eliminar optimistamente de la UI
    allCounters.value.splice(counterIndex, 1)

    try {
      // Eliminar en Firestore
      await deleteDoc(doc(db, Collection.USER_COUNTERS(userId.value), counterId))
      return true
    } catch (error) {
      // Si falla, restaurar el contador a la lista
      allCounters.value.splice(counterIndex, 0, counterBackup)
      console.error(text.deleteError, error)
      return false
    }
  }

  return {
    handleCounterSubmit,
    toggleFavorite,
    deleteCounter,
  }
}
