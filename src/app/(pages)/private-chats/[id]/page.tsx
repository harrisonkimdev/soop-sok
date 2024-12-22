"use client"

import SearchBar from "@/app/(components)/SearchBar"
import PrivateChat from "@/app/(pages)/private-chats/[id]/PrivateChat"
import { TPrivateChat } from "@/types"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { JSX } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const PrivateChatPage = (): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [isLoading, setIsLoading] = useState(true);
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>([])

  const router = useRouter()

  const [value, loading, error] = useCollection(
    collection(firestore, "private-chats"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  )

  useAuthCheck(setIsAuthenticated)

  // Authenticate a user
  useEffect(() => {
    if (isAuthenticated && value) {
      const chatList = value.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TPrivateChat,
      )

      setPrivateChats(chatList)
    }
  }, [isAuthenticated, router, value])

  useEffect(() => {
    if (loading) {
      console.log("Loading messages...")
    }

    if (error) {
      console.error("Error fetching messages:", error)
    }
  }, [loading, error])

  return (
    <div className="h-full bg-stone-100">
      <div className="flex flex-col gap-6">
        {/* interaction area */}
        <SearchBar
          onSubmit={(searchQuery: string) => console.log(searchQuery)}
        />

        {/* private chats */}
        <div className="flex flex-col gap-2">
          {privateChats.length > 0 ? (
            privateChats?.map((privateChat: TPrivateChat) => (
              <PrivateChat key={privateChat.id} privateChat={privateChat} />
            ))
          ) : (
            <p>You have no messages received. 📭</p>
          )}
        </div>
      </div>
    </div>
  )
}

PrivateChatPage.displayName = "PrivateChatPage"

export default PrivateChatPage
