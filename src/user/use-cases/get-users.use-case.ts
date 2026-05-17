import { User } from '../entities/user.entity';
import { GetUsersQuery } from '../queries/get-users.query';

export interface GetUsersQueryUseCase {
  handle(query: GetUsersQuery): Promise<User[]>;
}
