"use client"

import { TBanner } from "@/app/types"
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react"
import type { JSX } from "react"

interface AppState {
  publicChatURL: string
  privateChatURL: string
  currentBanner: TBanner | null
  channelId: string | null
}

type Action =
  | {
      type: "SET_PUBLIC_URL"
      payload: string
    }
  | {
      type: "SET_PRIVATE_URL"
      payload: string
    }
  | {
      type: "SET_CURRENT_BANNER"
      payload: TBanner
    }
  | {
      type: "SET_CHANNEL_ID"
      payload: string | null
    }

const initialState: AppState = {
  publicChatURL: "/channels",
  privateChatURL: "/private-chats",
  currentBanner: null,
  channelId: null,
}

const AppStateContext = createContext<
  | {
      state: AppState
      dispatch: React.Dispatch<Action>
    }
  | undefined
>(undefined)

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_PUBLIC_URL":
      return { ...state, publicChatURL: action.payload }
    case "SET_PRIVATE_URL":
      return { ...state, privateChatURL: action.payload }
    case "SET_CURRENT_BANNER":
      return { ...state, currentBanner: action.payload }
    case "SET_CHANNEL_ID":
      return { ...state, channelId: action.payload }
    default:
      return state
  }
}

export const AppStateProvider = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  const [state, dispatch] = useReducer(appStateReducer, initialState)

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  )
}

export const useAppState = (): {
  state: AppState
  dispatch: React.Dispatch<Action>
} => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
