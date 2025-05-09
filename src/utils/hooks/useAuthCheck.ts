import { auth } from "@/utils/firebase/firebase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// This hook checks if the user is authenticated and redirects to the home page if they are not
const useAuthCheck = (): boolean => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      if (!user) router.push("/")
    })

    return () => unsubscribe()
  }, [router])

  return isAuthenticated
}

export default useAuthCheck
