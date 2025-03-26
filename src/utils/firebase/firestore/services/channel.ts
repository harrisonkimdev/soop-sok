import { fetchWithAuth } from "./fetchWithAuth"

export async function updateChannel(
  cid: string,
  uid: string,
  action: string,
): Promise<boolean> {
  try {
    const res = await fetchWithAuth(`/api/channels/${cid}?action=${action}`, {
      method: "PUT",
      body: JSON.stringify({ uid }),
    })
    console.log(res.message)
    return true
  } catch (err) {
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}
