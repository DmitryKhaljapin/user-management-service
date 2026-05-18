import { sign, verify } from 'jsonwebtoken';
import { injectable, inject } from 'inversify';

import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { AuthJwtPayload, IJwtService, ITokens } from './jwt.service.interface';

@injectable()
export class JwtService implements IJwtService {
  constructor(
    @inject(TYPES.ConfigService)
    private configService: IConfigService,
  ) {}

  public generateTokens(payload: AuthJwtPayload): ITokens {
    return {
      accessToken: sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {
        algorithm: 'HS256',
        expiresIn: '15m',
      }),

      refreshToken: sign(
        payload,
        this.configService.get('JWT_REFRESH_SECRET'),
        {
          algorithm: 'HS256',
          expiresIn: '1d',
        },
      ),
    };
  }

  public generateAccessToken(payload: AuthJwtPayload): string {
    return sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {
      algorithm: 'HS256',
      expiresIn: '15m',
    });
  }

  public validateRefreshToken(refreshToken: string): boolean {
    try {
      verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET'));

      return true;
    } catch {
      return false;
    }
  }
}
