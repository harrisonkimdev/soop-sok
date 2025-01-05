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

    return NextResponse.json(
      { message: "Friend successfully added!" },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
