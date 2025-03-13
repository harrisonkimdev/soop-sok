import { TBanner } from "@/app/types"
import { useAppState } from "@/utils/global-states/AppStateProvider"
import { useMemo } from "react"

interface DialogComponentProps {
  show: boolean
  handleClose: () => void
  type: string | null
  message: string
}

const useDialogs = (): {
  actionsDialog: {
    show: (type: "confirm" | "") => void
    hide: () => void
    setResponse: (option: boolean) => void
  }
  messageDialog: DialogComponentProps
  showMessageDialog: (type: string, message: string) => void
  hideMessageDialog: () => void
  channelState: {
    set: (cid: string | null) => void
  }
  bannerState: {
    set: (banner: TBanner) => void
  }
} => {
  const { state, dispatch } = useAppState()

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

  const messageDialogMemo = useMemo(
    () => ({
      show: state.showMessageDialog,
      type: state.messageDialogType,
      message: state.messageDialogMessage || "",
      handleClose: () =>
        dispatch({
          type: "SHOW_MESSAGE_DIALOG",
          payload: { show: false, type: null, message: null },
        }),
    }),
    [
      state.showMessageDialog,
      state.messageDialogType,
      state.messageDialogMessage,
      dispatch,
    ],
  )

  const showMessageDialog = useMemo(
    () => (type: string, message: string) =>
      dispatch({
        type: "SHOW_MESSAGE_DIALOG",
        payload: { show: true, type, message },
      }),
    [dispatch],
  )

  const hideMessageDialog = useMemo(
    () => () =>
      dispatch({
        type: "SHOW_MESSAGE_DIALOG",
        payload: { show: false, type: null, message: null },
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
      set: (banner: TBanner): void => {
        dispatch({ type: "SET_CURRENT_BANNER", payload: banner })
      },
    }),
    [dispatch],
  )

  return {
    actionsDialog,
    messageDialog: messageDialogMemo,
    showMessageDialog,
    hideMessageDialog,
    channelState,
    bannerState,
  }
}

export default useDialogs
