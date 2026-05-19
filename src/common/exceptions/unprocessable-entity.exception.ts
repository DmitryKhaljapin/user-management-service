import { AppException } from './app.exception';

export class UnprocessableEntity extends AppException {
  constructor(message: string) {
    super(message);

    this.name = 'UnprocessableEntity';

    // Fix prototype chain because extending built-in Error
    // may break instanceof checks after transpilation
    Object.setPrototypeOf(this, UnprocessableEntity.prototype);
  }
}
