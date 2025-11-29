import { ModelProvider } from '../model-provider';
import { streamText, generateText } from 'ai';
import { EventBus } from '../core/EventBus';
import { ASSISTANT_AGENT_SYSTEM_PROMPT } from '../prompts/assistant-agent';

export interface AssistantAgentOptions {
  provider: ModelProvider;
  eventBus?: EventBus;
}

/**
 * AssistantAgent - General purpose AI assistant
 * Handles conversational interactions with streaming support
 */
export class AssistantAgent {
  private provider: ModelProvider;
  private eventBus: EventBus;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  constructor(options: AssistantAgentOptions | ModelProvider) {
    // Support both old and new constructor signatures
    if (options instanceof ModelProvider) {
      this.provider = options;
      this.eventBus = EventBus.getInstance();
    } else {
      this.provider = options.provider;
      this.eventBus = options.eventBus || EventBus.getInstance();
    }
  }

  /**
   * Generate a response without streaming
   */
  async generateResponse(message: string, context?: string[]): Promise<string> {
    try {
      const model = this.provider.getModel();
      
      // Build messages array
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: ASSISTANT_AGENT_SYSTEM_PROMPT }
      ];

      // Add conversation history
      this.conversationHistory.forEach(msg => {
        messages.push(msg);
      });

      // Add context if provided
      if (context && context.length > 0) {
        messages.push({
          role: 'system',
          content: `Relevant context:\n${context.join('\n')}`
        });
      }

      // Add current message
      messages.push({ role: 'user', content: message });

      const { text } = await generateText({
        model,
        messages,
      });

      // Update conversation history
      this.conversationHistory.push({ role: 'user', content: message });
      this.conversationHistory.push({ role: 'assistant', content: text });

      // Keep only last 10 messages
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return text;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  /**
   * Generate a streaming response
   */
  async generateStreamingResponse(
    message: string,
    context?: string[],
    onToken?: (token: string) => void
  ): Promise<string> {
    try {
      const model = this.provider.getModel();
      
      // Build messages array
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: ASSISTANT_AGENT_SYSTEM_PROMPT }
      ];

      // Add conversation history
      this.conversationHistory.forEach(msg => {
        messages.push(msg);
      });

      // Add context if provided
      if (context && context.length > 0) {
        messages.push({
          role: 'system',
          content: `Relevant context:\n${context.join('\n')}`
        });
      }

      // Add current message
      messages.push({ role: 'user', content: message });

      const result = await streamText({
        model,
        messages,
      });

      let fullText = '';

      // Stream tokens
      for await (const chunk of result.textStream) {
        fullText += chunk;
        
        // Emit token via event bus
        this.eventBus.publish('stream', 'token', chunk);
        
        // Call callback if provided
        if (onToken) {
          onToken(chunk);
        }
      }

      // Update conversation history
      this.conversationHistory.push({ role: 'user', content: message });
      this.conversationHistory.push({ role: 'assistant', content: fullText });

      // Keep only last 20 messages
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      // Emit completion
      this.eventBus.publish('stream', 'complete', fullText);

      return fullText;
    } catch (error) {
      console.error('Error generating streaming response:', error);
      this.eventBus.publish('stream', 'error', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }
}
