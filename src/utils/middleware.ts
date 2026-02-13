import { auth } from "@/utils/firebase/firebaseAdmin"
import { NextRequest, NextResponse } from "next/server"

// 공개 경로 정의
const PUBLIC_FILE_PATHS = [
  "/login",
  "/signup",
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
]

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname
  const isPublicPath = PUBLIC_FILE_PATHS.some(
    (p) => path === p || path.startsWith(p),
  )

  const token = req.cookies.get("auth-token")?.value

  // 인증된 사용자의 로그인/회원가입 페이지 접근 방지
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/channels", req.url))
  }

  // 인증 필요한 페이지에 토큰 없을 때 리다이렉트
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // API 요청에 대한 토큰 검증
  if (path.startsWith("/api")) {
    const authHeader = req.headers.get("Authorization")
    const apiToken = authHeader ? authHeader.split("Bearer ")[1] : null

    if (!apiToken) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      )
    }

    try {
      const decodedToken = await auth.verifyIdToken(apiToken)
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

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 모든 경로에 대해 미들웨어 적용 (API 제외)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // API 경로에 대한 추가 매처
    "/api/(?!users$).*",
    "/api/users(?!$|/.*$|\\?.*$)",
    "/api/users(?!\\?.*$)",
    "/api/users(?!$|/.*$|\\?.*$):path*",
  ],
}
