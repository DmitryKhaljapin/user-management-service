import { NewUser } from '../entities/new-user.entity';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: NewUser): Promise<User>;
  save(user: User): Promise<User>;

  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
