import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/utils/firebase/firebase"

const useAuthCheck = () => {
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      if (!user) {
        router.push("/")
      }
    })

    return () => unsubscribe()
  }, [router])

  return isAuthenticated
}

export default useAuthCheck
