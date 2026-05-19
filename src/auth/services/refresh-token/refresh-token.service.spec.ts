import { Container } from 'inversify';
import { TYPES } from '../../../types';
import { ITokenRepository } from '../../repository/token.repository.interface';
import { RefreshTokenUseCase } from '../../use-cases/refresh-token.use-case';
import { IJwtService } from '../jwt/jwt.service.interface';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenCommand } from '../../commands/refresh-token.command';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';
import { UserRole } from '../../../user/entities/user-role.enum';
import { Token } from '../../entities/token.entity';

const JwtServiceMock: IJwtService = {
  generateTokens: jest.fn(),
  generateAccessToken: jest.fn(),
  validateAccessToken: jest.fn(),
  validateRefreshToken: jest.fn(),
};

const TokenRepositoryMock: ITokenRepository = {
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByUserId: jest.fn(),
  findByRefreshToken: jest.fn(),
};

const container = new Container();

let service: RefreshTokenUseCase;

beforeAll(() => {
  container
    .bind<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase)
    .to(RefreshTokenService);

  container.bind<IJwtService>(TYPES.JwtService).toConstantValue(JwtServiceMock);

  container
    .bind<ITokenRepository>(TYPES.TokenRepository)
    .toConstantValue(TokenRepositoryMock);

  service = container.get(TYPES.RefreshTokenUseCase);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('handle', () => {
  it('throws when jwt is invalid', async () => {
    (JwtServiceMock.validateRefreshToken as jest.Mock).mockReturnValueOnce(
      null,
    );

    await expect(
      service.handle(new RefreshTokenCommand('token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws when token not found', async () => {
    (JwtServiceMock.validateRefreshToken as jest.Mock).mockReturnValueOnce({
      userId: '1',
      email: 'a@mail.com',
      role: UserRole.USER,
    });

    (TokenRepositoryMock.findByRefreshToken as jest.Mock).mockResolvedValueOnce(
      null,
    );

    await expect(
      service.handle(new RefreshTokenCommand('token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('returns new token pair', async () => {
    (JwtServiceMock.validateRefreshToken as jest.Mock).mockReturnValueOnce({
      userId: '1',
      email: 'test@mail.com',
      role: UserRole.USER,
    });

    (TokenRepositoryMock.findByRefreshToken as jest.Mock).mockResolvedValueOnce(
      new Token('refresh', '1'),
    );

    (JwtServiceMock.generateTokens as jest.Mock).mockReturnValueOnce({
      accessToken: 'access',
      refreshToken: 'newRefresh',
    });

    const result = await service.handle(new RefreshTokenCommand('refresh'));

    expect(result).toEqual({
      accessToken: 'access',
      refreshToken: 'newRefresh',
    });
  });
});
