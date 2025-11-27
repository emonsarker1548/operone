import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EntityExtractor } from './EntityExtractor';
import { ModelProvider } from '../model-provider';

// Mock AI SDK
vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

import { generateText } from 'ai';

describe('EntityExtractor', () => {
  let extractor: EntityExtractor;
  let mockModelProvider: ModelProvider;

  beforeEach(() => {
    mockModelProvider = {
      getModel: vi.fn(() => ({ name: 'mock-model' })),
    } as any;
    extractor = new EntityExtractor(mockModelProvider);
    vi.clearAllMocks();
  });

  describe('entity extraction', () => {
    it('should extract entities and relations from text', async () => {
      const mockResponse = {
        text: JSON.stringify({
          entities: [
            { name: 'John Doe', type: 'Person', description: 'Software Engineer' },
            { name: 'Google', type: 'Organization', description: 'Tech company' },
          ],
          relations: [
            { source: 'John Doe', target: 'Google', type: 'WORKS_FOR' },
          ],
        }),
      };

      (generateText as any).mockResolvedValue(mockResponse);

      const result = await extractor.extract('John Doe works at Google as a Software Engineer');

      expect(result.entities).toHaveLength(2);
      expect(result.entities[0]).toEqual({
        name: 'John Doe',
        type: 'Person',
        description: 'Software Engineer',
      });
      expect(result.relations).toHaveLength(1);
      expect(result.relations[0]).toEqual({
        source: 'John Doe',
        target: 'Google',
        type: 'WORKS_FOR',
      });
    });

    it('should handle text with multiple entities', async () => {
      const mockResponse = {
        text: JSON.stringify({
          entities: [
            { name: 'Alice', type: 'Person' },
            { name: 'Bob', type: 'Person' },
            { name: 'Acme Corp', type: 'Organization' },
          ],
          relations: [
            { source: 'Alice', target: 'Acme Corp', type: 'WORKS_FOR' },
            { source: 'Bob', target: 'Acme Corp', type: 'WORKS_FOR' },
            { source: 'Alice', target: 'Bob', type: 'COLLEAGUE_OF' },
          ],
        }),
      };

      (generateText as any).mockResolvedValue(mockResponse);

      const result = await extractor.extract('Alice and Bob work at Acme Corp');

      expect(result.entities).toHaveLength(3);
      expect(result.relations).toHaveLength(3);
    });

    it('should call generateText with correct parameters', async () => {
      const mockResponse = {
        text: JSON.stringify({ entities: [], relations: [] }),
      };

      (generateText as any).mockResolvedValue(mockResponse);

      await extractor.extract('Test text');

      expect(generateText).toHaveBeenCalledWith({
        model: { name: 'mock-model' },
        system: expect.stringContaining('Knowledge Graph builder'),
        prompt: 'Text: Test text',
      });
    });
  });

  describe('error handling', () => {
    it('should return empty graph when JSON parsing fails', async () => {
      const mockResponse = {
        text: 'Invalid JSON response',
      };

      (generateText as any).mockResolvedValue(mockResponse);

      const result = await extractor.extract('Test text');

      expect(result).toEqual({ entities: [], relations: [] });
    });

    it('should return empty graph when no JSON found in response', async () => {
      const mockResponse = {
        text: 'Some text without JSON',
      };

      (generateText as any).mockResolvedValue(mockResponse);

      const result = await extractor.extract('Test text');

      expect(result).toEqual({ entities: [], relations: [] });
    });

    it('should handle malformed JSON gracefully', async () => {
      const mockResponse = {
        text: '{ "entities": [invalid json] }',
      };

      (generateText as any).mockResolvedValue(mockResponse);

      const result = await extractor.extract('Test text');

      expect(result).toEqual({ entities: [], relations: [] });
    });
  });

  describe('edge cases', () => {
    it('should handle empty text', async () => {
      const mockResponse = {
        text: JSON.stringify({ entities: [], relations: [] }),
      };

      (generateText as any).mockResolvedValue(mockResponse);

      const result = await extractor.extract('');

      expect(result.entities).toEqual([]);
      expect(result.relations).toEqual([]);
    });

    it('should handle entities without descriptions', async () => {
      const mockResponse = {
        text: JSON.stringify({
          entities: [
            { name: 'Entity1', type: 'Type1' },
          ],
          relations: [],
        }),
      };

      (generateText as any).mockResolvedValue(mockResponse);

      const result = await extractor.extract('Test');

      expect(result.entities[0]?.description).toBeUndefined();
    });
  });
});
