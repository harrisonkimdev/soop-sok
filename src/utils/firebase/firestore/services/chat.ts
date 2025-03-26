import { fetchWithAuth } from "./fetchWithAuth"

export async function createChat(
  cid: string,
  uid: string,
  capacity: number,
  name: string,
  tag: string,
  isPrivate: boolean,
  password: string,
): Promise<string> {
  try {
    const data = await fetchWithAuth("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        cid,
        uid,
        capacity,
        name,
        tag,
        isPrivate,
        password,
      }),
    })
    return data.id
  } catch (err) {
    console.error(err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}

export async function updateChat(
  cid: string,
  uid: string,
  action: string,
): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/chats/${cid}?action=${action}`, {
      method: "PUT",
      body: JSON.stringify({ uid }),
    })
    console.log(ack.message)
    return true
  } catch (err) {
    console.error(err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}
