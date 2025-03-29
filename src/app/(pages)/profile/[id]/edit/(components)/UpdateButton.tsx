const UpdateButton = ({ onUpdate }: { onUpdate: () => void }) => {
  return (
    <button
      onClick={onUpdate}
      className="rounded bg-blue-500 px-4 py-2 text-white"
    >
      Update Profile
    </button>
  )
}

export default UpdateButton
