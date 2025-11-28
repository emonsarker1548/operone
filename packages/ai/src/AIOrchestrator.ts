import { LocalModel, ModelConfig } from './LocalModel';

export class AIOrchestrator {
  private model: LocalModel;

  constructor(config: ModelConfig) {
    this.model = new LocalModel(config);
  }

  async initialize(): Promise<void> {
    await this.model.load();
  }

  async processRequest(prompt: string, options?: any): Promise<string> {
    if (!this.model.isLoaded()) {
      await this.initialize();
    }
    return this.model.generate(prompt, options);
  }
  
  isReady(): boolean {
    return this.model.isLoaded();
  }
}
