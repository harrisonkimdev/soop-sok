"use client"

import type { JSX } from "react"

export default function LoadingScreen(): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
      <div className="flex flex-col items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">로딩 중...</p>
      </div>
    </div>
  )
}
