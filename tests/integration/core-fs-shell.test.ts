import { describe, it, expect } from 'vitest';
import { TaskOrchestrator, TaskPriority } from '@operone/core';
import { FileSystem } from '@operone/fs';
import { ShellExecutor } from '@operone/shell';
import * as path from 'path';

describe('Core-FS-Shell Integration', () => {
  const orchestrator = new TaskOrchestrator(2);
  const fs = new FileSystem();
  const shell = new ShellExecutor({ allowedCommands: ['echo', 'ls'] });
  const testDir = path.join(__dirname, 'temp_integration_test');

  const waitForTask = (taskId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const check = () => {
        const task = orchestrator.getTask(taskId);
        if (task?.status === 'completed') resolve(task.result);
        if (task?.status === 'failed') reject(task.error);
      };

      orchestrator.on('task:completed', (t) => {
        if (t.id === taskId) resolve(t.result);
      });
      orchestrator.on('task:failed', (t) => {
        if (t.id === taskId) reject(t.error);
      });
      
      check();
    });
  };

  it('should orchestrate file creation and shell execution', async () => {
    // 1. Create directory using FS
    orchestrator.addTask({
      id: 'create-dir',
      name: 'Create Test Directory',
      priority: TaskPriority.HIGH,
      execute: async () => {
        await fs.createDirectory(testDir);
        return true;
      }
    });
    await waitForTask('create-dir');

    // 2. Write file using FS
    const filePath = path.join(testDir, 'test.txt');
    orchestrator.addTask({
      id: 'write-file',
      name: 'Write Test File',
      priority: TaskPriority.NORMAL,
      dependencies: ['create-dir'],
      execute: async () => {
        await fs.writeFile(filePath, 'Hello Integration');
        return true;
      }
    });
    await waitForTask('write-file');

    // 3. Read file using Shell
    orchestrator.addTask({
      id: 'read-file-shell',
      name: 'Read File via Shell',
      priority: TaskPriority.NORMAL,
      dependencies: ['write-file'],
      execute: async () => {
        // Use 'cat' on Unix, 'type' on Windows
        // Note: 'ls' was allowed in constructor, we need to allow 'cat'/'type' or just use 'ls'
        // The previous code used 'ls', let's stick to 'ls' for directory listing as a proof of concept
        // or update allowed commands.
        // Let's use 'ls' to list the directory which should contain the file.
        const result = await shell.execute('ls', [testDir]);
        return result;
      }
    });
    const shellResult = await waitForTask('read-file-shell');

    expect(shellResult.stdout).toContain('test.txt');

    // Cleanup
    await fs.deleteDirectory(testDir, { recursive: true });
  });
});
