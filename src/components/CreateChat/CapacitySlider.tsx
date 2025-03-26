import { Stack, Slider } from "@mui/material"
import type { JSX } from "react"

interface CapacitySliderProps {
  capacity: number
  onChange: (newValue: number) => void
}

export const CapacitySlider = ({
  capacity,
  onChange,
}: CapacitySliderProps): JSX.Element => (
  <div className="flex flex-col gap-3">
    <label htmlFor="capacity">Capacity</label>
    <div className="grid grid-cols-6">
      <div className="col-span-3 pl-3">
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <Slider
            aria-label="capacity"
            min={2}
            max={5}
            step={1}
            marks={true}
            color="primary"
            value={capacity}
            onChange={(_, newValue) => onChange(newValue as number)}
          />
        </Stack>
      </div>
      <span className="col-span-1 col-start-6 mr-4 text-right">{capacity}</span>
    </div>
  </div>
)
