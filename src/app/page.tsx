"use client"

import "firebaseui/dist/firebaseui.css"

import { handleFirebaseError, logError } from "@/utils/error-handler"
import { auth } from "@/utils/firebase/firebase"
import { useFirebaseUIConfig } from "@/utils/firebase/firebase-ui-config"
import * as firebaseui from "firebaseui"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { JSX } from "react"

const BACKGROUND_IMAGE_URL: string = "/images/background.png"

export default function Home(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUIInitialized, setIsUIInitialized] = useState<boolean>(false)
  const [initError, setInitError] = useState<string | null>(null)

  const uiConfig = useFirebaseUIConfig(setIsLoading)

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return

    let ui: firebaseui.auth.AuthUI | null = null
    let mounted = true

    const initializeUI = async (): Promise<void> => {
      try {
        // 기존 UI 인스턴스가 있다면 삭제
        const existingUI = firebaseui.auth.AuthUI.getInstance()
        if (existingUI) {
          existingUI.delete()
        }

        // 새로운 UI 인스턴스 생성
        ui = new firebaseui.auth.AuthUI(auth)

        // UI 시작
        await ui.start("#firebaseui-auth-container", uiConfig)

        if (mounted) {
          setIsUIInitialized(true)
          setInitError(null)
        }
      } catch (error) {
        console.error("FirebaseUI 초기화 에러:", error)
        if (mounted) {
          const err = handleFirebaseError(error as any)
          logError(err)
          setInitError(err.message)
          setIsUIInitialized(false)
        }
      }
    }

    // 약간의 지연 후 초기화 시도
    const timer = setTimeout(initializeUI, 100)

    return () => {
      mounted = false
      clearTimeout(timer)
      if (ui) {
        ui.delete()
      }
    }
  }, [uiConfig])

  return (
    <div className="relative h-screen">
      <div className="absolute left-0 right-0 z-10 flex h-full flex-col items-center justify-center gap-20">
        <h1 className="bg-gradient-to-r from-green-400 via-white to-yellow-400 bg-clip-text font-dhurjati text-7xl font-bold text-transparent">
          Soop Sok
        </h1>

        <div id="firebaseui-auth-container" className="w-full max-w-md" />

        {!isUIInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white">
              {initError
                ? "로그인 UI를 불러오는데 실패했습니다."
                : "로딩 중..."}
            </div>
          </div>
        )}

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
        className="h-full w-full object-cover"
        priority
      />
    </div>
  )
}
