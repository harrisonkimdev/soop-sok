"use client"

import User from "@/app/(pages)/chats/[type]/[id]/user-list/User"
import RedirectButton from "@/components/RedirectButton"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { doc, DocumentData, DocumentReference } from "firebase/firestore"
import type { JSX } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

type userListProps = {
  params: {
    type: string
    id: string
  }
}

const UserList = ({ params }: userListProps): JSX.Element => {
  const isAuthenticated = useAuthCheck()

  const docRef: DocumentReference<DocumentData> | null =
    isAuthenticated && params.id
      ? doc(
          firestore,
          params.type === "channel" ? "channels" : "chats",
          params.id,
        )
      : null

  const [value, loading, error] = useDocumentData(docRef)

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex grow flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          Users in this channel
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading users: {error.message}</div>
        ) : !value?.members ? (
          <div>No users found</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {value.members.map((user: string) => (
              <User key={user} uid={user} />
            ))}
          </ul>
        )}
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
