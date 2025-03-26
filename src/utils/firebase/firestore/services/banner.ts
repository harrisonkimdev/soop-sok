import { fetchWithAuth } from "./fetchWithAuth"
import { TBanner } from "@/app/types"

export async function addBanner(
  cid: string,
  content: string,
  tagOptions: string[],
): Promise<boolean> {
  try {
    const addBannerAck = await fetchWithAuth("/api/banners", {
      method: "POST",
      body: JSON.stringify({ cid, content, tagOptions }),
    })
    console.log(addBannerAck)
    return true
  } catch (err) {
    console.error(err)
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}

export async function getBanner(): Promise<TBanner | null> {
  try {
    const banner = await fetchWithAuth("/api/banners", { method: "GET" })
    return banner
  } catch (err) {
    throw new Error(
      `Firestore 작업 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류 발생..."}`,
    )
  }
}
