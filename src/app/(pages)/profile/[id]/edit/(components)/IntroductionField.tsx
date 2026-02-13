"use client"

import { TextField } from "@mui/material"
import React, { ChangeEvent, useCallback } from "react"

interface IntroductionFieldProps {
  introduction: string | undefined
  updateField: (field: string, value: any, isProfileField: boolean) => void
}
const IntroductionField = React.memo(
  ({ introduction, updateField }: IntroductionFieldProps) => {
    const handleIntroductionChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        updateField("introduction", e.target.value, true)
      },
      [updateField],
    )

    return (
      <TextField
        id="outlined-basic"
        label="Introduction"
        variant="outlined"
        multiline
        maxRows={8}
        value={introduction || ""}
        onChange={handleIntroductionChange}
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
    )
  },
)

IntroductionField.displayName = "IntroductionField"

export default IntroductionField
