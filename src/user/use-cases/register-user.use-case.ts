import { RegisterUserCommand } from '../commands/register-user.command';
import { User } from '../entities/user.entity';

export interface RegisterUserUseCase {
  handle(command: RegisterUserCommand): Promise<User>;
}
