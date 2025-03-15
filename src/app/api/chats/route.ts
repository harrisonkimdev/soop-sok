import { responseCreated, responseServerError } from "@/app/api/(responses)"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { uid, capacity, cid, isPrivate, name, password, tag } =
      await req.json()

    const chatDoc = await firestore.collection("chats").add({
      capacity,
      cid,
      createdAt: FieldValue.serverTimestamp(),
      isPrivate,
      members: [uid],
      name,
      numMembers: 1,
      password,
      tag,
      updatedAt: FieldValue.serverTimestamp(),
    })

    return responseCreated("chat", chatDoc.id)
  } catch (error) {
    return responseServerError(error)
  }
}
