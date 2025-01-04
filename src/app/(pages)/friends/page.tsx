"use client"

import PageTitle from "@/app/(components)/PageTitle"
import { Friend } from "@/app/(pages)/friends/Friend"
import { TFriend } from "@/types"
import { auth } from "@/utils/firebase/firebase"
import useFirebaseHookFriends from "@/utils/hooks/fetchData/useFirebaseHookFriends"
import type { JSX } from "react"

const FriendsPage = (): JSX.Element => {
  const userId = auth.currentUser?.uid || ""
  const friends = useFirebaseHookFriends({ userId })

  return (
    <div className="h-full overflow-y-auto">
      <PageTitle title="Friends" />
      <div className="flex flex-col gap-2">
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
