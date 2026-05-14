import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config.service.interface';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.service.interface';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.LoggerService) private logger: ILogger) {
    const result: DotenvConfigOutput = config({
      path: process.env.ENV_PATH || '.env',
    });

    if (result.error) {
      this.logger.error('[ConfigService] File .env is missing or not valid');
    } else {
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
