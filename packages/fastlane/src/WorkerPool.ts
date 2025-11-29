import Piscina from 'piscina';
import * as path from 'path';

export interface WorkerPoolOptions {
  minThreads?: number;
  maxThreads?: number;
  filename?: string;
}

export class WorkerPool {
  private pool: Piscina;

  constructor(options: WorkerPoolOptions = {}) {
    this.pool = new Piscina({
      filename: options.filename || path.resolve(__dirname, 'worker.js'),
      minThreads: options.minThreads || 1,
      maxThreads: options.maxThreads || 4,
    });
  }

  async runTask(task: any): Promise<any> {
    return this.pool.run(task);
  }

  get stats() {
    return {
      utilization: this.pool.utilization,
      completed: this.pool.completed,
      duration: this.pool.duration,
      runTime: this.pool.runTime,
      waitTime: this.pool.waitTime,
    };
  }
}
