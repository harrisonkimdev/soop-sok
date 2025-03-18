import { TChannel } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import { updateChannel } from "@/utils/firebase/firestore"
import useDialogs from "@/utils/global-states/dispatcher"
import useFirebaseHookChannel from "@/utils/hooks/fetchData/useFirebaseHookChannel"
import { FirebaseError } from "firebase/app"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

interface ChannelProps {
  channel: TChannel
}

export const Channel = (props: ChannelProps): JSX.Element => {
  const router = useRouter()

  const { messageDialog, channelState } = useDialogs()

  const channelData: {
    members: string[]
    isFull: boolean
  } | null = useFirebaseHookChannel(props.channel.id)

  const isFull = channelData?.isFull ?? false
  const numMembers = channelData?.members.length ?? 0

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

    // Check if the user is already in the channel and only enter the channel if they are not. Otherwise, return.
    if (channelData?.members.includes(currentUser.uid)) {
      messageDialog.show("already_in_channel")
      router.push("/channels")
    }

    try {
      // Update the user list in the channel document.
      const res = await updateChannel(
        props.channel.id,
        currentUser.uid,
        "enter",
      )

      // If the update is successful, set the current channel state and navigate to the channel page.
      if (res) {
        // TODO: rename the channelState to something more descriptive.
        channelState.set(props.channel.id)
        router.push(`/chats/channel/${props.channel.id}/`)
      }
    } catch (err) {
      console.error(err)

      // 에러 타입에 따른 처리
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "permission-denied":
            messageDialog.show("access_denied")
            // 홈 화면이나 채널 목록으로 리다이렉트
            router.push("/channels")
            break

          case "network-error":
            messageDialog.show("network_error")
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
            messageDialog.show("data_retrieval")
            // 채널 목록으로 리다이렉트
            router.push("/channels")
        }
      } else {
        // 예상치 못한 일반 에러
        messageDialog.show("general")
        router.push("/channels")
      }
    }
  }

  return (
    <div
      onClick={handleEnterChannel}
      className={` ${!isFull ? "cursor-pointer" : "cursor-not-allowed opacity-50"} flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md transition duration-300 ease-in-out hover:bg-gray-100`}
    >
      <h3 className="text-lg font-semibold text-gray-800">
        {props.channel.name}
      </h3>
      <p className="text-sm text-gray-600">
        Capacity: {numMembers} / {props.channel.capacity}
      </p>
    </div>
  )
}

export default Channel
