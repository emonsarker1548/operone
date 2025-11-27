import * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
    children: React.ReactNode
    agentPanel?: React.ReactNode
    contextPanel?: React.ReactNode
    defaultLayout?: number[]
    navCollapsedSize?: number
}

export function MainLayout({
    children,
    agentPanel,
    contextPanel,
    defaultLayout = [70, 30],
    navCollapsedSize = 4,
}: MainLayoutProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="h-full flex-1 overflow-hidden">
                    <ResizablePanelGroup
                        direction="horizontal"
                        onLayout={(sizes: number[]) => {
                            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                                sizes
                            )}`
                        }}
                        className="h-full items-stretch"
                    >
                        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
                            <div className="h-full flex flex-col">
                                {children}
                            </div>
                        </ResizablePanel>

                        {(agentPanel || contextPanel) && (
                            <>
                                <ResizableHandle withHandle />
                                <ResizablePanel
                                    defaultSize={defaultLayout[1]}
                                    minSize={20}
                                    collapsible={true}
                                    collapsedSize={navCollapsedSize}
                                    onCollapse={() => setIsCollapsed(true)}
                                    onExpand={() => setIsCollapsed(false)}
                                    className={cn(
                                        isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
                                    )}
                                >
                                    <div className="h-full flex flex-col border-l bg-background/50 backdrop-blur-sm">
                                        {/* Tabs or switcher for Agent/Context could go here */}
                                        <div className="flex-1 overflow-auto p-4">
                                            {agentPanel}
                                            {contextPanel}
                                        </div>
                                    </div>
                                </ResizablePanel>
                            </>
                        )}
                    </ResizablePanelGroup>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
