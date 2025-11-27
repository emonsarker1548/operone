import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StreamHandler } from './StreamHandler';
import { EventBus } from '../core/EventBus';

// Mock AI SDK
vi.mock('ai', () => ({
  streamText: vi.fn(),
}));

import { streamText } from 'ai';

describe('StreamHandler', () => {
  let handler: StreamHandler;
  let publishSpy: any;

  beforeEach(() => {
    handler = new StreamHandler();
    const eventBus = EventBus.getInstance();
    publishSpy = vi.spyOn(eventBus, 'publish');
    vi.clearAllMocks();
  });

  afterEach(() => {
    publishSpy.mockRestore();
  });

  describe('streamResponse', () => {
    it('should stream tokens and accumulate full text', async () => {
      const mockStream = {
        textStream: (async function* () {
          yield 'Hello';
          yield ' ';
          yield 'world';
        })(),
      };

      (streamText as any).mockResolvedValue(mockStream);

      const mockModel = { name: 'test-model' };
      const result = await handler.streamResponse(mockModel, 'test prompt');

      expect(result).toBe('Hello world');
      expect(streamText).toHaveBeenCalledWith({
        model: mockModel,
        prompt: 'test prompt',
      });
    });

    it('should emit stream events', async () => {
      const mockStream = {
        textStream: (async function* () {
          yield 'token1';
          yield 'token2';
        })(),
      };

      (streamText as any).mockResolvedValue(mockStream);

      await handler.streamResponse({ name: 'test' }, 'prompt');

      expect(publishSpy).toHaveBeenCalledWith('stream', 'start', { prompt: 'prompt' });
      expect(publishSpy).toHaveBeenCalledWith('stream', 'token', {
        token: 'token1',
        accumulated: 'token1',
      });
      expect(publishSpy).toHaveBeenCalledWith('stream', 'token', {
        token: 'token2',
        accumulated: 'token1token2',
      });
      expect(publishSpy).toHaveBeenCalledWith('stream', 'complete', expect.any(Object));
    });

    it('should call onToken callback for each token', async () => {
      const mockStream = {
        textStream: (async function* () {
          yield 'a';
          yield 'b';
          yield 'c';
        })(),
      };

      (streamText as any).mockResolvedValue(mockStream);

      const tokens: string[] = [];
      await handler.streamResponse({ name: 'test' }, 'prompt', undefined, {
        onToken: (token) => tokens.push(token),
      });

      expect(tokens).toEqual(['a', 'b', 'c']);
    });

    it('should call onComplete callback with full text', async () => {
      const mockStream = {
        textStream: (async function* () {
          yield 'Hello';
          yield ' world';
        })(),
      };

      (streamText as any).mockResolvedValue(mockStream);

      let fullText = '';
      await handler.streamResponse({ name: 'test' }, 'prompt', undefined, {
        onComplete: (text) => (fullText = text),
      });

      expect(fullText).toBe('Hello world');
    });

    it('should handle errors and emit error event', async () => {
      const error = new Error('Stream failed');
      (streamText as any).mockRejectedValue(error);

      const onError = vi.fn();

      await expect(
        handler.streamResponse({ name: 'test' }, 'prompt', undefined, { onError })
      ).rejects.toThrow('Stream failed');

      expect(publishSpy).toHaveBeenCalledWith('stream', 'error', {
        error: 'Stream failed',
      });
      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should include system prompt when provided', async () => {
      const mockStream = {
        textStream: (async function* () {
          yield 'response';
        })(),
      };

      (streamText as any).mockResolvedValue(mockStream);

      await handler.streamResponse({ name: 'test' }, 'prompt', 'system prompt');

      expect(streamText).toHaveBeenCalledWith({
        model: { name: 'test' },
        prompt: 'prompt',
        system: 'system prompt',
      });
    });
  });

  describe('streamWithTransform', () => {
    it('should transform tokens before accumulation', async () => {
      const mockStream = {
        textStream: (async function* () {
          yield 'hello';
          yield 'world';
        })(),
      };

      (streamText as any).mockResolvedValue(mockStream);

      const result = await handler.streamWithTransform(
        { name: 'test' },
        'prompt',
        undefined,
        (token) => token.toUpperCase()
      );

      expect(result).toBe('HELLOWORLD');
    });

    it('should emit transformed tokens in events', async () => {
      const mockStream = {
        textStream: (async function* () {
          yield 'a';
          yield 'b';
        })(),
      };

      (streamText as any).mockResolvedValue(mockStream);

      await handler.streamWithTransform(
        { name: 'test' },
        'prompt',
        undefined,
        (token) => token.toUpperCase()
      );

      expect(publishSpy).toHaveBeenCalledWith('stream', 'token', {
        token: 'A',
        original: 'a',
      });
      expect(publishSpy).toHaveBeenCalledWith('stream', 'token', {
        token: 'B',
        original: 'b',
      });
    });
  });
});
