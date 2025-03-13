import { auth } from "@/utils/firebase/firebase"
import { sendMessage } from "@/utils/firebase/firestore"
import useDialogs from "@/utils/global-states/dispatcher"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"
import type { JSX } from "react"

type MessageInputProps = {
  cid: string
}

const MessageInput = ({ cid }: MessageInputProps): JSX.Element => {
  const [message, setMessage] = useState("")
  const { showMessageDialog } = useDialogs()

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!auth?.currentUser || !message.trim()) return

    const { uid } = auth.currentUser

    try {
      await sendMessage(uid, cid, message.trim())
      setMessage("")
    } catch (err) {
      console.error(err)
      showMessageDialog("general", "메시지 전송에 실패했습니다.")
    }
  }

  return (
    <div className="flex grow items-center gap-3">
      <div className="grow rounded-lg bg-white p-0.5 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="flex h-8 items-center justify-between"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="grow px-2 py-1 outline-none"
          />
          <button type="submit" className="mr-2">
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessageInput
