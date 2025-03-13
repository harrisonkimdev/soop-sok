import { responseCreated, responseServerError } from "../(responses)"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { senderId, friendId } = await req.json()

  try {
    firestore.collection("friend_list").add({
      createdAt: FieldValue.serverTimestamp(),
      friendId,
      senderId,
    })

    return responseCreated("friend")
  } catch (error) {
    return responseServerError(error)
  }
}
