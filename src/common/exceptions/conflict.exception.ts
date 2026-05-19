import { AppException } from './app.exception';

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message);

    this.name = 'ConflictException';

    // Fix prototype chain because extending built-in Error
    // may break instanceof checks after transpilation
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}
