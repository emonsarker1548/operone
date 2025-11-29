import { EventEmitter } from 'events';
import { ProcessManager } from '../os/ProcessManager';

/**
 * Task priority levels
 */
export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

/**
 * Task status
 */
export enum TaskStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Task definition
 */
export interface Task {
  id: string;
  name: string;
  priority: TaskPriority;
  status: TaskStatus;
  dependencies?: string[];
  execute: () => Promise<any>;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  result?: any;
  error?: Error;
}

/**
 * Task orchestrator for managing task execution
 */
export class TaskOrchestrator extends EventEmitter {
  private tasks: Map<string, Task>;
  private queue: Task[];
  private running: Set<string>;
  private maxConcurrent: number;
  private processManager: ProcessManager;

  constructor(maxConcurrent: number = 5) {
    super();
    this.tasks = new Map();
    this.queue = [];
    this.running = new Set();
    this.maxConcurrent = maxConcurrent;
    this.processManager = new ProcessManager();
  }

  /**
   * Add a task to the orchestrator
   */
  addTask(task: Omit<Task, 'status' | 'createdAt'>): Task {
    const fullTask: Task = {
      ...task,
      status: TaskStatus.PENDING,
      createdAt: Date.now(),
    };

    this.tasks.set(task.id, fullTask);
    this.emit('task:added', fullTask);

    // Check if dependencies are met
    if (this.areDependenciesMet(fullTask)) {
      this.queueTask(fullTask);
    }

    return fullTask;
  }

  /**
   * Queue a task for execution
   */
  private queueTask(task: Task): void {
    task.status = TaskStatus.QUEUED;
    
    // Insert task in priority order
    const index = this.queue.findIndex((t) => t.priority < task.priority);
    if (index === -1) {
      this.queue.push(task);
    } else {
      this.queue.splice(index, 0, task);
    }

    this.emit('task:queued', task);
    this.processQueue();
  }

  /**
   * Check if task dependencies are met
   */
  private areDependenciesMet(task: Task): boolean {
    if (!task.dependencies || task.dependencies.length === 0) {
      return true;
    }

    return task.dependencies.every((depId) => {
      const dep = this.tasks.get(depId);
      return dep?.status === TaskStatus.COMPLETED;
    });
  }

  /**
   * Process the task queue
   */
  private async processQueue(): Promise<void> {
    while (
      this.queue.length > 0 &&
      this.running.size < this.maxConcurrent
    ) {
      const task = this.queue.shift();
      if (!task) break;

      this.executeTask(task);
    }
  }

  /**
   * Execute a task
   */
  private async executeTask(task: Task): Promise<void> {
    task.status = TaskStatus.RUNNING;
    task.startedAt = Date.now();
    this.running.add(task.id);

    this.emit('task:started', task);

    try {
      const result = await task.execute();
      
      task.status = TaskStatus.COMPLETED;
      task.completedAt = Date.now();
      task.result = result;

      this.emit('task:completed', task);

      // Check if any waiting tasks can now run
      this.checkWaitingTasks(task.id);
    } catch (error) {
      task.status = TaskStatus.FAILED;
      task.completedAt = Date.now();
      task.error = error as Error;

      this.emit('task:failed', task);
    } finally {
      this.running.delete(task.id);
      this.processQueue();
    }
  }

  /**
   * Check if any tasks are waiting for this task
   */
  private checkWaitingTasks(completedTaskId: string): void {
    for (const task of this.tasks.values()) {
      if (
        task.status === TaskStatus.PENDING &&
        task.dependencies?.includes(completedTaskId) &&
        this.areDependenciesMet(task)
      ) {
        this.queueTask(task);
      }
    }
  }

  /**
   * Cancel a task
   */
  cancelTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.status === TaskStatus.RUNNING) {
      throw new Error(`Cannot cancel running task ${taskId}`);
    }

    task.status = TaskStatus.CANCELLED;
    
    // Remove from queue if present
    const index = this.queue.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }

    this.emit('task:cancelled', task);
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.getAllTasks().filter((t) => t.status === status);
  }

  /**
   * Wait for all tasks to complete
   */
  async waitForAll(timeout?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const check = () => {
        if (this.running.size === 0 && this.queue.length === 0) {
          cleanup();
          resolve();
        }
      };

      const onTaskCompleted = () => check();
      const onTaskFailed = () => check();

      const cleanup = () => {
        this.off('task:completed', onTaskCompleted);
        this.off('task:failed', onTaskFailed);
        if (timer) clearTimeout(timer);
      };

      this.on('task:completed', onTaskCompleted);
      this.on('task:failed', onTaskFailed);

      let timer: NodeJS.Timeout | undefined;
      if (timeout) {
        timer = setTimeout(() => {
          cleanup();
          reject(new Error(`Timeout waiting for tasks after ${timeout}ms`));
        }, timeout);
      }

      check();
    });
  }

  /**
   * Get orchestrator statistics
   */
  getStats() {
    return {
      total: this.tasks.size,
      pending: this.getTasksByStatus(TaskStatus.PENDING).length,
      queued: this.queue.length,
      running: this.running.size,
      completed: this.getTasksByStatus(TaskStatus.COMPLETED).length,
      failed: this.getTasksByStatus(TaskStatus.FAILED).length,
      cancelled: this.getTasksByStatus(TaskStatus.CANCELLED).length,
      maxConcurrent: this.maxConcurrent,
    };
  }
}
