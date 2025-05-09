import Cookies from "universal-cookie"

const cookies = new Cookies()
const token = cookies.get("auth-token")

export async function fetchWithAuth(
  url: string,
  // eslint-disable-next-line no-undef
  options: RequestInit,
): Promise<any> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || "Request failed")
    }
    return data
  } catch (err) {
    console.error(err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}
