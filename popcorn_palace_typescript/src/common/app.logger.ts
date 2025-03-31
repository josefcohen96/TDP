import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  constructor(context: string) {
    super(context);
  }

  log(message: string) {
    if (this.shouldLog('log')) {
      super.log(message);
    }
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      super.debug(message);
    }
  }

  warn(message: string) {
    if (this.shouldLog('warn')) {
      super.warn(message);
    }
  }

  error(message: string, trace?: string) {
    if (this.shouldLog('error')) {
      super.error(message, trace);
    }
  }

  private shouldLog(level: 'log' | 'debug' | 'warn' | 'error'): boolean {
    const logLevel = process.env.LOG_LEVEL || 'log';
    const levels = ['log', 'debug', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(logLevel);
  }
}