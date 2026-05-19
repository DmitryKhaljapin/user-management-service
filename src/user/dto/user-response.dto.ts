import { UserRole } from '../entities/user-role.enum';
import { UserStatus } from '../entities/user-status.enum';

export class UserResponseDto {
  id: string;

  firstName: string;

  middleName?: string;

  lastName: string;

  birthDate: Date;

  email: string;

  role: UserRole;

  status: UserStatus;
}
