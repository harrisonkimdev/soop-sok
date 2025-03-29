"use client"

import { useAppState } from "@/app/(context)/AppStateProvider"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import {
  ChatBubbleBottomCenterIcon,
  Cog6ToothIcon,
  QueueListIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import type { JSX } from "react"

const tabs = [
  { tab: "public-chat", icon: <QueueListIcon className="h-5 w-5" />, badge: 1 },
  {
    tab: "private-chat",
    icon: <ChatBubbleBottomCenterIcon className="h-5 w-5" />,
    badge: 2,
  },
  { tab: "friends", icon: <UserIcon className="h-5 w-5" />, badge: 3 },
  { tab: "settings", icon: <Cog6ToothIcon className="h-5 w-5" />, badge: 4 },
]

const NavBar = (): JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAuthCheck()
  const { state, dispatch } = useAppState()

  const redirectTo = (tab: string): void => {
    if (!isAuthenticated) {
      // TODO: dialog - not authenticated.
      router.push("/")
      return
    }

    const { publicChatURL, privateChatURL } = state

    // If the pathname includes "/chats/channel" or "/chats/chats", set the publicChatURL to the pathname before redirecting.
    if (
      pathname.startsWith("/channels") ||
      pathname.startsWith("/chats/channel")
    ) {
      dispatch({ type: "SET_PUBLIC_URL", payload: pathname })
    }

    // If the pathname includes "/private-chats" or "/chats/private-chat", set the privateChatURL to the pathname before redirecting.
    else if (
      pathname.startsWith("/private-chats") ||
      pathname.startsWith("/chats/private-chat")
    ) {
      dispatch({ type: "SET_PRIVATE_URL", payload: pathname })
    }

    const tabURLs: { [key: string]: string } = {
      "public-chat": publicChatURL || "/channels",
      "private-chat": privateChatURL || `/private-chats`,
      friends: "/friends",
      settings: "/settings",
    }

    router.push(tabURLs[tab] || "")
  }

  return (
    <>
      {pathname !== "/" && (
        <nav className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-earth-50 px-12 py-3">
          {tabs.map(({ tab, icon, badge }) => (
            <Badge key={tab} badgeContent={badge} color="primary">
              <div
                onClick={() => redirectTo(tab)}
                className="rounded-full bg-earth-100 p-2 transition duration-300 ease-in-out hover:bg-earth-200"
              >
                {icon}
              </div>
            </Badge>
          ))}
        </nav>
      )}
    </>
  )
}

export default NavBar
