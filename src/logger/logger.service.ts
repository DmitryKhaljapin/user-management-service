import { ILogObj, Logger } from "tslog";
import { ILogger } from "./logger.service.interface";

export class LoggerService implements ILogger {
  private logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger({
      type: "pretty",
      stylePrettyLogs: true,
      hideLogPositionForProduction: true,
    });
  }

  public log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  public error(...args: unknown[]): void {
    this.logger.error(...args);
  }

  public warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
