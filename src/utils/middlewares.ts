import { auth } from "@/utils/firebase/firebaseAdmin"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("Authorization")
  const token = authHeader ? authHeader.split("Bearer ")[1] : null

  if (!token) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
  }

  try {
    const decodedToken = await auth.verifyIdToken(token)
    req.headers.set("userId", decodedToken.uid)
    return NextResponse.next()
  } catch (error) {
    console.error("Token verification failed:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

export const config = {
  matcher: ["/api/:path*"], // Apply middleware to all /api paths
}
