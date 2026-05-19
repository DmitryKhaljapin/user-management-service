import { AppException } from './app.exception';

export class NotFoundException extends AppException {
  constructor(message: string) {
    super(message);

    this.name = 'NotFoundException';

    // Fix prototype chain because extending built-in Error
    // may break instanceof checks after transpilation
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
