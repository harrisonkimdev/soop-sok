import { TMessage, TUser } from "@/app/types"
import { fetchUser } from "@/utils/firebase/firestore/services/user"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import type { JSX } from "react"

type ChatMessageProps = {
  message: TMessage
}

const ChatMessage = (props: ChatMessageProps): JSX.Element => {
  const router = useRouter()
  const isAuthenticated = useAuthCheck()

  const [user, setUser] = useState<TUser | null>(null)

  useEffect(() => {
    const getuser = async (): Promise<void> => {
      const fetchedUser = await fetchUser(props.message?.uid)
      setUser(fetchedUser)
    }
    getuser()
  }, [props.message.uid])

  const redirectToProfile = (): void => {
    if (isAuthenticated) {
      router.push(`/profile/${props.message?.uid}`)
    }
  }

  return (
    <div className="grid grid-cols-5">
      <div onClick={redirectToProfile} className="col-span-1">
        {user && (
          <Image
            src={user.photoURL || "/images/ks.jpeg"}
            alt="Profile Picture"
            width={64}
            height={64}
            className="aspect-square h-16 w-16 rounded-full object-cover"
          />
        )}
      </div>

      <div className="col-span-4 ml-2 flex flex-col gap-1">
        <p className="text-sm text-gray-600">{user?.displayName}</p>
        <div className="rounded-xl bg-gradient-to-b from-sky-500 to-sky-400 px-3 py-2">
          <p className="text-neutral-100">{props.message.message}</p>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
