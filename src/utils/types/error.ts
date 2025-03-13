export type FirebaseError = {
  code: string
  message: string
  stack?: string
}

export type AuthError = {
  type: "auth" | "firestore" | "general"
  message: string
  originalError?: FirebaseError
}

export const AUTH_ERROR_MESSAGES = {
  auth: {
    "auth/popup-closed-by-user": "로그인 창이 닫혔습니다. 다시 시도해주세요.",
    "auth/cancelled-popup-request": "로그인이 취소되었습니다.",
    "auth/network-request-failed":
      "네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.",
    "auth/popup-blocked": "팝업이 차단되었습니다. 팝업 차단을 해제해주세요.",
    "auth/user-disabled": "비활성화된 계정입니다.",
    "auth/user-not-found": "존재하지 않는 계정입니다.",
    "auth/wrong-password": "잘못된 비밀번호입니다.",
    "auth/invalid-email": "유효하지 않은 이메일입니다.",
    "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
    "auth/weak-password": "비밀번호가 너무 약합니다.",
    "auth/operation-not-allowed": "이 작업은 현재 허용되지 않습니다.",
    "auth/too-many-requests":
      "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
  },
  firestore: {
    "permission-denied": "접근 권한이 없습니다.",
    "not-found": "요청한 데이터를 찾을 수 없습니다.",
    "already-exists": "이미 존재하는 데이터입니다.",
    unavailable: "서비스가 일시적으로 사용할 수 없습니다.",
  },
  general: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
} as const
