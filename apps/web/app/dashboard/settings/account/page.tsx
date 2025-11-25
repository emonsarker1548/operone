import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AccountPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Account</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Account Settings</CardTitle>
          <CardDescription>
            Configure your account preferences and security options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-border rounded-lg bg-background">
            <p className="text-muted-foreground">Account settings content goes here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
