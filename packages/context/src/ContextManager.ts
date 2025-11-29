import { TokenCounter } from './TokenCounter';

export interface ContextItem {
  id: string;
  content: string;
  tokens: number;
  priority: number;
}

export class ContextManager {
  private items: ContextItem[] = [];
  private tokenCounter: TokenCounter;
  private maxTokens: number;

  constructor(maxTokens: number = 4000) {
    this.tokenCounter = new TokenCounter();
    this.maxTokens = maxTokens;
  }

  addItem(id: string, content: string, priority: number = 1): void {
    const tokens = this.tokenCounter.countTokens(content);
    this.items.push({ id, content, tokens, priority });
    this.optimize();
  }

  private optimize(): void {
    // Sort by priority (desc)
    this.items.sort((a, b) => b.priority - a.priority);

    let currentTokens = 0;
    const keptItems: ContextItem[] = [];

    for (const item of this.items) {
      if (currentTokens + item.tokens <= this.maxTokens) {
        keptItems.push(item);
        currentTokens += item.tokens;
      }
    }

    this.items = keptItems;
  }

  getContext(): string {
    return this.items.map((item) => item.content).join('\n\n');
  }
}
