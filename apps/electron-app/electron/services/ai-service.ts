import { 
  AssistantAgent, 
  MemoryManager, 
  ProviderManager, 
  createDefaultConfig,
  ModelRegistry
} from '../../../../packages/operone/src'
import type { ProviderType } from '@repo/types'
import Store from 'electron-store'
import path from 'path'
import { app } from 'electron'

const store = new Store()

interface MockAgent {
  sendMessage(message: string): Promise<string>;
  ingestDocument(id: string, content: string, metadata?: any): Promise<void>;
  getStats(): Promise<{ vectorDocuments: number; shortTermMemory: number }>;
}

class AIService {
  private agent: AssistantAgent | MockAgent;
  private memoryManager: MemoryManager
  private providerManager: ProviderManager

  constructor() {
    // Initialize Provider Manager
    this.providerManager = new ProviderManager()
    
    // Load saved providers or use default
    const savedProviders = store.get('ai.providers', {}) as Record<string, any>
    const activeProviderId = store.get('ai.activeProviderId') as string

    if (Object.keys(savedProviders).length === 0) {
      // Initialize with default provider
      const defaultConfig = createDefaultConfig()
      this.providerManager.addProvider('default', defaultConfig)
    } else {
      // Restore saved providers
      Object.entries(savedProviders).forEach(([id, config]) => {
        this.providerManager.addProvider(id, config)
      })
    }

    // Set active provider
    if (activeProviderId && this.providerManager.getProvider(activeProviderId)) {
      this.providerManager.setActiveProvider(activeProviderId)
    }

    // Initialize Memory Manager
    const userDataPath = app.getPath('userData')
    this.memoryManager = new MemoryManager(path.join(userDataPath, 'operone-memory.db'))

    // Initialize Agent
    this.agent = this.createAgent()
  }

  private createAgent() {
    const provider = this.providerManager.getActiveProvider()
    if (!provider) {
      console.warn('No active AI provider found. Please configure a provider in settings.')
      // Return a mock agent that provides helpful error messages
      return this.createMockAgent()
    }

    try {
      return new AssistantAgent({
        modelProvider: provider,
        memoryManager: this.memoryManager
      })
    } catch (error) {
      console.error('Failed to create agent:', error)
      return this.createMockAgent()
    }
  }

  private createMockAgent(): MockAgent {
    const memoryManager = this.memoryManager; // Capture reference for closure
    return {
      async sendMessage(_message: string): Promise<string> {
        return 'AI service is not configured. Please go to Settings and add an AI provider with your API key.'
      },
      async ingestDocument(_id: string, _content: string, _metadata?: any): Promise<void> {
        console.warn('Cannot ingest document: No AI provider configured')
      },
      async getStats(): Promise<{ vectorDocuments: number; shortTermMemory: number }> {
        return {
          vectorDocuments: memoryManager ? 0 : 0,
          shortTermMemory: 0
        }
      }
    }
  }

  private saveProviders() {
    const providers: Record<string, any> = {}
    this.providerManager.getAllProviders().forEach((provider, id) => {
      providers[id] = provider.getConfig()
    })
    store.set('ai.providers', providers)
    
    // Also save active provider ID if we can get it (ProviderManager doesn't expose it directly easily, 
    // but we can track it or assume the one we set is active)
    // For now, let's assume the last set one is active or we need to add getActiveProviderId to ProviderManager
  }

  async sendMessage(message: string): Promise<string> {
    if ('think' in this.agent) {
      return await this.agent.think(message)
    } else {
      return await this.agent.sendMessage(message)
    }
  }

  async ingestDocument(id: string, content: string, metadata?: any): Promise<void> {
    await this.agent.ingestDocument(id, content, metadata)
  }

  async getMemoryStats() {
    return this.agent.getStats()
  }

  getActiveProviderConfig() {
    return this.providerManager.getActiveProvider()?.getConfig()
  }

  getAllProviderConfigs() {
    const configs: Record<string, any> = {}
    this.providerManager.getAllProviders().forEach((provider, id) => {
      configs[id] = provider.getConfig()
    })
    return configs
  }

  setActiveProvider(id: string) {
    const success = this.providerManager.setActiveProvider(id)
    if (success) {
      store.set('ai.activeProviderId', id)
      // Re-create agent with new provider
      this.agent = this.createAgent()
    }
    return success
  }

  addProvider(id: string, config: any) {
    this.providerManager.addProvider(id, config)
    this.saveProviders()
  }

  removeProvider(id: string) {
    const success = this.providerManager.removeProvider(id)
    if (success) {
      this.saveProviders()
      // If active provider was removed, ProviderManager handles switching, but we need to update our agent
      this.agent = this.createAgent()
    }
    return success
  }

  updateProvider(id: string, config: any) {
    // Remove and re-add (simplest way to update for now)
    this.providerManager.removeProvider(id)
    this.providerManager.addProvider(id, config)
    this.saveProviders()
    
    // If this was the active provider, re-create agent
    // We need to check if it was active, but for now just re-create if active provider matches
    // simpler: just re-create agent always if we updated the active one
    // But we don't know if 'id' was active.
    // Let's just re-create agent to be safe if the active provider is this one
    // Or just re-create agent always.
    this.agent = this.createAgent()
  }

  async testProvider(id: string) {
    const provider = this.providerManager.getProvider(id)
    if (!provider) {
      return { success: false, error: 'Provider not found' }
    }
    return await provider.testConnection()
  }

  getModels(providerType: ProviderType) {
    return ModelRegistry.getModels(providerType)
  }
}

let aiService: AIService | null = null

export function getAIService() {
  if (!aiService) {
    aiService = new AIService()
  }
  return aiService
}
