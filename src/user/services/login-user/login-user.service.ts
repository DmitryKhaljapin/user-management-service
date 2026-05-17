import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { LoginUserCommand } from '../../commands/login-user.command';
import { IUserRepository } from '../../repository/user.repository.interface';
import { LoginUserUseCase } from '../../use-cases/login-user.use-case';
import { UserStatus } from '../../entities/user-status.enum';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';

@injectable()
export class LoginUserService implements LoginUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private repository: IUserRepository,

    // @inject(TYPES.TokenService)
    // private tokenService: TokenService,
  ) {}

  public async handle(
    command: LoginUserCommand,
  ): Promise<{ accessToken: string }> {
    const user = await this.repository.findByEmail(command.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await user.comparePassword(command.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new ForbiddenException('User is inactive');
    }

    // TODO: Authentication flow (access/refresh tokens, logout, session renewal) will be implemented separately
    // to keep the current focus on core user use-cases.
    const accessToken = '';

    return {
      accessToken,
    };
  }
}
