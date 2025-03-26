import type { JSX } from "react"

interface PrivacyRadioProps {
  isPrivate: boolean
  onChange: (isPrivate: boolean) => void
}

export const PrivacyRadio = ({
  isPrivate,
  onChange,
}: PrivacyRadioProps): JSX.Element => (
  <div className="flex flex-col gap-2">
    <div className="grid grid-cols-2">
      <div className="flex gap-2">
        <input
          type="radio"
          id="public"
          name="privacy"
          value="public"
          checked={!isPrivate}
          onChange={() => onChange(false)}
          className="hidden"
        />
        <label
          htmlFor="public"
          className="inline-flex cursor-pointer items-center"
        >
          <span
            className={`mr-2 h-4 w-4 flex-shrink-0 rounded-full border ${!isPrivate ? "border-earth-500 bg-earth-500" : "border-gray-400 bg-white"}`}
          ></span>
          Public
        </label>
      </div>

      <div className="flex gap-2">
        <input
          type="radio"
          id="private"
          name="privacy"
          value="private"
          checked={isPrivate}
          onChange={() => onChange(true)}
          className="hidden"
        />
        <label
          htmlFor="private"
          className="inline-flex cursor-pointer items-center"
        >
          <span
            className={`mr-2 h-4 w-4 flex-shrink-0 rounded-full border ${isPrivate ? "border-earth-500 bg-earth-500" : "border-gray-400 bg-white"}`}
          ></span>
          Private
        </label>
      </div>
    </div>
  </div>
)
