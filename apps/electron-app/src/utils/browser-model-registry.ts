import type { ModelInfo, ProviderType } from '@repo/types'

/**
 * Browser-compatible Model Registry
 * Contains only the methods needed for browser functionality
 */
export class BrowserModelRegistry {
  private static models: Record<ProviderType, ModelInfo[]> = {
    openai: [
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', contextWindow: 128000, description: 'Most capable GPT-4 model' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', contextWindow: 128000, description: 'Affordable and fast' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', contextWindow: 128000, description: 'Previous generation flagship' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', contextWindow: 16385, description: 'Fast and efficient' },
    ],
    anthropic: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic', contextWindow: 200000, description: 'Most intelligent model' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'anthropic', contextWindow: 200000, description: 'Fastest model' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', contextWindow: 200000, description: 'Powerful model for complex tasks' },
    ],
    google: [
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'google', contextWindow: 1000000, description: 'Latest experimental model' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', contextWindow: 2000000, description: 'Most capable Gemini model' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', contextWindow: 1000000, description: 'Fast and efficient' },
    ],
    mistral: [
      { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'mistral', contextWindow: 128000, description: 'Most capable Mistral model' },
      { id: 'mistral-small-latest', name: 'Mistral Small', provider: 'mistral', contextWindow: 32000, description: 'Efficient and fast' },
      { id: 'codestral-latest', name: 'Codestral', provider: 'mistral', contextWindow: 32000, description: 'Specialized for code' },
    ],
    ollama: [
      // Default models - will be updated dynamically when Ollama is detected
      { id: 'llama3.2', name: 'Llama 3.2', provider: 'ollama', description: 'Latest Llama model' },
      { id: 'llama3.1', name: 'Llama 3.1', provider: 'ollama', description: 'Previous Llama version' },
      { id: 'mistral', name: 'Mistral', provider: 'ollama', description: 'Mistral 7B' },
      { id: 'codellama', name: 'Code Llama', provider: 'ollama', description: 'Specialized for code' },
      { id: 'phi3', name: 'Phi-3', provider: 'ollama', description: 'Microsoft Phi-3' },
      { id: 'qwen2.5', name: 'Qwen 2.5', provider: 'ollama', description: 'Alibaba Qwen' },
    ],
    openrouter: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'openrouter', description: 'Via OpenRouter' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openrouter', description: 'Via OpenRouter' },
      { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'openrouter', description: 'Via OpenRouter' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'openrouter', description: 'Via OpenRouter' },
    ],
    custom: [],
  };

  /**
   * Update Ollama models dynamically
   */
  static updateOllamaModels(models: ModelInfo[]): void {
    this.models.ollama = models;
  }

  /**
   * Get Ollama models from a local instance
   */
  static async getOllamaModelsFromInstance(baseURL: string = 'http://localhost:11434'): Promise<ModelInfo[]> {
    try {
      const response = await fetch(`${baseURL}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        const ollamaModels = data.models || [];
        
        return ollamaModels.map((model: any) => ({
          id: model.name,
          name: model.name,
          provider: 'ollama' as const,
          description: `${model.details.family} - ${model.details.parameter_size}`,
          contextWindow: model.details.format === 'gguf' ? 4096 : 8192, // Estimate
        }));
      }
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
    }

    return this.models.ollama; // Return default models if detection fails
  }

  static getModels(provider: ProviderType): ModelInfo[] {
    return this.models[provider] || [];
  }

  static getModel(provider: ProviderType, modelId: string): ModelInfo | undefined {
    return this.models[provider]?.find(m => m.id === modelId);
  }

  static getAllProviders(): ProviderType[] {
    return Object.keys(this.models) as ProviderType[];
  }
}
