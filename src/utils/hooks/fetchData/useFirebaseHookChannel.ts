import useDialogs from "@/utils/global-states/dispatcher"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

type TProps = {
  channelId: string
}

const useFirebaseHookChannel = (
  props: TProps,
): { isFull: boolean; numMembers: number } | null => {
  const { messageDialog } = useDialogs()
  const [isFull, setIsFull] = useState<boolean>(false)

  const isAuthenticated = useAuthCheck()

  const channelsRef = doc(firestore, "channels", props.channelId)
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

  return isAuthenticated ? { isFull, numMembers: value?.numMembers ?? 0 } : null
}

export default useFirebaseHookChannel
