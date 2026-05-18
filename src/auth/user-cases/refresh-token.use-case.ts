import { RefreshTokenCommand } from '../commands/refresh-token.command';
import { ITokens } from '../services/jwt/jwt.service.interface';

export interface RefreshTokenUseCase {
  handle(command: RefreshTokenCommand): Promise<ITokens>;
}
