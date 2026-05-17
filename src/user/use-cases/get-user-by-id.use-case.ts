import { User } from '../entities/user.entity';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';

export interface GetUserByIdUseCase {
  handle(query: GetUserByIdQuery): Promise<User>;
}
