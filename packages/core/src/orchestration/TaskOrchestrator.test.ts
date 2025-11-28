import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  TaskOrchestrator,
  TaskPriority,
  TaskStatus,
} from '../orchestration/TaskOrchestrator';

describe('TaskOrchestrator', () => {
  let orchestrator: TaskOrchestrator;

  beforeEach(() => {
    orchestrator = new TaskOrchestrator(2); // Max 2 concurrent tasks
  });

  describe('Task Addition', () => {
    it('should add a task', () => {
      const task = orchestrator.addTask({
        id: 'task1',
        name: 'Test Task',
        priority: TaskPriority.NORMAL,
        execute: async () => 'result',
      });

      expect(task.id).toBe('task1');
      expect(task.status).toBe(TaskStatus.QUEUED);
      expect(task.createdAt).toBeDefined();
    });

    it('should add multiple tasks', () => {
      orchestrator.addTask({
        id: 'task1',
        name: 'Task 1',
        priority: TaskPriority.NORMAL,
        execute: async () => 'result1',
      });

      orchestrator.addTask({
        id: 'task2',
        name: 'Task 2',
        priority: TaskPriority.HIGH,
        execute: async () => 'result2',
      });

      const stats = orchestrator.getStats();
      expect(stats.total).toBe(2);
    });
  });

  describe('Task Priority', () => {
    it('should execute high priority tasks first', async () => {
      const executionOrder: string[] = [];

      orchestrator.addTask({
        id: 'low',
        name: 'Low Priority',
        priority: TaskPriority.LOW,
        execute: async () => {
          executionOrder.push('low');
          await new Promise((resolve) => setTimeout(resolve, 10));
        },
      });

      orchestrator.addTask({
        id: 'high',
        name: 'High Priority',
        priority: TaskPriority.HIGH,
        execute: async () => {
          executionOrder.push('high');
          await new Promise((resolve) => setTimeout(resolve, 10));
        },
      });

      orchestrator.addTask({
        id: 'critical',
        name: 'Critical Priority',
        priority: TaskPriority.CRITICAL,
        execute: async () => {
          executionOrder.push('critical');
          await new Promise((resolve) => setTimeout(resolve, 10));
        },
      });

      await orchestrator.waitForAll(1000);

      // Critical should execute first, then high, then low
      expect(executionOrder[0]).toBe('critical');
      expect(executionOrder[1]).toBe('high');
    });
  });

  describe('Task Dependencies', () => {
    it('should wait for dependencies before executing', async () => {
      const executionOrder: string[] = [];

      orchestrator.addTask({
        id: 'task1',
        name: 'Task 1',
        priority: TaskPriority.NORMAL,
        execute: async () => {
          executionOrder.push('task1');
          await new Promise((resolve) => setTimeout(resolve, 50));
        },
      });

      orchestrator.addTask({
        id: 'task2',
        name: 'Task 2',
        priority: TaskPriority.NORMAL,
        dependencies: ['task1'],
        execute: async () => {
          executionOrder.push('task2');
        },
      });

      await orchestrator.waitForAll(1000);

      expect(executionOrder).toEqual(['task1', 'task2']);
    });

    it('should handle multiple dependencies', async () => {
      const executionOrder: string[] = [];

      orchestrator.addTask({
        id: 'dep1',
        name: 'Dependency 1',
        priority: TaskPriority.NORMAL,
        execute: async () => {
          executionOrder.push('dep1');
          await new Promise((resolve) => setTimeout(resolve, 20));
        },
      });

      orchestrator.addTask({
        id: 'dep2',
        name: 'Dependency 2',
        priority: TaskPriority.NORMAL,
        execute: async () => {
          executionOrder.push('dep2');
          await new Promise((resolve) => setTimeout(resolve, 20));
        },
      });

      orchestrator.addTask({
        id: 'main',
        name: 'Main Task',
        priority: TaskPriority.NORMAL,
        dependencies: ['dep1', 'dep2'],
        execute: async () => {
          executionOrder.push('main');
        },
      });

      await orchestrator.waitForAll(1000);

      expect(executionOrder).toContain('dep1');
      expect(executionOrder).toContain('dep2');
      expect(executionOrder[2]).toBe('main');
    });
  });

  describe('Task Execution', () => {
    it('should execute task and store result', async () => {
      orchestrator.addTask({
        id: 'task1',
        name: 'Test Task',
        priority: TaskPriority.NORMAL,
        execute: async () => 'test result',
      });

      await orchestrator.waitForAll(1000);

      const task = orchestrator.getTask('task1');
      expect(task?.status).toBe(TaskStatus.COMPLETED);
      expect(task?.result).toBe('test result');
      expect(task?.completedAt).toBeDefined();
    });

    it('should handle task errors', async () => {
      orchestrator.addTask({
        id: 'failing-task',
        name: 'Failing Task',
        priority: TaskPriority.NORMAL,
        execute: async () => {
          throw new Error('Task failed');
        },
      });

      await orchestrator.waitForAll(1000);

      const task = orchestrator.getTask('failing-task');
      expect(task?.status).toBe(TaskStatus.FAILED);
      expect(task?.error).toBeDefined();
      expect(task?.error?.message).toBe('Task failed');
    });
  });

  describe('Concurrent Execution', () => {
    it('should respect max concurrent limit', async () => {
      let runningCount = 0;
      let maxRunning = 0;

      const createTask = (id: string) =>
        orchestrator.addTask({
          id,
          name: `Task ${id}`,
          priority: TaskPriority.NORMAL,
          execute: async () => {
            runningCount++;
            maxRunning = Math.max(maxRunning, runningCount);
            await new Promise((resolve) => setTimeout(resolve, 50));
            runningCount--;
          },
        });

      // Add 5 tasks with max concurrent of 2
      for (let i = 0; i < 5; i++) {
        createTask(`task${i}`);
      }

      await orchestrator.waitForAll(1000);

      expect(maxRunning).toBeLessThanOrEqual(2);
    });
  });

  describe('Task Cancellation', () => {
    it('should cancel a queued task', () => {
      orchestrator.addTask({
        id: 'task1',
        name: 'Task 1',
        priority: TaskPriority.NORMAL,
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
        },
      });

      const task2 = orchestrator.addTask({
        id: 'task2',
        name: 'Task 2',
        priority: TaskPriority.NORMAL,
        dependencies: ['task1'],
        execute: async () => 'result',
      });

      orchestrator.cancelTask('task2');

      const task = orchestrator.getTask('task2');
      expect(task?.status).toBe(TaskStatus.CANCELLED);
    });
  });

  describe('Statistics', () => {
    it('should provide accurate statistics', async () => {
      orchestrator.addTask({
        id: 'task1',
        name: 'Task 1',
        priority: TaskPriority.NORMAL,
        execute: async () => 'result',
      });

      orchestrator.addTask({
        id: 'task2',
        name: 'Task 2',
        priority: TaskPriority.NORMAL,
        execute: async () => {
          throw new Error('Failed');
        },
      });

      await orchestrator.waitForAll(1000);

      const stats = orchestrator.getStats();
      expect(stats.total).toBe(2);
      expect(stats.completed).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.maxConcurrent).toBe(2);
    });
  });

  describe('Events', () => {
    it('should emit task events', async () => {
      const events: string[] = [];

      orchestrator.on('task:added', () => events.push('added'));
      orchestrator.on('task:queued', () => events.push('queued'));
      orchestrator.on('task:started', () => events.push('started'));
      orchestrator.on('task:completed', () => events.push('completed'));

      orchestrator.addTask({
        id: 'task1',
        name: 'Test Task',
        priority: TaskPriority.NORMAL,
        execute: async () => 'result',
      });

      await orchestrator.waitForAll(1000);

      expect(events).toContain('added');
      expect(events).toContain('queued');
      expect(events).toContain('started');
      expect(events).toContain('completed');
    });
  });
});
