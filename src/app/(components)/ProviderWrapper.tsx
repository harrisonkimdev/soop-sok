"use client"

import NavBar from "@/app/(components)/NavBar"
import { AppStateProvider } from "@/app/(context)/AppStateProvider"
import AuthProvider, { useAuth } from "@/components/AuthProvider"
import LoadingScreen from "@/components/LoadingScreen"
import theme from "@/utils/ThemeProvider"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import type { ReactNode, JSX } from "react"
import { useState, useEffect } from "react"

export default function ProviderWrapper({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [loading, setLoading] = useState(true)
  const { loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) {
      setLoading(false)
    }
  }, [authLoading])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppStateProvider>
        <AuthProvider>
          <main className="mx-auto h-screen w-screen bg-stone-50">
            {loading ? (
              <LoadingScreen />
            ) : (
              <div className="h-[calc(100vh-3.5rem)]">{children}</div>
            )}
            <NavBar />
          </main>
        </AuthProvider>
      </AppStateProvider>
    </ThemeProvider>
  )
}
