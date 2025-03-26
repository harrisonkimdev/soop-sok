import { TChat } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

type TProps = {
  cid: string
}

const useFirebaseHookChats = ({ cid }: TProps): TChat[] | null => {
  const { messageDialog } = useDialogs()
  const [chats, setChats] = useState<TChat[]>([])

  const isAuthenticated = useAuthCheck()

  // Fetch channle data in real time only if a user is authorized.
  const chatsRef = collection(firestore, "chats")
  const chatsQuery = isAuthenticated
    ? query(chatsRef, where("cid", "==", cid))
    : null
  const [snapshot, loading, error] = useCollection(chatsQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  useEffect(() => {
    if (!loading && error) {
      messageDialog.show("data_retrieval")
    }

    if (snapshot) {
      const snapshotChats: TChat[] = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as TChat
      })
      setChats(snapshotChats)
    }
  }, [snapshot, loading, error, messageDialog])

  return chats
}

export default useFirebaseHookChats
