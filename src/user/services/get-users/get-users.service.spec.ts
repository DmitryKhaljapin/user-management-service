import { Container } from 'inversify';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { TYPES } from '../../../types';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repository/user.repository.interface';
import { UserRole } from '../../entities/user-role.enum';
import { UserStatus } from '../../entities/user-status.enum';
import { GetUsersService } from './get-users.service';
import { GetUsersUseCase } from '../../use-cases/get-users.use-case';
import { GetUsersQuery } from '../../queries/get-users.query';

const UserRepositoryMock: IUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

const container = new Container();

let service: GetUsersUseCase;

beforeAll(() => {
  container.bind<GetUsersUseCase>(TYPES.GetUsersUseCase).to(GetUsersService);

  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .toConstantValue(UserRepositoryMock);

  service = container.get<GetUsersUseCase>(TYPES.GetUsersUseCase);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GetUsersService', () => {
  it('throws if user is not admin', async () => {
    await expect(
      service.handle(new GetUsersQuery(UserRole.USER)),
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns users list for admin', async () => {
    const users = [
      new User(
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
      ),
      new User(
        '2',
        'Paul',
        'Smith',
        new Date(),
        'examle@mail.com',
        'hashed',
        UserRole.USER,
        UserStatus.INACTIVE,
        new Date(),
        new Date(),
      ),
    ];

    UserRepositoryMock.findAll = jest.fn().mockResolvedValueOnce(users);

    const result = await service.handle(new GetUsersQuery(UserRole.ADMIN));

    expect(result).toBe(users);
  });
});
