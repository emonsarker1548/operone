import * as React from "react"
import { Command, MessageSquare, ChevronDown, MoreVertical, Trash2, Pencil } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useCallback } from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts"
import { useChat } from "@/contexts/chat-context"
import { commonNavItems, quickActions, truncateText } from "@/components/app-navigation"
import { cn } from "@/lib/utils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile, state, toggleSidebar } = useSidebar()

  // Use unified chat context
  const { chats, currentChat, createChat, setCurrentChat, updateChat, deleteChat } = useChat()

  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)
  const [chatToRename, setChatToRename] = React.useState<any>(null)
  const [newChatTitle, setNewChatTitle] = React.useState("")

  // Dynamic resize logic for auto-collapse behavior
  const handleResize = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    
    // Auto-collapse if window hits minimum height (700px) or width (800px)
    if ((width <= 800 || height <= 700) && state === "expanded" && !isMobile) {
      toggleSidebar()
    }
  }, [state, isMobile, toggleSidebar])
  
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // Optimized data structure like ChatGPT
  const [expandedSections, setExpandedSections] = React.useState({
    chats: false
  })

  // Toggle section with useCallback
  const toggleSection = React.useCallback((section: 'chats') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, []);

  // Get chats not associated with any project (general chats)
  const generalChats = chats

  // Handle creating a new chat (with error handling)
  const handleCreateNewChat = React.useCallback(async () => {
    try {
      // If current chat has no messages, just reuse it instead of creating a new one
      if (currentChat && (!currentChat.messages || currentChat.messages.length === 0)) {
        // Reset to clean state and navigate
        setCurrentChat(currentChat)
        navigate('/dashboard/chat', { replace: true })
        return
      }
      
      // Otherwise create a new chat
      await createChat()
      // Use replace to avoid adding to history stack and ensure clean URL
      navigate('/dashboard/chat', { replace: true })
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  }, [createChat, navigate, currentChat, setCurrentChat]);

  // Handle selecting a chat (with error handling)
  const handleSelectChat = React.useCallback(async (chat: any) => {
    try {
      setCurrentChat(chat)
      navigate(`/dashboard/chat?chatId=${chat.id}`)
    } catch (error) {
      console.error('Failed to select chat:', error);
    }
  }, [setCurrentChat, navigate]);

  // Handle chat rename (with validation)
  const handleRenameChat = React.useCallback(async () => {
    if (chatToRename && newChatTitle.trim()) {
      try {
        updateChat(chatToRename.id, { title: newChatTitle.trim() })
        setRenameDialogOpen(false)
        setChatToRename(null)
        setNewChatTitle("")
      } catch (error) {
        console.error('Failed to rename chat:', error);
      }
    }
  }, [chatToRename, newChatTitle, updateChat]);

  // Handle chat delete (with confirmation)
  const handleDeleteChat = React.useCallback(async (chat: any) => {
    try {
      deleteChat(chat.id)
      if (currentChat?.id === chat.id) {
        navigate('/dashboard/chat', { replace: true })
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  }, [deleteChat, currentChat, navigate]);

  // Open rename dialog (reset state)
  const openRenameDialog = React.useCallback((chat: any) => {
    setChatToRename(chat)
    setNewChatTitle(chat.title)
    setRenameDialogOpen(true)
  }, []);

  // Simple static navigation items
  const navMainItems = React.useMemo(() => [], [])

  // Memoized getInitials function
  const getInitials = React.useCallback((user: any) => {
    if (!user || !user?.name) return 'GU'
    const names = user.name.split(' ')
    return names.length > 1
      ? `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
      : `${user.name.charAt(0)}`.toUpperCase()
  }, []);

  // Check if we're on a settings page
  const isSettingsPage = location.pathname.startsWith('/settings')

  // Filter out settings items from secondary nav when on settings pages
  const filteredNavSecondary = React.useMemo(() => {
    if (!isSettingsPage) return commonNavItems

    return commonNavItems.filter(item =>
      !item.url?.startsWith('/settings')
    )
  }, [isSettingsPage])

  const sidebarData = {
    user: {
      name: user?.name || 'Guest User',
      email: user?.email || 'guest@example.com',
      avatar: user?.image || null,
      initials: getInitials(user)
    },
    navMain: navMainItems,
    navSecondary: filteredNavSecondary,
    teams: [{
      name: "Operone",
      logo: Command,
      plan: "Professional"
    }]
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <div className="relative group flex-1">
                <SidebarMenuButton size="lg" asChild className="flex-1" tooltip="Operone">
                  <Link to="/dashboard/chat">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Operone</span>
                      <span className="truncate text-xs">AI</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
                <SidebarTrigger className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background rounded-md p-1 group-data-[state=expanded]:hidden" />
              </div>
              <SidebarTrigger className="opacity-0 group-data-[state=expanded]:opacity-100 transition-opacity duration-200 group-data-[state=icon]:hidden hover:bg-muted rounded-md" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Non-collapsible Quick Actions */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.url}>
                  <SidebarMenuButton asChild tooltip={action.title}>
                    {action.title === "New Chat" ? (
                      <button
                        onClick={handleCreateNewChat}
                        className="flex items-center gap-2 w-full"
                      >
                        <action.icon className="w-4 h-4" />
                        <span>{action.title}</span>
                      </button>
                    ) : (
                      <Link to={action.url} className="flex items-center gap-2">
                        <action.icon className="w-4 h-4" />
                        <span>{action.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavMain items={sidebarData.navMain} />

        {/* Chats Section */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden gap-0 py-1">
          <SidebarGroupLabel className="px-0">
            <SidebarMenuButton
              onClick={() => toggleSection('chats')}
              className="w-full justify-between"
              tooltip="Chats"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="group-data-[collapsible=icon]:hidden">Chats</span>
              </span>
              <ChevronDown className="w-4 h-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarGroupLabel>
          {expandedSections.chats && (
            <SidebarGroupContent>
              <div className="max-h-64 overflow-y-auto">
                <SidebarMenu>
                  {generalChats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <div className="flex items-center justify-between w-full group">
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            "flex-1",
                            currentChat?.id === chat.id && "bg-accent text-accent-foreground"
                          )}
                          tooltip={truncateText(chat.title, 20)}
                        >
                          <button
                            onClick={() => handleSelectChat(chat)}
                            className="flex items-center gap-2 w-full"
                          >
                            <MessageSquare className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate group-data-[collapsible=icon]:hidden">{truncateText(chat.title, 20)}</span>
                          </button>
                        </SidebarMenuButton>
                        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                          <span className="text-xs text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {chat.updatedAt.toLocaleDateString()}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-muted rounded-md bg-muted flex items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openRenameDialog(chat)
                                }}
                                className="flex items-center gap-2 cursor-pointer hover:bg-muted"
                              >
                                <Pencil className="w-4 h-4" />
                                <span>Rename</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteChat(chat)
                                }}
                                className="flex items-center gap-2 text-destructive cursor-pointer hover:bg-muted"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />

      {/* Rename Chat Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <Input
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="Enter new chat title"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenameChat()
              }
            }}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenameDialogOpen(false)
                setChatToRename(null)
                setNewChatTitle("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameChat} disabled={!newChatTitle.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
