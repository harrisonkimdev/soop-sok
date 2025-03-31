"use client"

import { TextField } from "@mui/material"
import { ChangeEvent, useCallback } from "react"
import type { JSX } from "react"

interface UsernameFieldProps {
  displayName: string | undefined
  updateField: (field: string, value: any, isProfileField: boolean) => void
}

const UsernameField = (props: UsernameFieldProps): JSX.Element => {
  const handleDisplayNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      props.updateField("displayName", e.target.value, false)
    },
    [props],
  )

  return (
    <div className="flex flex-col gap-2">
      <TextField
        id="outlined-basic"
        label="Username"
        variant="outlined"
        value={props.displayName}
        onChange={handleDisplayNameChange}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgb(16 185 129 / 0.5)",
            },
            "&:hover fieldset": {
              borderColor: "rgb(16 185 129 / 0.7)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgb(16 185 129)",
            },
            backgroundColor: "rgb(16 185 129 / 0.05)",
            "&:hover": {
              backgroundColor: "rgb(16 185 129 / 0.1)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgb(16 185 129 / 0.7)",
            "&.Mui-focused": {
              color: "rgb(16 185 129)",
            },
          },
        }}
      />
    </div>
  )
}

export default UsernameField
