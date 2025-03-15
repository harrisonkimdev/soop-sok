import {
  responseBadRequest,
  responseServerError,
  responseUpdated,
} from "@/app/api/(responses)"
import { TChat } from "@/app/types"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const chatId = (await params).id
  console.log(`Chat ID: ${chatId}`)
  const { uid } = await req.json()
  console.log(`User ID: ${uid}`)
  const searchParams = req.nextUrl.searchParams

  const chatRef = firestore.collection("chats").doc(chatId)

  try {
    const chatDoc = await chatRef.get()
    const chatData: TChat = chatDoc.data() as TChat
    console.log("Chat data:", chatData)

    if (searchParams.get("action") === "enter") {
      console.log("Action: enter")
      if (chatData.numMembers >= chatData.capacity) {
        return responseBadRequest("chat is full.")
      }

      const newMembers = [...chatData.members, uid]
      const newNumMembers = chatData.numMembers + 1
      console.log("New members:", newMembers)
      console.log("New number of members:", newNumMembers)

      // Add uid to the members and update the number of members in the chat document.
      await chatRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })
    } else if (searchParams.get("action") === "leave") {
      console.log("Action: leave")
      const newMembers = chatData.members.filter((member) => member !== uid)
      const newNumMembers = chatData.numMembers - 1
      console.log("New members:", newMembers)
      console.log("New number of members:", newNumMembers)

      // Remove uid from the members and update the number of members in the chat document.
      await chatRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    return responseUpdated("chat")
  } catch (error) {
    return responseServerError(error)
  }
}
