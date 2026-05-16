import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';

import { DatabaseService } from './database.service';

import { TYPES } from '../types';

import { ILogger } from '../logger/logger.service.interface';
import { IDatabaseService } from './database.service.interface';

const LoggerServiceMock: ILogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const PrismaClientMock = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

const container = new Container();

let databaseService: IDatabaseService;

beforeEach(() => {
  jest.clearAllMocks();

  container.unbindAll();

  container.bind<IDatabaseService>(TYPES.DatabaseService).to(DatabaseService);

  container
    .bind<ILogger>(TYPES.LoggerService)
    .toConstantValue(LoggerServiceMock);

  container
    .bind<PrismaClient>(TYPES.PrismaClient)
    .toConstantValue(PrismaClientMock as unknown as PrismaClient);

  databaseService = container.get<IDatabaseService>(TYPES.DatabaseService);
});

describe('Prisma Service', () => {
  describe('connect', () => {
    it('connects successfully', async () => {
      await databaseService.connect();

      expect(PrismaClientMock.$connect).toHaveBeenCalled();

      expect(LoggerServiceMock.log).toHaveBeenCalledWith(
        '[PrismaService] Connected to the database',
      );
    });

    it('logs error and exits', async () => {
      PrismaClientMock.$connect.mockRejectedValueOnce(new Error('db error'));

      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await databaseService.connect();

      expect(LoggerServiceMock.error).toHaveBeenCalled();

      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  it('disconnects', async () => {
    await databaseService.disconnect();

    expect(PrismaClientMock.$disconnect).toHaveBeenCalled();
  });
});
