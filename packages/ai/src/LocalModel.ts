import { LLama, ModelLoad, Generate, InferenceResult, InferenceResultType } from '@llama-node/llama-cpp';
import * as fs from 'fs';

export interface ModelConfig {
  path: string;
  contextSize?: number;
  threads?: number;
  gpuLayers?: number;
  enableLogging?: boolean;
}

export class LocalModel {
  private llama: LLama | null = null;
  private initialized: boolean = false;

  constructor(private config: ModelConfig) {}

  async load(): Promise<void> {
    if (this.initialized) return;

    if (!fs.existsSync(this.config.path)) {
      throw new Error(`Model file not found at ${this.config.path}`);
    }

    try {
      const loadParams: Partial<ModelLoad> = {
        modelPath: this.config.path,
        nCtx: this.config.contextSize ?? 2048,
        nGpuLayers: this.config.gpuLayers ?? 0,
        seed: 0,
        f16Kv: true,
        logitsAll: false,
        vocabOnly: false,
        useMlock: false,
        embedding: false,
        useMmap: true,
      };

      this.llama = await LLama.load(loadParams as any, this.config.enableLogging ?? false);
      
      this.initialized = true;
      console.log(`Model loaded from ${this.config.path}`);
    } catch (error) {
      console.error('Failed to load model:', error);
      throw error;
    }
  }

  async generate(prompt: string, options: Partial<Generate> = {}): Promise<string> {
    if (!this.initialized || !this.llama) {
      throw new Error('Model not initialized. Call load() first.');
    }

    try {
      return new Promise((resolve, reject) => {
        let resultText = '';
        
        const params: Generate = {
          prompt,
          nThreads: this.config.threads ?? 4,
          nTokPredict: options.nTokPredict ?? 1024,
          topK: options.topK ?? 40,
          topP: options.topP ?? 0.95,
          temp: options.temp ?? 0.7,
          repeatPenalty: options.repeatPenalty ?? 1.1,
          ...options
        };

        this.llama!.inference(params, (response: InferenceResult) => {
          if (response.type === InferenceResultType.Data) {
            if (response.data) {
              resultText += response.data.token;
            }
          } else if (response.type === InferenceResultType.End) {
            resolve(resultText);
          } else if (response.type === InferenceResultType.Error) {
            reject(new Error(response.message || 'Unknown error'));
          }
        });
      });
    } catch (error) {
      console.error('Generation failed:', error);
      throw error;
    }
  }

  isLoaded(): boolean {
    return this.initialized;
  }
}
