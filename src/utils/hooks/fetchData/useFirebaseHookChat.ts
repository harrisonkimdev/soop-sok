import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

type TProps = {
  cid: string
}

export const useFirebaseHookChat = (
  props: TProps,
): { isFull: boolean; numMembers: number } | null => {
  const { showMessageDialog } = useDialogs()
  const [isFull, setIsFull] = useState<boolean>(false)

  const isAuthenticated = useAuthCheck()

  const [value, loading, error] = useDocumentData(
    doc(firestore, "channels", props.cid),
  )

  useEffect(() => {
    if (!loading && error) {
      console.error(error)
      showMessageDialog(
        "data_retrieval",
        "채팅 정보를 불러오는데 실패했습니다.",
      )
      return
    }

    if (value) {
      setIsFull(true)
    }
  }, [value, loading, error, showMessageDialog])

  return isAuthenticated ? { isFull, numMembers: value?.numMembers ?? 0 } : null
}
