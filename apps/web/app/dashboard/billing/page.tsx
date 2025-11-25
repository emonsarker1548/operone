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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CreditCard, Calendar, Download, AlertTriangle, Check, Zap, Crown, Star } from 'lucide-react'

interface BillingPlan {
    id: string
    name: string
    price: number
    interval: 'monthly' | 'yearly'
    features: string[]
    popular?: boolean
    current?: boolean
}

interface BillingInvoice {
    id: string
    number: string
    date: string
    amount: number
    status: 'paid' | 'pending' | 'failed'
    downloadUrl: string
}

interface BillingSetting {
    id: string
    title: string
    description: string
    enabled: boolean
}

export default function BillingPage() {
    const [loading, setLoading] = useState(false)
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
    const [showPaymentDialog, setShowPaymentDialog] = useState(false)
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState('pro')
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')

    // Billing plans state
    const [plans] = useState<BillingPlan[]>([
        {
            id: 'free',
            name: 'Free',
            price: 0,
            interval: 'monthly',
            features: [
                '5 projects',
                'Basic support',
                '1GB storage',
                'Community access'
            ],
            current: true
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 29,
            interval: 'monthly',
            features: [
                'Unlimited projects',
                'Priority support',
                '100GB storage',
                'Advanced features',
                'Team collaboration',
                'API access'
            ],
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99,
            interval: 'monthly',
            features: [
                'Everything in Pro',
                'Unlimited storage',
                'Dedicated support',
                'Custom integrations',
                'SLA guarantee',
                'Advanced security',
                'Custom branding'
            ]
        }
    ])

    // Payment methods state
    const paymentMethods = [
        {
            id: '1',
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            expiryMonth: 12,
            expiryYear: 2025,
            isDefault: true
        }
    ]

    // Invoices state
    const [invoices] = useState<BillingInvoice[]>([
        {
            id: '1',
            number: 'INV-2024-001',
            date: '2024-01-15',
            amount: 29,
            status: 'paid',
            downloadUrl: '/invoices/inv-2024-001.pdf'
        },
        {
            id: '2',
            number: 'INV-2024-002',
            date: '2024-02-15',
            amount: 29,
            status: 'paid',
            downloadUrl: '/invoices/inv-2024-002.pdf'
        },
        {
            id: '3',
            number: 'INV-2024-003',
            date: '2024-03-15',
            amount: 29,
            status: 'pending',
            downloadUrl: '/invoices/inv-2024-003.pdf'
        }
    ])

    // Billing settings state
    const [billingSettings, setBillingSettings] = useState<BillingSetting[]>([
        {
            id: 'auto-renew',
            title: 'Auto-renew Subscription',
            description: 'Automatically renew your subscription when it expires',
            enabled: true
        },
        {
            id: 'email-invoices',
            title: 'Email Invoices',
            description: 'Receive invoices via email when they are generated',
            enabled: true
        },
        {
            id: 'payment-reminders',
            title: 'Payment Reminders',
            description: 'Get notified before your payment method expires',
            enabled: true
        }
    ])

    const handleUpgradePlan = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            setShowUpgradeDialog(false)
            alert('Plan upgraded successfully')
        } catch {
            alert('Failed to upgrade plan')
        } finally {
            setLoading(false)
        }
    }

    const handleAddPaymentMethod = async () => {
        setShowPaymentDialog(false)
        alert('Payment method added successfully')
    }

    const handleCancelSubscription = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            setShowCancelDialog(false)
            alert('Subscription cancelled successfully')
        } catch {
            alert('Failed to cancel subscription')
        } finally {
            setLoading(false)
        }
    }

    const handleSettingToggle = async (settingId: string, enabled: boolean) => {
        setBillingSettings(prev => 
            prev.map(setting => 
                setting.id === settingId 
                    ? { ...setting, enabled }
                    : setting
            )
        )
    }

    const handleDownloadInvoice = (invoiceId: string) => {
        alert(`Downloading invoice ${invoiceId}`)
    }

    const getPlanPrice = (plan: BillingPlan) => {
        if (billingInterval === 'yearly' && plan.price > 0) {
            const yearlyPrice = plan.price * 12 * 0.8 // 20% discount for yearly
            return Math.round(yearlyPrice)
        }
        return plan.price
    }

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <Card className='border-none'>
                <CardContent className="w-full border-b px-2 sm:px-0 py-6">
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold">Billing</h1>
                                <p className="text-muted-foreground">Manage your subscription, payment methods, and billing history</p>
                            </div>
                        </div>

                        {/* Current Plan */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Crown className="h-5 w-5" />
                                    Current Plan
                                </h3>
                                <p className="text-sm text-muted-foreground">Your current subscription and usage</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-lg font-semibold">Free Plan</h4>
                                                <Badge variant="secondary">Current</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                $0/month • Billed monthly
                                            </p>
                                            <div className="mt-4 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Projects used</span>
                                                    <span>3 / 5</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Storage used</span>
                                                    <span>512 MB / 1 GB</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Button onClick={() => setShowUpgradeDialog(true)} className="border-b-2">
                                                <Zap className="h-4 w-4 mr-2" />
                                                Upgrade Plan
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Available Plans */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Star className="h-5 w-5" />
                                    Available Plans
                                </h3>
                                <p className="text-sm text-muted-foreground">Choose the plan that best fits your needs</p>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <Label>Billing Interval</Label>
                                <Select value={billingInterval} onValueChange={(value: 'monthly' | 'yearly') => setBillingInterval(value)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly (Save 20%)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`relative rounded-lg border p-6 ${
                                            plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                                        } ${plan.current ? 'bg-muted/30' : ''}`}
                                    >
                                        {plan.popular && (
                                            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                Popular
                                            </Badge>
                                        )}
                                        <div className="text-center">
                                            <h4 className="text-lg font-semibold">{plan.name}</h4>
                                            <div className="mt-2">
                                                <span className="text-3xl font-bold">${getPlanPrice(plan)}</span>
                                                <span className="text-muted-foreground">
                                                    /{billingInterval === 'yearly' ? 'year' : 'month'}
                                                </span>
                                            </div>
                                            {billingInterval === 'yearly' && plan.price > 0 && (
                                                <p className="text-sm text-green-600 mt-1">
                                                    Save ${(plan.price * 12 - getPlanPrice(plan))}/year
                                                </p>
                                            )}
                                        </div>
                                        <ul className="mt-6 space-y-3">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className="w-full mt-6"
                                            variant={plan.current ? "outline" : "default"}
                                            disabled={plan.current}
                                            onClick={() => !plan.current && handleUpgradePlan()}
                                        >
                                            {plan.current ? 'Current Plan' : 'Upgrade'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment Methods
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Manage your payment methods</p>
                                </div>
                                <Button onClick={() => setShowPaymentDialog(true)} variant="outline" size="sm">
                                    Add Payment Method
                                </Button>
                            </div>
                            <div className="rounded-md border">
                                {paymentMethods.map((method, index) => (
                                    <div key={method.id} className={`flex items-center justify-between p-4 ${index !== paymentMethods.length - 1 ? 'border-b' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                <CreditCard className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {method.brand} •••• {method.last4}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Expires {method.expiryMonth}/{method.expiryYear}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {method.isDefault && (
                                                <Badge variant="default" className="text-xs">Default</Badge>
                                            )}
                                            <Button variant="outline" size="sm">Remove</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Billing History */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Billing History
                                </h3>
                                <p className="text-sm text-muted-foreground">View and download your invoices</p>
                            </div>
                            <div className="rounded-md border">
                                {invoices.map((invoice, index) => (
                                    <div key={invoice.id} className={`flex items-center justify-between p-4 ${index !== invoices.length - 1 ? 'border-b' : ''}`}>
                                        <div>
                                            <p className="font-medium">{invoice.number}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(invoice.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">${invoice.amount}</span>
                                            <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownloadInvoice(invoice.id)}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Billing Settings */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Billing Settings
                                </h3>
                                <p className="text-sm text-muted-foreground">Configure your billing preferences</p>
                            </div>
                            <div className="rounded-md border">
                                {billingSettings.map((setting, index) => (
                                    <div key={setting.id} className={`flex items-center justify-between p-4 ${index !== billingSettings.length - 1 ? 'border-b' : ''}`}>
                                        <div className="flex-1">
                                            <p className="font-medium">{setting.title}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                                        </div>
                                        <Switch
                                            checked={setting.enabled}
                                            onCheckedChange={(checked) => handleSettingToggle(setting.id, checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-medium text-destructive">Danger Zone</h3>
                                <p className="text-sm text-muted-foreground">Irreversible actions for your subscription</p>
                            </div>
                            <div className="rounded-md border">
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-medium text-destructive">Cancel Subscription</p>
                                        <p className="text-sm text-muted-foreground">
                                            Cancel your subscription and lose access to premium features
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setShowCancelDialog(true)}
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        Cancel Subscription
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Upgrade Plan Dialog */}
            <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upgrade Your Plan</DialogTitle>
                        <DialogDescription>
                            Choose the plan that best fits your needs
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-3">
                            {plans.filter(p => !p.current).map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`rounded-lg border p-4 cursor-pointer transition-all ${
                                        selectedPlan === plan.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                    onClick={() => setSelectedPlan(plan.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">{plan.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                ${getPlanPrice(plan)}/{billingInterval === 'yearly' ? 'year' : 'month'}
                                            </p>
                                        </div>
                                        <div className="w-4 h-4 rounded-full border-2 border-primary">
                                            {selectedPlan === plan.id && (
                                                <div className="w-2 h-2 rounded-full bg-primary m-0.5" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpgradePlan} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Upgrade Now'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Payment Method Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                            Add a new credit card or bank account
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input
                                id="card-number"
                                placeholder="4242 4242 4242 4242"
                                maxLength={19}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                    id="cvv"
                                    placeholder="123"
                                    maxLength={4}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Cardholder Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddPaymentMethod}>
                            Add Payment Method
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Subscription Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your billing period.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelSubscription}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                'Cancel Subscription'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
