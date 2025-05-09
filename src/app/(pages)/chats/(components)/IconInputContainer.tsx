import { auth } from "@/utils/firebase/firebase"
import { ArrowLeftIcon, Bars3Icon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

interface IconInputContainerProps {
  type: string
  cid: string
}

const IconInputContainer = (props: IconInputContainerProps): JSX.Element => {
  const router = useRouter()

  const handleClick = (): void => {
    if (props.type === "channel" || props.type === "group") {
      router.push(`/chats/${props.type}/${props.cid}/features`)
    } else {
      router.push(`/private-chats/${auth.currentUser?.uid}`)
    }
    return
  }

  return (
    <div
      className="flex items-center rounded-lg bg-white p-2 shadow-sm"
      onClick={handleClick}
    >
      {props.type === "channel" || props.type === "group" ? (
        <Bars3Icon className="h-5 w-5" />
      ) : (
        <ArrowLeftIcon className="h-5 w-5" />
      )}
    </div>
  )
}

export default IconInputContainer
