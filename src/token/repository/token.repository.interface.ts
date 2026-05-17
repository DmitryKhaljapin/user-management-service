import { Token } from '../entities/token.entity';

export interface ITokenRepository {
  create(token: Token): Promise<void>;

  update(token: Token): Promise<void>;

  remove(token: Token): Promise<void>;

  findByUserId(userId: string): Promise<Token | null>;

  findByRefreshToken(refreshToken: string): Promise<Token | null>;
}
