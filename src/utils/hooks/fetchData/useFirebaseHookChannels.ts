"use client"

import { TChannel } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const useFirebaseHookChannels = (): TChannel[] | null => {
  const { messageDialog } = useDialogs()
  const [fetchedChannels, setFetchedChannels] = useState<TChannel[]>([])

  const isAuthenticated = useAuthCheck()

  const channelsRef = collection(firestore, "channels")
  const [snapshot, loading, error] = useCollection(channelsRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  useEffect(() => {
    if (!loading && error) {
      console.error(error)
      messageDialog.show("data_retrieval")
      return
    }

    if (snapshot) {
      const fetchedChannels: TChannel[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TChannel,
      )
      setFetchedChannels(fetchedChannels)
    }
  }, [snapshot, loading, error, messageDialog])

  return isAuthenticated ? fetchedChannels : null
}

export default useFirebaseHookChannels
