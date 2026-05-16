export class ValidationException extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ValidationException';

    // Fix prototype chain because extending built-in Error
    // may break instanceof checks after transpilation
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
