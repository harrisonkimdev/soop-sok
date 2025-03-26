import { TBanner } from "@/app/types"
import { useAppState } from "@/utils/global-states/AppStateProvider"
import { useMemo } from "react"

const useDialogs = (): {
  actionsDialog: {
    show: (type: "confirm" | "") => void
    hide: () => void
    setResponse: (option: boolean) => void
  }
  messageDialog: {
    show: (
      type:
        | "data_retrieval"
        | "data_update"
        | "signin"
        | "general"
        | "network_error"
        | "access_denied"
        | "already_in_channel",
    ) => void
    hide: () => void
  }
  channelState: {
    set: (cid: string | null) => void
  }
  bannerState: {
    set: (banner: TBanner | null) => void
  }
} => {
  const { dispatch } = useAppState()

  const actionsDialog = useMemo(
    () => ({
      show: (type: "confirm" | ""): void => {
        dispatch({
          type: "SHOW_ACTIONS_DIALOG",
          payload: { show: true, type },
        })
      },
      hide: (): void => {
        dispatch({
          type: "SHOW_ACTIONS_DIALOG",
          payload: { show: false, type: null },
        })
      },
      setResponse: (option: boolean): void => {
        dispatch({ type: "SET_ACTIONS_DIALOG_RESPONSE", payload: option })
      },
    }),
    [dispatch],
  )

  const messageDialog = useMemo(
    () => ({
      show: (
        type:
          | "data_retrieval"
          | "data_update"
          | "signin"
          | "general"
          | "network_error"
          | "access_denied"
          | "already_in_channel",
      ): void => {
        dispatch({
          type: "SHOW_MESSAGE_DIALOG",
          payload: { show: true, type },
        })
      },
      hide: (): void => {
        dispatch({
          type: "SHOW_MESSAGE_DIALOG",
          payload: { show: false, type: null },
        })
      },
    }),
    [dispatch],
  )

  const channelState = useMemo(
    () => ({
      set: (cid: string | null): void => {
        dispatch({ type: "SET_CHANNEL_ID", payload: cid })
      },
    }),
    [dispatch],
  )

  const bannerState = useMemo(
    () => ({
      set: (banner: TBanner | null): void => {
        if (banner !== null) {
          dispatch({ type: "SET_CURRENT_BANNER", payload: banner })
        } else {
          dispatch({ type: "SET_CURRENT_BANNER", payload: null as any })
        }
      },
    }),
    [dispatch],
  )

  return {
    actionsDialog,
    messageDialog,
    channelState,
    bannerState,
  }
}

export default useDialogs
