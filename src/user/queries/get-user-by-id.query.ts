import { UserRole } from '../entities/user-role.enum';

export class GetUserByIdQuery {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: UserRole,
    public readonly targetUserId: string,
  ) {}
}
