import { UserRole } from '../entities/user-role.enum';

export class BlockUserCommand {
  constructor(
    public readonly requesterId: string,
    public readonly requesterRole: UserRole,
    public readonly targetUserId: string,
  ) {}
}
