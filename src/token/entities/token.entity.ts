export class Token {
  constructor(
    private _refreshToken: string,
    private _userId?: string,
  ) {}

  get refreshToken(): string {
    return this._refreshToken;
  }

  get userId(): string | undefined {
    return this._userId;
  }
}
