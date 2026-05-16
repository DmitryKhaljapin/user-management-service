import {
  Container,
  ContainerModule,
  ContainerModuleLoadOptions,
} from 'inversify';
import { App } from './App';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { IDatabaseService } from './database/database.service.interface';
import { ILogger } from './logger/logger.service.interface';
import { LoggerService } from './logger/logger.service';
import { DatabaseService } from './database/database.service';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export const appBindings = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<App>(TYPES.Application).to(App);

    options.bind<ILogger>(TYPES.LoggerService).to(LoggerService);
    options.bind<IConfigService>(TYPES.ConfigService).to(ConfigService);

    options
      .bind<IDatabaseService>(TYPES.DatabaseService)
      .to(DatabaseService)
      .inSingletonScope();
    options
      .bind<PrismaClient>(TYPES.PrismaClient)
      .toDynamicValue((context) => {
        const configService = context.get<IConfigService>(TYPES.ConfigService);

        const connectionString = configService.get('DB_URI');

        const adapter = new PrismaPg({
          connectionString,
        });

        return new PrismaClient({
          adapter,
        });
      })
      .inSingletonScope();
  },
);

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  await app.init();
}

bootstrap();
