"use client"

import { BaseDialog } from "./BaseDialog"
import { DIALOG_MESSAGES } from "./dialogScript"
import {
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material"
import { useState, useEffect, JSX } from "react"

type MessageDialogProps = {
  show: boolean
  type: string | null
  handleClose: (
    event: object,
    reason: "backdropClick" | "escapeKeyDown",
  ) => void
}

const MUIMessageDialog = ({
  show,
  type,
  handleClose,
}: MessageDialogProps): JSX.Element => {
  const [content, setContent] = useState(DIALOG_MESSAGES.GENERAL_ERROR)

  useEffect(() => {
    switch (type) {
      case "data_retrieval":
        setContent(DIALOG_MESSAGES.DATA_RETRIEVAL)
        break
      case "data_update":
        setContent(DIALOG_MESSAGES.DATA_UPDATE)
        break
      case "signin":
        setContent(DIALOG_MESSAGES.SIGN_IN)
        break
      default:
        setContent(DIALOG_MESSAGES.GENERAL_ERROR)
    }
  }, [type])

  return (
    <BaseDialog show={show} handleClose={handleClose}>
      <DialogTitle className="font-bold">{content.title}</DialogTitle>
      <DialogContent className="flex flex-col gap-2">
        <Typography gutterBottom>{content.message}</Typography>
        <Typography gutterBottom>
          If the problem persists, feel free to contact support for assistance.
        </Typography>
        <DialogActions className="justify-center">
          <Button onClick={() => handleClose({}, "backdropClick")}>OK</Button>
        </DialogActions>
      </DialogContent>
    </BaseDialog>
  )
}

export default MUIMessageDialog
