'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Shield, Smartphone, Globe, Monitor, Terminal, Plus, Trash2, Key, Copy, Settings, Eye, EyeOff, Users, Activity } from 'lucide-react'

interface OAuthApp {
    id: string
    name: string
    type: 'web' | 'mobile' | 'desktop' | 'cli'
    description: string
    clientId: string
    clientSecret: string
    callbackUrl: string
    permissions: string[]
    status: 'active' | 'inactive' | 'development'
    createdAt: string
    lastUsed?: string
    usageCount: number
    owner: string
}

interface OAuthToken {
    id: string
    appId: string
    token: string
    scopes: string[]
    expiresAt: string
    createdAt: string
    lastUsed?: string
    revoked: boolean
}

export default function AppsOAuthPage() {
    const [loading, setLoading] = useState(false)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showSecretDialog, setShowSecretDialog] = useState(false)
    const [selectedApp, setSelectedApp] = useState<OAuthApp | null>(null)
    const [showClientSecret, setShowClientSecret] = useState<string | null>(null)

    // OAuth Apps state
    const [apps, setApps] = useState<OAuthApp[]>([
        {
            id: '1',
            name: 'Operone Dashboard',
            type: 'web',
            description: 'Main web dashboard application',
            clientId: 'oauth_app_1234567890',
            clientSecret: 'sk_oauth_abc123def456ghi789',
            callbackUrl: 'https://dashboard.operone.com/auth/callback',
            permissions: ['read:profile', 'read:projects', 'write:projects'],
            status: 'active',
            createdAt: '2024-01-10',
            lastUsed: '2024-03-14',
            usageCount: 1542,
            owner: 'john.doe'
        },
        {
            id: '2',
            name: 'Operone Mobile',
            type: 'mobile',
            description: 'iOS and Android mobile application',
            clientId: 'oauth_app_0987654321',
            clientSecret: 'sk_oauth_xyz789uvw456rst123',
            callbackUrl: 'operone://auth/callback',
            permissions: ['read:profile', 'read:projects'],
            status: 'active',
            createdAt: '2024-02-01',
            lastUsed: '2024-03-13',
            usageCount: 892,
            owner: 'jane.smith'
        },
        {
            id: '3',
            name: 'Operone CLI',
            type: 'cli',
            description: 'Command line interface tool',
            clientId: 'oauth_app_5678901234',
            clientSecret: 'sk_oauth_pqr456mno789stu012',
            callbackUrl: 'http://localhost:3000/callback',
            permissions: ['read:profile', 'read:projects', 'write:projects', 'admin:system'],
            status: 'development',
            createdAt: '2024-02-15',
            lastUsed: '2024-03-11',
            usageCount: 234,
            owner: 'mike.wilson'
        }
    ])

    // OAuth Tokens state
    const [tokens] = useState<OAuthToken[]>([
        {
            id: '1',
            appId: '1',
            token: 'oauth_token_abc123...',
            scopes: ['read:profile', 'read:projects'],
            expiresAt: '2024-06-15T00:00:00Z',
            createdAt: '2024-03-14T10:30:00Z',
            lastUsed: '2024-03-14T14:20:00Z',
            revoked: false
        },
        {
            id: '2',
            appId: '2',
            token: 'oauth_token_def456...',
            scopes: ['read:profile', 'read:projects'],
            expiresAt: '2024-05-01T00:00:00Z',
            createdAt: '2024-03-01T09:15:00Z',
            lastUsed: '2024-03-13T16:45:00Z',
            revoked: false
        }
    ])

    const handleCreateApp = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const newApp: OAuthApp = {
                id: Date.now().toString(),
                name: 'New OAuth App',
                type: 'web',
                description: 'New OAuth application',
                clientId: `oauth_app_${Math.random().toString(36).substring(2, 15)}`,
                clientSecret: `sk_oauth_${Math.random().toString(36).substring(2, 15)}`,
                callbackUrl: '',
                permissions: ['read:profile'],
                status: 'development',
                createdAt: new Date().toISOString(),
                usageCount: 0,
                owner: 'current.user'
            }
            
            setApps(prev => [...prev, newApp])
            setShowCreateDialog(false)
            alert('OAuth app created successfully')
        } catch {
            alert('Failed to create OAuth app')
        } finally {
            setLoading(false)
        }
    }

    const handleRevokeToken = () => {
        alert('Token revoked successfully')
    }

    const handleRegenerateSecret = () => {
        alert('Client secret regenerated successfully')
    }

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert('Copied to clipboard')
    }

    const getAppIcon = (type: OAuthApp['type']) => {
        switch (type) {
            case 'web': return <Globe className="h-5 w-5" />
            case 'mobile': return <Smartphone className="h-5 w-5" />
            case 'desktop': return <Monitor className="h-5 w-5" />
            case 'cli': return <Terminal className="h-5 w-5" />
        }
    }

    const getStatusColor = (status: OAuthApp['status']) => {
        switch (status) {
            case 'active': return 'bg-green-50 border-green-200 text-green-800'
            case 'inactive': return 'bg-gray-50 border-gray-200 text-gray-800'
            case 'development': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }
    }

    const isTokenExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date()
    }

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <Card className='border-none'>
                <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold">Apps & OAuth</h1>
                                <p className="text-muted-foreground">Manage your OAuth applications and access tokens</p>
                            </div>
                            <Button onClick={() => setShowCreateDialog(true)} variant="outline" size="sm" className="border-b-2">
                                <Plus className="h-4 w-4 mr-2" />
                                Create App
                            </Button>
                        </div>

                        {/* OAuth Overview */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    OAuth Overview
                                </h3>
                                <p className="text-sm text-muted-foreground">Summary of your OAuth applications and usage</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Total Apps</h4>
                                            <p className="text-2xl font-bold">{apps.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <Activity className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Active Apps</h4>
                                            <p className="text-2xl font-bold">{apps.filter(a => a.status === 'active').length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Key className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Active Tokens</h4>
                                            <p className="text-2xl font-bold">{tokens.filter(t => !t.revoked && !isTokenExpired(t.expiresAt)).length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <Users className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Total Usage</h4>
                                            <p className="text-2xl font-bold">{apps.reduce((sum, a) => sum + a.usageCount, 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* OAuth Apps */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    OAuth Applications
                                </h3>
                                <p className="text-sm text-muted-foreground">Manage your registered OAuth applications</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {apps.map((app) => (
                                        <div key={app.id} className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    {getAppIcon(app.type)}
                                                    <div>
                                                        <h4 className="font-medium">{app.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{app.description}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {app.type}
                                                            </Badge>
                                                            <Badge className={getStatusColor(app.status)}>
                                                                {app.status}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {app.owner}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedApp(app)}
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setShowSecretDialog(true)}
                                                    >
                                                        <Key className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleRegenerateSecret}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Client ID:</span>
                                                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                                        {app.clientId}
                                                    </code>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCopyToClipboard(app.clientId)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Callback URL:</span>
                                                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                                        {app.callbackUrl}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Permissions:</span>
                                                    {app.permissions.map((permission) => (
                                                        <Badge key={permission} variant="outline" className="text-xs">
                                                            {permission}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                                                <p>Usage: {app.usageCount.toLocaleString()} times • Created: {new Date(app.createdAt).toLocaleDateString()}</p>
                                                {app.lastUsed && (
                                                    <p>Last used: {new Date(app.lastUsed).toLocaleDateString()}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Active Tokens */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    Active Tokens
                                </h3>
                                <p className="text-sm text-muted-foreground">Manage OAuth access tokens</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {tokens.map((token) => {
                                        const app = apps.find(a => a.id === token.appId)
                                        const expired = isTokenExpired(token.expiresAt)
                                        return (
                                            <div key={token.id} className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                            <Key className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">{app?.name}</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Token: {token.token}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant={expired || token.revoked ? 'destructive' : 'default'} className="text-xs">
                                                                    {token.revoked ? 'Revoked' : expired ? 'Expired' : 'Active'}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    Created {new Date(token.createdAt).toLocaleDateString()}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCopyToClipboard(token.token)}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleRevokeToken}
                                                            disabled={token.revoked}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">Scopes:</span>
                                                        {token.scopes.map((scope) => (
                                                            <Badge key={scope} variant="outline" className="text-xs">
                                                                {scope}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        <p>Expires: {new Date(token.expiresAt).toLocaleDateString()}</p>
                                                        {token.lastUsed && (
                                                            <p>Last used: {new Date(token.lastUsed).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create App Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create OAuth Application</DialogTitle>
                        <DialogDescription>
                            Register a new OAuth application
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="app-name">Application Name</Label>
                            <Input
                                id="app-name"
                                placeholder="My Awesome App"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="app-type">Application Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select application type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="web">Web Application</SelectItem>
                                    <SelectItem value="mobile">Mobile Application</SelectItem>
                                    <SelectItem value="desktop">Desktop Application</SelectItem>
                                    <SelectItem value="cli">CLI Tool</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="app-description">Description</Label>
                            <Textarea
                                id="app-description"
                                placeholder="Brief description of your application"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="callback-url">Callback URL</Label>
                            <Input
                                id="callback-url"
                                placeholder="https://myapp.com/callback"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Switch id="read-profile" />
                                    <Label htmlFor="read-profile">Read profile information</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="read-projects" />
                                    <Label htmlFor="read-projects">Read projects</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="write-projects" />
                                    <Label htmlFor="write-projects">Write projects</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateApp} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Application'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Client Secret Dialog */}
            <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Client Secret</DialogTitle>
                        <DialogDescription>
                            Your application&apos;s client secret. Keep this secure.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Client Secret</Label>
                            <div className="flex gap-2">
                                <Input
                                    type={showClientSecret ? "text" : "password"}
                                    value={selectedApp?.clientSecret || ''}
                                    readOnly
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowClientSecret(showClientSecret ? null : selectedApp?.clientSecret || '')}
                                >
                                    {showClientSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopyToClipboard(selectedApp?.clientSecret || '')}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                <strong>Security Note:</strong> Never share your client secret publicly or commit it to version control.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowSecretDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
