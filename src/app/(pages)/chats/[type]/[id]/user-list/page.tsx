"use client"

import PageTitle from "@/app/(components)/PageTitle"
import User from "@/app/(pages)/chats/[type]/[id]/user-list/User"
import RedirectButton from "@/components/RedirectButton"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import {
  DocumentData,
  onSnapshot,
  doc,
  DocumentSnapshot,
} from "firebase/firestore"
import type { JSX } from "react"
import { useState, useEffect } from "react"

type userListProps = {
  params: {
    type: string
    id: string
  }
}

const UserList = ({ params }: userListProps): JSX.Element => {
  // console.log("Params:", {
  //   type: params.type,
  //   id: params.id,
  // })

  const [users, setUsers] = useState<string[]>([])
  const isAuthenticated = useAuthCheck()

  useEffect(() => {
    if (!isAuthenticated) return

    const collectionName = params.type === "channel" ? "channels" : "chats"

    const membersRef = doc(firestore, collectionName, params.id)

    // console.log("membersRef", membersRef)

    const unsubscribe = onSnapshot(
      membersRef,
      (querySnapshot: DocumentSnapshot<DocumentData>) => {
        const members = querySnapshot.data()?.members as string[]
        console.log("members", members)
        setUsers(members)
      },
    )

    return () => unsubscribe()
  }, [isAuthenticated, params.id, params.type])

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex grow flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
        <PageTitle title="Users in this channel" />

        <ul className="flex flex-col gap-3">
          {users.map((uid: string) => (
            <User key={uid} uid={uid} />
          ))}
        </ul>
      </div>

      <RedirectButton
        text="Cancel"
        redirectURL={`/chats/${params.type}/${params.id}/features`}
      />
    </div>
  )
}

UserList.displayName = "UserList"

export default UserList
