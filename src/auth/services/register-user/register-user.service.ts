import { injectable, inject } from 'inversify';
import { IConfigService } from '../../../config/config.service.interface';
import { TYPES } from '../../../types';
import { RegisterUserCommand } from '../../commands/register-user.command';
import { NewUser } from '../../../user/entities/new-user.entity';
import { User } from '../../../user/entities/user.entity';
import { IUserRepository } from '../../../user/repository/user.repository.interface';
import { ConflictException } from '../../../common/exceptions/conflict.exception';
import { RegisterUserUseCase } from '../../use-cases/register-user.use-case';

@injectable()
export class RegisterUserService implements RegisterUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private repository: IUserRepository,

    @inject(TYPES.ConfigService)
    private config: IConfigService,
  ) {}

  public async handle(command: RegisterUserCommand): Promise<User> {
    const existingUser = await this.repository.findByEmail(command.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = new NewUser(
      command.firstName,
      command.lastName,
      command.birthDate,
      command.email,
      command.middleName,
    );

    await user.setPassword(command.password, Number(this.config.get('SALT')));

    return this.repository.create(user);
  }
}
