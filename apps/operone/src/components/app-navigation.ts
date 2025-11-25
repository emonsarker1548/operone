import { 
  LayoutDashboard, 
  MessageSquare, 
  Database, 
  Settings, 
  User, 
  CreditCard, 
  Bell 
} from "lucide-react"

export interface NavItem {
  title: string
  url?: string
  icon?: React.ComponentType<{ className?: string }>
  items?: NavItem[]
}

export const commonNavItems: NavItem[] = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    items: [
      {
        title: "Account",
        url: "/settings/account",
        icon: User,
      },
      {
        title: "Billing", 
        url: "/settings/billing",
        icon: CreditCard,
      },
      {
        title: "Notifications",
        url: "/settings/notifications",
        icon: Bell,
      },
    ],
  },
]

export const getNavItems = (): NavItem[] => {
  // Remove role-based logic - return basic navigation for all users
  return [
    {
      title: "Dashboard",
      url: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Chat",
      url: "/dashboard/chat", 
      icon: MessageSquare,
    },
    {
      title: "Memory",
      url: "/dashboard/memory",
      icon: Database,
    },
  ]
}
