import type { JSX } from "react"

const UpdateButton = ({ onUpdate }: { onUpdate: () => void }): JSX.Element => {
  return (
    <button
      onClick={onUpdate}
      className="group relative overflow-hidden rounded-lg px-6 py-3 text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 blur-lg transition-all duration-300 group-hover:blur-xl"></div>
      <span className="relative font-medium tracking-wide">Update Profile</span>
    </button>
  )
}

export default UpdateButton
