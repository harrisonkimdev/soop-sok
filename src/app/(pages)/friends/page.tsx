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
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col gap-4 p-4">
        <PageTitle title="Friends" />

        <div className="space-y-4">
          {friends && friends.length > 0 ? (
            friends.map((friend: TFriend) => (
              <Friend
                key={friend.id}
                friendId={
                  userId == friend.friendId ? friend.senderId : friend.friendId
                }
                className="group relative overflow-hidden rounded-xl transition duration-300 ease-in-out"
              />
            ))
          ) : (
            <div className="rounded-xl border border-slate-700/30 bg-slate-800/50 py-5 text-center text-slate-400">
              You have no friends. 😭 (just yet)
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

FriendsPage.displayName = "FriendsPage"

export default FriendsPage
