import pino from 'pino';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggerOptions {
  level?: LogLevel;
  name?: string;
  prettyPrint?: boolean;
}

export class Logger {
  private logger: pino.Logger;

  constructor(options: LoggerOptions = {}) {
    this.logger = pino({
      level: options.level || 'info',
      name: options.name || 'operone',
      transport: options.prettyPrint
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
            },
          }
        : undefined,
    });
  }

  trace(message: string, ...args: any[]): void {
    this.logger.trace(message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  error(message: string, error?: Error, ...args: any[]): void {
    if (error) {
      this.logger.error({ err: error }, message, ...args);
    } else {
      this.logger.error(message, ...args);
    }
  }

  fatal(message: string, error?: Error, ...args: any[]): void {
    if (error) {
      this.logger.fatal({ err: error }, message, ...args);
    } else {
      this.logger.fatal(message, ...args);
    }
  }

  child(bindings: Record<string, any>): Logger {
    const childLogger = new Logger();
    childLogger.logger = this.logger.child(bindings);
    return childLogger;
  }
}

// Export singleton instance
export const logger = new Logger({ prettyPrint: process.env.NODE_ENV !== 'production' });
