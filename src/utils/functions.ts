import { FirestoreTimestamp } from "@/app/types"

export const formatTimeAgo = (
  input:
    | FirestoreTimestamp
    | { seconds: number; nanoseconds: number }
    | string
    | undefined,
): string => {
  if (!input) return ""

  let timestamp: number

  // Firebase Timestamp 객체 처리 (seconds, nanoseconds 포함)
  if (input && typeof input === "object" && "seconds" in input) {
    timestamp = input.seconds * 1000
  }
  // 기존 FirestoreTimestamp 처리
  else if (typeof input !== "string" && "_seconds" in input) {
    timestamp = input._seconds * 1000
  }
  // 문자열 입력 처리
  else if (typeof input === "string") {
    try {
      timestamp = new Date(input).getTime()
    } catch {
      return ""
    }
  } else {
    return ""
  }

  const now = Date.now()
  const difference = now - timestamp

  const minutesDifference = Math.floor(difference / (1000 * 60))
  const hoursDifference = Math.floor(minutesDifference / 60)
  const daysDifference = Math.floor(hoursDifference / 24)

  if (minutesDifference < 1) return "just now"
  if (minutesDifference === 1) return "1 minute ago"
  if (minutesDifference < 60) return `${minutesDifference} minutes ago`
  if (hoursDifference === 1) return "1 hour ago"
  if (hoursDifference < 24) return `${hoursDifference} hours ago`
  if (daysDifference === 1) return "1 day ago"
  return `${daysDifference} days ago`
}
