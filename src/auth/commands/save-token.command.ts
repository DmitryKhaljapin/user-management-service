export class SaveTokenCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly userId: string,
  ) {}
}
