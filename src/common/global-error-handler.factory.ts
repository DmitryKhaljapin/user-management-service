import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../logger/logger.service.interface';
import { AppException } from './exceptions/app.exception';
import { ConflictException } from './exceptions/conflict.exception';
import { ForbiddenException } from './exceptions/forbidden.exception';
import { NotFoundException } from './exceptions/not-found.exception';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { ValidationException } from './exceptions/validation.exception';

export const createGlobalErrorHandler = (logger: ILogger) => {
  return (err: Error, _: Request, res: Response, __: NextFunction) => {
    if (!(err instanceof AppException)) {
      logger.error(err.message, err);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }

    if (err instanceof NotFoundException) {
      return res.status(404).json({
        message: err.message,
      });
    }

    if (err instanceof ConflictException) {
      return res.status(409).json({
        message: err.message,
      });
    }

    if (err instanceof ForbiddenException) {
      return res.status(403).json({
        message: err.message,
      });
    }

    if (err instanceof UnauthorizedException) {
      return res.status(401).json({
        message: err.message,
      });
    }

    if (err instanceof ValidationException) {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  };
};
