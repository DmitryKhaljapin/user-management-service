import { User } from '../entities/user.entity';
import { GetUsersQuery } from '../queries/get-users.query';

export interface GetUsersUseCase {
  handle(query: GetUsersQuery): Promise<User[]>;
}
