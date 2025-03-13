import { FirebaseFirestore } from "@firebase/firestore-types"
import { NextResponse } from "next/server"

export const responseFetched = (
  data: FirebaseFirestore.DocumentData | boolean | undefined,
): NextResponse =>
  NextResponse.json(
    {
      data,
    },
    { status: 200 },
  )

export const responseUpdated = (type?: "chat" | "user"): NextResponse =>
  NextResponse.json(
    {
      message: `${type} Updated.`,
    },
    { status: 200 },
  )

export const responseDeleted = (): NextResponse =>
  NextResponse.json(
    {
      message: "Deleted",
    },
    { status: 200 },
  )

export const responseSuccess = (): NextResponse =>
  NextResponse.json(
    {
      message: "Success",
    },
    { status: 200 },
  )

export const responseCreated = (
  type: "banner" | "chat" | "channel" | "user" | "friend" | "message",
  id?: string,
  timestamp?: string,
): NextResponse =>
  NextResponse.json(
    {
      message: `A new ${type} has been created!`,
      id,
      timestamp,
    },
    { status: 201 },
  )

export const responseServerError = (error: unknown): NextResponse => {
  return NextResponse.json(
    {
      error: `Internal Server Error - ${error}`,
    },
    { status: 500 },
  )
}

/**
 * Returns a 400 error response with an optional message.
 * If no message is provided, the default message "Bad request" is used.
 * @param message - An optional message to include in the error response.
 * @returns A 400 error response with an optional message or the default message.
 */
export const responseBadRequest = (message?: string): NextResponse =>
  NextResponse.json({ error: message }, { status: 400 })

export const responseUnauthorized = NextResponse.json({}, { status: 401 })

export const responseForbidden = NextResponse.json({}, { status: 403 })

/**
 * Returns a 404 error response with an optional message.
 * If no message is provided, the default message "Not found" is used.
 * @param message - An optional message to include in the error response.
 * @returns A 404 error response with an optional message or the default message.
 */
export const responseNotFound = (type?: string): NextResponse => {
  return NextResponse.json(
    {
      error: type
        ? `${type.charAt(0).toUpperCase() + type.slice(1)} Not Found.`
        : "Not Found.",
    },
    { status: 404 },
  )
}

export const responseConflict = NextResponse.json({}, { status: 409 })
