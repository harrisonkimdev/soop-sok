"use client"

import User from "@/app/(pages)/chats/[type]/[id]/user-list/User"
import useFirebaseHookUsersInChannel from "@/utils/hooks/fetchData/useFirebaseHookUsersInChannel"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

type userListPageProps = {
  params: {
    type: string
    id: string
  }
}

const UserListPage = ({ params }: userListPageProps): JSX.Element => {
  const router = useRouter()

  const userData = useFirebaseHookUsersInChannel({
    channelId: params.id,
  })

  const users = userData?.members || []

  // Error handling
  // router.push(`/chats/${params.type}/${params.id}/features`)

  const redirectToFeaturesPage = (): void => {
    router.push(`/chats/${params.type}/${params.id}/features`)
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex grow flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          Users in this channel
        </h1>

        <ul className="flex flex-col gap-3">
          {users.map((user: string) => (
            <User key={user} uid={user} />
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={redirectToFeaturesPage}
        className="w-full rounded-lg bg-white py-4 text-xl font-semibold text-earth-400 shadow transition duration-300 ease-in-out hover:bg-earth-50"
      >
        Cancel
      </button>
    </div>
  )
}

UserListPage.displayName = "UserListPage"

export default UserListPage
