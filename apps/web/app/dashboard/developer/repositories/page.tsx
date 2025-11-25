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
import { Loader2, GitBranch, Package, Plus, Terminal, Code, GitCommit, Star, Eye, Users, Calendar, Settings } from 'lucide-react'

interface Repository {
    id: string
    name: string
    description: string
    language: string
    private: boolean
    lastCommit: string
    status: 'active' | 'archived'
    stars: number
    forks: number
    watchers: number
    createdAt: string
    updatedAt: string
    defaultBranch: string
    size: string
    contributors: number
}

interface RepositoryAction {
    id: string
    repositoryId: string
    type: 'clone' | 'pull' | 'push' | 'merge' | 'deploy'
    status: 'pending' | 'running' | 'completed' | 'failed'
    timestamp: string
    user: string
}

export default function RepositoriesPage() {
    const [loading, setLoading] = useState(false)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all')

    // Repositories state
    const [repositories] = useState<Repository[]>([
        {
            id: '1',
            name: 'operone-web',
            description: 'Main web application built with Next.js and TypeScript',
            language: 'TypeScript',
            private: true,
            lastCommit: '2 hours ago',
            status: 'active',
            stars: 42,
            forks: 8,
            watchers: 12,
            createdAt: '2024-01-15',
            updatedAt: '2024-03-14',
            defaultBranch: 'main',
            size: '125 MB',
            contributors: 5
        },
        {
            id: '2',
            name: 'operone-api',
            description: 'REST API server built with Go and PostgreSQL',
            language: 'Go',
            private: true,
            lastCommit: '1 day ago',
            status: 'active',
            stars: 28,
            forks: 4,
            watchers: 8,
            createdAt: '2024-01-20',
            updatedAt: '2024-03-13',
            defaultBranch: 'main',
            size: '45 MB',
            contributors: 3
        },
        {
            id: '3',
            name: 'operone-cli',
            description: 'Command line interface for the Operone platform',
            language: 'Rust',
            private: false,
            lastCommit: '3 days ago',
            status: 'active',
            stars: 156,
            forks: 23,
            watchers: 31,
            createdAt: '2024-02-01',
            updatedAt: '2024-03-11',
            defaultBranch: 'main',
            size: '12 MB',
            contributors: 8
        },
        {
            id: '4',
            name: 'operone-mobile',
            description: 'React Native mobile application',
            language: 'TypeScript',
            private: true,
            lastCommit: '1 week ago',
            status: 'archived',
            stars: 15,
            forks: 2,
            watchers: 4,
            createdAt: '2024-02-15',
            updatedAt: '2024-03-07',
            defaultBranch: 'main',
            size: '89 MB',
            contributors: 2
        }
    ])

    // Recent actions state
    const [recentActions] = useState<RepositoryAction[]>([
        {
            id: '1',
            repositoryId: '1',
            type: 'push',
            status: 'completed',
            timestamp: '2024-03-14T10:30:00Z',
            user: 'john.doe'
        },
        {
            id: '2',
            repositoryId: '2',
            type: 'pull',
            status: 'completed',
            timestamp: '2024-03-13T14:20:00Z',
            user: 'jane.smith'
        },
        {
            id: '3',
            repositoryId: '3',
            type: 'merge',
            status: 'completed',
            timestamp: '2024-03-11T09:15:00Z',
            user: 'mike.wilson'
        }
    ])

    const handleCreateRepository = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            setShowCreateDialog(false)
            alert('Repository created successfully')
        } catch {
            alert('Failed to create repository')
        } finally {
            setLoading(false)
        }
    }

    const handleCloneRepository = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            alert('Repository cloned successfully')
        } catch {
            alert('Failed to clone repository')
        } finally {
            setLoading(false)
        }
    }

    const getLanguageIcon = (language: string) => {
        const icons: Record<string, string> = {
            'TypeScript': '📘',
            'Go': '🐹',
            'Rust': '🦀',
            'JavaScript': '📗',
            'Python': '🐍',
            'Java': '☕',
            'C++': '⚙️'
        }
        return icons[language] || '📄'
    }

    const getActionIcon = (type: RepositoryAction['type']) => {
        switch (type) {
            case 'clone': return <GitBranch className="h-4 w-4" />
            case 'pull': return <GitCommit className="h-4 w-4" />
            case 'push': return <GitCommit className="h-4 w-4" />
            case 'merge': return <GitBranch className="h-4 w-4" />
            case 'deploy': return <Package className="h-4 w-4" />
        }
    }

    const filteredRepositories = repositories.filter(repo => {
        if (filter === 'all') return true
        return repo.status === filter
    })

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <Card className='border-none'>
                <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold">Repositories</h1>
                                <p className="text-muted-foreground">Manage your code repositories and version control</p>
                            </div>
                            <Button onClick={() => setShowCreateDialog(true)} variant="outline" size="sm" className="border-b-2">
                                <Plus className="h-4 w-4 mr-2" />
                                New Repository
                            </Button>
                        </div>

                        {/* Repository Stats */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Repository Overview
                                </h3>
                                <p className="text-sm text-muted-foreground">Summary of your repository activity</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Package className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Total Repos</h4>
                                            <p className="text-2xl font-bold">{repositories.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <Star className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Total Stars</h4>
                                            <p className="text-2xl font-bold">{repositories.reduce((sum, r) => sum + r.stars, 0)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Users className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Contributors</h4>
                                            <p className="text-2xl font-bold">{repositories.reduce((sum, r) => sum + r.contributors, 0)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-md border p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <GitCommit className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Active</h4>
                                            <p className="text-2xl font-bold">{repositories.filter(r => r.status === 'active').length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-4">
                            <Label>Filter:</Label>
                            <Select value={filter} onValueChange={(value: 'all' | 'active' | 'archived') => setFilter(value)}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Repositories List */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <GitBranch className="h-5 w-5" />
                                    Your Repositories
                                </h3>
                                <p className="text-sm text-muted-foreground">Browse and manage your repositories</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {filteredRepositories.map((repo) => (
                                        <div key={repo.id} className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">{getLanguageIcon(repo.language)}</div>
                                                    <div>
                                                        <h4 className="font-medium">{repo.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{repo.description}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {repo.language}
                                                            </Badge>
                                                            <Badge variant={repo.private ? 'default' : 'secondary'} className="text-xs">
                                                                {repo.private ? 'Private' : 'Public'}
                                                            </Badge>
                                                            <Badge variant={repo.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                                                {repo.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleCloneRepository}
                                                        disabled={loading}
                                                    >
                                                        <Terminal className="h-4 w-4 mr-2" />
                                                        Clone
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Code className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-muted-foreground" />
                                                    <span>{repo.stars} stars</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                                                    <span>{repo.forks} forks</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                    <span>{repo.watchers} watching</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>Updated {repo.lastCommit}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                                                <p>Size: {repo.size} • Contributors: {repo.contributors} • Default branch: {repo.defaultBranch}</p>
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
                                    <GitCommit className="h-5 w-5" />
                                    Recent Activity
                                </h3>
                                <p className="text-sm text-muted-foreground">Recent repository actions and commits</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {recentActions.map((action) => {
                                        const repo = repositories.find(r => r.id === action.repositoryId)
                                        return (
                                            <div key={action.id} className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    {getActionIcon(action.type)}
                                                    <div>
                                                        <p className="font-medium">
                                                            {action.type.charAt(0).toUpperCase() + action.type.slice(1)} to {repo?.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            by {action.user} • {new Date(action.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                                                    {action.status}
                                                </Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create Repository Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Repository</DialogTitle>
                        <DialogDescription>
                            Create a new repository for your project
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="repo-name">Repository Name</Label>
                            <Input
                                id="repo-name"
                                placeholder="my-awesome-project"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="repo-description">Description</Label>
                            <Textarea
                                id="repo-description"
                                placeholder="Brief description of your project"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="repo-language">Primary Language</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="typescript">TypeScript</SelectItem>
                                    <SelectItem value="javascript">JavaScript</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="go">Go</SelectItem>
                                    <SelectItem value="rust">Rust</SelectItem>
                                    <SelectItem value="java">Java</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="private" />
                            <Label htmlFor="private">Private repository</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="repo-branch">Default Branch</Label>
                            <Input
                                id="repo-branch"
                                placeholder="main"
                                defaultValue="main"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateRepository} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Repository'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
