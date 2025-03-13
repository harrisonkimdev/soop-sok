"use client"

import "firebaseui/dist/firebaseui.css"

import { handleFirebaseError, logError } from "@/utils/error-handler"
import { auth } from "@/utils/firebase/firebase"
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
import firebaseui from "firebaseui"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { JSX } from "react"
import Cookies from "universal-cookie"

interface ExtendedUserCredential extends UserCredential {
  credential?: AuthCredential
  additionalUserInfo?: {
    isNewUser: boolean
  }
}

type TFirebaseUI = {
  default: typeof firebaseui
  auth: typeof firebaseui.auth
}

const BACKGROUND_IMAGE_URL: string = "/images/background.png"

export default function Home(): JSX.Element | null {
  const [firebaseui, setFirebaseUI] = useState<TFirebaseUI | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()
  const { messageDialog } = useDialogs()

  const uiConfig = useMemo(() => {
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
  }, [router, messageDialog])

  useEffect(() => {
    const loadFirebaseUI = async (): Promise<void> => {
      try {
        const firebaseui = await import("firebaseui")
        setFirebaseUI(firebaseui)
      } catch (error) {
        const err = handleFirebaseError(error as any)
        logError(err)
        messageDialog.show("error", err.message)
      }
    }
    loadFirebaseUI()
  }, [messageDialog])

  useEffect(() => {
    if (firebaseui) {
      const ui =
        firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
      ui.start("#firebaseui-auth-container", uiConfig)
    }
  }, [firebaseui, uiConfig])

  return firebaseui ? (
    <>
      <div className="relative">
        <div className="absolute left-0 right-0 z-10 flex h-screen flex-col gap-96 py-40 text-center">
          <h1 className="bg-gradient-to-r from-green-400 via-white to-yellow-400 bg-clip-text font-dhurjati text-7xl font-bold text-transparent">
            Soop Sok
          </h1>

          <div id="firebaseui-auth-container" />
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white">로딩 중...</div>
            </div>
          )}
        </div>

        <Image
          src={BACKGROUND_IMAGE_URL}
          alt="background image"
          width={1024}
          height={1792}
          className="h-screen object-cover"
          priority
        />
      </div>
    </>
  ) : null
}
