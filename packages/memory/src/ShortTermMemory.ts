import { LRUCache } from 'lru-cache';

export interface ShortTermMemoryOptions {
  maxItems?: number;
  ttl?: number;
}

export class ShortTermMemory<T extends {}> {
  private cache: LRUCache<string, T>;

  constructor(options: ShortTermMemoryOptions = {}) {
    this.cache = new LRUCache({
      max: options.maxItems || 100,
      ttl: options.ttl || 1000 * 60 * 60, // 1 hour default
    });
  }

  set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getAll(): Record<string, T> {
    const result: Record<string, T> = {};
    for (const [key, value] of this.cache.entries()) {
      result[key] = value;
    }
    return result;
  }
}
