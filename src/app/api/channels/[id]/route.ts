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
  // Getting channel id from the URL using dynamic route.
  const cid = (await params).id
  // Getting action from the URL query parameters.
  const action = req.nextUrl.searchParams.get("action")
  // Getting user id from the request body.
  const { uid } = await req.json()
  console.log(
    `Backend code running with the given channel ID: ${cid}, User ID: ${uid}, Action: ${action}...`,
  )

  // Getting the channel document from the firestore collection.
  const channelRef = firestore.collection("channels").doc(cid)

  try {
    const channelDoc = await channelRef.get()
    const channelData = channelDoc.data()
    console.log("Channel data:", channelData)
    if (!channelData) return responseNotFound()

    // Checking if the action is "enter" or "leave".
    if (action === "enter") {
      // Checking if the user is already in the channel.
      if (channelData.members.includes(uid)) {
        return responseBadRequest("User already in the channel")
      }

      // Adding the user to the channel.
      const newMembers = [...channelData.members, uid]
      // Updating the number of members in the channel.
      const newNumMembers = channelData.numMembers + 1
      console.log(
        `Updating the channel document with the new members ${newMembers} and number of members ${newNumMembers}...`,
      )
      // Updating the channel document with the new members and number of members.
      await channelRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    // Checking if the action is "leave".
    else if (action === "leave") {
      // Checking if the user is not a member of the channel.
      if (!channelData.members.includes(uid)) {
        return responseBadRequest(
          "Sorry, we lost you in the system. Resetting your session...",
        )
      }

      // Removing the user from the channel.
      const newMembers = channelData.members.filter(
        (member: string) => member !== uid,
      )
      // Updating the number of members in the channel.
      const newNumMembers = channelData.numMembers - 1
      console.log(
        `Updating the channel document with the new members ${newMembers} and number of members ${newNumMembers}...`,
      )
      // Updating the channel document with the new members and number of members.
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
