import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileCard } from '@/components/profile-card'
import { PasskeyManagement } from '@/components/passkey-management'
import { SessionManagement } from '@/components/session-management'

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Manage your account and security settings</p>
            </div>
            
            <ProfileCard />

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Security
                    </CardTitle>
                    <CardDescription>
                        Manage your authentication methods
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PasskeyManagement />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Active Sessions
                    </CardTitle>
                    <CardDescription>
                        View and manage your active login sessions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SessionManagement />
                </CardContent>
            </Card>
        </div>
    )
}
