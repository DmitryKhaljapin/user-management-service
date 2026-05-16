import { inject, injectable } from 'inversify';
import { PrismaClient, UserModel } from '@prisma/client';
import { TYPES } from '../../types';
import { NewUser } from '../entities/new-user.entity';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';
import { UserRole } from '../entities/user-role.enum';
import { UserStatus } from '../entities/user-status.enum';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.PrismaClient)
    private prisma: PrismaClient,
  ) {}

  private toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.firstName,
      model.lastName,
      model.birthDate,
      model.email,
      model.password,
      model.role as UserRole,
      model.status as UserStatus,
      model.createdAt,
      model.updatedAt,
      model.middleName ?? undefined,
    );
  }

  public async create(user: NewUser): Promise<User> {
    const created = await this.prisma.userModel.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        birthDate: user.birthDate,
        email: user.email,
        password: user.passwordHash,
        role: user.role,
        status: user.status,
      },
    });

    return this.toDomain(created);
  }

  public async findById(id: string): Promise<User | null> {
    const model = await this.prisma.userModel.findUnique({
      where: { id },
    });

    if (!model) return null;

    return this.toDomain(model);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const model = await this.prisma.userModel.findUnique({
      where: { email },
    });

    if (!model) return null;

    return this.toDomain(model);
  }

  public async findAll(): Promise<User[]> {
    const models = await this.prisma.userModel.findMany();

    return models.map((model) => this.toDomain(model));
  }
  public async save(user: User): Promise<User> {
    const updated = await this.prisma.userModel.update({
      where: { id: user.id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        birthDate: user.birthDate,
        email: user.email,
        password: user.passwordHash,
        role: user.role,
        status: user.status,
      },
    });

    return this.toDomain(updated);
  }
}
