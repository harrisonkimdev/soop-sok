"use client"

import NavBar from "@/app/(components)/NavBar"
import { AppStateProvider } from "@/utils/global-states/AppStateProvider"
import theme from "@/utils/ThemeProvider"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import type { ReactNode, JSX } from "react"

export default function ProviderWrapper({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppStateProvider>
        <main className="mx-auto h-screen w-screen bg-stone-50">
          <div className="h-[calc(100vh-3.5rem)]">{children}</div>
          <NavBar />
        </main>
      </AppStateProvider>
    </ThemeProvider>
  )
}
