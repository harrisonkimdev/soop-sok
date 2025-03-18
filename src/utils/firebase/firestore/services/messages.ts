import { fetchWithAuth } from "./fetchWithAuth"

export async function sendMessage(
  uid: string,
  cid: string,
  message: string,
): Promise<any> {
  try {
    const response = await fetchWithAuth("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, cid, message }),
    })

    if (!response.ok) throw new Error(`Error: ${response.statusText}`)

    const sendMessageAck = await response.json()
    console.log(sendMessageAck)
    return sendMessageAck
  } catch (err) {
    console.error("Failed to send message:", err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}
