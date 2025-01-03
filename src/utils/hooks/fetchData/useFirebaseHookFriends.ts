"use client"

import { TFriend } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection, or, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

type TProps = {
  userId: string
}

const useFirebaseHookChats = (props: TProps): TFriend[] | null => {
  const { messageDialog } = useDialogs()
  const [fetched, setFetched] = useState<TFriend[]>([])

  const isAuthenticated = useAuthCheck()

  const ref = collection(firestore, "friend_list")
  const chatsQuery = query(
    ref,
    or(
      where("senderId", "==", props.userId),
      where("friendId", "==", props.userId),
    ),
  )
  const [snapshot, loading, error] = useCollection(chatsQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  useEffect(() => {
    if (!loading && error) {
      console.error(error)
      messageDialog.show("data_retrieval")
      return
    }

    if (snapshot) {
      const fetched: TFriend[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TFriend,
      )
      setFetched(fetched)
    }
  }, [snapshot, loading, error, messageDialog])

  return isAuthenticated ? fetched : null
}

export default useFirebaseHookChats
