"use client"

import { BaseDialog } from "./BaseDialog"
import { DIALOG_MESSAGES } from "./dialogScript"
import { DialogTitle, DialogContent, Typography } from "@mui/material"
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
      <DialogTitle>{content.title}</DialogTitle>
      <DialogContent>
        {/* TODO: 아래 두개 간격을 좀 띄우면 어떨까 싶다. */}
        <Typography gutterBottom>{content.message}</Typography>
        <Typography gutterBottom>
          If the problem persists, feel free to contact support for assistance.
        </Typography>
      </DialogContent>
    </BaseDialog>
  )
}

export default MUIMessageDialog
