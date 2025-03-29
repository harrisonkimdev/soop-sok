"use client"

import { useRouter } from "next/navigation"
import React from "react"

type RedirectButtonProps = {
  text: string
  redirectURL: string
}

const RedirectButton = ({ text, redirectURL }: RedirectButtonProps) => {
  const router = useRouter()

  const redirectTo = (): void => {
    router.push(redirectURL)
  }

  return (
    <button
      type="button"
      onClick={redirectTo}
      className="w-full rounded-lg bg-white py-4 text-xl font-semibold text-earth-400 shadow transition duration-300 ease-in-out hover:bg-earth-50"
    >
      {text}
    </button>
  )
}

export default RedirectButton
