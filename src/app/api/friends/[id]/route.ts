import { responseFetched, responseServerError } from "@/app/api/(responses)"
import { firestore } from "@/utils/firebase/firebaseAdmin"
import { Filter } from "firebase-admin/firestore"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const friendId = (await params).id
  const searchParams = req.nextUrl.searchParams
  const senderId = searchParams.get("senderId")
  const friendRef = firestore.collection("friend_list")

  try {
    const res = await friendRef
      .where(
        Filter.or(
          Filter.and(
            Filter.where("senderId", "==", senderId),
            Filter.where("friendId", "==", friendId),
          ),
          Filter.and(
            Filter.where("senderId", "==", friendId),
            Filter.where("friendId", "==", senderId),
          ),
        ),
      )
      .get()

    const isMyFriend = res.empty ? false : true
    return responseFetched(isMyFriend)
  } catch (error) {
    return responseServerError(error)
  }
}
