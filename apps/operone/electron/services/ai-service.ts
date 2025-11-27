import { 
  AssistantAgent,
  OSAgent,
  MemoryManager, 
  ProviderManager, 
  createDefaultConfig,
  ModelRegistry,
  RAGEngine,
  Planner,
  ReasoningEngine,
  EventBus,
  AgentManager
} from '@repo/operone'
import type { ProviderType } from '@repo/types'
import Store from 'electron-store'
import path from 'path'
import { app, BrowserWindow } from 'electron'

const store = new Store()

class AIService {
  private assistantAgent: AssistantAgent | null = null;
  private osAgent: OSAgent | null = null;
  private memoryManager: MemoryManager;
  private providerManager: ProviderManager;
  private ragEngine: RAGEngine | null = null;
  private planner: Planner | null = null;
  private reasoningEngine: ReasoningEngine;
  private agentManager: AgentManager;
  private eventBus: EventBus;
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    // Initialize EventBus
    this.eventBus = EventBus.getInstance();
    
    // Subscribe to all events and forward to renderer
    this.setupEventForwarding();

    // Initialize Provider Manager
    this.providerManager = new ProviderManager();
    
    // Load saved providers or use default
    const savedProviders = store.get('ai.providers', {}) as Record<string, any>;
    const activeProviderId = store.get('ai.activeProviderId') as string;

    if (Object.keys(savedProviders).length === 0) {
      const defaultConfig = createDefaultConfig();
      this.providerManager.addProvider('default', defaultConfig);
    } else {
      Object.entries(savedProviders).forEach(([id, config]) => {
        this.providerManager.addProvider(id, config);
      });
    }

    if (activeProviderId && this.providerManager.getProvider(activeProviderId)) {
      this.providerManager.setActiveProvider(activeProviderId);
    }

    // Initialize Memory Manager
    const userDataPath = app.getPath('userData');
    this.memoryManager = new MemoryManager(path.join(userDataPath, 'operone-memory.db'));

    // Initialize Reasoning Engine
    this.reasoningEngine = new ReasoningEngine(5);

    // Initialize Agent Manager
    this.agentManager = new AgentManager();

    // Initialize Agents
    this.initializeAgents();
  }

  private setupEventForwarding() {
    // Forward all agent events to renderer process
    const forwardEvent = (payload: any) => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('agent:event', payload);
      }
    };

    // Subscribe to all event topics
    this.eventBus.subscribe('agent', forwardEvent);
    this.eventBus.subscribe('reasoning', forwardEvent);
    this.eventBus.subscribe('planner', forwardEvent);
    this.eventBus.subscribe('rag', forwardEvent);
    this.eventBus.subscribe('stream', forwardEvent);
  }

  setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
  }

  private initializeAgents() {
    const provider = this.providerManager.getActiveProvider();
    if (!provider) {
      console.warn('No active AI provider found. Agents will not be initialized.');
      return;
    }

    try {
      // Initialize AssistantAgent
      this.assistantAgent = new AssistantAgent({
        modelProvider: provider,
        memoryManager: this.memoryManager
      });

      // Initialize OSAgent with safe defaults
      this.osAgent = new OSAgent({
        modelProvider: provider,
        allowedPaths: [app.getPath('userData'), app.getPath('documents')],
        allowedCommands: ['ls', 'pwd', 'echo', 'cat', 'grep', 'find']
      });

      // Initialize RAGEngine (only if embeddings are supported)
      const embeddingModel = provider.getEmbeddingModel();
      if (embeddingModel) {
        this.ragEngine = new RAGEngine(this.memoryManager, embeddingModel);
        console.log('RAG Engine initialized with embeddings');
      } else {
        // Create RAGEngine without embedding support - it will handle this gracefully
        this.ragEngine = new RAGEngine(this.memoryManager, null);
        console.warn('Embeddings not supported by provider, RAG features will be limited');
      }

      // Initialize Planner
      this.planner = new Planner(provider);

      // Register agents with AgentManager
      this.agentManager.registerAgent(this.assistantAgent, 'General assistance');
      this.agentManager.registerAgent(this.osAgent, 'OS operations');

      console.log('All agents initialized successfully');
    } catch (error) {
      console.error('Failed to initialize agents:', error);
    }
  }

  private saveProviders() {
    const providers: Record<string, any> = {};
    this.providerManager.getAllProviders().forEach((provider, id) => {
      providers[id] = provider.getConfig();
    });
    store.set('ai.providers', providers);
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.assistantAgent) {
      return 'AI service is not configured. Please go to Settings and add an AI provider with your API key.';
    }

    try {
      // Use ReasoningEngine for more sophisticated responses
      const result = await this.reasoningEngine.reason(this.assistantAgent, message);
      return result.finalAnswer;
    } catch (error) {
      console.error('Failed to send message:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  }

  async sendMessageWithAgent(message: string, agentType: 'assistant' | 'os' = 'assistant'): Promise<string> {
    const agent = agentType === 'os' ? this.osAgent : this.assistantAgent;
    
    if (!agent) {
      return 'AI service is not configured. Please go to Settings and add an AI provider with your API key.';
    }

    try {
      const result = await this.reasoningEngine.reason(agent, message);
      return result.finalAnswer;
    } catch (error) {
      console.error('Failed to send message with agent:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  }

  async createPlan(goal: string): Promise<any> {
    if (!this.planner) {
      throw new Error('Planner not initialized');
    }

    const availableTools = ['file.read', 'file.write', 'shell.execute', 'ai.generate'];
    return await this.planner.createPlan(goal, availableTools);
  }

  async ingestDocument(id: string, content: string, metadata?: any): Promise<void> {
    if (!this.ragEngine) {
      console.warn('RAG Engine not initialized');
      return;
    }

    await this.ragEngine.ingestDocument(id, content, metadata);
  }

  async queryRAG(query: string, topK: number = 3): Promise<any[]> {
    if (!this.ragEngine) {
      return [];
    }

    return await this.ragEngine.query(query, topK);
  }

  async getMemoryStats() {
    if (!this.ragEngine) {
      return {
        vectorDocuments: 0,
        shortTermMemory: this.memoryManager.shortTerm.length
      };
    }

    return this.ragEngine.getStats();
  }

  getActiveProviderConfig() {
    return this.providerManager.getActiveProvider()?.getConfig();
  }

  getAllProviderConfigs() {
    const configs: Record<string, any> = {};
    this.providerManager.getAllProviders().forEach((provider, id) => {
      configs[id] = provider.getConfig();
    });
    return configs;
  }

  setActiveProvider(id: string) {
    const success = this.providerManager.setActiveProvider(id);
    if (success) {
      store.set('ai.activeProviderId', id);
      // Re-initialize all agents with new provider
      this.initializeAgents();
    }
    return success;
  }

  addProvider(id: string, config: any) {
    this.providerManager.addProvider(id, config);
    this.saveProviders();
  }

  removeProvider(id: string) {
    const success = this.providerManager.removeProvider(id);
    if (success) {
      this.saveProviders();
      this.initializeAgents();
    }
    return success;
  }

  updateProvider(id: string, config: any) {
    this.providerManager.removeProvider(id);
    this.providerManager.addProvider(id, config);
    this.saveProviders();
    this.initializeAgents();
  }

  async testProvider(id: string) {
    const provider = this.providerManager.getProvider(id);
    if (!provider) {
      return { success: false, error: 'Provider not found' };
    }
    return await provider.testConnection();
  }

  getModels(providerType: ProviderType) {
    return ModelRegistry.getModels(providerType);
  }

  // Get agent status for UI
  getAgentStatus() {
    return {
      assistantAgent: !!this.assistantAgent,
      osAgent: !!this.osAgent,
      ragEngine: !!this.ragEngine,
      planner: !!this.planner
    };
  }
}

let aiService: AIService | null = null;

export function getAIService() {
  if (!aiService) {
    aiService = new AIService();
  }
  return aiService;
}
