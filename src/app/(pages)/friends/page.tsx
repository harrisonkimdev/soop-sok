"use client"

import PageTitle from "@/app/(components)/PageTitle"
import { Friend } from "@/app/(pages)/friends/Friend"
import { TFriend } from "@/app/types"
import { auth, firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import {
  collection,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore"
import type { JSX } from "react"
import { useEffect, useState } from "react"

const FriendsPage = (): JSX.Element => {
  const [friends, setFriends] = useState<TFriend[]>([])
  const isAuthenticated = useAuthCheck()

  const userId = auth.currentUser?.uid || ""

  useEffect(() => {
    if (!isAuthenticated) return

    const unsubscribe = onSnapshot(
      collection(firestore, "friend_list"),
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const friends = querySnapshot.docs.map((doc) => {
          const data = doc.data() as TFriend
          return {
            ...data,
            id: doc.id,
          }
        })
        setFriends(friends)
      },
    )

    return () => unsubscribe()
  }, [isAuthenticated])

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
