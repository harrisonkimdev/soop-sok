"use client"

import { BaseDialog } from "./BaseDialog"
import { DIALOG_MESSAGES } from "./dialogScript"
import { useAppState } from "@/utils/global-states/AppStateProvider"
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material"
import { useState, useEffect, JSX } from "react"

type MUIActionsDialogProps = {
  show: boolean
  handleClose: (
    event: object,
    reason: "backdropClick" | "escapeKeyDown",
  ) => void
  type: string | null
}

const MUIActionsDialog = ({
  show,
  handleClose,
  type,
}: MUIActionsDialogProps): JSX.Element => {
  const [content, setContent] = useState(DIALOG_MESSAGES.CONFIRM)
  const { dispatch } = useAppState()

  useEffect(() => {
    if (type === "confirm") {
      setContent(DIALOG_MESSAGES.CONFIRM)
    }
  }, [type])

  const handleCloseWithButton = (): void => {
    dispatch({
      type: "SHOW_ACTIONS_DIALOG",
      payload: { show: false, type: null },
    })
  }

  const handleButtonClick = (): void => {
    dispatch({ type: "SET_ACTIONS_DIALOG_RESPONSE", payload: true })
  }

  return (
    <BaseDialog show={show} handleClose={handleClose}>
      <DialogTitle>{content.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseWithButton}>Cancel</Button>
        <Button onClick={handleButtonClick}>{content.buttonText}</Button>
      </DialogActions>
    </BaseDialog>
  )
}

export default MUIActionsDialog
