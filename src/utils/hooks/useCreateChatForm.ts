import { SelectChangeEvent } from "@mui/material"
import React, { useState, ChangeEvent } from "react"

interface CreateChatFormState {
  capacity: number
  isPrivate: boolean
  name: string
  password: string
  tagOptions: string[]
  tag: string
}

export const useChatForm = (
  initialTagOptions: string[] = [],
): {
  formState: CreateChatFormState
  setFormState: React.Dispatch<React.SetStateAction<CreateChatFormState>>
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSliderChange: (newValue: number) => void
  handleSelectChange: (e: SelectChangeEvent<string>) => void
  handlePrivacyChange: (isPrivate: boolean) => void
} => {
  const [formState, setFormState] = useState({
    capacity: 2,
    isPrivate: false,
    name: "",
    password: "",
    tagOptions: initialTagOptions,
    tag: "",
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (newValue: number): void => {
    setFormState((prev) => ({ ...prev, capacity: newValue }))
  }

  const handleSelectChange = (e: SelectChangeEvent<string>): void => {
    setFormState((prev) => ({ ...prev, tag: e.target.value }))
  }

  const handlePrivacyChange = (isPrivate: boolean): void => {
    setFormState((prev) => ({ ...prev, isPrivate }))
  }

  return {
    formState,
    setFormState,
    handleInputChange,
    handleSliderChange,
    handleSelectChange,
    handlePrivacyChange,
  }
}
