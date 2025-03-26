import { TextField } from "@mui/material"
import type { ChangeEvent, JSX } from "react"
interface PasswordInputProps {
  isPrivate: boolean
  password: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const PasswordInput = ({
  isPrivate,
  password,
  onChange,
}: PasswordInputProps): JSX.Element => (
  <div
    className={`flex flex-col gap-2 ${
      isPrivate
        ? "pointer-events-auto opacity-100 duration-300 ease-in"
        : "pointer-events-none opacity-0 duration-300 ease-in"
    } `}
  >
    <TextField
      id="password"
      label="Password"
      variant="outlined"
      name="password"
      value={password}
      onChange={onChange}
    />
  </div>
)
