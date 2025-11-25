'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Loader2, Settings, Code, Database, Shield, Globe, RefreshCw } from 'lucide-react'

interface DeveloperSetting {
    id: string
    category: string
    title: string
    description: string
    enabled: boolean
    value?: string | number | boolean
    options?: string[]
    type: 'toggle' | 'select' | 'slider' | 'text' | 'textarea' | 'number'
}

interface APIConfiguration {
    id: string
    name: string
    endpoint: string
    version: string
    status: 'active' | 'inactive' | 'deprecated'
    rateLimit: number
    timeout: number
    retries: number
}

interface WebhookConfig {
    id: string
    url: string
    events: string[]
    secret: string
    active: boolean
    lastTriggered?: string
}

export default function DeveloperSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [showResetDialog, setShowResetDialog] = useState(false)

    // Developer settings state
    const [settings, setSettings] = useState<DeveloperSetting[]>([
        {
            id: 'debug-mode',
            category: 'General',
            title: 'Debug Mode',
            description: 'Enable debug logging and verbose output',
            enabled: false,
            type: 'toggle'
        },
        {
            id: 'auto-save',
            category: 'General',
            title: 'Auto-save',
            description: 'Automatically save changes while editing',
            enabled: true,
            type: 'toggle'
        },
        {
            id: 'api-version',
            category: 'API',
            title: 'API Version',
            description: 'Default API version for requests',
            enabled: true,
            value: 'v1',
            options: ['v1', 'v2', 'beta'],
            type: 'select'
        },
        {
            id: 'rate-limit',
            category: 'API',
            title: 'Rate Limit',
            description: 'Maximum requests per minute',
            enabled: true,
            value: 1000,
            type: 'slider'
        },
        {
            id: 'timeout',
            category: 'API',
            title: 'Request Timeout',
            description: 'Timeout for API requests in seconds',
            enabled: true,
            value: 30,
            type: 'slider'
        },
        {
            id: 'webhook-retries',
            category: 'Webhooks',
            title: 'Webhook Retries',
            description: 'Number of retry attempts for failed webhooks',
            enabled: true,
            value: 3,
            type: 'slider'
        },
        {
            id: 'cors-origins',
            category: 'Security',
            title: 'CORS Origins',
            description: 'Allowed origins for cross-origin requests',
            enabled: true,
            value: 'https://localhost:3000,https://dashboard.operone.com',
            type: 'textarea'
        },
        {
            id: 'api-key-rotation',
            category: 'Security',
            title: 'API Key Rotation',
            description: 'Automatically rotate API keys every 90 days',
            enabled: false,
            type: 'toggle'
        },
        {
            id: 'audit-logging',
            category: 'Security',
            title: 'Audit Logging',
            description: 'Log all API requests and changes',
            enabled: true,
            type: 'toggle'
        },
        {
            id: 'database-pool',
            category: 'Database',
            title: 'Connection Pool Size',
            description: 'Maximum number of database connections',
            enabled: true,
            value: 10,
            type: 'slider'
        },
        {
            id: 'query-timeout',
            category: 'Database',
            title: 'Query Timeout',
            description: 'Timeout for database queries in seconds',
            enabled: true,
            value: 30,
            type: 'slider'
        }
    ])

    // API configurations state
    const [apiConfigs] = useState<APIConfiguration[]>([
        {
            id: '1',
            name: 'Main API',
            endpoint: 'https://api.operone.com',
            version: 'v1',
            status: 'active',
            rateLimit: 1000,
            timeout: 30,
            retries: 3
        },
        {
            id: '2',
            name: 'Beta API',
            endpoint: 'https://beta-api.operone.com',
            version: 'v2',
            status: 'active',
            rateLimit: 500,
            timeout: 45,
            retries: 2
        },
        {
            id: '3',
            name: 'Legacy API',
            endpoint: 'https://legacy-api.operone.com',
            version: 'v0',
            status: 'deprecated',
            rateLimit: 100,
            timeout: 60,
            retries: 1
        }
    ])

    // Webhook configurations state
    const [webhooks] = useState<WebhookConfig[]>([
        {
            id: '1',
            url: 'https://webhook.example.com/operone',
            events: ['user.created', 'project.updated'],
            secret: 'whsec_abc123...',
            active: true,
            lastTriggered: '2024-03-14T10:30:00Z'
        },
        {
            id: '2',
            url: 'https://hooks.slack.com/services/...',
            events: ['deployment.started', 'deployment.completed'],
            secret: 'whsec_def456...',
            active: true,
            lastTriggered: '2024-03-13T14:20:00Z'
        }
    ])

    const handleSettingChange = async (settingId: string, value: string | boolean | number) => {
        setSettings(prev => 
            prev.map(setting => 
                setting.id === settingId 
                    ? { ...setting, value }
                    : setting
            )
        )
    }

    const handleToggleSetting = async (settingId: string, enabled: boolean) => {
        setSettings(prev => 
            prev.map(setting => 
                setting.id === settingId 
                    ? { ...setting, enabled }
                    : setting
            )
        )
    }

    const handleSaveSettings = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            alert('Developer settings saved successfully')
        } catch {
            alert('Failed to save settings')
        } finally {
            setLoading(false)
        }
    }

    const handleResetSettings = async () => {
        try {
            // Reset to defaults
            setSettings(prev => 
                prev.map(setting => {
                    const defaults: Record<string, string | boolean | number> = {
                        'debug-mode': false,
                        'auto-save': true,
                        'api-version': 'v1',
                        'rate-limit': 1000,
                        'timeout': 30,
                        'webhook-retries': 3,
                        'cors-origins': 'https://localhost:3000,https://dashboard.operone.com',
                        'api-key-rotation': false,
                        'audit-logging': true,
                        'database-pool': 10,
                        'query-timeout': 30
                    }
                    return { ...setting, value: defaults[setting.id] ?? setting.value }
                })
            )
            
            setShowResetDialog(false)
            alert('Settings reset to defaults')
        } catch {
            alert('Failed to reset settings')
        }
    }

    const handleTestWebhook = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000))
            alert('Webhook test successful')
        } catch {
            alert('Webhook test failed')
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: APIConfiguration['status']) => {
        switch (status) {
            case 'active': return 'bg-green-50 border-green-200 text-green-800'
            case 'inactive': return 'bg-gray-50 border-gray-200 text-gray-800'
            case 'deprecated': return 'bg-red-50 border-red-200 text-red-800'
        }
    }

    const groupedSettings = settings.reduce((acc, setting) => {
        if (!acc[setting.category]) {
            acc[setting.category] = []
        }
        acc[setting.category].push(setting)
        return acc
    }, {} as Record<string, DeveloperSetting[]>)

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <Card className='border-none'>
                <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold">Developer Settings</h1>
                                <p className="text-muted-foreground">Configure your development environment and API settings</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setShowResetDialog(true)}
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                                <Button 
                                    onClick={handleSaveSettings} 
                                    disabled={loading}
                                    variant="outline" 
                                    size="sm" 
                                    className="border-b-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Settings'
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Settings Categories */}
                        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
                            <div key={category} className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        {category === 'General' && <Settings className="h-5 w-5" />}
                                        {category === 'API' && <Code className="h-5 w-5" />}
                                        {category === 'Webhooks' && <Globe className="h-5 w-5" />}
                                        {category === 'Security' && <Shield className="h-5 w-5" />}
                                        {category === 'Database' && <Database className="h-5 w-5" />}
                                        {category}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {category === 'General' && 'General development preferences'}
                                        {category === 'API' && 'API configuration and behavior'}
                                        {category === 'Webhooks' && 'Webhook delivery settings'}
                                        {category === 'Security' && 'Security and authentication settings'}
                                        {category === 'Database' && 'Database connection and query settings'}
                                    </p>
                                </div>
                                <div className="rounded-md border">
                                    <div className="divide-y">
                                        {categorySettings.map((setting) => (
                                            <div key={setting.id} className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={setting.enabled}
                                                        onCheckedChange={(checked) => handleToggleSetting(setting.id, checked)}
                                                    />
                                                    <div>
                                                        <p className="font-medium">{setting.title}</p>
                                                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {setting.type === 'toggle' && (
                                                        <div className="w-24 text-right text-sm">
                                                            {setting.enabled ? 'Enabled' : 'Disabled'}
                                                        </div>
                                                    )}
                                                    {setting.type === 'select' && setting.options && (
                                                        <Select
                                                            value={setting.value as string}
                                                            onValueChange={(value) => handleSettingChange(setting.id, value)}
                                                        >
                                                            <SelectTrigger className="w-32">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {setting.options.map((option) => (
                                                                    <SelectItem key={option} value={option}>
                                                                        {option}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                    {setting.type === 'slider' && (
                                                        <div className="flex items-center gap-2">
                                                            <Slider
                                                                value={[setting.value as number]}
                                                                onValueChange={([value]) => handleSettingChange(setting.id, value)}
                                                                min={setting.id === 'rate-limit' ? 100 : 1}
                                                                max={setting.id === 'rate-limit' ? 5000 : 300}
                                                                step={setting.id === 'rate-limit' ? 100 : 1}
                                                                className="w-24"
                                                            />
                                                            <span className="text-sm text-muted-foreground w-12">
                                                                {setting.value}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {setting.type === 'text' && (
                                                        <Input
                                                            value={setting.value as string}
                                                            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                                                            className="w-48"
                                                        />
                                                    )}
                                                    {setting.type === 'textarea' && (
                                                        <Textarea
                                                            value={setting.value as string}
                                                            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                                                            rows={2}
                                                            className="w-48"
                                                        />
                                                    )}
                                                    {setting.type === 'number' && (
                                                        <Input
                                                            type="number"
                                                            value={setting.value as number}
                                                            onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
                                                            className="w-24"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* API Configurations */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Code className="h-5 w-5" />
                                    API Configurations
                                </h3>
                                <p className="text-sm text-muted-foreground">Manage API endpoints and versions</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {apiConfigs.map((config) => (
                                        <div key={config.id} className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-medium">{config.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{config.endpoint}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {config.version}
                                                        </Badge>
                                                        <Badge className={getStatusColor(config.status)}>
                                                            {config.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Rate Limit</p>
                                                    <p className="font-medium">{config.rateLimit}/min</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Timeout</p>
                                                    <p className="font-medium">{config.timeout}s</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Retries</p>
                                                    <p className="font-medium">{config.retries}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Webhook Configurations */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Webhook Configurations
                                </h3>
                                <p className="text-sm text-muted-foreground">Configure webhook endpoints and events</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {webhooks.map((webhook) => (
                                        <div key={webhook.id} className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-medium">{webhook.url}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant={webhook.active ? 'default' : 'secondary'}>
                                                            {webhook.active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                        {webhook.lastTriggered && (
                                                            <Badge variant="outline" className="text-xs">
                                Last: {new Date(webhook.lastTriggered).toLocaleDateString()}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleTestWebhook}
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Testing...
                                                            </>
                                                        ) : (
                                                            'Test'
                                                        )}
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Events:</span>
                                                    {webhook.events.map((event) => (
                                                        <Badge key={event} variant="outline" className="text-xs">
                                                            {event}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Secret: {webhook.secret}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reset Confirmation Dialog */}
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Developer Settings?</DialogTitle>
                        <DialogDescription>
                            This will reset all developer settings to their default values. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleResetSettings} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Reset Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
