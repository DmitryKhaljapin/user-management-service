import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { LoginUserCommand } from '../../commands/login-user.command';
import { IUserRepository } from '../../repository/user.repository.interface';
import { LoginUserUseCase } from '../../use-cases/login-user.use-case';
import { UserStatus } from '../../entities/user-status.enum';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';
import { IJwtService } from '../../../auth/services/jwt/jwt.service.interface';
import { SaveTokenUseCase } from '../../../auth/user-cases/save-token.use-case';
import { SaveTokenCommand } from '../../../auth/commands/save-token.command';

@injectable()
export class LoginUserService implements LoginUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private repository: IUserRepository,

    @inject(TYPES.JwtService)
    private jwtService: IJwtService,

    @inject(TYPES.SaveTokenUseCase)
    private saveTokenUseCase: SaveTokenUseCase,
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

    const tokens = this.jwtService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await this.saveTokenUseCase.handle(
      new SaveTokenCommand(tokens.refreshToken, user.id),
    );

    return tokens;
  }
}
