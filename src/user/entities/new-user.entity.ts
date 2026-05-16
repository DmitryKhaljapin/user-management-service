import bcrypt from 'bcryptjs';

import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';
import { ValidationException } from '../../common/exceptions/validation.exception';

export class NewUser {
  private _firstName: string;
  private _lastName: string;
  private _middleName?: string;

  private _birthDate: Date;

  private _email: string;

  private _passwordHash: string;

  private _role: UserRole;

  private _status: UserStatus;

  constructor(
    firstName: string,
    lastName: string,
    birthDate: Date,
    email: string,
    middleName?: string,
    role: UserRole = UserRole.USER,
  ) {
    this.validateBirthDate(birthDate);

    this._firstName = firstName;
    this._lastName = lastName;
    this._middleName = middleName;

    this._birthDate = birthDate;

    this._email = email;

    this._role = role;

    this._status = UserStatus.PENDING;

    this._passwordHash = '';
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

  get role(): UserRole {
    return this._role;
  }

  get status(): UserStatus {
    return this._status;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  private validateBirthDate(date: Date): void {
    if (!(date instanceof Date)) {
      throw new ValidationException('Invalid birth date');
    }

    if (isNaN(date.getTime())) {
      throw new ValidationException('Invalid birth date');
    }

    if (date > new Date()) {
      throw new ValidationException('Birth date cannot be in the future');
    }
  }

  async setPassword(password: string, salt: number): Promise<void> {
    this._passwordHash = await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this._passwordHash);
  }

  public getFullName(): string {
    return [this._lastName, this._firstName, this._middleName]
      .filter(Boolean)
      .join(' ');
  }
}
