import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { doc } from "firebase/firestore"
import { useEffect } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

type TProps = {
  channelId: string
}

const useFirebaseHookUsersInChannel = (
  props: TProps,
): { members: string[] } | null => {
  const { messageDialog } = useDialogs()

  const isAuthenticated = useAuthCheck()

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
  }, [value, loading, error, messageDialog])

  return { members: value?.members }
}

export default useFirebaseHookUsersInChannel
