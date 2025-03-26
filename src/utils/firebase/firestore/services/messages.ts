import { fetchWithAuth } from "./fetchWithAuth"

export async function sendMessage(
  uid: string,
  cid: string,
  message: string,
): Promise<any> {
  try {
    const data = await fetchWithAuth("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, cid, message }),
    })

    return data
  } catch (err) {
    console.error("Failed to send message:", err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}
