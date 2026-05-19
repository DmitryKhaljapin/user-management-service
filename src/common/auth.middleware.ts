import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IJwtService } from '../auth/services/jwt/jwt.service.interface';
import { TYPES } from '../types';
import { IMiddleware } from './middleware.interface';

@injectable()
export class AuthMiddleware implements IMiddleware {
  constructor(
    @inject(TYPES.JwtService)
    private jwtService: IJwtService,
  ) {}

  execute(req: Request, res: Response, next: NextFunction): void {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        message: 'Unauthorized',
      });

      return;
    }

    const [, token] = authorization.split(' ');

    const payload = this.jwtService.validateAccessToken(token);

    if (!payload) {
      res.status(401).json({
        message: 'Invalid token',
      });

      return;
    }

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  }
}
