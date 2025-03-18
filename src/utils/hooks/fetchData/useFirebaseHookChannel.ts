import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

const useFirebaseHookChannel = (
  channelId: string,
): { members: string[]; isFull: boolean } | null => {
  const { messageDialog } = useDialogs()
  const [isFull, setIsFull] = useState<boolean>(false)
  const [members, setMembers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const isAuthenticated = useAuthCheck()

  // 인증된 경우에만 useDocumentData 훅 사용
  const channelsRef = isAuthenticated
    ? doc(firestore, "channels", channelId)
    : null

  const [value, loading, error] = useDocumentData(channelsRef)

  useEffect(() => {
    if (!loading && error) {
      console.error(error)
      messageDialog.show("data_retrieval")
      setIsLoading(false)
      return
    }

    if (value) {
      // 데이터 존재 시 상태 업데이트
      setMembers(value.members || [])
      setIsFull(value.numMembers >= value.capacity)
      setIsLoading(false)
    }
  }, [value, loading, error, messageDialog])

  // 로딩 중이거나 인증되지 않은 경우 null 반환
  if (!isAuthenticated || isLoading) {
    return null
  }

  // 안전한 데이터 반환
  return {
    members: members,
    isFull: isFull,
  }
}

export default useFirebaseHookChannel
