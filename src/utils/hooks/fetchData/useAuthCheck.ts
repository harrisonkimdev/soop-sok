import { auth } from "@/utils/firebase/firebase"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

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
