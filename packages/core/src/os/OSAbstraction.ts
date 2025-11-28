import * as os from 'os';
import { spawn, ChildProcess, SpawnOptions } from 'child_process';

/**
 * Platform types supported by Operone
 */
export type Platform = 'win32' | 'darwin' | 'linux';

/**
 * OS abstraction layer for cross-platform operations
 */
export class OSAbstraction {
  private platform: Platform;

  constructor() {
    this.platform = os.platform() as Platform;
  }

  /**
   * Get current platform
   */
  getPlatform(): Platform {
    return this.platform;
  }

  /**
   * Check if running on Windows
   */
  isWindows(): boolean {
    return this.platform === 'win32';
  }

  /**
   * Check if running on macOS
   */
  isMacOS(): boolean {
    return this.platform === 'darwin';
  }

  /**
   * Check if running on Linux
   */
  isLinux(): boolean {
    return this.platform === 'linux';
  }

  /**
   * Get number of CPU cores
   */
  getCPUCount(): number {
    return os.cpus().length;
  }

  /**
   * Get total system memory in bytes
   */
  getTotalMemory(): number {
    return os.totalmem();
  }

  /**
   * Get free system memory in bytes
   */
  getFreeMemory(): number {
    return os.freemem();
  }

  /**
   * Get system uptime in seconds
   */
  getUptime(): number {
    return os.uptime();
  }

  /**
   * Get platform-specific temporary directory
   */
  getTempDir(): string {
    return os.tmpdir();
  }

  /**
   * Get platform-specific home directory
   */
  getHomeDir(): string {
    return os.homedir();
  }

  /**
   * Get platform-specific path separator
   */
  getPathSeparator(): string {
    return this.isWindows() ? '\\' : '/';
  }

  /**
   * Get platform-specific shell
   */
  getDefaultShell(): string {
    if (this.isWindows()) {
      return process.env.COMSPEC || 'cmd.exe';
    } else if (this.isMacOS()) {
      return process.env.SHELL || '/bin/zsh';
    } else {
      return process.env.SHELL || '/bin/bash';
    }
  }

  /**
   * Spawn a process with platform-specific handling
   */
  spawnProcess(
    command: string,
    args: string[] = [],
    options: SpawnOptions = {}
  ): ChildProcess {
    const defaultOptions: SpawnOptions = {
      shell: this.getDefaultShell(),
      ...options,
    };

    return spawn(command, args, defaultOptions);
  }

  /**
   * Get system information
   */
  getSystemInfo() {
    return {
      platform: this.platform,
      arch: os.arch(),
      cpus: this.getCPUCount(),
      totalMemory: this.getTotalMemory(),
      freeMemory: this.getFreeMemory(),
      uptime: this.getUptime(),
      hostname: os.hostname(),
      release: os.release(),
      type: os.type(),
    };
  }
}
