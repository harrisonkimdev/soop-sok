import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { uid, cid, senderName, senderPhotoURL, message } = await req.json()

  try {
    await firestore.collection("messages").add({
      uid,
      cid,
      senderName,
      senderPhotoURL,
      message,
      createdAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ack: "message sent!" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
