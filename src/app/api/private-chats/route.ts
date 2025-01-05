import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  // extract the user ids from the query parameters
  const mId = searchParams.get("myId")
  const fId = searchParams.get("friendId")
  console.log("mId:", mId, "fId:", fId)

  // query for the private chat between the two users
  const privateChatRef = firestore.collection("private_chats")
  const q = privateChatRef
    .where("from", "in", [mId, fId])
    .where("to", "in", [mId, fId])

  try {
    // check if a private chat already exists
    console.log("Checking for existing private chat")
    const querySnapshot = await q.get()

    // if no private chat exists, return a message indicating that the chat does not exist
    if (querySnapshot.empty) {
      console.log("No existing private chat found")
      return NextResponse.json(
        { message: "chat does not exist!" },
        { status: 200 },
      )
    }
    // if a private chat already exists, return the chat ID
    else {
      console.log("Private chat already exists")
      return NextResponse.json(
        { message: "chat exists!", id: querySnapshot.docs[0].id },
        { status: 200 },
      )
    }
  } catch (err) {
    // handle any errors that occur during the process
    console.error("Error checking or creating private chat:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // extract the user ids from the query parameters
  const searchParams = req.nextUrl.searchParams

  try {
    // extract the user ids from the query parameters
    const mId = searchParams.get("myId")
    const fId = searchParams.get("friendId")

    // reference to the private chats collection
    const privateChatRef = firestore.collection("private_chats")

    // create a new private chat between the two users
    const chatRef = await privateChatRef.add({
      from: mId,
      to: fId,
      createdAt: FieldValue.serverTimestamp(),
    })

    // log the chat ID and return a success message
    console.log("New private chat created with id:", chatRef.id)
    return NextResponse.json(
      { message: "private chat created!", id: chatRef.id },
      { status: 200 },
    )
  } catch (error) {
    // handle any errors that occur during the process
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
