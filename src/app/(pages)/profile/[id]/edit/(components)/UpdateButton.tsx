import { auth } from "@/utils/firebase/firebase"
import useDialogs from "@/utils/global-states/dispatcher"
import { Button } from "@mui/material"
import Link from "next/link"
import React, { useCallback } from "react"
import type { JSX } from "react"

const UpdateButtons = React.memo((): JSX.Element => {
  const { actionsDialog } = useDialogs()

  const askConfirm = useCallback(() => {
    actionsDialog.show("confirm")
  }, [actionsDialog])

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <Link href={`/profile/${auth.currentUser?.uid}`}>
        <Button variant="outlined" className="w-full">
          {" "}
          Cancel{" "}
        </Button>
      </Link>
      <Button onClick={askConfirm} variant="outlined">
        {" "}
        Update{" "}
      </Button>
    </div>
  )
})

UpdateButtons.displayName = "UpdateButtons"

export default UpdateButtons
