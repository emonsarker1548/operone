const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // AI Chat
  sendMessage: (message: string) => ipcRenderer.invoke('ai:sendMessage', message),
  
  // Memory operations
  ingestDocument: (id: string, content: string, metadata?: any) => 
    ipcRenderer.invoke('ai:ingestDocument', { id, content, metadata }),
  queryMemory: (query: string) => ipcRenderer.invoke('ai:queryMemory', query),
  getStats: () => ipcRenderer.invoke('ai:getStats'),
  
  // File operations
  readFile: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
  writeFile: (filePath: string, content: string) => 
    ipcRenderer.invoke('file:write', { filePath, content }),
  listDirectory: (dirPath: string) => ipcRenderer.invoke('file:list', dirPath),
  
  // Shell operations
  executeCommand: (command: string) => ipcRenderer.invoke('shell:execute', command),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: any) => ipcRenderer.invoke('settings:update', settings),
  
  // Authentication
  login: () => ipcRenderer.invoke('auth:login'),
  logout: () => ipcRenderer.invoke('auth:logout'),
  getUser: () => ipcRenderer.invoke('auth:getUser'),
  setUser: (user: any, token: string) => ipcRenderer.invoke('auth:setUser', { user, token }),
  onAuthSuccess: (callback: (event: any, data: { token: string }) => void) => {
    ipcRenderer.on('auth-success', callback)
    return () => ipcRenderer.removeListener('auth-success', callback)
  },
  
  // AI Provider Management
  ai: {
    sendMessage: (message: string) => ipcRenderer.invoke('ai:provider:sendMessage', message),
    getActiveProvider: () => ipcRenderer.invoke('ai:provider:getActive'),
    getAllProviders: () => ipcRenderer.invoke('ai:provider:getAll'),
    setActiveProvider: (id: string) => ipcRenderer.invoke('ai:provider:setActive', id),
    addProvider: (id: string, config: any) => ipcRenderer.invoke('ai:provider:add', { id, config }),
    removeProvider: (id: string) => ipcRenderer.invoke('ai:provider:remove', id),
    updateProvider: (id: string, config: any) => ipcRenderer.invoke('ai:provider:update', { id, config }),
    testProvider: (id: string) => ipcRenderer.invoke('ai:provider:test', id),
    getModels: (providerType: string) => ipcRenderer.invoke('ai:getModels', providerType),
  },
})

// Type definitions for TypeScript
export interface ElectronAPI {
  sendMessage: (message: string) => Promise<string>
  ingestDocument: (id: string, content: string, metadata?: any) => Promise<void>
  queryMemory: (query: string) => Promise<any[]>
  getStats: () => Promise<{ vectorDocuments: number; shortTermMemory: number }>
  readFile: (filePath: string) => Promise<string>
  writeFile: (filePath: string, content: string) => Promise<void>
  listDirectory: (dirPath: string) => Promise<string[]>
  executeCommand: (command: string) => Promise<{ stdout: string; stderr: string; exitCode: number }>
  getSettings: () => Promise<any>
  updateSettings: (settings: any) => Promise<void>
  login: () => Promise<void>
  logout: () => Promise<void>
  getUser: () => Promise<{ id: string; email: string; name: string; image?: string } | null>
  setUser: (user: any, token: string) => Promise<void>
  onAuthSuccess: (callback: (event: any, data: { token: string }) => void) => () => void
  
  // AI Provider Management
  ai: {
    sendMessage: (message: string) => Promise<string>
    getActiveProvider: () => Promise<any>
    getAllProviders: () => Promise<any>
    setActiveProvider: (id: string) => Promise<boolean>
    addProvider: (id: string, config: any) => Promise<void>
    removeProvider: (id: string) => Promise<boolean>
    updateProvider: (id: string, config: any) => Promise<void>
    testProvider: (id: string) => Promise<{ success: boolean; error?: string }>
    getModels: (providerType: string) => Promise<any[]>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
