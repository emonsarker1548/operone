import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PasskeyManagement } from '@/components/passkey-management'

export default async function PasswordPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Password and authentication</h2>
        <p className="text-muted-foreground">Manage your password and authentication methods</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Passkeys</CardTitle>
          <CardDescription>
            Manage your passkeys for secure authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasskeyManagement />
        </CardContent>
      </Card>
    </div>
  )
}
