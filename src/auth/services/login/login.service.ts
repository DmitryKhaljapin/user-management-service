import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { LoginCommand } from '../../commands/login.command';
import { IUserRepository } from '../../../user/repository/user.repository.interface';
import { UserStatus } from '../../../user/entities/user-status.enum';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';
import { IJwtService } from '../jwt/jwt.service.interface';
import { SaveTokenUseCase } from '../../user-cases/save-token.use-case';
import { SaveTokenCommand } from '../../commands/save-token.command';
import { LoginUseCase } from '../../user-cases/login.use-case';

@injectable()
export class LoginUserService implements LoginUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private repository: IUserRepository,

    @inject(TYPES.JwtService)
    private jwtService: IJwtService,

    @inject(TYPES.SaveTokenUseCase)
    private saveTokenUseCase: SaveTokenUseCase,
  ) {}

  public async handle(command: LoginCommand): Promise<{ accessToken: string }> {
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
