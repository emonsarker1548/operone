const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // AI Chat
    sendMessage: (message) => ipcRenderer.invoke('ai:sendMessage', message),

    // Memory operations
    ingestDocument: (id, content, metadata) =>
        ipcRenderer.invoke('ai:ingestDocument', { id, content, metadata }),
    queryMemory: (query) => ipcRenderer.invoke('ai:queryMemory', query),
    getStats: () => ipcRenderer.invoke('ai:getStats'),

    // OS File operations
    fs: {
        read: (path) => ipcRenderer.invoke('os:fs:read', path),
        write: (path, content) => ipcRenderer.invoke('os:fs:write', path, content),
        list: (path) => ipcRenderer.invoke('os:fs:list', path),
    },

    // OS Shell operations
    shell: {
        execute: (command, args) => ipcRenderer.invoke('os:shell:execute', command, args),
    },

    // System operations
    system: {
        getMetrics: () => ipcRenderer.invoke('os:system:metrics'),
    },

    // Settings
    getSettings: () => ipcRenderer.invoke('settings:get'),
    updateSettings: (settings) => ipcRenderer.invoke('settings:update', settings),

    // Authentication
    login: () => ipcRenderer.invoke('auth:login'),
    logout: () => ipcRenderer.invoke('auth:logout'),
    getUser: () => ipcRenderer.invoke('auth:getUser'),
    setUser: (user, token) => ipcRenderer.invoke('auth:setUser', { user, token }),
    onAuthSuccess: (callback) => {
        ipcRenderer.on('auth-success', callback)
        return () => ipcRenderer.removeListener('auth-success', callback)
    },
})
