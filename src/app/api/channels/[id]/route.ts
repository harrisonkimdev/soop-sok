import {
  responseBadRequest,
  responseNotFound,
  responseServerError,
  responseUpdated,
} from "@/app/api/(responses)"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  // Dynamic route from the URL
  const cid = (await params).id
  // Query parameters from the URL
  const action = req.nextUrl.searchParams.get("action")
  // Through the request body
  const { uid } = await req.json()
  console.log(`Channel ID: ${cid}, User ID: ${uid}, Action: ${action}`)

  const channelRef = firestore.collection("channels").doc(cid)

  try {
    const channelDoc = await channelRef.get()
    const channelData = channelDoc.data()
    if (!channelData) return responseNotFound()
    console.log("Channel data:", channelData)

    if (action === "enter") {
      if (channelData.members.includes(uid)) {
        return responseBadRequest("User already in the channel")
      }

      const newMembers = [...channelData.members, uid]
      console.log("New members:", newMembers)

      const newNumMembers = channelData.numMembers + 1
      console.log("New number of members:", newNumMembers)

      await channelRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })
    } else if (action === "leave") {
      if (!channelData.members.includes(uid)) {
        return responseBadRequest("User is not a member of the channel")
      }

      const newMembers = channelData.members.filter(
        (member: string) => member !== uid,
      )
      const newNumMembers = channelData.numMembers - 1
      console.log(`New members (${newNumMembers}): ${newMembers}`)

      await channelRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })

      await channelRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    return responseUpdated()
  } catch (error) {
    return responseServerError(error)
  }
}
