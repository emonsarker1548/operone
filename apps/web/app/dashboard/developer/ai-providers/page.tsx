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
import { Loader2, Bot, Cpu, Cloud, Plus, Trash2, Settings, Check, AlertTriangle, TrendingUp } from 'lucide-react'

interface AIProvider {
    id: string
    name: string
    type: 'openai' | 'anthropic' | 'google' | 'custom'
    model: string
    apiKey: string
    endpoint?: string
    status: 'connected' | 'disconnected' | 'error'
    usage: number
    limit: number
    createdAt: string
    lastUsed?: string
}

export default function AIProvidersPage() {
    const [loading, setLoading] = useState(false)
    const [showProviderDialog, setShowProviderDialog] = useState(false)
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null)

    // AI Providers state
    const [providers, setProviders] = useState<AIProvider[]>([
        {
            id: '1',
            name: 'OpenAI GPT-4',
            type: 'openai',
            model: 'gpt-4',
            apiKey: 'sk-...abc123',
            status: 'connected',
            usage: 85420,
            limit: 100000,
            createdAt: '2024-01-15',
            lastUsed: '2024-03-14'
        },
        {
            id: '2',
            name: 'Anthropic Claude',
            type: 'anthropic',
            model: 'claude-3-sonnet',
            apiKey: 'sk-ant-...def456',
            status: 'connected',
            usage: 32150,
            limit: 100000,
            createdAt: '2024-02-01',
            lastUsed: '2024-03-13'
        },
        {
            id: '3',
            name: 'Google Gemini',
            type: 'google',
            model: 'gemini-pro',
            apiKey: 'AIza...ghi789',
            status: 'error',
            usage: 0,
            limit: 100000,
            createdAt: '2024-02-15'
        }
    ])

    const handleAddProvider = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const newProvider: AIProvider = {
                id: Date.now().toString(),
                name: 'New AI Provider',
                type: 'openai',
                model: 'gpt-3.5-turbo',
                apiKey: '',
                status: 'disconnected',
                usage: 0,
                limit: 100000,
                createdAt: new Date().toISOString()
            }
            
            setProviders(prev => [...prev, newProvider])
            setShowProviderDialog(false)
            alert('AI provider added successfully')
        } catch {
            alert('Failed to add AI provider')
        } finally {
            setLoading(false)
        }
    }

    const handleTestConnection = async (providerId: string) => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            setProviders(prev =>
                prev.map(provider =>
                    provider.id === providerId
                        ? { ...provider, status: 'connected' as const, lastUsed: new Date().toISOString() }
                        : provider
                )
            )
            alert('Connection test successful')
        } catch {
            setProviders(prev =>
                prev.map(provider =>
                    provider.id === providerId
                        ? { ...provider, status: 'error' as const }
                        : provider
                )
            )
            alert('Connection test failed')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteProvider = (providerId: string) => {
        setProviders(prev => prev.filter(provider => provider.id !== providerId))
        alert('AI provider deleted successfully')
    }

    const getProviderIcon = (type: AIProvider['type']) => {
        switch (type) {
            case 'openai': return <Bot className="h-5 w-5" />
            case 'anthropic': return <Cpu className="h-5 w-5" />
            case 'google': return <Cloud className="h-5 w-5" />
            default: return <Settings className="h-5 w-5" />
        }
    }

    const getStatusColor = (status: AIProvider['status']) => {
        switch (status) {
            case 'connected': return 'bg-green-50 border-green-200 text-green-800'
            case 'disconnected': return 'bg-gray-50 border-gray-200 text-gray-800'
            case 'error': return 'bg-red-50 border-red-200 text-red-800'
        }
    }

    const getUsagePercentage = (usage: number, limit: number) => {
        return Math.round((usage / limit) * 100)
    }

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <Card className='border-none'>
                <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold">AI Providers</h1>
                                <p className="text-muted-foreground">Manage your AI service providers and models</p>
                            </div>
                            <Button onClick={() => setShowProviderDialog(true)} variant="outline" size="sm" className="border-b-2">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Provider
                            </Button>
                        </div>

                        {/* Usage Overview */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Usage Overview
                                </h3>
                                <p className="text-sm text-muted-foreground">Monitor your AI service usage across all providers</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Bot className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Total Requests</h4>
                                            <p className="text-2xl font-bold">{providers.reduce((sum, p) => sum + p.usage, 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Active Providers</h4>
                                            <p className="text-2xl font-bold">{providers.filter(p => p.status === 'connected').length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Issues</h4>
                                            <p className="text-2xl font-bold">{providers.filter(p => p.status === 'error').length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Providers List */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Bot className="h-5 w-5" />
                                    AI Providers
                                </h3>
                                <p className="text-sm text-muted-foreground">Configure and manage your AI service providers</p>
                            </div>
                            <div className="rounded-md border">
                                {providers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center">
                                        <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold">No AI providers configured</h3>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Add your first AI provider to start using AI features
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {providers.map((provider) => (
                                            <div key={provider.id} className="p-4">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        {getProviderIcon(provider.type)}
                                                        <div>
                                                            <h4 className="font-medium">{provider.name}</h4>
                                                            <p className="text-sm text-muted-foreground">{provider.model}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {provider.type}
                                                                </Badge>
                                                                <Badge className={getStatusColor(provider.status)}>
                                                                    {provider.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleTestConnection(provider.id)}
                                                            disabled={loading}
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Testing...
                                                                </>
                                                            ) : (
                                                                'Test Connection'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedProvider(provider)
                                                                setShowSettingsDialog(true)
                                                            }}
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteProvider(provider.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="flex items-center justify-between text-sm mb-1">
                                                            <span>Usage</span>
                                                            <span>{provider.usage.toLocaleString()} / {provider.limit.toLocaleString()}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                                style={{ width: `${Math.min(getUsagePercentage(provider.usage, provider.limit), 100)}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {getUsagePercentage(provider.usage, provider.limit)}% of limit used
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="text-sm text-muted-foreground">
                                                        <p>Created: {new Date(provider.createdAt).toLocaleDateString()}</p>
                                                        {provider.lastUsed && (
                                                            <p>Last used: {new Date(provider.lastUsed).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Provider Settings */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Global Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">Configure global AI provider settings</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    <div className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-medium">Auto-fallback</p>
                                            <p className="text-sm text-muted-foreground">Automatically switch to backup providers on failure</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-medium">Usage monitoring</p>
                                            <p className="text-sm text-muted-foreground">Track and limit API usage across all providers</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-medium">Request caching</p>
                                            <p className="text-sm text-muted-foreground">Cache responses to reduce API calls and costs</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Provider Dialog */}
            <Dialog open={showProviderDialog} onOpenChange={setShowProviderDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add AI Provider</DialogTitle>
                        <DialogDescription>
                            Configure a new AI service provider
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="provider-name">Provider Name</Label>
                            <Input
                                id="provider-name"
                                placeholder="e.g., OpenAI GPT-4"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="provider-type">Provider Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select provider type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="openai">OpenAI</SelectItem>
                                    <SelectItem value="anthropic">Anthropic</SelectItem>
                                    <SelectItem value="google">Google</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="provider-model">Model</Label>
                            <Input
                                id="provider-model"
                                placeholder="e.g., gpt-4, claude-3-sonnet"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="provider-api-key">API Key</Label>
                            <Input
                                id="provider-api-key"
                                type="password"
                                placeholder="Enter your API key"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="provider-endpoint">Custom Endpoint (optional)</Label>
                            <Input
                                id="provider-endpoint"
                                placeholder="https://api.example.com/v1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowProviderDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddProvider} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Provider'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Provider Settings Dialog */}
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Provider Settings</DialogTitle>
                        <DialogDescription>
                            Configure settings for {selectedProvider?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Provider Name</Label>
                            <Input
                                value={selectedProvider?.name || ''}
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Model</Label>
                            <Input
                                value={selectedProvider?.model || ''}
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Badge className={getStatusColor(selectedProvider?.status || 'disconnected')}>
                                {selectedProvider?.status || 'disconnected'}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <Label>Usage</Label>
                            <p className="text-sm text-muted-foreground">
                                {selectedProvider?.usage.toLocaleString()} / {selectedProvider?.limit.toLocaleString()} requests
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="auto-retry" />
                            <Label htmlFor="auto-retry">Enable auto-retry on failure</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="rate-limit" defaultChecked />
                            <Label htmlFor="rate-limit">Enable rate limiting</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                            Close
                        </Button>
                        <Button onClick={() => setShowSettingsDialog(false)}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
