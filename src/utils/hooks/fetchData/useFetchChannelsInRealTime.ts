import { TChannel } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { firestore, auth } from "@/utils/firebase/firebase"
import { collection } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const useFetchChannelsInRealTime = (): TChannel[] | null => {
  const { messageDialog } = useDialogs()
  const [fetchedChannels, setFetchedChannels] = useState<TChannel[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      if (!user) {
        router.push("/")
      }
    })

    return () => unsubscribe()
  }, [router])

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
      const fetchedChannels: TChannel[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          capacity: data.capacity,
          members: data.members,
          name: data.name,
          numMembers: data.numMembers,
          order: data.order,
          updatedAt: data.updatedAt,
        }
      })
      setFetchedChannels(fetchedChannels)
    }
  }, [snapshot, loading, error, messageDialog])

  return isAuthenticated ? fetchedChannels : null
}

export default useFetchChannelsInRealTime
