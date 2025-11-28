import { Graph } from 'graphlib';

export interface TaskNode {
  id: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
}

export class DependencyGraph {
  private graph: Graph;

  constructor() {
    this.graph = new Graph({ directed: true });
  }

  addTask(task: TaskNode): void {
    this.graph.setNode(task.id, task);
  }

  addDependency(from: string, to: string): void {
    this.graph.setEdge(from, to);
  }

  getExecutionOrder(): string[] {
    const order = require('graphlib').alg.topsort(this.graph);
    return order;
  }

  getTask(id: string): TaskNode {
    return this.graph.node(id);
  }
}
