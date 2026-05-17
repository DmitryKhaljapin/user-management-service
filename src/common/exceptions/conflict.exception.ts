export class ConflictException extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ConflictException';

    // Fix prototype chain because extending built-in Error
    // may break instanceof checks after transpilation
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}
