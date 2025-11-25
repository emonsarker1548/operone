'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Shield, Trash2, Download, Upload } from 'lucide-react'

interface UserProfile {
    id: string
    name: string
    email: string
    phone: string
    location: string
    avatar: string
    bio: string
    website: string
    joinedDate: string
    lastActive: string
}

interface AccountSetting {
    id: string
    title: string
    description: string
    enabled: boolean
    lastUpdated?: string
}

export default function AccountPage() {
    const [updatingProfile, setUpdatingProfile] = useState(false)
    const [deletingAccount, setDeletingAccount] = useState(false)
    const [showProfileDialog, setShowProfileDialog] = useState(false)
    const [showAvatarDialog, setShowAvatarDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Profile state
    const [profile, setProfile] = useState<UserProfile>({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        avatar: '/avatars/john-doe.jpg',
        bio: 'Software developer passionate about building great products.',
        website: 'https://johndoe.dev',
        joinedDate: '2023-01-15',
        lastActive: '2 minutes ago'
    })

    // Form states
    const [editName, setEditName] = useState(profile.name)
    const [editEmail, setEditEmail] = useState(profile.email)
    const [editPhone, setEditPhone] = useState(profile.phone)
    const [editLocation, setEditLocation] = useState(profile.location)
    const [editBio, setEditBio] = useState(profile.bio)
    const [editWebsite, setEditWebsite] = useState(profile.website)

    // Account settings state
    const [accountSettings, setAccountSettings] = useState<AccountSetting[]>([
        {
            id: 'public-profile',
            title: 'Public Profile',
            description: 'Make your profile visible to other users',
            enabled: true,
            lastUpdated: '2024-01-15'
        },
        {
            id: 'email-notifications',
            title: 'Email Notifications',
            description: 'Receive email updates about your account activity',
            enabled: true,
            lastUpdated: '2024-01-10'
        },
        {
            id: 'two-factor-auth',
            title: 'Two-Factor Authentication',
            description: 'Add an extra layer of security to your account',
            enabled: false,
            lastUpdated: undefined
        },
        {
            id: 'data-export',
            title: 'Data Export',
            description: 'Allow export of your account data',
            enabled: true,
            lastUpdated: '2024-01-08'
        }
    ])

    const handleUpdateProfile = async () => {
        setUpdatingProfile(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            setProfile(prev => ({
                ...prev,
                name: editName,
                email: editEmail,
                phone: editPhone,
                location: editLocation,
                bio: editBio,
                website: editWebsite
            }))
            
            setShowProfileDialog(false)
            alert('Profile updated successfully')
        } catch {
            alert('Failed to update profile')
        } finally {
            setUpdatingProfile(false)
        }
    }

    const handleAvatarUpload = async () => {
        setShowAvatarDialog(false)
        alert('Avatar uploaded successfully')
    }

    const handleDeleteAccount = async () => {
        setDeletingAccount(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            alert('Account deleted successfully')
            // In real app, redirect to login or home page
        } catch {
            alert('Failed to delete account')
        } finally {
            setDeletingAccount(false)
            setShowDeleteDialog(false)
        }
    }

    const handleSettingToggle = async (settingId: string, enabled: boolean) => {
        setAccountSettings(prev => 
            prev.map(setting => 
                setting.id === settingId 
                    ? { ...setting, enabled, lastUpdated: new Date().toISOString() }
                    : setting
            )
        )
    }

    const handleExportData = async () => {
        try {
            // Simulate data export
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Create a sample export
            const exportData = {
                profile,
                settings: accountSettings,
                exportDate: new Date().toISOString()
            }
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `account-data-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            URL.revokeObjectURL(url)
            
            alert('Data exported successfully')
        } catch {
            alert('Failed to export data')
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
                                <h1 className="text-2xl font-bold">Account</h1>
                                <p className="text-muted-foreground">Manage your account settings and personal information</p>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Account Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">Configure your account preferences and privacy options</p>
                            </div>
                            <div className="rounded-md border">
                                {accountSettings.map((setting, index) => (
                                    <div key={setting.id} className={`flex items-center justify-between p-4 ${index !== accountSettings.length - 1 ? 'border-b' : ''}`}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{setting.title}</p>
                                                {setting.enabled && (
                                                    <Badge variant="default" className="text-xs">Active</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                                            {setting.lastUpdated && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Last updated: {new Date(setting.lastUpdated).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                        <Switch
                                            checked={setting.enabled}
                                            onCheckedChange={(checked) => handleSettingToggle(setting.id, checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Data Management */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    Data Management
                                </h3>
                                <p className="text-sm text-muted-foreground">Export or delete your account data</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <div>
                                        <p className="font-medium">Export Your Data</p>
                                        <p className="text-sm text-muted-foreground">Download a copy of all your account information</p>
                                    </div>
                                    <Button onClick={handleExportData} variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-medium text-destructive">Delete Account</p>
                                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                                    </div>
                                    <Button onClick={() => setShowDeleteDialog(true)} variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Profile Dialog */}
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your personal information and profile details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={editLocation}
                                    onChange={(e) => setEditLocation(e.target.value)}
                                    placeholder="Enter your location"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={editWebsite}
                                onChange={(e) => setEditWebsite(e.target.value)}
                                placeholder="Enter your website URL"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                                id="bio"
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                placeholder="Tell us about yourself"
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateProfile} disabled={updatingProfile}>
                            {updatingProfile ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Avatar Upload Dialog */}
            <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Avatar</DialogTitle>
                        <DialogDescription>
                            Upload a new profile picture
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={profile.avatar} alt={profile.name} />
                                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Photo
                                </Button>
                                <Button variant="outline" size="sm">
                                    Remove Photo
                                </Button>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Recommended: Square image, at least 400x400px
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAvatarUpload}>
                            Save Avatar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Account Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including:
                            <ul className="mt-2 list-disc list-inside text-sm">
                                <li>Profile information and settings</li>
                                <li>All uploaded files and documents</li>
                                <li>Account history and activity logs</li>
                                <li>Any connected services or integrations</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deletingAccount}
                        >
                            {deletingAccount ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Account'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
