import { TPrivateChat } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const useFirebaseHookPrivateChats = (
  uid: string | undefined,
): TPrivateChat[] | undefined => {
  const isAuthenticated = useAuthCheck()
  const { messageDialog } = useDialogs()
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>()

  const privateChatsRef =
    isAuthenticated && uid
      ? query(
          collection(firestore, "private-chats"),
          where("from", "==", uid),
          where("to", "==", uid),
        )
      : null

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
      const fetchedPrivateChats: TPrivateChat[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TPrivateChat,
      )
      setPrivateChats(fetchedPrivateChats)
    }
  }, [snapshot, loading, error, messageDialog])

  return privateChats
}

export default useFirebaseHookPrivateChats
