import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer';
import { IMiddleware } from './middleware.interface';
import { ValidationException } from '../exceptions/validation.exception';

export class ValidateMiddleware implements IMiddleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(
    { body }: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void> {
    const instance = plainToInstance(this.dto, body);

    const errors = await validate(instance);

    if (errors.length) {
      const messages = errors.flatMap((e) =>
        Object.values(e.constraints ?? {}),
      );

      next(new ValidationException(messages.join(', ')));

      return;
    }

    next();
  }
}
