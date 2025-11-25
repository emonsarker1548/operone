import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SessionManagement } from '@/components/session-management'

export default async function SessionsPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Active Sessions</h1>
                <p className="text-muted-foreground">View and manage your active login sessions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Session Management
                    </CardTitle>
                    <CardDescription>
                        Control where you&apos;re logged in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SessionManagement />
                </CardContent>
            </Card>
        </div>
    )
}
