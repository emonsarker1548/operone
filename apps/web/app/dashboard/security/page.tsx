import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PasskeyManagement } from '@/components/passkey-management'

export default async function SecurityPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Security</h1>
                <p className="text-muted-foreground">Manage your authentication methods</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Passkeys
                    </CardTitle>
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
