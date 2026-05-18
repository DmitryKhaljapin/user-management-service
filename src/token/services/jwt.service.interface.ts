import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../../user/entities/user-role.enum';

// TODO: move
export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthJwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface IJwtService {
  generateTokens(payload: JwtPayload): ITokens;

  generateAccessToken(payload: JwtPayload): string;

  validateRefreshToken(refreshToken: string): boolean;
}
