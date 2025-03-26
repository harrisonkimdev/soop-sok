import React, { type JSX } from "react"

interface ActionButtonsProps {
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const ActionButtons = ({
  onCancel,
  onSubmit,
}: ActionButtonsProps): JSX.Element => (
  <div className="grid grid-cols-2 gap-2.5">
    <button
      type="button"
      onClick={onCancel}
      className="w-full rounded-lg bg-white py-4 text-xl font-semibold text-earth-400 shadow transition duration-300 ease-in-out hover:bg-earth-50"
    >
      Cancel
    </button>

    <button
      type="submit"
      onClick={onSubmit}
      className="w-full rounded-lg bg-earth-100 py-4 text-xl font-semibold text-earth-600 shadow transition duration-300 ease-in-out hover:bg-earth-200"
    >
      Create
    </button>
  </div>
)
