import {
  responseBadRequest,
  responseCreated,
  responseFetched,
  responseNotFound,
  responseServerError,
  responseUpdated,
} from "@/app/api/(responses)"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  },
): Promise<NextResponse> {
  const id = (await params).id
  if (!id) {
    return responseBadRequest("No user ID provided")
  }

  try {
    const userRef = firestore.collection("users").doc(id)
    const userData = await userRef.get()
    if (!userData.exists) {
      return responseNotFound("user")
    }

    console.log(userData)

    return responseFetched(userData.data())
  } catch (error) {
    return responseServerError(error)
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const id = (await params).id
  const { displayName, email, photoURL } = await req.json()
  if (!displayName || !email || !photoURL) {
    return responseBadRequest("Missing required fields")
  }

  try {
    const userRef = firestore.collection("users").doc(id)
    await userRef.set({
      createdAt: FieldValue.serverTimestamp(),
      displayName,
      email,
      lastLoginTime: FieldValue.serverTimestamp(),
      photoURL,
      profile: {
        introduction: "",
        interests: [],
        mbti: "",
      },
      uid: id,
    })

    return responseCreated("user")
  } catch (error) {
    return responseServerError(error)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const id = (await params).id
  const searchParams = req.nextUrl.searchParams
  const userRef = firestore.collection("users").doc(id)
  const reqType: string | null = searchParams.get("type")

  try {
    // user sign in
    if (reqType === "signin") {
      await userRef.update({
        isOnline: true,
        lastLoginTime: FieldValue.serverTimestamp(),
      })
    }

    // user sign out
    else if (reqType === "signout") {
      await userRef.update({ isOnline: false })
    }

    // user profile update
    else if (reqType === null) {
      const body = await req.json()
      const { user } = body
      if (!user) {
        return responseBadRequest("Missing user data")
      }
      await userRef.update(user)
    }

    return responseUpdated("user")
  } catch (error) {
    return responseServerError(error)
  }
}
