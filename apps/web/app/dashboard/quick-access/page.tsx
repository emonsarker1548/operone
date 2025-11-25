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
import { Loader2, Zap, Star, Clock, TrendingUp, Settings, Plus, Trash2, Edit3, ExternalLink, Folder, File, Search } from 'lucide-react'

interface QuickAccessItem {
    id: string
    type: 'project' | 'file' | 'folder' | 'tool' | 'bookmark'
    name: string
    description?: string
    url?: string
    icon: string
    category: string
    frequency: number
    lastAccessed: string
    pinned: boolean
    favorite: boolean
}

interface Shortcut {
    id: string
    name: string
    keys: string
    action: string
    enabled: boolean
}

interface RecentActivity {
    id: string
    type: 'create' | 'edit' | 'delete' | 'view'
    item: string
    timestamp: string
    category: string
}

export default function QuickAccessPage() {
    const [loading, setLoading] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    // Quick access items state
    const [quickAccessItems, setQuickAccessItems] = useState<QuickAccessItem[]>([
        {
            id: '1',
            type: 'project',
            name: 'Main Dashboard',
            description: 'Primary project dashboard',
            url: '/dashboard',
            icon: 'dashboard',
            category: 'projects',
            frequency: 45,
            lastAccessed: '2024-03-15T10:30:00Z',
            pinned: true,
            favorite: true
        },
        {
            id: '2',
            type: 'file',
            name: 'API Documentation',
            description: 'REST API reference docs',
            url: '/docs/api',
            icon: 'document',
            category: 'documentation',
            frequency: 32,
            lastAccessed: '2024-03-14T14:20:00Z',
            pinned: true,
            favorite: false
        },
        {
            id: '3',
            type: 'tool',
            name: 'Code Editor',
            description: 'Online code editor',
            url: '/editor',
            icon: 'code',
            category: 'tools',
            frequency: 28,
            lastAccessed: '2024-03-13T09:15:00Z',
            pinned: false,
            favorite: true
        },
        {
            id: '4',
            type: 'folder',
            name: 'Project Assets',
            description: 'Images, fonts, and media files',
            url: '/assets',
            icon: 'folder',
            category: 'files',
            frequency: 15,
            lastAccessed: '2024-03-12T16:45:00Z',
            pinned: false,
            favorite: false
        },
        {
            id: '5',
            type: 'bookmark',
            name: 'GitHub Repository',
            description: 'Main GitHub repo',
            url: 'https://github.com/user/repo',
            icon: 'github',
            category: 'external',
            frequency: 12,
            lastAccessed: '2024-03-11T11:30:00Z',
            pinned: true,
            favorite: false
        }
    ])

    // Shortcuts state
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([
        {
            id: '1',
            name: 'New Project',
            keys: 'Ctrl+Shift+N',
            action: 'create-project',
            enabled: true
        },
        {
            id: '2',
            name: 'Search',
            keys: 'Ctrl+K',
            action: 'search',
            enabled: true
        },
        {
            id: '3',
            name: 'Quick Access',
            keys: 'Ctrl+Shift+Q',
            action: 'quick-access',
            enabled: true
        },
        {
            id: '4',
            name: 'Settings',
            keys: 'Ctrl+,',
            action: 'settings',
            enabled: true
        }
    ])

    // Recent activity state
    const [recentActivity] = useState<RecentActivity[]>([
        {
            id: '1',
            type: 'edit',
            item: 'Main Dashboard',
            timestamp: '2024-03-15T10:30:00Z',
            category: 'projects'
        },
        {
            id: '2',
            type: 'view',
            item: 'API Documentation',
            timestamp: '2024-03-14T14:20:00Z',
            category: 'documentation'
        },
        {
            id: '3',
            type: 'create',
            item: 'New Component',
            timestamp: '2024-03-13T09:15:00Z',
            category: 'development'
        },
        {
            id: '4',
            type: 'edit',
            item: 'Settings',
            timestamp: '2024-03-12T16:45:00Z',
            category: 'system'
        },
        {
            id: '5',
            type: 'view',
            item: 'GitHub Repository',
            timestamp: '2024-03-11T11:30:00Z',
            category: 'external'
        }
    ])

    const categories = [
        { id: 'all', name: 'All Items', icon: Folder },
        { id: 'projects', name: 'Projects', icon: Star },
        { id: 'documentation', name: 'Documentation', icon: File },
        { id: 'tools', name: 'Tools', icon: Zap },
        { id: 'files', name: 'Files', icon: Folder },
        { id: 'external', name: 'External', icon: ExternalLink }
    ]

    const handleAddItem = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const newItem: QuickAccessItem = {
                id: Date.now().toString(),
                type: 'project',
                name: 'New Item',
                description: 'New quick access item',
                url: '/new-item',
                icon: 'star',
                category: 'projects',
                frequency: 0,
                lastAccessed: new Date().toISOString(),
                pinned: false,
                favorite: false
            }
            
            setQuickAccessItems(prev => [...prev, newItem])
            setShowAddDialog(false)
            alert('Quick access item added successfully')
        } catch {
            alert('Failed to add item')
        } finally {
            setLoading(false)
        }
    }

    const handleTogglePin = (itemId: string) => {
        setQuickAccessItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, pinned: !item.pinned }
                    : item
            )
        )
    }

    const handleToggleFavorite = (itemId: string) => {
        setQuickAccessItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, favorite: !item.favorite }
                    : item
            )
        )
    }

    const handleDeleteItem = (itemId: string) => {
        setQuickAccessItems(prev => prev.filter(item => item.id !== itemId))
    }

    const handleToggleShortcut = (shortcutId: string) => {
        setShortcuts(prev =>
            prev.map(shortcut =>
                shortcut.id === shortcutId
                    ? { ...shortcut, enabled: !shortcut.enabled }
                    : shortcut
            )
        )
    }

    const getItemIcon = (type: QuickAccessItem['type']) => {
        switch (type) {
            case 'project': return <Star className="h-5 w-5" />
            case 'file': return <File className="h-5 w-5" />
            case 'folder': return <Folder className="h-5 w-5" />
            case 'tool': return <Zap className="h-5 w-5" />
            case 'bookmark': return <ExternalLink className="h-5 w-5" />
            default: return <Settings className="h-5 w-5" />
        }
    }

    const getActivityIcon = (type: RecentActivity['type']) => {
        switch (type) {
            case 'create': return <Plus className="h-4 w-4 text-green-500" />
            case 'edit': return <Edit3 className="h-4 w-4 text-blue-500" />
            case 'delete': return <Trash2 className="h-4 w-4 text-red-500" />
            case 'view': return <Search className="h-4 w-4 text-gray-500" />
            default: return <Clock className="h-4 w-4 text-gray-500" />
        }
    }

    const filteredItems = quickAccessItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const pinnedItems = filteredItems.filter(item => item.pinned)
    const favoriteItems = filteredItems.filter(item => item.favorite)
    const frequentItems = filteredItems
        .filter(item => !item.pinned && !item.favorite)
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 6)

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <Card className='border-none'>
                <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold">Quick Access</h1>
                                <p className="text-muted-foreground">Fast access to your most used items and tools</p>
                            </div>
                            <Button onClick={() => setShowAddDialog(true)} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </div>

                        {/* Search and Filter */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search quick access items..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Pinned Items */}
                        {pinnedItems.length > 0 && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        Pinned Items
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Your most important items</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pinnedItems.map((item) => (
                                        <div key={item.id} className="rounded-md border p-4 hover:border-primary/50 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    {getItemIcon(item.type)}
                                                    <div>
                                                        <h4 className="font-medium">{item.name}</h4>
                                                        {item.description && (
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleFavorite(item.id)}
                                                    >
                                                        <Star className={`h-4 w-4 ${item.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span>Used {item.frequency} times</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Favorite Items */}
                        {favoriteItems.length > 0 && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        Favorites
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Items you&apos;ve marked as favorites</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {favoriteItems.map((item) => (
                                        <div key={item.id} className="rounded-md border p-4 hover:border-primary/50 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    {getItemIcon(item.type)}
                                                    <div>
                                                        <h4 className="font-medium">{item.name}</h4>
                                                        {item.description && (
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleTogglePin(item.id)}
                                                    >
                                                        <Settings className={`h-4 w-4 ${item.pinned ? 'text-primary' : ''}`} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span>Used {item.frequency} times</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Frequently Used */}
                        {frequentItems.length > 0 && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Frequently Used
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Items you access regularly</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {frequentItems.map((item) => (
                                        <div key={item.id} className="rounded-md border p-4 hover:border-primary/50 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    {getItemIcon(item.type)}
                                                    <div>
                                                        <h4 className="font-medium">{item.name}</h4>
                                                        {item.description && (
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleTogglePin(item.id)}
                                                    >
                                                        <Settings className={`h-4 w-4 ${item.pinned ? 'text-primary' : ''}`} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleFavorite(item.id)}
                                                    >
                                                        <Star className={`h-4 w-4 ${item.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span>Used {item.frequency} times</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Keyboard Shortcuts */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Zap className="h-5 w-5" />
                                        Keyboard Shortcuts
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Quick actions using keyboard shortcuts</p>
                                </div>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {shortcuts.map((shortcut) => (
                                        <div key={shortcut.id} className="flex items-center justify-between p-4">
                                            <div>
                                                <h4 className="font-medium">{shortcut.name}</h4>
                                                <p className="text-sm text-muted-foreground">{shortcut.action}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                                    {shortcut.keys}
                                                </code>
                                                <Switch
                                                    checked={shortcut.enabled}
                                                    onCheckedChange={() => handleToggleShortcut(shortcut.id)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Recent Activity
                                </h3>
                                <p className="text-sm text-muted-foreground">Your recent actions and access history</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-3">
                                                {getActivityIcon(activity.type)}
                                                <div>
                                                    <h4 className="font-medium">{activity.item}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} • {activity.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(activity.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Item Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Quick Access Item</DialogTitle>
                        <DialogDescription>
                            Add a new item to your quick access panel
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="item-name">Item Name</Label>
                            <Input
                                id="item-name"
                                placeholder="e.g., Main Dashboard"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-description">Description</Label>
                            <Input
                                id="item-description"
                                placeholder="Brief description of the item"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-url">URL/Path</Label>
                            <Input
                                id="item-url"
                                placeholder="/dashboard or https://example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-category">Category</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c.id !== 'all').map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-type">Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="project">Project</SelectItem>
                                    <SelectItem value="file">File</SelectItem>
                                    <SelectItem value="folder">Folder</SelectItem>
                                    <SelectItem value="tool">Tool</SelectItem>
                                    <SelectItem value="bookmark">Bookmark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddItem} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Item'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
