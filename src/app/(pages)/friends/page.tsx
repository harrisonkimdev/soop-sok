"use client"

import PageTitle from "@/app/(components)/PageTitle"
import { Friend } from "@/app/(pages)/friends/Friend"
import { TFriend } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import useFirebaseHookFriends from "@/utils/hooks/fetchData/useFirebaseHookFriends"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

const FriendsPage = (): JSX.Element => {
  const userId = auth.currentUser?.uid || ""
  const friends = useFirebaseHookFriends({ userId })

  const router = useRouter()

  const enterAIChat = (): void => {
    if (auth && auth.currentUser) {
      router.push(`/chats/ai-chat/${auth.currentUser.uid}`)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <PageTitle title="Friends" />
      <div className="flex flex-col gap-2">
        <div
          onClick={() => enterAIChat()}
          className="flex gap-4 rounded-lg bg-white p-5 shadow"
        >
          <p className="">
            Are all of your friends busy? <br />
            Try our AI chat bot today!
          </p>
        </div>

        {friends && friends.length > 0 ? (
          friends.map((friend: TFriend) => (
            <Friend
              key={friend.id}
              friendId={
                userId == friend.friendId ? friend.senderId : friend.friendId
              }
            />
          ))
        ) : (
          <p>You have no friends. 😭 (just yet)</p>
        )}
      </div>
    </div>
  )
}

FriendsPage.displayName = "FriendsPage"

export default FriendsPage
