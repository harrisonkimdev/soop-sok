"use client"

import SearchBar from "@/app/(components)/SearchBar"
import PrivateChat from "@/app/(pages)/private-chats/[id]/PrivateChat"
import { TPrivateChat } from "@/app/types"
import useFirebaseHookPrivateChats from "@/utils/hooks/fetchData/useFirebaseHookPrivateChats"
import type { JSX } from "react"

const PrivateChatPage = (): JSX.Element => {
  const fetchedPrivateChats = useFirebaseHookPrivateChats()

  return (
    <div className="h-full bg-stone-100">
      <div className="flex flex-col gap-6">
        {/* interaction area */}
        <SearchBar
          onSubmit={(searchQuery: string) => console.log(searchQuery)}
        />

        {/* private chats */}
        <div className="flex flex-col gap-2">
          {fetchedPrivateChats && fetchedPrivateChats.length > 0 ? (
            fetchedPrivateChats?.map((privateChat: TPrivateChat) => (
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
