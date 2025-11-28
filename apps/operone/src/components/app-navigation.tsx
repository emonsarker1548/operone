import {
  LifeBuoy,
  Send,
  SquarePlus,
  Search,
  Library,
  Settings,
} from "lucide-react"

// Common navigation items for all roles
export const commonNavItems = [
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: Send,
  },
]

// Quick Actions for sidebar
export const quickActions = [
  {
    title: "New Chat",
    url: "/chat/new",
    icon: SquarePlus,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Library",
    url: "/library",
    icon: Library,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

// Utility function for truncating text
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}