import Image from "next/image"
import { ChangeEvent, useCallback } from "react"
import type { JSX } from "react"

interface ProfilePictureProps {
  photoURL: string | undefined
  updateField: (field: string, value: any, isProfileField: boolean) => void
}

const ProfilePicture = ({
  photoURL,
  updateField,
}: ProfilePictureProps): JSX.Element => {
  const handlePhotoURLChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateField("photoURL", e, false)
    },
    [updateField],
  )

  return (
    <div className="flex justify-center">
      <label htmlFor="profilePic" className="group cursor-pointer">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/30 to-teal-400/30 blur-lg transition-all duration-300 group-hover:blur-xl"></div>
          <Image
            src={photoURL || "/images/ks.jpeg"}
            alt="Profile Picture"
            width={192}
            height={192}
            className="aspect-square h-48 w-48 rounded-full border-4 border-emerald-500/50 object-cover shadow-lg transition-all duration-300 group-hover:border-emerald-400/70"
          />
        </div>
      </label>
      <input
        type="file"
        id="profilePic"
        onChange={handlePhotoURLChange}
        className="hidden"
      />
    </div>
  )
}

export default ProfilePicture
