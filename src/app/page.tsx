"use client"

import "firebaseui/dist/firebaseui.css"

import { useAuth } from "@/app/(context)/AuthProvider"
import LoadingScreen from "@/components/LoadingScreen"
import { auth } from "@/utils/firebase/firebase"
import {
  registerUserWithUID,
  updateUserStatus,
} from "@/utils/firebase/firestore"
import { GoogleAuthProvider } from "firebase/auth"
import firebaseui from "firebaseui"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { JSX } from "react"
import Cookies from "universal-cookie"

type TFirebaseUI = {
  default: typeof firebaseui
  auth: typeof firebaseui.auth
}

export default function Home(): JSX.Element | null {
  const [firebaseui, setFirebaseUI] = useState<TFirebaseUI | null>(null)
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()

  // 인증된 사용자는 채널 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/channels")
    }
  }, [isAuthenticated, router])

  const uiConfig = useMemo(() => {
    const cookies = new Cookies()

    // Initialize the FirebaseUI widget using Firebase.
    return {
      callbacks: {
        signInSuccessWithAuthResult: (authResult: any): boolean => {
          // eslint-disable-next-line prettier/prettier
          ;(async (): Promise<void> => {
            cookies.set("auth-token", authResult.credential.accessToken)

            const isNewUser = authResult.additionalUserInfo.isNewUser

            const { displayName, email, photoURL, uid } = authResult.user

            // If this is the first time sign in,
            if (isNewUser) {
              // Register a new user with Firebase.
              try {
                await registerUserWithUID(displayName, email, photoURL, uid)
              } catch (err) {
                console.error("Error registering new user:", err)
              }
            }
            // If a user is returning,
            else {
              // Update the isOnline.
              try {
                await updateUserStatus(uid, "signin")
              } catch (err) {
                console.error("Error updating user status:", err)
              }
            }

            router.push("/channels")
            return
          })()
          // https://firebaseopensource.com/projects/firebase/firebaseui-web/#available-callbacks
          // whether we leave that to developer to handle.
          return false
        },
      },
      signinFlow: "popup",
      // signInSuccessUrl: '/channels',
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
    }
  }, [router])

  useEffect(() => {
    const loadFirebaseUI = async (): Promise<void> => {
      try {
        const firebaseui = await import("firebaseui")
        setFirebaseUI(firebaseui)
      } catch (error) {
        console.error("Error loading FirebaseUI:", error)
      }
    }
    loadFirebaseUI()
  }, [])

  useEffect(() => {
    if (firebaseui) {
      const ui =
        // eslint-disable-next-line import/no-named-as-default-member
        firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
      ui.start("#firebaseui-auth-container", uiConfig)
    }
  }, [firebaseui, uiConfig])

  // 로딩 중일 때 로딩 스크린 표시
  if (loading) {
    return <LoadingScreen />
  }

  return firebaseui ? (
    <>
      <div className="relative">
        <div className="absolute left-0 right-0 z-10 flex h-screen flex-col justify-evenly text-center">
          {/* App name */}
          <h1 className="bg-gradient-to-r from-green-400 via-white to-yellow-400 bg-clip-text font-dhurjati text-7xl font-bold text-transparent">
            Soop Sok
          </h1>

          {/* Firebase UI */}
          <div id="firebaseui-auth-container" />
        </div>

        <Image
          src="/images/background.png"
          alt="background image"
          width={1024}
          height={1792}
          className="h-screen object-cover"
        />
      </div>
    </>
  ) : null
}
