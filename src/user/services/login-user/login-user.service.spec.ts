import { Container } from 'inversify';

import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { TYPES } from '../../../types';
import { LoginUserCommand } from '../../commands/login-user.command';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repository/user.repository.interface';
import { LoginUserUseCase } from '../../use-cases/login-user.use-case';
import { LoginUserService } from './login-user.service';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';
import { UserRole } from '../../entities/user-role.enum';
import { UserStatus } from '../../entities/user-status.enum';

const UserRepositoryMock: IUserRepository = {
  create: jest.fn(),

  save: jest.fn(),

  findByEmail: jest.fn(),

  findById: jest.fn(),

  findAll: jest.fn(),
};

const container = new Container();

let service: LoginUserUseCase;

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
  container.bind<LoginUserUseCase>(TYPES.LoginUserUseCase).to(LoginUserService);

  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .toConstantValue(UserRepositoryMock);

  service = container.get<LoginUserUseCase>(TYPES.LoginUserUseCase);
});

describe('LoginUserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('throws if user does not exist', async () => {
      UserRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.handle(new LoginUserCommand('test@mail.com', '12345')),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws if password is invalid', async () => {
      UserRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(user);

      jest
        .spyOn(User.prototype, 'comparePassword')
        .mockResolvedValueOnce(false);

      await expect(
        service.handle(new LoginUserCommand('test@mail.com', 'wrong')),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws if user inactive', async () => {
      UserRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(user);

      jest.spyOn(User.prototype, 'comparePassword').mockResolvedValueOnce(true);

      await expect(
        service.handle(new LoginUserCommand('test@mail.com', '12345')),
      ).rejects.toThrow(ForbiddenException);
    });

    // TODO: Extend this test after implementing token flow:
    // verify access/refresh token generation and refresh token persistence.
    it('returns access token', async () => {
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

      jest.spyOn(User.prototype, 'comparePassword').mockResolvedValueOnce(true);

      const result = await service.handle(
        new LoginUserCommand('test@mail.com', '12345'),
      );

      expect(result).toEqual({
        accessToken: '',
      });
    });
  });
});
