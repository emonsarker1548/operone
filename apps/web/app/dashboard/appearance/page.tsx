'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Loader2, Palette, Monitor, Eye, User } from 'lucide-react'

interface AppearanceSetting {
    id: string
    title: string
    description: string
    value: string | boolean | number
    type: 'toggle' | 'select' | 'slider' | 'color'
    options?: string[]
}

interface Theme {
    id: string
    name: string
    description: string
    preview: string
    colors: {
        primary: string
        secondary: string
        background: string
        foreground: string
    }
}

export default function AppearancePage() {
    const [saving, setSaving] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState('default')
    const [customTheme, setCustomTheme] = useState({
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#ffffff',
        foreground: '#0f172a'
    })

    // Appearance settings state
    const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSetting[]>([
        {
            id: 'theme',
            title: 'Theme',
            description: 'Choose your preferred color theme',
            value: 'system',
            type: 'select',
            options: ['system', 'light', 'dark']
        },
        {
            id: 'compact-mode',
            title: 'Compact Mode',
            description: 'Use more compact spacing throughout the interface',
            value: false,
            type: 'toggle'
        },
        {
            id: 'sidebar-width',
            title: 'Sidebar Width',
            description: 'Adjust the width of the navigation sidebar',
            value: 280,
            type: 'slider'
        },
        {
            id: 'font-size',
            title: 'Font Size',
            description: 'Adjust the base font size',
            value: 16,
            type: 'slider'
        },
        {
            id: 'animations',
            title: 'Animations',
            description: 'Enable interface animations and transitions',
            value: true,
            type: 'toggle'
        },
        {
            id: 'reduce-motion',
            title: 'Reduce Motion',
            description: 'Minimize animations for better accessibility',
            value: false,
            type: 'toggle'
        },
        {
            id: 'show-avatars',
            title: 'Show Avatars',
            description: 'Display user avatars in lists and comments',
            value: true,
            type: 'toggle'
        },
        {
            id: 'code-syntax',
            title: 'Code Syntax Highlighting',
            description: 'Enable syntax highlighting in code blocks',
            value: true,
            type: 'toggle'
        }
    ])

    const themes: Theme[] = [
        {
            id: 'default',
            name: 'Default',
            description: 'Clean and modern blue theme',
            preview: 'bg-blue-500',
            colors: {
                primary: '#3b82f6',
                secondary: '#64748b',
                background: '#ffffff',
                foreground: '#0f172a'
            }
        },
        {
            id: 'dark',
            name: 'Dark',
            description: 'Dark theme for low-light environments',
            preview: 'bg-gray-800',
        colors: {
            primary: '#8b5cf6',
            secondary: '#64748b',
            background: '#0f172a',
            foreground: '#f8fafc'
        }
        },
        {
            id: 'forest',
            name: 'Forest',
            description: 'Green theme inspired by nature',
            preview: 'bg-green-600',
        colors: {
            primary: '#10b981',
            secondary: '#64748b',
            background: '#ffffff',
            foreground: '#0f172a'
        }
        },
        {
            id: 'sunset',
            name: 'Sunset',
            description: 'Warm orange and red tones',
            preview: 'bg-orange-500',
            colors: {
                primary: '#f97316',
                secondary: '#64748b',
                background: '#ffffff',
                foreground: '#0f172a'
            }
        },
        {
            id: 'ocean',
            name: 'Ocean',
            description: 'Deep blue ocean theme',
            preview: 'bg-cyan-600',
        colors: {
            primary: '#0891b2',
            secondary: '#64748b',
            background: '#ffffff',
            foreground: '#0f172a'
        }
        },
        {
            id: 'custom',
            name: 'Custom',
            description: 'Create your own color scheme',
            preview: 'bg-gradient-to-r from-purple-500 to-pink-500',
        colors: customTheme
        }
    ]

    const handleSettingChange = async (settingId: string, value: string | boolean | number) => {
        setAppearanceSettings(prev => 
            prev.map(setting => 
                setting.id === settingId 
                    ? { ...setting, value }
                    : setting
            )
        )
    }

    const handleThemeChange = async (themeId: string) => {
        setSelectedTheme(themeId)
        if (themeId !== 'custom') {
            const theme = themes.find(t => t.id === themeId)
            if (theme) {
                setCustomTheme(theme.colors)
            }
        }
    }

    const handleCustomThemeChange = (colorType: keyof typeof customTheme, value: string) => {
        setCustomTheme(prev => ({
            ...prev,
            [colorType]: value
        }))
    }

    const handleSaveSettings = async () => {
        setSaving(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            alert('Appearance settings saved successfully')
        } catch {
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleResetSettings = async () => {
        try {
            // Reset to defaults
            setAppearanceSettings(prev => 
                prev.map(setting => {
                    const defaults: Record<string, string | boolean | number> = {
                        'theme': 'system',
                        'compact-mode': false,
                        'sidebar-width': 280,
                        'font-size': 16,
                        'animations': true,
                        'reduce-motion': false,
                        'show-avatars': true,
                        'code-syntax': true
                    }
                    return { ...setting, value: defaults[setting.id] ?? setting.value }
                })
            )
            
            const defaultTheme = themes.find(t => t.id === 'default')
            if (defaultTheme) {
                setSelectedTheme('default')
                setCustomTheme(defaultTheme.colors)
            }
            
            alert('Settings reset to defaults')
        } catch {
            alert('Failed to reset settings')
        }
    }

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <Card className='border-none'>
                <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold">Appearance</h1>
                                <p className="text-muted-foreground">Customize the look and feel of your workspace</p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleResetSettings} variant="outline" size="sm">
                                    Reset to Defaults
                                </Button>
                                <Button onClick={handleSaveSettings} disabled={saving} className="border-b-2">
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Theme Selection */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Theme
                                </h3>
                                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {themes.map((theme) => (
                                            <div
                                                key={theme.id}
                                                className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                                                    selectedTheme === theme.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                }`}
                                                onClick={() => handleThemeChange(theme.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-md ${theme.preview}`} />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{theme.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                                                    </div>
                                                    {selectedTheme === theme.id && (
                                                        <Badge variant="default" className="text-xs">Active</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {selectedTheme === 'custom' && (
                                        <div className="pt-4 border-t space-y-4">
                                            <h4 className="font-medium">Custom Colors</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="primary-color">Primary Color</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="primary-color"
                                                            type="color"
                                                            value={customTheme.primary}
                                                            onChange={(e) => handleCustomThemeChange('primary', e.target.value)}
                                                            className="w-12 h-10 p-1"
                                                        />
                                                        <Input
                                                            value={customTheme.primary}
                                                            onChange={(e) => handleCustomThemeChange('primary', e.target.value)}
                                                            placeholder="#3b82f6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="secondary-color">Secondary Color</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="secondary-color"
                                                            type="color"
                                                            value={customTheme.secondary}
                                                            onChange={(e) => handleCustomThemeChange('secondary', e.target.value)}
                                                            className="w-12 h-10 p-1"
                                                        />
                                                        <Input
                                                            value={customTheme.secondary}
                                                            onChange={(e) => handleCustomThemeChange('secondary', e.target.value)}
                                                            placeholder="#64748b"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="background-color">Background Color</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="background-color"
                                                            type="color"
                                                            value={customTheme.background}
                                                            onChange={(e) => handleCustomThemeChange('background', e.target.value)}
                                                            className="w-12 h-10 p-1"
                                                        />
                                                        <Input
                                                            value={customTheme.background}
                                                            onChange={(e) => handleCustomThemeChange('background', e.target.value)}
                                                            placeholder="#ffffff"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="foreground-color">Foreground Color</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="foreground-color"
                                                            type="color"
                                                            value={customTheme.foreground}
                                                            onChange={(e) => handleCustomThemeChange('foreground', e.target.value)}
                                                            className="w-12 h-10 p-1"
                                                        />
                                                        <Input
                                                            value={customTheme.foreground}
                                                            onChange={(e) => handleCustomThemeChange('foreground', e.target.value)}
                                                            placeholder="#0f172a"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Display Settings */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Monitor className="h-5 w-5" />
                                    Display Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">Configure how content is displayed</p>
                            </div>
                            <div className="rounded-md border">
                                {appearanceSettings.map((setting, index) => (
                                    <div key={setting.id} className={`flex items-center justify-between p-4 ${index !== appearanceSettings.length - 1 ? 'border-b' : ''}`}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{setting.title}</p>
                                                {setting.type === 'toggle' && setting.value && (
                                                    <Badge variant="default" className="text-xs">Enabled</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {setting.type === 'toggle' && (
                                                <Switch
                                                    checked={setting.value as boolean}
                                                    onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
                                                />
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
                                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {setting.type === 'slider' && (
                                                <div className="flex items-center gap-3">
                                                    <Slider
                                                        value={[setting.value as number]}
                                                        onValueChange={([value]) => handleSettingChange(setting.id, value)}
                                                        min={setting.id === 'font-size' ? 12 : 200}
                                                        max={setting.id === 'font-size' ? 24 : 400}
                                                        step={setting.id === 'font-size' ? 1 : 20}
                                                        className="w-24"
                                                    />
                                                    <span className="text-sm text-muted-foreground w-12">
                                                        {setting.id === 'font-size' ? `${setting.value as number}px` : `${setting.value as number}px`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Preview
                                </h3>
                                <p className="text-sm text-muted-foreground">See how your changes look in real-time</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Sample User</h4>
                                            <p className="text-sm text-muted-foreground">user@example.com</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="h-2 bg-muted rounded w-3/4"></div>
                                        <div className="h-2 bg-muted rounded w-1/2"></div>
                                        <div className="h-2 bg-muted rounded w-2/3"></div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">Primary Action</Button>
                                        <Button size="sm">Secondary Action</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
