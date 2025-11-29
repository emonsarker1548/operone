

export type EventCallback = (payload: any) => void | Promise<void>;

export interface IEventBus {
  publish(topic: string, event: string, payload: any): Promise<void>;
  subscribe(topic: string, callback: EventCallback): void;
  unsubscribe(topic: string, callback: EventCallback): void;
}

/**
 * specific event bus implementation that supports local EventEmitter.
 * Future: Can be extended to support Redis/RabbitMQ.
 */
/**
 * specific event bus implementation that supports local event handling.
 * Browser-compatible replacement for Node.js EventEmitter.
 */
export class EventBus implements IEventBus {
  private listeners: Map<string, Set<EventCallback>>;
  private static instance: EventBus;

  private constructor() {
    this.listeners = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public async publish(topic: string, event: string, payload: any): Promise<void> {
    const fullEventName = `${topic}:${event}`;
    const wildcardEventName = `${topic}:*`;

    // Emit specific event
    this.emit(fullEventName, payload);
    // Emit wildcard topic event
    this.emit(wildcardEventName, { event, payload });
  }

  public subscribe(topic: string, callback: EventCallback): void {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic)!.add(callback);
  }

  public unsubscribe(topic: string, callback: EventCallback): void {
    const topicListeners = this.listeners.get(topic);
    if (topicListeners) {
      topicListeners.delete(callback);
      if (topicListeners.size === 0) {
        this.listeners.delete(topic);
      }
    }
  }

  private emit(eventName: string, payload: any): void {
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          const result = callback(payload);
          if (result instanceof Promise) {
            result.catch(err => console.error(`[EventBus] Error in async handler for ${eventName}:`, err));
          }
        } catch (err) {
          console.error(`[EventBus] Error in handler for ${eventName}:`, err);
        }
      });
    }
  }
}
