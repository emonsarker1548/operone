'use client'

import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { Copy, RefreshCw, ExternalLink, Clock, AlertCircle, Info, CheckCircle, ArrowLeft, Shield, Key } from 'lucide-react'

function generateToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export default function TroubleshootPage() {
    const [token, setToken] = useState<string>('')
    const [deepLink, setDeepLink] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check if user is authenticated
                const response = await fetch('/api/auth/session')
                const session = await response.json()
                
                if (!session?.user) {
                    redirect('/login')
                    return
                }

                // Generate a secure token for the desktop app
                const newToken = generateToken()
                const tokenResponse = await fetch('/api/auth/store-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: newToken, userId: session.user.id })
                })
                
                if (!tokenResponse.ok) {
                    throw new Error('Failed to store token')
                }
                
                const tokenData = await tokenResponse.json()
                setToken(tokenData.token)
                setDeepLink(`operone://auth?token=${tokenData.token}`)
                
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Authentication failed')
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [])

    
    const handleCopyToken = async () => {
        try {
            await navigator.clipboard.writeText(token)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy token:', err)
        }
    }

    const handleRefreshToken = async () => {
        setIsLoading(true)
        setError('')
        
        try {
            const response = await fetch('/api/auth/session')
            const session = await response.json()
            
            if (!session?.user) {
                throw new Error('Session expired')
            }

            // Generate new token
            const newToken = generateToken()
            const tokenResponse = await fetch('/api/auth/store-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: newToken, userId: session.user.id })
            })
            
            if (!tokenResponse.ok) {
                throw new Error('Failed to generate new token')
            }
            
            const tokenData = await tokenResponse.json()
            setToken(tokenData.token)
            setDeepLink(`operone://auth?token=${tokenData.token}`)
            setCopied(false)
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh token')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <Card className="w-full max-w-sm border-none shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">Preparing Token</h3>
                            <p className="text-muted-foreground text-sm">Generating secure authentication token...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <Card className="w-full max-w-sm border-none ">
                    <CardHeader className="text-center space-y-3">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                        <CardTitle className="text-destructive">Authentication Error</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <Button 
                            onClick={() => window.location.reload()} 
                            variant="outline" 
                            className="w-full"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
            <Card className="w-full max-w-6xl border-none shadow-none bg-transparent">
                <CardHeader className="text-center space-y-6 pb-8">
                    <div className="flex items-center justify-center">
                        <Button variant="ghost" size="sm" asChild className="absolute left-4 top-4">
                            <a href="/auth-success">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                            </a>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold">Manual Token Login</CardTitle>
                            <CardDescription>
                                Use this secure token to authenticate with the desktop app
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-8">
                    {/* Token Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Your Authentication Token</h3>
                        </div>
                        
                        <div className="bg-muted border rounded-lg p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Copy this token to your desktop app:</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    Expires in 5 minutes
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={token} 
                                    readOnly 
                                    className="font-mono text-sm flex-1"
                                    id="tokenInput"
                                />
                                <Button
                                    onClick={handleCopyToken}
                                    size="sm"
                                    variant={copied ? "default" : "outline"}
                                    className={copied ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleRefreshToken}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="sm"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Quick Steps</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-start gap-2 p-2 rounded-lg bg-card border">
                                    <Badge variant="secondary" className="mt-0.5 text-xs">1</Badge>
                                    <div className="flex-1">
                                        <p className="font-medium text-xs">Open Desktop App</p>
                                        <p className="text-xs text-muted-foreground">Launch Operone on your computer</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2 p-2 rounded-lg bg-card border">
                                    <Badge variant="secondary" className="mt-0.5 text-xs">2</Badge>
                                    <div className="flex-1">
                                        <p className="font-medium text-xs">Click &quot;Login with Token&quot;</p>
                                        <p className="text-xs text-muted-foreground">Find it on the login screen</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2 p-2 rounded-lg bg-card border">
                                    <Badge variant="secondary" className="mt-0.5 text-xs">3</Badge>
                                    <div className="flex-1">
                                        <p className="font-medium text-xs">Paste & Submit</p>
                                        <p className="text-xs text-muted-foreground">Paste token and click submit</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold text-muted-foreground">Troubleshooting</h3>
                            </div>
                            
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="space-y-2">
                                    <ul className="text-sm space-y-1">
                                        <li>• Copy entire 64-character token</li>
                                        <li>• Token expires in 5 minutes</li>
                                        <li>• Update desktop app if needed</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-3">
                        <Button
                            asChild
                            size="sm"
                            className="flex-1 bg-primary hover:bg-primary/90 h-7"
                        >
                            <a href={deepLink} className="flex items-center justify-center">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Try Automatic Redirect
                            </a>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 h-7"
                        >
                            <a href="/auth-success" className="flex items-center justify-center">
                                <ArrowLeft className="h-3 w-3 mr-1" />
                                Back to Success
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
    )
}
