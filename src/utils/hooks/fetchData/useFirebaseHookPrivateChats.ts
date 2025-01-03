import useAuthCheck from "./useAuthCheck"
import { TPrivateChat } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { firestore } from "@/utils/firebase/firebase"
import { collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const useFirebaseHookChannels = (): TPrivateChat[] | null => {
  const { messageDialog } = useDialogs()
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
      messageDialog.show("data_retrieval")
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
  }, [snapshot, loading, error, messageDialog])

  return isAuthenticated ? fetchedPrivateChats : null
}

export default useFirebaseHookChannels
