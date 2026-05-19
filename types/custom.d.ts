import { UserRole } from '../user/entities/user-role.enum';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};
