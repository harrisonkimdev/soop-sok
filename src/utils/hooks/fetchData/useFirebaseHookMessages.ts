import { TMessage } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection, limit, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

type TProps = {
  chatId?: string
}

const useFirebaseHookMessages = (
  props: TProps,
): TMessage[] | TMessage | null => {
  const { showMessageDialog } = useDialogs()
  const [fetched, setFetched] = useState<TMessage[]>([])

  const isAuthenticated = useAuthCheck()

  const messageRef = collection(firestore, "messages")
  const messageQuery = query(
    messageRef,
    where("cid", "==", props?.chatId || ""),
    orderBy("createdAt", "desc"),
    limit(1),
  )

  const [snapshot, loading, error] = useCollection(
    props?.chatId ? messageQuery : messageRef,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  )

  useEffect(() => {
    if (!loading && error) {
      console.error(error)
      showMessageDialog(
        "data_retrieval",
        "메시지 목록을 불러오는데 실패했습니다.",
      )
      return
    }

    if (snapshot) {
      const fetched: TMessage[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TMessage,
      )
      setFetched(fetched)
    }
  }, [snapshot, loading, error, showMessageDialog])

  return isAuthenticated ? (props?.chatId ? fetched[0] : fetched) : null
}

export default useFirebaseHookMessages
