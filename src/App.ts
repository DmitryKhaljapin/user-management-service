import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import cors from 'cors';

import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { IDatabaseService } from './database/database.service.interface';
import { ILogger } from './logger/logger.service.interface';

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;
  hostname: string;

  constructor(
    @inject(TYPES.LoggerService) private logger: ILogger,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.DatabaseService) private databaseService: IDatabaseService,
  ) {
    this.app = express();
    this.port = Number(this.configService.get('PORT'));
    this.hostname = this.configService.get('HOST') ?? '127.0.0.1';
  }

  public useMiddleware() {
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: this.configService.get('CLIENT_URL'),

        credentials: true,
      }),
    );
  }

  public async useDatabaseService() {
    await this.databaseService.connect();
  }

  public async init() {
    this.useMiddleware();

    await this.useDatabaseService();

    this.server = this.app.listen(this.port, this.hostname);

    this.logger.log(
      `The server has started on the ${this.hostname}:${this.port}`,
    );
  }
}
