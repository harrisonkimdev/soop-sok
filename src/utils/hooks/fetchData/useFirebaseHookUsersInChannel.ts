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
  const { showMessageDialog } = useDialogs()

  const isAuthenticated = useAuthCheck()

  const channelsRef = doc(firestore, "channels", props.channelId)
  const [value, loading, error] = useDocumentData(channelsRef)

  useEffect(() => {
    if (!loading && error) {
      console.error(error)
      showMessageDialog(
        "data_retrieval",
        "채널 멤버 정보를 불러오는데 실패했습니다.",
      )
      return
    }
  }, [value, loading, error, showMessageDialog])

  return isAuthenticated ? { members: value?.members } : null
}

export default useFirebaseHookUsersInChannel
