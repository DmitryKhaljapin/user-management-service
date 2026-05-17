import { Container } from 'inversify';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { TYPES } from '../../../types';
import { User } from '../../entities/user.entity';
import { GetUserByIdQuery } from '../../queries/get-user-by-id.query';
import { IUserRepository } from '../../repository/user.repository.interface';
import { GetUserByIdService } from './get-user-by-id.service';
import { GetUserByIdUseCase } from '../../use-cases/get-user-by-id.use-case';
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

let service: GetUserByIdUseCase;

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
  container
    .bind<GetUserByIdUseCase>(TYPES.GetUserByIdUseCase)
    .to(GetUserByIdService);

  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .toConstantValue(UserRepositoryMock);

  service = container.get<GetUserByIdUseCase>(TYPES.GetUserByIdUseCase);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GetUserByIdService', () => {
  describe('throws', () => {
    it('if a user not found', async () => {
      UserRepositoryMock.findById = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.handle(new GetUserByIdQuery('1', UserRole.USER, '2')),
      ).rejects.toThrow(NotFoundException);
    });

    it('if a user is not admin and not self', async () => {
      UserRepositoryMock.findById = jest.fn().mockResolvedValueOnce(user);

      await expect(
        service.handle(new GetUserByIdQuery('1', UserRole.USER, '2')),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('allows', () => {
    it('a user to get himself', async () => {
      UserRepositoryMock.findById = jest.fn().mockResolvedValueOnce(user);

      const result = await service.handle(
        new GetUserByIdQuery('1', UserRole.USER, '1'),
      );

      expect(result).toBe(user);
    });

    it('the admin to get any user', async () => {
      const admin = new User(
        '2',
        'John',
        'Doe',
        new Date(),
        'test@mail.com',
        'hash',
        UserRole.USER,
        UserStatus.ACTIVE,
        new Date(),
        new Date(),
      );

      UserRepositoryMock.findById = jest.fn().mockResolvedValueOnce(admin);

      const result = await service.handle(
        new GetUserByIdQuery('1', UserRole.ADMIN, '2'),
      );

      expect(result).toBe(admin);
    });
  });
});
