import { describe, it, expect, beforeEach } from 'vitest';
import { ShellTool } from './ShellTool';

describe('ShellTool', () => {
  let shellTool: ShellTool;

  beforeEach(() => {
    shellTool = new ShellTool();
  });

  describe('allowed commands', () => {
    it('should execute ls command', async () => {
      const result = await shellTool.execute({
        command: 'ls',
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBeDefined();
    });

    it('should execute pwd command', async () => {
      const result = await shellTool.execute({
        command: 'pwd',
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBeTruthy();
    });

    it('should execute echo command', async () => {
      const result = await shellTool.execute({
        command: 'echo "Hello World"',
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe('Hello World');
    });

    it('should execute git command', async () => {
      const result = await shellTool.execute({
        command: 'git --version',
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('git version');
    });

    it('should execute node command', async () => {
      const result = await shellTool.execute({
        command: 'node --version',
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toMatch(/^v\d+\.\d+\.\d+/);
    });
  });

  describe('blocked commands', () => {
    it('should block rm -rf command', async () => {
      await expect(
        shellTool.execute({
          command: 'rm -rf /tmp/test',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should block sudo command', async () => {
      await expect(
        shellTool.execute({
          command: 'sudo ls',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should block chmod command', async () => {
      await expect(
        shellTool.execute({
          command: 'chmod 777 file.txt',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should block chown command', async () => {
      await expect(
        shellTool.execute({
          command: 'chown user:group file.txt',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should block device file writes', async () => {
      await expect(
        shellTool.execute({
          command: 'echo test > /dev/null',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should block pipe to shell', async () => {
      await expect(
        shellTool.execute({
          command: 'echo "malicious" | sh',
        })
      ).rejects.toThrow('Command not allowed');
    });
  });

  describe('command execution', () => {
    it('should capture stdout', async () => {
      const result = await shellTool.execute({
        command: 'echo "test output"',
      });

      expect(result.stdout).toBe('test output');
      expect(result.stderr).toBe('');
      expect(result.exitCode).toBe(0);
    });

    it('should capture stderr on error', async () => {
      const result = await shellTool.execute({
        command: 'ls /non-existent-directory-12345',
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toBeTruthy();
    });

    it('should respect working directory', async () => {
      const result = await shellTool.execute({
        command: 'pwd',
        cwd: '/tmp',
      });

      expect(result.stdout).toContain('/tmp');
    });

    it('should handle timeout', async () => {
      // Create a custom tool with sleep allowed for this test
      const customTool = new ShellTool(['sleep']);
      
      const startTime = Date.now();
      const result = await customTool.execute({
        command: 'sleep 2',
        timeout: 500, // 500ms timeout for 2-second sleep
      });
      const duration = Date.now() - startTime;

      // Should timeout and return error
      expect(result.exitCode).not.toBe(0);
      expect(duration).toBeLessThan(1000); // Should timeout before 1 second
      expect(result.stderr).toBeTruthy(); // Should have error message
    }, 10000);
  });

  describe('security', () => {
    it('should only allow whitelisted commands', async () => {
      await expect(
        shellTool.execute({
          command: 'malicious-command',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should block commands with full paths not in whitelist', async () => {
      await expect(
        shellTool.execute({
          command: '/usr/bin/malicious',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should allow commands with arguments', async () => {
      const result = await shellTool.execute({
        command: 'echo "arg1" "arg2"',
      });

      expect(result.exitCode).toBe(0);
    });
  });

  describe('custom allowed commands', () => {
    it('should respect custom allowed commands', async () => {
      const customTool = new ShellTool(['echo', 'pwd']);

      const result = await customTool.execute({
        command: 'echo "test"',
      });

      expect(result.exitCode).toBe(0);

      await expect(
        customTool.execute({
          command: 'ls',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should provide list of allowed commands', () => {
      const commands = shellTool.getAllowedCommands();

      expect(commands).toContain('ls');
      expect(commands).toContain('pwd');
      expect(commands).toContain('echo');
      expect(commands).toContain('git');
    });
  });

  describe('error handling', () => {
    it('should handle command not found', async () => {
      // Unknown commands are blocked by security, so this will throw
      await expect(
        shellTool.execute({
          command: 'nonexistentcommand12345',
        })
      ).rejects.toThrow('Command not allowed');
    });

    it('should handle empty command', async () => {
      await expect(
        shellTool.execute({
          command: '',
        })
      ).rejects.toThrow('Command not allowed');
    });
  });
});
