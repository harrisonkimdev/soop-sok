import Dialog from "@mui/material/Dialog"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import React from "react"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export type BaseDialogProps = {
  show: boolean
  handleClose: (
    event: object,
    reason: "backdropClick" | "escapeKeyDown",
  ) => void
  children: React.ReactNode
}

export const BaseDialog = ({
  show,
  handleClose,
  children,
}: BaseDialogProps): React.JSX.Element => {
  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      {children}
    </Dialog>
  )
}
