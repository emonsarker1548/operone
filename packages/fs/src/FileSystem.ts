import * as fs from 'fs-extra';
import * as path from 'path';
import chokidar from 'chokidar';
import { EventEmitter } from 'events';

export interface FileWatchOptions {
  persistent?: boolean;
  ignoreInitial?: boolean;
  usePolling?: boolean;
  interval?: number;
}

export class FileSystem extends EventEmitter {
  /**
   * Normalize path for current platform
   */
  normalizePath(filePath: string): string {
    return path.normalize(filePath);
  }

  /**
   * Check if file or directory exists
   */
  async exists(filePath: string): Promise<boolean> {
    return fs.pathExists(filePath);
  }

  /**
   * Read file content
   */
  async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    return fs.readFile(filePath, encoding);
  }

  /**
   * Write file content
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    return fs.writeFile(filePath, content);
  }

  /**
   * Append to file
   */
  async appendFile(filePath: string, content: string): Promise<void> {
    return fs.appendFile(filePath, content);
  }

  /**
   * Delete file
   */
  async deleteFile(filePath: string): Promise<void> {
    return fs.remove(filePath);
  }

  /**
   * Create directory
   */
  async createDirectory(dirPath: string): Promise<void> {
    return fs.ensureDir(dirPath);
  }

  /**
   * Delete directory
   */
  async deleteDirectory(dirPath: string, options?: { recursive?: boolean }): Promise<void> {
    if (options?.recursive) {
      return fs.remove(dirPath);
    }
    return fs.rmdir(dirPath);
  }

  /**
   * List directory contents
   */
  async listDirectory(dirPath: string): Promise<string[]> {
    return fs.readdir(dirPath);
  }

  /**
   * Get file stats
   */
  async getStats(filePath: string): Promise<fs.Stats> {
    return fs.stat(filePath);
  }

  /**
   * Copy file or directory
   */
  async copy(src: string, dest: string): Promise<void> {
    return fs.copy(src, dest);
  }

  /**
   * Move file or directory
   */
  async move(src: string, dest: string): Promise<void> {
    return fs.move(src, dest);
  }

  /**
   * Watch directory for changes
   */
  watchDirectory(
    dirPath: string,
    callback: (event: string, path: string) => void,
    options?: FileWatchOptions
  ): chokidar.FSWatcher {
    const defaultOptions: FileWatchOptions = {
      persistent: true,
      ignoreInitial: true,
      usePolling: process.platform === 'win32',
      interval: 100,
      ...options,
    };

    const watcher = chokidar.watch(dirPath, defaultOptions);
    watcher.on('all', callback);
    return watcher;
  }

  /**
   * Find files matching pattern
   */
  async findFiles(pattern: string, options?: { cwd?: string }): Promise<string[]> {
    const { glob } = await import('glob');
    return glob(pattern, options);
  }
}
