import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

type TProps = {
  channelId: string
}

const useFirebaseHookChannel = (
  props: TProps,
): { members: string[]; isFull: boolean } | null => {
  const { messageDialog } = useDialogs()
  const [isFull, setIsFull] = useState<boolean>(false)

  const isAuthenticated = useAuthCheck()

  // 인증된 경우에만 useDocumentData 훅 사용
  const channelsRef = isAuthenticated
    ? doc(firestore, "channels", props.channelId)
    : null

  const [value, loading, error] = useDocumentData(channelsRef)

  useEffect(() => {
    if (!loading && error) {
      console.error(error)
      messageDialog.show("data_retrieval")
      return
    }

    if (value?.numMembers >= value?.capacity) {
      setIsFull(true)
    }
  }, [value, loading, error, messageDialog])

  return { members: value?.members, isFull }
}

export default useFirebaseHookChannel
