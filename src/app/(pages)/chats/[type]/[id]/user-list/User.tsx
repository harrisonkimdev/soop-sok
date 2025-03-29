import { fetchUser } from "@/utils/firebase/firestore"
import Image from "next/image"
import Link from "next/link"
import type { JSX } from "react"

type UserProps = {
  uid: string
}

const User = async (props: UserProps): Promise<JSX.Element> => {
  const userData = await fetchUser(props.uid)

  if (!userData) {
    return <div>User not found</div>
  }

  return (
    // TODO: auth check
    <Link
      href={`/profile/${userData.uid}`}
      className="flex cursor-pointer items-center justify-between rounded-lg border p-3 shadow"
    >
      <div className="flex items-center gap-6 px-2 py-1">
        <Image
          src={userData.photoURL || "/images/ks.jpeg"}
          alt="Profile Picture"
          width={64}
          height={64}
          className="aspect-square h-16 w-16 rounded-full object-cover"
        />
        <p className="text-lg">{userData.displayName}</p>
      </div>
    </Link>
  )
}

export default User
