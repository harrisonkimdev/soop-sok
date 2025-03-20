"use client"

import SearchBar from "@/app/(components)/SearchBar"
import PrivateChat from "@/app/(pages)/private-chats/PrivateChat"
import { TPrivateChat } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import useFirebaseHookPrivateChats from "@/utils/hooks/fetchData/useFirebaseHookPrivateChats"
import type { JSX } from "react"

const PrivateChatPage = (): JSX.Element => {
  const currentUserId = auth.currentUser?.uid

  // uid를 사용하여 특정 사용자와의 채팅 데이터 fetching
  const privateChats = useFirebaseHookPrivateChats(currentUserId)

  return (
    <div className="h-full bg-stone-100">
      <div className="flex flex-col gap-6">
        {/* interaction area */}
        <SearchBar
          onSubmit={(searchQuery: string) => console.log(searchQuery)}
        />

        {/* private chats */}
        <div className="flex flex-col gap-2">
          {privateChats && privateChats.length > 0 ? (
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
