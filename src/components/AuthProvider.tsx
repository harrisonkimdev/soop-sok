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

export const useAuth = () => useContext(AuthContext)

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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="spinner">로딩 중...</div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
