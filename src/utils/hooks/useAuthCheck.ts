import { auth } from "@/utils/firebase/firebase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const useAuthCheck = (
  setIsAuthenticated: (isAuthenticated: boolean) => void,
): void => {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      if (!user) {
        router.push("/")
      }
    })

    return () => unsubscribe()
  }, [router, setIsAuthenticated])
}

export default useAuthCheck
