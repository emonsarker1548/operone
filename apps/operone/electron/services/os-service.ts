import { ipcMain } from 'electron';
import { TaskOrchestrator, TaskPriority } from '@operone/core';
import { FileSystem } from '@operone/fs';
import { ShellExecutor } from '@operone/shell';
import { SystemMonitor, logger } from '@operone/shared';

export class OSService {
  private orchestrator: TaskOrchestrator;
  private fs: FileSystem;
  private shell: ShellExecutor;
  private monitor: SystemMonitor;

  constructor() {
    this.orchestrator = new TaskOrchestrator(5);
    this.fs = new FileSystem();
    this.shell = new ShellExecutor({
      allowedCommands: ['ls', 'echo', 'git', 'npm', 'node', 'python'],
    });
    this.monitor = new SystemMonitor();
    
    this.initializeIPC();
  }

  private initializeIPC() {
    // File System Operations
    ipcMain.handle('os:fs:read', async (_, path: string) => {
      return this.orchestrator.addTask({
        id: `read-${Date.now()}`,
        name: 'Read File',
        priority: TaskPriority.NORMAL,
        execute: () => this.fs.readFile(path),
      }).waitForCompletion();
    });

    ipcMain.handle('os:fs:write', async (_, path: string, content: string) => {
      return this.orchestrator.addTask({
        id: `write-${Date.now()}`,
        name: 'Write File',
        priority: TaskPriority.NORMAL,
        execute: () => this.fs.writeFile(path, content),
      }).waitForCompletion();
    });

    ipcMain.handle('os:fs:list', async (_, path: string) => {
      return this.orchestrator.addTask({
        id: `list-${Date.now()}`,
        name: 'List Directory',
        priority: TaskPriority.NORMAL,
        execute: () => this.fs.listDirectory(path),
      }).waitForCompletion();
    });

    // Shell Operations
    ipcMain.handle('os:shell:execute', async (_, command: string, args: string[]) => {
      return this.orchestrator.addTask({
        id: `exec-${Date.now()}`,
        name: 'Execute Command',
        priority: TaskPriority.HIGH,
        execute: () => this.shell.execute(command, args),
      }).waitForCompletion();
    });

    // System Monitoring
    ipcMain.handle('os:system:metrics', async () => {
      return this.monitor.getMetrics();
    });

    logger.info('OS Service initialized');
  }
}
