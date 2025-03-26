import { TextField } from "@mui/material"
import type { ChangeEvent, JSX } from "react"

export const NameInput = ({
  name,
  onChange,
}: {
  name: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}): JSX.Element => (
  <div className="flex flex-col gap-2">
    <TextField
      id="name"
      label="Name"
      variant="outlined"
      name="name"
      value={name}
      onChange={onChange}
    />
  </div>
)
