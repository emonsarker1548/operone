
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Log app mode on startup
const isElectron = !!(window.electronAPI)
console.info(`%c🚀 Operone ${isElectron ? 'Desktop' : 'Browser'} Mode`, 'font-size: 14px; font-weight: bold; color: #8b5cf6')
if (!isElectron) {
    console.info('%cRunning in browser mode. To use Electron features, run: pnpm electron:dev', 'color: #6b7280')
}

import { OSProvider } from './contexts/OSContext'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <OSProvider>
            <App />
        </OSProvider>
    </React.StrictMode>,
)
