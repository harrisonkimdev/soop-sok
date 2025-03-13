"use client"

import { TFriend } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection, or, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

type TProps = {
  userId: string
}

const useFirebaseHookChats = (props: TProps): TFriend[] | null => {
  const { showMessageDialog } = useDialogs()
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
      showMessageDialog(
        "data_retrieval",
        "친구 목록을 불러오는데 실패했습니다.",
      )
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
  }, [snapshot, loading, error, showMessageDialog])

  return isAuthenticated ? fetched : null
}

export default useFirebaseHookChats
