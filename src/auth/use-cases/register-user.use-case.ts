import { RegisterUserCommand } from '../commands/register-user.command';
import { User } from '../../user/entities/user.entity';

export interface RegisterUserUseCase {
  handle(command: RegisterUserCommand): Promise<User>;
}
