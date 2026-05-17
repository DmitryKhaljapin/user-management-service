import { compare } from 'bcryptjs';

import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

export class User {
  constructor(
    private _id: string,

    private _firstName: string,

    private _lastName: string,

    private _birthDate: Date,

    private _email: string,

    private _passwordHash: string,

    private _role: UserRole,

    private _status: UserStatus,

    private _createdAt: Date,

    private _updatedAt: Date,

    private _middleName?: string,
  ) {}

  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get middleName(): string | undefined {
    return this._middleName;
  }

  get birthDate(): Date {
    return this._birthDate;
  }

  get email(): string {
    return this._email;
  }

  public get passwordHash(): string {
    return this._passwordHash;
  }

  get role(): UserRole {
    return this._role;
  }

  get status(): UserStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public getFullName(): string {
    return [this._lastName, this._firstName, this._middleName]
      .filter(Boolean)
      .join(' ');
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this._passwordHash);
  }

  public block(): void {
    this._status = UserStatus.INACTIVE;
  }
}
