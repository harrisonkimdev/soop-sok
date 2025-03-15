"use client"

import "@/app/(components)/Marquee.css"

import { getBanner } from "@/utils/firebase/firestore"
import { useAppState } from "@/utils/global-states/AppStateProvider"
import useDialogs from "@/utils/global-states/dispatcher"
import { useEffect } from "react"
import type { JSX } from "react"

const Banner = (): JSX.Element => {
  const { state } = useAppState()
  const { bannerState } = useDialogs()

  useEffect(() => {
    const fetchBanner = async (): Promise<void> => {
      try {
        const res = await getBanner()
        bannerState.set(res)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBanner()
  }, [bannerState])

  return (
    <div className="h-min overflow-hidden rounded-lg bg-white py-2">
      <div className="marquee">
        <p className="inline-block px-4">{state.currentBanner?.content}</p>
      </div>
    </div>
  )
}

export default Banner
