import "./globals.css"
import ProviderWrapper from "@/app/(components)/ProviderWrapper"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import React from "react"
import type { JSX } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#with-tailwind-css

export const metadata: Metadata = {
  title: "Soop Sok",
  description: "Collaborative Communication Platform",
  icons: {
    icon: "data:;base64,=",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  )
}
