import { TChannel } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import { updateChannel } from "@/utils/firebase/firestore"
import { FirebaseError } from "firebase/app"
import { useRouter } from "next/navigation"
import type { JSX } from "react"
import { useState, useEffect } from "react"
interface ChannelProps {
  channel: TChannel
}

export const Channel = ({ channel }: ChannelProps): JSX.Element => {
  const [isFull, setIsFull] = useState(false)
  const [numMembers, setNumMembers] = useState(0)

  const router = useRouter()

  useEffect(() => {
    setIsFull(channel.capacity == channel.numMembers)
    setNumMembers(channel.numMembers)
  }, [channel])

  /*
  // When users join a channel, add them to the 'members' subcollection of the
  // associated channel document and update the 'numMembers' field in the
  // channel document accordingly.
  */
  const handleEnterChannel = async (): Promise<void> => {
    const currentUser = auth.currentUser
    // Create a new variable called 'isAuthenticated' and set it to true if the user is authenticated.
    const isAuthenticated = !!currentUser

    if (!isAuthenticated || isFull) return

    try {
      // Update the user list in the channel document.
      const res = await updateChannel(channel.id, currentUser.uid, "enter")

      // If the update is successful, navigate to the channel page.
      if (res) {
        router.push(`/chats/channel/${channel.id}/`)
      }
    } catch (err) {
      console.error(err)

      // 에러 타입에 따른 처리
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "permission-denied":
            // 홈 화면이나 채널 목록으로 리다이렉트
            router.push("/channels")
            break

          case "network-error":
            {
              // 재시도 옵션 제공
              const retry = confirm("네트워크 오류. 다시 시도하시겠습니까?")
              if (retry) {
                handleEnterChannel() // 함수 재호출
              } else {
                router.push("/channels")
              }
            }
            break

          default:
            // 채널 목록으로 리다이렉트
            router.push("/channels")
        }
      } else {
        // 예상치 못한 일반 에러
        router.push("/channels")
      }
    }
  }

  return (
    <div
      onClick={!isFull ? handleEnterChannel : undefined}
      className={`group relative overflow-hidden rounded-xl transition duration-300 ease-in-out ${!isFull ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative z-10 flex flex-col gap-2 rounded-xl border border-slate-700/30 bg-slate-800/50 p-5 transition-all hover:border-teal-500/50">
        <h3 className="text-lg font-medium text-slate-300 transition-colors group-hover:text-teal-300">
          {channel.name}
        </h3>
        <p className="text-sm text-slate-400 transition-colors group-hover:text-teal-200">
          Capacity: {numMembers} / {channel.capacity}
        </p>
      </div>
    </div>
  )
}

export default Channel
