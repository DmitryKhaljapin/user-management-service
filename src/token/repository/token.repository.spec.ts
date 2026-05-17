import { Container } from 'inversify';
import { TYPES } from '../../types';
import { ITokenRepository } from './token.repository.interface';
import { TokenRepository } from './token.repository';
import { Token } from '../entities/token.entity';

const prismaMock = {
  tokenModel: { findUnique: jest.fn() },
};

const container = new Container();

container.bind(TYPES.PrismaClient).toConstantValue(prismaMock as any);
container.bind<ITokenRepository>(TYPES.TokenRepository).to(TokenRepository);

const repository = container.get<ITokenRepository>(TYPES.TokenRepository);

afterEach(() => {
  jest.clearAllMocks();
});

describe('TokenRepository', () => {
  describe('findByUserId', () => {
    it('returns token', async () => {
      prismaMock.tokenModel.findUnique.mockResolvedValueOnce({
        refreshToken: 'refresh',
        userId: '1',
      });

      const result = await repository.findByUserId('1');

      expect(result).toBeInstanceOf(Token);

      expect(result?.refreshToken).toBe('refresh');
    });

    it('returns null', async () => {
      prismaMock.tokenModel.findUnique.mockResolvedValueOnce(null);

      const result = await repository.findByUserId('1');

      expect(result).toBeNull();
    });
  });

  describe('findByRefreshToken', () => {
    it('returns token', async () => {
      prismaMock.tokenModel.findUnique.mockResolvedValueOnce({
        refreshToken: 'refresh',
        userId: '1',
      });

      const result = await repository.findByRefreshToken('refresh');

      expect(result).toBeInstanceOf(Token);

      expect(result?.userId).toBe('1');
    });

    it('returns null', async () => {
      prismaMock.tokenModel.findUnique.mockResolvedValueOnce(null);

      const result = await repository.findByRefreshToken('refresh');

      expect(result).toBeNull();
    });
  });
});
