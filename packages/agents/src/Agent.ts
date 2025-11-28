import { EventEmitter } from 'events';
import { ShortTermMemory, LongTermMemory } from '@operone/memory';
import { DependencyGraph } from '@operone/thinking';
import { AIOrchestrator } from '@operone/ai';
import { ContextManager } from '@operone/context';

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  memoryPath?: string;
  modelConfig?: any;
}

export abstract class Agent extends EventEmitter {
  protected shortTermMemory: ShortTermMemory<any>;
  protected longTermMemory: LongTermMemory;
  protected planner: DependencyGraph;
  protected ai: AIOrchestrator;
  protected context: ContextManager;

  constructor(public config: AgentConfig) {
    super();
    this.shortTermMemory = new ShortTermMemory();
    this.longTermMemory = new LongTermMemory(config.memoryPath || ':memory:');
    this.planner = new DependencyGraph();
    this.ai = new AIOrchestrator(config.modelConfig || { path: 'default' });
    this.context = new ContextManager();
  }

  abstract run(task: string): Promise<any>;
  
  async stop(): Promise<void> {
    this.emit('stopped');
  }
}
