import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalModel } from './LocalModel';
import { InferenceResultType } from '@llama-node/llama-cpp';
import * as fs from 'fs';

// Mock fs to avoid file checks
vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
}));

// Mock @llama-node/llama-cpp
const mockInference = vi.fn();
const mockLoad = vi.fn();

vi.mock('@llama-node/llama-cpp', () => {
  return {
    LLama: {
      load: (...args: any[]) => mockLoad(...args),
    },
    InferenceResultType: {
      Data: 'Data',
      End: 'End',
      Error: 'Error',
    },
  };
});

describe('LocalModel', () => {
  let model: LocalModel;
  const config = {
    path: '/path/to/model.gguf',
    contextSize: 2048,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    model = new LocalModel(config);
  });

  it('should load the model successfully', async () => {
    mockLoad.mockResolvedValue({
      inference: mockInference,
    });

    await model.load();

    expect(mockLoad).toHaveBeenCalledWith(
      expect.objectContaining({
        modelPath: config.path,
        nCtx: config.contextSize,
      }),
      false
    );
    expect(model.isLoaded()).toBe(true);
  });

  it('should generate text successfully', async () => {
    // Setup mock model
    mockLoad.mockResolvedValue({
      inference: mockInference,
    });
    await model.load();

    // Setup inference mock to simulate streaming
    mockInference.mockImplementation((params, callback) => {
      // Simulate token 1
      callback({
        type: InferenceResultType.Data,
        data: { token: 'Hello', completed: false },
      });
      // Simulate token 2
      callback({
        type: InferenceResultType.Data,
        data: { token: ' World', completed: false },
      });
      // Simulate end
      callback({
        type: InferenceResultType.End,
      });
    });

    const result = await model.generate('Test prompt');

    expect(result).toBe('Hello World');
    expect(mockInference).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: 'Test prompt',
      }),
      expect.any(Function)
    );
  });

  it('should handle generation errors', async () => {
    mockLoad.mockResolvedValue({
      inference: mockInference,
    });
    await model.load();

    mockInference.mockImplementation((params, callback) => {
      callback({
        type: InferenceResultType.Error,
        message: 'Generation failed',
      });
    });

    await expect(model.generate('Test prompt')).rejects.toThrow('Generation failed');
  });
});
