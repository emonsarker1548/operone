export type View = 'chat' | 'memory' | 'settings'

export interface User {
  id: string
  email: string
  name: string
  image?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface MemoryStats {
  vectorDocuments: number
  shortTermMemory: number
}

export interface Settings {
  openaiApiKey?: string
}

// Electron API types (from preload.ts)
export interface ElectronAPI {
  sendMessage: (message: string) => Promise<string>
  ingestDocument: (id: string, content: string, metadata?: any) => Promise<void>
  queryMemory: (query: string) => Promise<any[]>
  getStats: () => Promise<MemoryStats>
  readFile: (filePath: string) => Promise<string>
  writeFile: (filePath: string, content: string) => Promise<void>
  listDirectory: (dirPath: string) => Promise<string[]>
  executeCommand: (command: string) => Promise<{ stdout: string; stderr: string; exitCode: number }>
  getSettings: () => Promise<Settings>
  updateSettings: (settings: Settings) => Promise<void>
  login: () => Promise<void>
  logout: () => Promise<void>
  getUser: () => Promise<User | null>
  setUser: (user: User, token: string) => Promise<void>
  onAuthSuccess: (callback: (event: any, data: { token: string }) => void) => () => void
}

