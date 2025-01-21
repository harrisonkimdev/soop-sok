import { TChat } from "@/app/types"
import useDialogs from "@/utils/dispatcher"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

type TProps = {
  channelId: string
}

const useFirebaseHookChats = (props: TProps): TChat[] | null => {
  const { messageDialog } = useDialogs()
  const [fetchedChats, setFetchedChats] = useState<TChat[]>([])

  const isAuthenticated = useAuthCheck()

  // Fetch channle data in real time only if a user is authorized.
  const chatsRef = collection(firestore, "chats")
  const chatsQuery = query(chatsRef, where("cid", "==", props.channelId))
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
      const fetchedChats: TChat[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          capacity: data.capacity,
          cid: data.cid,
          createdAt: data.createdAt,
          isPrivate: data.isPrivate,
          members: data.members,
          name: data.name,
          numMembers: data.numMembers,
          password: data.password,
          tag: data.tag,
          updatedAt: data.updatedAt,
        }
      })
      setFetchedChats(fetchedChats)
    }
  }, [snapshot, loading, error, messageDialog])

  return isAuthenticated ? fetchedChats : null
}

export default useFirebaseHookChats
