import { Container } from 'inversify';

import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { TYPES } from '../../../types';

import { User } from '../../../user/entities/user.entity';
import { IUserRepository } from '../../../user/repository/user.repository.interface';

import { LoginUserService } from './login.service';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';
import { UserRole } from '../../../user/entities/user-role.enum';
import { UserStatus } from '../../../user/entities/user-status.enum';
import { LoginUseCase } from '../../user-cases/login.use-case';
import { LoginCommand } from '../../commands/login.command';
import { SaveTokenUseCase } from '../../user-cases/save-token.use-case';
import { IJwtService } from '../jwt/jwt.service.interface';

const UserRepositoryMock: IUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

const JwtServiceMock: IJwtService = {
  generateTokens: jest.fn(),
  generateAccessToken: jest.fn(),
  validateRefreshToken: jest.fn(),
};

const SaveTokenUseCaseMock = {
  handle: jest.fn(),
};

const container = new Container();

let service: LoginUseCase;

const user = new User(
  '1',
  'John',
  'Doe',
  new Date(),
  'test@mail.com',
  'hashed',
  UserRole.USER,
  UserStatus.INACTIVE,
  new Date(),
  new Date(),
);

beforeAll(() => {
  container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUserService);

  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .toConstantValue(UserRepositoryMock);

  container
    .bind<SaveTokenUseCase>(TYPES.SaveTokenUseCase)
    .toConstantValue(SaveTokenUseCaseMock);

  container.bind<IJwtService>(TYPES.JwtService).toConstantValue(JwtServiceMock);

  service = container.get<LoginUseCase>(TYPES.LoginUseCase);
});

describe('LoginUserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('throws if user does not exist', async () => {
      UserRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.handle(new LoginCommand('test@mail.com', '12345')),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws if password is invalid', async () => {
      UserRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(user);

      jest
        .spyOn(User.prototype, 'comparePassword')
        .mockResolvedValueOnce(false);

      await expect(
        service.handle(new LoginCommand('test@mail.com', 'wrong')),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws if user inactive', async () => {
      UserRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(user);

      jest.spyOn(User.prototype, 'comparePassword').mockResolvedValueOnce(true);

      await expect(
        service.handle(new LoginCommand('test@mail.com', '12345')),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns tokens', async () => {
      const activeUser = new User(
        '1',
        'John',
        'Doe',
        new Date(),
        'test@mail.com',
        'hashed',
        UserRole.USER,
        UserStatus.ACTIVE,
        new Date(),
        new Date(),
      );

      UserRepositoryMock.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(activeUser);

      jest.spyOn(activeUser, 'comparePassword').mockResolvedValueOnce(true);

      (JwtServiceMock.generateTokens as jest.Mock).mockReturnValueOnce({
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      const tokens = await service.handle(
        new LoginCommand('test@mail.com', 'password'),
      );

      expect(tokens).toEqual({
        accessToken: 'access',
        refreshToken: 'refresh',
      });
    });
  });
});
