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
    if (!channelData) {
      console.error("Channel does not exist")
      return NextResponse.json(
        { error: "Channel does not exist" },
        { status: 404 },
      )
    }
    console.log("Channel data:", channelData)

    if (action === "enter") {
      if (channelData.members.includes(uid)) {
        console.log("User already in the channel")
        return NextResponse.json(
          { error: "User already in the channel" },
          { status: 400 },
        )
      }

      const newMembers = [...channelData.members, uid]
      const newNumMembers = channelData.numMembers + 1
      console.log("New members:", newMembers)
      console.log("New number of members:", newNumMembers)

      await channelRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })
    } else if (action === "leave") {
      if (!channelData.members.includes(uid)) {
        console.error("User is not a member of the channel")
        return NextResponse.json(
          { error: "User is not a member of the channel" },
          { status: 400 },
        )
      }

      const newMembers = channelData.members.filter(
        (member: string) => member !== uid,
      )
      const newNumMembers = channelData.numMembers - 1
      console.log("New members:", newMembers)
      console.log("New number of members:", newNumMembers)

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

    console.log("Chat updated successfully")
    return NextResponse.json(
      { message: "Chat updated successfully!" },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating chat:", error)
    return NextResponse.json(error, { status: 500 })
  }
}
