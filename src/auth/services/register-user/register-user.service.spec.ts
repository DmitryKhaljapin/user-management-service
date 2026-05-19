import { Container } from 'inversify';
import { ConflictException } from '../../../common/exceptions/conflict.exception';
import { IConfigService } from '../../../config/config.service.interface';
import { TYPES } from '../../../types';
import { RegisterUserCommand } from '../../commands/register-user.command';
import { NewUser } from '../../../user/entities/new-user.entity';
import { IUserRepository } from '../../../user/repository/user.repository.interface';
import { RegisterUserService } from './register-user.service';
import { RegisterUserUseCase } from '../../use-cases/register-user.use-case';

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

const container = new Container();

container
  .bind<RegisterUserUseCase>(TYPES.RegisterUserUseCase)
  .to(RegisterUserService);

container
  .bind<IConfigService>(TYPES.ConfigService)
  .toConstantValue(ConfigServiceMock);

container
  .bind<IUserRepository>(TYPES.UserRepository)
  .toConstantValue(UserRepositoryMock);

const service = container.get<RegisterUserUseCase>(TYPES.RegisterUserUseCase);

describe('RegisterUserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('throws if user exists', async () => {
      UserRepositoryMock.findByEmail = jest
        .fn()
        .mockResolvedValueOnce({ id: '1' });

      const command = new RegisterUserCommand(
        'John',
        'Doe',
        new Date(),
        'test@mail.com',
        '12345',
      );

      await expect(service.handle(command)).rejects.toThrow(ConflictException);
    });

    it('registers a new user', async () => {
      UserRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(null);

      ConfigServiceMock.get = jest.fn().mockReturnValueOnce('10');

      jest.spyOn(NewUser.prototype, 'setPassword').mockResolvedValue();

      UserRepositoryMock.create = jest
        .fn()
        .mockImplementation(async (user) => ({ ...user, id: '1' }));

      const command = new RegisterUserCommand(
        'John',
        'Doe',
        new Date('2000-01-01'),
        'test@mail.com',
        '12345',
      );

      await service.handle(command);

      expect(NewUser.prototype.setPassword).toHaveBeenCalledWith('12345', 10);
      expect(UserRepositoryMock.create).toHaveBeenCalled();
    });
  });
});
