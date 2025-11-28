import { ChildProcess, SpawnOptions } from 'child_process';
import { EventEmitter } from 'events';
import { OSAbstraction } from './OSAbstraction';

/**
 * Process status
 */
export enum ProcessStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  KILLED = 'killed',
}

/**
 * Process information
 */
export interface ProcessInfo {
  id: string;
  pid?: number;
  command: string;
  args: string[];
  status: ProcessStatus;
  startTime?: number;
  endTime?: number;
  exitCode?: number;
  signal?: string;
}

/**
 * Process manager for lifecycle management
 */
export class ProcessManager extends EventEmitter {
  private processes: Map<string, ProcessInfo>;
  private childProcesses: Map<string, ChildProcess>;
  private osAbstraction: OSAbstraction;

  constructor() {
    super();
    this.processes = new Map();
    this.childProcesses = new Map();
    this.osAbstraction = new OSAbstraction();
  }

  /**
   * Spawn a new process
   */
  async spawn(
    id: string,
    command: string,
    args: string[] = [],
    options: SpawnOptions = {}
  ): Promise<ProcessInfo> {
    if (this.processes.has(id)) {
      throw new Error(`Process with id ${id} already exists`);
    }

    const processInfo: ProcessInfo = {
      id,
      command,
      args,
      status: ProcessStatus.PENDING,
    };

    this.processes.set(id, processInfo);

    try {
      const childProcess = this.osAbstraction.spawnProcess(
        command,
        args,
        options
      );

      this.childProcesses.set(id, childProcess);

      processInfo.pid = childProcess.pid;
      processInfo.status = ProcessStatus.RUNNING;
      processInfo.startTime = Date.now();

      this.emit('process:started', processInfo);

      // Handle process exit
      childProcess.on('exit', (code, signal) => {
        processInfo.endTime = Date.now();
        processInfo.exitCode = code ?? undefined;
        processInfo.signal = signal ?? undefined;

        if (code === 0) {
          processInfo.status = ProcessStatus.COMPLETED;
          this.emit('process:completed', processInfo);
        } else {
          processInfo.status = ProcessStatus.FAILED;
          this.emit('process:failed', processInfo);
        }

        this.childProcesses.delete(id);
      });

      // Handle errors
      childProcess.on('error', (error) => {
        processInfo.status = ProcessStatus.FAILED;
        processInfo.endTime = Date.now();
        this.emit('process:error', { processInfo, error });
        this.childProcesses.delete(id);
      });

      return processInfo;
    } catch (error) {
      processInfo.status = ProcessStatus.FAILED;
      this.emit('process:error', { processInfo, error });
      throw error;
    }
  }

  /**
   * Kill a running process
   */
  async kill(id: string, signal: NodeJS.Signals = 'SIGTERM'): Promise<void> {
    const processInfo = this.processes.get(id);
    if (!processInfo) {
      throw new Error(`Process ${id} not found`);
    }

    const childProcess = this.childProcesses.get(id);
    if (!childProcess) {
      throw new Error(`Process ${id} is not running`);
    }

    return new Promise((resolve, reject) => {
      childProcess.once('exit', () => {
        processInfo.status = ProcessStatus.KILLED;
        processInfo.endTime = Date.now();
        this.emit('process:killed', processInfo);
        resolve();
      });

      const killed = childProcess.kill(signal);
      if (!killed) {
        reject(new Error(`Failed to kill process ${id}`));
      }
    });
  }

  /**
   * Get process information
   */
  getProcess(id: string): ProcessInfo | undefined {
    return this.processes.get(id);
  }

  /**
   * Get all processes
   */
  getAllProcesses(): ProcessInfo[] {
    return Array.from(this.processes.values());
  }

  /**
   * Get running processes
   */
  getRunningProcesses(): ProcessInfo[] {
    return this.getAllProcesses().filter(
      (p) => p.status === ProcessStatus.RUNNING
    );
  }

  /**
   * Check if process is running
   */
  isRunning(id: string): boolean {
    const processInfo = this.processes.get(id);
    return processInfo?.status === ProcessStatus.RUNNING;
  }

  /**
   * Wait for process to complete
   */
  async waitFor(id: string, timeout?: number): Promise<ProcessInfo> {
    const processInfo = this.processes.get(id);
    if (!processInfo) {
      throw new Error(`Process ${id} not found`);
    }

    if (
      processInfo.status === ProcessStatus.COMPLETED ||
      processInfo.status === ProcessStatus.FAILED ||
      processInfo.status === ProcessStatus.KILLED
    ) {
      return processInfo;
    }

    return new Promise((resolve, reject) => {
      const onComplete = (info: ProcessInfo) => {
        if (info.id === id) {
          cleanup();
          resolve(info);
        }
      };

      const onFailed = (info: ProcessInfo) => {
        if (info.id === id) {
          cleanup();
          reject(new Error(`Process ${id} failed`));
        }
      };

      const cleanup = () => {
        this.off('process:completed', onComplete);
        this.off('process:failed', onFailed);
        if (timer) clearTimeout(timer);
      };

      this.on('process:completed', onComplete);
      this.on('process:failed', onFailed);

      let timer: NodeJS.Timeout | undefined;
      if (timeout) {
        timer = setTimeout(() => {
          cleanup();
          reject(new Error(`Process ${id} timed out after ${timeout}ms`));
        }, timeout);
      }
    });
  }

  /**
   * Cleanup completed processes
   */
  cleanup(): void {
    const toDelete: string[] = [];
    
    for (const [id, info] of this.processes.entries()) {
      if (
        info.status === ProcessStatus.COMPLETED ||
        info.status === ProcessStatus.FAILED ||
        info.status === ProcessStatus.KILLED
      ) {
        toDelete.push(id);
      }
    }

    toDelete.forEach((id) => this.processes.delete(id));
  }

  /**
   * Kill all running processes
   */
  async killAll(signal: NodeJS.Signals = 'SIGTERM'): Promise<void> {
    const running = this.getRunningProcesses();
    await Promise.all(running.map((p) => this.kill(p.id, signal)));
  }
}
