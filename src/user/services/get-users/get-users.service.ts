import { injectable, inject } from 'inversify';
import { ForbiddenException } from '../../../common/exceptions/forbidden.exception';
import { TYPES } from '../../../types';
import { User } from '../../entities/user.entity';
import { GetUsersQuery } from '../../queries/get-users.query';
import { IUserRepository } from '../../repository/user.repository.interface';
import { GetUsersQueryUseCase } from '../../use-cases/get-users.use-case';
import { UserRole } from '../../entities/user-role.enum';

@injectable()
export class GetUsersService implements GetUsersQueryUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private repository: IUserRepository,
  ) {}

  public async handle(query: GetUsersQuery): Promise<User[]> {
    if (query.requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can access users list');
    }

    return this.repository.findAll();
  }
}
