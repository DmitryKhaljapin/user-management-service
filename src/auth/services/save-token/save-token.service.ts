import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { SaveTokenCommand } from '../../commands/save-token.command';
import { Token } from '../../entities/token.entity';
import { ITokenRepository } from '../../repository/token.repository.interface';
import { SaveTokenUseCase } from '../../use-cases/save-token.use-case';

@injectable()
export class SaveTokenService implements SaveTokenUseCase {
  constructor(
    @inject(TYPES.TokenRepository)
    private repository: ITokenRepository,
  ) {}

  public async handle(command: SaveTokenCommand): Promise<void> {
    const existing = await this.repository.findByUserId(command.userId);

    const token = new Token(command.refreshToken, command.userId);

    if (existing) {
      await this.repository.update(token);

      return;
    }

    await this.repository.create(token);
  }
}
