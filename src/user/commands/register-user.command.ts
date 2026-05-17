export class RegisterUserCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly birthDate: Date,
    public readonly email: string,
    public readonly password: string,
    public readonly middleName?: string,
  ) {}
}
