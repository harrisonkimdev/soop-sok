import "./globals.css"
import ProviderWrapper from "@/app/(components)/ProviderWrapper"
import type { Metadata } from "next"
import { Dhurjati, Inter } from "next/font/google"
import React from "react"
import type { JSX } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#with-tailwind-css
const dhurjati = Dhurjati({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dhurjati",
})

export const metadata: Metadata = {
  title: "SoopSok",
  description: "Your favourite chat application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dhurjati.variable} font-sans`}>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  )
}
