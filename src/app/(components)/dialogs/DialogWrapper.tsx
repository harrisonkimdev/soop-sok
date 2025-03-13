"use client"

import MUIActionsDialog from "./MUIActionsDialog"
import MUIMessageDialog from "./MUIMessageDialog"
import { useAppState } from "@/utils/global-states/AppStateProvider"
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material"
import type { JSX } from "react"

interface DialogWrapperProps {
  show: boolean
  handleClose: () => void
  message: string
}

const DialogWrapper = ({
  show,
  handleClose,
  message,
}: DialogWrapperProps): JSX.Element => {
  const { state, dispatch } = useAppState()

  return (
    <>
      <MUIMessageDialog
        show={state.showMessageDialog}
        handleClose={() => {
          dispatch({
            type: "SHOW_MESSAGE_DIALOG",
            payload: { show: false, type: null, message: null },
          })
        }}
        type={state.messageDialogType}
        message={state.messageDialogMessage}
      />

      <MUIActionsDialog
        show={state.showActionsDialog}
        handleClose={() => {
          dispatch({
            type: "SHOW_ACTIONS_DIALOG",
            payload: { show: false, type: null },
          })
        }}
        type={state.actionsDialogType}
      />

      <Dialog open={show} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogWrapper
