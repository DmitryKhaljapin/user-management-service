import { NextFunction, Request, Response, Router } from 'express';

export interface IAuthController {
  router: Router;
  registerUser(req: Request, res: Response, next: NextFunction): Promise<void>;

  loginUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  logoutUser(req: Request, res: Response, next: NextFunction): Promise<void>;

  refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}
