import { Metadata } from "next"
import { AppSidebar } from "@/components/page-nav"

export const metadata: Metadata = {
  title: "Dashboard - Operone",
  description: "Manage your Operone account and passkeys",
  icons: {
    icon: "/logo/passkey.svg",
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-1 max-w-6xl mx-auto">
        <AppSidebar />
        <main className="flex-1 bg-background overflow-auto">
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
