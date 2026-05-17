import { injectable, inject } from 'inversify';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { TYPES } from '../../../types';
import { User } from '../../entities/user.entity';
import { GetUserByIdQuery } from '../../queries/get-user-by-id.query';
import { IUserRepository } from '../../repository/user.repository.interface';
import { GetUserByIdUseCase } from '../../use-cases/get-user-by-id.use-case';
import { UserRole } from '../../entities/user-role.enum';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';

@injectable()
export class GetUserByIdService implements GetUserByIdUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private repository: IUserRepository,
  ) {}

  public async handle(query: GetUserByIdQuery): Promise<User> {
    const { requesterId, requesterRole, targetUserId } = query;

    const user = await this.repository.findById(targetUserId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = requesterRole === UserRole.ADMIN;
    const isSelf = requesterId === targetUserId;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException('Access denied');
    }

    return user;
  }
}
