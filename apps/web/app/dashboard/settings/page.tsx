import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit2 } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your public profile information</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                defaultValue="MD Shoaib Khan"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your name may appear around GitHub where you contribute or are mentioned.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Public email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  defaultValue="khan2310310484@g.edu.bd"
                  className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                You can manage verified email addresses in your{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  email settings
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                defaultValue="Whatever you like for yourself"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can @mention other users and organizations to link to them.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pronouns</label>
              <select className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground">
                <option>he/him</option>
                <option>she/her</option>
                <option>they/them</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Social accounts</label>
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://www.facebook.com/the-shoaik2"
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
                <input
                  type="url"
                  placeholder="https://www.instagram.com/the-shoaik2"
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Edit2 size={16} />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
