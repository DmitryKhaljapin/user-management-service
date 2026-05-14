import { Container } from 'inversify';
import { config } from 'dotenv';

import { TYPES } from '../types';

import { ILogger } from '../logger/logger.service.interface';
import { IConfigService } from './config.service.interface';
import { ConfigService } from './config.service';

jest.mock('dotenv');

const LoggerServiceMock: ILogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('Config Service', () => {
  let container: Container;

  beforeEach(() => {
    jest.clearAllMocks();

    container = new Container();

    container.bind<IConfigService>(TYPES.ConfigService).to(ConfigService);

    container
      .bind<ILogger>(TYPES.LoggerService)
      .toConstantValue(LoggerServiceMock);
  });

  describe('get', () => {
    it('returns env variable', () => {
      (config as jest.Mock).mockReturnValueOnce({
        parsed: {
          JWT_SECRET: 'secret123',
        },
      });

      const configService = container.get<IConfigService>(TYPES.ConfigService);

      expect(configService.get('JWT_SECRET')).toBe('secret123');
    });

    it('logs error if dotenv failed', () => {
      (config as jest.Mock).mockReturnValueOnce({
        error: new Error(),
      });

      container.get(TYPES.ConfigService);

      expect(LoggerServiceMock.error).toHaveBeenCalledWith(
        '[ConfigService] File .env is missing or not valid',
      );
    });
  });
});
