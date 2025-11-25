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
import { Loader2, Shield, Key, Smartphone, Mail, AlertTriangle, Check, Eye, EyeOff, RefreshCw } from 'lucide-react'

interface SecuritySetting {
    id: string
    title: string
    description: string
    enabled: boolean
    lastUpdated?: string
}

interface Session {
    id: string
    device: string
    location: string
    lastActive: string
    current: boolean
}

export default function SecurityPage() {
    const [changingPassword, setChangingPassword] = useState(false)
    const [enabling2FA, setEnabling2FA] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [show2FADialog, setShow2FADialog] = useState(false)
    const [showSessionDialog, setShowSessionDialog] = useState(false)
    const [selectedSession, setSelectedSession] = useState<Session | null>(null)

    // Form states
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Security settings state
    const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
        {
            id: '2fa',
            title: 'Two-Factor Authentication',
            description: 'Add an extra layer of security to your account',
            enabled: false,
            lastUpdated: undefined
        },
        {
            id: 'email-verification',
            title: 'Email Verification',
            description: 'Require email verification for sensitive actions',
            enabled: true,
            lastUpdated: '2024-01-15'
        },
        {
            id: 'session-timeout',
            title: 'Auto Session Timeout',
            description: 'Automatically log out after period of inactivity',
            enabled: true,
            lastUpdated: '2024-01-10'
        },
        {
            id: 'login-alerts',
            title: 'Login Alerts',
            description: 'Get notified when someone logs into your account',
            enabled: false,
            lastUpdated: undefined
        }
    ])

    const [activeSessions, setActiveSessions] = useState<Session[]>([
        {
            id: '1',
            device: 'Chrome on MacBook Pro',
            location: 'San Francisco, CA',
            lastActive: '2 minutes ago',
            current: true
        },
        {
            id: '2',
            device: 'Safari on iPhone',
            location: 'San Francisco, CA',
            lastActive: '1 hour ago',
            current: false
        },
        {
            id: '3',
            device: 'Firefox on Windows PC',
            location: 'New York, NY',
            lastActive: '3 days ago',
            current: false
        }
    ])

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match')
            return
        }

        setChangingPassword(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Reset form
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setShowPasswordDialog(false)
            
            alert('Password changed successfully')
        } catch {
            alert('Failed to change password')
        } finally {
            setChangingPassword(false)
        }
    }

    const handle2FAToggle = async (settingId: string, enabled: boolean) => {
        if (settingId === '2fa' && enabled) {
            setShow2FADialog(true)
            return
        }

        setSecuritySettings(prev => 
            prev.map(setting => 
                setting.id === settingId 
                    ? { ...setting, enabled, lastUpdated: new Date().toISOString() }
                    : setting
            )
        )
    }

    const handleEnable2FA = async () => {
        setEnabling2FA(true)
        try {
            // Simulate 2FA setup
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            setSecuritySettings(prev => 
                prev.map(setting => 
                    setting.id === '2fa' 
                        ? { ...setting, enabled: true, lastUpdated: new Date().toISOString() }
                        : setting
                )
            )
            
            setShow2FADialog(false)
            alert('Two-factor authentication enabled successfully')
        } catch {
            alert('Failed to enable 2FA')
        } finally {
            setEnabling2FA(false)
        }
    }

    const handleRevokeSession = async (sessionId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
            setShowSessionDialog(false)
            setSelectedSession(null)
            
            alert('Session revoked successfully')
        } catch {
            alert('Failed to revoke session')
        }
    }

    const handleRevokeAllSessions = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            setActiveSessions(prev => prev.filter(session => session.current))
            alert('All other sessions revoked successfully')
        } catch {
            alert('Failed to revoke sessions')
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
                                <h1 className="text-2xl font-bold">Security</h1>
                                <p className="text-muted-foreground">Manage your account security and privacy settings</p>
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Key className="h-5 w-5" />
                                        Password
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Change your account password</p>
                                </div>
                                <Button onClick={() => setShowPasswordDialog(true)} variant="outline" className="border-b-2">
                                    Change Password
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                <div>
                                    <p className="font-medium">Last changed</p>
                                    <p className="text-sm text-muted-foreground">30 days ago</p>
                                </div>
                            </div>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Smartphone className="h-5 w-5" />
                                        Two-Factor Authentication
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                                </div>
                                <Switch
                                    checked={securitySettings.find(s => s.id === '2fa')?.enabled || false}
                                    onCheckedChange={(checked) => handle2FAToggle('2fa', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                <div>
                                    <p className="font-medium">Authentication Status</p>
                                    <p className="text-sm text-muted-foreground">
                                        {securitySettings.find(s => s.id === '2fa')?.enabled 
                                            ? '2FA is enabled' 
                                            : '2FA is not enabled'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">Configure additional security options</p>
                            </div>
                            <div className="rounded-md border">
                                {securitySettings.filter(s => s.id !== '2fa').map((setting, index) => (
                                    <div key={setting.id} className={`flex items-center justify-between p-4 ${index !== securitySettings.filter(s => s.id !== '2fa').length - 1 ? 'border-b' : ''}`}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{setting.title}</p>
                                                {setting.enabled && (
                                                    <Badge variant="default" className="text-xs">
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Active
                                                    </Badge>
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
                                            onCheckedChange={(checked) => handle2FAToggle(setting.id, checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active Sessions */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Active Sessions
                                </h3>
                                <p className="text-sm text-muted-foreground">Manage and monitor your active login sessions</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <p className="text-sm text-muted-foreground">
                                        {activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''}
                                    </p>
                                    <Button onClick={handleRevokeAllSessions} variant="outline" size="sm">
                                        Revoke All Other Sessions
                                    </Button>
                                </div>
                                {activeSessions.map((session, index) => (
                                    <div key={session.id} className={`flex items-center justify-between p-4 ${index !== activeSessions.length - 1 ? 'border-b' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                {session.current ? (
                                                    <Shield className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{session.device}</p>
                                                <p className="text-sm text-muted-foreground">{session.location}</p>
                                                <p className="text-xs text-muted-foreground">Last active: {session.lastActive}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {session.current && (
                                                <Badge variant="default" className="text-xs">Current</Badge>
                                            )}
                                            {!session.current && (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedSession(session)
                                                        setShowSessionDialog(true)
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Revoke
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Alerts */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Security Recommendations
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {!securitySettings.find(s => s.id === '2fa')?.enabled && (
                                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-yellow-800">Enable Two-Factor Authentication</p>
                                            <p className="text-sm text-yellow-700">
                                                Add an extra layer of security to protect your account from unauthorized access.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                {activeSessions.length > 3 && (
                                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-blue-800">Review Active Sessions</p>
                                            <p className="text-sm text-blue-700">
                                                You have multiple active sessions. Consider revoking any you don&apos;t recognize.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new one
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="current-password"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePasswordChange} disabled={changingPassword}>
                            {changingPassword ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Changing...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2FA Setup Dialog */}
            <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                        <DialogDescription>
                            Set up 2FA to add an extra layer of security to your account
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <Smartphone className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Step 1: Install Authenticator App</p>
                                <p className="text-sm text-muted-foreground">
                                    Download Google Authenticator, Authy, or any other TOTP app
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Step 2: Scan QR Code</p>
                                <p className="text-sm text-muted-foreground">
                                    Scan the QR code below with your authenticator app
                                </p>
                            </div>
                            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-sm text-gray-500">QR Code</p>
                            </div>
                            <div>
                                <p className="font-medium">Step 3: Enter Verification Code</p>
                                <Input
                                    placeholder="000000"
                                    className="w-32 mx-auto text-center text-2xl tracking-widest"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShow2FADialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEnable2FA} disabled={enabling2FA}>
                            {enabling2FA ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enabling...
                                </>
                            ) : (
                                'Enable 2FA'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Session Dialog */}
            <AlertDialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to revoke the session for {selectedSession?.device}?
                            This will log out that device immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => selectedSession && handleRevokeSession(selectedSession.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Revoke Session
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
