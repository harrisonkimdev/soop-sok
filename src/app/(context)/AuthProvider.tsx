"use client"

import { auth } from "@/utils/firebase/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
} from "react"
import Cookies from "universal-cookie"

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
})

export const useAuth = (): AuthContextType => useContext(AuthContext)

export default function AuthProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cookies = new Cookies()
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const token = await currentUser.getIdToken()
        cookies.set("auth-token", token, { path: "/" })
      } else {
        setUser(null)
        cookies.remove("auth-token", { path: "/" })
      }
      setLoading(false)
    })

    return (): void => unsubscribe()
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
