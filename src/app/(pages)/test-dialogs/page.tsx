"use client"

import MUIActionsDialog from "@/app/(components)/dialogs/MUIActionsDialog"
import MUIMessageDialog from "@/app/(components)/dialogs/MUIMessageDialog"
import { useAppState } from "@/utils/global-states/AppStateProvider"
import { Button } from "@mui/material"
import { JSX } from "react"

const Page = (): JSX.Element => {
  const { state, dispatch } = useAppState()

  // 테스트 버튼들
  const testButtons = (
    <div className="mb-4 flex gap-2">
      <Button
        variant="contained"
        onClick={() =>
          dispatch({
            type: "SHOW_ACTIONS_DIALOG",
            payload: { show: true, type: "confirm" },
          })
        }
        className="bg-blue-500"
      >
        Test Confirm Dialog
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          dispatch({
            type: "SHOW_MESSAGE_DIALOG",
            payload: { show: true, type: "data_retrieval" },
          })
        }}
        className="bg-green-500"
      >
        Test Error Dialog
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          dispatch({
            type: "SHOW_MESSAGE_DIALOG",
            payload: { show: true, type: "signin" },
          })
        }}
        className="bg-red-500"
      >
        Test Sign In Error
      </Button>
    </div>
  )
  return (
    <>
      {testButtons}

      {/* 다이얼로그 컴포넌트들 */}
      <MUIActionsDialog
        show={state.showActionsDialog}
        handleClose={() =>
          dispatch({
            type: "SHOW_ACTIONS_DIALOG",
            payload: { show: false, type: null },
          })
        }
        type={state.actionsDialogType}
      />
      <MUIMessageDialog
        show={state.showMessageDialog}
        handleClose={() =>
          dispatch({
            type: "SHOW_MESSAGE_DIALOG",
            payload: { show: false, type: null },
          })
        }
        type={state.messageDialogType}
      />
    </>
  )
}

export default Page
