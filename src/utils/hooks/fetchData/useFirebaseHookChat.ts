import useDialogs from "@/utils/global-states/dispatcher"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

type TProps = {
  chatId: string
}

const useFirebaseHookChat = (
  props: TProps,
): { isFull: boolean; numMembers: number } | null => {
  const { messageDialog } = useDialogs()
  const [isFull, setIsFull] = useState<boolean>(false)

  const isAuthenticated = useAuthCheck()

  // Fetch channle data in real time only if a user is authorized.
  const chatRef = doc(firestore, "chats", props.chatId)
  const [value, loading, error] = useDocumentData(chatRef)

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

export default useFirebaseHookChat
