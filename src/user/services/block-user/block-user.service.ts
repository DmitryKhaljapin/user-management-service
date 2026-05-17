import { injectable, inject } from 'inversify';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { TYPES } from '../../../types';
import { BlockUserCommand } from '../../commands/block-user.command';
import { IUserRepository } from '../../repository/user.repository.interface';
import { BlockUserUseCase } from '../../use-cases/block-user.use-case';
import { UserRole } from '../../entities/user-role.enum';

@injectable()
export class BlockUserService implements BlockUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private repository: IUserRepository,
  ) {}

  public async handle(command: BlockUserCommand): Promise<void> {
    const { requesterId, requesterRole, targetUserId } = command;

    const user = await this.repository.findById(targetUserId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = requesterRole === UserRole.ADMIN;
    const isSelf = requesterId === targetUserId;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException('Access denied');
    }

    user.block();

    await this.repository.save(user);
  }
}
