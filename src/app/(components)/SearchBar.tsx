import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import type { JSX } from "react"

type searchBarProps = {
  onSubmit: (searchQuery: string) => void
}

const SearchBar = ({ onSubmit }: searchBarProps): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleChange = async (searchQuery: string): Promise<void> => {
    setSearchQuery(searchQuery)
    onSubmit(searchQuery)
  }

  return (
    <div className="flex w-full items-center gap-3">
      {/* search input field */}
      <div className="grow rounded-xl border border-slate-700/30 bg-slate-800/50 p-0.5 backdrop-blur-sm">
        <div className="flex h-10 items-center justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleChange(e.target.value)}
            className="grow bg-transparent px-2 py-1 text-slate-300 outline-none placeholder:text-slate-500"
            placeholder="Search..."
          />
          <button
            type="submit"
            className="mr-2 text-slate-400 transition-colors hover:text-slate-300"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
