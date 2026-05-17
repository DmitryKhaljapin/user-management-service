export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'UnauthorizedException';

    // Fix prototype chain because extending built-in Error
    // may break instanceof checks after transpilation
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}
