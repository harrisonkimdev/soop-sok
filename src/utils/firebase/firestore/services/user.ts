import { fetchWithAuth } from "./fetchWithAuth"
import { TUser } from "@/app/types"

export async function registerUserWithUID(
  displayName: string,
  email: string,
  photoURL: string,
  uid: string,
): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/users/${uid}`, {
      method: "POST",
      body: JSON.stringify({ displayName, email, photoURL }),
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

export async function updateUserStatus(
  uid: string,
  status: string,
): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/users/${uid}?type=${status}`, {
      method: "PUT",
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

export async function updateUserProfile(
  uid: string,
  user: TUser,
): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/users/${uid}`, {
      method: "PUT",
      body: JSON.stringify({ user }),
    })
    console.log("updateUserProfile >> ", ack.message)
    return true
  } catch (err) {
    console.error(err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}

export async function fetchUser(uid: string): Promise<TUser> {
  try {
    const user = await fetchWithAuth(`/api/users/${uid}`, { method: "GET" })
    console.log("fetchUser", user)
    return user
  } catch (err) {
    console.error(err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}
