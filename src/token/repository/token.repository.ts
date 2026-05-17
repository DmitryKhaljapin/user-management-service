import { PrismaClient, TokenModel } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { Token } from '../entities/token.entity';
import { ITokenRepository } from './token.repository.interface';

@injectable()
export class TokenRepository implements ITokenRepository {
  constructor(
    @inject(TYPES.PrismaClient)
    private prisma: PrismaClient,
  ) {}

  private toDomain(model: TokenModel): Token {
    return new Token(model.refreshToken, model.userId);
  }

  public async create(token: Token): Promise<void> {
    await this.prisma.tokenModel.create({
      data: {
        refreshToken: token.refreshToken,
        userId: token.userId!,
      },
    });
  }

  public async update(token: Token): Promise<void> {
    await this.prisma.tokenModel.update({
      where: {
        userId: token.userId!,
      },

      data: {
        refreshToken: token.refreshToken,
      },
    });
  }

  public async remove(token: Token): Promise<void> {
    await this.prisma.tokenModel.delete({
      where: {
        refreshToken: token.refreshToken,
      },
    });
  }

  public async findByUserId(userId: string): Promise<Token | null> {
    const model = await this.prisma.tokenModel.findUnique({
      where: {
        userId,
      },
    });

    if (!model) {
      return null;
    }

    return this.toDomain(model);
  }

  public async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    const model = await this.prisma.tokenModel.findUnique({
      where: {
        refreshToken,
      },
    });

    if (!model) {
      return null;
    }

    return this.toDomain(model);
  }
}
