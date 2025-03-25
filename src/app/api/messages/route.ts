import { responseCreated, responseServerError } from "../(responses)"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { uid, cid, message } = await req.json()

  try {
    await firestore.collection("messages").add({
      uid,
      cid,
      message,
      createdAt: FieldValue.serverTimestamp(),
    })

    return responseCreated("message")
  } catch (error) {
    return responseServerError(error)
  }
}
