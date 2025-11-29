# @operone/core

Core OS-level task orchestration and process management for the Operone platform.

## Features

- **OS Abstraction Layer**: Cross-platform utilities for Windows, macOS, and Linux
- **Process Management**: Comprehensive process lifecycle management with event-driven architecture
- **Task Orchestration**: Priority-based task scheduling with dependency resolution
- **Concurrent Execution**: Configurable worker pool with resource limits

## Installation

```bash
pnpm add @operone/core
```

## Usage

### OS Abstraction

```typescript
import { OSAbstraction } from '@operone/core';

const os = new OSAbstraction();

// Platform detection
console.log(os.getPlatform()); // 'win32' | 'darwin' | 'linux'
console.log(os.isWindows()); // true/false

// System information
const sysInfo = os.getSystemInfo();
console.log(sysInfo.cpus); // Number of CPU cores
console.log(sysInfo.totalMemory); // Total RAM in bytes

// Process spawning
const process = os.spawnProcess('echo', ['Hello, World!']);
```

### Process Management

```typescript
import { ProcessManager } from '@operone/core';

const pm = new ProcessManager();

// Spawn a process
const processInfo = await pm.spawn('my-process', 'node', ['script.js']);

// Listen to events
pm.on('process:started', (info) => {
  console.log(`Process ${info.id} started with PID ${info.pid}`);
});

pm.on('process:completed', (info) => {
  console.log(`Process ${info.id} completed with code ${info.exitCode}`);
});

// Wait for completion
await pm.waitFor('my-process');

// Kill a process
await pm.kill('my-process', 'SIGTERM');
```

### Task Orchestration

```typescript
import { TaskOrchestrator, TaskPriority } from '@operone/core';

const orchestrator = new TaskOrchestrator(5); // Max 5 concurrent tasks

// Add tasks
orchestrator.addTask({
  id: 'task1',
  name: 'Download File',
  priority: TaskPriority.HIGH,
  execute: async () => {
    // Task implementation
    return 'result';
  },
});

// Add task with dependencies
orchestrator.addTask({
  id: 'task2',
  name: 'Process File',
  priority: TaskPriority.NORMAL,
  dependencies: ['task1'], // Wait for task1 to complete
  execute: async () => {
    // Task implementation
  },
});

// Wait for all tasks
await orchestrator.waitForAll();

// Get statistics
const stats = orchestrator.getStats();
console.log(`Completed: ${stats.completed}, Failed: ${stats.failed}`);
```

## API Reference

### OSAbstraction

- `getPlatform()`: Get current platform
- `isWindows()`, `isMacOS()`, `isLinux()`: Platform checks
- `getCPUCount()`: Get number of CPU cores
- `getTotalMemory()`, `getFreeMemory()`: Memory information
- `getSystemInfo()`: Complete system information
- `spawnProcess(command, args, options)`: Spawn a child process

### ProcessManager

- `spawn(id, command, args, options)`: Spawn a new process
- `kill(id, signal)`: Kill a running process
- `getProcess(id)`: Get process information
- `getAllProcesses()`: Get all processes
- `getRunningProcesses()`: Get only running processes
- `waitFor(id, timeout)`: Wait for process completion
- `killAll(signal)`: Kill all running processes

### TaskOrchestrator

- `addTask(task)`: Add a task to the orchestrator
- `cancelTask(taskId)`: Cancel a queued task
- `getTask(taskId)`: Get task by ID
- `getAllTasks()`: Get all tasks
- `getTasksByStatus(status)`: Filter tasks by status
- `waitForAll(timeout)`: Wait for all tasks to complete
- `getStats()`: Get orchestrator statistics

## Events

### ProcessManager Events

- `process:started`: Process has started
- `process:completed`: Process completed successfully
- `process:failed`: Process failed
- `process:killed`: Process was killed
- `process:error`: Process error occurred

### TaskOrchestrator Events

- `task:added`: Task was added
- `task:queued`: Task was queued for execution
- `task:started`: Task execution started
- `task:completed`: Task completed successfully
- `task:failed`: Task failed
- `task:cancelled`: Task was cancelled

## Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## License

MIT
