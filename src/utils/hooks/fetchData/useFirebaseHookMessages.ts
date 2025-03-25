import { TMessage } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
// import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection, limit, orderBy, query, where } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"

const useFirebaseHookMessages = (
  cid: string,
  latestOnly?: boolean,
): TMessage[] | null => {
  // const { messageDialog } = useDialogs()
  const isAuthenticated = useAuthCheck()
  const messageRef = collection(firestore, "messages")

  const baseQuery = query(
    messageRef,
    where("cid", "==", cid),
    orderBy("createdAt"),
  )
  const messageQuery = isAuthenticated
    ? latestOnly
      ? query(baseQuery, limit(1))
      : baseQuery
    : null

  const [snapshot, loading, error] = useCollection(messageQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  if (!loading && error) {
    console.log(error)
    // messageDialog.show("data_retrieval")
  }

  // Data handling
  return snapshot
    ? snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TMessage)
    : []
}

export default useFirebaseHookMessages
