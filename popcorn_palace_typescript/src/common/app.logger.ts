import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  constructor(context: string) {
    super(context);
  }

  private formatMessage(message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${message}`;
  }

  override log(message: string) {
    super.log(this.formatMessage(message));
  }

  override debug(message: string) {
    super.debug(this.formatMessage(message));
  }

  override warn(message: string) {
    super.warn(this.formatMessage(message));
  }

  override error(message: string, trace?: string) {
    super.error(this.formatMessage(message), trace);
  }
}
