import { streamText } from 'ai';
import { EventBus } from '../core/EventBus';

export interface StreamOptions {
  onToken?: (token: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

/**
 * StreamHandler - Manages streaming LLM responses
 * 
 * Provides real-time token streaming with event emission
 * for monitoring and UI updates.
 */
export class StreamHandler {
  private eventBus: EventBus;
  
  constructor() {
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Stream a response from an LLM model
   * 
   * @param model - AI model instance
   * @param prompt - User prompt
   * @param options - Streaming callbacks
   * @returns Complete response text
   */
  async streamResponse(
    model: any,
    prompt: string,
    system?: string,
    options?: StreamOptions
  ): Promise<string> {
    this.eventBus.publish('stream', 'start', { prompt });
    
    let fullText = '';
    
    try {
      const result = await streamText({
        model,
        prompt,
        ...(system && { system })
      });

      // Stream tokens as they arrive
      for await (const chunk of result.textStream) {
        fullText += chunk;
        
        // Emit event for monitoring
        this.eventBus.publish('stream', 'token', { 
          token: chunk,
          accumulated: fullText 
        });
        
        // Call user callback
        options?.onToken?.(chunk);
      }

      this.eventBus.publish('stream', 'complete', { 
        fullText,
        tokenCount: fullText.split(/\s+/).length 
      });
      
      options?.onComplete?.(fullText);
      
      return fullText;
      
    } catch (error: any) {
      this.eventBus.publish('stream', 'error', { 
        error: error.message 
      });
      
      options?.onError?.(error);
      throw error;
    }
  }

  /**
   * Stream with custom processing
   * Allows transformation of tokens before accumulation
   */
  async streamWithTransform(
    model: any,
    prompt: string,
    system?: string,
    transform?: (token: string) => string,
    options?: StreamOptions
  ): Promise<string> {
    let fullText = '';
    
    const result = await streamText({
      model,
      prompt,
      ...(system && { system })
    });

    for await (const chunk of result.textStream) {
      const transformed = transform ? transform(chunk) : chunk;
      fullText += transformed;
      
      this.eventBus.publish('stream', 'token', { 
        token: transformed,
        original: chunk 
      });
      
      options?.onToken?.(transformed);
    }

    options?.onComplete?.(fullText);
    return fullText;
  }
}
