import { Memory } from '@repo/types';

export interface MemoryEntry {
  id: number;
  content: string;
  timestamp: number;
  metadata?: string;
}

/**
 * Browser-compatible Memory Manager
 * Uses localStorage instead of SQLite for browser environments
 */
export class BrowserMemoryManager implements Memory {
  public shortTerm: string[] = [];
  private readonly maxShortTermSize = 10;
  private readonly storageKey = 'operone-long-term-memory';

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    // Initialize localStorage if empty
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  private getStoredEntries(): MemoryEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return [];
    }
  }

  private saveEntries(entries: MemoryEntry[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  public longTerm = {
    query: async (text: string): Promise<string[]> => {
      const entries = this.getStoredEntries();
      const results = entries
        .filter(entry => entry.content.toLowerCase().includes(text.toLowerCase()))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
      
      return results.map(r => r.content);
    },

    store: async (text: string): Promise<void> => {
      const entries = this.getStoredEntries();
      const newEntry: MemoryEntry = {
        id: Date.now(),
        content: text,
        timestamp: Date.now(),
      };
      
      entries.push(newEntry);
      
      // Keep only the last 1000 entries to prevent storage overflow
      if (entries.length > 1000) {
        entries.splice(0, entries.length - 1000);
      }
      
      this.saveEntries(entries);
    }
  };

  public addToShortTerm(content: string): void {
    this.shortTerm.push(content);
    if (this.shortTerm.length > this.maxShortTermSize) {
      this.shortTerm.shift();
    }
  }

  public clearShortTerm(): void {
    this.shortTerm = [];
  }

  public clearLongTerm(): void {
    localStorage.removeItem(this.storageKey);
  }

  public getStats(): { vectorDocuments: number; shortTermMemory: number } {
    const entries = this.getStoredEntries();
    return {
      vectorDocuments: entries.length,
      shortTermMemory: this.shortTerm.length,
    };
  }
}
