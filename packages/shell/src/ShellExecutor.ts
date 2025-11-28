import { execa, ExecaReturnValue } from 'execa';
import * as os from 'os';
import { parse as parseCommand } from 'shell-quote';

export interface ShellExecutorOptions {
  allowedCommands?: string[];
  timeout?: number;
  cwd?: string;
  env?: Record<string, string>;
}

export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  command: string;
}

export class ShellExecutor {
  private allowedCommands: Set<string>;
  private defaultTimeout: number;

  constructor(options: ShellExecutorOptions = {}) {
    this.allowedCommands = new Set(options.allowedCommands || []);
    this.defaultTimeout = options.timeout || 30000;
  }

  /**
   * Get platform-specific shell
   */
  private getShell(): string {
    const platform = os.platform();
    
    if (platform === 'win32') {
      return process.env.COMSPEC || 'cmd.exe';
    } else if (platform === 'darwin') {
      return process.env.SHELL || '/bin/zsh';
    } else {
      return process.env.SHELL || '/bin/bash';
    }
  }

  /**
   * Validate command against whitelist
   */
  private validateCommand(command: string): void {
    if (this.allowedCommands.size === 0) {
      return; // No restrictions
    }

    const parsed = parseCommand(command);
    const baseCommand = Array.isArray(parsed) && parsed.length > 0 
      ? String(parsed[0]) 
      : command.split(' ')[0];

    if (!this.allowedCommands.has(baseCommand)) {
      throw new Error(`Command not allowed: ${baseCommand}`);
    }
  }

  /**
   * Execute shell command
   */
  async execute(
    command: string,
    args: string[] = [],
    options: Partial<ShellExecutorOptions> = {}
  ): Promise<ShellResult> {
    this.validateCommand(command);

    const shell = this.getShell();
    const timeout = options.timeout || this.defaultTimeout;

    try {
      const result: ExecaReturnValue = await execa(command, args, {
        shell,
        timeout,
        cwd: options.cwd,
        env: options.env,
        reject: false,
      });

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode || 0,
        command: result.command,
      };
    } catch (error: any) {
      throw new Error(`Command execution failed: ${error.message}`);
    }
  }

  /**
   * Execute command and stream output
   */
  async executeStream(
    command: string,
    args: string[] = [],
    onData: (data: string) => void,
    options: Partial<ShellExecutorOptions> = {}
  ): Promise<ShellResult> {
    this.validateCommand(command);

    const shell = this.getShell();
    const timeout = options.timeout || this.defaultTimeout;

    const subprocess = execa(command, args, {
      shell,
      timeout,
      cwd: options.cwd,
      env: options.env,
    });

    let stdout = '';
    let stderr = '';

    subprocess.stdout?.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      onData(text);
    });

    subprocess.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    const result = await subprocess;

    return {
      stdout,
      stderr,
      exitCode: result.exitCode || 0,
      command: result.command,
    };
  }

  /**
   * Add allowed command
   */
  allowCommand(command: string): void {
    this.allowedCommands.add(command);
  }

  /**
   * Remove allowed command
   */
  disallowCommand(command: string): void {
    this.allowedCommands.delete(command);
  }

  /**
   * Get list of allowed commands
   */
  getAllowedCommands(): string[] {
    return Array.from(this.allowedCommands);
  }
}
