"use client"

import "@/app/(components)/Marquee.css"

import { getBanner } from "@/utils/firebase/firestore"
import { useState, useEffect } from "react"
import type { JSX } from "react"

const Banner = (): JSX.Element => {
  const [currentBanner, setCurrentBanner] = useState<{
    content: string
  } | null>(null)

  useEffect(() => {
    const fetchBanner = async (): Promise<void> => {
      try {
        const res = await getBanner()
        setCurrentBanner(res)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBanner()
  }, [])

  return (
    <div className="h-min overflow-hidden rounded-lg bg-white py-2">
      <div className="marquee">
        <p className="inline-block px-4">{currentBanner?.content}</p>
      </div>
    </div>
  )
}

export default Banner
