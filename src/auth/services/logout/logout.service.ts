import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { LogoutCommand } from '../../commands/logout.command';
import { ITokenRepository } from '../../repository/token.repository.interface';
import { LogoutUseCase } from '../../user-cases/logout.use-case';

@injectable()
export class LogoutService implements LogoutUseCase {
  constructor(
    @inject(TYPES.TokenRepository)
    private repository: ITokenRepository,
  ) {}

  public async handle(command: LogoutCommand): Promise<void> {
    const token = await this.repository.findByRefreshToken(
      command.refreshToken,
    );

    if (!token) {
      return;
    }

    await this.repository.remove(token);
  }
}
