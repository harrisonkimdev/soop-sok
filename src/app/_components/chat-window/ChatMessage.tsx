import Image from "next/image"
import { useRouter } from "next/navigation"

import { TMessage } from "@/types"
import { auth } from "@/utils/firebase/firebase"

type ChatMessageProps = {
  message: TMessage
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const router = useRouter()

  const redirectToProfile = () => {
    if (auth) router.push(`/profile/${message?.uid}`)
  }

  return (
    <div className="grid grid-cols-6">
      <div onClick={redirectToProfile} className="col-span-1 mt-2">
        <Image
          src={message?.senderPhotoURL}
          alt="Profile Picture"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      </div>
      <div className="col-span-5 ml-2 flex flex-col gap-1">
        <p className="text-sm text-gray-600">{message?.senderName}</p>
        <div className="rounded-xl bg-gradient-to-b from-sky-500 to-sky-400 px-3 py-2">
          <p className="text-neutral-100">{message.message}</p>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
