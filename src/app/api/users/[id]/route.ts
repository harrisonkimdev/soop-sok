import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<NextResponse> {
  const id = (await params).id
  if (!id) {
    return NextResponse.json({ error: "No user ID provided" }, { status: 400 })
  }

  try {
    const userRef = firestore.collection("users").doc(id)
    const res = await userRef.get()
    if (!res.exists) {
      return NextResponse.json({ error: "No user found" }, { status: 404 })
    }

    return NextResponse.json(res.data(), { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}

export async function POST(
  req: NextRequest,
  params: { id: string },
): Promise<NextResponse> {
  const id = params.id
  const body = await req.json()
  const { displayName, email, photoURL } = body
  if (!displayName || !email || !photoURL) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    )
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

    return NextResponse.json({ message: "User registered!" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}

export async function PUT(
  req: NextRequest,
  params: { id: string },
): Promise<NextResponse> {
  const id = params.id
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
        return NextResponse.json(
          { error: "Missing user data" },
          { status: 400 },
        )
      }
      await userRef.update(user)
    }

    return NextResponse.json(
      { message: "User status updated!" },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
