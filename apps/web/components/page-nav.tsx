"use client"

import * as React from "react"
import { useState } from "react"
import {
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
  UserCircle,
  Shield,
  Palette,
  Accessibility,
  Bell,
  CreditCard,
  Mail,
  Key,
  Monitor,
  Package,
  Lock,
  Smartphone,
  History,
  Code,
  Loader2,
  Brain,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { LucideIcon } from "lucide-react"

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  items?: (NavItem | CategoryItem)[]
  variant?: "default" | "destructive"
}

type CategoryItem = {
  category: string
}

type TopLevelItem = NavItem | CategoryItem

const data: {
  navItems: TopLevelItem[]
  account: {
    name: string
    icon: LucideIcon
    href: string
    variant?: "default" | "destructive"
  }[]
} = {
  navItems: [
    { category: "Main" },
    { title: "Profile", url: "/dashboard", icon: User },
    { title: "Security", url: "/dashboard/security", icon: Shield },
    { title: "Sessions", url: "/dashboard/sessions", icon: Monitor },

    { category: "Quick Access" },
    { title: "Account", url: "/dashboard/account", icon: Shield },
    { title: "Appearance", url: "/dashboard/appearance", icon: Palette },
    { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
    { title: "Passkeys", url: "/dashboard/passkeys", icon: Key },

    { category: "Account Management" },
    {
      title: "Billing & Emails",
      url: "/dashboard/billing",
      icon: CreditCard,
      items: [
        { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
        { title: "Emails", url: "/dashboard/emails", icon: Mail },
      ],
    },

    {
      title: "Preferences",
      url: "/dashboard/accessibility",
      icon: Palette,
      items: [
        { title: "Accessibility", url: "/dashboard/accessibility", icon: Accessibility },
      ],
    },

    {
      title: "Security & Access",
      url: "/dashboard/security",
      icon: Lock,
      items: [
        { title: "Security log", url: "/dashboard/security/log", icon: History },
      ],
    },

    { category: "Developer Tools" },
    {
      title: "Developer",
      url: "/dashboard/developer",
      icon: Code,
      items: [
        { title: "AI Providers", url: "/dashboard/developer/ai-providers", icon: Brain },
        { title: "Repositories", url: "/dashboard/developer/repositories", icon: Package },
        { title: "Apps & OAuth", url: "/dashboard/developer/apps", icon: Smartphone },
        { title: "Dev settings", url: "/dashboard/developer/settings", icon: Code },
      ],
    },
  ],

  // Account controls
  account: [
    { name: "Sign out", icon: LogOut, href: "/dashboard/signout", variant: "destructive" },
  ],
};


export function AppSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    settings: true,
  })
  const [activePath, setActivePath] = useState("/dashboard")
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  React.useEffect(() => {
    setActivePath(window.location.pathname)
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleNavigation = async (href: string) => {
    if (href === "/dashboard/signout") {
      setIsSigningOut(true)
      try {
        await signOut({ redirectTo: "/login" })
      } catch (error) {
        console.error("Sign out error:", error)
        setIsSigningOut(false)
      }
    } else {
      setActivePath(href)
      router.push(href)
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-[12px] left-4 z-50 p-2 rounded-lg bg-background border border-border/40 hover:bg-accent/50 transition-colors"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div className={
        `fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background/95 backdrop-blur-sm transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`
      }>
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 pt-16 lg:pt-6">
            <div className="space-y-4">
              {/* Navigation Items */}
              <div className="space-y-1">
                {data.navItems.map((item, index) => {
                  if ('category' in item) {
                    return (
                      <div key={`category-${index}`} className="px-3 py-1 text-xs font-semibold text-muted-foreground tracking-wider mt-2 first:mt-0">
                        {item.category}
                      </div>
                    )
                  } else {
                    return (
                      <div key={item.title}>
                        {item.items ? (
                          // Dropdown item (Settings)
                          <>
                            <button
                              onClick={() => toggleSection(item.title.toLowerCase())}
                              className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-foreground mb-2 rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </div>
                              {expandedSections[item.title.toLowerCase()] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            {expandedSections[item.title.toLowerCase()] && (
                              <div className="space-y-1">
                                {item.items.map((subItem, subIndex) => {
                                  if ('category' in subItem) {
                                    return (
                                      <div key={`category-${subIndex}`} className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-6 mt-2 first:mt-0">
                                        {subItem.category}
                                      </div>
                                    )
                                  } else {
                                    return (
                                      <button
                                        key={subItem.title}
                                        onClick={() => handleNavigation(subItem.url)}
                                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors group ml-6 relative ${activePath === subItem.url ? 'bg-accent/30 text-accent-foreground' : ''
                                          }`}
                                      >
                                        {activePath === subItem.url && (
                                          <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-full" />
                                        )}
                                        <subItem.icon className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <span className="font-medium">{subItem.title}</span>
                                      </button>
                                    )
                                  }
                                })}
                              </div>
                            )}
                          </>
                        ) : (
                          // Direct navigation item (Dashboard, Security, Sessions)
                          <button
                            onClick={() => handleNavigation(item.url)}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent/50 transition-colors group relative ${activePath === item.url ? 'bg-accent/30 text-accent-foreground' : ''
                              }`}
                          >
                            {activePath === item.url && (
                              <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-full" />
                            )}
                            <item.icon className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span>{item.title}</span>
                          </button>
                        )}
                      </div>
                    )
                  }
                })}
              </div>

              {/* Account Section */}
              <div>
                <div className="space-y-1">
                  {data.account.map((item) => {
                    const isDestructive = item.variant === "destructive"
                    const isSignout = item.href === "/dashboard/signout"
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        disabled={isSignout && isSigningOut}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors group ${isDestructive
                          ? "hover:bg-destructive hover:text-destructive-foreground"
                          : "hover:bg-accent/50"
                          } ${(isSignout && isSigningOut) ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isSignout && isSigningOut ? (
                          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                        ) : (
                          <item.icon className={`mr-3 h-4 w-4 transition-colors text-foreground`} />
                        )}
                        <span className="font-medium">
                          {isSignout && isSigningOut ? "Signing out..." : item.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
