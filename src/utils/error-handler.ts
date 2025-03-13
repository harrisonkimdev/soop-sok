import { AuthError, AUTH_ERROR_MESSAGES, FirebaseError } from "./types/error"

export const handleFirebaseError = (error: FirebaseError): AuthError => {
  // Auth 관련 에러 처리
  if (error.code.startsWith("auth/")) {
    return {
      type: "auth",
      message:
        AUTH_ERROR_MESSAGES.auth[
          error.code as keyof typeof AUTH_ERROR_MESSAGES.auth
        ] || AUTH_ERROR_MESSAGES.general,
      originalError: error,
    }
  }

  // Firestore 관련 에러 처리
  if (
    error.code.startsWith("permission-denied") ||
    error.code.startsWith("not-found") ||
    error.code.startsWith("already-exists") ||
    error.code.startsWith("unavailable")
  ) {
    return {
      type: "firestore",
      message:
        AUTH_ERROR_MESSAGES.firestore[
          error.code as keyof typeof AUTH_ERROR_MESSAGES.firestore
        ] || AUTH_ERROR_MESSAGES.general,
      originalError: error,
    }
  }

  // 기타 에러 처리
  return {
    type: "general",
    message: AUTH_ERROR_MESSAGES.general,
    originalError: error,
  }
}

export const logError = (error: AuthError): void => {
  console.error(
    `[${error.type.toUpperCase()}] ${error.message}`,
    error.originalError,
  )
}
