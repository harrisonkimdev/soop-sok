import { fetchWithAuth } from "./fetchWithAuth"

export async function makeFriend(
  friendId: string,
  senderId: string,
): Promise<boolean> {
  try {
    const ack = await fetchWithAuth("/api/friends", {
      method: "POST",
      body: JSON.stringify({ friendId, senderId }),
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

// TODO: can we make it more efficient?
export async function checkIsMyFriend(
  uid: string,
  friendId: string,
): Promise<boolean> {
  try {
    const isMyFriend = await fetchWithAuth(
      `/api/friends/${friendId}?senderId=${uid}`,
      { method: "GET" },
    )
    console.log("checkIsMyFriend", isMyFriend.data)
    return isMyFriend.data
  } catch (err) {
    console.error(err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}
