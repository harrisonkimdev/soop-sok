import { responseBadRequest, responseNotFound } from "../(responses)"
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
      return responseNotFound("private chat")
    }
    // if a private chat already exists, return the chat ID
    else {
      return responseBadRequest(
        `Private chat already exists with the id of ${querySnapshot.docs[0].id}`,
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
  const mId = searchParams.get("myId")
  const fId = searchParams.get("friendId")

  try {
    // create a new private chat between the two users
    const privateChatRef = firestore.collection("private_chats")
    const chatRef = await privateChatRef.add({
      from: mId,
      to: fId,
      createdAt: FieldValue.serverTimestamp(),
    })

    // log the chat ID and return a success message
    console.log("New private chat created with id:", chatRef.id)
    return NextResponse.json(
      { message: "Private chat created successfully!", chatId: chatRef.id },
      { status: 201 },
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
