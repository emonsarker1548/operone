import { useState } from 'react'
import { useAuth } from '../../contexts/auth-context'
import { Button, Card, CardContent, Input, Label, Progress } from '@/components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import faviconUrl from '../../assets/favicon.ico'

export function LoginScreen() {
    const { login, loginWithToken, isLoading } = useAuth()
    const [token, setToken] = useState('')
    const [isManualLoginLoading, setIsManualLoginLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleManualLogin = async () => {
        if (!token) return

        setIsManualLoginLoading(true)
        setProgress(10)

        const timer = setInterval(() => {
            setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
        }, 500)

        try {
            await loginWithToken(token)
            clearInterval(timer)
            setProgress(100)
            setTimeout(() => {
                setIsDialogOpen(false)
                setIsManualLoginLoading(false)
                setProgress(0)
                setToken('')
            }, 500)
        } catch (error) {
            console.error('Manual login failed:', error)
            clearInterval(timer)
            setIsManualLoginLoading(false)
            setProgress(0)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-sm mx-4 bg-transparent border-none shadow-none">
                <CardContent className="flex flex-col items-center space-y-6 pt-6">
                    {/* App Icon */}
                    <img
                        src={faviconUrl}
                        alt="Operone"
                        className="w-20 h-20"
                    />

                    {/* App Name */}
                    <h1 className="text-3xl font-bold">Operone</h1>

                    {/* Login Button */}
                    <Button
                        onClick={login}
                        disabled={isLoading}
                        size="lg"
                        className="w-full"
                        variant="default"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Opening browser...
                            </>
                        ) : (
                            'Login with Operone'
                        )}
                    </Button>

                    {/* Loading State Message */}
                    {isLoading && (
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Opening your browser...
                            </p>
                            <p className="text-xs text-muted-foreground">
                                You'll be redirected back automatically after login
                            </p>
                        </div>
                    )}

                    {/* Manual Token Entry */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="link" className="text-xs text-muted-foreground">
                                Trouble logging in?
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] max-h-[80vh] border-none shadow-none">
                            <DialogHeader>
                                <DialogTitle>Enter Login Token</DialogTitle>
                                <DialogDescription>
                                    If the automatic redirect didn't work, copy the token from the browser and paste it here.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="token">Token</Label>
                                    <Input
                                        id="token"
                                        placeholder="Paste your token here"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        disabled={isManualLoginLoading}
                                    />
                                </div>
                                {isManualLoginLoading ? (
                                    <div className="py-2">
                                        <Progress value={progress} className="w-full h-2" />
                                    </div>
                                ) : (
                                    <Button onClick={handleManualLogin} disabled={!token}>
                                        Login with Token
                                    </Button>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Privacy Policy Link */}
                    <div className="pt-4">
                        <a
                            href="https://operone.vercel.app/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:underline"
                        >
                            Privacy Policy
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
