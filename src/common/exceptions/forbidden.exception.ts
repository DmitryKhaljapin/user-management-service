import { AppException } from './app.exception';

export class ForbiddenException extends AppException {
  constructor(message: string) {
    super(message);

    this.name = 'ForbiddenException';

    // Fix prototype chain because extending built-in Error
    // may break instanceof checks after transpilation
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
