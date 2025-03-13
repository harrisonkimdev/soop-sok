import { TPrivateChat } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const useFirebaseHookChannels = (): TPrivateChat[] | null => {
  const { showMessageDialog } = useDialogs()
  const [fetchedPrivateChats, setFetchedPrivateChats] = useState<
    TPrivateChat[]
  >([])

  const isAuthenticated = useAuthCheck()

  const privateChatsRef = collection(firestore, "private-chats")
  const [snapshot, loading, error] = useCollection(privateChatsRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  useEffect(() => {
    if (!loading && error) {
      console.error(error)
      showMessageDialog(
        "data_retrieval",
        "개인 채팅 목록을 불러오는데 실패했습니다.",
      )
      return
    }

    if (snapshot) {
      const fetchedChannels: TPrivateChat[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TPrivateChat,
      )
      setFetchedPrivateChats(fetchedChannels)
    }
  }, [snapshot, loading, error, showMessageDialog])

  return isAuthenticated ? fetchedPrivateChats : null
}

export default useFirebaseHookChannels
