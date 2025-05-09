import {
  responseCreated,
  responseFetched,
  responseNotFound,
  responseServerError,
} from "@/app/api/(responses)"
import { TBanner } from "@/app/types"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
  // TODO: need to work on the banner selection logic.
  // BTW, this is different firestore library from the client-side
  const bannerRef = firestore.collection("banners")
  const bannerQuery = bannerRef.where("selected", "==", true).limit(1)

  try {
    const res = await bannerQuery.get()

    if (res.empty) responseNotFound("banner")

    const banner = res.docs[0].data() as TBanner
    return responseFetched(banner)
  } catch (error) {
    return responseServerError(error)
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { cid, title, tagOptions, uid } = await req.json()

  try {
    await firestore.collection("banners").add({
      cid,
      title,
      selected: false,
      tagOptions,
      uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return responseCreated("banner")
  } catch (error) {
    return responseServerError(error)
  }
}
