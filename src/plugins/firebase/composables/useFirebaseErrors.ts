import { FirebaseError } from 'firebase/app'

export function useFirebaseErrors() {
  // Mapeo de códigos de error de Firebase a mensajes personalizados
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'El formato del email no es válido.',
    'auth/user-disabled': 'Esta cuenta de usuario ha sido deshabilitada.',
    'auth/user-not-found': 'No existe una cuenta con este email.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/email-already-in-use': 'Este email ya está registrado.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Inténtalo más tarde.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
    'auth/invalid-credential': 'Email o contraseña inválidos.',
  }

  /**
   * Obtiene un mensaje de error personalizado según el código de Firebase
   */
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof FirebaseError) {
      return errorMessages[error.code] || `Error: ${error.message}`
    }
    return 'Error desconocido'
  }

  return {
    getErrorMessage,
  }
}
