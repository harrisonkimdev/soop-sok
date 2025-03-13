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
  const bannerRef = firestore.collection("banners")
  const bannerQuery = bannerRef.where("selected", "==", true)
  try {
    const res = await bannerQuery.get()

    if (res.empty) {
      responseNotFound("banner")
    }

    const banner = res.docs[0].data() as TBanner
    return responseFetched(banner)
  } catch (error) {
    return responseServerError(error)
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { cid, content, tagOptions } = await req.json()

  try {
    await firestore.collection("banners").add({
      cid,
      content,
      createdAt: FieldValue.serverTimestamp(),
      selected: false,
      tagOptions,
    })
    return responseCreated("banner")
  } catch (error) {
    return responseServerError(error)
  }
}
