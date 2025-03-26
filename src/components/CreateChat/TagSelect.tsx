import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import type { JSX } from "react"
export const TagSelect = ({
  tag,
  tagOptions,
  onChange,
}: {
  tag: string
  tagOptions: string[]
  onChange: (event: SelectChangeEvent<string>) => void
}): JSX.Element => (
  <div className="flex flex-col gap-2">
    <FormControl fullWidth>
      <InputLabel id="tag-select-label">Tag</InputLabel>
      <Select
        labelId="tag-select-label"
        id="tag-select"
        label="Tag"
        value={tag}
        onChange={onChange}
      >
        {tagOptions?.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
)
