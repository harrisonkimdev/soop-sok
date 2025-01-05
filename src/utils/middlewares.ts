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
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set("userId", decodedToken.uid)
    const modifiedReq = new Request(req.url, {
      headers: requestHeaders,
      method: req.method,
      body: req.body,
      redirect: req.redirect,
    })
    return NextResponse.next({ request: modifiedReq })
  } catch (error) {
    console.error("Token verification failed:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

export const config = {
  // Apply middleware to all /api paths except /api/users (PUT)
  matcher: [
    "/api/(?!users$).*",
    "/api/users(?!$|/.*$|\\?.*$)",
    "/api/users(?!\\?.*$)",
    "/api/users(?!$|/.*$|\\?.*$):path*",
  ],
  methods: ["GET", "POST", "DELETE", "PATCH"],
}
