import { Container } from 'inversify';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { TYPES } from '../../../types';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repository/user.repository.interface';
import { BlockUserUseCase } from '../../use-cases/block-user.use-case';
import { BlockUserService } from './block-user.service';
import { BlockUserCommand } from '../../commands/block-user.command';
import { UserRole } from '../../entities/user-role.enum';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { UserStatus } from '../../entities/user-status.enum';

const UserRepositoryMock: IUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

const container = new Container();

let service: BlockUserUseCase;

beforeAll(() => {
  container.bind<BlockUserUseCase>(TYPES.BlockUserUseCase).to(BlockUserService);

  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .toConstantValue(UserRepositoryMock);

  service = container.get<BlockUserUseCase>(TYPES.BlockUserUseCase);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GetUsersService', () => {
  describe('throws', () => {
    it('if user not found', async () => {
      UserRepositoryMock.findById = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.handle(new BlockUserCommand('1', UserRole.ADMIN, '2')),
      ).rejects.toThrow(NotFoundException);
    });

    it('if not admin and not self', async () => {
      UserRepositoryMock.findById = jest
        .fn()
        .mockResolvedValueOnce(
          new User(
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
          ),
        );

      await expect(
        service.handle(new BlockUserCommand('1', UserRole.USER, '2')),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  it('allows user to block himself', async () => {
    const user = new User(
      '1',
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

    UserRepositoryMock.findById = jest.fn().mockResolvedValueOnce(user);

    await service.handle(new BlockUserCommand('1', UserRole.USER, '1'));

    expect(UserRepositoryMock.save).toHaveBeenCalled();
    expect(user.status).toBe(UserStatus.INACTIVE);
  });
});
