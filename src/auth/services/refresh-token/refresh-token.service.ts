import { injectable, inject } from 'inversify';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';
import { TYPES } from '../../../types';
import { RefreshTokenCommand } from '../../commands/refresh-token.command';
import { ITokenRepository } from '../../repository/token.repository.interface';
import { RefreshTokenUseCase } from '../../use-cases/refresh-token.use-case';
import {
  AuthJwtPayload,
  IJwtService,
  ITokens,
} from '../jwt/jwt.service.interface';
import { Token } from '../../entities/token.entity';

@injectable()
export class RefreshTokenService implements RefreshTokenUseCase {
  constructor(
    @inject(TYPES.JwtService)
    private jwtService: IJwtService,

    @inject(TYPES.TokenRepository)
    private tokenRepository: ITokenRepository,
  ) {}

  public async handle(command: RefreshTokenCommand): Promise<ITokens> {
    const payload = this.jwtService.validateRefreshToken(command.refreshToken);

    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const token = await this.tokenRepository.findByRefreshToken(
      command.refreshToken,
    );

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const cleanPayload: AuthJwtPayload = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
    };
    const tokens = this.jwtService.generateTokens(cleanPayload);

    const newToken = new Token(tokens.refreshToken, payload.userId);

    await this.tokenRepository.update(newToken);

    return tokens;
  }
}
