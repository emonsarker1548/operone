import { EventEmitter } from 'events';

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
export class EventBus implements IEventBus {
  private emitter: EventEmitter;
  private static instance: EventBus;

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50); // Allow more listeners for complex agent systems
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public async publish(topic: string, event: string, payload: any): Promise<void> {
    const fullEventName = `${topic}:${event}`;
    // Emit specific event
    this.emitter.emit(fullEventName, payload);
    // Emit wildcard topic event
    this.emitter.emit(`${topic}:*`, { event, payload });
    
    // Log for debugging (optional, could be connected to a logger)
    // console.debug(`[EventBus] Published ${fullEventName}`);
  }

  public subscribe(topic: string, callback: EventCallback): void {
    // Support wildcard subscriptions handled by the publish logic
    this.emitter.on(topic, callback);
  }

  public unsubscribe(topic: string, callback: EventCallback): void {
    this.emitter.off(topic, callback);
  }
}
