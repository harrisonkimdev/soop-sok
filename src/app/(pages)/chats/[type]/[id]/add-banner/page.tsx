"use client"

import { auth } from "@/utils/firebase/firebase"
import { addBanner } from "@/utils/firebase/firestore"

import { BackspaceIcon } from "@heroicons/react/24/outline"
import { Button, TextField } from "@mui/material"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import type { JSX } from "react"

type pageProps = {
  params: {
    type: string
    id: string
  }
}

const Page = ({ params }: pageProps): JSX.Element => {
  const [bannerTitle, setBannerTitle] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tagOptions, setTagOptions] = useState<string[]>([])

  const router = useRouter()

  

  const addToList = (): void => {
    if (tagInput.length > 0 && tagOptions.length < 5) {
      setTagOptions((prev) => {
        if (!prev.includes(tagInput)) {
          return [...prev, tagInput]
        } else return [...prev]
      })
      setTagInput("")
    } else {
      // TODO: dialog - empty input field ortoo many tag options.
    }
  }

  const deleteFromList = (tagOption: string): void => {
    if (!auth) {
      // TODO: dialog - not logged in.
      router.push("/")
    }

    if (tagOptions.length > 0) {
      setTagOptions((prev) => prev.filter((option) => option !== tagOption))
    }
  }

  const redirectToFeaturesPage = (): void => {
    if (!auth) {
      // TODO: dialog - not logged in.
      router.push("/")
    }

    router.push(`/chats/${params.type}/${params.id}/features`)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const currentUser = auth.currentUser
    if (!currentUser) return

    if (bannerTitle.length > 0) {
      try {
        // TODO: add uid, updatedAt
        const res = await addBanner(
          params.id,
          bannerTitle,
          tagOptions,
          currentUser.uid,
        )

        if (res) {
          router.push(`/chats/${params.type}/${params.id}`)
        }
      } catch (err) {
        console.error(err)
        
      }
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex h-full flex-col gap-4"
    >
      <div className="flex grow flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4">
        {/* page title */}
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          add a new banner
        </h1>

        {/* tag container */}
        <div className="mt-4 flex flex-col gap-6">
          {/* name */}
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
          />

          {/* input field for a new tag */}
          <div className="flex gap-2">
            <TextField
              id="outlined-basic"
              label="Tag Input"
              variant="outlined"
              value={tagInput}
              fullWidth
              onChange={(e) => setTagInput(e.target.value)}
            />
            <Button variant="outlined" onClick={addToList}>
              Add
            </Button>
          </div>

          {/* entered tag options */}
          {tagOptions.length > 0 && (
            <div>
              <div className="min-h-14 rounded-sm border border-gray-300 p-3">
                <div className="flex flex-col gap-3">
                  {tagOptions.map((tagOption) => (
                    <div
                      key={tagOption}
                      className="flex items-center justify-between"
                    >
                      <p className="whitespace-nowrap">{`${tagOption}`}</p>
                      <BackspaceIcon
                        className="h-5 cursor-pointer text-gray-500"
                        onClick={() => deleteFromList(tagOption)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-2 px-1 text-sm text-gray-400">
                Users are only allowed to choose one of the given options
              </p>
            </div>
          )}
        </div>
      </div>

      {/* action buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={redirectToFeaturesPage}
          className="w-full rounded-lg bg-white py-4 text-xl font-semibold text-earth-400 shadow transition duration-300 ease-in-out hover:bg-earth-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="w-full rounded-lg bg-earth-100 py-4 text-xl font-semibold text-earth-600 shadow transition duration-300 ease-in-out hover:bg-earth-200"
        >
          Create
        </button>
      </div>
    </form>
  )
}

export default Page
