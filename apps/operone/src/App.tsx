import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ChatInterface } from './features/chat/chat-interface'
import { SettingsPanel } from './features/settings/settings-panel'
import { MemoryInspector } from './features/memory/memory-inspector'
import { AuthProvider, useAuth } from './contexts/auth-context'
import { LoginScreen } from './components/auth/login-screen'
import { AppLayout } from './components/layout/app-layout'
import faviconUrl from './assets/favicon.ico'
import './App.css'

function AppContent() {
    const { isAuthenticated, isLoading } = useAuth()

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <img
                        src={faviconUrl}
                        alt="Operone"
                        className="w-20 h-20 mx-auto animate-pulse"
                    />
                </div>
            </div>
        )
    }

    // Show login screen if not authenticated
    if (!isAuthenticated) {
        return <LoginScreen />
    }

    // Show main app if authenticated
    return (
        <AppLayout>
            <Routes>
                <Route path="/dashboard/overview" element={<ChatInterface />} />
                <Route path="/dashboard/chat" element={<ChatInterface />} />
                <Route path="/dashboard/memory" element={<MemoryInspector />} />
                <Route path="/settings/account" element={<SettingsPanel />} />
                <Route path="/settings/billing" element={<SettingsPanel />} />
                <Route path="/settings/notifications" element={<SettingsPanel />} />
                <Route path="/settings" element={<Navigate to="/settings/account" replace />} />
                <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
                <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
            </Routes>
        </AppLayout>
    )
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    )
}

