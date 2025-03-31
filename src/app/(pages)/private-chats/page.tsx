"use client"

import SearchBar from "@/app/(components)/SearchBar"
import PrivateChat from "@/app/(pages)/private-chats/PrivateChat"
import { TPrivateChat } from "@/app/types"
import { auth, firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import {
  collection,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
  DocumentData,
} from "firebase/firestore"
import type { JSX } from "react"
import { useState, useEffect } from "react"

const PrivateChatPage = (): JSX.Element => {
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>([])
  const isAuthenticated = useAuthCheck()

  const currentUserId = auth.currentUser?.uid

  useEffect(() => {
    if (!isAuthenticated) return

    const privateChatsRef = collection(firestore, "private-chats")
    const q = query(
      privateChatsRef,
      where("from", "==", currentUserId),
      where("to", "==", currentUserId),
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const privateChats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TPrivateChat[]
        setPrivateChats(privateChats)
      },
    )

    return () => unsubscribe()
  }, [isAuthenticated, currentUserId])

  return (
    <div className="flex flex-col gap-6">
      {/* interaction area */}
      <SearchBar onSubmit={(searchQuery: string) => console.log(searchQuery)} />

      {/* private chats */}
      <div className="space-y-4">
        {privateChats && privateChats.length > 0 ? (
          privateChats?.map((privateChat: TPrivateChat) => (
            <PrivateChat key={privateChat.id} privateChat={privateChat} />
          ))
        ) : (
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/50 py-5 text-center text-slate-400">
            You have no messages received. 📭
          </div>
        )}
      </div>
    </div>
  )
}

PrivateChatPage.displayName = "PrivateChatPage"

export default PrivateChatPage
