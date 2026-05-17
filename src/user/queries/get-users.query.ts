import { UserRole } from '../entities/user-role.enum';

export class GetUsersQuery {
  constructor(public readonly requesterRole: UserRole) {}
}
