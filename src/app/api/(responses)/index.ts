import { FirebaseFirestore } from "@firebase/firestore-types"
import { NextResponse } from "next/server"

/**
 * Returns a 200 success response with an optional message.
 * If no message is provided, the default message "Success" is used.
 * @param message - An optional message to include in the success response.
 * @returns A 200 success response with an optional message or the default message.
 */
export const responseFetched = (
  data: FirebaseFirestore.DocumentData | boolean | undefined,
): NextResponse =>
  NextResponse.json(
    {
      data,
    },
    { status: 200 },
  )

/**
 * Returns a 200 success response with an optional message.
 * If no message is provided, the default message "Success" is used.
 * @param message - An optional message to include in the success response.
 * @returns A 200 success response with an optional message or the default message.
 */
export const responseUpdated = (message?: string): NextResponse =>
  NextResponse.json(
    {
      message: message || "Updated",
    },
    { status: 200 },
  )

/**
 * Returns a 200 success response with an optional message.
 * If no message is provided, the default message "Success" is used.
 * @param message - An optional message to include in the success response.
 * @returns A 200 success response with an optional message or the default message.
 */
export const responseDeleted = (message?: string): NextResponse =>
  NextResponse.json(
    {
      message: message || "Deleted",
    },
    { status: 200 },
  )

/**
 * Returns a 200 success response with an optional message.
 * If no message is provided, the default message "Success" is used.
 * @param message - An optional message to include in the success response.
 * @returns A 200 success response with an optional message or the default message.
 */
export const responseSuccess = (message?: string): NextResponse =>
  NextResponse.json(
    {
      message: message || "Success",
    },
    { status: 200 },
  )

/**
 * Returns a 201 created response with an optional message and id.
 * @param type - The type of the resource that was created.
 * @param id - The id of the resource that was created.
 * @param timestamp - The timestamp of the resource that was created.
 * @returns A 201 created response with an optional message and id.
 */
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

/**
 * Returns a 400 error response with an optional message.
 * If no message is provided, the default message "Bad request" is used.
 * @param message - An optional message to include in the error response.
 * @returns A 400 error response with an optional message or the default message.
 */
export const responseBadRequest = (message?: string): NextResponse =>
  NextResponse.json({ error: message }, { status: 400 })

/**
 * Returns a 401 error response.
 * @returns A 401 error response.
 */
export const responseUnauthorized = NextResponse.json({}, { status: 401 })

/**
 * Returns a 403 error response.
 * @returns A 403 error response.
 */
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

/**
 * Returns a 409 error response.
 * @returns A 409 error response.
 */
export const responseConflict = NextResponse.json({}, { status: 409 })

/**
 * Returns a 500 error response with an optional error message.
 * If no message is provided, the default message "Internal Server Error" is used.
 * @param error - An optional error message to include in the error response.
 * @returns A 500 error response with an optional error message or the default message.
 */
export const responseServerError = (error: unknown): NextResponse =>
  NextResponse.json(
    {
      error: `Internal Server Error - ${error}`,
    },
    { status: 500 },
  )
