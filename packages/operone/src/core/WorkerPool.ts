import { Worker } from 'worker_threads';
import * as path from 'path';
import { EventBus } from './EventBus';

interface WorkerTask {
  id: string;
  type: string;
  payload: any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: WorkerTask[] = [];
  private activeWorkers: Map<number, boolean> = new Map(); // worker index -> busy
  private maxWorkers: number;
  private workerScript: string;
  private eventBus: EventBus;

  constructor(maxWorkers: number = 4, workerScriptPath?: string) {
    this.maxWorkers = maxWorkers;
    this.eventBus = EventBus.getInstance();
    // Default to a worker entry point. In a real app, this needs to point to the compiled JS worker file.
    // For TS execution in dev, we might need a loader or point to the .ts file with ts-node/tsx.
    this.workerScript = workerScriptPath || path.join(__dirname, '../worker/agent-worker.js');
    this.initialize();
  }

  private initialize() {
    for (let i = 0; i < this.maxWorkers; i++) {
      this.spawnWorker(i);
    }
  }

  private spawnWorker(index: number) {
    // In a real production build, ensure this path resolves to the built worker file
    // For now, we'll assume the worker script exists or will be created.
    try {
        const worker = new Worker(this.workerScript, {
            workerData: { workerId: index }
        });

        worker.on('message', (message) => {
            this.handleWorkerMessage(index, message);
        });

        worker.on('error', (err) => {
            console.error(`Worker ${index} error:`, err);
            this.eventBus.publish('system', 'worker:error', { workerId: index, error: err.message });
            // Restart worker?
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker ${index} stopped with exit code ${code}`);
                this.eventBus.publish('system', 'worker:exit', { workerId: index, code });
            }
        });

        this.workers[index] = worker;
        this.activeWorkers.set(index, false);
    } catch (error) {
        console.error('Failed to spawn worker:', error);
    }
  }

  private handleWorkerMessage(workerIndex: number, message: any) {
    // Handle specific message types
    if (message.type === 'task:complete') {
        const { taskId, result } = message;
        // Find task in queue? No, we need to track which task is on which worker.
        // For simplicity, we'll assume a request/response model or use a map of taskId -> promise.
        // But here we are just releasing the worker.
        this.activeWorkers.set(workerIndex, false);
        this.processNextTask();
    }
    
    // Re-emit events from worker to main event bus
    if (message.type === 'event') {
        this.eventBus.publish(message.topic, message.event, message.payload);
    }
  }

  public async executeTask(type: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const task: WorkerTask = {
        id: Math.random().toString(36).substring(7),
        type,
        payload,
        resolve,
        reject
      };

      this.taskQueue.push(task);
      this.processNextTask();
    });
  }

  private processNextTask() {
    if (this.taskQueue.length === 0) return;

    const availableWorkerIndex = this.workers.findIndex((_, i) => !this.activeWorkers.get(i));
    
    if (availableWorkerIndex === -1) return; // No workers available

    const task = this.taskQueue.shift();
    if (!task) return;

    const worker = this.workers[availableWorkerIndex];
    this.activeWorkers.set(availableWorkerIndex, true);

    // TODO: We need a way to map the response back to the promise.
    // For now, we'll just send the task. The worker should reply with task:complete and taskId.
    // We would need a map of pendingTasks.
    
    if (worker) {
        worker.postMessage({
            type: 'task:start',
            taskId: task.id,
            taskType: task.type,
            payload: task.payload
        });
    } else {
        console.error(`Worker at index ${availableWorkerIndex} is undefined`);
        // Put task back? Or fail it? For now, let's just log.
    }
  }
  
  public terminate() {
      this.workers.forEach(w => w.terminate());
  }
}
