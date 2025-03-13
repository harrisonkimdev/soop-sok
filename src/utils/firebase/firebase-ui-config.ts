import { handleFirebaseError, logError } from "@/utils/error-handler"
import {
  registerUserWithUID,
  updateUserStatus,
} from "@/utils/firebase/firestore"
import useDialogs from "@/utils/global-states/dispatcher"
import {
  GoogleAuthProvider,
  UserCredential,
  AuthCredential,
} from "firebase/auth"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import Cookies from "universal-cookie"

interface ExtendedUserCredential extends UserCredential {
  credential?: AuthCredential
  additionalUserInfo?: {
    isNewUser: boolean
  }
}

export const useFirebaseUIConfig = (
  setIsLoading: (loading: boolean) => void,
): {
  callbacks: {
    signInSuccessWithAuthResult: (authResult: ExtendedUserCredential) => boolean
  }
  signinFlow: string
  signInOptions: "google.com"[]
} => {
  const router = useRouter()
  const { messageDialog } = useDialogs()

  return useMemo(() => {
    const cookies = new Cookies()

    return {
      callbacks: {
        signInSuccessWithAuthResult: (
          authResult: ExtendedUserCredential,
        ): boolean => {
          ;(async (): Promise<void> => {
            try {
              setIsLoading(true)
              if (!authResult.credential) {
                throw new Error("인증 정보가 없습니다.")
              }

              const accessToken = (
                authResult.credential as AuthCredential & {
                  accessToken?: string
                }
              ).accessToken
              if (!accessToken) {
                throw new Error("액세스 토큰이 없습니다.")
              }

              cookies.set("auth-token", accessToken, {
                secure: true,
                sameSite: "strict",
                maxAge: 3600, // 1시간
              })

              const isNewUser =
                authResult.additionalUserInfo?.isNewUser ?? false
              const user = authResult.user

              if (!user.displayName || !user.email || !user.uid) {
                throw new Error("필수 사용자 정보가 누락되었습니다.")
              }

              if (isNewUser) {
                const success = await registerUserWithUID(
                  user.displayName,
                  user.email,
                  user.photoURL || "",
                  user.uid,
                )

                if (!success) {
                  throw new Error("사용자 등록에 실패했습니다.")
                }
              } else {
                const success = await updateUserStatus(user.uid, "signin")
                if (!success) {
                  throw new Error("사용자 상태 업데이트에 실패했습니다.")
                }
              }

              router.push("/channels")
            } catch (err) {
              const error = handleFirebaseError(err as any)
              logError(error)
              messageDialog.show("error", error.message)
            } finally {
              setIsLoading(false)
            }
          })()
          return false
        },
      },
      signinFlow: "popup",
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
    }
  }, [router, messageDialog, setIsLoading])
}
