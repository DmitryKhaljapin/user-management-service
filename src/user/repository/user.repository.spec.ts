import { Container } from 'inversify';
import { UserRepository } from './user.repository';
import { TYPES } from '../../types';
import { IUserRepository } from './user.repository.interface';

const prismaMock = {
  userModel: { findUnique: jest.fn() },
};

const container = new Container();

container.bind(TYPES.PrismaClient).toConstantValue(prismaMock as any);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

const repository = container.get<IUserRepository>(TYPES.UserRepository);

describe('UserRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('for getting a user by id ', () => {
    it('returns user', async () => {
      prismaMock.userModel.findUnique.mockResolvedValue({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        middleName: null,
        birthDate: new Date(),
        email: 'john@mail.com',
        password: 'hash',
        role: 'user',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await repository.findById('1');

      expect(prismaMock.userModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });

      expect(result).not.toBeNull();
      expect(result!.id).toBe('1');
    });

    it('returns null if user not found', async () => {
      prismaMock.userModel.findUnique.mockResolvedValue(null);

      const result = await repository.findById('missing');

      expect(result).toBeNull();
    });
  });

  describe('for getting a user by email', () => {
    it('returns a user', async () => {
      prismaMock.userModel.findUnique.mockResolvedValue({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        middleName: null,
        birthDate: new Date(),
        email: 'john@mail.com',
        password: 'hash',
        role: 'user',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await repository.findByEmail('john@mail.com');

      expect(prismaMock.userModel.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@mail.com' },
      });

      expect(result?.email).toBe('john@mail.com');
    });

    it('returns null if user not found', async () => {
      prismaMock.userModel.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('missing');

      expect(result).toBeNull();
    });
  });
});
